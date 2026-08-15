#!/usr/bin/env python3
"""Append a sanitized, evidence-backed lesson to the project skill record."""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
from pathlib import Path


def clean(value: str) -> str:
    """Keep one CLI value on one Markdown line and avoid accidental formatting."""

    return " ".join(value.strip().split()).replace("|", "\\|")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--category", required=True)
    parser.add_argument("--symptom", required=True)
    parser.add_argument("--cause", required=True)
    parser.add_argument("--prevention", required=True)
    parser.add_argument("--verification", required=True)
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "references" / "error-prevention.md",
        help="Override the record path for testing or controlled maintenance.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    output = args.output.resolve()
    output.parent.mkdir(parents=True, exist_ok=True)

    if output.exists():
        content = output.read_text(encoding="utf-8")
    else:
        content = "# Error prevention record\n\n## Recorded lessons\n"

    marker = "<!-- The record_error.py script appends dated entries below this line. -->"
    entry = "\n".join(
        [
            f"### {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')} — {clean(args.category)}",
            f"- Symptom: {clean(args.symptom)}",
            f"- Cause: {clean(args.cause)}",
            f"- Prevention: {clean(args.prevention)}",
            f"- Verification: {clean(args.verification)}",
            "",
        ]
    )

    if marker in content:
        content = content.replace(marker, f"{marker}\n\n{entry}", 1)
    else:
        content = content.rstrip() + "\n\n" + entry

    output.write_text(content, encoding="utf-8")
    print(f"Recorded lesson in {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
