#!/usr/bin/env python3
"""Validate a Decision Research claim-evidence ledger CSV."""

from __future__ import annotations

import argparse
import csv
import re
import sys
from pathlib import Path
from urllib.parse import urlparse


REQUIRED_COLUMNS = {
    "id", "claim", "status", "evidence_url", "source_date", "source_level",
    "support", "confidence", "decision_impact", "counterevidence",
}
ALLOWED = {
    "status": {"fact", "inference", "hypothesis"},
    "source_level": {"primary-fact", "primary-behavior", "reliable-secondary", "lead-only", "unknown"},
    "support": {"direct", "indirect", "conflict", "none"},
    "confidence": {"high", "medium", "low", "unknown"},
}
DATE_RE = re.compile(r"^\d{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?)?$")


def is_http_url(value: str) -> bool:
    parsed = urlparse(value)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def validate(path: Path) -> tuple[list[str], list[str], int]:
    errors: list[str] = []
    warnings: list[str] = []
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        columns = set(reader.fieldnames or [])
        missing = sorted(REQUIRED_COLUMNS - columns)
        if missing:
            return ([f"missing required columns: {', '.join(missing)}"], [], 0)

        seen_ids: set[str] = set()
        rows = 0
        for line_number, raw in enumerate(reader, start=2):
            rows += 1
            row = {key: (value or "").strip() for key, value in raw.items()}
            claim_id = row["id"] or f"line {line_number}"
            if not row["id"]:
                errors.append(f"line {line_number}: id is empty")
            elif row["id"] in seen_ids:
                errors.append(f"{claim_id}: duplicate id")
            seen_ids.add(row["id"])
            if not row["claim"]:
                errors.append(f"{claim_id}: claim is empty")
            for field, allowed in ALLOWED.items():
                if row[field] not in allowed:
                    errors.append(f"{claim_id}: invalid {field}={row[field]!r}; expected one of {', '.join(sorted(allowed))}")
            if row["source_date"] and not DATE_RE.fullmatch(row["source_date"]):
                errors.append(f"{claim_id}: source_date must be YYYY, YYYY-MM, or YYYY-MM-DD")
            has_url = bool(row["evidence_url"])
            if has_url and not is_http_url(row["evidence_url"]):
                errors.append(f"{claim_id}: evidence_url must be an http(s) URL")
            if row["status"] == "fact" and not has_url:
                errors.append(f"{claim_id}: fact has no evidence_url")
            if row["support"] in {"direct", "indirect", "conflict"} and not has_url:
                errors.append(f"{claim_id}: support={row['support']} requires evidence_url")
            if has_url and not row["source_date"]:
                warnings.append(f"{claim_id}: evidence has no source_date")
            if row["confidence"] == "high" and row["source_level"] in {"lead-only", "unknown"}:
                warnings.append(f"{claim_id}: high confidence relies on {row['source_level']}")
            if row["decision_impact"] and not row["counterevidence"]:
                warnings.append(f"{claim_id}: decision-impacting claim has no counterevidence or falsifier")
    if rows == 0:
        errors.append("ledger contains no claim rows")
    return errors, warnings, rows


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("ledger", type=Path, help="UTF-8 CSV claim ledger")
    parser.add_argument("--strict", action="store_true", help="treat warnings as failures")
    args = parser.parse_args()
    if not args.ledger.is_file():
        print(f"ERROR: ledger not found: {args.ledger}", file=sys.stderr)
        return 2
    try:
        errors, warnings, rows = validate(args.ledger)
    except (OSError, UnicodeError, csv.Error) as exc:
        print(f"ERROR: could not read ledger: {exc}", file=sys.stderr)
        return 2
    for message in errors:
        print(f"ERROR: {message}")
    for message in warnings:
        print(f"WARNING: {message}")
    print(f"Checked {rows} claim row(s): {len(errors)} error(s), {len(warnings)} warning(s)")
    return 1 if errors or (args.strict and warnings) else 0


if __name__ == "__main__":
    raise SystemExit(main())
