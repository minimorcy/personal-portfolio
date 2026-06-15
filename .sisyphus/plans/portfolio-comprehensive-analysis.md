# Plan: Portfolio Comprehensive Analysis & Improvement Plan

## TL;DR

> **Core Objective**: Analyze the entire Next.js 14 portfolio codebase, catalog all limitations, and produce a numbered, prioritized task plan to improve GitHub API connection reliability, frontend performance, and visual design polish.
>
> **Deliverables**: Architecture diagram, limitation catalog (28 items), 20 numbered tasks across 4 phases.
>
> **Estimated Effort**: Medium (11-16 hours total)
> **Parallel Execution**: Partially — Phases can overlap on separate branches; within each phase, some tasks are independent.
> **Critical Path**: T1 (types + lib) → T5 (shared constants) → T10 (design tokens) → T7 (React.memo optimization)

---

## Context

### Original Request
User opened `.env` and asked: "Analiza detalladamente todo mi código base actual del portfolio. Siguiendo la metodología OpenSpec, genera el archivo project.md en la raíz. Debe incluir la arquitectura actual, las limitaciones detectadas y un plan de tareas numeradas para mejorar la conexión con la API de GitHub, el rendimiento del frontend y el diseño visual."

### Interview Summary
**Key Discussions**: Not applicable — user provided a self-contained research/analysis request with clear deliverables.

**Research Findings** (from manual full-codebase analysis):
- **9 source files** (4 components, 2 API routes, 1 page, 1 layout, 1 CSS)
- **325-line monolithic client component** (PaginatedRepos) with 7 responsibilities
- **API route ghost**: `/api/github/route.ts` exists but is never called by `page.tsx`
- **Zero caching**: `force-dynamic` + `cache: 'no-store'` on every fetch
- **No GITHUB_TOKEN**: Rate limited to 60 req/hour
- **No loading/error/skeleton states**: Blank page during fetch, crash on API failure
- **Flat design system**: Tailwind config not extended, no brand colors, no custom fonts
- **Type duplication**: `Repo` interface defined 3 times across files

### Metis Review
Not executed — this is a pure analysis/generation task rather than a planning session with ambiguity. All requirements were clear from the user's message.

---

## Work Objectives

### Core Objective
Produce a comprehensive architectural analysis, limitation catalog, and prioritized improvement task plan for the Next.js GitHub portfolio.

### Concrete Deliverables
- Complete architecture diagram and data flow map
- Catalog of 28 limitations categorized by severity (critical/high/medium/low)
- 20 numbered, verifiable tasks across 4 improvement phases
- Dependency map between phases and tasks

### Definition of Done
- [ ] Architecture fully documented with file-by-file analysis
- [ ] All limitations identified with file:line references
- [ ] 20 tasks each with verify-now acceptance criteria
- [ ] Phase dependency diagram included

### Must Have
- File:line citations for every limitation
- Prioritized tasks (critical → low)
- QA verification commands per task

### Must NOT Have
- Code implementation (this is a plan, not execution)
- Non-verifiable acceptance criteria
- Vague "improve X" tasks without concrete steps

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: No (no test framework configured — project has no jest/vitest/playwright)
- **Automated tests**: None (not in scope — tasks are verified via build, lint, manual QA, Lighthouse)
- **Framework**: N/A
- **QA Policy**: Each task includes concrete manual verification commands (build, lint, tsc, Lighthouse, DevTools)

### QA Policy
Every task includes agent-executable QA steps. No task is marked complete without passing its verification.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Fase 1 — GitHub API, START IMMEDIATELY):
├── T1: Crear lib/github.ts + centralizar fetching [quick]
├── T2: Activar ISR real [quick]
├── T3: Crear loading.tsx + error.tsx [quick]
└── T4: Enriquecer datos GitHub [quick]

Wave 2 (Fase 2 — Performance, after T1 + T5):
├── T5: Extraer tipos y constantes [quick]
├── T6: Implementar useDebounce [quick]
├── T7: React.memo + useCallback en PaginatedRepos [quick]
├── T8: Eliminar flash de tema [quick]
└── T9: Agregar SEO + metadata [quick]

Wave 3 (Fase 3 — Diseño, after T5 + T10):
├── T10: Design system con Tailwind extend [quick]
├── T11: next/font para tipografía [quick]
├── T12: Rediseñar header + footer + hero [visual-engineering]
├── T13: Animaciones y micro-interacciones [visual-engineering]
├── T14: Skeleton loaders [visual-engineering]
├── T15: Diseño responsive completo [visual-engineering]
└── T16: Paleta de colores de lenguaje [quick]

