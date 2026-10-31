# statement of purpose, outline

One idea, stated before drafting: I study how minds and models represent
things, and I build systems that depend on getting that right. The master's
is where the two halves meet.

Budget: 800 to 1,000 words for most programs (check each limit). Five
sections, the middle three carry the weight. Write in first person, plain,
hedged where the evidence is hedged. No em dashes.

## 1. the gap (one paragraph)

Open on a concrete result, not biography. Lead with the kernel-noise floor,
since prior work (Paulo and Belrose) already showed low cross-seed overlap:
- Change nothing but GPU kernel nondeterminism, same seed and data, and 43 to
  85% as many latents go unmatched as with a new seed. If noise alone
  produces much of the disagreement between two SAE seeds, a feature
  explanation is a claim about one training run, not about the model.

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
- EleutherAI: entered through SOAR 2026, stayed on as a researcher with
  Paulo and Tianai Ye, two papers heading to arXiv. Back to the mechanism
  question with the production question still open.

Compress the Redwood to condense chronology to two or three sentences. The
reviewers were unanimous that the chronology is context, not the argument.

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
- Three concurrent roles. Do not argue that juggling is a pattern; two
  reviewers heard "he will keep doing this". State what was delivered under
  load (the 3.87 with several labs, a student org and a startup; the nexos.ai
  promotion while CEO of Pocketful; two manuscripts while co-founding
  condense), then state what stops.
- What stops on enrollment, concretely enough to check: Pocketful moves to
  an advisory role (bootstrapped, profitable, capable team). EleutherAI
  collaboration continues as research, which is the point of the degree.
  condense: title, hours per week, who runs it, whether investors know. With
  500k and a16z on the CV, "addressed" is not enough.
- Why a master's rather than continuing to build: the research I want to do
  needs an advisor, a cohort and time I cannot carve out of a startup. The
  manuscripts show what I can do alone; the master's is for what I cannot.
- The C in Algorithms (Stanford and CMU especially): one sentence, no
  apology. Point at one specific later derivation, the exact cross-block
  log-probability in block-GRPO, as the evidence that matters.

## 5. close (three sentences)

Forward, not a punchline. What I would want to have shown by the end of the
program, who I would want to have worked with, and what I would build after.
End on the open research question, not on "usable by everyone, safely",
which reviewers flagged as interchangeable with any applicant.

## one statement or several

Two families, not five documents.

Family 1, research statement (Symbolic Systems, CMU MLT, Princeton,
Columbia). One shared body: sections 1, 2, 4 and 5 above, about 70% of the
text. Two parts swap per program:
- The lead of section 2 (which thread comes first): Symbolic Systems leads
  with minds and the children study; MLT leads with language and
  linguistics; Princeton leads with the SAE reliability result; Columbia
  keeps the generic order and names the ML track.
- Section 3 in full: named faculty, their actual papers, the smallest clean
  experiment with them. Never shared.

Family 2, Berkeley MEng. Two separate essays with their own prompts, a
Statement of Purpose and a Personal History Statement that must not overlap.
Research is context, not the argument. Lead with the engineering record,
team leadership, what the capstone and leadership curriculum add to someone
who already leads a team. Do not reuse family 1.

## prompts and limits, as found (confirm in each portal)

| Program | What they ask | Length |
|---|---|---|
| Stanford Symbolic Systems | Statement of purpose; one original research paper optional and strongly encouraged (send an SAE manuscript, finished) | Not stated on the program page; Stanford departments typically cap at 2 pages |
| CMU MLT | SCS-wide: research interests, related experience, goals for a graduate degree at CMU; each program may add its own prompt in the portal | SCS guidance: concise one or two pages |
| Princeton CS MSE | Why Princeton, goals for graduate study, academic and career plans specific to the program; no revisions after the deadline | No limit found on the official page; plan on about 1,000 words |
| Columbia MS CS | How your background has prepared you for an advanced degree at Columbia Engineering (engineering-school wording) | No more than two pages (secondary sources; confirm) |
| Berkeley MEng | Two essays: SOP (why Berkeley is the intellectual fit, purpose for the MEng, professional goals) and Personal History Statement (what shaped the decision to pursue the degree now); must not overlap | No minimum or maximum; suggested one to two pages single-spaced each |

## checklist before sending

- Every number matches the CV and the blog post it links.
- At least two faculty named per research program, with a sentence each on
  why.
- The commitment paragraph exists and is specific.
- Read it aloud once. Cut any sentence that sounds like a committee wrote it.

## what each letter needs to say (from two package reviews)

Send each recommender a one-page brief with these points. Letters are
written from what is in front of the writer.

Paulo (EleutherAI)
- Rank against the 76 SOAR fellows, not the 3,450 applicants.
- Split credit with Tianai Ye: who designed the transplant test and the toy
  calibration.
- State what is new relative to Paulo and Belrose's own prior overlap result,
  and that the kernel-noise study was Mario's idea.
- Say he delivered during SOAR while co-founding condense. This is the one
  third-party answer to the commitment question.

Sandhofer (UCLA LCD lab)
- What "led" meant: study design, the coreference coding scheme, the
  analysis, not just running sessions.
- Rank among undergraduates supervised.
- Where the 2026 follow-up is headed (CogSci or journal) and his role in it.
- Whether he could carry a cognitive-science thesis alone (Symbolic Systems
  is asking exactly this).

Lu (UCLA CVL lab)
- Present the CycleDiffusion negative result as diagnostic skill: traced the
  failure to the captioner used as training signal.
- As a statistics professor, vouch for quantitative ability. This is the
  counterweight to the C in Algorithms.
- Be exact about the role-collapse work with Andrew Lee: involved, or aware
  of it. Do not imply supervision that did not happen. Holyoak co-signs.

## SOP, additions from the package reviews

- The condense plan has to be checkable: hours per week, who runs it, role
  title, whether investors know. "Addressed" is not enough with 500k and
  a16z printed on the CV.
- Drop "concurrency is a pattern". It argues the committee's worry for them.
  Say what was delivered under load and what stops on enrollment.
- Cut "usable by everyone, safely" as a closer. Replace with the open
  research question.
- Compress the Redwood to condense chronology to two sentences.
- The Algorithms sentence should point at one specific derivation, such as
  the exact cross-block log-probability in block-GRPO.
- Opening hook: lead with the kernel-noise floor, not "half the latents
  match", since prior work already showed low cross-seed overlap. Candidate
  line a committee would quote: if kernel noise alone produces much of the
  disagreement between two SAE seeds, a feature explanation is a claim about
  one training run, not about the model.
- Per program: Symbolic Systems leads with the children vs GPT-4 thread, MLT
  with the linguistics, Princeton with named faculty and how the CS core
  gets covered. Berkeley MEng needs a separate statement about the capstone
  and leadership, and ideally one industry letter.

## things to verify before sending (raised by reviewers)

- Redwood dates. CV says Jun to Sep 2022; the IOI paper went public Nov
  2022. Confirm the dates and whether the IOI study was done there or later.
- SOAR end date. "Jul 2026 to present" for a summer program; give the real
  end date if it has one.
- 150k for AI Safety at UCLA vs about 48k in grants listed on the CV.
  Expect the question; have the breakdown ready.
- GPT-4 sample size behind d = 2.2.
- Both "Writeup" links should open to something paper-quality by review time.
