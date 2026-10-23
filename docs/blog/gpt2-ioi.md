---
title: GPT-2, IOI, and the sphex problem
date: 2025-05-21
summary: A wasp can look like it understands what it's doing right up until you move one thing. I poked at GPT-2's indirect-object circuit the same way, to see whether it understood the task or just had a routine that usually works.
---

The digger wasp Sphex drags its prey to the burrow, leaves it on the
threshold, goes in to check the nest, then comes back and hauls it in. Move
the prey a few inches while it's inside, and it drags it back to the
threshold and checks the nest *again*. You can run this loop forty times. The
behavior looks like understanding until you nudge one thing, and then it's
obviously a routine. Hofstadter named the trait sphexishness, and the
question I find it raises is: how would you tell the difference in a neural
network?

I spent some time on that with Buck Shlegeris at Redwood Research, poking at
GPT-2's indirect object identification (IOI) circuit. IOI is the task in
"When John and Mary went to the store, John gave a drink to ___", where the
model should say Mary. There's a celebrated paper that reverse-engineers the
exact circuit GPT-2 small uses for this
([Wang et al., "Interpretability in the Wild", 2022](https://arxiv.org/abs/2211.00593)):
specific attention heads that find the duplicated name, suppress it, and copy
the other one. It's clean, and it's real. My question was the sphex one: does
that circuit understand IOI, or does it have a routine that usually works on
the sentences it was measured on?

## perturb it and watch

So I [perturbed the inputs](https://github.com/mariopenglee/GPT2IOInotebooks)
and watched what held, which is just behavioral analysis: vary the stimulus,
see when the behavior breaks. A few things fell out:

- **Name priors beat the syntax.** Swap in a rare name and the circuit
  wobbles. It isn't tracking "the non-repeated entity" abstractly so much as
  leaning on how name-like and frequent the tokens are. Common names win
  arguments they shouldn't.
- **GPT-2 small will happily pick the subject as its own object** ("Josh went
  with Josh"), a thing the GPT-Neo models mostly learned to punish. So the
  "circuit" is partly a smaller model's tolerance for a degenerate answer.
- **Add entities and it degrades by falling back on heuristics.** With four
  names in play GPT-Neo tracks the referent noticeably better than GPT-2, and
  when GPT-2 breaks it breaks toward proximity and repetition: grab the
  nearest plausible name, or the one it just saw. Routines, not reasoning.

[[demo:ioi-perturb]]

None of this says the circuit paper is wrong. The circuit is there. It says
the circuit implements something narrower than "identify the indirect
object", and you only see the gap by moving the prey.

## the layers you need

The way I think about it now is that interpretability has layers of
abstraction, and they map almost one-to-one onto how we study people.
Behavioral analysis is the psychology layer: treat the model as a black box,
vary inputs, characterize what it does. Circuit analysis is the cognitive
science layer: name the mechanism, the heads and the information flow.
Single-neuron work is the neuroscience layer: the wiring underneath.

My view is you need all three, and the cheap one comes first. Behavioral
analysis is fast and needs no internals, and it's the layer that tells you
*what to explain* before you spend weeks explaining it. Skip it and you risk
reverse-engineering a beautiful circuit for a behavior the model doesn't
robustly have. The expensive layers validate and localize; the cheap layer
keeps them honest.

The open thread I'd like to pull on is making the perturbation search
automatic: instead of hand-designing the nudge that breaks a circuit, search
for it, the adversarial-example version of the sphex test. If a circuit
survives a hard search for its breaking input, that's a much stronger claim
to understanding than surviving the sentences someone happened to try.
Probably worth building.
