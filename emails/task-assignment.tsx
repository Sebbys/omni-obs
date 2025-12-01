import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface TaskAssignmentEmailProps {
    assigneeName: string;
    taskTitle: string;
    projectName: string;
    taskUrl: string;
}

export const TaskAssignmentEmail = ({
    assigneeName,
    taskTitle,
    projectName,
    taskUrl,
}: TaskAssignmentEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>You have been assigned a new task: {taskTitle}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Text style={paragraph}>Hi {assigneeName},</Text>
                    <Text style={paragraph}>
                        You have been assigned to the task <strong>{taskTitle}</strong> in project{" "}
                        <strong>{projectName}</strong>.
                    </Text>
                    <Section style={btnContainer}>
                        <Button style={button} href={taskUrl}>
                            View Task
                        </Button>
                    </Section>
                    <Text style={paragraph}>
                        Best,
                        <br />
                        The Team
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default TaskAssignmentEmail;

const main = {
    backgroundColor: "#ffffff",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
};

const paragraph = {
    fontSize: "16px",
    lineHeight: "26px",
};

const btnContainer = {
    textAlign: "center" as const,
};

const button = {
    backgroundColor: "#5F51E8",
    borderRadius: "3px",
    color: "#fff",
    fontSize: "16px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "12px",
};
