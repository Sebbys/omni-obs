# Next Session TODOs

## Goal: Implement Real Authentication & Notifications

### 1. Database & Auth Setup
- [x] **Schema Update:** Updated `db/schema.ts` with `user` (Better Auth), `session`, `account`, `verification` tables.
- [x] **Reset & Seed:** Created `scripts/reset.ts` and updated `scripts/seed.ts` to handle Better Auth schema (UUIDs, roles).
- [ ] **Execute Reset:** Run `npm run db:reset` (or `npx tsx scripts/reset.ts`) locally to drop all tables.
- [ ] **Execute Push:** Run `npm run db:push` locally to apply the new schema.
- [ ] **Execute Seed:** Run `npm run db:seed` locally to populate users and projects.

### 2. Authentication UI (Better Auth)
- [ ] **Login Page (`app/login/page.tsx`):** Implement login form using `authClient.signIn.email`.
- [ ] **Signup Page (`app/signup/page.tsx`):** Implement signup form.
- [ ] **Middleware:** Create `middleware.ts` to protect `/dashboard` and other routes.

### 3. Notifications System
- [ ] **Schema:** Add `notifications` table to `db/schema.ts`.
- [ ] **Backend:** Actions for fetching/marking notifications.
- [ ] **Frontend:** Real-time or polling notification UI.

### 4. Cleanup
- [ ] **Remove Old Auth:** Deprecate any remaining `useUsers` mock logic in favor of `useSession`.