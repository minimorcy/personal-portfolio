# SEO Audit — Learnings

## Metadata Status
- **layout.tsx** — `metadataBase` uses `NEXT_PUBLIC_BASE_URL` env var with fallback `https://javiermorcillonuevo.com` ✅
- **Root title template**: `'%s | minimorcy'` — all child pages get this suffix
- All pages except CV had metadata ✅

## Pages with metadata (before fix)
| Route | Type | Title |
|-------|------|-------|
| `/` | `generateMetadata()` | `Javier Morcillo \| Portfolio` |
| `/blog` | `metadata` export | `Blog \| Javier Morcillo` |
| `/blog/[slug]` | `generateMetadata()` | `${post.title} \| Blog` |
| `/proyectos` | `metadata` export | `Proyectos \| Javier Morcillo` |
| `/proyectos/[slug]` | `generateMetadata()` | `${project.title} \| Proyectos` |
| `/stats` | `metadata` export | `Estadísticas GitHub \| Javier Morcillo` |

## Fix Applied
- **`/cv`** — Client component (`'use client'`) can't export `metadata` directly
- Solution: Created `app/cv/layout.tsx` with `metadata` export wrapping the page
- Title: `CV | Javier Morcillo` → becomes `CV | Javier Morcillo | minimorcy` (via template)
- Description: Professional CV description in Spanish

## Sitemap Update
- Added dynamic routes for `/blog/[slug]` and `/proyectos/[slug]` by fetching from Sanity
- Wrapped in try/catch to gracefully handle Sanity unavailability during builds
