# Nomalyze Frontend

A Vue 3 single-page application for recipe management and analytics. This is the frontend counterpart to the [Nomalyze Django backend](https://github.com/nicovece/cf-recipe-app).

## Tech Stack

- **Vue 3** — Composition API with `<script setup>`
- **TypeScript** — strict type checking across the entire codebase
- **Vite 8** — build tool with hot module replacement
- **Vue Router 5** — client-side routing with navigation guards
- **Pinia 3** — state management (auth store)
- **Axios** — HTTP client with JWT interceptor
- **Chart.js + vue-chartjs** — interactive data visualization
- **Tailwind CSS 4** — utility-first styling with CSS-based configuration
- **Vitest** — unit testing with Vue Test Utils
- **ESLint + Prettier** — code quality and formatting

## Features

- **JWT Authentication** — login with access/refresh token flow, automatic token refresh on 401
- **Recipe Browsing** — paginated recipe list with responsive card grid
- **Recipe Detail** — full recipe view with image, ingredients, difficulty badge
- **Advanced Search** — wildcard pattern matching (`*`, `?`), filter by name, ingredients, cooking time, difficulty
- **Interactive Charts** — bar (cooking times), pie (difficulty distribution), line (cooking time vs ingredients)
- **Shareable Searches** — search params synced to URL query strings
- **Responsive Design** — mobile-first layout with hamburger navigation
- **Page Transitions** — smooth fade animations between routes
- **Toast Notifications** — non-blocking error feedback
- **404 Handling** — catch-all route with friendly error page

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- pnpm
- The [Nomalyze backend](https://github.com/nicovece/cf-recipe-app) running on `http://localhost:8000`

### Installation

```bash
git clone <repository-url>
cd nomalyze-frontend
pnpm install
```

### Development

```bash
pnpm dev
```

Opens the app at `http://localhost:5173`. The API base URL defaults to `http://localhost:8000` (configurable via `.env`).

### Build

```bash
pnpm build
```

Runs TypeScript type checking and Vite production build in parallel. Output goes to `dist/`.

### Test

```bash
pnpm test:unit
```

Runs 19 unit tests covering the auth store, RecipeCard, and SearchForm components.

### Lint & Format

```bash
pnpm lint
pnpm format
```

## Project Structure

```
src/
  api/
    client.ts           # Axios instance with JWT interceptor
    auth.ts             # Login and token refresh API calls
    recipes.ts          # Recipe list, detail, search, stats API calls
  components/
    charts/
      CookingTimeBar.vue
      DifficultyPie.vue
      IngredientTimeLine.vue
    layout/
      AppToast.vue
    recipes/
      RecipeCard.vue
      SearchForm.vue
      SearchResults.vue
  stores/
    auth.ts             # JWT tokens, login/logout, isAuthenticated
  types/
    recipe.ts           # TypeScript interfaces for all API data
  views/
    HomeView.vue        # Public landing page
    LoginView.vue       # Authentication form
    AboutView.vue       # Static about page
    RecipeListView.vue  # Paginated recipe grid
    RecipeDetailView.vue
    SearchView.vue      # Search form + charts + results
    NotFoundView.vue    # 404 catch-all
  router/
    index.ts            # Routes, auth guards, scroll behavior
  App.vue               # Root component with responsive navbar
  main.ts               # App entry point
```

## Architecture Decisions

### Why a separate frontend repo?

The backend serves HTML templates for the existing app. The Vue SPA is a separate concern with its own build pipeline, dependencies, and deployment. Separate repos allow independent versioning, CI/CD, and clear ownership boundaries.

### Why JWT over session auth?

The SPA runs on a different origin (`localhost:5173`) than the backend (`localhost:8000`). Session cookies have SameSite and CSRF complications across origins. JWT tokens are sent via headers, making cross-origin auth straightforward. The two auth systems coexist — the backend still uses sessions for its template views.

### Why Chart.js over server-side matplotlib?

Matplotlib generates static PNG images on the server. Chart.js renders interactive charts in the browser — hover tooltips, animations, responsive resizing. The server only sends raw JSON data, reducing load and bandwidth. Charts update reactively when search results change, with no round-trip needed.

### Why Tailwind 4 when the backend uses Tailwind 3?

Tailwind 4 is the current version with a simpler setup (CSS-based config, no PostCSS). Since the repos have separate build pipelines, there's no conflict. The utility classes are compatible between versions, so the visual language stays consistent. Using the latest version demonstrates staying current with the ecosystem.

### Why Pinia over Vuex?

Pinia is the official recommended state management for Vue 3. It has full TypeScript support, a simpler API (no mutations concept), and the setup store syntax mirrors `<script setup>` in components. Vuex is in maintenance mode.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Django backend URL |

Create `.env.production` for production deployment with the real backend URL.

## API Endpoints

This frontend consumes the following backend API:

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/token/` | — | Obtain JWT pair |
| POST | `/api/auth/token/refresh/` | — | Refresh access token |
| GET | `/api/recipes/` | JWT | Paginated recipe list |
| GET | `/api/recipes/:id/` | JWT | Recipe detail |
| GET | `/api/recipes/search/` | JWT | Filtered search |
| GET | `/api/recipes/search/stats/` | JWT | Chart data |

## Maintainer & Contact

**Maintained by:** Nico Vece

- GitHub: [@nicovece](https://github.com/nicovece)
- LinkedIn: [nicovece](https://www.linkedin.com/in/nicovece/)
- Portfolio: [nicovece.github.io/cf-portfolio-astro](https://nicovece.github.io/cf-portfolio-astro/)

## License

MIT License
