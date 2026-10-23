---
title: A transformer that passes the wug test
date: 2026-10-16
summary: I fine-tuned T5 to turn spelling into IPA. Nobody told it English phonology rules, but it says "wugs" with a /z/ and "wuks" with an /s/, just like a kid does.
---

In 1958 Jean Berko Gleason showed children a made-up creature, said "this
is a wug", showed two of them and waited. The kids said "two wugs" with a
/z/ at the end, not an /s/, for a word they had never heard. There was
nothing to remember, so they must have learned a rule: the plural is voiced after a
voiced sound and devoiced after a voiceless one, so "bugs" ends in /z/ and
"bats" in /s/.

I wanted to know if a transformer that only ever sees spelling and
pronunciation learns that rule too, or basically just memorizes a dictionary.

## the setup

The task is grapheme to phoneme (G2P): text in, IPA out. Older G2P systems
are built from rules that linguists write by hand. I didn't give the model
any. I fine-tuned T5 small, base and large (60M to 770M parameters) on
about 113k English word and IPA pairs from ipa_dict, and added the IPA
symbols to the tokenizer so the model could actually write them. That's the
whole training signal: words and how they're pronounced, no phonology.

I also built two English to IPA sequence datasets for future work and put
them on Hugging Face
([ipa_dict_seq2seq](https://huggingface.co/datasets/mariopeng/openIPAseq2seq),
[OpenWebIPA](https://huggingface.co/datasets/mariopeng/openwebIPA)).

## the wug test

Then I gave every model words that aren't in the data, built as minimal
pairs:

```
prompt    t5-small    t5-base     t5-large
wuks      [wəks]      [wəks]      [wəks]
wugs      [wəgz]      [wəgz]      [wəgz]
musips    [məsəps]    [mjuzɪps]   [mjuzɪps]
```

All three models pass. "wuks" and "wugs" differ only in whether the
consonant before the s is voiced, and the models flip the plural from /s/
to /z/ exactly where a native speaker does. The /z/ in "wugs" can't be
copied from the spelling (the spelling says s), so it seems to me the model
picked up the rule itself.

[[demo:wug-test]]

The same thing shows up on loan words. No model would write the /ts/
cluster at the start of "tsunami", because English words can't start that
way. The bigger the model, the closer it got to how a native speaker says
words like "coyote", "chow mein" and "receipt". My guess is scale buys
phonotactics (the rules for which sound sequences are allowed) pretty much the
same way it buys syntax.

## what it means

A speaker's sense of what sounds like English ("brick" yes, "bnick" no)
comes from the words they know, and a model trained on nothing but words
ends up with a piece of the same knowledge. That makes these models a
cheap way to test ideas about how people learn sound rules, and since you
can look inside them, I'd love to find where in the network the voicing rule
actually lives.

The paper was published in the *UCLA Undergraduate Science Journal*
(2023) as "Transformer Phonotactics via IPA G2P Finetuning"
([preprint](https://drive.google.com/file/d/1UBAq5x_5ZNalz5k98V0eq55oVT-PO4VP/view)),
and you can try the model in the [demo](https://phonetic5.streamlit.app/).
