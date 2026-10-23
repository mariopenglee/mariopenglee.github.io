---
title: Building nexos.heartbeat: the infinite context problem
date: 2026-03-01
summary: An always-on AI twin doesn't have a context window problem, it has an infinite context problem. Information theory, the design space, and why our memory is a git repository.
---

An always-on assistant doesn't have a context window problem. It has an
infinite context problem, and that's a much deeper hole.

At nexos.ai my team has been building
[nexos.heartbeat](https://nexos.ai/heartbeat/), a digital AI twin: it
watches, learns, surfaces what matters, and acts before you ask. The pitch
is short. The problem behind it is one of the more interesting ones I've
worked on, and it isn't the one people expect.

## the infinite context problem

Context windows keep growing, and it's tempting to think the problem
dissolves on its own. It doesn't, because the input isn't a document, it's
a stream: every thread, meeting, draft, and half-decision, every day,
forever. No window holds an unbounded stream, and storage was never the hard
part (logs are cheap). The hard part is that at any moment almost none of the
past matters, and you don't know in advance which part does.

## memory is compression

Shannon's definition of information is surprise, and by that definition most
of the stream carries almost none: the signal is sparse. So the system has
to compress, and lossless doesn't save you, since a losslessly compressed
unbounded stream is still unbounded. Lossy compression forces a value
judgment. Rate-distortion theory says you can't even define it without
choosing what it costs to lose something, and that choice is the actual
product decision. The information bottleneck (Tishby, Pereira, Bialek, 1999)
frames it well: squeeze the stream through a bottleneck that keeps only what
predicts a chosen variable, and let that variable set the cost instead of
hand-picking one. For a twin the variable is action, not reconstruction, so
the question isn't "can it replay the past", it's "would it act differently
without this". Memory becomes a compressed belief state, sufficient
statistics for action (the information bottleneck is really just that idea,
the minimal sufficient statistic, generalized to lossy settings).

The counterintuitive consequence: a good twin is defined mostly by what it
ignores, and "gets smarter every day" literally means it compresses you
better. Compression and prediction are the same quantity seen from two
sides, so acting before you ask is just prediction crossing a confidence
threshold.

## the design space

The naive version is hierarchical RAG: embed everything, retrieve top-k,
summarize, repeat up a tree. It works until the part that matters today is
something you compressed away yesterday, because it didn't look important at
the time. Fixed summarization is lossy in a direction you chose too early.

What you actually want is memory you can revise: keep the compressed belief
state, but let new evidence reopen old conclusions. So the structure isn't a
summary, it's a versioned model of the user that updates as you learn.

## memory as a git repository

The design I keep coming back to is a repository of structured plain-text
files, versioned like code. State lives in readable files (who the user is,
what they're working on, what they care about), and every update is a diff
against that state. The history of diffs is the timeline: not a log of
events, but a log of how the model of the user changed.

This buys a few things almost for free. Concurrency: many processes can
propose updates, and you reconcile them like merges. Belief reconciliation:
a conflict between an old assumption and new evidence is a merge conflict,
and you resolve it explicitly instead of silently overwriting. Auditability:
you can read, in plain text, why the twin believes what it believes, and
roll back when it's wrong. Branches let you hold tentative models of the
user and only commit when they're confirmed.

[[demo:belief-repo]]

It's plain text because plain text is the most durable, inspectable,
mergeable format we have, and because a human (or another model) can read
the state and tell you it's wrong. A belief state you can't inspect is one
you can't correct.

## where this goes

The open question I find most interesting is when to act. A twin that acts
on every high-confidence prediction is exhausting; one that waits for
certainty is useless. The threshold is itself something you should learn per
person, from whether your past actions landed. That feedback loop, acting,
watching how it lands, updating the threshold, is probably the actual
product, and I'd love to write more about it once we've pushed on it
further.
