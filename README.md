# Next.js GitHub Portfolio (ISR + API Routes + App Router)

A minimal Next.js 14 app that server-renders your GitHub repositories with Incremental Static Regeneration (ISR), showcases file-based routing, route handlers (API routes), and built-in image optimization. Inspired by the article "From React to Next.js: Why I Finally Switched and What I Learned".

## Features
- **App Router**: `app/` directory with `layout.tsx` and server components
- **ISR**: Revalidates repo list hourly so new GitHub repos appear without redeploys
- **API Route**: `app/api/github/route.ts` proxies GitHub (adds headers, optional token)
- **Server Components**: Data fetching happens on the server for SEO-ready HTML
- **Tailwind CSS**: Simple, responsive UI with dark mode support
- **Image Optimization**: `next/image` ready with remote patterns
- **Dark Mode**: Toggle between light and dark themes with persistent preference
- **Dynamic Year-Based Pagination**: Automatically groups repos by year (latest year, next year if exists, older)
- **Search Functionality**: Real-time search by repository name, description, or language
- **Language Tags & Filters**: Color-coded language badges and filter buttons for easy browsing
- **Combined Filtering**: Year tabs, search, and language filters work together seamlessly

## Quick Start
```bash
# Install deps
npm install

# Run dev server
npm run dev

# Build and start
npm run build && npm start
```

Open `http://localhost:3000`.

## Configuration
- Set your GitHub username via env var:
- `GITHUB_USERNAME` (defaults to `your-github-username`)
  - Optional `GITHUB_TOKEN` to raise rate limits
- For local dev, create `.env.local`:
```bash
GITHUB_USERNAME=your-github-username
# GITHUB_TOKEN=ghp_xxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# Optional for webhook revalidation
REVALIDATE_SECRET=some-strong-random-secret
```
On Vercel, configure these in Project Settings → Environment Variables. For production, set `NEXT_PUBLIC_BASE_URL` to your deployed domain, e.g. `https://your-app.vercel.app`.

## Key Files
- `app/page.tsx`: Server component, fetches from internal `/api/github` with ISR
- `app/api/github/route.ts`: Route Handler, caches with `revalidate = 3600`
- `app/api/revalidate/route.ts`: On-demand revalidation endpoint (for GitHub webhook)
- `app/components/RepoCard.tsx`: UI component for each repo with language tags
- `app/components/PaginatedRepos.tsx`: Client component with year-based pagination, search, and language filters
- `app/components/ThemeProvider.tsx`: Dark mode context provider with localStorage persistence
- `app/components/ThemeToggle.tsx`: Dark mode toggle button component
- `app/layout.tsx`: Shared layout (nav/footer) with theme provider
- `next.config.mjs`: Remote image host whitelisting
- `tailwind.config.ts` and `app/globals.css`: Tailwind setup with dark mode enabled

## New Features (Latest Update)

### Dark Mode
- Toggle between light and dark themes via button in navigation bar
- Theme preference saved in localStorage
- Respects system preference on first visit
- Smooth transitions between themes

### Dynamic Year-Based Pagination
- Automatically detects latest year from your repositories
- Shows up to 3 tabs: Latest Year, Next Consecutive Year (if exists), Older
- Future-proof: automatically adapts when new year repos are added
- 8 repositories per page with pagination controls at the bottom

### Search Functionality
- Real-time search bar filters repositories as you type
- Searches across repository name, description, and language
- Clear button (X) appears when filters are active
- Shows result count when filters are applied

### Language Tags & Filters
- Color-coded language badges on each repository card
- Language filter buttons dynamically generated from your repos
- "All" button to clear language filter
- Filters work in combination with year tabs and search

## Next.js Concepts Demonstrated
- **File-Based Routing**: `app/page.tsx` is `/`. Add routes by creating folders like `app/about/page.tsx`.
- **Server Components by Default**: No `use client` needed; fetch runs on the server.
- **Client Components**: Components with interactivity use `'use client'` directive (e.g., `PaginatedRepos`, `ThemeProvider`)
- **React Context**: Theme management using Context API for dark mode
- **Data Fetching**: `fetch()` with `{ next: { revalidate: 3600 } }` enables ISR; alternatively use `{ cache: 'no-store' }` for SSR.
- **ISR (Incremental Static Regeneration)**: Page HTML is cached and re-generated in the background on first request after the revalidate window.
- **Route Handlers (API Routes)**: `app/api/github/route.ts` provides a stable, cacheable internal endpoint, ideal for keys/headers.
- **Image Optimization**: Configure `images.remotePatterns` for GitHub avatars or raw content.
- **Tailwind Integration**: Content globs include `./app/**/*.{js,ts,jsx,tsx}` with dark mode (`darkMode: 'class'`).
- **State Management**: React hooks (`useState`, `useMemo`, `useEffect`) for filtering and pagination

## Adding Dynamic Routes (Example)
Create `app/projects/[slug]/page.tsx` and fetch repo details using `params.slug`. Optionally implement `generateStaticParams()` for SSG + ISR.

## On-Demand Revalidation (Optional)
- Set `REVALIDATE_SECRET`
- Configure a GitHub Webhook (any event like repository) to POST to:
  - `/api/revalidate` with header `x-revalidate-token: REVALIDATE_SECRET`
This triggers `revalidatePath('/')` so new repos appear immediately, without waiting for the ISR window.

## Troubleshooting
- **Data not updating**: Lower `revalidate` or switch to `{ cache: 'no-store' }`.
- **Hydration warnings**: Keep stateful hooks only in components marked with `'use client'`.
- **Dark mode not working**: Ensure `darkMode: 'class'` is set in `tailwind.config.ts` and `ThemeProvider` wraps your app in `layout.tsx`.
- **Search/filters not working**: Verify `PaginatedRepos` component is properly imported and repos data is passed correctly.
- **Tailwind not applying**: Verify `content` globs and that `app/globals.css` is imported by `layout.tsx`.
- **Rate limits**: Provide `GITHUB_TOKEN`.
- **Invalid images**: Ensure host is allowed in `next.config.mjs`.

## Deploy
- One command on Vercel:
```bash
vercel
```
Vercel auto-detects Next.js, sets `NODE_VERSION`, and enables ISR by default.

---

If this project helps, consider reading the accompanying article and sharing your feedback.
