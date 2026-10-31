---
name: blog-post
description: Write or edit a blog post for mariopenglee.com in Mario's voice, with format rules, verification checks and a review panel. Use whenever creating or editing files in src/posts/.
---

# Writing a blog post for mariopenglee.com

Posts are markdown files in `src/posts/`. The filename (without `.md`) is the
URL slug. The format, voice rules and checks below apply every time; the
shape of the piece is up to whoever is writing it.

## 1. Format

Frontmatter (all three fields required):

```markdown
---
title: Sentence case, plain, under ~60 chars
date: YYYY-MM-DD
summary: One or two sentences shown on the blog index. No em dashes here either.
---
```

- Headers are optional. If you use them: `##`, lowercase, and named like a
  technical writeup ("related work", "approach", "evaluation",
  "limitations"). No narrative or dramatic headers ("the gap", "what we read
  first", "what broke").
- Links: inline markdown, link the project/paper on first mention.
- Equations are LaTeX, never code blocks: `$$ ... $$` on its own lines for
  display math, `$...$` inline for symbols and variables (`$R_N$`, `$b = .19$`,
  `$R^2$`). KaTeX renders them at build time (`src/data/posts.ts`). A literal
  dollar sign needs escaping as `\$`.
- Code blocks only for terminal output or actual code. Results tables can be
  GFM markdown tables.
- **Every post needs at least one visual**: an interactive demo, animation, or
  figure that shows the post's core idea (not decoration). Build it as a React
  component in `src/components/`, register it in the `DEMOS` map in
  `src/pages/Post.tsx`, and drop `[[demo:key]]` on its own line in the
  markdown. Reuse the `mt-` classes in `manifold.css` (`ManifoldTiling.tsx`
  is the model): monochrome theme tokens (`--ink`, `--line`, ...), works in
  both themes and at phone width. Use only numbers that appear in the post;
  a toy simulation must say it's a toy.

**Mirrored articles.** Pieces first published elsewhere (nexos.ai blog,
LinkedIn) are kept here as a copy in case the original disappears: verbatim
text, original date, a first line `*Originally published by X on Y, date
([original](url)). Mirrored here so it stays available.*`, and the cover
image instead of a demo. Note anything cut (e.g. a closing product pitch).
They're exempt from the voice rules and the demo requirement. In
`src/data/site.ts` ARTICLES, link `read` to the mirror and `original` to the
source.

## 2. Voice (hard rules)

Full guide in CLAUDE.md. Non-negotiables:

- NO em dashes, anywhere, including frontmatter. Use commas, colons,
  parentheses, or split the sentence.
- NO emojis.
- No AI-sounding prose: no mic-drop one-liners, no "Here's the thing", no
  triadic flourishes, no staccato fragments for drama.
- First person, opinionated but hedged where it's honestly uncertain.
- Casual modifiers ("pretty", "basically", "for sure"), contractions always,
  parenthetical asides for nuance.
- No punchline endings. Beyond that, end however the piece wants to end.

## 3. Shape (freeform)

**Research and build posts are centered on existing work.** Most of the post
is a literature review: what's been published, with linked papers and their
actual numbers, and what each result implies. Then a shorter part on what we
built on top of it and what came out. Show we read our books: cite the
papers our own research reports already used (search the source repo's
`.claude/reports/` for arXiv ids) and verify every link resolves before
publishing. Keep our own contribution tight, and trim anything that doesn't
serve either the related work or the result.

Beyond that there is no template. Posts shouldn't all read the same, so don't reach for
a fixed skeleton (hook, result, method, limits, forward-looking close) by
default. Pick the form that fits this particular piece: a short note, a
story of how something went, a walk through one figure, a list of
observations, a long argument, a Q&A, one big paragraph. Headers, sections,
equations and caveats are there when they help, not by default. Read two or
three existing posts and deliberately do something different from the most
recent one.

A few things that hold whatever the form:

- Be concrete. Numbers, examples, the actual bug or prompt beat abstractions.
- Know what you're saying. If you can't say why the piece exists in a
  sentence, it isn't ready.
- Be honest about what the evidence supports.

## 4. Length

Rough guide, not a rule: most posts land around 400-900 words, and shorter
is fine when the idea is done. Measure body words (frontmatter excluded):

```bash
awk 'f; /^---$/{c++; if(c==2) f=1}' src/posts/<slug>.md | wc -w
```

If a piece is long, cut whole sub-points rather than adjectives. Report the
word count to the user after writing or editing a post.

## 5. Verification (run all before declaring done)

```bash
grep -n '—' src/posts/*.md                 # must be empty (prose; mock terminal output excepted)
grep -rnP '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]' src/posts/   # must be empty
grep -L '\[\[demo:\|^\*Originally p' src/posts/*.md   # must be empty (every post has a visual; mirrors exempt)
npm run build                              # must pass (tsc + vite)
```

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
  autoencoder", model names), still plain per section 1.
- **Summary:** a standalone answer with the key number(s), 140-200 chars,
  since it's what `llms.txt` and snippets quote. The summary carries the SEO
  load, so the post itself can open however it likes.
- **Entities:** name things in full once (model names, paper authors,
  acronyms expanded) so an LLM can quote a passage without context.
- **Sources:** link papers and code on first mention (citations help GEO).
- **Cross-links:** link related posts both ways, and add/update the entry in
  `src/data/site.ts` if it belongs on the home page.
- After `npm run build`, confirm the post shows up in `docs/llms.txt` and
  `docs/sitemap.xml`.
