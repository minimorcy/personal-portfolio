# Plan: Portfolio Profesional Completo

## TL;DR

> **Quick Summary**: Transformar el portfolio minimalista actual (solo lista de repos GitHub) en un portfolio profesional completo con 9 secciones, Sanity CMS, shadcn/ui, GitHub Stats visuales, blog, CV dinámico, y SEO — todo en español con arquitectura i18n-ready.
>
> **Deliverables**:
> - Sanity Studio integrado con schemas para todo el contenido
> - 9 secciones nuevas: About Me, Timeline, Skills, Proyectos Destacados, CV PDF, Blog, Educación, Contacto, GitHub Stats
> - shadcn/ui instalado y configurado con tema personalizado
> - Navegación multi-página (Home, Blog, Proyectos, CV, Stats)
> - SEO mejorado: sitemap.xml, robots.txt, JSON-LD, metadata por página
> - Analytics con Plausible/Umami
> - Configuración de deploy en VPS (PM2 + nginx)
> - Arquitectura i18n-ready (estructura preparada para añadir inglés)
>
> **Estimated Effort**: Large (25+ tareas, 4 waves)
> **Parallel Execution**: YES — 4 waves con hasta 8 tareas paralelas
> **Critical Path**: Sanity setup → Esquemas → Páginas de contenido → Navegación → Deploy VPS

---

## Context

### Original Request
El usuario quiere convertir su portfolio actual (Next.js + GitHub API) en un portfolio profesional completo para publicarlo bajo `javiermorcillonuevo.com` y usarlo para buscar trabajo.

### Interview Summary

**Key Discussions**:
- **Objetivo**: Portfolio "todo en uno" — empleabilidad + marca personal + demo técnica
- **Contenido**: Generado con IA, refinado por el usuario
- **Idioma**: Español principal, arquitectura preparada para inglés futuro
- **CMS**: Sanity.io para TODO el contenido (incluyendo blog, no MDX local)
- **Diseño**: shadcn/ui sobre Tailwind CSS — componentes pre-diseñados
- **Contacto**: Sin formulario funcional, solo links (GitHub, LinkedIn, email)
- **CV**: PDF dinámico generado desde datos de Sanity
- **Repos GitHub**: Reemplazar lista por estadísticas visuales (heatmap, lenguajes, contribuciones)
- **Blog**: Simple — artículos desde Sanity, sin comentarios ni búsqueda avanzada

**Research Findings**:
- Proyecto actual: Next.js 14.2.5, ~30 archivos, ~800 líneas, 5 componentes, 4 hooks (específicos de GitHub)
- Desplegado en Vercel actualmente, pero se migrará a VPS propio
- Sin tests, sin CI/CD, sin analytics, sin sitemap
- Tailwind config mínima (sin colores de marca, sin tokens de diseño)
- `.env` tiene `GITHUB_USERNAME=minimorcy`

**Hosting Discovery**:
- El usuario tiene VPS propio y dominio `javiermorcillonuevo.com`
- Esto cambia la estrategia: NO Vercel Analytics → Plausible/Umami, NO serverless → `next start` con PM2

### Metis Review

**Identified Gaps** (addressed):
- **Sanity project setup**: Incluido como Task 1 (crear proyecto Sanity, schemas, cliente)
- **GitHub username confirmation**: Verificado — `minimorcy`
- **Domain/URL**: Confirmado — `javiermorcillonuevo.com` en VPS propio
- **Blog MDX vs Sanity**: Resuelto — blog desde Sanity CMS (portable text), no MDX local
- **Dead code**: Los 4 hooks actuales (`useDebounce`, `useFilteredRepos`, `usePagination`, `useReposByYear`) y `PaginatedRepos` quedarán obsoletos — se eliminarán en la limpieza final
- **Performance**: 9 secciones + Sanity + shadcn/ui podrían aumentar el bundle. Se usará `next/dynamic` para lazy loading de secciones pesadas
- **VPS deployment**: Añadida configuración PM2 + nginx + health check

---

## Work Objectives

### Core Objective
Transformar el portfolio actual en un sitio multi-página profesional con contenido gestionable desde Sanity CMS, estadísticas visuales de GitHub, y optimizado para ser encontrado por reclutadores.

### Concrete Deliverables
- Sanity Studio configurado con schemas: `profile`, `experience`, `skill`, `project`, `education`, `post`, `socialLink`
- Página Home con Hero extendido + GitHub Stats + Skills preview
- Página `/proyectos` con proyectos destacados curados
- Página `/blog` con listado de artículos + `/blog/[slug]` para artículo individual
- Página `/cv` con简历 web + botón descarga PDF
- Página `/stats` con visualizaciones de GitHub (heatmap, lenguajes, activity)
- Componentes shadcn/ui: Navigation, Cards, Timeline, Badges, Tabs, Accordion
- sitemap.xml, robots.txt, JSON-LD structured data
- Plausible Analytics script
- Scripts de deploy: PM2 ecosystem, nginx config template

### Definition of Done
- [ ] `npm run build` exit 0 sin errores
- [ ] Sanity Studio accesible y funcional (todos los schemas editables)
- [ ] Navegación completa entre las 5+ páginas
- [ ] Cada página tiene metadata SEO (title, description, OG)
- [ ] sitemap.xml lista todas las URLs dinámicas
- [ ] GitHub Stats cargan datos reales de `minimorcy`
- [ ] PDF del CV se genera y descarga correctamente
- [ ] Analytics registran visitas
- [ ] Dark mode funciona en todas las páginas

### Must Have
- Las 9 secciones acordadas funcionales
- Contenido gestionable desde Sanity (no hardcodeado)
- Diseño responsive (mobile-first)
- Dark mode consistente
- SEO básico completo (sitemap, metadata, robots.txt)
- Navegación intuitiva entre secciones

### Must NOT Have (Guardrails)
- Formulario de contacto funcional (solo links)
- Tests automatizados
- Comentarios en blog
- Búsqueda avanzada en blog
- OG Images dinámicas generadas
- Lista cruda de repositorios GitHub (reemplazada por stats visuales)
- Código hardcodeado de contenido (todo debe venir de Sanity o APIs)
- Dependencia de Vercel (platform-agnostic excepto analytics)

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** - ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None
- **Framework**: N/A

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (`/playwright` skill) - Navigate, interact, assert DOM, screenshot
- **API/Backend**: Use Bash (curl) - Send requests, assert status + response fields
- **CLI/Build**: Use Bash - Run build, check exit code, verify output

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — foundation + tooling, MAX PARALLEL):
├── Task 1: Sanity project setup + schemas [unspecified-high]
├── Task 2: shadcn/ui installation + theme config [quick]
├── Task 3: Project restructure + path aliases [quick]
├── Task 4: i18n-ready scaffold + translation system [quick]
├── Task 5: Design tokens + Tailwind extend [quick]
├── Task 6: Sanity client + GROQ query helpers [quick]
└── Task 7: SEO foundation (sitemap, robots, JSON-LD utils) [quick]

Wave 2 (After Wave 1 — content data layer + pages, MAX PARALLEL):
├── Task 8: Home page — Extended Hero + Skills preview [visual-engineering]
├── Task 9: About Me page with Sanity data [quick]
├── Task 10: Experience Timeline component + page [visual-engineering]
├── Task 11: Skills/Tech Stack section [visual-engineering]
├── Task 12: Education/Certifications section [quick]
├── Task 13: Contact/Links section [quick]
├── Task 14: Navigation component (mobile + desktop) [visual-engineering]
└── Task 15: Sanity content seeding (initial data with IA) [writing]

Wave 3 (After Wave 2 — dynamic features, MAX PARALLEL):
├── Task 16: Blog — post list page + individual post page [visual-engineering]
├── Task 17: Proyectos Destacados — curated projects page [visual-engineering]
├── Task 18: CV page + PDF generation (from Sanity data) [deep]
├── Task 19: GitHub Stats visualizations page [deep]
├── Task 20: Project detail page (individual destacado) [visual-engineering]
└── Task 21: Analytics integration (Plausible/Umami) [quick]

Wave 4 (After Wave 3 — polish + deploy, MAX PARALLEL):
├── Task 22: Dead code cleanup + refactor [quick]
├── Task 23: Final SEO audit + metadata completion [quick]
├── Task 24: 404 page + error boundaries [quick]
├── Task 25: Loading states + skeleton UI [visual-engineering]
├── Task 26: VPS deploy configuration (PM2, nginx, env) [unspecified-high]
└── Task 27: Cross-browser QA + final polish [visual-engineering]

