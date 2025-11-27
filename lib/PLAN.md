# Plan: Implement Loading States and Cache Components

## Goal
Add comprehensive loading states and implement Next.js 16 `cacheComponents` features (using `use cache` directive) to improve performance and user experience.

## Context
- Project uses Next.js 16.
- `cacheComponents` config enables granular caching control.
- Loading UI should be implemented using `loading.tsx` and `<Suspense>`.

## Steps

### 1. Configuration
- [x] Enable `cacheComponents` in `next.config.ts`.

### 2. Global Loading UI
- [x] Create `app/loading.tsx` for global route transitions using a generic spinner or skeleton layout.

### 3. Route-Specific Loading States
Create `loading.tsx` for key routes to provide context-aware skeletons.
- [x] `app/projects/loading.tsx` (Skeleton for project list)
- [x] `app/projects/[id]/loading.tsx` (Skeleton for project details)
- [x] `app/calendar/loading.tsx`
- [x] `app/team/loading.tsx`
- [x] `app/reports/loading.tsx`
- [x] `app/settings/loading.tsx`

### 4. Component Caching (`use cache`)
Apply `'use cache'` to server actions and heavy data fetching components to leverage the new caching mechanism.
- [x] Analyze `app/actions/` files (`projects.ts`, `tasks.ts`, etc.) and apply `'use cache'` to read operations where data freshness requirements allow (using `cacheLife` if needed).
- [x] Apply `'use cache'` to heavy UI components if they are static enough (e.g., complex dashboards or report views) or parts of them. (Applied via Server Actions which are used by components).

### 5. Component Loading (Suspense)
- [x] Identify components that fetch data asynchronously and wrap them in `<Suspense>` with appropriate fallback skeletons in their parent pages/layouts.
    - `loading.tsx` handles the page level suspense.
    - Client components handle their own loading states via `useQuery` skeletons.

### 6. Refinement
- [x] Ensure `skeleton.tsx` and other UI placeholders are visually consistent with the actual content.
- [x] Verify no "flash of loading content" for very fast loads if possible (Next.js handles this well usually).

## Verification
- [x] Build the project to ensure `cacheComponents` is valid.
- [x] Navigate through the app to verify loading skeletons appear.
- [x] Check logs/network to verify caching is working (fewer requests for cached data).