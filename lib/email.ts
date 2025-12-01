import { Resend } from "resend";
import { db } from "@/db";
import { emailLogs } from "@/db/schema";
import { render } from "@react-email/render";
import { TaskAssignmentEmail } from "@/emails/task-assignment";

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailTemplate =
    | { type: 'task-assignment'; props: React.ComponentProps<typeof TaskAssignmentEmail> };

export async function sendEmail({
    to,
    subject,
    template,
}: {
    to: string;
    subject: string;
    template: EmailTemplate;
}) {
    try {
        let html = '';
        if (template.type === 'task-assignment') {
            html = await render(TaskAssignmentEmail(template.props));
        }

        const data = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>", // Update this with your verified domain
            to: [to],
            subject: subject,
            html: html,
        });

        if (data.error) {
            console.error("Error sending email:", data.error);
            await db.insert(emailLogs).values({
                recipient: to,
                subject: subject,
                body: html,
                status: "failed",
                error: data.error.message,
                metadata: JSON.stringify(template),
            });
            return { success: false, error: data.error };
        }

        await db.insert(emailLogs).values({
            recipient: to,
            subject: subject,
            body: html,
            status: "sent",
            sentAt: new Date(),
            metadata: JSON.stringify(template),
        });

        return { success: true, data };
    } catch (error) {
        console.error("Exception sending email:", error);
        await db.insert(emailLogs).values({
            recipient: to,
            subject: subject,
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error",
            metadata: JSON.stringify(template),
        });
        return { success: false, error };
    }
}