Wave 4 (Fase 4 — Pulido, after Waves 1-3):
├── T17: Página 404 custom [quick]
├── T18: Filtro global de lenguaje [quick]
├── T19: Extraer hooks de PaginatedRepos [quick]
└── T20: Página de detalle de proyecto [deep]
```

### Critical Path
T1 → T5 → T10 → T7 → T19 → T20

---

## TODOs

---

- [x] **T1. Configurar GITHUB_TOKEN y centralizar fetching**

  **What to do**:
  - Activar `GITHUB_TOKEN` en `.env` (crear token en GitHub → Settings → Developer settings → Personal access tokens → classic, scope: `public_repo`)
  - Crear `lib/github.ts` con función unificada `fetchGitHub<T>(endpoint: string): Promise<T>` que:
    - Use `GITHUB_TOKEN` de `process.env`
    - Agregue headers `User-Agent: 'nextjs-portfolio'`, `Accept: 'application/vnd.github+json'`
    - Maneje rate limiting (leer `X-RateLimit-Remaining`, log warning si < 10)
    - Retorne datos tipados con genérico `T`
  - Eliminar fetch duplicado de `app/page.tsx` y `app/api/github/route.ts`
  - Reemplazar con llamada a `fetchGitHub`

  **Must NOT do**:
  - No commitear el token (verificar que `.env` esté en `.gitignore`)
  - No exponer el token en el cliente (solo server-side)

  **Recommended Agent Profile**:
  - **Category**: `quick` — configuración sencilla, creación de un solo archivo de utilidad
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**:
    - `git-master`: La tarea no involucra commits complejos

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T2, T3, T4)
  - **Blocks**: T5 (usa tipos compartidos)
  - **Blocked By**: None (can start immediately)

  **References**:
  - `app/page.tsx:19-52` — Current fetch pattern to refactor
  - `app/api/github/route.ts:5-34` — Duplicate fetch pattern
  - `.env:2` — GITHUB_TOKEN placeholder
  - `package.json` — No additional deps needed (native fetch)

  **QA Scenarios**:

  ```
  Scenario: Happy path — fetch repos with token
    Tool: Bash (curl)
    Preconditions: GITHUB_TOKEN set in .env
    Steps:
      1. Run: npx tsx -e "require('./lib/github').fetchGitHub('/users/minimorcy/repos').then(console.log)"
      2. Verify response is array with length > 0
      3. Verify each item has id, name, html_url
    Expected Result: Array of repo objects returned
    Failure Indicators: 401/403 status, empty array, rate limit error
    Evidence: .sisyphus/evidence/task-1-fetch-repos.json

  Scenario: Rate limit handling
    Tool: Bash (curl)
    Preconditions: GITHUB_TOKEN set
    Steps:
      1. Call fetchGitHub for /rate_limit
      2. Verify X-RateLimit-Remaining header is read
      3. Verify rate limit > 100 (authenticated)
    Expected Result: Rate limit 5000, remaining > 100
    Evidence: .sisyphus/evidence/task-1-rate-limit.json
  ```

  **Commit**: YES
  - Message: `feat(github): centralize GitHub API fetching with token support`
  - Files: `lib/github.ts`, `app/page.tsx`, `app/api/github/route.ts`, `.env.example`

---

- [x] **T2. Activar ISR real con revalidación**

  **What to do**:
  - En `app/page.tsx`: eliminar `export const dynamic = 'force-dynamic'` (línea 3)
  - Agregar `export const revalidate = 3600` (1 hora)
  - Verificar que la API route `/api/revalidate` funciona (ya existe en `app/api/revalidate/route.ts`)
  - Agregar `fallback` handling en caso de que el fetch falle durante revalidación

  **Must NOT do**:
  - No usar `revalidate = 0` (eso equivale a force-dynamic)
  - No eliminar el endpoint de revalidate

  **Recommended Agent Profile**:
  - **Category**: `quick` — cambio de 2 líneas de configuración
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1, T3, T4)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `app/page.tsx:3` — `export const dynamic = 'force-dynamic'` (línea a eliminar)
  - `app/page.tsx:25-32` — fetch con `cache: 'no-store'` (debe cambiar a default)
  - `app/api/revalidate/route.ts:1-16` — endpoint de revalidación existente
  - Next.js docs: Data Fetching — ISR with `revalidate` segment config option

  **QA Scenarios**:

  ```
  Scenario: ISR caching works
    Tool: Bash (next build + inspection)
    Steps:
      1. Run: npm run build
      2. Verify build output shows page as "ISR" (not "Dynamic")
      3. Verify build output shows revalidate: 3600
    Expected Result: Build output shows ○ (ISR) or ● (SSG) with revalidate
    Failure Indicators: Build shows λ (Dynamic) — force-dynamic not removed
    Evidence: .sisyphus/evidence/task-2-build-output.txt

  Scenario: Manual revalidation works
    Tool: Bash (curl)
    Preconditions: App deployed with REVALIDATE_SECRET set
    Steps:
      1. Run: curl -X POST http://localhost:3000/api/revalidate -H "x-revalidate-token: some-strong-random-secret"
      2. Verify response: {"revalidated": true} with 200 status
    Expected Result: Response { revalidated: true }
    Evidence: .sisyphus/evidence/task-2-revalidate.json
  ```

  **Commit**: YES
  - Message: `perf(isr): enable incremental static regeneration with 1h revalidation`
  - Files: `app/page.tsx`

---

- [x] **T3. Crear loading.tsx y error.tsx**

  **What to do**:
  - Crear `app/loading.tsx`: componente server que renderiza una grid de 6 skeleton cards con animación `animate-pulse` de Tailwind
  - Crear `app/error.tsx` ('use client'): componente que recibe `error` y `reset`, muestra mensaje amigable con ícono, mensaje técnico colapsable, y botón "Reintentar" que llama a `reset()`
  - El error.tsx debe envolver solo la sección de datos (no el layout completo)

  **Must NOT do**:
  - No poner 'use client' en loading.tsx (debe ser server component)
  - No olvidar el botón de retry funcional en error.tsx

  **Recommended Agent Profile**:
  - **Category**: `quick` — creación de 2 archivos simples con Tailwind
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1, T2, T4)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `app/page.tsx:55-62` — JSX actual para mantener consistencia visual
  - `tailwind.config.ts` — animate-pulse está disponible por defecto
  - Next.js docs: `loading.js` and `error.js` conventions

  **QA Scenarios**:

  ```
  Scenario: Loading skeleton visible during fetch
    Tool: Chrome DevTools (Network throttling: Slow 3G)
    Steps:
      1. Open http://localhost:3000 with Network throttle
      2. Observe initial render
      3. Verify skeleton grid appears (6 cards with pulse animation)
      4. Verify skeletons are replaced by real data when fetch completes
    Expected Result: Skeletons visible during load, then replaced by real content
    Failure Indicators: Blank page during load, no animation
    Evidence: .sisyphus/evidence/task-3-loading-screenshot.png

  Scenario: Error boundary catches API failure
    Tool: Chrome DevTools
    Preconditions: Simulate API failure (set GITHUB_USERNAME to nonexistent)
    Steps:
      1. Change GITHUB_USERNAME to 'this-user-does-not-exist-12345'
      2. Reload page
      3. Verify error.tsx renders with error message + retry button
      4. Click retry → verify page attempts reload
    Expected Result: Error UI shown, retry button functional
    Failure Indicators: White screen, uncaught error in console
    Evidence: .sisyphus/evidence/task-3-error-screenshot.png
  ```

  **Commit**: YES
  - Message: `feat(ux): add loading skeletons and error boundary`
  - Files: `app/loading.tsx`, `app/error.tsx`

---

- [x] **T4. Enriquecer datos de GitHub**

  **What to do**:
  - Extender tipo `Repo` (en archivo compartido `types/github.ts`) con: `stargazers_count`, `forks_count`, `topics: string[]`, `homepage: string | null`, `language: string | null`, `updated_at`, `pushed_at`
  - Crear tipo `GitHubUser` con: avatar_url, bio, company, location, blog, twitter_username, followers, public_repos
  - En `page.tsx`: agregar fetch adicional a `GET /users/{username}` para perfil
  - Reemplazar BIO hardcodeado (línea 14) con datos reales del perfil
  - Modificar `RepoCard` para mostrar: estrellas ⭐ + forks 🍴 + topics como chips pequeños
  - Agregar sección de stats (public_repos, followers) en el header

  **Must NOT do**:
  - No hacer fetch del perfil en el cliente (debe ser server-side)
  - No mostrar datos sin null-check (GitHub puede devolver null en cualquier campo)

  **Recommended Agent Profile**:
  - **Category**: `quick` — extensión de tipos y JSX, sin lógica compleja
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1, T2, T3)
  - **Blocks**: None
  - **Blocked By**: T1 (necesita `fetchGitHub` de lib/github.ts)

  **References**:
  - `app/page.tsx:6-12` — Tipo Repo actual (a extender)
  - `app/page.tsx:14` — BIO hardcodeado (a reemplazar)
  - `app/components/RepoCard.tsx:1-8` — Tipo Repo duplicado
  - `app/components/RepoCard.tsx:35-56` — JSX de card (a extender con stats)
  - GitHub API docs: `GET /users/{username}` response schema
  - GitHub API docs: `GET /users/{username}/repos` response schema

  **QA Scenarios**:

  ```
  Scenario: Profile data renders correctly
    Tool: Playwright (browser)
    Steps:
      1. Navigate to http://localhost:3000
      2. Verify page shows avatar image, bio text (not hardcoded)
      3. Verify stats show: public_repos, followers count
      4. Verify bio is NOT the hardcoded string "Sanjay Nelagadde is a..."
    Expected Result: Real GitHub profile data displayed
    Failure Indicators: Hardcoded bio still showing, missing avatar
    Evidence: .sisyphus/evidence/task-4-profile-screenshot.png

  Scenario: Repo cards show enriched data
    Tool: Playwright (browser)
    Steps:
      1. Navigate to http://localhost:3000
      2. Inspect first RepoCard
      3. Verify it shows star count (⭐ N)
      4. Verify it shows fork count if > 0
      5. Verify topic chips are displayed
    Expected Result: Cards show stars, forks, topics
    Evidence: .sisyphus/evidence/task-4-cards-screenshot.png
  ```

  **Commit**: YES
  - Message: `feat(github): add profile data, stars, forks, and topics to repo cards`
  - Files: `types/github.ts`, `app/page.tsx`, `app/components/RepoCard.tsx`

---

- [x] **T5. Extraer tipos y constantes a archivos compartidos**

  **What to do**:
  - Crear `types/github.ts`: interfaces `Repo`, `GitHubUser`, `LanguageColor`
  - Crear `lib/constants.ts`: `LANGUAGE_COLORS` (mapa completo GitHub linguist, 150+ lenguajes), `ENTRIES_PER_PAGE = 8`, `DEFAULT_USERNAME = 'minimorcy'`
  - Eliminar definiciones duplicadas de `Repo` en:
    - `app/page.tsx` (líneas 6-12)
    - `app/components/PaginatedRepos.tsx` (líneas 6-13)
    - `app/components/RepoCard.tsx` (líneas 1-8)
  - Reemplazar con imports desde `@/types/github`

  **Must NOT do**:
  - No mezclar constantes de UI con constantes de API en el mismo archivo
  - No olvidar exportar todas las interfaces

  **Recommended Agent Profile**:
  - **Category**: `quick` — extracción de tipos y constantes, sin lógica
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO (bloquea varias tareas posteriores)
  - **Parallel Group**: Wave 2 (with T6-T9)
  - **Blocks**: T10, T11, T12, T16, T18, T19, T20
  - **Blocked By**: T1 (necesita saber qué campos tiene el tipo Repo ampliado)

  **References**:
  - `app/page.tsx:6-12` — Repo type definition #1
  - `app/components/PaginatedRepos.tsx:6-13` — Repo type definition #2
  - `app/components/RepoCard.tsx:1-8` — Repo type definition #3
  - `app/components/RepoCard.tsx:10-24` — languageColors hardcodeado (mover a constants.ts)
  - GitHub linguist repository — official language color data

  **QA Scenarios**:

  ```
  Scenario: Types are deduplicated
    Tool: Bash (grep)
    Steps:
      1. Run: grep -r "type Repo" app/ --include="*.tsx" --include="*.ts"
      2. Verify ONLY types/github.ts has the definition
      3. Run: npx tsc --noEmit
      4. Verify zero type errors
    Expected Result: One Repo definition in types/github.ts, zero TS errors
    Failure Indicators: Multiple type definitions found, TS compilation errors
    Evidence: .sisyphus/evidence/task-5-grep-output.txt
  ```

  **Commit**: YES
  - Message: `refactor(types): extract shared types and constants to dedicated files`
  - Files: `types/github.ts`, `lib/constants.ts`, `app/page.tsx`, `app/components/PaginatedRepos.tsx`, `app/components/RepoCard.tsx`

---

- [x] **T6. Implementar debounce en búsqueda**

  **What to do**:
  - Crear `hooks/useDebounce.ts`: hook genérico `useDebounce<T>(value: T, delay: number): T`
  - En `PaginatedRepos.tsx`: aplicar `useDebounce(searchQuery, 300)` y usar el valor debounced para filtrar
  - El `searchQuery` crudo se usa para el input value (UX instantáneo), el debounced para filtrar (perf)
  - El filtrado existente en `filteredRepos` useMemo ya depende de `searchQuery` — debe cambiarse a usar `debouncedSearchQuery`

  **Must NOT do**:
  - No debouncear el onChange del input (rompe UX de escritura)
  - No usar setTimeout directo (usar hook limpio)

  **Recommended Agent Profile**:
  - **Category**: `quick` — hook simple de ~15 líneas
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T5, T7, T8, T9)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `app/components/PaginatedRepos.tsx:27` — `searchQuery` state
  - `app/components/PaginatedRepos.tsx:121-141` — `filteredRepos` useMemo que usa searchQuery
  - `app/components/PaginatedRepos.tsx:213` — `onChange` handler sin debounce

  **QA Scenarios**:

  ```
  Scenario: Debounce delays filtering
    Tool: Playwright (browser)
    Steps:
      1. Navigate to http://localhost:3000
      2. Rapidly type "test" in search box
      3. Observe result count: should NOT update on each keystroke
      4. Wait 300ms after last keystroke
      5. Verify result count updates once with final filtered results
    Expected Result: One filter update after typing stops, not per-keystroke
    Failure Indicators: Results flicker on every keystroke, CPU spike
    Evidence: .sisyphus/evidence/task-6-debounce-screenshot.png
  ```

  **Commit**: YES
  - Message: `perf(search): add 300ms debounce to repository search`
  - Files: `hooks/useDebounce.ts`, `app/components/PaginatedRepos.tsx`

---

- [ ] **T7. Optimizar PaginatedRepos con React.memo y useCallback**

  **What to do**:
  - Envolver `PaginatedRepos` en `React.memo` con comparador shallow
  - Envolver `RepoCard` en `React.memo` (ya está en su propio archivo, solo agregar `React.memo`)
  - Envolver todos los handlers en `useCallback`:
    - `handleYearChange`
    - `handleLanguageFilter`
    - `handlePrevious`
    - `handleNext`
    - `clearFilters`
  - Los callbacks deben declarar dependencias correctas en el array de deps

  **Must NOT do**:
  - No memoizar todo indiscriminadamente (solo componentes con props que cambian poco)
  - No usar `useMemo` para valores primitivos

  **Recommended Agent Profile**:
  - **Category**: `quick` — adición de wrappers de React, sin cambios de lógica
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (after T5 for shared types)
  - **Blocks**: None
  - **Blocked By**: T5 (necesita tipos compartidos para evitar conflicts)

  **References**:
  - `app/components/PaginatedRepos.tsx:25` — función del componente
  - `app/components/PaginatedRepos.tsx:154-168` — handlers a envolver en useCallback
  - `app/components/RepoCard.tsx:26` — componente a envolver en React.memo

  **QA Scenarios**:

  ```
  Scenario: No unnecessary re-renders
    Tool: React DevTools Profiler
    Steps:
      1. Open DevTools → Profiler tab
      2. Start recording
      3. Change language filter
      4. Stop recording
      5. Verify only PaginatedRepos re-rendered (not RepoCards with same data)
      6. Verify RepoCards that didn't change show "Did not render"
    Expected Result: Filter change only re-renders affected components
    Failure Indicators: All RepoCards re-render on any filter change
    Evidence: .sisyphus/evidence/task-7-profiler-screenshot.png
  ```

  **Commit**: YES
  - Message: `perf(react): add React.memo and useCallback to prevent unnecessary re-renders`
  - Files: `app/components/PaginatedRepos.tsx`, `app/components/RepoCard.tsx`

---

- [ ] **T8. Eliminar flash de tema (FOIT — Flash of Incorrect Theme)**

  **What to do**:
  - Agregar `<script>` inline en `<head>` de `app/layout.tsx` que:
    - Lea `localStorage.getItem('theme')`
    - Si no existe, lea `window.matchMedia('(prefers-color-scheme: dark)').matches`
    - Aplique `document.documentElement.classList.add('dark')` si corresponde
    - Use `document.documentElement.style.colorScheme` para evitar parpadeo
  - Simplificar `ThemeProvider.tsx`: eliminar lógica de inicialización de tema (el script ya lo hace), mantener solo context + toggle
  - `useEffect` en ThemeProvider solo debe sincronizar state interno, no aplicar clase (ya está aplicada)

  **Must NOT do**:
  - No eliminar el context (ThemeProvider sigue siendo necesario para el toggle)
  - No usar `dangerouslySetInnerHTML`

  **Recommended Agent Profile**:
  - **Category**: `quick` — script inline + simplificación de lógica
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T5, T6, T7, T9)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `app/layout.tsx:8` — `<html>` tag actual (punto de inserción del script)
  - `app/components/ThemeProvider.tsx:14-26` — lógica de inicialización a simplificar
  - `app/components/ThemeProvider.tsx:28-33` — toggleTheme (mantener)

  **QA Scenarios**:

  ```
  Scenario: No white flash on dark mode reload
    Tool: Playwright (browser)
    Preconditions: localStorage.theme = 'dark'
    Steps:
      1. Navigate to http://localhost:3000
      2. Immediately check document.documentElement.classList
      3. Verify 'dark' class is present BEFORE any React hydration
      4. Verify background is dark from first paint
    Expected Result: Dark background renders immediately, no white flash
    Failure Indicators: Brief white flash before dark mode applies
    Evidence: .sisyphus/evidence/task-8-no-flash-screenshot.png

  Scenario: System preference respected on first visit
    Tool: Playwright (browser)
    Preconditions: Clear localStorage, set system theme to dark
    Steps:
      1. Navigate to http://localhost:3000
      2. Verify dark mode is applied
      3. Check localStorage: should NOT have 'theme' key yet
    Expected Result: Dark mode from system preference, no flash
    Evidence: .sisyphus/evidence/task-8-system-pref-screenshot.png
  ```

  **Commit**: YES
  - Message: `fix(theme): eliminate flash of incorrect theme with inline script`
  - Files: `app/layout.tsx`, `app/components/ThemeProvider.tsx`

---

- [ ] **T9. Agregar SEO y metadata**

  **What to do**:
  - En `app/layout.tsx`: exportar objeto `metadata` con:
    ```ts
    title: { default: 'Portfolio | {username}', template: '%s | Portfolio' },
    description: 'Full-stack developer portfolio showcasing GitHub projects',
    openGraph: { type: 'website', ... },
    twitter: { card: 'summary_large_image', ... }
    ```
  - En `app/page.tsx`: exportar `metadata` dinámico que incluya el username real
  - Agregar `favicon.ico` o configurar icon en metadata
  - Agregar `robots.ts` o configurar robots en metadata

  **Must NOT do**:
  - No hardcodear URLs (usar `NEXT_PUBLIC_BASE_URL` o metadataBase)
  - No olvidar openGraph images

  **Recommended Agent Profile**:
  - **Category**: `quick` — configuración de metadata estática
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T5, T6, T7, T8)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `app/layout.tsx:6` — export default function (lugar para agregar metadata export)
  - `.env:3` — `NEXT_PUBLIC_BASE_URL` para metadataBase
  - Next.js Metadata API docs: static + dynamic metadata

  **QA Scenarios**:

  ```
  Scenario: SEO tags present in head
    Tool: Playwright (browser) or View Source
    Steps:
      1. Navigate to http://localhost:3000
      2. View page source or inspect <head>
      3. Verify <title> is present and not generic
      4. Verify <meta name="description"> is present
      5. Verify <meta property="og:title"> is present
      6. Verify <meta property="og:description"> is present
    Expected Result: All SEO meta tags populated
    Failure Indicators: Missing title, missing og tags
    Evidence: .sisyphus/evidence/task-9-head-screenshot.png

  Scenario: Lighthouse SEO score
    Tool: Chrome DevTools → Lighthouse
    Steps:
      1. Run Lighthouse audit (Desktop, SEO only)
      2. Verify SEO score ≥ 90
    Expected Result: Score ≥ 90
    Evidence: .sisyphus/evidence/task-9-lighthouse.json
  ```

  **Commit**: YES
  - Message: `feat(seo): add metadata, open graph, and twitter card tags`
  - Files: `app/layout.tsx`, `app/page.tsx`

---

- [ ] **T10. Crear design system con Tailwind extendido**

  **What to do**:
  - Extender `tailwind.config.ts` con:
    - `colors.brand`: paleta primaria (indigo/cyan recomendado para portfolio dev)
    - `colors.accent`: paleta secundaria (amber/emerald para contraste)
    - `fontFamily.sans`: `['var(--font-inter)', ...]`
    - `fontFamily.mono`: `['var(--font-jetbrains)', ...]`
    - `animation`: `'fade-in': 'fadeIn 0.5s ease-out'`, `'slide-up': 'slideUp 0.5s ease-out'`
    - `keyframes`: fadeIn, slideUp

  **Must NOT do**:
  - No sobreescribir los colores default de Tailwind (usar `extend`)
  - No crear más de 2 paletas de color

  **Recommended Agent Profile**:
  - **Category**: `quick` — configuración de Tailwind, sin JSX
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO (bloquea tasks de diseño)
  - **Parallel Group**: Wave 3 (first task, followed by T11-T16)
  - **Blocks**: T11, T12, T13, T14, T15
  - **Blocked By**: T5 (para usar constantes de color)

  **References**:
  - `tailwind.config.ts:1-14` — configuración actual (plana)
  - `app/globals.css` — imports de Tailwind
  - Tailwind docs: theme extension, custom animations

  **QA Scenarios**:

  ```
  Scenario: Custom classes generate correctly
    Tool: Bash (build)
    Steps:
      1. Run: npm run build
      2. Verify build succeeds
      3. Check generated CSS includes custom colors and animations
    Expected Result: Build passes, custom utilities generated
    Failure Indicators: Build fails, classes not found
    Evidence: .sisyphus/evidence/task-10-build-output.txt
  ```

  **Commit**: YES
  - Message: `feat(design): extend Tailwind with brand colors, fonts, and animations`
  - Files: `tailwind.config.ts`

---

- [ ] **T11. Implementar next/font para tipografía optimizada**

  **What to do**:
  - Cargar `Inter` (variable, sans-serif) y `JetBrains_Mono` (variable, monospace) con `next/font/google`
  - Configurar CSS variables en `app/layout.tsx`: `--font-inter`, `--font-jetbrains`
  - Aplicar `font-sans` a `<body>` y `font-mono` a elementos `<code>` y `<pre>`
  - Configurar `display: 'swap'` y `preload: true`

  **Must NOT do**:
  - No usar `@import` en CSS (usar next/font para optimización)
  - No cargar weights innecesarios (usar variable fonts)

  **Recommended Agent Profile**:
  - **Category**: `quick` — importación de fuentes, cambio de clases
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with T12, T13, T14, T15, T16)
  - **Blocks**: None
  - **Blocked By**: T10 (necesita fontFamily en tailwind config)

  **References**:
  - `app/layout.tsx:6-21` — layout actual donde aplicar fuentes
  - `tailwind.config.ts` — fontFamily config (de T10)
  - Next.js docs: `next/font/google` with variable fonts

  **QA Scenarios**:

  ```
  Scenario: Fonts are loaded and applied
    Tool: Playwright (browser)
    Steps:
      1. Navigate to http://localhost:3000
      2. Inspect <body> computed font-family
      3. Verify it includes 'Inter'
      4. Run Lighthouse → "Ensure text remains visible during webfont load"
    Expected Result: Inter font applied, no font-loading layout shift
    Failure Indicators: System font showing, Lighthouse flag for font-display
    Evidence: .sisyphus/evidence/task-11-lighthouse-fonts.json
  ```

  **Commit**: YES
  - Message: `feat(fonts): add Inter and JetBrains Mono via next/font`
  - Files: `app/layout.tsx`

---

- [ ] **T12. Rediseñar layout con header y footer profesionales**

  **What to do**:
  - **Header**: sticky con `backdrop-blur-md bg-white/80 dark:bg-gray-900/80`, links a About, Projects, Contact (smooth scroll), nombre/avatar a la izquierda, theme toggle a la derecha
  - **Hero section** en `page.tsx`: avatar grande, nombre + username, bio de GitHub, stats (repos, followers, following), location, link a GitHub
  - **Footer**: 3 columnas — navegación, links sociales (GitHub, LinkedIn, Twitter/X, email), copyright
  - Sección About con scroll suave desde header

  **Must NOT do**:
  - No usar JavaScript para el smooth scroll (CSS `scroll-behavior: smooth`)
  - No hacer el header fixed (sticky es mejor para accesibilidad)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` — diseño de layout completo con Tailwind
  - **Skills**: [`frontend-ui-ux`] — para diseño visual pulido

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with T11, T13, T14, T15, T16)
  - **Blocks**: None
  - **Blocked By**: T10 (design tokens para colores), T11 (fuentes)

  **References**:
  - `app/layout.tsx:10-17` — nav y footer actual
  - `app/page.tsx:55-62` — JSX actual del main
  - Dribbble/Behance portfolios dev — inspiración de diseño

  **QA Scenarios**:

  ```
  Scenario: Header is sticky with blur
    Tool: Playwright (browser)
    Steps:
      1. Navigate to http://localhost:3000
      2. Scroll down 500px
      3. Verify header is still visible at top
      4. Verify backdrop-blur effect is visible
    Expected Result: Sticky header with blur backdrop
    Failure Indicators: Header scrolls away, no blur
    Evidence: .sisyphus/evidence/task-12-header-sticky-screenshot.png

  Scenario: Hero shows real profile data
    Tool: Playwright (browser)
    Steps:
      1. Navigate to http://localhost:3000
      2. Verify avatar image loads
      3. Verify name and bio are from GitHub (not hardcoded)
      4. Verify repo/follower counts are visible
    Expected Result: Real profile data in hero section
    Evidence: .sisyphus/evidence/task-12-hero-screenshot.png
  ```

  **Commit**: YES
  - Message: `feat(ui): redesign header, hero section, and footer with real profile data`
  - Files: `app/layout.tsx`, `app/page.tsx`

