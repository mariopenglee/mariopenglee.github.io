---
title: adeline-v2: a fine-tuned MoE for agent context compaction
date: 2026-10-31
summary: condense.chat's adeline-v2 compaction model removes about 88% of the tokens it compacts and keeps 80% of critical facts on unseen repos, vs about 70% for the base model at about the same compression.
---

Here's a made-up but pretty typical case. A coding agent is a couple of hours
into a flaky test. It has ruled out the database, tried two fixes that didn't
work, and finally noticed the failure only shows up when two workers share a
cache directory. Then its context fills up, compaction fires, and the summary
says something like "investigating flaky test in the worker module", so the
agent goes back to checking the database.

That's the failure we care about at [condense.chat](https://condense.chat/),
where a compaction model rewrites the old part of an agent's context so the
agent can keep going (the within-session flip side of the
[memory work](#/blog/infinite-context-agents-wip-london) I did before). We've
been working on the next version of ours, adeline-v2, in the dark for the
last couple of weeks, and as chief scientist I led it end to end. On sessions
from repos it has never seen, it removes about 88% of the tokens it compacts
and still keeps 80% of the critical facts the agent relies on later. The
base model keeps about 70% at about the same compression.

## compaction as a bottleneck

Once compaction starts, everything the agent knows about its own past goes
through the compactor, so my intuition is that the compactor puts a ceiling
on the whole session. Satish et al.,
[Beyond Token Savings](https://arxiv.org/abs/2609.32961) (2026), have
evidence for two parts of that. On
[SWE-bench Verified](https://www.swebench.com/), raising the compaction
trigger from 10K to 20K tokens cut compactions per attempt from 4.85 to 1.15
and lifted resolve rate from 50.7% to 62.7%, which suggests each compaction
costs something (a higher trigger also leaves more raw context, so it's not
a perfectly clean test). And in a separate setup, using a 9B model as the
summarizer instead of the agent's own model dropped resolve from 53.3% to
37.3%. It's 25 tasks, the trigger effect didn't show up for every agent
model, and the 9B gap mostly closes when they combine truncation with the
summary, but my read is that the compactor's quality is a real bottleneck.

[[demo:compactor-funnel]]

[CliffCompaction](https://arxiv.org/abs/2609.26779) (Nguyen, Cho, Chen and
Dettmers, 2026) found LLM summaries doing worse than verbatim cutting of long
tool outputs at the same budget (on Terminal-Bench, with one agent and
model). The authors' explanation is that after a summary the model assumes it
has everything and stops revisiting past state, which sounds a lot like our
agent checking the database again, since it has no way to know what it
forgot. [ACON](https://arxiv.org/abs/2510.00615) (Kang et al., 2025) sees
accuracy fall when compression fires too often, and
[Cursor](https://cursor.com/blog/self-summarization) reports that training
their model to summarize itself halved compaction error compared to a
heavily tuned prompt (their own numbers, for self-summarization), so my guess
is a trained compactor has real room over a prompted one.

## summarization as comprehension

Coming from linguistics, this part feels pretty familiar. Kintsch and van
Dijk's
[model of text comprehension](https://doi.org/10.1037/0033-295X.85.5.363)
(1978) describes reading as building a macrostructure out of the text by
deleting what doesn't matter, generalizing, and replacing sequences of
details with what they jointly imply, and the same operations produce a
summary. My intuition is that this holds for models too: you can't summarize
something you didn't understand, and the summary is where the understanding
shows.

Models seem to have a related problem with long inputs.
[NoLiMa](https://arxiv.org/abs/2502.05167) (Modarressi et al., ICML 2025)
shows most models falling below half their short-context score at 32K once
the fact they're looking for isn't a literal match, and
[Wan et al.](https://arxiv.org/abs/2410.23609) (NAACL 2025) find summaries
neglect the middle of long inputs. Spotting that the cache directory is the
key fact, hours and thousands of tool lines deep, is to me more a
comprehension problem than a writing one. So we didn't treat adeline-v2 as
just a summarizer: the target is a summary that shows the session was
understood, meaning what's been tried, what's settled and what's still open.

## model and training

adeline-v2 is a low-rank adaptation (LoRA) on an open-weights
mixture-of-experts base, trained for this one job. The inputs are long agent
sessions, public ones plus sessions from design partners who explicitly
agreed to share them (no other customer data), replayed through our
compaction pipeline, so each training example is what the model sees at that
point in a session. Each compaction works from the original messages, so
there are no summaries of summaries to learn. Training uses the same chat
template and system prompt the model is served with, loss only on the
output, and one session per training sequence.

On data size, [LIMA](https://arxiv.org/abs/2305.11206) (1,000 examples) and
[LIMO](https://arxiv.org/abs/2502.03387) (817) suggest a narrow skill doesn't
need a huge set if the examples are good. We still checked before building
more. Across nested 25%, 50% and 100% subsets, validation loss went 0.553,
0.532, 0.513, about 0.02 better per doubling, while within the largest run it
flattened after about 1.7 epochs. So we built more data and kept epochs low.

## evaluation

For each compaction point an LLM labels what the agent actually uses from
the compacted part later in the session and marks the critical items, then a
blind LLM judge (it doesn't know which model wrote the summary) checks
whether each one survived. The eval set uses one session per repo, with no
session, task or repo overlap with training. The first held-out set we built
turned out to overlap through one data source, so we rebuilt it from
scratch.

| | base | adeline-v2 | delta [95% CI] |
|---|---|---|---|
| critical facts kept | 0.698 | 0.804 | +0.106 [0.075, 0.133] |
| tokens removed | 88.5% | 87.7% | -0.8 points |
| critical facts kept, FP4 | 0.673 | 0.802 | +0.129 [0.085, 0.167] |

Both take a median span of about 16.8k tokens down to about 2k (1.8k for the
base, 2.0k for adeline-v2), so this is at basically the same compression,
and about a third fewer critical facts get lost. We also checked both models
quantized to FP4. The base probably loses a couple of points there, while
adeline-v2 barely moves (0.804 to 0.802), so the fine-tune seems to be more
robust to quantization as well.

[[demo:adeline-retention]]

One finding I didn't expect: the final model and the smaller learning-curve
run have about the same retention (+0.106 vs +0.095, well inside each
other's intervals), even though validation loss kept improving with more
data. The extra data mostly bought shorter summaries, with fewer hitting the
length cap. So token-level loss doesn't seem to track what matters here, and
my guess is retention is limited by something other than example count. I'd
love to figure out what.

## limitations

The labels and the judge are both LLM-based and not yet checked against a
human spot-check. adeline-v2's summaries are also about 7% longer than the
base's (13% in FP4), and longer summaries have more room to keep facts.
Length isn't controlled yet, so I'd read the gain as an upper bound until we
rerun the base with a matched length budget. And per-compaction retention
isn't task success, which is what Satish et al. and CliffCompaction actually
measure, so the next step is [Terminal-Bench](https://www.tbench.ai/) with
each model doing the compaction.
