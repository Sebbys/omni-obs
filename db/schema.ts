import { pgTable, text, timestamp, uuid, pgEnum, integer, primaryKey, boolean, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high']);
export const statusEnum = pgEnum('status', ['todo', 'in_progress', 'review', 'done']);

// Users Table (Better Auth Compatible)
export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull(),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  role: text('role'), // For Better Auth Admin Plugin
  banned: boolean('banned'), // For Better Auth Admin Plugin
  banReason: text('banReason'), // For Better Auth Admin Plugin
  banExpires: timestamp('banExpires'), // For Better Auth Admin Plugin
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => users.id),
});

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => users.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  expiresAt: timestamp("expiresAt"),
  password: text("password"),
});

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
});

// Projects Table
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  color: text('color').default('#000000'), // Default color
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const todoCategoryEnum = pgEnum('todo_category', ['bug', 'feature', 'enhancement', 'documentation', 'design', 'other']);

// Project Todos Table
export const projectTodos = pgTable('project_todos', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  completed: boolean('completed').default(false).notNull(), // Kept for backward compatibility, sync with status
  status: statusEnum('status').default('todo').notNull(),
  category: todoCategoryEnum('category').default('other').notNull(),
  priority: priorityEnum('priority').default('medium').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ([
  index('project_todos_project_id_idx').on(t.projectId),
  index('project_todos_status_idx').on(t.status),
  index('project_todos_category_idx').on(t.category),
]));

// Project Changelogs Table
export const projectChangelogs = pgTable('project_changelogs', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  version: text('version').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  date: timestamp('date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tasks Table
export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  priority: priorityEnum('priority').default('medium').notNull(),
  status: statusEnum('status').default('todo').notNull(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  progress: integer('progress').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ([
  index('tasks_project_id_idx').on(t.projectId),
  index('tasks_status_idx').on(t.status),
  index('tasks_priority_idx').on(t.priority),
]));

// Users <-> Tasks Junction Table
export const usersToTasks = pgTable('users_to_tasks', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
}, (t) => ([

  primaryKey({ columns: [t.userId, t.taskId] }),
  index('users_to_tasks_task_id_idx').on(t.taskId),
]
));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(usersToTasks),
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  tasks: many(tasks),
  todos: many(projectTodos),
  changelogs: many(projectChangelogs),
}));

export const projectTodosRelations = relations(projectTodos, ({ one }) => ({
  project: one(projects, {
    fields: [projectTodos.projectId],
    references: [projects.id],
  }),
}));

export const projectChangelogsRelations = relations(projectChangelogs, ({ one }) => ({
  project: one(projects, {
    fields: [projectChangelogs.projectId],
    references: [projects.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  assignees: many(usersToTasks),
}));

export const usersToTasksRelations = relations(usersToTasks, ({ one }) => ({
  user: one(users, {
    fields: [usersToTasks.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [usersToTasks.taskId],
    references: [tasks.id],
  }),
}));
