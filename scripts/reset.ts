import { config } from 'dotenv';
config({ path: '.env' });

import { db } from '../db';
import { sql } from 'drizzle-orm';

async function reset() {
  console.log('🧨 Nuke mode engaged: Dropping all tables...');

  try {
    // Force drop everything including cascades
    // We use sql directly because db.execute might be wrapped or limited depending on driver
    // But drizzle-orm's execute is usually fine.
    
    // Note: Neondb (serverless) might have restrictions on dropping public schema.
    // Alternate strategy: Drop individual tables in correct order if schema drop fails.
    // But let's try schema drop first as it's cleanest.
    
    // "DROP SCHEMA public CASCADE" removes everything in it.
    await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE;`);
    await db.execute(sql`CREATE SCHEMA public;`);
    await db.execute(sql`GRANT ALL ON SCHEMA public TO public;`);
    await db.execute(sql`COMMENT ON SCHEMA public IS 'standard public schema';`);

    console.log('✨ Database reset successfully. Ready for a fresh start.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
}

reset();