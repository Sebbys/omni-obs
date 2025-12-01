
import { AgentSimulationView } from "@/components/agent/agent-simulation-view";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Agent Swarm | Mist Umbra",
    description: "Real-time visualization of the autonomous agent swarm.",
};

export default function AgentWorkflowPage() {
    return <AgentSimulationView />;
}