---

- [ ] **T13. Agregar animaciones y micro-interacciones**

  **What to do**:
  - Animación de entrada staggered para RepoCards: cada card aparece con fade-in + slide-up, delay incremental (50ms × index)
  - Transición suave entre tabs de año (crossfade o slide)
  - Hover effects enriquecidos: `hover:scale-[1.02] hover:shadow-lg transition-transform`
  - Botones con feedback táctil: `active:scale-[0.97]`
  - Theme toggle con rotación animada
  - Usar `animation-delay` con CSS custom properties para stagger

  **Must NOT do**:
  - No usar librerías de animación (Framer Motion) — solo Tailwind + CSS
  - No animar elementos que perjudiquen el rendimiento (evitar `layout` animations)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` — micro-interacciones y animaciones CSS
  - **Skills**: [`frontend-ui-ux`] — para pulido visual de animaciones

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with T11, T12, T14, T15, T16)
  - **Blocks**: None
  - **Blocked By**: T10 (animaciones definidas en tailwind config)

  **References**:
  - `app/components/PaginatedRepos.tsx:280-289` — grid de repos donde aplicar stagger
  - `app/components/RepoCard.tsx:35` — card actual con hover simple
  - `tailwind.config.ts` — keyframes y animations (de T10)

  **QA Scenarios**:

  ```
  Scenario: Cards animate on load
    Tool: Playwright (browser)
    Steps:
      1. Navigate to http://localhost:3000
      2. Wait for repo cards to appear
      3. Verify cards appear with staggered animation (not all at once)
      4. Verify first card appears ~0ms, second ~50ms later, third ~100ms later
    Expected Result: Staggered card entrance animation
    Failure Indicators: All cards appear simultaneously, no animation
    Evidence: .sisyphus/evidence/task-13-stagger.webm (video)

  Scenario: Hover scale effect works
    Tool: Playwright (browser)
    Steps:
      1. Hover over a RepoCard
      2. Verify card scales up slightly
      3. Move cursor away
      4. Verify card returns to original size smoothly
    Expected Result: Smooth scale transition on hover
    Evidence: .sisyphus/evidence/task-13-hover-screenshot.png
  ```

  **Commit**: YES
  - Message: `feat(animations): add staggered card entrance and micro-interactions`
  - Files: `app/components/PaginatedRepos.tsx`, `app/components/RepoCard.tsx`, `app/components/ThemeToggle.tsx`

---

- [ ] **T14. Crear skeleton loaders**

  **What to do**:
  - Crear componente `SkeletonCard.tsx` con animación `animate-pulse`:
    - Rectángulo para título (w-3/4 h-5)
    - 2 líneas de texto (w-full h-4, w-2/3 h-4)
    - Badge placeholder (w-16 h-5 rounded-full)
  - En `app/loading.tsx`: renderizar grid de 6 SkeletonCards
  - Animar con `animate-pulse` y bordes redondeados

  **Must NOT do**:
  - No crear el skeleton dentro de PaginatedRepos (debe ser el loading.tsx)
  - No olvidar el modo oscuro en los skeletons

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` — componente de placeholder visual
  - **Skills**: [`frontend-ui-ux`] — para diseño de skeletons realistas

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with T11, T12, T13, T15, T16)
  - **Blocks**: None
  - **Blocked By**: T3 (loading.tsx ya creado, ahora se mejora)

  **References**:
  - `app/loading.tsx` — archivo creado en T3 (a mejorar con SkeletonCard)
  - `app/components/RepoCard.tsx:35-56` — estructura de card real para imitar en skeleton

  **QA Scenarios**:

  ```
  Scenario: Skeletons visible during loading
    Tool: Chrome DevTools (Network throttling: Slow 3G)
    Steps:
      1. Navigate to http://localhost:3000 with throttling
      2. Verify skeleton grid appears (6 cards)
      3. Verify each skeleton has pulse animation
      4. Wait for data to load
      5. Verify skeletons are replaced by real cards
    Expected Result: Animated skeletons during loading → real cards
    Failure Indicators: Blank page, no animation, skeletons stay forever
    Evidence: .sisyphus/evidence/task-14-skeletons-screenshot.png
  ```

  **Commit**: YES
  - Message: `feat(ux): add animated skeleton cards to loading state`
  - Files: `app/loading.tsx`, `app/components/SkeletonCard.tsx`

