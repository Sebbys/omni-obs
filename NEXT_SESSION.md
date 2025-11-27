# Next Session TODOs

## Goal: Implement Real Authentication & Notifications

### 1. Authentication (NextAuth.js)
- [ ] **Install NextAuth.js (v5 beta/latest):** `npm install next-auth@beta`.
- [ ] **Schema Update:**
    - [ ] Add `accounts`, `sessions`, `verification_tokens` to `db/schema.ts` (Drizzle adapter compatible).
    - [ ] Run migration `db:push`.
- [ ] **Configuration:**
    - [ ] Create `auth.ts` (or `lib/auth.ts`).
    - [ ] Create `app/api/auth/[...nextauth]/route.ts`.
    - [ ] Configure `Google` and `GitHub` providers.
- [ ] **Middleware:** Protect routes (e.g., `/dashboard`, `/settings`) in `middleware.ts`.
- [ ] **UI Integration:**
    - [ ] Replace `useUsers` hook mock data with `useSession`.
    - [ ] Create a Login Page (`app/login/page.tsx`).
    - [ ] Update `Header` with User Menu (Sign Out).

### 2. Notifications System
- [ ] **Schema Update:** Add `notifications` table (`id`, `userId`, `title`, `message`, `read`, `type`, `createdAt`).
- [ ] **Backend:** Create Server Actions for `getNotifications`, `markAsRead`.
- [ ] **Frontend:**
    - [ ] Implement `NotificationsView` with real data.
    - [ ] Add "Toast" triggers for new notifications.

### 3. Maintenance
- [ ] **Verify E2E Tests:** Ensure Playwright tests pass with Auth enabled (might need test mode or mock auth).
