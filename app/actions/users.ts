"use server"

import { db } from "@/db"
import { users } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath, revalidateTag, cacheTag } from "next/cache"

export async function getUsers() {
  "use cache"
  cacheTag("users")
  try {
    const data = await db.select().from(users).orderBy(desc(users.createdAt))
    return data.map(u => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Failed to fetch users:", error)
    throw new Error("Failed to fetch users")
  }
}

export async function createUser(data: { email: string; name: string; avatarUrl?: string }) {
  try {
    const [newUser] = await db.insert(users).values({
      email: data.email,
      name: data.name,
      avatarUrl: data.avatarUrl,
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
    const [updatedUser] = await db.update(users)
      .set({
        ...data,
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
    await db.delete(users).where(eq(users.id, id))
    revalidatePath("/users")
  } catch (error) {
    console.error("Failed to delete user:", error)
    throw new Error("Failed to delete user")
  }
}
