---
title: Same init, different dictionary
date: 2026-10-31
summary: Two SAE runs with the same seed and the same data, differing only in GPU kernel nondeterminism, leave unmatched .43 to .85 times as many latents as a new seed does, and they break largely the same latents.
---

Train a sparse autoencoder (SAE) on GPT-2 twice, bit for bit the same, except
that in the second run you flip the last bit of one encoder weight at step 0.
The two final dictionaries leave half as many latents unmatched as two runs
with different seeds do. That's the headline of our second SOAR 2026 paper,
and it bears directly on the [orphan latents](#/blog/orphan-latents) from the
first one: much of what gets called seed dependence doesn't need a different
initialization.

The protocol follows [Summers and Dinneen (2021)](https://arxiv.org/abs/2103.04514),
who asked the same question for supervised networks. We match latents with
Hungarian assignments over encoder and decoder directions (both cosines ≥ .7)
and count unmatched live latents. Let u be the unmatched share between two
seeds, and t the share between two runs with the same seed and data that
differ only in GPU kernel nondeterminism (the order of atomic adds in the
backward pass). The noise share is

```
R_N = t / u
```

a ratio of unmatched shares, not a variance decomposition. Across TopK SAEs
on Pythia-160m, GPT-2 Small and Llama-3.1-8B it lands between .43 and .85.
On GPT-2 it rises with the learning rate at equal reconstruction (.57 to .77)
and with the budget (.77 to .85 from 1B to 4B tokens).

[[demo:noise-share]]

## same latents, not just same amount

A ratio alone would be consistent with noise breaking some unrelated set of
latents, so we cross-tabulate "unmatched by the perturbation" against
"unmatched by a new seed" and compute a Mantel-Haenszel odds ratio within
firing-frequency deciles, with a threshold of 3 fixed before any result was
read. Every perturbation clears it (the last-bit flip, kernel noise, noise
dose, document order, minibatch composition, a mid-run kernel switch), with
odds ratios of 4.7 to 28 across two matching rules. On Llama, a noise twin
leaves unmatched 56% of the latents a new seed leaves unmatched, against 37%
if the two were independent.

## when it's decided

In full-fp32 GPT-2 the sensitivity is confined to the very start: kernel
noise injected at any of nine fork points from step 10 onward ends as the
same SAE (all latents matched). Resetting Adam's moments at 1% of training
partly reopens it, which seems to me consistent with the optimizer state
damping late noise, though we haven't pinned a mechanism. The window depends
on the recipe (under bf16 autocast on Pythia it's still open at 5%).

Seed pairs also aren't relabelings of each other. After permutation
alignment, the relative barrier b (the largest rise in held-out FVU along the
straight line between the two SAEs, over the endpoints' mean) is .16 to .22,
and it disappears when only the matched latents are interpolated, so the
barrier sits in the unmatched latents' directions.

The natural next step is to join the two papers: are the latents that kernel
noise breaks the orphans that transplant, or the 14 to 25% that don't? I'd
also be curious whether a recipe that damps those first few steps buys more
reproducibility than seed averaging does.
