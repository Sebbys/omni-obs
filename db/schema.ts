import { pgTable, text, timestamp, uuid, pgEnum, integer, primaryKey, boolean, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high']);
export const statusEnum = pgEnum('status', ['todo', 'in_progress', 'review', 'done']);

// Users Table (Better Auth Compatible)
export const users = pgTable('user', {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("sessions_userId_idx").on(table.userId)],
);

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("accounts_userId_idx").on(table.userId)],
);

export const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verifications_identifier_idx").on(table.identifier)],
);

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
  users: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  users: one(users, {
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