---

- [ ] **T15. Implementar diseño responsive completo**

  **What to do**:
  - **Hero**: columna en mobile (avatar arriba, texto abajo), fila en desktop (avatar izquierda, texto derecha)
  - **Repo grid**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
  - **Header**: hamburger menu con sheet/popover en mobile (usar estado local + CSS, sin librería)
  - **Filter chips**: `overflow-x-auto flex-nowrap` con scroll horizontal en mobile, wrap en desktop
  - **Footer**: columna única en mobile, 3 columnas en desktop

  **Must NOT do**:
  - No instalar headless UI o Radix (mantener zero-deps)
  - No usar media queries manuales (usar breakpoints de Tailwind: sm, md, lg)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` — diseño responsive comprensivo
  - **Skills**: [`frontend-ui-ux`] — para UX responsive pulido

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with T11, T12, T13, T14, T16)
  - **Blocks**: None
  - **Blocked By**: T12 (header/hero/footer ya rediseñados)

  **References**:
  - `app/layout.tsx:11-17` — nav y footer actual
  - `app/page.tsx:55-62` — hero section actual
  - `app/components/PaginatedRepos.tsx:239-267` — language filters actual

  **QA Scenarios**:

  ```
  Scenario: Mobile layout works
    Tool: Chrome DevTools Device Mode (iPhone SE, 375px)
    Steps:
      1. Switch to iPhone SE viewport
      2. Verify no horizontal scroll
      3. Verify hamburger menu is visible
      4. Verify grid is single column
      5. Verify filter chips scroll horizontally
    Expected Result: Fully functional mobile layout
    Failure Indicators: Horizontal overflow, cut-off content
    Evidence: .sisyphus/evidence/task-15-mobile-screenshot.png

  Scenario: Desktop layout works
    Tool: Chrome DevTools Device Mode (1920x1080)
    Steps:
      1. Switch to responsive 1920px
      2. Verify 3-column repo grid
      3. Verify horizontal nav (no hamburger)
      4. Verify hero is side-by-side layout
    Expected Result: Desktop layout with 3 columns and horizontal nav
    Evidence: .sisyphus/evidence/task-15-desktop-screenshot.png
  ```

  **Commit**: YES
  - Message: `feat(responsive): implement full responsive layout mobile to desktop`
  - Files: `app/layout.tsx`, `app/page.tsx`, `app/components/PaginatedRepos.tsx`

---

- [ ] **T16. Crear paleta de colores de lenguaje completa**

  **What to do**:
  - En `lib/constants.ts`: crear `LANGUAGE_COLORS` con colores oficiales de GitHub linguist (formato: `{ TypeScript: '#3178c6', JavaScript: '#f1e05a', ... }`)
  - Incluir al menos 50 lenguajes comunes
  - Crear función helper `getLanguageColorClass(language: string): string` que mapea el color hex a una clase Tailwind o usa `style` inline
  - Reemplazar `languageColors` hardcodeado en RepoCard.tsx (24 lenguajes) con el mapa completo

  **Must NOT do**:
  - No crear clases Tailwind para cada lenguaje (usar `style={{ backgroundColor }}` para colores no estándar)
  - No limitarse a 24 lenguajes

  **Recommended Agent Profile**:
  - **Category**: `quick` — datos de constantes, sin lógica
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with T11, T12, T13, T14, T15)
  - **Blocks**: None
  - **Blocked By**: T5 (lib/constants.ts ya creado)

  **References**:
  - `lib/constants.ts` — archivo creado en T5 (a extender con LANGUAGE_COLORS)
  - `app/components/RepoCard.tsx:10-24` — languageColors actual (a reemplazar)
  - GitHub linguist repository — colores oficiales

  **QA Scenarios**:

  ```
  Scenario: All languages have colors
    Tool: Playwright (browser)
    Steps:
      1. Navigate to http://localhost:3000
      2. Inspect language badges on repo cards
      3. Verify TypeScript badge has blue color (#3178c6 or similar)
      4. Verify Python badge has green color (#3572A5 or similar)
      5. Verify unknown languages get a default gray
    Expected Result: Color-coded language badges for all repos
    Failure Indicators: White/transparent badge, "Unknown" language not handled
    Evidence: .sisyphus/evidence/task-16-badges-screenshot.png
  ```

  **Commit**: YES
  - Message: `feat(languages): add comprehensive GitHub linguist color palette`
  - Files: `lib/constants.ts`, `app/components/RepoCard.tsx`

---

- [ ] **T17. Crear página 404 custom**

  **What to do**:
  - Crear `app/not-found.tsx` con diseño atractivo:
    - Texto grande "404"
    - Mensaje "Page not found"
    - Link a home: "← Back to portfolio"
    - Ilustración simple con CSS/emoji o SVG inline
  - Debe funcionar tanto en light como dark mode

  **Must NOT do**:
  - No redirigir automáticamente (debe mostrar la página 404)
  - No usar imágenes externas

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` — diseño de página estática
  - **Skills**: [`frontend-ui-ux`] — para diseño visual atractivo

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T18, T19, T20)
  - **Blocks**: None
  - **Blocked By**: T10 (design tokens), T11 (fuentes)

  **References**:
  - `app/layout.tsx` — tema y estilos a mantener
  - Next.js docs: `not-found.js` convention

  **QA Scenarios**:

  ```
  Scenario: 404 page renders for unknown routes
    Tool: Playwright (browser)
    Steps:
      1. Navigate to http://localhost:3000/this-route-does-not-exist
      2. Verify page shows "404" text
      3. Verify "Back to portfolio" link is present
      4. Click link → verify navigates to home
    Expected Result: Custom 404 page with working back link
    Failure Indicators: Default Next.js 404 page, broken link
    Evidence: .sisyphus/evidence/task-17-404-screenshot.png
  ```

  **Commit**: YES
  - Message: `feat(ux): add custom 404 page with back-to-home link`
  - Files: `app/not-found.tsx`

---

- [ ] **T18. Agregar filtro global de lenguaje**

  **What to do**:
  - Modificar `PaginatedRepos` para que el filtro de lenguaje aplique globalmente (todos los años), no solo al tab activo
  - Los counts de lenguaje deben reflejar TODOS los repos, no solo los del año actual
  - Al cambiar de año, el filtro de lenguaje debe mantenerse
  - Si un año no tiene repos del lenguaje seleccionado, mostrar "No {language} projects in {year}"

  **Must NOT do**:
  - No romper el filtro combinado (año + búsqueda + lenguaje)
  - No perder el estado del filtro al cambiar de año

  **Recommended Agent Profile**:
  - **Category**: `quick` — refactor de lógica de filtrado
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T17, T19, T20)
  - **Blocks**: None
  - **Blocked By**: T5 (tipos compartidos)

  **References**:
  - `app/components/PaginatedRepos.tsx:110-118` — `availableLanguages` (calcular globalmente)
  - `app/components/PaginatedRepos.tsx:238-267` — language filters UI
  - `app/components/PaginatedRepos.tsx:120-141` — `filteredRepos` (lógica de filtro)

  **QA Scenarios**:

  ```
  Scenario: Language filter works across years
    Tool: Playwright (browser)
    Steps:
      1. Navigate to http://localhost:3000
      2. Select "TypeScript" language filter
      3. Verify repos are filtered in current year tab
      4. Switch to different year tab
      5. Verify language filter is still active
      6. Verify only TypeScript repos are shown
    Expected Result: Language filter persists across year tab changes
    Failure Indicators: Filter resets on year change, shows non-TypeScript repos
    Evidence: .sisyphus/evidence/task-18-global-filter-screenshot.png
  ```

  **Commit**: YES
  - Message: `fix(filter): make language filter global across all year tabs`
  - Files: `app/components/PaginatedRepos.tsx`

