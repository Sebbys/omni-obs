import { db } from "../db"
import { projects } from "../db/schema"

async function main() {
    const project = await db.query.projects.findFirst()
    if (project) {
        console.log(`Project ID: ${project.id}`)
    } else {
        console.log("No projects found")
    }
    process.exit(0)
}

main()
