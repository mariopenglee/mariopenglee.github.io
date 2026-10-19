---
title: cyclediffusion: can a picture be a bottleneck?
date: 2026-10-17
summary: I trained a diffusion model so a captioner could read its pictures back into the original sentence. Instead of inventing a secret visual code, it collapsed into texture, and the reason is the reader you train against.
---

If you force a picture to carry a sentence, text to image and back to text,
does the picture stay something a person can read, or does it drift into a
private code only the captioner understands? I trained exactly that loop.
It didn't learn a code. Left alone it collapsed into carpet-like texture,
and the captioner happily described every image as "a man standing in front
of a wall that says 'The Wall'".

## the setup

The idea is an autoencoder whose bottleneck is a picture you can open and
look at, the same instinct as natural language autoencoders
([transformer-circuits, 2026](https://transformer-circuits.pub/2026/nla/))
but in pixels. It started as a project on relational representations in
visual models at UCLA's Computational Vision & Learning Lab, with Andrew Lee
and Hongjin Lu.

A caption goes into Stable Diffusion
([code](https://github.com/mariopenglee/cyclediffusion)), and a frozen
Pix2Struct captioner scores how likely the original caption is given the
generated image. That score is the cycle loss, and it trains the diffusion
UNet. For the gradient to reach the image I rewrote Pix2Struct's patch
extraction and flattening as pure tensor ops, so the whole loop is
differentiable. A second term, the usual denoising loss on real COCO
image-caption pairs weighted by lambda, ties the model to real pictures, and
lambda=0 is the pure cycle.

## what it learned

Each checkpoint generated images for 200 held-out COCO captions, scored by
the training critic (Pix2Struct), a captioner it never trained against
(BLIP), and CLIPScore:

```
change vs base              p2s_nll   blip_nll   clip
lambda=0, step 500            +0.14     +1.50    -13.0
lambda=1, step 750            -0.22     +0.18     -3.0
LoRA lambda=0.1, step 750     -0.11     +0.10     -1.5
```

With the pure cycle the images turn into carpet and stone-wall textures,
BLIP calls them "a close up of a carpet", and even the critic's own score
gets worse. With the anchor, the critic's score improves while BLIP and CLIP
get worse, so the generator is learning to please one specific reader rather
than to carry the meaning.

## the reader is the bottleneck

The reason is the critic. This Pix2Struct checkpoint was fine-tuned on
TextCaps, captions about text inside images, and even on the untouched model's
pictures it describes a kitchen as "a building with a clock that says
10:00". Train against it and the generator inherits that fixation on signs
and shirts that say things.

My takeaway is that a readable bottleneck is only as readable as the reader
you train it against. A narrow critic hands you its biases, and a loop with
nothing anchoring it to real images finds a degenerate picture, not a clever
code. Next I want to swap in BLIP-large as the reader and see whether a
captioner that actually describes scenes keeps the pictures honest.