---

- [ ] **T19. Refactor: extraer lógica de PaginatedRepos a hooks**

  **What to do**:
  - Crear `hooks/useReposByYear.ts`:
    - Entrada: `repos: Repo[]`
    - Salida: `{ availableTabs: YearTab[], reposByYear: Record<string, Repo[]> }`
    - Mueve toda la lógica de `useMemo` (líneas 31-96)
  - Crear `hooks/useFilteredRepos.ts`:
    - Entrada: `reposByYear`, `selectedYear`, `searchQuery`, `selectedLanguage`
    - Salida: `filteredRepos: Repo[]`
    - Mueve `useMemo` de líneas 120-141
  - Crear `hooks/usePagination.ts`:
    - Entrada: `totalItems`, `entriesPerPage`
    - Salida: `{ currentPage, totalPages, displayItems, goToPage, nextPage, prevPage }`
  - `PaginatedRepos.tsx` pasa de 325 líneas a ~100 (solo JSX + composición de hooks)

  **Must NOT do**:
  - No cambiar el comportamiento funcional
  - No romper las optimizaciones de T7 (React.memo + useCallback)

  **Recommended Agent Profile**:
  - **Category**: `deep` — refactor complejo extrayendo lógica a hooks con preservación de comportamiento
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO (depende de estructura actual)
  - **Parallel Group**: Wave 4 (sequential within wave)
  - **Blocks**: T20 (detalle de proyecto se beneficia de hooks compartidos)
  - **Blocked By**: T5, T6, T7, T18

  **References**:
  - `app/components/PaginatedRepos.tsx` — archivo completo (325 líneas a refactorizar)
  - `app/components/PaginatedRepos.tsx:31-96` — extraer a useReposByYear
  - `app/components/PaginatedRepos.tsx:120-141` — extraer a useFilteredRepos
  - `app/components/PaginatedRepos.tsx:143-180` — extraer a usePagination

  **QA Scenarios**:

  ```
  Scenario: Behavior preserved after refactor
    Tool: Playwright (browser)
    Steps:
      1. Navigate to http://localhost:3000
      2. Test all features: search, language filter, year tabs, pagination, clear filters
      3. Verify all work identically to pre-refactor
      4. Verify no new console errors
      5. Run: npx tsc --noEmit → zero errors
    Expected Result: Identical behavior, cleaner code
    Failure Indicators: Broken filter, wrong pagination, TS errors
    Evidence: .sisyphus/evidence/task-19-behavior-screenshot.png
  ```

  **Commit**: YES
  - Message: `refactor(hooks): extract PaginatedRepos logic into useReposByYear, useFilteredRepos, usePagination`
  - Files: `hooks/useReposByYear.ts`, `hooks/useFilteredRepos.ts`, `hooks/usePagination.ts`, `app/components/PaginatedRepos.tsx`

