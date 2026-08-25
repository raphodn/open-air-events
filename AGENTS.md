# Agent Context

This file contains agent-specific guidance only.

At session start, skim [`README.md`](README.md) for general project information.

---

## Stack

- Vue 3 (Composition API, `<script setup>`)
- Vuetify 3 for UI components
- Pinia for state management (with `pinia-plugin-persistedstate`)
- Vue Router 4
- Vite
- Yarn (use `yarn install`, `yarn add`, `yarn remove`; do not use npm)

## Conventions

- **No async/await** — use `.then()` / `.catch()` / `.finally()` chains everywhere.
- **Vuetify breakpoints** — always read the `.value` of composable refs: `display.smAndUp.value`, not `display.smAndUp`.
- **State management** — data fetching belongs in Pinia store actions, not in components or `App.vue`. Components call store actions; store actions call services.
- **Services** — keep service files framework-agnostic (no Vue/Pinia imports).
- **Package manager** — Always use Yarn. Never use npm.

## Project Structure

- `src/components/` — reusable UI components
- `src/composables/` — Vue composables (e.g., `useSnackbar.js`)
- `src/stores/` — Pinia stores
- `src/services/` — external API integrations (OpenStreetMap, OpenEventDatabase)
- `src/views/` — page-level components
- `src/utils/` — helper utilities (dates, geo, events)
- `src/data/` — static data (departements.json, events.json)

## General Guidelines

### Communication style
- Be concise. Get to the point.
- Plain language over formal structure.

### Constructive Pushback
- Briefly flag concerns before implementing — a 1-2 sentence heads-up is valuable.
- Mention unnecessary abstractions, deprecated patterns, or simpler alternatives.
- Keep it proportional; skip trivial changes.

### Secrets hygiene
- Never put tokens, keys, or passwords in plaintext in unencrypted files.

### Comments
- **Never remove comments** when modifying files unless they apply to removed code or the meaning has changed.
- **Don't add unsolicited comments or docstrings** — only when asked or when documenting non-obvious decisions.

### Lint warnings
- **Never circumvent lint warnings** by renaming or reformatting to silence a rule.
- If your change introduces a new lint warning, mention it; don't silently suppress it.

### File Operations
- Use VS Code file tools (`create_file`, `replace_string_in_file`) instead of terminal commands.
- For bulk edits, use `multi_replace_string_in_file` with explicit before/after context.
- **Do not use `sed`, `perl -i`, or inline scripts to edit source files.**
