import { config } from 'dotenv';
config({ path: '.env' });

import { db } from '../db';
import { users, projects, tasks, usersToTasks } from '../db/schema';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('Seeding database...');

  try {
    // Clear existing data
    console.log('Clearing tables...');
    await db.delete(usersToTasks);
    await db.delete(tasks);
    await db.delete(projects);
    await db.delete(users);

    // Insert Users
    console.log('Inserting users...');
    const insertedUsers = await db.insert(users).values([
      { name: 'Alice Johnson', email: 'alice@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=alice' },
      { name: 'Bob Smith', email: 'bob@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=bob' },
      { name: 'Charlie Brown', email: 'charlie@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=charlie' },
    ]).returning();

    // Insert Projects
    console.log('Inserting projects...');
    const insertedProjects = await db.insert(projects).values([
      { name: 'Website Redesign', description: 'Overhaul the company website', color: '#3b82f6' },
      { name: 'Mobile App', description: 'Develop iOS and Android apps', color: '#10b981' },
    ]).returning();
    console.log('Project IDs:', insertedProjects.map(p => p.id));

    // Insert Tasks
    console.log('Inserting tasks...');
    const insertedTasks = await db.insert(tasks).values([
      {
        title: 'Design Homepage',
        description: 'Create mockups for the new homepage',
        projectId: insertedProjects[0].id,
        priority: 'high',
        status: 'done',
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),   // 2 days ago
        progress: 100
      },
      {
        title: 'Develop API',
        description: 'Setup backend API endpoints',
        projectId: insertedProjects[1].id,
        priority: 'medium',
        status: 'in_progress',
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),   // 5 days from now
        progress: 50
      },
      {
        title: 'QA Testing',
        description: 'Test all features',
        projectId: insertedProjects[1].id,
        priority: 'low',
        status: 'todo',
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        progress: 0
      }
    ]).returning();

    // Assign Users to Tasks
    console.log('Assigning users to tasks...');
    await db.insert(usersToTasks).values([
      { userId: insertedUsers[0].id, taskId: insertedTasks[0].id },
      { userId: insertedUsers[1].id, taskId: insertedTasks[1].id },
      { userId: insertedUsers[2].id, taskId: insertedTasks[1].id },
    ]);

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();
