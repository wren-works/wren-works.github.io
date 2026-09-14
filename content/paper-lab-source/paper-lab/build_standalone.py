#!/usr/bin/env python3
"""Bundle the case page for opening offline. No third-party packages required."""
from __future__ import annotations

import argparse
from pathlib import Path

def build(root: Path, destination: Path) -> Path:
    html = (root / "index.html").read_text(encoding="utf-8")
    styles = (
        (root / "styles.css").read_text(encoding="utf-8") + "\n" +
        (root / "../../case-shared/case-shell.css").resolve().read_text(encoding="utf-8")
    )
    for tag in ('<link rel="stylesheet" href="styles.css">', '<link rel="stylesheet" href="../../case-shared/case-shell.css">'):
        if tag not in html:
            raise ValueError(f"Missing stylesheet marker: {tag}")
    html = html.replace('<link rel="stylesheet" href="styles.css">', "<style>\n" + styles + "\n</style>")
    html = html.replace('<link rel="stylesheet" href="../../case-shared/case-shell.css">', "")
    scripts = (
        ("../../hmc-v2/vendor/lenis.min.js", "../../hmc-v2/vendor/lenis.min.js"),
        ("../../case-shared/case-shell.js", "../../case-shared/case-shell.js"),
        ("page-data.js", "page-data.js"),
        ("app.js", "app.js"),
    )
    for src, filename in scripts:
        tag = f'<script src="{src}"></script>'
        if tag not in html:
            raise ValueError(f"Missing {filename} script in index.html")
        script = (root / filename).resolve().read_text(encoding="utf-8")
        if "</script" in script.lower():
            raise ValueError(f"Unsafe closing script sequence in {filename}")
        html = html.replace(tag, "<script>\n" + script + "\n</script>")
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(html, encoding="utf-8")
    return destination

def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parent.parent / "paper-lab.html")
    args = parser.parse_args()
    try:
        result = build(Path(__file__).resolve().parent, args.output)
    except (OSError, ValueError) as error:
        parser.exit(1, f"Build failed: {error}\n")
    print(f"Created: {result} ({result.stat().st_size:,} bytes)")

if __name__ == "__main__":
    main()
