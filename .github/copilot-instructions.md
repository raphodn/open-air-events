# Copilot instructions for open-air-events

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
