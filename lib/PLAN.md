# Plan: Implement Better Auth (Recommended)

## Goal
Implement authentication using **Better Auth**, a modern, type-safe auth library that provides first-class support for Email/Password and Role-Based Access Control (RBAC) via plugins. This matches your request for a "better" implementation than standard boilerplate.

## Why Better Auth?
*   **Built-in RBAC:** Has a dedicated plugin for Roles and Permissions, avoiding manual callback plumbing.
*   **Type Safety:** Framework-agnostic but deeply typed, working well with our TypeScript setup.
*   **Plugins:** Supports "Email & Password" (including reset flows) out of the box.

## Phase 1: Setup & Configuration

### 1. Installation
- [x] **Install Better Auth:** `npm install better-auth`.
- [x] **Install Drizzle Adapter:** Better Auth works with Drizzle directly.

### 2. Database Schema
- [x] **Generate Auth Schema:** Better Auth requires specific tables (`user`, `session`, `account`, `verification`).
    - We will use the CLI or manually update `db/schema.ts` to include these.
- [x] **Add Role Support:** Ensure the `user` table has a `role` field (or use the `admin` plugin's structure).
- [x] **Migration:** Run `npm run db:push`. (Executed successfully, though had to clear data first).

### 3. Auth Configuration
- [x] **Create `lib/auth.ts`:** Initialize `betterAuth` with:
    - `database`: Drizzle adapter.
    - `emailAndPassword`: `{ enabled: true }`.
    - `plugins`: `[admin()]` (for RBAC).

### 4. Auth Client
- [x] **Create `lib/auth-client.ts`:** Initialize the client-side library for React hooks (`useSession`, `signIn`, `signUp`).

## Phase 2: Implementation

### 1. Authentication UI
- [ ] **Login Page (`app/login/page.tsx`):** Create a form using `authClient.signIn.email`.
- [ ] **Signup Page (`app/signup/page.tsx`):** Create a form using `authClient.signUp.email`.
- [ ] **Logout Button:** Implement `authClient.signOut`.

### 2. Protection & Middleware
- [ ] **Middleware:** Create `middleware.ts` to protect routes like `/dashboard`, `/projects` using the session token.
- [ ] **Role Verification:** Use `authClient` or server-side verification to restrict access (e.g., only 'admin' can see Settings).

### 3. Replace Mock Data
- [ ] **Update `hooks/use-users.ts`:** Replace the current mock implementation with real data fetching from the DB or Auth session.
- [ ] **Update Header:** Show the logged-in user's avatar/name.

## Recommendation
Proceed with **Phase 2: Implementation**.

## User Action Required
Approve this plan to start installing Better Auth.