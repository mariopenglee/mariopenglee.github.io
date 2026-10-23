---
title: Building nexos.heartbeat: the infinite context problem
date: 2026-03-01
summary: An always-on AI twin doesn't have a context window problem, it has an infinite context problem. Information theory, the design space, and why our memory is a git repository.
---

An always-on assistant doesn't have a context window problem, it has an
infinite context problem, and to be honest that's a much deeper hole.

At nexos.ai my team has been building
[nexos.heartbeat](https://nexos.ai/heartbeat/), a digital AI twin: it
watches, learns, surfaces what matters, and acts before you ask.

## the infinite context problem

Context windows keep growing, so it's tempting to think the problem goes
away on its own. My view is it doesn't, since the input isn't a document, it's
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
frames it pretty well: squeeze the stream through a bottleneck that keeps only what
predicts a chosen variable, and let that variable set the cost instead of
hand-picking one. For a twin the variable is action, not reconstruction, so
the question isn't "can it replay the past", it's "would it act differently
without this". Memory becomes a compressed belief state, sufficient
statistics for action.

The part I find counterintuitive is that a good twin is defined mostly by
what it ignores, and "gets smarter every day" basically means it compresses
you better. Compression and prediction are the same quantity seen from two
sides, so acting before you ask is just prediction crossing a confidence
threshold.

## the design space

The naive version is hierarchical RAG: embed everything, retrieve top-k,
summarize, repeat up a tree. It works until the part that matters today is
something you compressed away yesterday, because it didn't look important at
the time (fixed summarization is lossy in a direction you chose too
early).

What I think you actually want is memory you can revise: keep the compressed belief
state, but let new evidence reopen old conclusions. So the structure isn't a
summary, it's a versioned model of the user that updates as you learn.

## memory as a git repository

The design I keep coming back to is a repository of structured plain-text
files, versioned like code. State lives in readable files (who the user is,
what they're working on, what they care about), and every update is a diff
against that state. The history of diffs is the timeline: not a log of
events, but a log of how the model of the user changed.

This gets you a few things pretty much for free. Many processes can
propose updates and you reconcile them like merges. A conflict between an
old assumption and new evidence becomes a merge conflict, which you resolve
explicitly instead of silently overwriting. You can read, in plain text,
why the twin believes what it believes, and roll back when it's wrong. And
branches let you hold tentative models of the user, only committing once
they're confirmed.

[[demo:belief-repo]]

We picked plain text because it's about as durable and merge-friendly as
formats get, and because a human (or another model) can read the state and
tell you it's wrong, which seems to me like the main thing a belief state
needs.

## where this goes

The open question I find most interesting is when to act. A twin that acts
on every high-confidence prediction gets exhausting pretty fast, and one
that waits for certainty is basically useless. My guess is the threshold
itself should be learned per person, from whether past actions landed, and
that feedback loop (act, see how it lands, update the threshold) is probably
the actual product, and I'd love to write more about it once we've pushed on it
further.
