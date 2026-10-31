---
title: Psychology for agent design, at Tesonet's AI conference
date: 2025-11-14
summary: At Tesonet's AI-Focused Conference in Vilnius I argued that a lot of agent failures are old psychology problems, and that organizing agents like a small team with clear roles helps.
---

![Speaking at Tesonet's AI-Focused Conference, Vilnius](/talk-tesonet.jpg)

LLMs learn from human language, so it'd be strange if they didn't pick up
some human failure modes too. They get overconfident, anchor on misleading
early information and echo the biases in their training data, which are
problems psychology and cognitive science have studied for decades. That was
the argument of my talk at Tesonet's AI-Focused Conference in Vilnius, which
opened their AI-Only Hackathon weekend, with speakers from Amazon, Google
Cloud Security and Hostinger (and of the write-up I published a few days later).

I organized it as three levels, going from a single exchange up to a team:

[[demo:psych-levels]]

The first two are about one agent. Getting a straight answer out of a
conversation borrows from interrogation research, which needs care. Long
research tasks hit something like bounded rationality, since context and
attention are finite, so the agent works in stages (gather, summarize, go
deeper) and feeds summaries forward.

The team level had the clearest number. In one evaluation I cited, splitting
a coding agent into an architect, developers, QA and DevOps, each with
context and skills for its role, took a coding benchmark score from 38.5 to
69.2 over one generalist agent. It's a single comparison, so I'd read the
gap as directional. Organizational psychology points the same way: small
teams with clear roles do better, and the rule of thumb is to stay around 5
to 8 agents, since past that more hierarchy mostly adds confusion (like too
many managers on a human team).

A few smaller patterns carried over as heuristics:

- **Working memory.** Miller's "about seven items" (later work like Cowan's
  puts it closer to four) doesn't transfer literally, since a context window
  is far bigger. The useful part is that performance drops before the limit,
  so agents should summarize or drop old dialogue and keep each exchange on
  one objective.
- **Theory of mind.** Agents that share context can model what their peers
  already know, which should cut duplicated work.
- **Biases.** Randomizing the order of facts is a cheap check against
  anchoring, and a devil's advocate agent helps against confirmation bias.

The caveat in the write-up still holds: agents aren't people, so none of
this maps one-to-one. My view is that a lot of what looks new in agent
design is the old problem of getting a group to think and work together, and
it'd probably be interesting to test more of those findings on agents
directly instead of rediscovering them.

The full write-up is
[Psychology-inspired agentic AI](#/blog/psychology-inspired-agentic-ai)
(originally on the nexos.ai LinkedIn page).
