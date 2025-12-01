import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { projectMembers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ message: "Not logged in" });
    }

    const memberships = await db.query.projectMembers.findMany({
        where: eq(projectMembers.userId, session.user.id)
    });

    return NextResponse.json({
        user: session.user,
        memberships
    });
}
