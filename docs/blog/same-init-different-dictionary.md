---
title: Same init, different dictionary
date: 2026-10-31
summary: Two SAE runs with the same seed and the same data, differing only in GPU kernel nondeterminism, already leave unmatched .43 to .85 times as many latents as a new seed does, and they break largely the same latents.
---

If you flip the last bit of one encoder weight at step 0 and otherwise train
a sparse autoencoder (SAE) bit for bit the same, how different is the final
dictionary? On GPT-2 it ends up half as different as a run with a brand new
seed. That's the main result of our second SOAR 2026 paper, and it reframes
the [orphan latents](#/blog/orphan-latents) from the first one: much of what
gets called seed dependence doesn't need a different initialization at all.

The measurement is simple. Let u be the share of live latents left unmatched
between two seeds, and t the share left unmatched between two runs with the
same seed and data that differ only in GPU kernel nondeterminism (the order
of atomic adds in the backward pass). The noise share is

```
R_N = t / u
```

which is a ratio of unmatched shares, not a variance decomposition. Across
TopK SAEs on Pythia-160m, GPT-2 Small and Llama-3.1-8B it lands between .43
and .85, and on GPT-2 it rises with the learning rate at equal reconstruction
(.57 to .77) and with the budget (.77 to .85 from 1B to 4B tokens).

[[demo:noise-share]]

## same latents, not just same amount

A ratio alone could mean noise breaks some random other set of latents. It
doesn't. We cross-tabulate "unmatched by the perturbation" against "unmatched
by a new seed" and compute a Mantel-Haenszel odds ratio within firing
frequency deciles, with a threshold of 3 fixed before any result was read.
Every perturbation clears it (ulp flip, kernel noise, noise dose, document
order, minibatch composition, a mid-run kernel switch), with odds ratios of
4.7 to 28 across both matching rules. On Llama, a noise twin leaves unmatched
56% of the latents a new seed leaves unmatched, against 37% if the two were
unrelated.

## when it's decided

In full-fp32 GPT-2 the sensitivity is confined to the very start: kernel
noise injected at any of nine fork points from step 10 onward ends as the
same SAE (all latents matched). Resetting Adam's moments at 1% of training
partly reopens it, which seems to me consistent with the optimizer state
damping late noise, though we haven't pinned a mechanism. The window depends
on the recipe (under bf16 autocast on Pythia it's still open at 5%).

Seed pairs also aren't relabelings of each other. After permutation
alignment, the relative barrier on the straight line between them is .16 to
.22, and it disappears when only the matched latents are interpolated, so
the barrier sits in the unmatched latents' directions.

My intuition is that this is the part of the orphans the transplant test
couldn't place, and I'd be curious whether a training recipe that damps those
first few steps buys more reproducibility than any amount of seed averaging.
