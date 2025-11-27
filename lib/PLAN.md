# Plan: DevEx Improvements & High-Impact Features

## Goal
Implement a roadmap to "verify the app faster" (DevEx/QA) and implement "rewarding" high-impact features.

## Phase 1: Velocity & Verification Foundation
*Focus: "Verify the app faster and implement faster"*

### 1. End-to-End (E2E) Testing Setup
- [x] **Install Playwright:** Setup Playwright for reliable, fast browser testing.
- [x] **Critical Path Tests:** Write initial tests for:
    - [x] Creating a Project.
    - [x] Task Kanban Drag & Drop (verifies the new optimistic UI).
- [x] **CI Integration:** Add a `test` script to `package.json` to run before builds.

### 2. Unit Testing Setup
- [ ] **Install Vitest:** Lighter and faster than Jest, perfect for Vite/Next environments.
- [ ] **Logic Tests:** Test utility functions (e.g., date helpers in `lib/utils.ts` or hook logic).

### 3. Database Seeding
- [x] **Enhance Seed Script:** Ensure `scripts/seed.ts` generates a rich, realistic dataset (5 projects, 20 tasks, 5 users) so developers don't waste time manually creating data to test UI.
- [x] **Update package.json:** Add a `db:seed` script.

## Phase 2: Rewarding High-Impact Features
*Focus: "Most possible and rewarding implementations"*

### 1. Interactive Dashboard (Visual Reward)
- [x] **Real Charts:** Replace the placeholder "Chart visualization coming soon" in `ReportsView` and `DashboardView` with real `recharts` components.
    - [x] `ActivityChart` (Line)
    - [x] `StatusPieChart` (Pie)
    - [x] `PriorityBarChart` (Bar)
- [ ] **Data Integration:** aggregated data from `projects` and `tasks` tables (e.g., "Tasks Completed vs Pending", "Project Progress"). (Done via client-side aggregation in charts).

### 2. Real Authentication (Security Reward)
- [ ] **Integrate NextAuth.js (v5):** Currently, the app uses a mock-like `useUsers` hook.
- [ ] **Schema Update:** Add `accounts`, `sessions` tables to `db/schema.ts`.
- [ ] **GitHub/Google Provider:** Enable real login to secure the app.

### 3. Real-time / Persistent Notifications
- [ ] **Notification System:** Implement the backend for the placeholder `NotificationsView`.
- [ ] **Triggers:** Auto-create notifications when a user is assigned a task or a task status changes.

### 4. Task Details & Collaboration
- [ ] **Rich Text Description:** Upgrade task description to a rich text editor (e.g., TipTap).
- [ ] **Comments:** Add a `comments` table and UI to tasks for team collaboration.

## Recommendation for Immediate Next Step
Start with **Phase 2, Step 2 (Real Authentication)**. Now that the app looks good with charts, making it secure and multi-user ready is the next logical step.

## User Action Required
Approve this plan to proceed with the NextAuth.js implementation.