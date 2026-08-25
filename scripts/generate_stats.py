#!/usr/bin/env python3
"""
Generate src/data/stats.json from the OpenEventDatabase API.

How to run: 
    python scripts/generate_stats.py
"""

import json
import urllib.request
from collections import Counter
from datetime import datetime, timezone

OEDB_API_URL = "https://api.openeventdatabase.org"
OEDB_WHAT = "culture.cinema.outdoor"
OEDB_START_STOP = "start=2026-01-01T00:00&stop=2026-12-31T23:59"
OEDB_LIMIT = 1000
OUTPUT_FILE = "src/data/stats.json"


def fetch_events():
    url = (
        f"{OEDB_API_URL}/event"
        f"?what={OEDB_WHAT}"
        f"&{OEDB_START_STOP}"
        f"&limit={OEDB_LIMIT}"
    )
    req = urllib.request.Request(url, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def main():
    data = fetch_events()

    features = data.get("features", [])
    event_count = len(features)

    label_counter = Counter()
    state_counter = Counter()
    county_counter = Counter()

    for feature in features:
        props = feature.get("properties", {})
        label = props.get("label", "")
        state = props.get("osm_addr_state", "")
        county = props.get("osm_addr_county", "")

        if label:
            label_counter[label] += 1
        if state:
            state_counter[state] += 1
        if county:
            county_counter[county] += 1

    def format_top(counter):
        return [{"name": name, "count": count} for name, count in counter.most_common(5)]

    stats = {
        "event_count": event_count,
        "event_label_top_5": format_top(label_counter),
        "event_osm_addr_state_top_5": format_top(state_counter),
        "event_osm_addr_county_top_5": format_top(county_counter),
        "last_updated": datetime.now(timezone.utc).isoformat(),
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(stats, f, indent=2, ensure_ascii=False)

    print(f"Wrote {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