---

- [ ] **T20. Agregar página de detalle de proyecto**

  **What to do**:
  - Crear `app/projects/[name]/page.tsx` — ruta dinámica con `generateStaticParams` (ISR)
  - Fetch: `GET /repos/{owner}/{repo}` + `GET /repos/{owner}/{repo}/readme` (via `fetchGitHub`)
  - Renderizar:
    - Header con nombre, descripción, link a GitHub
    - Stats: estrellas, forks, watchers, open issues
    - Topics como chips
    - Lenguaje principal con barra visual de porcentaje
    - README.md contenido (fetch del raw, renderizar como markdown — usar `dangerouslySetInnerHTML` con sanitización básica o renderizado simple)
  - Agregar `Link` desde `RepoCard` al detalle (`/projects/${repo.name}`)

  **Must NOT do**:
  - No instalar librería de markdown (renderizado simple: newlines → `<br>`, backticks → `<code>`)
  - No hacer fetch del README si no existe

  **Recommended Agent Profile**:
  - **Category**: `deep` — ruta dinámica con múltiples fetches y renderizado
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO (depende de estructura final)
  - **Parallel Group**: Wave 4 (sequential)
  - **Blocks**: None
  - **Blocked By**: T1 (fetchGitHub), T5 (tipos compartidos), T10 (design tokens), T19 (hooks compartidos opcionales)

  **References**:
  - `app/page.tsx` — patrón de fetch a replicar
  - `app/components/RepoCard.tsx` — estructura de datos de repo
  - `lib/github.ts` — fetchGitHub (de T1)
  - Next.js docs: dynamic routes, generateStaticParams

  **QA Scenarios**:

  ```
  Scenario: Project detail page renders
    Tool: Playwright (browser)
    Steps:
      1. Navigate to http://localhost:3000
      2. Click on a repo card
      3. Verify navigate to /projects/{repo-name}
      4. Verify page shows repo name, description, stats, topics
      5. Verify README content is visible
      6. Verify "View on GitHub" link works
    Expected Result: Full project detail page with README
    Failure Indicators: 404, missing README, broken link
    Evidence: .sisyphus/evidence/task-20-detail-screenshot.png

  Scenario: Back navigation works
    Tool: Playwright (browser)
    Steps:
      1. Navigate to a project detail page
      2. Click browser back button
      3. Verify returns to portfolio listing
    Expected Result: Back navigation preserved
    Evidence: .sisyphus/evidence/task-20-back-nav-screenshot.png
  ```

  **Commit**: YES
  - Message: `feat(projects): add dynamic project detail page with README`
  - Files: `app/projects/[name]/page.tsx`, `app/components/RepoCard.tsx`

