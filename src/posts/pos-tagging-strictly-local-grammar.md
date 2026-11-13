---
title: My strictly local grammar POS tagger ignored the words
date: 2026-11-13
summary: My 2022 POS tagger, a strictly local grammar of tags, got 9 to 22% on the Brown corpus because it never sees the words. Rerun as a bigram HMM it reaches 60% on 20 training sentences and 90% on 2,000.
---

I recently found the final project I wrote for LING 185A (computational
linguistics) at UCLA in fall 2022: a part-of-speech (POS) tagger built from a
probabilistic strictly local grammar (PSLG), written from scratch in Haskell.
It got 22% accuracy at best, and the paper put most of the blame on human
language being too rich for a local grammar. Reading it again four years
later, my view is that the main cause is simpler: the model never looks at
the words. So I reran it with that one term added, and on 500 held-out
sentences accuracy goes from 18.7% to 43.3% with the same 20 training
sentences, and to 89.7% with 2,000 once the rest of a standard tagger is in.

## what I built

A strictly 2-local grammar (SL-2), near the bottom of the subregular
hierarchy (the classes of languages simpler than the regular ones), decides
whether a string is allowed from its adjacent pairs of symbols alone. Making
it probabilistic gives a bigram model with a start distribution $I$,
transition probabilities $T$ and stop probabilities $F$, so a string of tags
gets

$$
P(t_1 \dots t_n) = I(t_1)\,T(t_1,t_2)\cdots T(t_{n-1},t_n)\,F(t_n)
$$

To tag a sentence of $n$ words, the tagger (I called it LinearTagging)
enumerated every tag sequence of length $n$, scored it and kept the best one.
Rereading the code I noticed it actually skipped the last transition, scoring
the final tag with $F$ alone (a bug I only caught now, and the demo below
copies it so it matches the paper's outputs). I also built a variant,
CrossTagging, where a tag at position $k$ could use the transitions of any
tag seen at position $k$ in training, so it could use bigrams it had never
seen.

Training data was 20 sentences from the [Brown
corpus](https://en.wikipedia.org/wiki/Brown_Corpus), and evaluation was the
first 5 words of 20 held-out sentences. I compared three cleanup passes:
dropping punctuation, also stripping Brown's headline and title tag suffixes
(`-hl`, `-tl`), and also merging plural nouns `nns` into `nn`.

| tagger | raw | no punctuation | + no -hl/-tl | + nns to nn |
|---|---|---|---|---|
| LinearTagging | 0% | 6% | 8% | 9% |
| CrossTagging | 16% | 20% | 20% | 22% |

That's 100 tokens, so a point is a token, and the 1 to 2 point steps between
cleanup passes are noise. The paper still read the punctuation result as
evidence that people ignore punctuation when tagging, which was reading a lot
into 100 tokens.

## why accuracy was low

The formula has no word term in it, so the grammar only knows which tag
follows which, and for a given sentence length the best tag sequence is
fixed whatever the words are. Try it below with the exact grammar from the
paper's appendix (trained on a toy corpus of sentences like "the very fuzzy
cat" and "the cat on the mat"):

[[demo:length-tagger]]

"the big red dog" comes out as D Adv Adj N, and so does any other 4-word
sentence. The 2022 paper did notice this ("for any sentence of 4 words, a
LinearTagging PSLG trained on corpus3 will predict DAdvAdjN"), and its last
paragraph of discussion even says the model assumes words don't matter for
POS tagging. But it treated that as one point among several and put the
weight on the limited horizon assumption (each tag depends only on the
previous one) and on natural language not being context free. Honestly, my
view is that neither was the main issue. A bigram over tags is a fine
backbone for a tagger, as long as you also multiply in how likely each word
is under each tag. That's a [hidden Markov
model](https://en.wikipedia.org/wiki/Hidden_Markov_model) (HMM): the tags are
the hidden state chain and the words are emissions,

$$
\hat t_{1:n} = \arg\max_{t_{1:n}} I(t_1) \prod_{i} T(t_{i-1}, t_i)\,P(w_i \mid t_i) \cdot F(t_n)
$$

The paper's conclusion recommended HMMs as future work, so I was in the
right neighborhood, just for a slightly wrong reason (I framed the missing
piece as more state memory, when it was the $P(w_i \mid t_i)$ term).

## related work

For a sense of scale, [TnT](https://arxiv.org/abs/cs/0003055) (Brants,
2000) is basically this HMM with tag trigrams instead of bigrams, plus
smoothing and a suffix model for unknown words. It gets 96.7% on both the
Penn Treebank and the German NEGRA corpus, and its learning curve shows
78.6% on the Penn Treebank when trained on only 1,000 tokens. TnT also
spends a good chunk of the paper on smoothing, because an unseen trigram
gets probability zero, and a zero anywhere in the product kills the whole
sequence. With about 500 training tokens most tag bigrams are unseen, so my
best guess for why CrossTagging beat LinearTagging (the question the paper
ended on) is that its borrowing was a crude form of smoothing that let more
sequences compete.

## rerun

I reran it in Python on the [Natural Language Toolkit
(NLTK)](https://www.nltk.org/)'s copy of Brown, with the same cleanup as the
paper's last pass (plus lowercasing). The paper doesn't say which 20
sentences it used, and no run of 40 consecutive NLTK Brown sentences matches
its reported average lengths, so this is a fresh split: the first 20
sentences for training (458 tokens, 47 tags), scored on the paper's protocol
(first 5 words of the next 20 sentences, 94 tokens since two are shorter
after cleanup) and on 500 full held-out sentences (10,572 tokens, all from
the news section like the training set). Each row adds one change to the
row above, and decoding is Viterbi (dynamic programming over the tag
lattice, instead of enumerating every sequence like the 2022 code did).

| model | 5 words x 20 | 500 sentences |
|---|---|---|
| PSLG, 2022 code (skips last $T$) | 13% | 15.5% |
| PSLG | 27% | 18.7% |
| PSLG + add-one on $I$, $T$, $F$ | 27% | 19.3% |
| HMM (PSLG + $P(w \mid t)$, add-one) | 43% | 43.3% |
| HMM + hapax unknown words | 47% | 52.7% |
| HMM + hapax + add-one on $I$, $T$, $F$ | 62% | 60.4% |
| most frequent tag per word | 62% | 60.6% |

The word-blind PSLG lands between 13% and 27%, the same range as 2022, and
add-one (Laplace) smoothing doesn't move it, as expected since the answer
is still fixed by length. Adding $P(w \mid t)$ more than doubles accuracy
(18.7% to 43.3%).

Most of what's left is unknown words: 59% of held-out tokens never
appear in the 458 training tokens. With add-one emissions an unseen word is
about equally likely under every tag, so the tag chain decides. The hapax
trick treats an unknown word like the words seen once in training (mostly
nouns, adjectives and verbs here), which gets 52.7%.
Smoothing $I$, $T$ and $F$ too gets 60.4%, basically tied with a lookup
table that gives each known word its most frequent tag and guesses noun for
the rest (95.6% vs 94.8% on known words, 36.3% vs 37.2% on unknown ones).
At 20 sentences there's just not much for the tag chain to add.

With more data it does. Trained on 2,000 sentences (37,106 tokens, unknown
rate down to 14%), the same HMM gets 89.7% on the same 500 sentences against
84.8% for the lookup table. A suffix model for unknown words and trigrams
would be next, which is basically rebuilding TnT step by step. The
[script](/code/pos-tagger-rerun.py) is about 130 lines of Python (needs
`nltk`) if you want to rerun it.
