---
title: Does parameter sharing help? a multitask recommender experiment
date: 2025-05-10
summary: I built the same recommender four times to find out whether sharing parameters across tasks helps. It turned out the loss weighting mattered more than the sharing, which is a known and slightly annoying axis.
---

I built the same recommender four times to answer one question: does sharing
parameters across tasks actually help? To be honest I was asking the wrong
question, since what moved the results wasn't whether the tasks shared a
backbone but how I weighted their two losses.
([code](https://github.com/mariopenglee/multitask-training-evaluation))

## the setup

Every user is a task. For each user-movie interaction the model predicts two
things at once: whether the user would engage with the item (binary
classification) and what rating they'd give it (regression). I built it both
ways that mattered at the time, classic Matrix Factorization and Neural
Collaborative Filtering, on the GroupLens MovieLens data, which covers the
linear and the deep end of collaborative filtering.

## the grid

Four configurations, crossing parameter sharing with loss weighting: sharing
on or off, weights at 0.99/0.1 or 0.5/0.5. The point was to separate two
questions that usually get conflated: does sharing help at all, and how much
of the outcome is really just the weighting in disguise (so only one
variable changes between any two neighboring runs).

## what I took away

There wasn't really a winning configuration. What stood out was how far the
answer moved when the weights moved: with the wrong balance the "transfer" turns
into plain interference, one head quietly eating the other. My view is that
multitask learning is less a free lunch and more a coupling knob, and the
weighting is probably as much a part of the architecture as the shared layers.

[[demo:loss-weighting]]

I don't think this is specific to MovieLens either. The weighting matters
enough that a whole line of work tries to stop hand-tuning it: Kendall et al. learn the
per-task weights from each task's uncertainty instead of setting them, and Yu
et al.'s PCGrad attacks the interference one level down, projecting away the
part of one task's gradient that conflicts with another's. Both are going
after the problem I ran into, that two objectives sharing a network are
coupled whether you like it or not.

When sharing between objectives helps and when it hurts has stuck with me
more than most questions I've worked on. It shows up in adapters, in
multi-objective reward models, basically anywhere one network is trained on
more than one thing, and this was just the first time I measured it
directly.
