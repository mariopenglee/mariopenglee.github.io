---
title: Seeds share more than their latents admit
date: 2026-10-31
summary: Two sparse autoencoders that differ only in seed match about half their latents one-to-one. A transplant test calibrated on toy worlds says 75 to 86% of what they learn is shared, and part of the gap is the same manifold cut into different tiles.
---

Train two sparse autoencoders (SAEs) on the same Llama-3.1-8B activations,
change only the seed, and match their latents one-to-one. About
half of them come out with no partner (these are usually called orphans, and
[Paulo and Belrose](https://arxiv.org/abs/2501.16615) get only 30% shared on
Llama-3-8B). The usual reading is that each seed learned features the
other missed, which is bad news if you want SAE latents to be the
units you interpret a model with. Our SOAR 2026 paper argues that's mostly wrong. Once orphans are tested by what they do rather than where their
weights point, the share of structure two seeds have in common goes from
51 / 53 / 42% to **75 / 86 / 82%** across three sites (Llama layer 16 MLP,
Llama layer 28 residual, Pythia-160m layer 6 MLP). One-to-one matching
undercounts sharing by 24 to 40 points.

Both views below are real data. The sphere is a toy world
where the answer is known: one planted sphere, two TopK SAEs of width 32,
every point coloured by the latent that fires hardest there. Seed A cuts it
into 9 tiles and seed B into 6, and exactly one tile is matched across seeds,
yet both reconstruct the sphere. The temperature view is Llama: we sweep
"It is v degrees outside" from -30 to 60°C and plot each seed's tile-only
reconstruction on its top three principal components. Seed A uses 6 tiles and
seed B 4, none has a one-to-one partner, and after an orthogonal rotation the
two curves line up with R² = .85 (A just splits each end of the range in two).

[[demo:seed-tiling]]

## why matching misses it

The standard rule solves a Hungarian assignment over encoder and decoder
directions and calls a pair matched if both cosines reach .7. That compares
latents one at a time. If a manifold is tiled and the tile boundaries depend
on the seed, no tile of A has to line up with any tile of B, even though
their union covers the same thing. The toy makes this concrete: in worlds
where both seeds see every manifold by construction, 61 to 84% of live
latents are still orphans. Widening the SAE on a single sphere shatters it
from 4 to 25 tiles, 89 to 99% of them unmatched, while the two seeds' outputs
on it agree at R² ≥ .98.

## the test

Two steps, neither using weight similarity (orphans already failed
that). First, pool both seeds' orphans and group them by co-firing,
with the Ochiai coefficient over their active token sets:

```
O_ij = |A_i ∩ A_j| / sqrt(|A_i| · |A_j|)
```

We connect each orphan to its 10 nearest neighbours, partition with Leiden
CPM (resolution γ = .045 × the median edge weight), and keep only groups
denser than size-matched groups in 5 degree-preserving shuffles. The method
was picked from 7 similarities × 32 clusterings, scored against the known
manifolds of the toy worlds with a rule fixed beforehand.

Second, transplant. For each group we delete the host seed's orphans and
insert the donor seed's, encoded on the same held-out tokens:

```
repair = 1 − ΔSSE(donor) / ΔSSE(empty slot)
```

So 1 means the donor fully stands in, 0 means it's no better than leaving
the slot empty. A group counts as shared if its repair clears a bar b, and
we set b by error control: b = .19 is the lowest bar where every control
donor (firing-matched latents, a different group, random latents) passes for
at most 1% of orphans in all 16 toy worlds and all 3 real sites. In the toy,
where every orphan is a false orphan, 86% pass, so that's the test's
sensitivity s. Grouping, resolution, bar and sensitivity were all fixed on
the toy before any real model was scored.

## what the real models say

At b = .19, 51 to 65% of grouped orphans transplant, and no control passes
for more than 0.9%. Correcting for sensitivity, with m the matched share and
T(b) the share of all orphans in transplanting groups:

```
shared = m + (1 − m) · T(b) / s
```

which is where the 75 / 86 / 82% comes from. Temperature is the cleanest
case. The blind groups find the same pieces the sweep does (9 of 10
tiles share a group with a tile of the other seed, p < .001), and the
donor's tiles repair the host where one-to-one partners mostly don't:

```
donor                 SSE repair (host A / B)   KL repair
same-concept tiles        +.34 / +.35           +.63 / +.67
Hungarian partners        +.07 / +.23           +.30 / +.21
firing-matched            -.32 / -.51           -.20 / -.12
```

## what it doesn't show

Real orphans transplant partly, not fully. The repair distribution is a broad
peak around +.2 to +.4 (3 to 6% above .8, against 49% in the toy), so honestly
"shared" here means "carries much of the same structure", not "the
same latent in disguise". Groups also aren't a better unit than the failed
Hungarian partners in real models (.62 to .63 vs .51 to .65), and clean tilings
like temperature are rare (under 0.1% of orphans). Lowering the matching
cutoff doesn't rescue anything either: how close an orphan's partner is
barely predicts whether it transplants (AUC .52 to .58). 
The open question is the remaining 14 to 25%. Some of it is groups that
aren't one concept, and some probably is real seed variance, which raised
the question of how much of that variance needs a different seed at all. We
answer that in a [companion post](#/blog/same-init-different-dictionary),
and I'd love to see whether a small learned adapter between seeds turns the
partial transplants into full ones.
