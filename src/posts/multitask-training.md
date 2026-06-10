---
title: Does parameter sharing help? a multitask recommender experiment
date: 2025-05-10
summary: Treating every user as a task: Matrix Factorization vs Neural Collaborative Filtering under four sharing and weighting regimes on MovieLens.
---

Multitask learning has a pretty attractive promise: train one model on
several related objectives and let the tasks teach each other. It also has a
known failure mode, tasks interfering with each other until one objective
quietly eats the rest.
[This experiment](https://github.com/mariopenglee/multitask-training-evaluation)
was my attempt to measure where that line sits for recommender systems.

## the setup

The framing is that every user is a task. For each user-movie interaction
the model predicts two things at once: whether the user would engage with
the item (binary classification), and what rating they'd give it
(regression).

I implemented the recommender both ways that mattered at the time, classic
Matrix Factorization and Neural Collaborative Filtering, trained on the
GroupLens MovieLens dataset. That covers both the linear and the deep end of
collaborative filtering.

## what I compared

Four configurations, crossing parameter sharing with loss weighting:

- sharing on, factorization weight 0.99 / regression weight 0.1
- sharing on, weights 0.5 / 0.5
- sharing off, weights 0.5 / 0.5
- sharing off, weights 0.99 / 0.1

The point of the grid is to separate two questions that usually get
conflated: does sharing parameters across tasks help at all, and how much of
the outcome is really just the loss weighting in disguise. Control one
variable at a time, basically.

## what I took away

Honestly the clean lesson wasn't a single winning configuration, it was how
much the answer moved when the loss weights moved. Whether sharing helped
depended heavily on how the joint objective was balanced, and with the wrong
weighting the "transfer" turns into plain interference between the two
heads. My takeaway is that multitask learning isn't a free lunch, it's a
coupling knob, and the weighting is as much a part of the architecture as
the shared layers are.

That question, when does sharing parameters between objectives help and when
does it hurt, turned out to be one of the more durable ones I've worked on.
It shows up again in adapters, in multi-objective reward models, basically
in every system where one network serves several masters. This was just the
first time I measured it directly.
