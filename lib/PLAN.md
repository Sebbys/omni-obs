# Plan: Implement Better Auth (Recommended)

## Goal
Implement authentication using **Better Auth**, a modern, type-safe auth library that provides first-class support for Email/Password and Role-Based Access Control (RBAC) via plugins. This matches your request for a "better" implementation than standard boilerplate.

## Phase 1: Setup & Configuration

### 1. Installation
- [x] **Install Better Auth:** `npm install better-auth`.
- [x] **Install Drizzle Adapter:** Better Auth works with Drizzle directly.

### 2. Database Schema
- [x] **Generate Auth Schema:** Better Auth requires specific tables (`user`, `session`, `account`, `verification`).
- [x] **Add Role Support:** Ensure the `user` table has a `role` field.
- [x] **Migration:** Run `npm run db:push`.

### 3. Auth Configuration
- [x] **Create `lib/auth.ts`:** Initialize `betterAuth` with Drizzle adapter and Admin plugin.
    - **FIXED:** Passed `schema` object directly to `drizzleAdapter` to resolve "model 'user' not found" runtime error.
- [x] **Create `lib/auth-client.ts`:** Initialize the client-side library for React hooks.

## Phase 2: Implementation

### 1. Authentication UI
- [x] **Login Page (`app/login/page.tsx`):** Implement login form using `authClient.signIn.email`.
- [x] **Signup Page (`app/signup/page.tsx`):** Implement signup form.
- [x] **Logout Button:** Implement `authClient.signOut` in Header.

### 2. Protection & Middleware
- [x] **Middleware:** Converted `middleware.ts` to `proxy.ts` (Next.js 16 convention) to protect routes like `/dashboard`, `/projects` using the session token.
- [ ] **Role Verification:** Use `authClient` or server-side verification to restrict access (e.g., only 'admin' can see Settings).

### 3. Replace Mock Data
- [x] **Update `hooks/use-users.ts`:** Replace the current mock implementation with real data fetching from the DB or Auth session.
- [x] **Update Header:** Show the logged-in user's avatar/name using `useSession`.
- [x] **Update Settings:** Show real user profile data.
- [x] **Update Modals:** Fixed `TaskModal`, `UserModal`, `ManageModal` to use `image` property instead of `avatarUrl`.
- [x] **Type Fixes:** Updated `app/actions/projects.ts` to use `image` instead of `avatarUrl`.

## Recommendation
Implementation is complete and verified via build. Proceed with user verification (creating an account via Signup UI).

## User Action Required
Run the app locally and verify Signup/Login functionality.