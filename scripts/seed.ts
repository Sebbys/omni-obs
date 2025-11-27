import { config } from 'dotenv';
config({ path: '.env' });

import { db } from '../db';
import { users, projects, tasks, usersToTasks, projectTodos, projectChangelogs } from '../db/schema';
import { addDays, subDays } from 'date-fns';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Clear existing data
    console.log('🧹 Clearing tables...');
    await db.delete(usersToTasks);
    await db.delete(tasks);
    await db.delete(projectTodos);
    await db.delete(projectChangelogs);
    await db.delete(projects);
    await db.delete(users);

    // Insert Users
    console.log('👤 Inserting users...');
    const insertedUsers = await db.insert(users).values([
      { name: 'Alice Johnson', email: 'alice@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=alice' },
      { name: 'Bob Smith', email: 'bob@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=bob' },
      { name: 'Charlie Brown', email: 'charlie@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=charlie' },
      { name: 'Diana Prince', email: 'diana@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=diana' },
      { name: 'Evan Wright', email: 'evan@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=evan' },
    ]).returning();

    // Insert Projects
    console.log('🚀 Inserting projects...');
    const insertedProjects = await db.insert(projects).values([
      { name: 'Website Redesign', description: 'Overhaul the company website with modern UI/UX.', color: '#3b82f6' }, // Blue
      { name: 'Mobile App', description: 'Develop iOS and Android apps for the new platform.', color: '#10b981' }, // Emerald
      { name: 'Marketing Campaign', description: 'Q3 Marketing push and social media strategy.', color: '#f59e0b' }, // Amber
      { name: 'Infrastructure Migration', description: 'Migrate legacy servers to the cloud.', color: '#6366f1' }, // Indigo
      { name: 'Internal Dashboard', description: 'Build analytics dashboard for the sales team.', color: '#ec4899' }, // Pink
    ]).returning();

    const allTasks = [];
    const allProjectTodos = [];
    const allChangelogs = [];

    // Helper to pick random user
    const getRandomUser = () => insertedUsers[Math.floor(Math.random() * insertedUsers.length)];
    const getRandomUsers = (count: number) => {
      const shuffled = [...insertedUsers].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    // Generate Tasks for each project
    console.log('📋 Inserting tasks...');
    for (const project of insertedProjects) {
      // Generate ~5-7 tasks per project
      const taskCount = 5 + Math.floor(Math.random() * 3);

      for (let i = 0; i < taskCount; i++) {
        const status = ['todo', 'in_progress', 'review', 'done'][Math.floor(Math.random() * 4)] as any;
        const priority = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any;

        const startDate = subDays(new Date(), Math.floor(Math.random() * 10));
        const endDate = addDays(startDate, 2 + Math.floor(Math.random() * 14));

        let progress = 0;
        if (status === 'done') progress = 100;
        else if (status === 'in_progress') progress = Math.floor(Math.random() * 80) + 10;
        else if (status === 'review') progress = 90;

        allTasks.push({
          title: `${project.name} Task ${i + 1}`,
          description: `Detailed description for task ${i + 1} in ${project.name}. Needs to be completed by ${endDate.toDateString()}.`,
          projectId: project.id,
          priority,
          status,
          startDate,
          endDate,
          progress
        });
      }

      // Generate Todos (Kanban items not linked to dates yet?)
      // Schema has 'projectTodos' which seems to be the Kanban items specific table or separate list?
      // Actually PLAN.md mentions "Drag & Drop Kanban Card" verification.
      // Looking at KanbanBoard component, it uses 'getProjectTodos' which fetches 'projectTodos'.
      // Let's populate 'projectTodos' heavily for the Kanban test.

      const todoCount = 8;
      for (let i = 0; i < todoCount; i++) {
        const status = ['todo', 'in_progress', 'review', 'done'][Math.floor(Math.random() * 4)] as any;
        const category = ['bug', 'feature', 'enhancement', 'design'][Math.floor(Math.random() * 4)] as any;
        const priority = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any;

        allProjectTodos.push({
          projectId: project.id,
          content: `Kanban Item ${i + 1}: ${category} fix`,
          status,
          category,
          priority,
          completed: status === 'done'
        });
      }

      // Generate Changelog
      allChangelogs.push({
        projectId: project.id,
        version: 'v1.0.0',
        title: 'Initial Release',
        content: 'Project started.',
        date: subDays(new Date(), 30)
      });
    }

    const insertedTasksResult = await db.insert(tasks).values(allTasks).returning();
    await db.insert(projectTodos).values(allProjectTodos);
    await db.insert(projectChangelogs).values(allChangelogs);

    // Assign Users to Tasks
    console.log('🔗 Assigning users to tasks...');
    const userTaskPairs = [];
    for (const task of insertedTasksResult) {
      // Assign 1-3 users per task
      const assignees = getRandomUsers(1 + Math.floor(Math.random() * 2));
      for (const user of assignees) {
        userTaskPairs.push({ userId: user.id, taskId: task.id });
      }
    }
    await db.insert(usersToTasks).values(userTaskPairs);

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seed();