# Nomalyze — Vue 3 Frontend

> A Vue 3 + TypeScript single-page app for recipe management and analytics. Consumes a [Django REST Framework backend](https://github.com/nicovece/cf-recipe-app) over JWT. Deployed on Netlify. Lighthouse Performance: **97/100**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Vue SPA](https://img.shields.io/badge/Vue_SPA-live-success)](https://nomalyze.netlify.app)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-97-brightgreen)](https://nomalyze.netlify.app)

**[⚡ Live demo](https://nomalyze.netlify.app)** · demo account: `demo` / `example123` (the backend is on Render free tier — first request after idle takes ~30 sec to wake)

---

## About this project

This SPA is the second life of the [Nomalyze Django app](https://github.com/nicovece/cf-recipe-app). The original Django template site still runs at [nomalyze.com](https://nomalyze.com) — this Vue 3 frontend was built against a new DRF API that lives alongside the original template views, so the two sites coexist on the same backend and the same data.

**Why a SPA at all?** Two reasons. First, perceived performance — page transitions, live filtering, and Chart.js's interactive charts are noticeably snappier than the matplotlib-PNG round-trips the Django template site uses. Second, scope — the Vue side is a portfolio surface for newer skills (Composition API + `<script setup>`, TypeScript, Pinia, JWT-with-refresh) without disturbing the original codebase.

**What's worth looking at in the code:**
- **Axios JWT interceptor** with single-flight token refresh at [`src/api/client.ts`](src/api/client.ts) — multiple concurrent 401s wait on one in-flight refresh promise rather than firing N parallel refresh requests
- **Pinia auth store** with `localStorage` persistence at [`src/stores/auth.ts`](src/stores/auth.ts) — tradeoff writeup in Architecture Decisions below
- **Responsive `<img srcset>`** consuming the backend's pre-generated WebP variants (no client-side resizing required)
- **Chart components** that re-render reactively as search filters change (Chart.js via `vue-chartjs`)

---

## Tech stack

- **Vue 3** — Composition API with `<script setup>`
- **TypeScript** — strict mode across the codebase
- **Vite 8** — build tool, HMR
- **Vue Router 5** — client-side routing with auth guards
- **Pinia 3** — state management
- **Axios** — HTTP client with JWT interceptor (auto-refresh on 401)
- **Chart.js + vue-chartjs** — interactive bar / pie / line charts
- **Tailwind CSS 4** — utility-first styling, CSS-based config
- **Vitest + Vue Test Utils** — 19 unit tests (auth store, RecipeCard, SearchForm)
- **ESLint + Prettier** — lint + format

---

## Architecture Decisions

### Why a separate frontend repo?

The backend serves HTML templates for the existing Django app. The Vue SPA is a separate concern with its own build pipeline, dependencies, and deployment target (Netlify, not Render). Separate repos allow independent versioning, CI/CD, and clear ownership boundaries.

### Why JWT over session auth?

The SPA runs on a different origin (`nomalyze.netlify.app`) than the backend (`nomalyze.com`). Session cookies have `SameSite`/`Secure` and CSRF complications across origins. JWT tokens travel in the `Authorization` header, making cross-origin auth straightforward. The two auth systems coexist on the backend — sessions continue to drive the Django template site, JWT drives the SPA.

### Why store JWTs in `localStorage` instead of `HttpOnly` cookies?

Two viable storage strategies for JWTs in an SPA:

- **`localStorage` (current choice):** Tokens are read/written from JavaScript and attached to requests via the `Authorization` header. Simple to wire and works seamlessly across origins with no CSRF dance. The cost is that any successful XSS — a compromised dependency, a CDN MITM, a DOM-based injection — can exfiltrate both tokens.
- **`HttpOnly` cookies:** Tokens are unreadable from JavaScript, so XSS can't lift them. The cost is needing CSRF protection (double-submit cookie or token) and tighter coupling to backend cookie handling across origins (`SameSite=None; Secure` plus careful `Access-Control-Allow-Credentials` and per-route CSRF middleware).

The current XSS surface in this app is small: no `v-html`, no `eval`, no `dangerouslySetInnerHTML`-style escape hatches, and dependencies are version-locked via `pnpm-lock.yaml`. The residual dependency-chain risk (a malicious update to a transitive dep) is real but accepted for a portfolio app. A production deployment with broader exposure should reconsider — token reads are isolated to `src/stores/auth.ts` and `src/api/client.ts`, so swapping the storage layer is a localized refactor rather than an architectural change.

### Why Chart.js over server-side matplotlib?

Matplotlib generates static PNG images on the server. Chart.js renders interactive charts in the browser — hover tooltips, animations, responsive resizing. The server only sends raw JSON data (via `/api/recipes/search/stats/`), reducing payload size and bandwidth. Charts update reactively when search results change, with no round-trip needed.

### Why Tailwind 4 when the backend uses Tailwind 3?

Tailwind 4 is the current version with a simpler setup (CSS-based config, no PostCSS step). Since the repos have separate build pipelines, there's no conflict. The utility classes are compatible between versions, so the visual language stays consistent across the Django site and the SPA. Using the latest version demonstrates staying current with the ecosystem.

### Why Pinia over Vuex?

Pinia is the official recommended state management for Vue 3. Full TypeScript support, simpler API (no mutations concept), and the setup store syntax mirrors `<script setup>` in components. Vuex is in maintenance mode.

---

## Features

- **JWT authentication** with access + refresh token flow; auto-refresh on 401 via single-flight Axios interceptor
- **Paginated recipe browsing** — responsive card grid backed by the backend's `PageNumberPagination`
- **Recipe detail view** — hero image (WebP `<img srcset>`), ingredients, difficulty badge
- **Advanced search** — wildcard pattern matching (`*`, `?`); filter by name, ingredients, cooking time, difficulty
- **Interactive charts** — bar (cooking times), pie (difficulty distribution), line (cooking time vs ingredient count)
- **Shareable searches** — search params synced to URL query strings
- **Responsive design** — mobile-first layout, hamburger nav
- **Page transitions** — fade animations between routes
- **Toast notifications** — non-blocking error feedback
- **404 handling** — catch-all route with friendly error page

---

## API endpoints

This frontend consumes the following backend API (`/api` routes on the Django repo). Recipe endpoints require a valid JWT in the `Authorization: Bearer …` header; auth endpoints are public.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/token/` | — | Obtain JWT pair |
| POST | `/api/auth/token/refresh/` | — | Refresh access token |
| GET | `/api/recipes/` | JWT | Paginated recipe list |
| GET | `/api/recipes/:id/` | JWT | Recipe detail |
| GET | `/api/recipes/search/` | JWT | Filtered search |
| GET | `/api/recipes/search/stats/` | JWT | Aggregated chart data |

Full endpoint documentation in the [backend README](https://github.com/nicovece/cf-recipe-app#rest-api).

---

## Environment variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Yes | Base URL of the Django backend (no trailing slash) |

Local dev uses `.env` (gitignored — copy from `.env.example`). For production, either create `.env.production` or set the variable in your host's environment (e.g. Netlify env vars). Vite inlines `VITE_*` variables at build time, so the URL is baked into the bundle — rebuild after changing it.

---

## Local development

<details>
<summary>Prerequisites</summary>

- Node.js 20.19+ or 22.12+
- pnpm
- The [Nomalyze backend](https://github.com/nicovece/cf-recipe-app) running on `http://localhost:8000` (or point `VITE_API_BASE_URL` at the live one)

</details>

<details>
<summary>Install</summary>

```bash
git clone https://github.com/nicovece/nomalyze-frontend
cd nomalyze-frontend
pnpm install
cp .env.example .env
```

Edit `.env` if your backend runs on a non-default URL.

</details>

<details>
<summary>Dev / build / preview</summary>

```bash
pnpm dev          # Vite dev server on http://localhost:5173
pnpm build        # TS type-check + production build → dist/
pnpm preview      # Preview the production build locally
```

</details>

<details>
<summary>Test, lint, format</summary>

```bash
pnpm test:unit    # Vitest — 19 unit tests
pnpm lint
pnpm format
```

</details>

See `src/` for project structure — the layout follows Vue 3 conventions (`views/`, `components/`, `stores/`, `api/`, `router/`, `types/`).

---

## Maintainer & Contact

**Maintained by:** Nicola Vece

- Email: me@nicovece.com
- GitHub: [@nicovece](https://github.com/nicovece)
- LinkedIn: [nicovece](https://www.linkedin.com/in/nicovece/)
- Portfolio: [nicovece.dev](https://www.nicovece.dev/)

## License

MIT — see [LICENSE](LICENSE).
