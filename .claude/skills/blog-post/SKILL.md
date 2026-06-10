---
name: blog-post
description: Write or edit a blog post for mariopenglee.com in Mario's voice, with enforced length budget, format, and verification checks. Use whenever creating or editing files in src/posts/.
---

# Writing a blog post for mariopenglee.com

Posts are markdown files in `src/posts/`. The filename (without `.md`) is the
URL slug. Follow this process every time.

## 1. Format

Frontmatter (all three fields required):

```markdown
---
title: Sentence case, short. A colon subtitle is fine, keep total under ~45 chars
date: YYYY-MM-DD
summary: One or two sentences shown on the blog index. No em dashes here either.
---
```

- Headers: `##` only, lowercase, plain and descriptive ("the setup",
  "what broke"). Never clever or theatrical.
- Links: inline markdown, link the project/paper on first mention.
- Code blocks for equations, terminal output, or actual code. No images.

## 2. Voice (hard rules)

Full guide in CLAUDE.md. Non-negotiables:

- NO em dashes, anywhere, including frontmatter. Use commas, colons,
  parentheses, or split the sentence.
- NO emojis.
- No AI-sounding prose: no mic-drop one-liners, no "Here's the thing", no
  triadic flourishes, no staccato fragments for drama.
- First person, opinionated but hedged: "my view is", "seems to me",
  "to be honest", "unclear so far". State the take first, qualify second.
- Casual modifiers ("pretty", "basically", "for sure"), contractions always,
  parenthetical asides for nuance.
- Endings look forward with curiosity, not punchlines.

## 3. Length budget

Measure body words (frontmatter excluded):

```bash
awk 'f; /^---$/{c++; if(c==2) f=1}' src/posts/<slug>.md | wc -w
```

- Standard post: **400-700 words**, target ~600.
- Flagship/deep-dive post: **up to 950 words**, never more.
- If over budget: cut whole sub-points, not adjectives. Merging two thin
  sections beats compressing both.

ALWAYS report the word count to the user after writing or editing a post,
alongside the budget it falls under.

## 4. Verification (run all before declaring done)

```bash
grep -n '—' src/posts/*.md                 # must be empty (prose; mock terminal output excepted)
grep -rnP '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]' src/posts/   # must be empty
npm run build                              # must pass (tsc + vite)
```

Check the blog index order still makes sense after any date change (sorted
newest first by `date`).
