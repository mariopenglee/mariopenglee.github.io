---
title: CycleDiffusion: an autoencoder you can read
date: 2025-08-02
summary: Text to pixels to text, with a bottleneck you can look at. Differentiable patch flattening from scratch, flash attention, and a link to interpretability.
---

Most autoencoders compress data into a latent vector that means nothing to a
human. You can measure it, cluster it, decode it, but you can't read it.
[CycleDiffusion](https://github.com/mariopenglee/cyclediffusion) was my
attempt at an autoencoder where the intermediate representation is something
a person can inspect directly: an image.

The loop is text to pixels to text. A diffusion model renders a caption into
an image, a captioner reads that image back into text, and cycle-consistency
losses force the round trip to preserve meaning. If the loop closes, the
picture in the middle is the latent. It's still compressed information, just
stored in a medium humans already know how to parse.

## the architecture

Two halves, one per GPU:

- diffusion side: CLIP text encoder, a `UNet2DConditionModel` for denoising,
  an `AutoencoderKL` VAE for the image latent space, and a DDPM scheduler
- captioning side: a Pix2Struct conditional generation model that turns the
  generated image back into text

Training optimizes a dual loss, pixel-level reconstruction on the diffusion
side plus caption loss on the language side, with gradient scaling to keep
the two halves from fighting each other.

## the part that actually hurt: patch flattening

The whole idea only works if gradients flow through the image, from the
caption loss, back through the captioner's vision encoder, into the pixels
the diffusion side produced. And that's exactly where the stock tooling
broke. Pix2Struct flattens the image into patches inside its processor, as
plain array manipulation on the input pipeline. Convenient for inference,
non-differentiable for my purposes. The computation graph ended right where
my training signal needed to pass.

So I reimplemented patch extraction and flattening from scratch as pure
tensor ops, a custom `flatten_patches()` that does the unfold and reshape
inside the graph, so the captioner consumes the generated image without ever
leaving autograd. Most of my debugging time on this project went into a
function whose entire job is rearranging numbers.

## making it fit

Running a diffusion model and a vision-language model in one training step
is memory hungry (the "minimum 2 GPUs recommended" in the README came from
experience). Splitting the halves across devices helped, but attention was
still the bottleneck, so I added flash attention to bring memory from
quadratic to linear in sequence length. That gave back enough headroom to
train with usable batch sizes.

## why I still think about this

I built CycleDiffusion before interpretability was the center of my world,
but to be honest it's the same question the field is now attacking from the
other direction. Sparse autoencoders (SAEs) decompose a model's hidden
activations into features a human can label, making the existing latent
readable. Natural language autoencoders (NLA) push further and force the
bottleneck itself to be text, readable by construction.

CycleDiffusion sits in that second family, with pixels instead of prose:
pick a medium humans can already parse and constrain the model to route its
information through it. My view is that this kind of bottleneck is much
lower bandwidth and lossy compared to latents optimized purely for
reconstruction, and its main advantage is exactly that it's readable. Where
that tradeoff is worth paying is unclear to me so far, and would love to
look into it both practically and theoretically.
