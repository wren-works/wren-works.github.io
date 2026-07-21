# Evaluation protocol

Use this protocol to estimate the causal value of the Skill, not merely the quality of one report.

## Claims to test

Test narrow claims in order:

- **L0:** the Skill reliably produces complete, readable artifacts.
- **L1:** the Skill reduces defined research errors for the same model.
- **L2:** the Skill improves decision-research quality across multiple held-out tasks.
- **L3:** a smaller model with the Skill approaches a larger model without it at lower cost or latency.
- **L4:** gains replicate across at least three materially different industries.
- **L5:** teams use the output and make measurably better real decisions.

Do not claim a higher level from evidence that only supports a lower one.

## Four-condition design

| Condition | Model tier | Workflow |
|---|---|---|
| A | larger | default research |
| B | larger | Decision Research Skill |
| C | smaller | default research |
| D | smaller | Decision Research Skill |

Interpret:

- `B - A`: Skill lift on the larger model.
- `D - C`: Skill lift on the smaller model.
- `D vs A`: whether process substitutes for some model capability.
- `D vs B`: remaining model-capability gap.

Never infer Skill lift from `D vs A` alone.

## Controls

- Freeze model identifiers, prompts, tools, permissions, time limits, cost accounting, and research cutoff.
- Pre-register the rubric and decision-critical facts before generating outputs.
- Blind evaluators to condition labels when possible.
- Run stochastic conditions at least three times before making stability claims.
- Keep tasks used to revise the Skill in the development set. NOMI is development data, not a generalization test.
- Include failures and refusals, not only successful reports.
- Prevent the Skill condition from receiving extra time or search access without counting the cost.
- Evaluate explicit invocation and natural-language implicit invocation as different conditions. A trigger miss is a workflow failure, not a missing-data row.

## Task set

Start with 8–20 realistic tasks. Cover at least three industries and include both Discovery and Decision tasks:

- an open-ended discovery task with no decision owner or predefined options;
- a fast-changing product or policy question;
- a decision with competing strategic options;
- a task containing tempting but outdated public pages;
- a task with conflicting sources or incompatible measurement definitions;
- an update test where new evidence overturns one critical claim.

Discovery tasks specify the audience, topic, scope, cutoff, and budget while deliberately omitting a decision owner and options. Decision tasks additionally specify the decision owner, real options, constraints, deadline, and cost of error. Hold back tasks not used during Skill authoring.

## Scoring

Score each dimension from 0 to 4 and preserve component scores:

- `factual_accuracy`
- `citation_accuracy`
- `source_quality`
- `freshness_scope`
- `counterevidence`
- `calibration`
- `decision_relevance`
- `discriminating_test`
- `updateability`

Also record elapsed time, token usage, estimated cost, useful unique sources, repeated searches, and human audit time. Do not replace a failed critical gate with a high average score.

For Discovery tasks, also record:

- `mode_fidelity`: whether the output avoids inventing a decision context;
- `valid_insight_count`, `strong_insight_count`, and `top3_depth_mean`;
- `search_breadth` and `redundant_insight_count`;
- output length relative to the default condition;
- language consistency with the prompt.

Recommended critical gates:

- no fabricated decision owner, options, deadline, or recommendation in Discovery mode;
- no unsupported decision-critical factual claim;
- no material version, date, region, or denominator mismatch;
- recommendation maps to the Decision Brief;
- uncertainty and at least one falsifier are explicit.

## Bounded iteration

Treat the Skill as a versioned intervention:

1. Freeze the target model and harness.
2. Collect raw outputs, scores, costs, and failure traces.
3. Make one bounded edit addressing a repeated failure.
4. Re-run development tasks.
5. Accept the edit only if aggregate quality improves without breaking a critical gate.
6. Confirm on untouched holdout tasks before promoting the version.
7. Record rejected edits so they are not rediscovered repeatedly.

Avoid optimizing wording for one benchmark answer. Prefer changes that alter observable process artifacts or gates.

Record the evidence for each edit, its expected observable effect, acceptance criteria, and rejected alternatives outside the Skill folder. Once a task informs an edit, treat it as development data rather than holdout evidence.

## Experiment files

```text
experiment-id/
  task.md
  conditions.md
  prompt.md
  research-output.md
  claim-ledger.csv
  evaluator-rubric.md
  scores.csv
  update-test.md
  postmortem.md
```

Use `scripts/validate_claim_ledger.py` before scoring and `scripts/score_run.py` to summarize condition means and planned deltas.
