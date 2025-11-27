# Plan: Project Features & Build Fixes

## 1. Fix Build Error (reports-view.tsx)
**Problem:** The build is failing for `reports-view.tsx`.
**Investigation:**
- `hooks/use-tasks` defines `status` as `"todo" | "in_progress" | "review" | "done"`.
- `reports-view.tsx` uses `t.status === "done"`. This is correct.
- **Potential Issue:** Import mismatch for `Select` or `Card` components, or TypeScript strict null checks on `tasks`.
**Action:**
- Verify exports of `components/ui/select.tsx` and `card.tsx`.
- Add defensive checks for `tasks` and explicit typing if needed.

## 2. Feature Implementation: Project Details (ToDo & Changelog)
**Goal:** Add "To Do List" and "Changelog" for each project, plus "many more" (extensible tabs).

### 2.1 Database Schema (`db/schema.ts`)
- **New Table:** `project_todos`
  - `id` (uuid, pk)
  - `projectId` (uuid, fk -> projects.id)
  - `content` (text)
  - `completed` (boolean)
  - `createdAt`
- **New Table:** `project_changelogs`
  - `id` (uuid, pk)
  - `projectId` (uuid, fk -> projects.id)
  - `version` (text, e.g., "v1.0")
  - `title` (text)
  - `content` (text)
  - `date` (timestamp)

### 2.2 Server Actions (`app/actions/project-features.ts`)
- `getProjectTodos(projectId)`
- `createProjectTodo(projectId, content)`
- `toggleProjectTodo(todoId)`
- `deleteProjectTodo(todoId)`
- `getProjectChangelogs(projectId)`
- `createProjectChangelog(projectId, data)`

### 2.3 UI Architecture (`app/projects/[id]/page.tsx`)
- **Route:** Dynamic route for project details.
- **Component:** `ProjectDetailView` (new component).
- **Layout:**
  - Header: Project Name, Description, Status.
  - Tabs (using `components/ui/tabs`):
    1.  **Overview:** Stats, burndown (future).
    2.  **Tasks:** Filtered `TimelineView` or `ListView`.
    3.  **To-Dos:** `ProjectTodoList` component (new).
    4.  **Changelog:** `ProjectChangelog` component (new).
    5.  **Settings:** Edit project details.

### 2.4 Components
- `ProjectTodoList`: List of checkboxes, "Add Item" input.
- `ProjectChangelog`: Vertical timeline of version history.

## 3. Execution Steps
1.  **Fix `reports-view.tsx`** immediately.
2.  **Update Schema** and push to DB (requires `drizzle-kit push` or similar - careful with production, we will just update schema file and run migration script if possible, or just update schema for now).
3.  **Create Actions.**
4.  **Implement UI Components.**
5.  **Create Dynamic Route.**