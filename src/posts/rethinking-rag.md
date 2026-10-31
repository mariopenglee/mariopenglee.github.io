---
title: RAG isn't dead, plain RAG is
date: 2025-12-04
summary: Why plain RAG breaks on real enterprise knowledge, and what organizing that knowledge first (late chunking, topic clusters, models that navigate a knowledge tree) changes. With Povilas Nagrockas.
---

*Originally published by nexos.ai on LinkedIn, Dec 4, 2025 ([original](https://www.linkedin.com/pulse/rethinking-rag-why-knowledge-organization-new-competitive-advantage-kxkze)). Mirrored here so it stays available.*

![RAG isn't dead, plain RAG is, by Mario Peng Lee and Povilas Nagrockas](/article-rag.png)

*Published as "Rethinking RAG: why knowledge organization is the new competitive advantage", written with Povilas Nagrockas.*

RAG (Retrieval-Augmented Generation) began as a breakthrough, but in practice it has become a default pattern that rarely meets modern needs. Most teams implement it expecting it to “just work,” only to run into brittle pipelines, inconsistent answers, and retrieval systems that fall apart when confronted with real enterprise complexity.

And today’s complexity is very different from the early days of RAG.

Finding a single relevant passage – the classic needle-in-a-haystack task –  is no longer the real challenge. In the agentic era, models must retrieve and reason over multi-step, cross-document, cross-topic context, often spanning dozens of sources and evolving over time. That level of integrated understanding is simply out of reach for naive RAG systems.

Our past year inside large, sensitive, constantly shifting enterprise data environments made something uncomfortably clear:

Plain, naïve RAG is obsolete - because retrieval without organization is chaos.

Enterprises don’t struggle with retrieval because their vectors are bad. They struggle because the knowledge feeding these vectors is fragmented, unsanitized, and mis-chunked. Good retrieval cannot emerge from disordered information.

To better understand how to build better RAG, we need to look at the components that make up RAG. One of the most important ones is knowledge organization, so by tackling how the knowledge is stored, we essentially facilitate how it's retrieved, both for humans and LLMs to have a clear trace and understanding of it.

## The Real Bottleneck: Unstructured Knowledge

Across clients we repeatedly saw the same patterns:

- Documents split into arbitrary pieces with context shattered across chunk boundaries.

- Semantically similar chunks producing ambiguous or misleading retrieval.

- Vector spaces lacking hierarchy, relationships, and structure.

RAG pipelines were doing exactly what they were told to do - but on top of disorganized data. So we turned our focus to the Knowledge Organization.

## Knowledge organization: the foundation RAG never had

High-quality retrieval starts with structure, not with bigger embeddings or longer context windows. Our approach builds this foundation by transforming messy data into navigable knowledge:

- Context-aware chunking that respects semantic boundaries

- Clustering and topic hierarchies that reorganize content into meaningful layers

- Entity- and feature-extraction that adds metadata richness

- Relationship modeling that sets the stage for graph-based reasoning

The result is not “better RAG” - it’s integrated knowledge, something closer to how humans learn and traverse information.

Instead of acting like a system that occasionally looks up answers in a recipe book, the model behaves as if it has learned the recipes. It doesn’t just retrieve a passage; it understands how the pieces fit together, and can use that understanding to reason through novel, unseen problems. From a technical perspective, the effect is similar to what you’d get if the model were fine-tuned on the entire corpus:

the knowledge becomes structurally embedded into the model’s reasoning process, producing context-aware, cross-document insights that simple retrieval pipelines cannot achieve.

This shift (from lookup to understanding, from fragments to integration) is the foundation RAG has always lacked.

## Late chunking: document-aware embeddings without the heavy hand of LLMs

We employed a novel technique called Late chunking:

- We embed the document at the token level, producing highly granular vectors that already carry whole-document semantic awareness. As the document is processed, we maintain a running semantic summary that enriches each token’s embedding with global context.

- After embedding do we split and pool (average) these token-level vectors into chunks, ensuring that every resulting chunk embedding remains whole-document aware rather than isolated to a narrow window.

This yields context-rich chunk vectors without resorting to LLM-heavy preprocessing, avoiding both hallucination risks and the compute costs associated with LLM-driven chunking approaches.

## Building topic clusters: from chaos to structure

Once chunk embeddings exist, we cluster them to build a hierarchical “knowledge tree.” Think of it as document-aware vectors, nested topics and subtopics, and a graph-like structure the model can navigate.

By adding optional LLM-generated cluster summaries, the structure becomes self-describing and easy for users to interpret. And this foundation enables something far beyond retrieval: guided traversal of knowledge, where the system can surface not just answers but relevant directions, themes, and next steps.

We’re already building on this capability inside [nexos.ai](http://nexos.ai) - upcoming Projects features like conversation starters and conversation continuations will leverage this structured understanding to help users explore their data more intelligently and proactively.

## Models that navigate the knowledge tree

Instead of relying solely on cosine similarity or pooled vectors, we let the model reason through structure:

- A query-extractor rewrites the user’s question into targeted, keyword-dense prompts.

- The model traverses the cluster graph - moving up, down, or across topics.

- It identifies the most relevant nodes before performing final retrieval.

This hybrid agentic + structural approach already shows measurable gains:

+9% accuracy over DPR and +10% over BM25. But it’s important to note that these benchmarks reflect mostly needle-in-a-haystack tasks. The real challenge – multi-document, cross-topic reasoning –  is much harder to quantify, and simple RAG systems consistently fail at it.

In practice, our system delivers substantial qualitative improvements on these complex queries, where structured traversal and context-anchored reasoning matter far more than raw similarity scores.

Of course, this added reasoning introduces some latency and increased token usage. Like any technical choice, it’s a tradeoff - one that should be evaluated against the complexity, stakes, and performance needs of each specific use case.

## What this means for enterprises?

Enterprises benefit from retrieval that is not only relevant but deeply context-anchored, supported by transparent and traceable reasoning, reduced dependence on fragile prompt engineering, and a system resilient enough to handle dynamic, sensitive, high-volume data - ultimately creating an environment where LLM-based agents can act rather than merely answer.

And this is only the beginning: we are advancing toward drift-resilient structures that adapt to constantly changing data, integrating methods like BM-25, SBERT, and grammar-based chunking for code, and developing richer graph-based reasoning through agentic traversal, all with a single goal - equipping models not just with information, but with the structural intelligence required to truly think.
