"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { sendTestEmail } from "@/app/actions/email-test"
import { Loader2, Mail } from "lucide-react"

export function EmailTestButton() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    async function handleSendTest() {
        if (!email) {
            toast.error("Please enter an email address")
            return
        }

        setIsLoading(true)
        try {
            const result = await sendTestEmail(email)
            if (result.success) {
                toast.success("Test email sent successfully")
            } else {
                toast.error("Failed to send test email: " + result.error)
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2 max-w-sm">
            <Input
                type="email"
                placeholder="Enter email for test"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleSendTest} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                Test Email
            </Button>
        </div>
    )
}