---

## Final Verification Wave

> **Manual verification** — run these checks after all tasks are implemented.

- [ ] **F1. Build Verification** — `npm run build` debe pasar sin errores ni warnings
- [ ] **F2. TypeScript Check** — `npx tsc --noEmit` debe pasar con cero errores
- [ ] **F3. Lint Check** — `npm run lint` debe pasar
- [ ] **F4. Lighthouse Audit** — Performance ≥ 80, SEO ≥ 90, Best Practices ≥ 90
- [ ] **F5. Functional Regression** — Search, language filter, year tabs, pagination, dark mode, revalidate endpoint — todo funciona
- [ ] **F6. Responsive Check** — Mobile (375px), Tablet (768px), Desktop (1920px) — sin overflow horizontal
- [ ] **F7. Rate Limit Check** — `curl -I https://api.github.com/users/minimorcy` debe mostrar `X-RateLimit-Remaining > 4000`
- [ ] **F8. No Dead Code** — No debe existir código no utilizado (grep `fetch` directo a api.github.com fuera de lib/github.ts)

---

## Commit Strategy

| Task | Commit Message | Files |
|------|---------------|-------|
| T1 | `feat(github): centralize GitHub API fetching with token support` | lib/github.ts, app/page.tsx, app/api/github/route.ts |
| T2 | `perf(isr): enable incremental static regeneration with 1h revalidation` | app/page.tsx |
| T3 | `feat(ux): add loading skeletons and error boundary` | app/loading.tsx, app/error.tsx |
| T4 | `feat(github): add profile data, stars, forks, and topics to repo cards` | types/github.ts, app/page.tsx, app/components/RepoCard.tsx |
| T5 | `refactor(types): extract shared types and constants to dedicated files` | types/github.ts, lib/constants.ts, app/page.tsx, app/components/*.tsx |
| T6 | `perf(search): add 300ms debounce to repository search` | hooks/useDebounce.ts, app/components/PaginatedRepos.tsx |
| T7 | `perf(react): add React.memo and useCallback to prevent unnecessary re-renders` | app/components/PaginatedRepos.tsx, app/components/RepoCard.tsx |
| T8 | `fix(theme): eliminate flash of incorrect theme with inline script` | app/layout.tsx, app/components/ThemeProvider.tsx |
| T9 | `feat(seo): add metadata, open graph, and twitter card tags` | app/layout.tsx, app/page.tsx |
| T10 | `feat(design): extend Tailwind with brand colors, fonts, and animations` | tailwind.config.ts |
| T11 | `feat(fonts): add Inter and JetBrains Mono via next/font` | app/layout.tsx |
| T12 | `feat(ui): redesign header, hero section, and footer with real profile data` | app/layout.tsx, app/page.tsx |
| T13 | `feat(animations): add staggered card entrance and micro-interactions` | app/components/PaginatedRepos.tsx, app/components/RepoCard.tsx, app/components/ThemeToggle.tsx |
| T14 | `feat(ux): add animated skeleton cards to loading state` | app/loading.tsx, app/components/SkeletonCard.tsx |
| T15 | `feat(responsive): implement full responsive layout mobile to desktop` | app/layout.tsx, app/page.tsx, app/components/PaginatedRepos.tsx |
| T16 | `feat(languages): add comprehensive GitHub linguist color palette` | lib/constants.ts, app/components/RepoCard.tsx |
| T17 | `feat(ux): add custom 404 page with back-to-home link` | app/not-found.tsx |
| T18 | `fix(filter): make language filter global across all year tabs` | app/components/PaginatedRepos.tsx |
| T19 | `refactor(hooks): extract PaginatedRepos logic into shared hooks` | hooks/*.ts, app/components/PaginatedRepos.tsx |
| T20 | `feat(projects): add dynamic project detail page with README` | app/projects/[name]/page.tsx, app/components/RepoCard.tsx |

---

## Success Criteria

### Verification Commands
```bash
npm run build         # Expected: Build completes without errors
npx tsc --noEmit      # Expected: Zero type errors
npm run lint          # Expected: Zero lint errors
npm run dev           # Expected: App runs on localhost:3000
```

### Final Checklist
- [ ] All 20 tasks completed in order
- [ ] Build passes with zero errors
- [ ] GitHub API uses authenticated requests (rate limit 5000)
- [ ] ISR active with 1-hour revalidation
- [ ] Loading skeletons and error boundary functional
- [ ] Design system with brand colors and custom fonts
- [ ] Responsive layout (mobile, tablet, desktop)
- [ ] No flash of incorrect theme
- [ ] Language filter works globally across year tabs
- [ ] Project detail pages with README
- [ ] SEO meta tags present
- [ ] Lighthouse score ≥ 80 Performance, ≥ 90 SEO
