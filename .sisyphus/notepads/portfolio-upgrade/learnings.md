# Task 1: Sanity Setup + Content Schemas

## Key Decisions
- Used `next-sanity@^9` (v9.4.7) instead of latest v13 because v13 requires Next.js 16. v9 supports Next.js 14.x/15.x.
- Installed `sanity@^3` as a dependency for `defineType`/`defineField` schema helpers (required by the task's schema pattern).
- Added env vars to existing `.env` (project uses `.env`, not `.env.local`).
- Project ID uses placeholder "your-project-id" until actual Sanity project is provisioned.

## Patterns Established
- `lib/sanity.ts` follows the same pattern as `lib/github.ts`: env vars for config, typed exports, graceful fallback.
- All schemas use `defineType`/`defineField` from `sanity` package (Sanity v3 pattern).
- Each schema includes `preview.select` for Sanity Studio preview cards.
- Image fields use `options: {hotspot: true}` for focal point cropping.
- Tag arrays use `options: {layout: 'tags'}` for tag-style UI.

## Versions Installed
- `@sanity/client@^6` (v6.28.4)
- `@sanity/image-url@^1` (v1.1.0)
- `next-sanity@^9` (v9.4.7)
- `sanity@^3` (v3.68.3)
- `styled-components@^6` (v6.1.13) — peer dep of sanity

## Files Created
- `sanity/schemas/profile.ts`
- `sanity/schemas/experience.ts`
- `sanity/schemas/skill.ts`
- `sanity/schemas/project.ts`
- `sanity/schemas/education.ts`
- `sanity/schemas/post.ts`
- `sanity/schemas/socialLink.ts`
- `sanity.config.ts`
- `sanity.cli.ts`
- `lib/sanity.ts`

## Verification
- `npm run build` passes with 0 errors, 0 warnings.

## Task 2: shadcn/ui Installation (Completed 2026-06-08)
- Shadcn v4 (shadcn@4.11.0) incompatible with Tailwind CSS v3.4.x
- Old shadcn-ui CLI deprecated, registry endpoints return 404
- Solution: Manual v3-compatible setup (components.json + hand-written components)
- Key packages: clsx, tailwind-merge, cva, tailwindcss-animate, lucide-react, @radix-ui/react-*

## Task 8: Redesign Home Page — Extended Hero + Skills Preview

### Patterns & Conventions
- Next.js App Router: pp/page.tsx is the root route; route groups like (home) don't create separate URLs, so replacing pp/page.tsx directly is the correct approach
- Sanity integration: etchSanity<T>() with GROQ queries runs in parallel via Promise.all() for optimal data fetching
- Image handling: urlFor() from @sanity/image-url with .width().height().fit('crop').url() chain for optimized avatars
- Fallback pattern: When Sanity returns null/empty, show "Configurando portfolio..." placeholder instead of crashing
- GitHub stats: Fetch user profile once to get public_repos and ollowers counts, display as clickable teasers linking to /stats
- shadcn/ui: Button with sChild wraps <a> tags for Next.js client-side navigation; Badge with ariant="secondary" for skill tags
- Animations: nimate-slide-up on hero and CTA sections, nimate-fade-in on skills section (defined in tailwind.config.ts)
- i18n: 	() function from @/lib/i18n.ts provides type-safe translations for default locale in server components
- Responsive design: lex-col md:flex-row for vertical stacking on mobile, side-by-side on desktop

### Build Verification
- 
pm run build passes successfully
- Sanity fetch errors are expected with placeholder credentials and handled gracefully
- Page size: 5.25 kB, First Load JS: 92.3 kB

## Task 10: Experience Section (components/sections/experience.tsx)
- Created as async server component following about.tsx pattern
- Uses EXPERIENCES_QUERY to fetch from Sanity, ordered by startDate desc
- Vertical timeline: left border with dot (bg-brand-600) + connecting line (bg-gray-200)
- Each entry: Card with logo (urlFor, 64x64), role (h3), company (brand color), date range (Intl.DateTimeFormat es-ES), description, tech badges
- Animation: className='animate-slide-up opacity-0' with style animationDelay per index
- Returns null if no experiences (empty array or non-array)
- Imported in app/page.tsx after skills preview, before CTA buttons
- Section id='experiencia'
- Build passes (11/11 pages)

## Task 18: Dynamic CV Page (app/cv/page.tsx)

### Key Decisions
- Client component ('use client') � CV data is dynamic content from Sanity fetched at runtime
- Parallel data fetching via Promise.all() with 4 queries (profile, experiences, skills, education)
- Print-optimized layout: @media print styles hide nav/header/footer and .no-print elements
- 'Descargar CV' button triggers window.print() � no server-side PDF generation
- Sanity images use urlFor() with explicit width/height (120x120 for avatar)
- Localized section headings use t().sections.* from the i18n system

### Patterns
- Sanity fetch error handling: catch(() => {}) silently catches placeholder/network errors
- Type guard: Check '_id in p' before casting Sanity result to Profile type
- Date formatting: new Date(exp.startDate).getFullYear() for year-only display
- Fallback for current position: exp.endDate ? ... : 'Presente'

---

# F4: Scope Fidelity Check (2026-06-08)

## Verdict: APPROVE (with minor notes)

### MUST HAVE - All 14 items present

| # | Item | Status |
|---|------|--------|
| 1 | About Me section | ✅ Hero shows profile info; dedicated `components/sections/about.tsx` exists but is NOT imported in page.tsx |
| 2 | Experience Timeline | ✅ `components/sections/experience.tsx` with timeline visualization |
| 3 | Skills / Tech Stack | ✅ `components/sections/skills.tsx` with category tabs and progress bars |
| 4 | Proyectos Destacados (curated) | ✅ `app/proyectos/page.tsx` with `featured == true` filter |
| 5 | CV descargable (PDF via print) | ✅ `app/cv/page.tsx` with `window.print()` and print styles |
| 6 | Blog / Articles (from Sanity) | ✅ `app/blog/page.tsx` + `[slug]/page.tsx` with PortableText |
| 7 | Educación / Certifications | ✅ `components/sections/education.tsx` with institution logos |
| 8 | Contacto / Links | ✅ `components/sections/contact.tsx` with social link buttons (no form) |
| 9 | Analytics (Plausible script) | ✅ `app/layout.tsx` lines 68-74 |
| 10 | GitHub Stats visualizations | ✅ `app/stats/page.tsx` with stats cards, language breakdown, top repos |
| 11 | Sanity CMS integration | ✅ Client, 7 schemas, GROQ queries, config files |
| 12 | shadcn/ui components | ✅ `components.json` + 15 UI components |
| 13 | i18n-ready (español) | ✅ `lib/i18n.ts` + `lib/i18n-config.ts` with `defaultLocale: 'es'` |
| 14 | SEO (sitemap, robots, metadata) | ✅ `sitemap.ts`, `robots.ts`, per-page metadata, JSON-LD utils |

### MUST NOT - All 7 guardrails respected

| # | Item | Status |
|---|------|--------|
| 1 | NO contact form | ✅ No `<form>` elements anywhere |
| 2 | NO automated tests | ✅ No test files found |
| 3 | NO blog comments | ✅ No comment functionality |
| 4 | NO blog search | ✅ No search logic |
| 5 | NO dynamic OG images | ✅ No OG generation code |
| 6 | NO PWA/offline | ✅ No manifest or service worker |
| 7 | NO raw repo list | ✅ Old hooks/components removed |

### Minor Issues (non-blocking)
1. `AboutSection` component exists but not integrated into home page
2. Footer metadata outdated (missing Sanity, shadcn/ui mentions)
3. Layout metadata has `locale: 'en_US'` despite Spanish-primary site
