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
- Code blocks for equations, terminal output, or actual code.
- **Every post needs at least one visual**: an interactive demo, animation, or
  figure that shows the post's core idea (not decoration). Build it as a React
  component in `src/components/`, register it in the `DEMOS` map in
  `src/pages/Post.tsx`, and drop `[[demo:key]]` on its own line in the
  markdown. Reuse the `mt-` classes in `manifold.css` (`ManifoldTiling.tsx`
  is the model): monochrome theme tokens (`--ink`, `--line`, ...), works in
  both themes and at phone width. Use only numbers that appear in the post;
  a toy simulation must say it's a toy.

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

## 3. Shape and engagement

A short post that isn't engaging is just short. These rules are about the
*structure and selection* that make a piece pull the reader through. The
research behind them: Loewenstein's information-gap theory (curiosity is a
specific, bounded gap between what you know and want to know), the Heath
brothers' SUCCES (find the single core, make every abstraction concrete),
and Paul Graham's "Writing, Briefly" (say one thing, cut what isn't working).

- **One idea per post.** Write the claim in a single sentence before you
  draft. Everything in the post serves it. If two ideas fight, split into
  two posts. (Test at the end: can you still state the claim in one sentence?)
- **Open on the gap, not the setup.** The first two sentences should make the
  reader aware of a specific question they can't yet answer: a concrete
  image, a surprising result, or a sharp question. Background comes after the
  hook. The sphex-wasp opening in `gpt2-ioi.md` is the model.
- **Lead with the result.** Say what you found early; the detail earns its
  place by explaining how. Suspense isn't the goal, predictability is fine.
- **Anchor every abstract claim** within a sentence or two: a number, an
  example, an image. No claim floats.
- **Earn the technical detail.** Depth only when it serves the core idea. An
  interesting-but-off-axis tangent goes in a parenthetical, a link, or gets
  cut. When a concept deserves weight, ground it in the real work (name the
  paper, the bug, the number), don't just gesture at it.
- **One clean story, no process.** The post showcases one core finding:
  question, setup, result, what it means. Never backtrack ("I wrote X,
  turns out I was wrong"), never narrate bugs found, reruns, lost
  notebooks, or fixes. Caveats only if they're part of the finding itself.
- **Close on the portable idea.** Name what the specific result generalizes
  to, looking forward.

## 4. Length budget

Measure body words (frontmatter excluded):

```bash
awk 'f; /^---$/{c++; if(c==2) f=1}' src/posts/<slug>.md | wc -w
```

- Standard post: **400-700 words**, target ~500. Shorter wins if the idea
  survives the cut.
- Flagship/deep-dive post: **up to 950 words**, never more.
- If over budget: cut whole sub-points, not adjectives. Merging two thin
  sections beats compressing both.

ALWAYS report the word count to the user after writing or editing a post,
alongside the budget it falls under.

## 5. Verification (run all before declaring done)

```bash
grep -n '—' src/posts/*.md                 # must be empty (prose; mock terminal output excepted)
grep -rnP '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]' src/posts/   # must be empty
grep -L '\[\[demo:' src/posts/*.md       # must be empty (every post has a visual)
npm run build                              # must pass (tsc + vite)
```

Two engagement checks, read the draft and answer honestly:

- **Opening test:** do the first ~2 sentences create a specific, answerable
  gap? If it's pure setup, cut to the hook.
- **One-idea test:** can you state the post's claim in one sentence? If not,
  it's two posts.

Check the blog index order still makes sense after any date change (sorted
newest first by `date`).

## 6. Review panel (after every new or substantially edited post)

Run these as **independent Opus subagents** (Agent tool, `model: "opus"`),
all launched in one message so they run in parallel. Do not do the review
yourself in place of them. Give each one only the post path(s), its role,
and the files it needs; never your own opinion of the draft. Each returns
concrete line-level findings with a suggested rewrite.

1. **Fact checker.** Verifies every number, claim, citation and link against
   the source (for research posts, the source repo, e.g. `../soar-2026`:
   `CLAIMS.md` allowed/banned wording, paper drafts, run results). Flags
   overclaims and anything not traceable.
2. **Anti-AI-slop skeptic.** A technical reader allergic to AI prose and hand
   waving: the voice rules in CLAUDE.md, undefined terms, claims the evidence
   doesn't support, drama, filler.
3. **Personal brand checker.** Reads `src/data/site.ts`, `index.html`, the
   home page and the other posts in `src/posts/`, and checks the post is on
   brand with the rest of the site and Mario's work (positioning, tone,
   consistency of titles/summaries, how it's linked from home/research).
4. **Recruiter + CS master's admissions reader.** Two hats, one agent: a
   recruiter and a Stanford CS MS admissions reader scouting top talent. Is
   Mario's contribution and the impact clear in the first screen? Does it
   show research judgment (controls, pre-registration, honest limits)?

Apply the fixes you agree with, re-run section 5, and report to the user
what each reviewer flagged and what you changed or skipped (and why).

## 7. SEO and GEO (every post)

The build already generates `llms.txt`, `llms-full.txt`, `sitemap.xml` and
a raw `/blog/<slug>.md` copy per post (see `vite.config.ts`). Hash routes are
invisible to crawlers, so those files plus frontmatter are what search
engines and AI answer engines see. For each post check:

- **Slug:** descriptive and keyword-bearing (it's the indexed URL).
- **Title:** contains the terms people would search (e.g. "sparse
  autoencoder", model names), under ~60 chars, still plain per section 1.
- **Summary:** a standalone answer with the key number(s), 140-200 chars,
  since it's what `llms.txt` and snippets quote.
- **First paragraph:** answers the question on its own, names entities in
  full once (model names, paper authors, acronyms expanded), so an LLM can
  quote it without context.
- **Sources:** link papers and code on first mention (citations help GEO).
- **Cross-links:** link related posts both ways, and add/update the entry in
  `src/data/site.ts` if it belongs on the home page.
- After `npm run build`, confirm the post shows up in `docs/llms.txt` and
  `docs/sitemap.xml`.
