---
title: cyclediffusion: an autoencoder whose latent is a picture
date: 2025-08-02
summary: Most autoencoder bottlenecks are vectors no one can read. I built one where the latent is an image, so you can look at what the model decided to keep. The hard part was making a picture differentiable.
---

The bottleneck of an autoencoder is usually a vector of a few hundred
numbers that no human will ever read. I wanted to build one you could just
look at, so I made the latent an actual image.

The setup is a cycle
([code](https://github.com/mariopenglee/cyclediffusion)): text goes into a
diffusion model that renders it to a picture, and a captioner reads that
picture back to text. Train the two ends so the output text matches the
input, and the image in the middle has to carry the meaning. The latent
isn't a tensor you probe with other tools, it's a 512x512 picture you can
open and inspect. That's the whole point: a bottleneck you can see.

## the part that didn't want to be differentiable

To train the loop end to end, gradients have to flow backward through the
captioner into the image and on into the diffusion model. The captioner I
used (Pix2Struct) starts by cutting the image into patches and flattening
them into a sequence, and the off-the-shelf implementation does that with
indexing and reshaping operations that quietly break the gradient. The
forward pass is fine; the backward pass hits a wall, because the image the
loss most wants to correct is upstream of the cut.

So I reimplemented patch extraction and flattening from scratch as pure
tensor operations, the same arithmetic but written so every step is
differentiable, and the gradient survives the whole round trip. Unglamorous,
and it was most of the work, which is usually how it goes once the idea is
settled.

## paying for the resolution

Keeping the latent a full image is expensive: attention is quadratic in
sequence length, and an image is a lot of patches, so memory was the binding
constraint before accuracy ever got a vote. FlashAttention (Dao et al. 2022,
[arxiv 2205.14135](https://arxiv.org/abs/2205.14135)) buys most of it back by
never materializing the full attention matrix, tiling the computation so
memory grows linearly instead of quadratically. Same math, exact attention,
it just stops storing the thing you don't need to keep. That's what made the
larger images trainable at all.

## why a readable bottleneck is interesting

This sits next to a question I keep coming back to in interpretability: what
if the compressed representation were something a person could read directly,
instead of something you need a second model to decode. Sparse autoencoders
go partway, factoring activations into features that are more interpretable
than raw neurons but still need labeling. Natural language autoencoders push
all the way, forcing the bottleneck to be text
([transformer-circuits, 2026](https://transformer-circuits.pub/2026/nla/)).
An image bottleneck is the same instinct in a different modality, with a real
tradeoff: a picture is higher-bandwidth than a sentence, so it's lossy in a
way you can see rather than read.

The thing I'd want to test next is whether the image bottleneck encodes
meaning the way a person would guess, or whether it learns some adversarial
code that round-trips perfectly and looks like noise to us. My intuition is
it's somewhere in between, and where exactly it lands on that line is
probably the interesting measurement. Would be fun to probe it directly.
