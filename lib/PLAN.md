# Plan: Refine Loading Architecture

## Goal
Improve the loading experience by moving the `AppShell` to the root layout. This ensures the sidebar and header persist during navigation, preventing layout shifts and flickering. `loading.tsx` files will then only be responsible for the main content area skeletons.

## Steps

### 1. Refactor Layout
- [x] Modify `app/layout.tsx` to wrap `{children}` with `<AppShell>`.
- [x] Wrapped `AppShell` in `<Suspense fallback={<Loading />}>` to fix PPR "Uncached data accessed outside Suspense" error (caused by `usePathname` or other dynamic client hooks in `AppShell` interacting with PPR).

### 2. Clean Up Pages
Remove `<AppShell>` wrapper from the following pages, as it's now in the layout:
- [x] `app/page.tsx`
- [x] `app/projects/page.tsx`
- [x] `app/projects/[id]/page.tsx` (Also refactored for Suspense data fetching)
- [x] `app/calendar/page.tsx`
- [x] `app/team/page.tsx`
- [x] `app/reports/page.tsx`
- [x] `app/settings/page.tsx`
- [x] `app/help/page.tsx`
- [x] `app/notifications/page.tsx`

### 3. Clean Up Loading States
Remove `<AppShell>` wrapper from all `loading.tsx` files to avoid double-shelling and ensure atomic loading:
- [x] `app/projects/loading.tsx`
- [x] `app/projects/[id]/loading.tsx`
- [x] `app/calendar/loading.tsx`
- [x] `app/team/loading.tsx`
- [x] `app/reports/loading.tsx`
- [x] `app/settings/loading.tsx`

### 4. Refine Global Loading
- [x] Update `app/loading.tsx` to remove any layout assumptions if necessary, ensuring it fits within the content area of the Shell.

## Verification
- [x] Navigate between pages to verify the Sidebar and Header remain static.
- [x] Verify the loading skeletons appear *inside* the content area.
- [x] Build the project to ensure no structure violations. (Fixed PPR error by wrapping Shell in Suspense).