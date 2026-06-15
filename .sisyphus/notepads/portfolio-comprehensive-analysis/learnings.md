# Learnings

## 2026-06-07 Initial Analysis
- 9 source files total in app/ directory
- PaginatedRepos.tsx is 325-line monolith with 7 responsibilities
- API route `/api/github` exists but is NEVER used by page.tsx
- `force-dynamic` + `cache: 'no-store'` on every fetch = zero caching
- No GITHUB_TOKEN = rate limited to 60 req/hour
- Repo type duplicated 3 times across files
- Tailwind config not extended (flat design system)

## Conventions
- Next.js 14 App Router with server components
- Tailwind CSS with `class` dark mode strategy
- TypeScript strict mode
- Deployed on Vercel
- No test framework (jest/vitest)
- Native fetch() for API calls (no axios/SWR/React Query)
- All components in app/components/ (no src/ directory)

## T1 completed: lib/github.ts as single source of truth for GitHub API calls

## T2 completed: ISR enabled on homepage
- Replaced `export const dynamic = 'force-dynamic'` with `export const revalidate = 3600` in app/page.tsx
- Revalidate API route at app/api/revalidate/route.ts remains intact (POST with secret token, calls revalidatePath('/'))
- Build output: `/` route shows `○` (Static with ISR) instead of `ƒ` (Dynamic)
- Revalidation cache: 1 hour (3600 seconds)
- Manual revalidation trigger: POST /api/revalidate with `x-revalidate-token` header matching `REVALIDATE_SECRET`

## T3 completed: Enriched portfolio with real GitHub profile data
- Extended `Repo` type in both `page.tsx` and `RepoCard.tsx` with `stargazers_count`, `forks_count`, `topics`, `homepage` fields
- Added GitHub user profile fetch via `fetchGitHub` in `HomePage()` — gets avatar_url, bio, public_repos, followers
- Replaced hardcoded "About Me" hero with dynamic profile section showing avatar (img tag), username, bio (with BIO fallback), and stats (repos, followers)
- When profile fetch fails, gracefully degrades to show the original hardcoded BIO
- Updated `RepoCard.tsx` with:
  - Topic chips (blue rounded pills) below description
  - Stats row with star count and fork count (conditional — only shows if > 0)
  - Created date moved into the stats row
- Used native `<img>` tag (not next/image) to avoid remote pattern config
- BIO constant preserved as fallback for both profile bio and non-profile state
- `revalidate = 3600` kept intact
- Verified: `tsc --noEmit` clean, `npm run build` passes
- Repo type now duplicated 4 times across files (page.tsx, RepoCard.tsx, PaginatedRepos.tsx, lib/github.ts) — technical debt for future consolidation
## T5 - Extract shared types and constants

### What was done
- Created 	ypes/github.ts with shared Repo and GitHubUser types
- Created lib/constants.ts with ENTRIES_PER_PAGE, DEFAULT_USERNAME, and LANGUAGE_COLORS
- Removed duplicate Repo type from page.tsx, PaginatedRepos.tsx, and RepoCard.tsx
- Removed duplicate languageColors from RepoCard.tsx
- Removed inline const entriesPerPage = 8 from PaginatedRepos.tsx

### Key decisions
- Used import type for type-only imports (TypeScript isolatedModules best practice)
- Repo interface includes all fields from all three source locations (superset - union of the three definitions)
- GitHubUser interface used in page.tsx for the profile variable instead of inline type
- ENTRIES_PER_PAGE replaces the hardcoded const entriesPerPage = 8
- LANGUAGE_COLORS extends the original limited set from RepoCard.tsx with additional language entries

### Verification
- 
px tsc --noEmit passes with zero errors
- 
pm run build passes successfully
- No behavioral changes - pure extraction/refactor

## T10 completed: Tailwind design system config

- tailwindcss/defaultTheme is available as a dependency providing sensible fallback font stacks
- Brand colors (indigo, 50-950) and accent colors (amber, 50-950) defined for full Tailwind scale compatibility
- Custom animations (fade-in, slide-up) with corresponding keyframes added
- Build validates the config automatically -- no separate lint step needed
- Font CSS vars (--font-inter, --font-jetbrains) referenced but must be set by T11 (next/font)

## Portfolio Layout Redesign (Sticky Header + Hero + Footer)
- Date: 2026-06-07
- Files modified: app/layout.tsx, app/page.tsx
- Key changes:
  - Sticky header with backdrop-blur-md, brand-colored logo, nav links + ThemeToggle
  - Hero section with GitHub profile avatar (ring-4 ring-brand-200), bio, location, repos/followers stats with SVG icons
  - 3-column footer with Navigation, Connect (GitHub/LinkedIn), Built With sections
  - Body bg changed from dark:bg-gray-900 to dark:bg-gray-950
  - max-w changed from 4xl to 5xl
- Build passes successfully

## Animation + Design System Integration (T11)
- RepoCard accepts optional \index\ prop for staggered entrance animations via \nimationDelay\ inline style
- \nimate-slide-up opacity-0\ with \nimationFillMode: 'forwards'\ ensures cards animate in and stay visible
- 60ms stagger delay per card provides smooth cascading entrance
- Brand colors (brand-500, brand-600, brand-400) replaced all blue-500/600/400 references across tabs, buttons, chips, links, and focus rings
- Hover effects: \hover:scale-[1.02]\ on cards, \hover:rotate-12\ on theme toggle icon
- Active feedback: \ctive:scale-[0.98]\ on cards, \ctive:scale-95\ on buttons/chips, \ctive:scale-90\ on theme toggle
- All interactive elements use \	ransition-all duration-200\ for consistent timing
- Pagination buttons use \ounded-lg\ instead of \ounded\ for consistency with design system
- Filter chips use \g-gray-100 dark:bg-gray-800\ for inactive state (lighter than previous \g-gray-200 dark:bg-gray-700\)
- Build passes cleanly after all changes
