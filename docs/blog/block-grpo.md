---
title: block-GRPO: doing RL on a diffusion language model
date: 2026-05-09
summary: GRPO needs a log-probability that diffusion LLMs can't give you cheaply. Using the model's own block-autoregressive structure makes most of it exact, and it beat vanilla GRPO by about 10x on tail reward.
---

GRPO needs one number from your model: the log-probability of the sequence
it just generated. An autoregressive model gives you that number for free. A
diffusion language model doesn't, and to be honest that's most of what makes
RL on one hard. My workaround was to use the model's own block structure to
make most of that number exact. It beat vanilla GRPO by about 10x on tail
reward.

GRPO (group relative policy optimization, from DeepSeekMath, Shao et al.
2024) is the workhorse behind a lot of recent reasoning models. You sample a
group of completions, score them, and push the policy toward the ones that
did better than the group average, weighted by $\log \pi(\text{sequence})$.
It basically assumes you can get that log-prob exactly, and cheaply. On a
diffusion LLM you can't do either. The model doesn't write the sequence left
to right as a product of conditionals. It writes it by denoising over many
steps, and the exact likelihood is a sum over all the denoising paths, which
you have no way to enumerate.

## what diffu-GRPO did, and where it leaks

The prior work here is d1
([arxiv 2504.12216](https://arxiv.org/abs/2504.12216)). Its diffu-GRPO
estimates the log-prob in one step under random masking. That works, but the
estimate is biased, and the bias adds up over training. So you end up
optimizing a noisy proxy (and the noise isn't mean-zero).

I wanted to stop fighting the model's structure and use it instead. The
model I was training, Fast-dLLM v2
([weights](https://huggingface.co/Efficient-Large-Model/Fast_dLLM_v2_7B)),
isn't pure diffusion: it's block-autoregressive. It generates one block at a
time, left to right across blocks, and denoises within each block. Seems to
me that's pretty much the handle GRPO needs. Across blocks, the sequence
log-prob is exact (it's a real chain rule over the block order). You only
have to approximate the log-prob inside each block. Instead of approximating
it for the whole sequence, you approximate it for one block at a time.

[[demo:block-factorization]]

## three estimators for the within-block term

Inside a block you still have to deal with an intractable likelihood. I
tried three ways to approximate it, each trading bias for compute:

- **Masked (baseline):** the cheap one-step estimate, kept to compare
  against.
- **Per-block ELBO (default):** a proper evidence lower bound (ELBO) on the
  block likelihood, averaged over masking levels. It costs more compute than
  masked and has much less bias, and it's a bound, not a point guess.
- **Gauss-Legendre quadrature:** you treat the average over masking levels
  as an integral and pick the evaluation points by quadrature instead of
  sampling them. You get the same accuracy from fewer samples.

The ELBO is the one I'd use by default. I think it's the cleanest trade of
bias for compute, and it doesn't fall apart when you can't afford to take
many samples.

## the result

Block-GRPO with the ELBO estimator beat vanilla GRPO by about 10x on tail
reward over training (+0.158 vs +0.017). My view is that the tail is the
number to watch, since that's where the hard prompts are. It's also where a
biased log-prob hurts the most. When only a few completions in a group score
well, the update depends almost entirely on their log-probs. Any error in
those log-probs gets amplified instead of averaged out.

## where this goes

What I keep coming back to is that all of this work is there to get a usable
gradient through an intractable likelihood. Evolution strategies (Salimans
et al. 2017, [arxiv 1703.03864](https://arxiv.org/abs/1703.03864)) skip that
entirely. You perturb the parameters, keep what scores better, and never
compute a log-prob at all. For a model whose likelihood is this awkward to
compute, trading exact gradients for black-box search might be the natural
move rather than a fallback. It's probably worth running ES head-to-head
against block-GRPO on the same reward, changing one variable at a time, to
see which one actually wins. Would love to look into it.
