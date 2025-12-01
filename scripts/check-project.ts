import { config } from 'dotenv';
config({ path: '.env' });
import { db } from '../db';
import { projects } from '../db/schema';
import { eq } from 'drizzle-orm';

async function checkProject() {
    const id = process.argv[2];
    if (!id) {
        console.log("Please provide a project ID");
        process.exit(1);
    }
    console.log(`Checking project ${id}...`);
    const project = await db.query.projects.findFirst({
        where: eq(projects.id, id)
    });
    if (project) {
        console.log("Project found:", project.name);
    } else {
        console.log("Project NOT found.");
    }
    process.exit(0);
}

checkProject();
