#!/usr/bin/env python3
"""Aggregate Forgejo contributions for the site graph.

Data source: https://git.kangel.xyz/api/v1/users/kangel/heatmap
This is exactly what the Forgejo profile page (kangel?tab=activity and the
contribution graph) uses: it counts the user's *actions* (pushes, issues,
pulls, reviews...), not raw commit authorship. So bot-authored commits that
the user pushes still count - same as Forgejo shows on the profile.

Why a static file and not a live browser fetch?
- The Forgejo API sends no `Access-Control-Allow-Origin`, so fetch() from
  the site is blocked by CORS.
- Build-time aggregation = one local JSON, zero API load on page views.

Output: forgejo-contributions.json next to index.html:
{
  "updated_at": "...",
  "source": "https://git.kangel.xyz/api/v1/users/kangel/heatmap",
  "contributions": {"2026-08-07": 6, ...},   # UTC days with >=1 contribution
  "total": 123
}

Run manually or via .github/workflows/update-forgejo-stats.yml (daily cron).
Uses only the Python standard library.
"""

import datetime
import json
import os
import urllib.request

FORGEJO = "https://git.kangel.xyz"
HEATMAP_USER = "kangel"


def api_get(path):
    req = urllib.request.Request(
        FORGEJO + path, headers={"User-Agent": "arthirtyfour-site-stats"}
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    root = os.path.dirname(here) if os.path.basename(here) == "tools" else here
    entries = api_get(f"/api/v1/users/{HEATMAP_USER}/heatmap")
    per_day = {}
    for e in entries:
        ts = e.get("timestamp")
        n = e.get("contributions", 0)
        if not ts:
            continue
        day = datetime.datetime.fromtimestamp(
            ts, tz=datetime.timezone.utc
        ).date().isoformat()
        per_day[day] = per_day.get(day, 0) + n

    per_day = dict(sorted(per_day.items()))
    out = {
        "updated_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "source": f"{FORGEJO}/api/v1/users/{HEATMAP_USER}/heatmap",
        "contributions": per_day,
        "total": sum(per_day.values()),
    }
    out_path = os.path.join(root, "forgejo-contributions.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f"heatmap entries: {len(entries)}, active days: {len(per_day)}, "
          f"total: {out['total']}")
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
