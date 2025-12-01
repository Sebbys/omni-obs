import { config } from 'dotenv';
config({ path: '.env' });
import { db } from '../db';
import { users, projectMembers, projects } from '../db/schema';

async function debugDb() {
    console.log("--- Users ---");
    const allUsers = await db.select().from(users);
    allUsers.forEach(u => console.log(`${u.id} (${u.name})`));

    console.log("\n--- Projects ---");
    const allProjects = await db.select().from(projects);
    allProjects.forEach(p => console.log(`${p.id} (${p.name})`));

    console.log("\n--- Project Members ---");
    const allMembers = await db.select().from(projectMembers);
    allMembers.forEach(m => console.log(`Project: ${m.projectId}, User: ${m.userId}, Role: ${m.role}`));
}

debugDb().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
