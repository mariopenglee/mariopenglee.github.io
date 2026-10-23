---
title: block-GRPO: doing RL on a diffusion language model
date: 2026-05-09
summary: GRPO needs a log-probability that diffusion LLMs can't give you cheaply. The fix is to use the model's own block-autoregressive structure, and a few bugs later it beat vanilla GRPO by about 10x on tail reward.
---

GRPO needs one number from your model: the log-probability of the sequence
it just generated. An autoregressive model hands it over for free. A
diffusion language model doesn't, and to be honest that gap is most of what
makes RL on one hard.

GRPO (group relative policy optimization, from DeepSeekMath, Shao et al.
2024) is the workhorse behind a lot of recent reasoning models. You sample a
group of completions, score them, and push the policy toward the
above-average ones, weighted by `log π(sequence)`. It basically assumes
that log-prob is exact and cheap. On a diffusion LLM it's neither, since
the model defines the sequence through an iterative denoising process, not a
left-to-right product of conditionals, so the exact likelihood is a sum over
denoising paths you can't enumerate.

## what diffu-GRPO did, and where it leaks

The prior work here is d1
([arxiv 2504.12216](https://arxiv.org/abs/2504.12216)), whose diffu-GRPO
estimates the log-prob with a one-step approximation under random masking. It
works, but the estimate is biased in a way that compounds over training, so
you end up optimizing a noisy proxy (and the noise isn't mean-zero).

My angle was to stop fighting the model's structure and use it. The target
here, Fast-dLLM v2
([weights](https://huggingface.co/Efficient-Large-Model/Fast_dLLM_v2_7B)),
isn't pure diffusion: it's block-autoregressive. It generates a block at a
time, left to right across blocks, denoising within each block. Seems to me
that's pretty much the handle GRPO wants: the sequence log-prob is exact
across blocks (a real chain rule over the block order) and only needs
approximating inside each one, so the hard part shrinks from the whole
sequence to a single block.

[[demo:block-factorization]]

## three estimators for the within-block term

Within a block you still owe an intractable likelihood, so I tried three
ways to approximate it, trading bias for compute:

- **Masked (baseline):** the cheap one-step estimate, kept for comparison.
- **Per-block ELBO (default):** a proper evidence lower bound on the block
  likelihood, averaged over masking levels. More compute than masked, much
  less bias, and it's a bound rather than a point guess.
- **Gauss-Legendre quadrature:** treat the masking-level average as an
  integral and place the evaluation points by quadrature instead of
  sampling, which gets the same accuracy from fewer samples.

The ELBO is the one I'd reach for by default. It's the cleanest
bias-for-compute trade, and it degrades gracefully when you can't afford
many samples.

## the bugs were most of the work

Honestly the idea was the easy part. Three bugs ate most of the time, all
of the silent kind that train fine and learn the wrong thing:

- **An off-by-one in the AR logit shift.** Standard next-token alignment,
  wrong by one position at the block boundary, so the log-prob was scoring a
  shifted sequence (which quietly poisons every gradient).
- **A log-of-sum where the math wanted sum-of-logs** in the bound (it had
  become an upper bound, an EUBO, with the wrong reduction). Jensen's
  inequality points the other way, so the "lower bound" wasn't one.
- **Reused mask seeds across iterations**, which correlated the estimates
  and shrank the effective sample size without telling you.

None of these throws an error, they just bias the estimate. The only way I
found to catch them was deriving the quantity by hand and checking the code
computes that and not some plausible neighbor.

With those fixed, block-GRPO with the ELBO estimator beat vanilla GRPO by about 10x on
tail reward over training (+0.158 vs +0.017). My view is the tail is the
number to watch, since that's where the hard prompts live.

## where this goes

What I keep coming back to is that all of this complexity exists to get a
usable gradient through an intractable likelihood. Evolution strategies
(Salimans et al. 2017,
[arxiv 1703.03864](https://arxiv.org/abs/1703.03864)) skip that entirely:
perturb the parameters, keep what scores better, never compute a log-prob at
all. For a model whose likelihood is this awkward, trading exact gradients
for black-box search might be the natural move rather than a fallback. Probably
worth running ES head-to-head against block-GRPO on the same reward, one
variable at a time, and seeing which actually wins. Would love to look into
it.