Wave FINAL (After ALL tasks — 4 parallel reviews):
├── Task F1: Plan Compliance Audit (oracle)
├── Task F2: Code Quality Review (unspecified-high)
├── Task F3: Real Manual QA (unspecified-high + playwright)
└── Task F4: Scope Fidelity Check (deep)
-> Present consolidated results → Get explicit user okay
```

**Critical Path**: Task 1 → Task 3 → Task 6 → Task 8 → Task 16 → Task 26 → F1-F4
**Parallel Speedup**: ~65% faster than sequential
**Max Concurrent**: 8 (Wave 2)

---

## TODOs

### Wave 1 — Foundation + Tooling

- [x] 1. Sanity Project Setup + Content Schemas

  **What to do**:
  - Crear proyecto en [sanity.io/manage](https://www.sanity.io/manage) (free tier)
  - Instalar `@sanity/client`, `@sanity/image-url`, `next-sanity` en el proyecto
  - Crear schemas en `/sanity/schemas/`:
    - `profile.ts` — nombre, bio, avatar, título, ubicación, links sociales
    - `experience.ts` — empresa, cargo, fecha inicio/fin, descripción, tecnologías, logo
    - `skill.ts` — nombre, categoría (Frontend/Backend/DevOps/etc.), nivel (1-5), icono
    - `project.ts` — título, descripción, imagen, URL demo, URL repo, tecnologías, destacado (bool)
    - `education.ts` — institución, título, fecha inicio/fin, descripción, logo
    - `post.ts` — título, slug, excerpt, cuerpo (portable text), fecha, tags, imagen portada
    - `socialLink.ts` — plataforma, URL, icono, orden
  - Configurar `sanity.config.ts` y `sanity.cli.ts` en raíz del proyecto
  - Crear cliente Sanity en `/lib/sanity.ts` con variables de entorno (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`)
  - Probar conexión: fetch simple desde una page

  **Must NOT do**:
  - No usar GROQ queries complejas aún (solo verificación con `*[_type == "profile"][0]`)
  - No crear Sanity Studio embebido en Next.js (usar Sanity Studio separado en `/studio` si es necesario, o hosted en sanity.io)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Requires understanding of Sanity CMS configuration, schema design, and Next.js integration
  - **Skills**: []
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4, 5, 7)
  - **Blocks**: Tasks 6, 8-21 (all content-dependent tasks)
  - **Blocked By**: None (can start immediately)

  **References**:
  - Official Sanity docs: `https://www.sanity.io/docs/schema-types` — Schema type reference
  - `next-sanity` package: `https://github.com/sanity-io/next-sanity` — Next.js integration patterns
  - Existing `lib/github.ts` — Reference for how API clients are structured in this project
  - Existing `.env` file — Contains current env var pattern (`GITHUB_USERNAME`, `GITHUB_TOKEN`)

  **Acceptance Criteria**:
  - [ ] Sanity project created and project ID obtained
  - [ ] All 7 schema files exist in `/sanity/schemas/`
  - [ ] `sanity.config.ts` and `sanity.cli.ts` exist at project root
  - [ ] `lib/sanity.ts` exports `sanityClient` and `urlFor` functions
  - [ ] `npm run build` passes (no TypeScript errors from Sanity imports)

  **QA Scenarios**:
  ```
  Scenario: Sanity client can fetch data
    Tool: Bash (curl)
    Preconditions: NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET set in .env.local
    Steps:
      1. Run: curl -s "https://<projectId>.api.sanity.io/v1/data/query/<dataset>?query=*[_type=='profile'][0]"
      2. Check HTTP status code is 200
      3. Assert response JSON has "result" key
    Expected Result: HTTP 200 with valid JSON response (result may be null if no data yet)
    Failure Indicators: HTTP 4xx/5xx, connection refused, invalid JSON
    Evidence: .sisyphus/evidence/task-1-sanity-connect.json

  Scenario: Build succeeds with Sanity dependencies
    Tool: Bash
    Preconditions: All Sanity packages installed
    Steps:
      1. Run: npm run build
      2. Check exit code is 0
      3. Check stderr has no "Module not found" for sanity packages
    Expected Result: Build succeeds, no Sanity-related import errors
    Failure Indicators: Build fails with "Cannot find module @sanity/client" or similar
    Evidence: .sisyphus/evidence/task-1-build-check.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Message: `feat: add Sanity CMS — project setup, schemas (profile, experience, skill, project, education, post, socialLink)`
  - Files: `sanity.config.ts`, `sanity.cli.ts`, `sanity/schemas/*.ts`, `lib/sanity.ts`, `package.json`

- [x] 2. shadcn/ui Installation + Theme Configuration

  **What to do**:
  - Ejecutar `npx shadcn-ui@latest init` con configuración:
    - Style: New York
    - Base color: Slate (o Neutral)
    - CSS variables: YES (para dark mode)
  - Configurar `components.json` resultante
  - Instalar componentes necesarios: `button`, `card`, `badge`, `tabs`, `accordion`, `separator`, `skeleton`, `avatar`, `navigation-menu`, `sheet` (mobile menu), `dropdown-menu`
  - Configurar tema global en `app/globals.css` con CSS variables de shadcn
  - Definir colores de marca (brand) en Tailwind config (`tailwind.config.ts`):
    - `brand`: color primario (ej: blue-600 o indigo-600 como base)
    - `brand-50` a `brand-950`
  - Verificar dark mode funciona con `class` strategy de Tailwind

  **Must NOT do**:
  - No instalar componentes que no se usarán (evitar bloat)
  - No cambiar la estrategia de dark mode (mantener `class` en Tailwind config)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard shadcn/ui setup following documented CLI workflow
  - **Skills**: []
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4, 5, 7)
  - **Blocks**: Tasks 8-25 (all UI tasks)
  - **Blocked By**: None

  **References**:
  - shadcn/ui docs: `https://ui.shadcn.com/docs/installation/next` — Next.js installation guide
  - Existing `tailwind.config.ts` — Current Tailwind config to extend
  - Existing `app/globals.css` — Current global styles to merge with shadcn CSS variables
  - Existing `app/layout.tsx` — Reference for current font setup (Inter + JetBrains Mono)

  **Acceptance Criteria**:
  - [ ] `components.json` exists at project root
  - [ ] `/components/ui/` directory contains shadcn components
  - [ ] `lib/utils.ts` exports `cn()` helper
  - [ ] `app/globals.css` includes shadcn CSS variables
  - [ ] `tailwind.config.ts` extended with brand colors
  - [ ] `npm run build` passes

  **QA Scenarios**:
  ```
  Scenario: shadcn Button component renders
    Tool: Playwright
    Preconditions: Dev server running on localhost:3000
    Steps:
      1. Create a test page importing <Button> from shadcn
      2. Navigate to test page
      3. Assert button element exists with shadcn classes
      4. Screenshot the button in light mode
      5. Toggle to dark mode, screenshot again
    Expected Result: Button renders with correct shadcn styling in both modes
    Failure Indicators: Unstyled button, missing CSS variables, import error
    Evidence: .sisyphus/evidence/task-2-shadcn-button-light.png, .sisyphus/evidence/task-2-shadcn-button-dark.png
  ```

  **Commit**: YES (groups with Wave 1)
  - Message: `feat: add shadcn/ui — init, theme config, core components (button, card, badge, tabs, etc.)`
  - Files: `components.json`, `components/ui/*.tsx`, `lib/utils.ts`, `tailwind.config.ts`, `app/globals.css`

- [x] 3. Project Structure Reorganization + Path Aliases

  **What to do**:
  - Mover componentes actuales de `app/components/` a `/components/` (raíz):
    - `ThemeProvider.tsx` → `/components/theme-provider.tsx`
    - `ThemeToggle.tsx` → `/components/theme-toggle.tsx`
    - `SkeletonCard.tsx` → `/components/skeleton-card.tsx`
    - `RepoCard.tsx` → conservar temporalmente, marcar como deprecated
    - `PaginatedRepos.tsx` → conservar temporalmente, marcar como deprecated
  - Crear estructura de directorios:
    ```
    /components/
      /ui/        (shadcn components)
      /layout/    (header, footer, navigation)
      /sections/  (hero, timeline, skills, etc.)
      /shared/    (theme-toggle, skeleton, etc.)
    /lib/         (sanity.ts, github.ts, utils.ts, constants.ts)
    /hooks/       (solo hooks reutilizables)
    /sanity/      (schemas, config)
    /app/
      /(home)/    (ruta principal)
      /blog/
      /proyectos/
      /cv/
      /stats/
      /api/       (conservar rutas existentes)
    ```
  - Actualizar imports en todos los archivos afectados
  - Verificar que `tsconfig.json` paths sigan funcionando

  **Must NOT do**:
  - No eliminar `PaginatedRepos.tsx` ni `RepoCard.tsx` todavía (se eliminan en Wave 4)
  - No cambiar rutas de API existentes

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: File reorganization with import updates, mostly mechanical
  - **Skills**: []
  - **Skills Evaluated but Omitted**: N/A

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4, 5, 6, 7)
  - **Blocks**: Tasks 8-25 (establece la estructura de directorios)
  - **Blocked By**: Task 2 partially (needs `components/ui/` directory to exist)

  **References**:
  - Current `tsconfig.json` — Existing path aliases (`@/`)
  - Current `app/components/` — All files to be relocated
  - Current `app/page.tsx` — Imports to update after move

  **Acceptance Criteria**:
  - [ ] `components/` directory exists at project root with subdirectories
  - [ ] All component moves complete with correct imports
  - [ ] No broken imports (`tsc --noEmit` passes)
  - [ ] `npm run dev` starts without errors

  **QA Scenarios**:
  ```
  Scenario: TypeScript compilation after restructure
    Tool: Bash
    Preconditions: All files moved, imports updated
    Steps:
      1. Run: npx tsc --noEmit
      2. Check exit code is 0
      3. Check stderr for any "Cannot find module" errors
    Expected Result: Clean TypeScript compilation, no module resolution errors
    Failure Indicators: "Cannot find module" errors, especially for moved files
    Evidence: .sisyphus/evidence/task-3-tsc-check.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Message: `refactor: restructure project — move components to root, organize by domain`
  - Files: All moved files + updated imports

- [x] 4. i18n-Ready Scaffold + Translation System

  **What to do**:
  - Crear `/lib/i18n.ts` con sistema simple de traducciones:
    - Objeto `es` con todas las strings de UI en español
    - Tipo `Translations` que define la interfaz de traducciones
    - Función `t(key: string, lang?: string)` para obtener traducciones
  - Crear `/lib/i18n-config.ts` con configuración:
    - `locales: ['es']` (inglés preparado como `['es', 'en']`)
    - `defaultLocale: 'es'`
  - No implementar enrutamiento por idioma (nada de `/[lang]/` aún)
  - Usar el sistema en componentes clave para demostrar el patrón:
    - Header: "Inicio", "Blog", "Proyectos", "CV", "Estadísticas"
    - Footer: copyright, links
  - Estructura preparada para que añadir inglés signifique solo:
    1. Añadir objeto `en` en i18n.ts
    2. Añadir 'en' a `locales`
    3. Implementar switch de idioma en UI

  **Must NOT do**:
  - No implementar `[lang]` dynamic routing — solo arquitectura interna
  - No usar librerías pesadas (next-intl, next-i18next) — sistema simple y ligero
  - No traducir contenido de Sanity (eso es responsabilidad del CMS)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple i18n utility setup, mostly boilerplate
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 5, 6, 7)
  - **Blocks**: Tasks 8-15 (content pages usarán el sistema)
  - **Blocked By**: None

  **References**:
  - None specific — standard i18n pattern

  **Acceptance Criteria**:
  - [ ] `lib/i18n.ts` exports `t()` function and `Translations` type
  - [ ] `lib/i18n-config.ts` exports locale configuration
  - [ ] At least 2 components use `t()` for UI strings
  - [ ] `npm run build` passes

  **QA Scenarios**:
  ```
  Scenario: Translation function returns correct Spanish strings
    Tool: Bash (Node REPL via script)
    Preconditions: i18n module built
    Steps:
      1. Create test script importing t() from lib/i18n
      2. Call t('nav.home') and assert returns "Inicio"
      3. Call t('nonexistent.key') and assert returns the key itself (fallback)
    Expected Result: Correct Spanish strings, graceful fallback for missing keys
    Failure Indicators: Returns undefined, throws error on missing key
    Evidence: .sisyphus/evidence/task-4-i18n-test.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Message: `feat: add i18n-ready scaffold — Spanish translations, type-safe t(), prepared for English`
  - Files: `lib/i18n.ts`, `lib/i18n-config.ts`

- [x] 5. Design Tokens + Tailwind Configuration Extension

  **What to do**:
  - Extender `tailwind.config.ts` con:
    - **Brand colors**: paleta completa (`brand-50` a `brand-950`) basada en slate o blue profesional
    - **Accent colors**: color de acento para CTAs y elementos interactivos
    - **Custom animations**: `slide-up`, `fade-in`, `scale-in`
    - **Custom spacing/sizing**: si es necesario
  - Actualizar `app/globals.css` con animaciones keyframe
  - Crear `/lib/design-tokens.ts` con `BRAND_COLOR`, `SITE_NAME`, `SITE_URL`, `SITE_DESCRIPTION`

  **Must NOT do**:
  - No sobrecargar con animaciones — máximo 3-4 keyframes
  - No crear sistema de diseño completo — solo tokens necesarios

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Config file extensions, well-defined scope
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4, 6, 7)
  - **Blocks**: Tasks 8-25 (all UI tasks use design tokens)
  - **Blocked By**: Task 2 (needs shadcn CSS variables in place)

  **References**:
  - Existing `tailwind.config.ts` — Base config to extend
  - Existing `app/globals.css` — Current Tailwind directives + dark mode config
  - Existing `app/layout.tsx` — Font family CSS variables

  **Acceptance Criteria**:
  - [ ] `tailwind.config.ts` extended with brand colors, animations
  - [ ] `app/globals.css` has keyframe animations
  - [ ] `lib/design-tokens.ts` exports brand constants
  - [ ] `npm run build` passes

  **QA Scenarios**:
  ```
  Scenario: Brand colors available as Tailwind classes
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Create a test div with class "bg-brand-600 text-brand-100"
      2. Navigate to test page
      3. Assert the div has background-color matching brand-600 hex
      4. Screenshot
    Expected Result: Element styled with brand colors
    Failure Indicators: No background color, default browser styles
    Evidence: .sisyphus/evidence/task-5-brand-colors.png
  ```

  **Commit**: YES (groups with Wave 1)
  - Message: `feat: extend design tokens — brand colors, animations, site constants`
  - Files: `tailwind.config.ts`, `app/globals.css`, `lib/design-tokens.ts`

- [x] 6. Sanity Client + GROQ Query Helpers

  **What to do**:
  - En `/lib/sanity.ts`:
    - Exportar `sanityClient` configurado con `projectId`, `dataset`, `apiVersion`, `useCdn: true`
    - Exportar `urlFor(source)` para optimización de imágenes de Sanity
    - Exportar `fetchSanity<T>(query, params?)` wrapper con manejo de errores y tipado genérico
  - Crear `/lib/sanity-queries.ts` con queries GROQ:
    - `PROFILE_QUERY`, `EXPERIENCES_QUERY`, `SKILLS_QUERY`, `FEATURED_PROJECTS_QUERY`
    - `POSTS_QUERY`, `POST_BY_SLUG_QUERY`, `EDUCATION_QUERY`, `SOCIAL_LINKS_QUERY`
  - Tipos TypeScript para cada respuesta en `/types/sanity.ts`

  **Must NOT do**:
  - No cachear agresivamente en desarrollo (usar `useCdn: false` en dev)
  - No usar queries anidadas complejas — mantener queries planas

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Library file creation + GROQ query writing
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4, 5, 7)
  - **Blocks**: Tasks 8-21 (all content pages use these queries)
  - **Blocked By**: Task 1 (needs Sanity project ID and schemas to exist)

  **References**:
  - Existing `lib/github.ts` — Pattern for API client with error handling
  - Sanity GROQ docs: `https://www.sanity.io/docs/groq`
  - `next-sanity` docs: `https://github.com/sanity-io/next-sanity#readme`

  **Acceptance Criteria**:
  - [ ] `lib/sanity.ts` exports `sanityClient`, `urlFor`, `fetchSanity`
  - [ ] `lib/sanity-queries.ts` has all 8 queries
  - [ ] `types/sanity.ts` has TypeScript interfaces for all responses

  **QA Scenarios**:
  ```
  Scenario: fetchSanity returns data from Sanity
    Tool: Bash (Node script)
    Preconditions: Sanity project has at least a profile document
    Steps:
      1. Run Node script importing fetchSanity and PROFILE_QUERY
      2. Call fetchSanity<Profile>(PROFILE_QUERY)
      3. Assert response is not null and has expected fields (_id, name, bio)
    Expected Result: Profile data returned from Sanity
    Failure Indicators: Network error, 404, null response, missing fields
    Evidence: .sisyphus/evidence/task-6-sanity-fetch.json
  ```

  **Commit**: YES (groups with Wave 1)
  - Message: `feat: add Sanity client + GROQ query helpers — fetchSanity, urlFor, typed queries`
  - Files: `lib/sanity.ts`, `lib/sanity-queries.ts`, `types/sanity.ts`

- [x] 7. SEO Foundation — Sitemap, Robots, JSON-LD Utilities

  **What to do**:
  - Crear `app/sitemap.ts` generando sitemap.xml dinámico con URLs de Home, Blog, posts, proyectos, CV, stats
  - Crear `app/robots.ts` con Allow all + sitemap URL
  - Crear `/lib/json-ld.ts` con helpers: `generatePersonSchema`, `generateWebSiteSchema`, `generateBreadcrumbSchema`, `generateArticleSchema`
  - Actualizar `app/layout.tsx` metadata: `metadataBase` a `https://javiermorcillonuevo.com`

  **Must NOT do**:
  - No hardcodear URLs — usar `metadataBase`
  - No generar OG images (excluido del scope)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Next.js file conventions + JSON-LD boilerplate
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-6)
  - **Blocks**: None directly (enhances all pages)
  - **Blocked By**: Task 3 (needs route structure defined)

  **References**:
  - Next.js Sitemap docs: `https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap`
  - Google JSON-LD docs: `https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data`
  - Existing `app/layout.tsx` — Current metadata to update

  **Acceptance Criteria**:
  - [ ] `app/sitemap.ts` exports `sitemap()` returning all URLs
  - [ ] `app/robots.ts` exports `robots()` function
  - [ ] `lib/json-ld.ts` has 4 schema generation functions
  - [ ] Visiting `/sitemap.xml` returns valid XML

  **QA Scenarios**:
  ```
  Scenario: Sitemap returns valid XML
    Tool: Bash (curl)
    Steps:
      1. Run: curl -s http://localhost:3000/sitemap.xml
      2. Assert response starts with "<?xml" and contains "<urlset"
      3. Assert contains URLs for home, blog, proyectos, cv, stats
    Expected Result: Valid XML sitemap with all major routes
    Failure Indicators: 404, HTML response, missing routes
    Evidence: .sisyphus/evidence/task-7-sitemap.xml

  Scenario: Robots.txt is accessible
    Tool: Bash (curl)
    Steps:
      1. Run: curl -s http://localhost:3000/robots.txt
      2. Assert contains "User-agent: *" and "Sitemap:"
    Expected Result: Valid robots.txt with sitemap reference
    Evidence: .sisyphus/evidence/task-7-robots.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Message: `feat: add SEO foundation — dynamic sitemap, robots.txt, JSON-LD utilities, updated metadata`
  - Files: `app/sitemap.ts`, `app/robots.ts`, `lib/json-ld.ts`, `app/layout.tsx`

- [x] 8. Home Page — Extended Hero + Skills Preview + GitHub Stats Teaser

  **What to do**:
  - Crear `app/(home)/page.tsx` (server component):
    - Fetch `profile` de Sanity (avatar, nombre, título, bio extendida, links)
    - Fetch `skills` de Sanity (top 6-8 para preview)
    - Hero section con: avatar grande, nombre, título, bio, badges de stats (repos, followers)
    - Skills preview: grid de badges/iconos con las top skills
    - GitHub Stats teaser: mini preview que enlace a `/stats`
    - CTA buttons: "Ver Proyectos", "Descargar CV", "Contacto"
  - La página Home NO muestra la lista de repos antigua
  - Usar `next/image` para avatar
  - Animaciones de entrada: `animate-slide-up` en secciones
  - Responsive: mobile-first, hero stack vertical en móvil

  **Must NOT do**:
  - No incluir `PaginatedRepos` ni lista de repos
  - No hardcodear contenido (todo de Sanity)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Hero section is the first impression — requires polished visual design with animations
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 9-15)
  - **Blocks**: Task 14 (navigation links to home)
  - **Blocked By**: Tasks 1, 3, 6 (needs Sanity client, project structure)

  **References**:
  - Current `app/layout.tsx` — ThemeProvider, fonts, header
  - Current `app/page.tsx` — Existing hero pattern to build upon
  - `lib/sanity-queries.ts` — `PROFILE_QUERY`, `SKILLS_QUERY`
  - shadcn/ui `Avatar`, `Badge`, `Button` components

  **Acceptance Criteria**:
  - [ ] Home page renders hero with real Sanity data
  - [ ] Skills preview shows top skills as badges
  - [ ] CTA buttons link to correct pages
  - [ ] Avatar optimized with next/image
  - [ ] Dark mode works on home page
  - [ ] Responsive: mobile and desktop layouts correct

  **QA Scenarios**:
  ```
  Scenario: Home page loads with Sanity content
    Tool: Playwright
    Preconditions: Sanity has profile and skills data
    Steps:
      1. Navigate to http://localhost:3000/
      2. Wait for page to load (networkidle)
      3. Assert avatar image is visible (img[alt="avatar"])
      4. Assert name heading contains text (not "No info")
      5. Assert bio text is not placeholder/default
      6. Assert at least 3 skill badges visible (.badge or skill elements)
      7. Screenshot full page in light mode
      8. Toggle dark mode, screenshot again
    Expected Result: Fully rendered hero with real data, skills visible
    Failure Indicators: "No info" text, missing avatar, 0 skills, broken layout
    Evidence: .sisyphus/evidence/task-8-home-light.png, .sisyphus/evidence/task-8-home-dark.png

  Scenario: CTA buttons navigate correctly
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000/
      2. Click "Ver Proyectos" button/CTA
      3. Assert URL is /proyectos
      4. Go back, click "Descargar CV"
      5. Assert URL is /cv or PDF download starts
    Expected Result: All CTA links functional
    Evidence: .sisyphus/evidence/task-8-cta-navigation.txt
  ```

  **Commit**: YES (groups with Wave 2)
  - Message: `feat: redesign home page — extended hero, skills preview, github stats teaser, CTAs`
  - Files: `app/(home)/page.tsx`, related components

- [x] 9. About Me Page

  **What to do**:
  - Crear `app/about/page.tsx` (o sección en home si es one-page):
    - Fetch `profile` de Sanity (bio extendida, ubicación, company, blog, email)
    - Fetch `socialLinks` de Sanity
    - Diseño: foto + bio larga + datos personales + links sociales
    - Stats rápidos: años experiencia, repos públicos, followers
  - Decidir: ¿one-page con secciones ancla o multi-page? **Recomendación**: One-page con scroll suave entre secciones, más `/blog`, `/proyectos`, `/cv`, `/stats` como páginas separadas
  - Si one-page: cada sección en la home con `id` para navegación por ancla

  **Must NOT do**:
  - No crear página `/about` separada si se opta por one-page
  - No hardcodear bio

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple data fetch + display, well-defined layout
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8, 10-15)
  - **Blocks**: None
  - **Blocked By**: Tasks 1, 3, 6

  **References**:
  - `lib/sanity-queries.ts` — `PROFILE_QUERY`, `SOCIAL_LINKS_QUERY`
  - shadcn/ui `Avatar`, `Card`, `Badge`

  **Acceptance Criteria**:
  - [ ] About section renders bio, location, social links
  - [ ] Social links are clickable with correct icons
  - [ ] Dark mode works

  **QA Scenarios**:
  ```
  Scenario: About section shows complete profile
    Tool: Playwright
    Steps:
      1. Navigate to home page, scroll to About section (#about or #sobre-mi)
      2. Assert bio text is longer than 50 chars
      3. Assert location is visible if set
      4. Assert at least 2 social link icons visible
      5. Click a social link, assert correct URL opens
    Expected Result: Complete about section with real data
    Evidence: .sisyphus/evidence/task-9-about-section.png
  ```

  **Commit**: YES (groups with Wave 2)
  - Message: `feat: add About Me section — bio, social links, stats`
  - Files: `components/sections/about.tsx`, `app/(home)/page.tsx` (updated)

- [x] 10. Experience Timeline Component + Page

  **What to do**:
  - Crear `components/sections/experience.tsx`:
    - Fetch `experience` de Sanity (ordenado por `startDate desc`)
    - Componente Timeline vertical:
      - Línea vertical con dots
      - Cada entry: logo empresa, cargo, fechas, descripción, tecnologías usadas
      - Badges de tecnologías por cada experiencia
    - Animación: entries aparecen con `animate-slide-up` al hacer scroll (intersection observer o CSS animation-delay escalonado)
    - Responsive: timeline se adapta (línea a la izquierda en móvil)
  - Si es one-page: sección con `id="experiencia"`
  - Usar `next/image` para logos de empresa

  **Must NOT do**:
  - No timeline horizontal (difícil en móvil)
  - No limitar a número fijo de experiencias (mostrar todas las de Sanity)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Timeline requires custom CSS with animations and responsive adaptation
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8, 9, 11-15)
  - **Blocks**: None
  - **Blocked By**: Tasks 1, 3, 6

  **References**:
  - `lib/sanity-queries.ts` — `EXPERIENCES_QUERY`
  - shadcn/ui `Badge`, `Card`, `Separator`

  **Acceptance Criteria**:
  - [ ] Timeline renders all experiences from Sanity
  - [ ] Each entry shows: company logo, title, dates, description, tech badges
  - [ ] Vertical line with dots visible
  - [ ] Entries animate on scroll
  - [ ] Responsive on mobile
  - [ ] Dark mode works

  **QA Scenarios**:
  ```
  Scenario: Timeline shows work experiences
    Tool: Playwright
    Steps:
      1. Navigate to home, scroll to #experiencia
      2. Assert at least 1 timeline entry visible
      3. Assert each entry has: company name, role, date range, tech badges
      4. Assert vertical timeline line visible
      5. Scroll down, assert new entries animate in
    Expected Result: Functional timeline with real experience data
    Evidence: .sisyphus/evidence/task-10-timeline.png

  Scenario: Empty state when no experiences
    Tool: Playwright
    Steps:
      1. Mock Sanity to return empty experiences array
      2. Assert section shows "Sin experiencia registrada" or is hidden gracefully
    Expected Result: No broken layout, graceful empty state
    Evidence: .sisyphus/evidence/task-10-timeline-empty.png
  ```

  **Commit**: YES (groups with Wave 2)
  - Message: `feat: add Experience Timeline — vertical timeline with animations, tech badges`
  - Files: `components/sections/experience.tsx`, `app/(home)/page.tsx` (updated)

- [x] 11. Skills / Tech Stack Section

  **What to do**:
  - Crear `components/sections/skills.tsx`:
    - Fetch `skills` de Sanity (todos, agrupados por `category`)
    - Diseño: grid de tarjetas por categoría
    - Cada skill: icono (si disponible) + nombre + barra de nivel (1-5) + color de categoría
    - Categorías como tabs o accordion: "Frontend", "Backend", "DevOps", "Herramientas", etc.
    - Usar shadcn/ui `Tabs` o `Accordion` para categorías
    - Animaciones: las barras de nivel se llenan al hacer scroll
  - Si one-page: sección con `id="skills"` o `id="tecnologias"`

  **Must NOT do**:
  - No niveles en texto (ej: "Avanzado") — usar barra visual
  - No hardcodear lista de skills

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Custom skill bars with animations, category grouping with tabs
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8-10, 12-15)
  - **Blocks**: None
  - **Blocked By**: Tasks 1, 3, 6

  **References**:
  - `lib/sanity-queries.ts` — `SKILLS_QUERY`
  - shadcn/ui `Tabs`, `Accordion`, `Progress`, `Badge`

  **Acceptance Criteria**:
  - [ ] Skills grouped by category with tabs/accordion
  - [ ] Each skill shows name + level bar (1-5)
  - [ ] Level bars animate on scroll
  - [ ] Dark mode works on all elements
  - [ ] Responsive: grid adapts (2 cols desktop, 1 col mobile)

  **QA Scenarios**:
  ```
  Scenario: Skills displayed by category
    Tool: Playwright
    Steps:
      1. Navigate to #tecnologias section
      2. Assert category tabs/accordion visible
      3. Click "Frontend" category tab
      4. Assert skills in that category visible with level bars
      5. Assert level bars have visual width proportional to level (1-5)
      6. Switch to dark mode, assert bars still visible
    Expected Result: Skills properly grouped and displayed with animated level bars
    Evidence: .sisyphus/evidence/task-11-skills.png
  ```

  **Commit**: YES (groups with Wave 2)
  - Message: `feat: add Skills/Tech Stack — category tabs, animated level bars`
  - Files: `components/sections/skills.tsx`, `app/(home)/page.tsx` (updated)

- [x] 12. Education / Certifications Section

  **What to do**:
  - Crear `components/sections/education.tsx`:
    - Fetch `education` de Sanity (ordenado por `startDate desc`)
    - Diseño: cards o lista con: logo institución, título, fechas, descripción
    - Similar al timeline pero más simple
    - Si no hay datos: sección oculta o mensaje "En construcción"
  - Si one-page: sección con `id="educacion"`

  **Must NOT do**:
  - No inventar datos — si Sanity está vacío, mostrar empty state elegante
  - No mezclar con experiencia (secciones separadas)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple card list layout, minimal complexity
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8-11, 13-15)
  - **Blocks**: None
  - **Blocked By**: Tasks 1, 3, 6

  **References**:
  - `lib/sanity-queries.ts` — `EDUCATION_QUERY`
  - `components/sections/experience.tsx` — Similar card pattern to follow
  - shadcn/ui `Card`

  **Acceptance Criteria**:
  - [ ] Education entries render from Sanity data
  - [ ] Each entry: institution, degree, dates, description
  - [ ] Empty state gracefully handled
  - [ ] Dark mode works

  **QA Scenarios**:
  ```
  Scenario: Education section renders entries
    Tool: Playwright
    Steps:
      1. Navigate to #educacion section
      2. Assert at least 1 education card or graceful empty state
      3. If entries exist: assert each has institution name + degree title
    Expected Result: Education data displayed or empty state shown
    Evidence: .sisyphus/evidence/task-12-education.png
  ```

  **Commit**: YES (groups with Wave 2)
  - Message: `feat: add Education section — card list from Sanity data`
  - Files: `components/sections/education.tsx`, `app/(home)/page.tsx` (updated)

- [x] 13. Contact / Links Section

  **What to do**:
  - Crear `components/sections/contact.tsx`:
    - Fetch `socialLinks` de Sanity (ordenados por `order`)
    - Diseño: cards/íconos con: GitHub, LinkedIn, Email, Twitter/X, etc.
    - Email: link `mailto:` con icono de sobre
    - Cada link: icono + nombre plataforma + URL
    - Sin formulario de contacto (EXCLUIDO del scope)
    - Llamada a la acción: "¿Hablamos?" o similar
  - Si one-page: sección con `id="contacto"`

  **Must NOT do**:
  - NO formulario de contacto (ni siquiera placeholder)
  - No incluir número de teléfono a menos que esté en Sanity

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple icon grid, straightforward layout
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8-12, 14, 15)
  - **Blocks**: None
  - **Blocked By**: Tasks 1, 3, 6

  **References**:
  - `lib/sanity-queries.ts` — `SOCIAL_LINKS_QUERY`
  - shadcn/ui `Button`, `Card`

  **Acceptance Criteria**:
  - [ ] Contact links render from Sanity socialLinks
  - [ ] Each link has icon + platform name
  - [ ] Email link uses `mailto:` protocol
  - [ ] Links open in new tab (`target="_blank"`)
  - [ ] Dark mode works on icons

  **QA Scenarios**:
  ```
  Scenario: Contact links are functional
    Tool: Playwright
    Steps:
      1. Navigate to #contacto section
      2. Assert at least GitHub and LinkedIn links visible
      3. Click GitHub link, assert new tab opens with github.com URL
      4. Assert email link starts with "mailto:"
    Expected Result: All contact links functional and correct
    Evidence: .sisyphus/evidence/task-13-contact.png
  ```

  **Commit**: YES (groups with Wave 2)
  - Message: `feat: add Contact/Links section — social icons grid from Sanity`
  - Files: `components/sections/contact.tsx`, `app/(home)/page.tsx` (updated)

- [x] 14. Navigation Component — Mobile + Desktop

  **What to do**:
  - Crear `components/layout/navigation.tsx`:
    - Desktop: sticky top bar con links: Inicio, Blog, Proyectos, CV, Stats + ThemeToggle
    - Mobile: hamburger menu con shadcn/ui `Sheet` (slide-in from right)
    - Links activos: highlight con `usePathname()`
    - Integrar `ThemeToggle` existente
    - Logo/nombre clickeable → scroll to top o ir a `/`
  - Reemplazar header actual en `app/layout.tsx` con este componente
  - Smooth scroll para secciones ancla en la home

  **Must NOT do**:
  - No incluir search bar en nav
  - No dropdowns complejos — navegación plana

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Navigation is the most interacted-with UI element — must be polished and responsive
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8-13, 15)
  - **Blocks**: Final integration
  - **Blocked By**: Tasks 2, 3, 4 (needs shadcn/ui, project structure, i18n strings)

  **References**:
  - Existing `app/layout.tsx` — Current header to replace
  - Existing `components/theme-toggle.tsx` — To integrate
  - shadcn/ui `NavigationMenu`, `Sheet`
  - `lib/i18n.ts` — `t()` for nav labels

  **Acceptance Criteria**:
  - [ ] Desktop: all nav links visible, active link highlighted
  - [ ] Mobile: hamburger opens sheet menu, links work
  - [ ] ThemeToggle integrated and functional
  - [ ] Smooth scroll to sections on home page
  - [ ] Dark mode consistent in nav

  **QA Scenarios**:
  ```
  Scenario: Desktop navigation works
    Tool: Playwright
    Preconditions: Viewport >= 1024px
    Steps:
      1. Navigate to http://localhost:3000/
      2. Assert nav bar visible with "Inicio", "Blog", "Proyectos", "CV", "Stats"
      3. Click "Blog", assert URL changes to /blog
      4. Assert "Blog" link has active class/style
      5. Toggle dark mode from nav, assert theme switches
    Expected Result: All nav links functional, active state correct
    Evidence: .sisyphus/evidence/task-14-nav-desktop.png

  Scenario: Mobile navigation works
    Tool: Playwright
    Preconditions: Viewport = 375px (iPhone)
    Steps:
      1. Navigate to http://localhost:3000/
      2. Assert hamburger icon visible, nav links hidden
      3. Click hamburger, assert sheet opens from right
      4. Assert all nav links visible in sheet
      5. Click "Blog", assert sheet closes and URL changes to /blog
    Expected Result: Mobile menu functional
    Evidence: .sisyphus/evidence/task-14-nav-mobile.png
  ```

  **Commit**: YES (groups with Wave 2)
  - Message: `feat: add Navigation component — sticky nav, mobile sheet menu, active links`
  - Files: `components/layout/navigation.tsx`, `app/layout.tsx` (updated)

- [x] 15. Sanity Content Seeding — Initial Data with AI

  **What to do**:
  - Usar IA para generar contenido inicial en español para Sanity:
    - **Profile**: nombre completo, bio profesional (~200 palabras), título ("Desarrollador Full-Stack" o similar), avatar URL (de GitHub), ubicación
    - **Experiences** (2-4 entradas): empresas, cargos, fechas, descripciones, tecnologías
    - **Skills** (10-20): nombre, categoría, nivel (1-5)
    - **Education** (1-3 entradas): institución, título, fechas
    - **Social Links**: GitHub, LinkedIn, Email (con URLs reales de `minimorcy`)
  - Formato: script o JSON para importar a Sanity (usando Sanity CLI o API)
  - El usuario revisará y refinará el contenido después
  - Incluir instrucciones para que el usuario edite desde Sanity Studio

  **Must NOT do**:
  - No usar datos falsos verificables (empresas reales donde no has trabajado)
  - No publicar sin que el usuario revise

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: Content generation and structuring in Spanish
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8-14)
  - **Blocks**: Tasks 8-13, 16-20 (provee datos para verificar UI)
  - **Blocked By**: Task 1 (needs Sanity schemas to know field structure)

  **References**:
  - GitHub profile of `minimorcy` — Use real GitHub data for avatar, repo count, etc.
  - `sanity/schemas/*.ts` — Schema field definitions
  - `lib/sanity-queries.ts` — Query patterns to match

  **Acceptance Criteria**:
  - [ ] Seed data file created (JSON or migration script)
  - [ ] Profile includes: name, bio (>100 chars), title, location
  - [ ] At least 2 experience entries with all fields
  - [ ] At least 10 skills across 3+ categories
  - [ ] Social links use real `minimorcy` URLs
  - [ ] Data successfully imported to Sanity

  **QA Scenarios**:
  ```
  Scenario: Seed data imports to Sanity successfully
    Tool: Bash (Sanity CLI)
    Steps:
      1. Run: npx sanity dataset import seed-data.ndjson
      2. Assert import completes without errors
      3. Verify via Sanity Vision or curl that documents exist
    Expected Result: All seed documents created in Sanity
    Evidence: .sisyphus/evidence/task-15-seed-import.txt
  ```

  **Commit**: NO (seed data is temporary, not production code)
  - Manual step: user reviews and edits content in Sanity Studio

### Wave 3 — Dynamic Features

- [x] 16. Blog — Post List Page + Individual Post Page

  **What to do**:
  - Crear `app/blog/page.tsx` (server component):
    - Fetch `posts` de Sanity (`POSTS_QUERY`)
    - Grid de cards: título, fecha, excerpt, tags, imagen portada
    - Si no hay posts: empty state "Próximamente..."
  - Crear `app/blog/[slug]/page.tsx` (server component):
    - Fetch post por slug (`POST_BY_SLUG_QUERY`)
    - Renderizar cuerpo con `@portabletext/react` (instalar)
    - Metadata dinámica: `generateMetadata({ params })`
    - JSON-LD Article schema
    - Navegación: "← Volver al blog"
  - Estilo de lectura: max-width ~65ch, tipografía cómoda

  **Must NOT do**:
  - No implementar comentarios, búsqueda avanzada, ni sistema de tags complejo

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Blog pages need polished reading experience with portable text rendering
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 17-21)
  - **Blocks**: None
  - **Blocked By**: Tasks 1, 3, 6, 15

  **References**:
  - `lib/sanity-queries.ts` — `POSTS_QUERY`, `POST_BY_SLUG_QUERY`
  - `@portabletext/react` docs: `https://github.com/portabletext/react-portabletext`
  - `lib/json-ld.ts` — `generateArticleSchema()`
  - shadcn/ui `Card`, `Badge`, `Skeleton`

  **Acceptance Criteria**:
  - [ ] Blog list page renders post cards from Sanity
  - [ ] Individual post renders full content with portable text
  - [ ] SEO metadata per post
  - [ ] Empty state when no posts
  - [ ] Dark mode works on blog

  **QA Scenarios**:
  ```
  Scenario: Blog list shows posts from Sanity
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000/blog
      2. Assert at least 1 post card visible or empty state message
      3. If posts exist: assert each card has title, date, tags
      4. Click first post card, assert navigates to /blog/[slug]
    Expected Result: Blog list functional with Sanity data
    Evidence: .sisyphus/evidence/task-16-blog-list.png

  Scenario: Individual post renders correctly
    Tool: Playwright
    Steps:
      1. Navigate to /blog/first-post-slug
      2. Assert post title rendered as h1
      3. Assert post body content visible (not raw JSON)
      4. Assert "← Volver al blog" link works
    Expected Result: Full blog post with proper formatting
    Evidence: .sisyphus/evidence/task-16-blog-post.png
  ```

  **Commit**: YES (groups with Wave 3)
  - Message: `feat: add Blog — list page, individual post with portable text, SEO metadata`
  - Files: `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `package.json`

- [x] 17. Proyectos Destacados — Curated Gallery

  **What to do**:
  - Crear `app/proyectos/page.tsx` (server component):
    - Fetch `projects` de Sanity donde `featured == true`
    - Grid de cards: imagen, título, descripción, tecnologías, links (demo + repo)
    - Filtro por tecnología: click en badge filtra
    - Animaciones de entrada escalonadas
  - Si no hay proyectos: mensaje + CTA a GitHub

  **Must NOT do**:
  - No mostrar lista cruda de repos de GitHub
  - No mezclar con proyectos no destacados

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 3)
  - **Blocks**: Task 20
  - **Blocked By**: Tasks 1, 3, 6, 15

  **References**:
  - `lib/sanity-queries.ts` — `FEATURED_PROJECTS_QUERY`
  - shadcn/ui `Card`, `Badge`, `Button`

  **Acceptance Criteria**:
  - [ ] Project cards in responsive grid
  - [ ] Filter by tech badge works
  - [ ] Empty state handled
  - [ ] Dark mode works

  **QA Scenarios**:
  ```
  Scenario: Projects page with filtering
    Tool: Playwright
    Steps:
      1. Navigate to /proyectos
      2. Assert project cards visible
      3. Click a tech badge, assert filter works
      4. Click "Ver proyecto", assert navigates to detail
    Expected Result: Curated project gallery with filtering
    Evidence: .sisyphus/evidence/task-17-projects.png
  ```

  **Commit**: YES (groups with Wave 3)
  - Message: `feat: add Proyectos Destacados — curated gallery with tech filtering`
  - Files: `app/proyectos/page.tsx`

- [x] 18. CV Page + PDF Generation from Sanity

  **What to do**:
  - Crear `app/cv/page.tsx` (server component):
    - Web version del CV con layout A4-compatible
    - Fetch datos: `profile`, `experience`, `skills`, `education`
    - CSS `@media print` para ocultar nav/footer al imprimir
    - Botón "Descargar PDF" que abre diálogo de impresión
    - Usar `react-to-print` o `window.print()`
  - CV siempre en modo claro (forzar light mode)

  **Must NOT do**:
  - No PDF estático manual
  - No generación server-side compleja (MVP: print to PDF)

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 3)
  - **Blocked By**: Tasks 1, 3, 6, 15

  **References**:
  - `lib/sanity-queries.ts` — profile, experience, skills, education queries
  - MDN `@media print`: `https://developer.mozilla.org/en-US/docs/Web/CSS/@media`

  **Acceptance Criteria**:
  - [ ] CV page renders all sections from Sanity
  - [ ] Print styles hide nav, show CV cleanly
  - [ ] "Descargar PDF" triggers print

  **QA Scenarios**:
  ```
  Scenario: CV prints cleanly
    Tool: Playwright
    Steps:
      1. Navigate to /cv
      2. Assert name, title, experience, education, skills visible
      3. Emulate print, assert nav hidden
    Expected Result: Complete CV with clean print layout
    Evidence: .sisyphus/evidence/task-18-cv.png
  ```

  **Commit**: YES (groups with Wave 3)
  - Message: `feat: add CV page — dynamic resume with print-optimized PDF generation`
  - Files: `app/cv/page.tsx`

- [x] 19. GitHub Stats Visualizations

  **What to do**:
  - Crear `app/stats/page.tsx`:
    - Fetch de GitHub API: repos, user info, events
    - Visualizaciones con `recharts`:
      - Language breakdown (doughnut chart)
      - Top repos by stars (bar chart)
      - Activity timeline
      - Total stats: repos, stars, forks
    - Diseño dashboard con cards + charts
  - Reemplaza COMPLETAMENTE la lista de repos anterior

  **Must NOT do**:
  - No incluir lista cruda de repos
  - No depender de Vercel Analytics

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 3)
  - **Blocked By**: Tasks 3, 6

  **References**:
  - Existing `lib/github.ts` — `fetchGitHub()`
  - `recharts` docs: `https://recharts.org`
  - GitHub API: `https://docs.github.com/en/rest`

  **Acceptance Criteria**:
  - [ ] Charts render with real data from `minimorcy`
  - [ ] Language doughnut, stars bar chart, total stats visible
  - [ ] Dark mode works on charts

  **QA Scenarios**:
  ```
  Scenario: Stats dashboard loads
    Tool: Playwright
    Steps:
      1. Navigate to /stats
      2. Wait for charts to render
      3. Assert language chart visible
      4. Assert total repos count > 0
    Expected Result: GitHub stats dashboard with visualizations
    Evidence: .sisyphus/evidence/task-19-stats.png
  ```

  **Commit**: YES (groups with Wave 3)
  - Message: `feat: add GitHub Stats — language breakdown, activity, top repos charts`
  - Files: `app/stats/page.tsx`, `package.json`

- [x] 20. Project Detail Page

  **What to do**:
  - Crear `app/proyectos/[slug]/page.tsx`:
    - Fetch project por slug de Sanity
    - Hero image, título, descripción, tecnologías, links
    - SEO metadata dinámica
    - "← Volver a proyectos"

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 3)
  - **Blocked By**: Tasks 1, 3, 6, 17

  **References**:
  - `app/blog/[slug]/page.tsx` — Same detail page pattern

  **Acceptance Criteria**:
  - [ ] Project detail renders with all content
  - [ ] Demo/repo links functional
  - [ ] SEO metadata dynamic

  **QA Scenarios**:
  ```
  Scenario: Project detail renders
    Tool: Playwright
    Steps:
      1. Navigate to /proyectos/[slug]
      2. Assert hero image, title, description, tech badges visible
      3. Click "Ver Demo", assert new tab
    Expected Result: Complete project detail page
    Evidence: .sisyphus/evidence/task-20-project-detail.png
  ```

  **Commit**: YES (groups with Wave 3)
  - Message: `feat: add Project Detail page — individual showcase with images and links`
  - Files: `app/proyectos/[slug]/page.tsx`

- [x] 21. Analytics Integration

  **What to do**:
  - Integrar Plausible o Umami (self-hosted en VPS)
  - Añadir `<Script>` en `app/layout.tsx`
  - Configurar env vars: `NEXT_PUBLIC_ANALYTICS_URL`, `NEXT_PUBLIC_ANALYTICS_WEBSITE_ID`

  **Must NOT do**:
  - No Vercel Analytics (no compatible con VPS)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 3)
  - **Blocked By**: None

  **References**:
  - Plausible: `https://plausible.io/docs`
  - Umami: `https://umami.is/docs`

  **Acceptance Criteria**:
  - [ ] Analytics script loads on all pages
  - [ ] No console errors

  **QA Scenarios**:
  ```
  Scenario: Analytics script present
    Tool: Bash (curl)
    Steps:
      1. curl -s http://localhost:3000/ | grep -i "plausible\|umami"
      2. Assert script tag found
    Expected Result: Analytics script in HTML
    Evidence: .sisyphus/evidence/task-21-analytics.txt
  ```

  **Commit**: YES (groups with Wave 3)
  - Message: `feat: add analytics — Plausible/Umami integration`
  - Files: `app/layout.tsx` (updated)

### Wave 4 — Polish + Deploy

- [x] 22. Dead Code Cleanup + Refactor

  **What to do**:
  - Eliminar `PaginatedRepos.tsx` y sus hooks asociados: `useDebounce`, `useFilteredRepos`, `usePagination`, `useReposByYear`
  - Eliminar `RepoCard.tsx` (reemplazado por nuevo diseño)
  - Limpiar `app/components/` si quedó vacío
  - Actualizar `app/page.tsx` — eliminar imports y lógica de PaginatedRepos
  - Verificar que `npm run build` pasa sin imports huérfanos
  - Eliminar `app/projects/[name]/` antiguo (reemplazado por `/proyectos/[slug]`)

  **Must NOT do**:
  - No eliminar `lib/github.ts` (aún se usa en `/stats`)
  - No eliminar `ThemeProvider` o `ThemeToggle`

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 4)
  - **Blocked By**: All Wave 3 tasks complete

  **Acceptance Criteria**:
  - [ ] `PaginatedRepos.tsx` deleted
  - [ ] Old hooks deleted
  - [ ] `npm run build` passes
  - [ ] No dead imports

  **QA Scenarios**:
  ```
  Scenario: Build after cleanup
    Tool: Bash
    Steps:
      1. Run: npm run build
      2. Assert exit code 0
      3. Assert no "Cannot find module" errors
    Expected Result: Clean build
    Evidence: .sisyphus/evidence/task-22-build.txt
  ```

  **Commit**: YES (groups with Wave 4)
  - Message: `chore: remove dead code — PaginatedRepos, old hooks, deprecated components`
  - Files: Multiple deletions

- [x] 23. Final SEO Audit + Metadata Completion

  **What to do**:
  - Revisar metadata en TODAS las páginas:
    - `title`, `description`, `openGraph`, `twitter` por página
  - `app/layout.tsx`: metadata global + template
  - Páginas dinámicas: `generateMetadata()` en blog/[slug], proyectos/[slug]
  - Verificar JSON-LD en: home, blog posts, proyectos, CV
  - Probar Google Rich Results Test mentalmente
  - Añadir `manifest.ts` básico (opcional, favicon config)

  **Must NOT do**:
  - No OG images dinámicas

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 4)
  - **Blocked By**: All content pages complete

  **Acceptance Criteria**:
  - [ ] Every page has unique title + description
  - [ ] JSON-LD present on relevant pages
  - [ ] `metadataBase` correct

  **QA Scenarios**:
  ```
  Scenario: SEO metadata check
    Tool: Playwright
    Steps:
      1. Navigate to each page
      2. Assert <title> is unique per page
      3. Assert <meta name="description"> present
      4. Assert JSON-LD script present on home
    Expected Result: Complete SEO metadata on all pages
    Evidence: .sisyphus/evidence/task-23-seo-audit.txt
  ```

  **Commit**: YES (groups with Wave 4)
  - Message: `chore: SEO audit — metadata completion, JSON-LD verification`
  - Files: Multiple page updates

- [x] 24. 404 Page + Error Boundaries

  **What to do**:
  - Mejorar `app/not-found.tsx` existente:
    - Diseño acorde al nuevo estilo
    - Link a home
    - Animación sutil
  - Mejorar `app/error.tsx`:
    - Mensaje amigable en español
    - Botón "Reintentar"
  - Crear `error.tsx` en rutas críticas: `/blog/[slug]`, `/proyectos/[slug]`

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 4)
  - **Blocked By**: Tasks 2, 3

  **Acceptance Criteria**:
  - [ ] 404 page styled with new design
  - [ ] Error boundaries on dynamic routes
  - [ ] Error messages in Spanish

  **QA Scenarios**:
  ```
  Scenario: 404 page renders
    Tool: Playwright
    Steps:
      1. Navigate to /nonexistent-page
      2. Assert 404 message visible
      3. Assert "Volver al inicio" link present
      4. Click link, assert navigates to /
    Expected Result: Styled 404 with navigation
    Evidence: .sisyphus/evidence/task-24-404.png
  ```

  **Commit**: YES (groups with Wave 4)
  - Message: `chore: improve 404 and error boundaries — styled, Spanish messages`
  - Files: `app/not-found.tsx`, `app/error.tsx`, route-level error files

- [x] 25. Loading States + Skeleton UI

  **What to do**:
  - Mejorar `app/loading.tsx`: skeleton acorde al nuevo diseño
  - Crear skeletons para: blog list, project cards, stats charts
  - Usar shadcn/ui `Skeleton` component
  - Suspense boundaries donde tenga sentido

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 4)
  - **Blocked By**: All content components exist

  **Acceptance Criteria**:
  - [ ] Skeleton UI visible during page loads
  - [ ] No layout shift when content loads

  **QA Scenarios**:
  ```
  Scenario: Loading states visible
    Tool: Playwright
    Steps:
      1. Throttle network to Slow 3G
      2. Navigate to /blog
      3. Assert skeleton cards visible before content
      4. Wait for content, assert skeletons replaced
    Expected Result: Smooth loading experience
    Evidence: .sisyphus/evidence/task-25-loading.png
  ```

  **Commit**: YES (groups with Wave 4)
  - Message: `chore: add loading skeletons — blog, projects, stats placeholders`
  - Files: `app/loading.tsx`, skeleton components

- [x] 26. VPS Deployment Configuration

  **What to do**:
  - Crear `ecosystem.config.js` para PM2:
    - `name`: `portfolio`
    - `script`: `node_modules/.bin/next`
    - `args`: `start`
    - `env`: `NODE_ENV=production`, `PORT=3000`
  - Crear template nginx config (`nginx/portfolio.conf`):
    - Reverse proxy `localhost:3000`
    - SSL (Let's Encrypt cert paths)
    - `server_name javiermorcillonuevo.com`
    - Gzip, cache headers for static assets
  - Crear `deploy.sh` script:
    - `git pull`
    - `npm ci`
    - `npm run build`
    - `pm2 reload portfolio`
  - Documentación en README: pasos de deploy en VPS

  **Must NOT do**:
  - No hardcodear IPs o paths absolutos (usar variables)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (Wave 4)
  - **Blocked By**: All features implemented

  **Acceptance Criteria**:
  - [ ] `ecosystem.config.js` exists with correct PM2 config
  - [ ] Nginx config template provided
  - [ ] Deploy script created
  - [ ] README updated with deploy instructions

  **QA Scenarios**:
  ```
  Scenario: PM2 config is valid
    Tool: Bash
    Steps:
      1. Run: npx pm2 start ecosystem.config.js --only portfolio (dry-run check syntax)
      2. Assert no syntax errors
    Expected Result: PM2 config parses correctly
    Evidence: .sisyphus/evidence/task-26-pm2-config.txt
  ```

  **Commit**: YES (groups with Wave 4)
  - Message: `chore: add VPS deploy config — PM2, nginx template, deploy script`
  - Files: `ecosystem.config.js`, `nginx/portfolio.conf`, `deploy.sh`, `README.md`

- [x] 27. Cross-Browser QA + Final Polish

  **What to do**:
  - Ejecutar QA scenarios de TODOS los tasks anteriores con Playwright
  - Verificar en Chrome, Firefox, Safari (via Playwright)
  - Verificar responsive: 375px, 768px, 1024px, 1440px
  - Verificar dark mode toggle en todas las páginas
  - Verificar todos los links externos abren en nueva pestaña
  - Verificar navegación por teclado básica
  - Reporte de issues encontrados + fixes

  **Must NOT do**:
  - No testing manual humano permitido

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: NO (final step, runs after all others)
  - **Blocks**: Final Verification Wave
  - **Blocked By**: Tasks 22-26

  **Acceptance Criteria**:
  - [ ] All QA scenarios from previous tasks pass
  - [ ] Cross-browser check passes
  - [ ] Responsive design verified
  - [ ] Issues fixed or documented

  **QA Scenarios**: Covered by running all previous task scenarios in sequence.

  **Evidence**: Aggregated in `.sisyphus/evidence/final-qa/`

  **Commit**: YES (groups with Wave 4)
  - Message: `chore: cross-browser QA — verify all pages, responsive design, final fixes`
  - Files: Fixes as needed

---

## Final Verification Wave

---

## Commit Strategy

Commits agrupados por wave:
- **Wave 1**: `feat: foundation — sanity schemas, shadcn/ui, i18n scaffold, seo utils`
- **Wave 2**: `feat: content pages — home, about, timeline, skills, education, contact, navigation`
- **Wave 3**: `feat: dynamic features — blog, projects, cv pdf, github stats, analytics`
- **Wave 4**: `chore: polish — cleanup, seo audit, errors, loading, vps deploy config`

---

## Success Criteria

### Verification Commands
```bash
npm run build        # Expected: exit 0, no errors
npm run lint         # Expected: exit 0, no warnings
npx next start       # Expected: server running on :3000, all pages accessible
```

### Final Checklist
- [ ] All 9 "Must Have" sections present and functional
- [ ] All "Must NOT Have" absent (no contact form, no hardcoded content, no raw repo list)
- [ ] Sanity Studio accessible and editable
- [ ] Build passes cleanly
- [ ] Dark mode works on all pages
- [ ] Responsive design verified (mobile + desktop)
- [ ] SEO metadata on all pages
- [ ] sitemap.xml accessible and valid
- [ ] VPS deploy config ready
