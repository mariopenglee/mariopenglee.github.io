---
title: block-GRPO: RL for diffusion LLMs
date: 2026-05-09
summary: Per-block log-prob estimation for block-autoregressive diffusion language models, and why evolutionary algorithms feel like the natural next step.
---

Diffusion language models generate text by iteratively unmasking tokens
instead of predicting them left to right. They're fast and parallel, and
they're also pretty hostile to reinforcement learning, since policy gradient
methods like GRPO need `log π(completion | prompt)`, and for a diffusion LM
that likelihood is intractable.

The [d1 paper](https://arxiv.org/abs/2504.12216) opened this door with
diffu-GRPO: estimate the log-prob with a single forward pass over a fully
masked completion, treating all tokens as conditionally independent. It
works, but the approximation is blunt, one big conditional independence
assumption over the entire completion, say 512 tokens at once.

block-GRPO starts from a simple observation about the newer generation of
models.

## use the factorization the model already has

Block-autoregressive diffusion models (I build on
[Fast-dLLM v2](https://huggingface.co/Efficient-Large-Model/Fast_dLLM_v2_7B),
a Qwen-based 7B) don't denoise the whole sequence at once. They generate
block by block: autoregressive across blocks, diffusion within each block.
Which means the cross-block factorization is exact by construction:

```
log π(c | p) = Σ_k  log π(b_k | p, b_<k)
```

Prior RL work on diffusion LMs treats the completion as one diffusion blob
anyway and throws that structure away. Seems to me that's leaving
information on the table. block-GRPO keeps the chain rule exact across
blocks and only approximates within a block, shrinking the conditional
independence surface from completion length (512) down to block length (32).
A 16x smaller approximation, and it's aligned with the architectural bias
the model was actually trained with.

For the within-block term I implemented three estimators:

- masked: the d1 baseline, mask the whole block, one forward pass, biased
- per-block ELBO: the default, a continuous-time masked diffusion ELBO with
  an independent `t_k ~ U(0.01, 1)` per block, so K blocks give K
  independent Monte Carlo samples per sequence
- Gauss-Legendre quadrature: fixed nodes on [0, 1] instead of sampling t,
  which removes the t-variance entirely at the cost of N forward passes

## the bugs taught me the most

The estimator math is honestly half the story, the other half is everything
that breaks silently. Three favorites:

- The AR logit shift. Fast-dLLM v2 keeps the autoregressive convention that
  `logits[i]` predicts `token[i+1]`. Score a block with the intuitive
  slicing and you're grading every token against its neighbor. Off by one,
  and invisible in the loss curves.
- The EUBO formula. My upper bound estimator computed log-of-sum where the
  paper specifies sum-of-logs. The gap grows with block length, O(32) at
  production size. A strict math test caught it, staring at reward curves
  never would have.
- Per-iteration mask seeds. With multiple PPO iterations per batch, the old
  code reused masks from generation time, and the mismatch produced NaN
  gradients just often enough to be confusing. Deterministic per-iteration
  seed derivation fixed it.

This is why the repo has a three-tier test suite (106 CPU math tests against
closed-form values, GPU smoke tests on the real model, then small end-to-end
training runs) before I let myself believe any result.

## what it buys

On a deliberately small probe (10 GSM8K prompts x 400 steps, so signal shows
up fast), vanilla GRPO with KL lands around +0.017 tail reward. Stacking the
pieces (per-block ELBO, SPG's sandwich of lower and upper bounds routed by
advantage sign, StableDRL's self-normalizing stabilizer) first collapsed to
zero. The fix turned out to be one line: the importance ratio has to come
from the ELBO surface only, decoupled from the EUBO used in the loss. The
same run went to +0.158. Roughly an order of magnitude over the baseline on
the same compute.

## why evolution feels like the natural next step

If there's one thing this project taught me, it's that the hard part of RL
for diffusion LLMs is estimating log-probs. Every estimator above (masked,
ELBO, quadrature, sandwiched bounds) is an increasingly elaborate workaround
for a quantity the model fundamentally doesn't want to give us.

Evolutionary algorithms sidestep the question entirely. Evolution strategies
only need samples and scores: generate completions, compute rewards, update
by reweighting perturbations. No log π, no estimator bias, no importance
ratios to stabilize. For autoregressive models that trade is usually not
worth it, since exact log-probs are basically free there. For diffusion LMs
my intuition is the calculus flips: the gradient is the expensive, biased
part, and the population is cheap, since diffusion models generate fast and
in parallel, which is exactly the throughput evolution wants.

And GRPO is already halfway there. It samples a group of rollouts and scores
each against the group mean, which is basically a population and a relative
fitness function. The only thing it inherits through gradients is the policy
update itself. Replace that step with selection and recombination
(weight-space merging gives a pretty natural crossover operator) and you get
an optimizer that never needs the likelihood at all.

That's the experiment I'm setting up next. Whether it can match the
gradient-based runs is unclear so far, and honestly that's what makes it
interesting. Would love to find out.
