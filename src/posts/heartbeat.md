---
title: Building nexos.heartbeat: the infinite context problem
date: 2026-03-01
summary: An always-on AI twin doesn't have a context window problem, it has an infinite context problem. Information theory, the design space, and why our memory is a git repository.
---

At nexos.ai my team has been building
[nexos.heartbeat](https://nexos.ai/heartbeat/), a digital AI twin: it
watches, learns, surfaces what matters, and acts before you ask. The pitch
is short, but the problem behind it is one of the most interesting I've
worked on, because an always-on assistant doesn't have a context window
problem. It has an infinite context problem.

## the infinite context problem

Context windows keep growing, and it's tempting to think the problem
dissolves on its own. It doesn't, because the input isn't a document, it's
a stream: every thread, meeting, draft, and half-decision, every day,
forever. No window holds an unbounded stream, and storage was never the
hard part (logs are cheap). The hard part is that at any moment almost none
of the past matters, and you don't know in advance which part does.

## memory is compression

Shannon's definition of information is surprise, and by that definition
most of the stream carries almost none: the signal is sparse. So the system
has to compress, and lossless doesn't save you, since a losslessly
compressed unbounded stream is still unbounded. Lossy compression forces a
value judgment. Rate-distortion theory says you can't even define it without
choosing what it costs to lose something, and choosing that measure is the
actual product decision. Ours isn't "can the twin reconstruct the past",
it's "would the twin act differently without this". Memory becomes a
compressed belief state, sufficient statistics for action, like a state
estimator that throws its observations away.

The counterintuitive consequence: a good twin is defined mostly by what it
ignores, and "gets smarter every day" literally means it compresses you
better. Compression and prediction are the same quantity seen from two
sides, so acting before you ask is just prediction crossing a confidence
threshold.

## the design space

One current trend keeps no state at all: embed everything, run semantic
retrieval on every interaction. My view is it won't be enough. Retrieval is
a pull system, it needs a query, and the most valuable moments for a twin
have no query (acting before you ask means there's no ask to embed). And
never consolidating means never building the model of you that makes
surprise, and therefore ranking, possible.

Hierarchical RAG (summaries of summaries) is better, but the compression
decisions happen at write time, before anyone knows what the future needs,
and the objective is still reconstruction rather than action. Stack enough
lossy layers optimized for the wrong loss and you get confident descriptions
of a past that no longer matters.

At the agent-centric end sit hyperagents, long-lived orchestrators managing
fleets of sub-agents, and the Darwin Gödel Machine, which rewrites its own
code and keeps an archive of variants, basically evolution over programs.
Fascinating work (I have a soft spot for evolutionary methods), but for a
personal twin, self-modifying code puts identity in the wrong place. What
should accumulate isn't the agent's source, it's its understanding of you.

## context as a repository

Where we landed: the twin's state is a repository of structured plain-text
files, and every beat that changes them is a commit. My favorite decision in
the whole system. Memory stops being a black box: diffs are a timeline of
how the model of you changed, blame traces any belief to the events that
wrote it, revert repairs a bad memory, branches let consolidations be tried
before merging.

Concurrency comes along for free. Many writers (overlapping beats, agents
finishing out of order) would normally mean race conditions; git's
isolate-then-reconcile design handles it elegantly (kudos to Linus, the
model holds up in a context he never imagined), and a conflict surfaces as
what it really is: two beliefs that need reconciling. In an enterprise
setting, forking a state into a sandbox or rolling back to a known-good
snapshot aren't nice-to-haves, they're requirements, and here they're
one-liners. The twin is the repo, not the process.

## why a heartbeat

A request-response assistant only thinks when poked. The stream framing
forces a pulse instead: each beat ingests what's new, consolidates it into
the bounded state, and checks whether anything crossed the line from noted
to act. Don't scale the window, bound the state, pay a constant cost per
beat.

Much of the implementation is under NDA, so I'll just say the quirks
cluster around questions that sound trivial until you hit them: when a
change deserves a commit, how to reconcile contradicting beliefs, how to
evaluate forgetting when a wrong forget only shows up weeks later. Lossy
compression of a person is a strange thing to engineer. But if we get it
right, it should feel less like a bigger context window and more like
working with someone who knows you. The
[waitlist](https://nexos.ai/heartbeat/) is open.
