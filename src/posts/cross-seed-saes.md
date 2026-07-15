---
title: Do sparse autoencoders capture manifolds?
date: 2026-07-15
summary: A concept like "year" lives on a curved manifold, and a single sparse autoencoder often shatters it instead of capturing it whole. Training several SAEs that differ only in random seed and pooling them tiles the manifold back together, right where one SAE dilutes it.
---

The representation of a year inside a language model isn't a point, it's a
helix: a periodic part (the decade digit) wound around a linear axis (the
century). Color traces a curved surface, days of the week trace a ring. A lot
of concepts are like this. They live on smooth low-dimensional manifolds
rather than single directions, which raises an awkward question for the main
tool we use to read models. A
[sparse autoencoder (SAE)](https://transformer-circuits.pub/2023/monosemantic-features)
is built to break an activation into a few discrete atoms, so what does it do
with a continuous curved surface?

Often it doesn't capture it cleanly. That's the finding in Bhalla et al.,
["Do Sparse Autoencoders Capture Concept Manifolds?" (2026)](https://arxiv.org/abs/2604.28119):
instead of allocating a compact group of atoms that span the manifold (they
call this global capture), an SAE tends to shatter it into many atoms that
each tile a small local patch, or land in a fragmented in-between they call
dilution. My follow-up question was simple. SAE training is stochastic, so each
random seed shatters the manifold a bit differently. If you train several SAEs
that differ only in seed and pool their atoms, do the different shatterings
tile the manifold more fully than any single one does?

The short answer from a [small POC](https://github.com/mariopenglee/cross-seed-manifold-poc)
is yes, and the benefit shows up exactly where a single SAE gives up.

## where pooling helps

I used a synthetic benchmark from the paper (48 manifolds, circles and helices
and swiss rolls, placed in a 128-dim space), because the geometry is known and
reconstructions can be scored against ground truth. A manifold's fate is set by
the TopK sparsity `k`. Near `k` equal to the manifold's dimension a single SAE
captures it compactly from a handful of atoms, and pooling adds basically
nothing. As `k` grows the SAE dilutes the manifold across redundant atoms, and
that's where pooling pulls ahead: the gap in a few-atom reconstruction score
grows from about +0.01 at clean capture to roughly +0.1 at deep dilution. So
the benefit tracks dilution. Pooling helps precisely where one SAE stops
capturing the manifold cleanly.

## the intuition, to play with

The demo below is a toy version of the mechanism (not a real SAE, just the
geometry). Pick a helix, sphere, or torus, the kind of shape a real concept
traces, and drag to spin it. Each seed scatters atoms over the manifold, and
each covers a small patch. The score is few-atom capture: how much the best
handful of patches tile, which is what the paper's metric rewards. One seed
leaves gaps, a second seed's gaps land elsewhere, so the pooled panel fills in
where the single-seed panel has holes (turn on "color by seed" to see which
seed covers what). Push the sparsity `k` up into dilution and the gap grows.

The third panel is the tell. It's one SAE as wide as the whole pool, the same
total atoms and compute, and you might expect it to win. But at high `k` it can
fall behind even a single narrow seed. With the same sparsity budget spread
over more atoms, each one specializes to a finer patch, and a few fine patches
tile less of the manifold than a few coarse ones. Widening one SAE shatters the
concept right where pooling separate seeds tiles it.

[[demo:manifold-tiling]]

## tiling, not cleaner copies

The wide control rules out the obvious worry (that pooling just wins on atom
count) since it has those atoms and still loses. The other question is whether
the pool's gain is complementary coverage or just denoised copies of one
solution. I aligned each seed's atoms to a reference and averaged the matched
ones. Averaging can clean up a shared solution but can't invent an atom in a
region no seed covered, and it recovered basically none of the gain (often it
came out worse than a single seed). The pool's improvement also concentrated on
exactly the points the best single seed reconstructed worst. So the seeds tile
complementary regions rather than agreeing on one answer you could average.
Decomposing the gain, roughly half is just having several independent SAEs to
draw from and half is genuine seed diversity.

## what I'd hold loosely

This is toy data with known geometry and one reconstruction metric, and it's a
few-percent effect, not a step change. The reason I think it's interesting is
the reframe: seed variation usually gets filed as instability, but here it
behaves like coverage, and coverage is something you can pool.

The catch is that on a real model you can't score against ground truth, since
you don't know the manifold. So the test I actually care about is next: pool
seeds on Llama-3.1-8B activations for concepts whose geometry we can at least
guess (years, colors, days), and see whether the places the seeds diverge are
where a single SAE was quietly diluting a concept. If pooled-seed agreement can
flag real manifold structure, that's a cheap knob worth having.
