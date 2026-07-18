# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal life-journey map: a single-page Leaflet.js app that plots the user's real life events (birth, school, moves, trips, relationships, milestones) as markers on a world map, with cinematic camera transitions between them and a chapter/archive dropdown for jumping between life eras. There is no build step, no framework, no package manager — just `index.html`, `script.js`, and `data.json`.

Live deploy: https://xzzit.github.io/my_footprint/ (GitHub Pages, served directly from this repo).

## Running locally

```bash
python -m http.server
```

Then visit `http://localhost:8000`. Any static server works since there's no build step; `script.js` fetches `data.json` with a cache-busting timestamp so edits show up on refresh without a hard reload.

There are no tests, linter, or build/bundling commands in this repo — it's plain HTML/CSS/JS loaded straight from files.

## Architecture

- **`index.html`** — page shell, all CSS (inline `<style>`), and the two UI controls: the prev/next nav buttons (`.controls`) and the archive/chapter dropdown (`.chapter-control` / `#chapter-select`).
- **`script.js`** — all behavior. Key pieces:
  - `loadLifeData()` fetches `data.json`, populates `lifeEvents`, renders the first event, and builds the chapter dropdown from any event whose `type` field is non-empty (sparse indexing — see below).
  - `showEvent(index)` is the core renderer: places the marker, builds the popup, and picks one of three camera-transition scenarios based on distance/visibility/zoom-change (stationary / long-distance flyTo-then-popup / short-distance popup-then-flyTo). This "Director" logic is the most nuanced part of the codebase — read it in full before changing transition behavior.
  - `syncChapterMenu(activeIndex)` keeps the dropdown selection in sync with the current event by walking chapter start indices and picking the latest one `<=` the active index.
  - Navigation is circular: next/prev wrap around the ends of `lifeEvents`.
- **`data.json`** — the entire content of the site: an ordered array of event objects. This is almost always the only file that needs editing for day-to-day maintenance (adding a new life event, trip, etc.).

### Event schema (data.json)

Each entry:
| Field | Notes |
| :--- | :--- |
| `date` | Free text shown at the top of the popup, e.g. `"1997"`, `"2003-2009"`, or `"2026-至今"` for an ongoing period. |
| `title` | Bold popup header — a short label (2-8 characters), e.g. `"小学"`, `"移居广州"`. |
| `description` | Popup body text — see "Writing style" below. |
| `coordinates` | `[lat, lng]`. |
| `zoom` | Camera zoom level: 4-7 for country/province view, 14-16 for street/building view. |
| `type` | Chapter/era name for the archive dropdown. **Only set this on the first event of a new era** (sparse indexing) — leave `""` for every other event in that era. `syncChapterMenu` and the dropdown-population logic both depend on this convention holding. |

Events are expected to stay in chronological order since navigation and chapter-sync both walk the array by index, not by date.

## Writing style (data.json content)

Descriptions are now plain, factual, and minimal — one short declarative sentence per event, stating what happened with no embellishment. E.g. `"生于湖北省十堰市。"`, `"就读于十堰市人民小学。"`, `"随家人迁居至广州市。"`, `"入职Panasonic Automotive Systems (PAS)，开启职业生涯。"`. Titles are equally terse labels (`"出生"`, `"小学"`, `"移居广州"`), not headlines.

Note: this replaces an earlier, more elaborate style (deadpan mock-official/diplomatic-cable/military-communique parody, with 【XX日报】-style dateline tags and grandiose bureaucratic language for mundane events) that the data has since been rewritten away from. When adding or editing entries, match the current plain-factual register — don't reintroduce the old satirical framing unless the user asks for it.
