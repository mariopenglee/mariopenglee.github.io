---
title: GPT-2, IOI, and the sphex problem
date: 2025-05-21
summary: Behavioral analysis of indirect object identification in GPT-2, the layers of abstraction in interpretability, and what a wasp taught me about evals.
---

Redwood Research's IOI paper found an actual circuit in GPT-2 small for
indirect object identification: given "When Mary and John went to the store,
John gave a drink to", the model says Mary, and you can name the attention
heads responsible. This project, which I worked on with Buck Shlegeris at
Redwood Research
([notebooks here](https://github.com/mariopenglee/GPT2IOInotebooks)), sat
one level above the circuit: pure blackbox, behavioral analysis. First
recreate the behavior and make sure it isn't some obvious pattern match,
then try to break it.

## the sphex problem

The sphex wasp drags a cricket to its burrow, goes inside to inspect, comes
back out, drags the cricket in. Move the cricket an inch while it inspects
and the wasp restarts the whole routine, every time, forever. The behavior
looks deliberate right up until you perturb it.

A model that completes IOI correctly looks like it understands who has the
drink. At the behavioral level, the only way to tell understanding from
routine is the same as with the wasp: move the cricket.

## moving the cricket

The setup was a template grid, "When {A} and {B} got a {O} at the {P}, {B}
decided to give it to", with name, object, and place lists, both orderings,
and then progressively meaner variants: gender splits, four entities,
duplicate mentions, forcing counts. Run across GPT-2 small and large, and
GPT-Neo 125M through 20B for comparison.

The behavior degrades pretty much the way sphexishness predicts. Common
names like John and Mary win out almost independently of syntax, so the
"grammar" bends to name priors. GPT-2 small happily lets the subject be its
own object (Josh predicted to be with Josh). Add a third and fourth entity
and consistency collapses into what looks like proximity and pattern
matching rather than syntactic structure. The IOI circuit is real, but
behaviorally it's a routine with narrow scope, wrapped in heuristics that
take over the moment you step outside it.

## layers of abstraction

The way I've come to see it, interpretability has the same stack as the
mind sciences. Behavioral analysis is the psychology of models: cheap,
fast, and it tells you what the system does and exactly where it stops
doing it. Circuit-level mech interp is the cognitive science: it proposes
the algorithm. Head and neuron-level work is the neuroscience, basically
the biology underneath.

No layer wins, they validate hypotheses at different granularities. Our
perturbations couldn't say which heads do what, but they constrain what any
circuit story must and must not explain, without opening the model. The
lower levels then explain why the behavior breaks exactly where it does.
You want agreement across layers, the same way a psychology finding gets
more credible when the neuroscience backs it.

Part of the bet was also to start small on purpose: if we can't understand
GPT-2 small, understanding bigger models will be harder, and hopefully what
we learn extrapolates. Where it doesn't extrapolate, that's a finding too.

## the concrete findings

- Name priors dominate syntax. Swapping in common names like John and Mary
  flips predictions even when the sentence structure says otherwise, and
  much of the run-to-run inconsistency traces back to which names you drew.
- Gender bias is measurable but small at this scale, and looks similar
  between GPT-2 small and GPT-Neo 125M.
- GPT-2 small barely penalizes the subject being its own object (Josh
  predicted to be with Josh); the Neo models punish this much harder.
- With four entities, GPT-Neo clearly beats GPT-2 at tracking who's with
  whom, which suggests syntactic structure improves with scale.
- Once names and syntax conflict, what remains of GPT-2's behavior is well
  described by proximity and repetition-count heuristics: you can steer the
  prediction just by mentioning an entity more often.

## what stuck with me

This project shaped how I evaluate systems today more than any single
result in it. A passing benchmark is the wasp dragging the cricket: it
looks like competence, and it might be. So perturb before trusting, and
work at the cheapest level of abstraction that can falsify your current
hypothesis before descending a level. Behavioral first, mechanistic when
the behavior earns it. I keep finding that this applies to agents in
production just as much as to GPT-2 small, and honestly the wasps are
everywhere once you start looking.
