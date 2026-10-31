# statement of purpose, outline

One idea, stated before drafting: I study how minds and models represent
things, and I build systems that depend on getting that right. The master's
is where the two halves meet.

Budget: 800 to 1,000 words for most programs (check each limit). Five
sections, the middle three carry the weight. Write in first person, plain,
hedged where the evidence is hedged. No em dashes.

## 1. the gap (one paragraph)

Open on a concrete result, not biography. Candidates:
- Two sparse autoencoders trained on the same activations, differing only in
  seed, match about half their latents one to one. If "the feature for X"
  depends on the seed, what are we reading when we read a model?
- Or the kernel-noise version: change nothing but GPU nondeterminism and you
  still lose 43 to 85% as many latents as a new seed.

Then one sentence on why it matters to me: I work on long-running agents in
production, and every decision about what context to keep is a bet on what
the model actually uses.

## 2. how I got here (two paragraphs, the narrative)

Keep it causal, each step produced the next question.
- Started with human minds: how kids learn words and concepts (Sandhofer
  lab, the 31-children picture-book study, d = 2.2 against GPT-4 in 2024).
- Linguistics and cognition converged on NLP: PhoneTic5, the wug test,
  computational linguistics. Then Redwood in 2022: the first time I probed a
  model mechanistically (GPT-2 IOI, rare names destabilize the circuit).
- Agents became the second interest, and I graduated already building them
  (Pocketful). Then at scale at nexos.ai: the heartbeat memory model, the
  code interpreter, a 12-person team.
- condense: the question became what context is essential. Compaction is the
  applied form of "what does the model actually need."
- SOAR 2026: back to the mechanism question with Paulo, and the two papers.

One line tying it together: the goal has always been making this technology
usable by everyone, and I now understand better than before that doing that
safely means understanding what the model represents.

## 3. what I want to do here (one to two paragraphs, program-specific)

This is the section that changes per school. Name people. State the
smallest clean experiment first.

Research questions I can defend:
- When two SAEs disagree, is it the model or the method? Transplant tests,
  rotation alignment, kernel-noise baselines as a floor for seed effects.
- What information does a model actually use? Compaction as a measurement
  instrument, not just a cost saver.
- Role collapse in text-to-image: the denoiser ignores roles the encoder
  carries. Same question, different modality.

Per program:
- Stanford Symbolic Systems: lead with the minds question. Linguistics,
  psychology and CS as one field. Name advisors in cognition and NLP.
  Mention the thesis route and that a research paper is attached.
- CMU MLT: lead with language. Behavioral probes first, then mechanism.
  Name LTI faculty in interpretability or multilingual NLP.
- Princeton CS MSE: lead with the SAE reliability result. Name
  interpretability and NLP faculty. Say the two manuscripts are the start.
- Columbia MS CS: name the ML track. Shorter research section, more on
  deployment and what safety needs to address across industries.
- Berkeley MEng: lead with the engineering record and leadership. The
  research is context, not the point. Say what technical leadership training
  adds to a founder who already leads a team.

## 4. the questions they will have (one paragraph, do not skip)

Answer them before they are asked, briefly and factually.
- Three concurrent roles: this is a pattern, not a stretch. In undergrad it
  was several labs, AI Safety at UCLA, Blueprint and a startup, at a 3.87.
  At nexos.ai I was also full time at Pocketful. The output held each time.
- What happens on enrollment: Pocketful moves to an advisory role (it is
  bootstrapped, profitable and has a capable team, so it can go at its own
  pace). SOAR ends with the program. condense: answer honestly, whatever the
  plan is. Do not leave it implied.
- Why a master's rather than continuing to build: the research I want to do
  needs an advisor, a cohort and time I cannot carve out of a startup. The
  manuscripts show what I can do alone; the master's is for what I cannot.
- The C in Algorithms (Stanford and CMU especially): one sentence, no
  apology. Point at the later quantitative work (the ELBO estimator in
  block-GRPO, the calibrated transplant test) as the evidence that matters.

## 5. close (three sentences)

Forward, not a punchline. What I would want to have shown by the end of the
program, who I would want to have worked with, and what I would build after.
End on curiosity about the open question, not on a claim.

## checklist before sending

- Every number matches the CV and the blog post it links.
- At least two faculty named per research program, with a sentence each on
  why.
- The commitment paragraph exists and is specific.
- Read it aloud once. Cut any sentence that sounds like a committee wrote it.
