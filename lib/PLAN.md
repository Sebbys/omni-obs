# Plan: Add Loading Skeleton to Task View (Timeline)

## Goal
Replace the simple spinner in `TimelineView` (used in Projects > Tasks) with a proper loading skeleton that mirrors the calendar grid structure.

## Context
- `TimelineView` is a Client Component using `useTasks` hook.
- Currently uses `isLoading` check to show a simple `Loader2`.
- Needs to render a grid of skeleton blocks to reduce layout shift and improve UX.

## Steps

### 1. Create Skeleton Component
- [x] Create `components/timeline-skeleton.tsx`.
- [x] Structure it to match `TimelineView`'s grid:
    - 7-column grid headers.
    - 7-column grid body with placeholder task bars.
    - Use `components/ui/skeleton.tsx`.

### 2. Integrate into TimelineView
- [x] Import `TimelineSkeleton` in `components/timeline-view.tsx`.
- [x] Replace the `isLoading` spinner block with `<TimelineSkeleton />`.
- [x] Ensure it sits within the existing layout containers (e.g., inside the scrollable area).

## Verification
- [x] Inspect the Task View (Projects -> Tasks) to see the skeleton during data load.
- [x] Verify no layout shifts when data appears.