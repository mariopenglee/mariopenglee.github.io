---
title: Infinite context agents, at WIP London
date: 2026-04-18
summary: At WIP, an Index Ventures x Anthropic event for London AI builders, I presented memgit, git-backed memory that lets agents keep context across sessions instead of starting from zero.
---

![On stage at WIP: Index Ventures x Anthropic, London](/talk-anthropic-wip.jpg)

Agents forget everything between sessions, since the context window is the
only memory they have. In April I spent my slot at WIP, an event for
London's AI builders run by [Index Ventures](https://www.indexventures.com/)
and [Anthropic](https://www.anthropic.com/), on how we were fixing that at
nexos.ai. The lineup had people from Anthropic, Revolut, Wiz, ElevenLabs,
incident.io and a few others, and the thing I presented was still
pre-launch, about a month into building, so it was also a good room to get
early feedback from.

The problem slide was pretty simple. Agents are stateless by default, so
every session starts from zero. Decisions and preferences get lost between
conversations, and multi-week work means re-explaining the project again and
again, so nothing an agent learns compounds.

memgit has the agent organize its own memory (rather than keeping a pile of
chat logs) and stores it in git. So memory has full history and can branch,
roll back and merge like code. Search runs over both keywords and vectors
(pgvector), and storage is tiered, with a capped hot set in Postgres. That's
what the "infinite" in the title means, to be honest: the history keeps
growing, while what the agent loads stays bounded. Each time the agent wakes
up (a heartbeat), it rebuilds its context from git as a stack:

[[demo:memgit-stack]]

This is close to the memory model I built for
[nexos.heartbeat](#/blog/heartbeat), the always-on AI twin, and that post
goes deeper on why memory should be a git repo. The git part is still the
bit I like most. It makes an agent's memory something you can diff and
audit, which seems to me pretty underrated for anything that runs
unsupervised. Deciding what an agent actually needs in front of it is also
pretty close to what I work on now at [condense.chat](https://condense.chat/),
just from the compression side (more on that in the [adeline-v2 post](#/blog/adeline-v2-context-compaction-model)).

People were skeptical, which was useful, and the pushback came down to two
things. The first was collaboration: what happens when several agents (or
people) write to the same memory at once? To be honest I think this is
where git shines, since concurrent edits are exactly what it was built for.
You just make sure every writer keeps pulling and always rebases, and race
conditions become ordinary merges.

The second, stale information, was the fair one. If memory only grows,
old facts sit next to new ones and the agent can't always tell which is
current. I don't have a full answer yet. My guess is that semantic sharding
(splitting memory by topic, so an update replaces the right slice instead
of piling up next to it) is probably the way to solve it.

Still, it held up in practice. All of nexos's company data ran through it,
and it worked fine. It would remember a meeting you'd had, start a draft
from it, and connect that to the right Jira ticket and the people involved,
all natively, just an agent with the right context. Most people at the
event seemed to come around to the same point: the hard part isn't storing
more, it's that we keep trying to fit everything into the context window.

The [LinkedIn post](https://www.linkedin.com/feed/update/urn:li:activity:7451194940912463872/)
has the full lineup.
