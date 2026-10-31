---
title: Same seed, different SAE: GPU noise and seed dependence
date: 2026-10-31
summary: Rerun a sparse autoencoder with the same seed and data, changing only GPU kernel nondeterminism, and it leaves 43 to 85% as many latents unmatched as a new seed, mostly the same ones.
---

Train a sparse autoencoder (SAE) twice with the same seed and the same data,
so the only difference is GPU kernel nondeterminism (for example the order of
atomic adds in the backward pass, which changes rounding). Match the two
dictionaries latent by latent and you get .43 to .85 times as many unmatched
latents as two different seeds give. Even with fully deterministic training,
flipping the last bit of one encoder weight at step 0 leaves half as many
unmatched as a new seed on GPT-2. That's the headline of my second SOAR 2026
project (EleutherAI's Summer of Open AI Research, supervised by Gonçalo
Paulo), and it bears on the [orphan latents](#/blog/orphan-latents) from the
first: much of what gets called seed dependence doesn't need a different
initialization, so fixing the seed buys less reproducibility than you'd think.

The protocol follows [Summers and Dinneen (2021)](https://arxiv.org/abs/2103.04514),
who asked the same question for supervised networks. I match latents with
Hungarian assignments over encoder and decoder directions (both cosines ≥ .7)
and count unmatched live latents. With u the unmatched share between two
seeds and t the share between two runs that differ only in kernel noise, the
noise share is

```
R_N = t / u
```

a ratio of unmatched shares, not a variance decomposition. Across TopK SAEs
on Pythia-160m and Llama-3.1-8B (bf16 autocast) and GPT-2 Small (full fp32) it
lands between .43 and .85. On GPT-2 it's higher at twice the learning rate,
at equal reconstruction (.57 vs .77), and with a longer budget (.77 to .85
from 1B to 4B tokens).

[[demo:noise-share]]

## same latents, not just same amount

A ratio alone would be consistent with noise breaking some unrelated set of
latents, so I cross-tabulate "unmatched by the perturbation" against
"unmatched by a new seed" and compute a Mantel-Haenszel odds ratio within
firing-frequency deciles, with a threshold of 3 fixed before any result was
read. Every perturbation clears it (the last-bit flip, kernel noise, and as a
looser check, document order, minibatch composition and a mid-run kernel
switch), with odds ratios of 4.7 to 28 across two matching rules. On Llama, a
noise twin (a run that differs only in kernel noise) leaves unmatched 56% of
the latents a new seed leaves unmatched, against 37% expected by chance.

## when it's decided

In full-fp32 GPT-2, about 122k steps long, the outcome is basically decided
in the first 10 steps. If I train deterministically up to a fork point and
only then let kernel noise in, every one of nine forks from step 10 onward
ends as the same SAE (all latents matched). Resetting Adam's moments at 1% of
training partly reopens the sensitivity, which seems to me consistent with
the optimizer state damping late noise, though I haven't pinned a
mechanism. It isn't universal: on Pythia at 4k latents it's still open at 5%,
while GPT-2 under bf16 autocast closes by 1%, so it's probably not the
precision (width, model and training loop all differ).

The unmatched latents are also where the two SAEs really differ. After
permutation alignment, the largest rise in held-out FVU (fraction of variance
unexplained) on the straight line between two seeds is 16 to 22% of the
endpoints' value, against 7% for noise twins, and it disappears when only the
matched latents are interpolated. This is the linear mode connectivity test
from [Frankle et al. (2020)](https://arxiv.org/abs/1912.05671).

## what it doesn't show

R_N inherits the .7 cosine cutoff, so it measures how often matching breaks,
not how far apart the dictionaries are (the transplant test in the companion
post suggests the functional gap is smaller). Pythia and Llama have one seed
pair and one twin pair each, so their ratios don't include pair-to-pair
spread, and I'd read the range as rough.

The natural next step is to join the two papers: are the latents kernel
noise breaks the orphans that transplant, or the 14 to 25% that don't? I'd
also be curious whether a recipe that damps those first few steps buys more
reproducibility than seed averaging does.
