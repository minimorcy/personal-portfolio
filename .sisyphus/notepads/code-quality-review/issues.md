# Code Quality Review — Issues Found

## BLOCKER: REJECT

### 🔴 lib/sanity.ts:37 — Dangerous type cast in error handler
```typescript
return ([] as unknown) as T
```
**Impact**: When `fetchSanity<T>` fails and T is not an array (e.g., `Profile`, `Post`, `Project`), the function returns an empty array cast as T. This:
- Bypasses null checks (`[]` is truthy → `if (!post) notFound()` never triggers)
- Causes `post.title` / `profile.avatar` to be `undefined` instead of showing proper error states
- The double cast `as unknown as T` signals type unsafety

**Affected callers**:
- `app/page.tsx:36` — `fetchSanity<Profile | null>(PROFILE_QUERY)`
- `app/blog/[slug]/page.tsx:34` — `fetchSanity<Post>(...)`
- `app/proyectos/[slug]/page.tsx:34` — `fetchSanity<Project>(...)`
- All other non-array fetchSanity calls

**Fix**: Either return `null` on error (changing return type to `T | null`) or create separate `fetchSanityArray` for array queries.

---

## MEDIUM (Should Fix)

### 🟡 components/sections/skills.tsx:18 — Empty catch suppresses errors
```typescript
.catch(() => {})
```
Silently swallows Sanity fetch errors. User sees no error or loading state transition (loading stays true briefly then component renders null).

### 🟡 Hardcoded Spanish strings not in i18n system
- `app/page.tsx:60` — `"Configurando portfolio..."`
- `app/stats/page.tsx:70-85` — `"Repositorios"`, `"Estrellas"`, `"Forks"`, etc.
- `app/error.tsx:7-9` — `"Algo salió mal"`, `"Ha ocurrido un error inesperado..."`
- `app/not-found.tsx:8-10` — `"Página no encontrada"`, `"La página que buscas..."`
- `components/sections/contact.tsx:23` — `"¿Hablamos? Puedes encontrarme en:"`
- `app/proyectos/[slug]/page.tsx:45` — `"← Volver a proyectos"`
- `app/proyectos/[slug]/page.tsx:72` — `"Ver Demo"`

### 🟡 lib/sanity.ts:9-11 — console.warn runs in production
Warning about missing Sanity project ID shows in production logs. Should be gated to dev only.

---

## MINOR / OBSERVATIONS (Acceptable)

### ✅ app/layout.tsx:61 — Empty catch in theme script
Intentional: `catch (e) {}` inside inline `<script>` for theme detection. If localStorage is blocked, we silently use system preference. Standard pattern.

### ✅ lib/github.ts:22 — console.warn for rate limiting
Intentional: warns when GitHub API rate limit is low. Useful for operations.

### ✅ lib/github.ts:2 — Hardcoded fallback username
Expected for a personal portfolio: `process.env.GITHUB_USERNAME || 'minimorcy'`.

### ✅ Hardcoded locale `'es-ES'` 
Spanish portfolio → expected to use Spanish locale formatting.

### ✅ app/layout.tsx:50 — suppressHydrationWarning
Standard pattern for immediate theme application before React hydration.

### ✅ app/layout.tsx:53 — dangerouslySetInnerHTML
Only used for theme init script, not user content. Acceptable.

---

## CLEAN BILL OF HEALTH
- No `as any` or `@ts-ignore` found ✅
- All `<Image>` components have `alt` attributes ✅
- All JSX `.map()` calls have proper `key` props ✅
- Error boundaries present: `error.tsx`, `loading.tsx`, `not-found.tsx` ✅
- Good fallback states for most data fetches ✅
- LSP diagnostics: `typescript-language-server` not installed (infra issue, not code issue) ✅
