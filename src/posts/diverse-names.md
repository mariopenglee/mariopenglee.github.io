---
title: Why linguists keep writing about John and Mary
date: 2026-10-15
summary: In linguistics papers, 30% of male names are John and 31% of female names are Mary. A good list of names doesn't fix that, because people still pick from it. A random generator does.
---

Open a linguistics paper and look at the example sentences. "John thinks
Mary left." A survey of 927 papers in three major journals found that
30% of all male names were John and 31% of all female names were Mary.
Male arguments showed up twice as often as female ones, and they were the
ones doing things. Textbooks look the same, and they haven't changed much
since the 1990s.

To be honest, I don't think anyone chooses this. When an example needs a
name and you're at a whiteboard, you reach for the first one in your head,
and that one pretty much comes from the culture you grew up in.

## a list isn't enough

The obvious fix is a curated list of diverse names, and good ones already
exist. My intuition is that it doesn't go far enough, since picking from a
list is still picking, and over a semester the same unconscious pull comes
back (even with a balanced list and good intentions).

So with Maura O'Leary and Rainey Williams we built the
[Diverse Names Generator](https://diversenamesgenerator.com/), which takes
the choice away. You press generate, or swipe a card in the Android app,
and get a random name from a database linguists curate, so there's
basically no moment where the bias gets to act.

[[demo:name-draw]]

## making random usable

Random is only useful if instructors actually reach for it in class, so
every name comes with what you need at that moment:

- an IPA transcription, so you can say it confidently
- its usual gender association and the languages it comes from
- sometimes a recording, its native script, and famous people who share it

Filters keep the randomness compatible with the example. Semanticists need
one name per first letter so the initials don't collide in logic notation,
syntacticians need to match gender features, and one filter keeps to
English phonotactics for instructors worried about unfamiliar clusters.
Inside those constraints the pick is still random. The app downloads the
filtered set once with a single database call, then generates from that
local list, so it works offline in a classroom with bad wifi and never
shows the same name twice in a row.

The names come from users and students. Phonetics instructors can give
their students credit for submitting a name with a recording, which turns
an IPA exercise into something that ends up in front of other classes.
Linguists check every submission by hand before it goes into the pool.
When we published, the database had over 200 names from more than 30
languages.

## why the default matters

My view is that the bias here isn't really in anyone's values, it's in
which name comes to mind first, and that's pretty hard to train away.
Changing the default seems much easier than changing the person. I'd be
curious whether the same move works for other defaults in teaching
materials (example cities, job titles), probably interesting to check how
much the examples in a course actually shift once the generator is in use.

The paper is in the
[*Proceedings of the LSA*](https://journals.linguisticsociety.org/proceedings/index.php/PLSA/article/view/5541)
(2023), and we presented it at the LSA 2023 Annual Meeting.
