#!/usr/bin/env python3
"""Build the FollowUp split page as a portable standalone HTML."""
from pathlib import Path
import argparse


def build(output: Path) -> None:
    base = Path(__file__).resolve().parent
    html = (base / "index.html").read_text(encoding="utf-8")
    assets = [
        ('<link rel="stylesheet" href="styles.css">', "styles.css", "style"),
        ('<link rel="stylesheet" href="demo-styles-new.css">', "demo-styles-new.css", "style"),
        ('<link rel="stylesheet" href="demo-adjustments.css">', "demo-adjustments.css", "style"),
        ('<link rel="stylesheet" href="../case-shared/case-shell.css">', "../case-shared/case-shell.css", "style"),
        ('<script src="../hmc-v2/vendor/lenis.min.js"></script>', "../hmc-v2/vendor/lenis.min.js", "script"),
        ('<script src="../case-shared/case-shell.js"></script>', "../case-shared/case-shell.js", "script"),
        ('<script src="app.js"></script>', "app.js", "script"),
    ]
    for marker, filename, tag in assets:
        if html.count(marker) != 1:
            raise ValueError(f"Expected exactly one marker for {filename}")
        text = (base / filename).resolve().read_text(encoding="utf-8")
        if tag == "script" and "</script" in text.lower():
            raise ValueError(f"Unexpected closing script sequence in {filename}")
        html = html.replace(marker, f"<{tag}>\n{text}\n</{tag}>")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(html, encoding="utf-8")
    print(f"Built {output} ({output.stat().st_size:,} bytes)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parent / "followup-case.html")
    args = parser.parse_args()
    build(args.output)
