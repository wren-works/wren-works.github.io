#!/usr/bin/env python3
"""Build a dependency-free standalone HTML from the adjacent source files."""
from pathlib import Path
import argparse

def build(output: Path) -> None:
    base = Path(__file__).resolve().parent
    html = (base / "index.html").read_text(encoding="utf-8")
    assets = [
        ('<link rel="stylesheet" href="styles.css">', "styles.css", "style"),
        ('<link rel="stylesheet" href="../../case-shared/case-shell.css">', "../../case-shared/case-shell.css", "style"),
        ('<script src="../../hmc-v2/vendor/lenis.min.js"></script>', "../../hmc-v2/vendor/lenis.min.js", "script"),
        ('<script src="../../case-shared/case-shell.js"></script>', "../../case-shared/case-shell.js", "script"),
        ('<script src="page-data.js"></script>', "page-data.js", "script"),
        ('<script src="app.js"></script>', "app.js", "script"),
    ]
    for marker, filename, tag in assets:
        if html.count(marker) != 1:
            raise ValueError(f"Expected exactly one marker for {filename}")
        text = (base / filename).resolve().read_text(encoding="utf-8")
        if tag == "script" and "</script" in text.lower():
            raise ValueError(f"Unexpected closing {tag} tag in {filename}")
        html = html.replace(marker, f"<{tag}>\n{text}\n</{tag}>")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(html, encoding="utf-8")
    print(f"Built {output} ({output.stat().st_size:,} bytes)")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parent.parent / "hmc-case.html")
    args = parser.parse_args()
    build(args.output)
