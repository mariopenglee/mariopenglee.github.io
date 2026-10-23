---
title: Where role collapse happens in diffusion models
date: 2026-10-23
summary: Prompt SDXL for a mouse chasing a cat and you usually get a cat chasing a mouse. My first suspect was CLIP reading prompts as a bag of words, but after ruling out the encoder, guidance, and cross-attention, the problem seems to sit in the UNet itself.
---

If you prompt SDXL with "a mouse chasing a cat", about three times in four you
get a cat chasing a mouse. The same goes for "a horse riding an astronaut" or
"a doll holding a grandpa": both entities show up, in the roles they usually
have. [Malakouti and Kovashka](https://arxiv.org/abs/2503.10037) call this role
collapse. I wanted to know which part of the pipeline is responsible, so I went
through the obvious suspects one at a time. My answer so far is that the text
encoder isn't the problem: the denoiser seems to get the roles and draws the
usual pairing anyway.

The prompts follow their RoleBench setup: 10 relations, each in a common
direction and a rare reversed one, active and passive voice, 4 images per
prompt. A vision-language judge labeled each image correct, reversed, or
neither. On a few hundred images I labeled myself, it sometimes calls a
direction where I'd say neither (so the reversed rates are probably a bit
high), but when it picks a direction it agrees with me.

## suspect one: CLIP

This was my first guess. CLIP is known to treat captions a lot like a bag of
words ([Yuksekgonul et al., 2023](https://arxiv.org/abs/2210.01936)), and it
reads left to right, so in "a photo of one cat chasing one mouse" the cat token
is computed before the verb exists. A linear probe for the role of the first
noun sits at chance (0.50) in both of SDXL's CLIP encoders, so SDXL really is
getting role-blind noun tokens.

T5-XXL is the opposite. The first noun's role is decodable at about 1.00,
including on relations the probe never saw, and in later layers the probe also
works on sentences like "one mouse that one cat is chasing", which have no
"being" in them. My read is that T5 encodes the actual role, not just word order.

SD3.5-Large uses T5 alongside CLIP, which makes it a clean test. If CLIP were
the cause, SD3.5 should do better. It doesn't:

```
rare prompts, reversed rate
SDXL                       0.74
SD3.5-Large                0.72-0.75
SD3.5, T5 only             0.45-0.57
```

Zeroing the CLIP inputs lowers the reversed rate, but almost all of that moves
to "neither" (a missing lion, a baby held instead of fed), and correct only
goes up by about 4 points. When both entities are drawn, they still have the
usual roles.

## suspect two: weak conditioning

Maybe the model has the roles but the prior outweighs them, and stronger
guidance would push them through. On SDXL, CFG 3, 7, and 12 all leave rare
prompts 68-74% reversed, and so does passive voice (78%) and IterComp, a
fine-tune trained for composition (76%). The pictures do change between
settings, just not who is doing what.

[[demo:role-collapse-rates]]

## suspect three: cross-attention

Another option is that the noun tokens leak into each other's image regions.
They don't seem to. In reversed images the attention maps for the two nouns
are as separate as in correct ones (top-10% IoU 0.054 vs 0.053). Each noun gets
its own region, and the model draws that entity in its usual pose.

## suspect four: some part of the conditioning

Last, I tried splicing on SDXL: replace the verb, EOS, or pooled embedding with
the one from the role-swapped prompt and see whether the drawn roles follow.
None of these moved the reversed rate by more than about 4 points, which is
within noise. My guess at why comes from comparing the two prompts with no
splicing at all:

```
P(drawn as "A verbs B"), prompt "A verbs B" vs "B verbs A"
common pairs     0.76 vs 0.74
other pairs      0.48 vs 0.45
```

Swapping the whole sentence changes the result by about 3 points. Most of the
outcome is set by which two nouns are in the prompt, so there isn't much role
signal for a splice to find.

## what's left

That leaves the denoiser itself (the UNet in SDXL, the MMDiT in SD3.5). With
T5 the roles are in the text embedding, and SD3.5 draws what's typical for the
noun pair anyway.

If the failure really is inside the UNet, then a
model that does draw reversed roles, like the LoRA from the ReBind paper, should
differ from base SDXL somewhere in there. My plan is to train a
[block-sparse featurizer](https://arxiv.org/abs/2606.25234) (BSF, a sparse
autoencoder whose features are small subspaces) on UNet activations from both
models, and look for a block that tracks the reversal. The part I'm most
curious about is whether that block is separate from the ones for the subject
and object. If it is, role would be its own feature in the UNet, something you
could probably steer directly.
