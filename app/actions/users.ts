"use server"

import { db } from "@/db"
import { users } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath, revalidateTag, cacheTag } from "next/cache"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"

async function getSession() {
  return await auth.api.getSession({
    headers: await headers()
  })
}

export async function getUsers() {
  "use cache"
  cacheTag("users")
  try {
    const session = await getSession()
    if (!session) return []

    const data = await db.select().from(users).orderBy(desc(users.createdAt))
    return data.map(u => ({
      ...u,
      createdAt: u.createdAt ? u.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: u.updatedAt ? u.updatedAt.toISOString() : new Date().toISOString(),
    }))
  } catch (error) {
    console.error("Failed to fetch users:", error)
    // Return empty array instead of throwing to prevent UI crash
    return []
  }
}

export async function createUser(data: { email: string; name: string; avatarUrl?: string }) {
  try {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    const [newUser] = await db.insert(users).values({
      id: crypto.randomUUID(),
      email: data.email,
      name: data.name,
      image: data.avatarUrl,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    revalidatePath("/users")
    return {
      ...newUser,
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("Failed to create user:", error)
    throw new Error("Failed to create user")
  }
}

export async function updateUser(id: string, data: { email?: string; name?: string; avatarUrl?: string }) {
  try {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    const [updatedUser] = await db.update(users)
      .set({
        email: data.email,
        name: data.name,
        image: data.avatarUrl,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning()

    revalidatePath("/users")
    return {
      ...updatedUser,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("Failed to update user:", error)
    throw new Error("Failed to update user")
  }
}

export async function deleteUser(id: string) {
  try {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    await db.delete(users).where(eq(users.id, id))
    revalidatePath("/users")
  } catch (error) {
    console.error("Failed to delete user:", error)
    throw new Error("Failed to delete user")
  }
}
