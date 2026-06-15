# Architectural Decisions

## 2026-06-07 Execution Strategy
- Sequential execution within phases to avoid file conflicts on app/page.tsx
- T1 and T3 can parallelize (different files)
- T2 and T4 execute after T1 (both modify page.tsx)
- lib/github.ts will be the single source of truth for all GitHub API calls
