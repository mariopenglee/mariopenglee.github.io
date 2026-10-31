---
title: Sparse autoencoder seeds share more than matching shows
date: 2026-10-31
summary: Two sparse autoencoders that differ only in seed match about half their latents one-to-one. A transplant test calibrated on toy worlds estimates the real shared share at 75 to 86%.
---

Train two sparse autoencoders (SAEs) on the same Llama-3.1-8B activations,
change only the seed, and match their latents one-to-one. About half come out
with no partner. These are called orphans
([Paulo and Belrose](https://arxiv.org/abs/2501.16615) get only 30% shared at
131k latents on Llama 3 8B). If each seed really learned different features,
"the feature for X" would depend on the seed. Our SOAR
2026 paper finds that much of the gap comes from how latents are matched. If a
latent counts as shared when the other seed's latents can stand in for it,
the estimated shared share goes from about half to 75 to 86%.

[Bhalla et al. (2026)](https://arxiv.org/abs/2604.28119) show a single SAE
often splits a curved concept (a manifold) into latents that each cover one
patch, which I'll call tiles. This follows up my
[earlier toy post](#/blog/cross-seed-saes): seeds seem to cut the same thing
differently rather than see different things.

Both views come from trained SAEs. The sphere is a toy world: one planted sphere, two TopK SAEs of width 32
(each input uses only its k strongest latents), every point colored by the
latent that fires hardest there. Seed A cuts it into 9 tiles and seed B into
6, and exactly one tile is matched across seeds, yet both reconstruct the
sphere. The temperature view is Llama layer 28: we sweep "It is v degrees
outside" from -30 to 60°C and plot each seed's tile-only reconstruction on its
top three principal components. Seed A uses 6 tiles and seed B 4, none is
matched one-to-one, and after an orthogonal rotation the two curves line up
with R² = .85 (shuffled temperatures give below -.5).

[[demo:seed-tiling]]

## why matching misses it

The standard rule solves a Hungarian assignment (the best one-to-one pairing
between two dictionaries) over encoder and decoder directions, and calls a
pair matched if both cosines reach .7. If tile boundaries
depend on the seed, no tile of A has to line up with any tile of B. In toy worlds
(synthetic activations built from planted manifolds), 61 to 84% of live
latents are orphans although both seeds represent every manifold.
Wider SAEs make it worse: one sphere goes from 4 tiles to 25, about 99%
unmatched, while the seeds' outputs agree at R² ≥ .98.

## the test

Neither step uses weight similarity. First, we pool both seeds' orphans and group them by co-firing, using
the Ochiai coefficient over their active token sets:

```
O_ij = |A_i ∩ A_j| / sqrt(|A_i| · |A_j|)
```

A 10-nearest-neighbor graph and Leiden community detection split them
into groups, kept only if denser than in degree-preserving shuffles. The recipe was picked on toy worlds under a rule fixed in advance
(so the risk is that it's tuned to the toy).

Second, we transplant. For each group we remove the host seed's orphans and
insert the donor's, on the same held-out tokens. With ΔSSE(x) the
rise in the host's reconstruction error when its group is replaced by x:

```
repair = 1 − ΔSSE(donor) / ΔSSE(empty slot)
```

1 means the donor fully stands in, 0 means no better than an empty slot. A group counts as shared if its repair
clears a bar b = .19, the lowest bar at which every control donor
(firing-matched latents, a different group, random latents) passes for at
most 1% of orphans in all 16 toy worlds and all 3 real sites. In the toy,
every orphan should have a stand-in, and 86% pass, which is the test's
sensitivity s. Grouping and sensitivity were fixed on the toy, and the bar
only looks at control donors, never at the real groups' own repairs.

## what the real models say

The sites are Llama layer 16 MLP, Llama layer 28 residual and Pythia-160m
layer 6 MLP. At b = .19, 51 to 65% of grouped orphans transplant,
and no control passes for more than 0.9%. With m the matched share and T(b)
the share of all orphans in transplanting groups:

```
shared = m + (1 − m) · T(b) / s
```

This moves the matched 51 / 53 / 42% to 75 / 86 / 82% shared (about
72 / 81 / 76% before dividing by s). Dividing by s assumes real sensitivity
matches the toy's, the weakest step, so I'd read these as rough estimates. Temperature is the cleanest case: 9 of 10 tiles share a blind
group with a tile of the other seed (p < .001), and the donor's tiles repair
the host much better than its below-cutoff Hungarian partners do. (KL repair
uses Llama's next-token KL instead of SSE):

```
donor                 SSE repair (host A / B)   KL repair
same-concept tiles        +.34 / +.35           +.63 / +.67
Hungarian partners        +.07 / +.23           +.30 / +.21
firing-matched            -.32 / -.51           -.20 / -.12
```

## what it doesn't show

Real orphans transplant partly: repairs form a broad peak around +.2 to +.4
(3 to 6% above .8, against 49% in the toy), so "shared" means much of the same
structure, not a near-copy. Clean tilings like
temperature are rare (under 0.1% of orphans), so in real models tiling is
shown for a few concepts, not as the general story. Outside those,
groups don't transplant more often than the orphans' Hungarian partners
(partners .62 to .63, groups .51 to .65), and partner cosine barely predicts
which orphans transplant (AUC .52 to .58), so lowering the cutoff doesn't
help. 
That leaves 14 to 25% unexplained. Some is probably real seed variance, and how
much of that needs a different initialization at all is the
[companion post](#/blog/same-init-different-dictionary). I'd also love to see
whether a small learned adapter turns partial transplants into full ones.
