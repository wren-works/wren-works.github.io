---
name: decision-research
description: Turn open-ended product, market, industry, technology, or policy research into current, traceable, falsifiable findings or decision input. Use for exploratory research that should uncover changes, contradictions, mechanisms, and opportunities; for decisions with competing options; for auditing or refreshing conclusions; or for comparing research workflows and models. Do not use for a simple stable fact lookup or a writing task with no research need.
---

# Decision Research

Produce research that is current, traceable, calibrated, and useful without forcing every question into a decision memo. Optimize for understanding changed, errors exposed, uncertainty reduced, and next evidence clarified—not page count or template completion.

## Choose the mode before researching

- Use **Discovery mode** when the user asks to understand a topic, changes, tensions, or opportunities but has not supplied a real decision with competing options.
- Use **Decision mode** only when a real owner must choose between at least two options. State the owner, options, constraints, cost of error, and evidence that could change the choice.
- Use **Audit/update mode** when checking an existing report, claim set, or conclusion against newer or conflicting evidence.

Never invent a decision owner, deadline, option set, or recommendation to satisfy a template. Preserve the user's requested artifact and mode.

## Control language and effort

- Match the user's language in headings, prose, and user-facing tables. Keep canonical English keys only in machine-readable CSV or JSON artifacts.
- Spend effort on finding and challenging consequential claims before formatting them.
- Do not repeat the same claim in narrative, ledger, test, and recommendation unless the repetition changes its function.
- Keep audit artifacts internal or compact unless the user requests them or the risk of error justifies showing them.
- Start with one agent. Add parallel agents only when independent branches materially reduce context pollution or latency; record the extra cost.

## Workflow

### 1. Freeze the research boundary

Record the cutoff date and the scopes that can change meaning: region, product/version, population, comparison definition, allowed sources, budget, and expected shelf life. Keep incompatible scopes separate.

### 2. Search broadly enough to discover differences

Before converging, inspect multiple relevant lenses such as product change, user behavior, economics or distribution, operations, and regulation. Select lenses that fit the topic; do not fill a generic checklist. Prefer current primary evidence and use communities or aggregators as leads rather than independent confirmation.

### 3. Treat claims as the unit of research

For consequential claims, record the direct source, date, scope, evidence type, and whether support is direct, indirect, conflicting, or absent. Separate vendor promises, observed behavior, and business outcomes. Build a full claim-evidence ledger only in Decision or Audit/update mode, or when the user requests one. Read [references/source-policy.md](references/source-policy.md) when selecting or auditing sources.

### 4. Challenge the emerging explanation

Look for a newer primary source, disconfirming evidence, a plausible alternative explanation, hidden dependence on one upstream source, and version, region, population, or denominator mismatches. Match confidence and wording to the evidence.

### 5. Derive insights

Use this reasoning structure:

`observed change → plausible mechanism → product or decision implication → falsifier`

Call it an insight only when it adds an explanation and changes understanding, priority, risk, or the next validation path. Without a mechanism, call it an observation. Without behavioral or causal evidence, label it a hypothesis and avoid causal language. Do not invent numerical success thresholds that are not grounded in a real baseline or decision rule.

### 6. Choose the cheapest discriminating evidence

Prefer product checks for feature existence, behavior logs or task observation for user problems, prototypes for comprehension, controlled tests for causal mechanisms, and small pilots for business outcomes. A useful test must separate at least two competing explanations.

### 7. Stop when search stops changing the issue map

State what the evidence supports, what it cannot support, the highest-risk assumption, and what event or evidence should trigger an update. Prefer obtaining behavioral, operational, user, or experimental evidence once more webpages have low marginal value.

## Output by mode

### Discovery mode

Return only what helps the user understand the topic:

1. Scope and the most important current changes.
2. Three to five distinct insight cards with evidence, mechanism, implication, falsifier, and calibrated confidence.
3. The most important evidence gaps and the cheapest next checks.

Do not add a Decision Brief, option recommendation, full claim ledger, or Stop and Update table unless requested. Preserve breadth: avoid presenting several cards that restate one trust, accuracy, or workflow mechanism.

### Decision mode

Return a compact Decision Brief, Research Snapshot, critical Claim-Evidence Ledger, Counterevidence and Alternative Explanations, Decision Insights, Cheapest Discriminating Tests, Recommendation with confidence and limits, and Stop and Update Record. Use [references/templates.md](references/templates.md), but omit fields that cannot be honestly populated.

### Audit/update mode

Lead with claims that changed, failed, conflict, or expired; show affected evidence and downstream conclusions. Do not rewrite unaffected sections merely for consistency.

## Quality gates

- **G0 Mode fidelity:** the output answers the requested research mode and does not fabricate a decision context.
- **G1 Current and correct:** consequential facts match the defined time, version, region, population, and measurement.
- **G2 Traceable:** each critical conclusion maps to specific evidence.
- **G3 Useful:** Discovery changes understanding or a validation priority; Decision mode changes an option, risk judgment, or next action.
- **G4 Falsification-ready:** alternatives, uncertainty, and at least one meaningful falsifier are explicit.
- **G5 Reality-tested:** user, behavioral, operational, or experimental evidence supports the conclusion.

Passing G0–G4 but not G5 produces a **testable research hypothesis**, not a validated product or business conclusion. Do not hide a failed gate inside prose.

## Evaluation mode

When evaluating whether this Skill works, read [references/evaluation-protocol.md](references/evaluation-protocol.md) before running any task. Freeze prompts, tools, budgets, model versions, scoring rules, and holdout tasks. Treat examples used to edit the Skill as development data. Use `scripts/score_run.py` to summarize scored conditions.

Read [references/prior-art.md](references/prior-art.md) only when revising the workflow or comparing it with existing research systems.
