#!/usr/bin/env python3


import datetime
import json
import os
import urllib.request

FORGEJO = "https://git.kangel.xyz"
HEATMAP_USER = "kangel"
TOKEN = os.environ.get("FORGEJO_TOKEN", "").strip()


def api_get(path):
    headers = {"User-Agent": "arthirtyfour-site-stats"}
    if TOKEN:
        headers["Authorization"] = f"token {TOKEN}"
    req = urllib.request.Request(FORGEJO + path, headers=headers)
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
        "include_private": bool(TOKEN),
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
