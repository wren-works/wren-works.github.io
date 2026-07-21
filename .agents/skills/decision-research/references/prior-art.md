# Prior art to consult when revising the Skill

Borrow evaluation and workflow mechanisms, not branding or unverifiable performance claims.

## Skill optimization

- [SkillOpt](https://arxiv.org/abs/2605.23904): treat a Skill as external, versioned text state; use scored rollouts, bounded edits, held-out validation, and a rejected-edit record. This is the closest methodological precedent for proving that a Skill adds value.

## Research decomposition

- [Stanford STORM](https://github.com/stanford-oval/storm): separate pre-writing research from writing; use perspective-guided questions to improve breadth; preserve human steering.
- [GPT Researcher](https://github.com/assafelovic/gpt-researcher): planner, execution, source tracking, filtering, aggregation, and publishing provide a useful implementation baseline. Compare against it; do not assume a more complicated orchestration is better.
- [GPT Researcher Skill](https://www.skills.sh/assafelovic/gpt-researcher/gpt-researcher): demonstrates that a research workflow can be packaged as an agent Skill. Inspect third-party instructions and scripts before installing or executing them.

## Agent architecture and evaluation

- [Anthropic multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system): broad-to-narrow search, explicit effort budgets, citation checking, real-task rubrics, and human evaluation. Multi-agent execution can increase breadth but also cost substantially.
- [When and how to use multi-agent systems](https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them): begin with one agent; add agents for context isolation, genuine parallelism, or specialization, while measuring handoff and token overhead.

## Benchmarks and evidence checks

- [DeepResearch Bench](https://deepresearch-bench.github.io/static/papers/deepresearch-bench.pdf): evaluate report quality together with statement-to-URL support, citation accuracy, and source trustworthiness.
- [PaperQA2](https://arxiv.org/abs/2409.13740): evaluate retrieval, evidence synthesis, and contradiction discovery as separate capabilities; its scientific-literature setting limits direct generalization.
- [OpenAI BrowseComp](https://openai.com/index/browsecomp/): use hard-to-find, easy-to-verify questions as a retrieval persistence subtest, not as the main benchmark for open-ended decision research.
