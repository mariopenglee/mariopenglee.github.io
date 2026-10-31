---
title: SAE seeds share more than matching shows
date: 2026-10-31
summary: Two sparse autoencoders that differ only in seed match about half their latents one-to-one. A transplant test calibrated on toy worlds puts the shared share at 75 to 86%, and part of the gap is the same manifold cut into different tiles.
---

Train two sparse autoencoders (SAEs) on the same Llama-3.1-8B activations,
change only the seed, and match their latents one-to-one. About half come out
with no partner (orphans; [Paulo and Belrose](https://arxiv.org/abs/2501.16615)
get only 30% shared on Llama-3-8B). The usual reading is that each seed learned features the other
missed, which matters a lot if you treat latents as the units you interpret a
model with, since "the feature for X" would then depend on the seed. Our SOAR
2026 paper finds that much of that gap comes from how latents are matched. If
we count a latent as shared when it's matched or when the other seed's
latents can stand in for it, the share goes from 51 / 53 / 42% to
**75 / 86 / 82%** at three sites (Llama layer 16 MLP, Llama layer 28
residual, Pythia-160m layer 6 MLP), so one-to-one matching misses 24 to 40
points of sharing.

Both views below are real data. The sphere is a toy world with a known
answer: one planted sphere, two TopK SAEs of width 32, and every
point coloured by the latent that fires hardest there. Seed A cuts it into 9
tiles and seed B into 6, and exactly one tile is matched across seeds, yet
both reconstruct the sphere. The temperature view is Llama: we sweep "It is v
degrees outside" from -30 to 60°C and plot each seed's tile-only
reconstruction on its top three principal components. Seed A uses 6 tiles and
seed B 4, none has a one-to-one partner, and after an orthogonal rotation the
two curves line up with R² = .85.

[[demo:seed-tiling]]

## why matching misses it

The standard rule solves a Hungarian assignment over encoder and decoder
directions and calls a pair matched if both cosines reach .7, so it compares
latents one at a time. If a manifold is tiled and the tile boundaries depend
on the seed, no tile of A has to line up with any tile of B, even though
their union covers the same thing. In toy worlds where both seeds see every
manifold, 61 to 84% of live latents are still orphans, and
widening the SAE on a single sphere shatters it from 4 to 25 tiles (89 to 99%
unmatched) while the two seeds' outputs on it agree at R² ≥ .98.

## the test

Neither step uses weight similarity, since orphans already failed that.
First, we pool both seeds' orphans and group them by co-firing, with the
Ochiai coefficient over their active token sets:

```
O_ij = |A_i ∩ A_j| / sqrt(|A_i| · |A_j|)
```

Each orphan connects to its 10 nearest neighbours, Leiden CPM partitions the
graph (γ = .045 × the median edge weight), and we keep only groups denser
than size-matched groups in 5 degree-preserving shuffles. This recipe won
out of 7 similarities × 32 clusterings on toy worlds with known manifolds,
under a selection rule fixed beforehand.

Second, we transplant. For each group we delete the host seed's orphans and
insert the donor seed's, encoded on the same held-out tokens:

```
repair = 1 − ΔSSE(donor) / ΔSSE(empty slot)
```

A repair of 1 means the donor fully stands in, and 0 means it's no better
than leaving the slot empty. A group counts as shared if its repair clears a
bar b, set by error control: b = .19 is the lowest bar at which every control
donor (firing-matched latents, a different group, random latents) passes for
at most 1% of orphans in all 16 toy worlds and all 3 real sites. In the toy
every orphan is a false orphan, and 86% pass, which gives the test's
sensitivity s. Grouping, resolution, bar and sensitivity were all fixed on
the toy before any real model was scored.

## what the real models say

At b = .19, 51 to 65% of grouped orphans transplant, and no control passes
for more than 0.9%. With m the matched share and T(b) the share of all
orphans in transplanting groups, we correct for sensitivity:

```
shared = m + (1 − m) · T(b) / s
```

That's the 75 / 86 / 82%. It assumes the real-model sensitivity is close to
the toy's, so I'd read it as an estimate rather than a count. Temperature is
the cleanest case: the blind groups find the same pieces the sweep
does (9 of 10 tiles share a group with a tile of the other seed, p < .001),
and the donor's tiles repair the host where one-to-one partners mostly don't:

```
donor                 SSE repair (host A / B)   KL repair
same-concept tiles        +.34 / +.35           +.63 / +.67
Hungarian partners        +.07 / +.23           +.30 / +.21
firing-matched            -.32 / -.51           -.20 / -.12
```

## what it doesn't show

Real orphans transplant partly: repairs form a broad peak around
+.2 to +.4 (3 to 6% above .8, against 49% in the toy), so "shared" here means
"carries much of the same structure", not "the same latent in disguise".
Groups also aren't a better unit than the failed Hungarian partners in real
models (.62 to .63 vs .51 to .65), and clean tilings like temperature are
rare (under 0.1% of orphans). Lowering the matching cutoff doesn't help,
since how close an orphan's partner is barely predicts whether it
transplants (AUC .52 to .58).

That leaves 14 to 25% unexplained. Some of it is groups that aren't one
concept, and some is probably real seed variance, which raises the question
of how much of that variance needs a different initialization at all. That's
the [companion post](#/blog/same-init-different-dictionary). I'd also love to
see whether a small learned adapter between seeds turns the partial
transplants into full ones.
