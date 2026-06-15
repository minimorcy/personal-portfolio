# Code Quality Review — Learnings

## Patterns Observed

### Error Handling Architecture
- `fetchSanity<T>` in `lib/sanity.ts` wraps Sanity client in try/catch, logging errors and returning fallback
- `fetchGitHub<T>` in `lib/github.ts` throws on non-OK responses, with callers using try/catch
- API routes (`app/api/github/route.ts`) have try/catch returning 500 with generic error message
- Client components use `.catch(() => {})` pattern (silent failures)

### Data Fetching Patterns
- Sanity data fetched server-side in async components via `fetchSanity<T>()`
- GitHub data fetched with `fetchGitHub<T>()` which adds auth header if token present
- Both have fallback states (null checks, empty arrays)

### i18n
- Simple i18n system with `t()` returning translations for default locale
- Only Spanish (`es`) translations defined
- Many hardcoded strings not yet in i18n system

### Accessibility
- All `<Image>` components from `next/image` have `alt` attributes
- Navigation has `aria-label` on mobile menu button
- All JSX `.map()` loops have `key` props

## Key Finding
The `( [] as unknown ) as T` pattern in `lib/sanity.ts:37` is the primary quality concern. It violates type safety and can mask data-fetching failures. When Sanity is unreachable, pages render with missing/incomplete data instead of showing proper error states or 404 pages.
