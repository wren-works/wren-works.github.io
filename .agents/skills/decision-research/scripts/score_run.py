#!/usr/bin/env python3
"""Summarize Decision Research evaluation scores by condition."""

from __future__ import annotations

import argparse
import csv
import statistics
import sys
from collections import defaultdict
from pathlib import Path


QUALITY_COLUMNS = (
    "factual_accuracy", "citation_accuracy", "source_quality", "freshness_scope",
    "counterevidence", "calibration", "decision_relevance", "discriminating_test", "updateability",
)
PAIRWISE = (("B", "A"), ("D", "C"), ("D", "A"), ("D", "B"))


def mean(values: list[float]) -> float:
    return statistics.fmean(values) if values else float("nan")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("scores", type=Path, help="CSV with condition and 0-4 quality columns")
    args = parser.parse_args()
    if not args.scores.is_file():
        print(f"ERROR: scores file not found: {args.scores}", file=sys.stderr)
        return 2

    grouped: dict[str, dict[str, list[float]]] = defaultdict(lambda: defaultdict(list))
    try:
        with args.scores.open("r", encoding="utf-8-sig", newline="") as handle:
            reader = csv.DictReader(handle)
            missing = sorted({"condition", *QUALITY_COLUMNS} - set(reader.fieldnames or []))
            if missing:
                print(f"ERROR: missing required columns: {', '.join(missing)}", file=sys.stderr)
                return 2
            for line_number, raw in enumerate(reader, start=2):
                condition = (raw.get("condition") or "").strip().upper()
                if not condition:
                    print(f"ERROR: line {line_number}: condition is empty", file=sys.stderr)
                    return 2
                for column in QUALITY_COLUMNS:
                    try:
                        value = float((raw.get(column) or "").strip())
                    except ValueError:
                        print(f"ERROR: line {line_number}: {column} is not numeric", file=sys.stderr)
                        return 2
                    if not 0 <= value <= 4:
                        print(f"ERROR: line {line_number}: {column}={value} is outside 0-4", file=sys.stderr)
                        return 2
                    grouped[condition][column].append(value)
    except (OSError, UnicodeError, csv.Error) as exc:
        print(f"ERROR: could not read scores: {exc}", file=sys.stderr)
        return 2
    if not grouped:
        print("ERROR: scores file contains no rows", file=sys.stderr)
        return 2

    overall: dict[str, float] = {}
    print("condition,n,quality_mean")
    for condition in sorted(grouped):
        overall[condition] = mean([mean(grouped[condition][column]) for column in QUALITY_COLUMNS])
        sample_count = len(grouped[condition][QUALITY_COLUMNS[0]])
        print(f"{condition},{sample_count},{overall[condition]:.3f}")
    print("\ncomparison,quality_delta")
    for left, right in PAIRWISE:
        if left in overall and right in overall:
            print(f"{left}-{right},{overall[left] - overall[right]:+.3f}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
