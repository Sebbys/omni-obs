"use server"

import { sendEmail } from "@/lib/email"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function sendTestEmail(to: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            throw new Error("Unauthorized")
        }

        const result = await sendEmail({
            to,
            subject: "Test Email from Mist Umbra",
            template: {
                type: 'task-assignment', // Reusing existing template for test
                props: {
                    assigneeName: session.user.name,
                    taskTitle: "Test Task",
                    projectName: "Test Project",
                    taskUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
                }
            }
        })

        if (!result.success) {
            throw new Error("Failed to send email")
        }

        return { success: true }
    } catch (error) {
        console.error("Failed to send test email:", error)
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
}
