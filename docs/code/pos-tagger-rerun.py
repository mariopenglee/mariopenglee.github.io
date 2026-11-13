"""Rerun of the 2022 LING 185A PSLG tagger, plus the word term (bigram HMM).
Train: first 20 Brown sentences. Evals: (a) first 5 words of the next 20
(paper's protocol, 94 tokens once punctuation is dropped), (b) full sentences of 500 held-out sentences."""
import os, math
from collections import Counter, defaultdict
import nltk
if 'NLTK_DATA' in os.environ: nltk.data.path.insert(0, os.environ['NLTK_DATA'])
nltk.download('brown', quiet=True)
from nltk.corpus import brown

PUNCT = {",", "''", ".", "(", ")", "--", "``", ":"}

def sanitize3(sent):  # mirrors the paper's Haskell sanitize3
    out = []
    for w, t in sent:
        t = t.lower()
        if t == 'nns': t = 'nn'
        if '-' in t and t != '--': t = t[:-3]
        if w in PUNCT: continue
        out.append((w.lower(), t))
    return out

S = [sanitize3(s) for s in brown.tagged_sents()]
S = [s for s in S if s]
train, dev20, big = S[:20], S[20:40], S[100:600]

def fit(train):
  global I, F, T, E, tagc, TAGS, V, N, HAP, VOCAB
  I, F, T, E, tagc = Counter(), Counter(), defaultdict(Counter), defaultdict(Counter), Counter()
  for s in train:
    tags = [t for _, t in s]
    I[tags[0]] += 1; F[tags[-1]] += 1
    for a, b in zip(tags, tags[1:]): T[a][b] += 1
    for w, t in s: E[t][w] += 1; tagc[t] += 1
  TAGS = sorted(tagc)
  VOCAB = {w for s in train for w, _ in s}
  V = len(VOCAB) + 1
  N = len(train)
  wc = Counter(w for s in train for w, _ in s)
  HAP = Counter(t for s in train for w, t in s if wc[w] == 1)  # tags of words seen once
fit(train)
NEG = float('-inf')
lg = lambda x: math.log(x) if x > 0 else NEG

# the paper's PSLG: T(a,b) and F(a) share one distribution over "next tag or STOP"
def pT(a, b, sm):
    return (T[a][b] + 1) / (tagc[a] + len(TAGS) + 1) if sm else T[a][b] / tagc[a]
def pF(a, sm):
    return (F[a] + 1) / (tagc[a] + len(TAGS) + 1) if sm else F[a] / tagc[a]
def pI(t, sm):
    return (I[t] + 1) / (N + len(TAGS)) if sm else I[t] / N

def pE(t, w, hap=False):
    if not hap: return (E[t][w] + 1) / (tagc[t] + V)  # add-one, one unknown-word slot
    # hapax trick: an unknown word looks like a word seen once in training
    c = HAP[t] if w not in VOCAB else E[t][w]
    return max(c / tagc[t], 1e-6)  # tiny constant floor so no word-tag pair is impossible

def viterbi(words, emit=False, bug=False, hap=False, sm=False):
    n = len(words)
    score = {t: lg(pI(t, sm)) + (lg(pE(t, words[0], hap)) if emit else 0) for t in TAGS}
    back = []
    for i in range(1, n):
        last = bug and i == n - 1  # the 2022 Haskell skipped T on the last step
        new, bp = {}, {}
        for b in TAGS:
            best, arg = NEG, None
            for a in TAGS:
                tp = pT(a, b, sm)
                if tp == 0: continue          # transition must exist
                v = score[a] + (0 if last else math.log(tp))
                if v > best: best, arg = v, a
            new[b] = best + (lg(pE(b, words[i], hap)) if emit else 0); bp[b] = arg
        score = new; back.append(bp)
    end = {t: score[t] + lg(pF(t, sm)) for t in TAGS}
    t = max(end, key=end.get)
    if end[t] == NEG: return None             # every sequence has probability 0
    path = [t]
    for bp in reversed(back): path.append(bp[path[-1]])
    return path[::-1]

def baseline(words):  # most frequent training tag per word, unknown words get the top tag
    top = tagc.most_common(1)[0][0]
    return [max(TAGS, key=lambda t: E[t][w]) if w in VOCAB else top for w in words]
def unk_rate(sents): return sum(w not in VOCAB for s in sents for w, _ in s) / sum(map(len, sents))

MODELS = {
    'PSLG, 2022 code (skips last T)': lambda w: viterbi(w, bug=True),
    'PSLG': lambda w: viterbi(w),
    'PSLG + add-one on I, T, F': lambda w: viterbi(w, sm=True),
    'bigram HMM (PSLG + P(w|t))': lambda w: viterbi(w, emit=True),
    'HMM + hapax unknowns': lambda w: viterbi(w, emit=True, hap=True),
    'HMM + hapax + add-one on I, T, F': lambda w: viterbi(w, emit=True, hap=True, sm=True),
    'most frequent tag per word': baseline,
}
BEST = MODELS['HMM + hapax + add-one on I, T, F']

def acc(model, sents, k=None, known=None):  # no-answer sentences count as all wrong
    right = tot = none = 0
    for s in sents:
        s = s[:k] if k else s
        words, gold = [w for w, _ in s], [t for _, t in s]
        pred = model(words)
        if pred is None: none += 1; pred = [None] * len(words)
        for w, p, g in zip(words, pred, gold):
            if known is None or (w in VOCAB) == known: right += p == g; tot += 1
    return right, tot, none

print(f"unknown tokens: 5-word/20 {unk_rate([x[:5] for x in dev20]):.0%}, full/500 {unk_rate(big):.0%}")
print(f"train: {len(train)} sents, {sum(map(len, train))} tokens, {len(TAGS)} tags")
for name, m in MODELS.items():
    r1, t1, n1 = acc(m, dev20, 5)
    r2, t2, n2 = acc(m, big)
    print(f"{name:34s} 5-word/20: {r1}/{t1} ({100*r1/t1:.0f}%, {n1} no-answer)   "
          f"full/500: {100*r2/t2:.1f}% of {t2} ({n2} no-answer)")

for name in ('most frequent tag per word', 'HMM + hapax + add-one on I, T, F'):
    k, u = acc(MODELS[name], big, known=True), acc(MODELS[name], big, known=False)
    print(f"{name:34s} known words {100*k[0]/k[1]:.1f}% of {k[1]}, unknown {100*u[0]/u[1]:.1f}% of {u[1]}")

fit(S[600:2600])
for name in ('most frequent tag per word', 'HMM + hapax + add-one on I, T, F'):
    r, t, nn = acc(MODELS[name], big)
    print(f"{name:34s} trained on 2000 sents ({sum(map(len, S[600:2600]))} tokens, unknown {unk_rate(big):.0%}): full/500 {100*r/t:.1f}% ({nn} no-answer)")
fit(train)
# self-check: the word term must beat the word-blind PSLG on the big set
assert acc(BEST, big)[0] > acc(MODELS['PSLG + add-one on I, T, F'], big)[0]
