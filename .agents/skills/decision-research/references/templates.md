# Research artifact templates

Use only the artifacts needed for the selected mode. Match user-facing labels to the user's language. Preserve canonical field names only in machine-readable artifacts so runs remain comparable.

## Discovery report

Do not use the Decision Brief or Recommendation templates when no real decision exists.

```text
Research boundary and cutoff:
Important current changes:
Three to five distinct insight cards:
Critical evidence gaps:
Cheapest next checks:
```

Keep evidence adjacent to each change or insight. Do not add a full ledger by default.

## Decision Brief

```text
Decision owner:
Decision and deadline:
Real options:
Known constraints:
Cost of a wrong decision:
Evidence that could change the decision:
Out of scope:
```

## Research Snapshot

```text
Cutoff date:
Region / market:
Product and version:
Population / user segment:
Comparison and measurement definition:
Allowed sources and tools:
Time / token / cost budget:
Expected shelf life:
```

## Claim-Evidence Ledger

Use CSV or a Markdown table with these canonical columns:

```text
id,claim,status,evidence_url,source_date,scope,source_level,support,confidence,decision_impact,counterevidence,notes
```

Allowed values:

- `status`: `fact`, `inference`, `hypothesis`
- `source_level`: `primary-fact`, `primary-behavior`, `reliable-secondary`, `lead-only`, `unknown`
- `support`: `direct`, `indirect`, `conflict`, `none`
- `confidence`: `high`, `medium`, `low`, `unknown`

Split a row when one sentence contains independently verifiable claims. For inference or hypothesis rows, cite the factual premises and state the reasoning in `notes`.

## Counterevidence record

| Current judgment | Alternative explanation | Supporting evidence | Opposing evidence | Consequence |
|---|---|---|---|---|
| | | | | keep / weaken / reject / test |

## Insight card

```text
Observed change:
Plausible mechanism:
Decision impact:
What would falsify it:
Confidence and why:
```

The falsifier can be a directional observation or a discriminating comparison. Do not invent a numerical threshold without a baseline, decision rule, or evidence-based reason.

## Recommendation

```text
Recommended option:
Why it wins under current evidence:
Conditions under which the recommendation changes:
Critical unsupported assumptions:
Confidence:
Cheapest discriminating next test:
```

## Stop and Update Record

```text
Currently supported decisions:
Currently unsupported decisions:
Highest-risk remaining assumption:
Why research stopped:
Research expiration date:
Events that trigger an update:
Affected claim IDs when updating:
Instructions for the next researcher:
```
