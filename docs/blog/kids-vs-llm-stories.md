---
title: Kids vs LLMs at telling a story
date: 2026-10-18
summary: Give a five year old and a language model the same wordless picture book. In 2024 the kids kept track of the characters far better than GPT-4. Two years of models later, the best ones tell the story just like the kids do.
---

Hand a five year old a wordless picture book and they'll tell you a story:
"a dog finds a paint can, and then he knocks it over, and then he sees a
cat..." The dog stays the dog the whole way through. In 2024, GPT-4 doing
the same task lost track of its characters much more often than the kids
did. Today the best models are indistinguishable from them.

## the setup

With Amalia Ionescu and Catherine Sandhofer at UCLA's Language and Cognitive
Development Lab, we had 31 children aged 4 to 6 narrate *Bow Meow Wow* by
Priya Kuriyan (Pratham Books, CC BY 4.0), a wordless book where a dog tips
over a paint can, meets a cat, and the two end up making a painting. They
went page by page. The models got the same pages, one image per turn, and
told stories of about the same length (115 to 200 words
vs the kids' 154).

To measure how well each storyteller keeps track of characters we used
coreference resolution ([FastCoref](https://github.com/shon-otmazgin/fastcoref)),
which groups every mention of the same entity ("a dog ... he ... the yellow
dog") into a chain. The longer the chains, the more the story keeps coming
back to the same characters instead of losing them.

## the result

Kids averaged 5.66 mentions per character. GPT-4 averaged 3.15, a huge gap
(Cohen's d = 2.2). Then we ran the same book through six models, 30 stories
each, and the gap shrinks with every generation:

```
model                 gap vs kids (d)
gpt-4 (2024)          2.20
gpt-4 turbo           1.85
gpt-5.5               1.75
gpt-6.1 sol           0.94
claude haiku 5.5      0.93
claude opus 5.5       0.42   (not significant)
claude sonnet 5.5     0.33   (not significant)
```

Opus and Sonnet tell this story with the same referential cohesion as a
four to six year old. No model goes past the kids yet.

## kids and models get there differently

Matching on chain length doesn't mean the stories look alike. Kids lean on
pronouns, "it ... it ... he", sometimes for a character they never actually
introduced: they left about 0.87 pronouns per story that couldn't be tied to
anyone, vs 0.20 or fewer for every model. Models do the opposite, introducing
each character explicitly and then varying how they refer to it ("a fluffy
dog", "the pup"). Same cohesion, different strategy. My guess is the kids
are narrating their own picture of the scene, while the models write for a
reader.

## what's next

Seems to me chain length is a good first measure, and frontier models have
basically caught up on it. The next thing I'd want to look at is whether a
storyteller introduces a character before referring back to it, and whether
the story has real causal structure ("he knocked it over, so the cat ran"),
which is much closer to what we mean by a coherent story. Code and model
outputs are [on GitHub](https://github.com/mariopenglee/llm-child-narratives)
(the children's transcripts stay private).
