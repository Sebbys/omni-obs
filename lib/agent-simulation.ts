
import { Agent, SubAgent } from "@/components/agent/types";
import { TASKS, LOG_CATEGORIES, AGENT_LOGS, SUB_ACTIONS, MODELS } from "@/components/agent/constants";

// Configuration
const AGENT_COUNT = 6;
const TICK_RATE_MS = 100; // Time simulated per tick, not actual wall clock
const COMPLETION_THRESHOLD = 100;

// Helper to get random item
const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to generate a random ID
const generateId = () => Math.random().toString(36).substring(7);

// Helper to generate a random sub-agent
const generateSubAgent = (): SubAgent => ({
    id: generateId(),
    name: `NODE-${Math.floor(Math.random() * 900) + 100}`,
    action: random(SUB_ACTIONS),
    status: Math.random() > 0.7 ? 'active' : 'idle'
});

// Helper to generate a new agent
const createAgent = (): Agent => {
    const model = random(MODELS);
    return {
        id: generateId(),
        name: `AGENT-${Math.floor(Math.random() * 1000)}`,
        task: random(TASKS),
        status: 'working',
        progress: 0,
        computeLoad: Math.floor(Math.random() * 40) + 10,
        timeRemaining: Math.floor(Math.random() * 60) + 10,
        speed: Math.random() * 2 + 0.5,
        currentLog: "Initializing...",
        subAgents: Array.from({ length: Math.floor(Math.random() * 3) + 2 }).map(generateSubAgent),
        reqId: `REQ-${Math.floor(Math.random() * 10000)}`,
        model: model,
        totalTokens: 0,
        tps: Math.floor(Math.random() * 50) + 20
    };
};

// In-memory store (simulating a database/server state)
let agents: Agent[] = Array.from({ length: AGENT_COUNT }).map(createAgent);

// The "Server Action" or "API Endpoint"
export const fetchAgentState = async (): Promise<Agent[]> => {
    // Simulate network latency? Maybe a tiny bit to be realistic, but not strictly necessary for the visual
    // await new Promise(r => setTimeout(r, 50));

    // UPDATE STATE (The "Tick")
    agents = agents.map(agent => {
        if (agent.status === 'complete') {
            // Chance to reset/respawn
            if (Math.random() > 0.95) {
                return createAgent();
            }
            return agent;
        }

        // Update Progress
        let newProgress = agent.progress + (agent.speed * (Math.random() * 1.5));
        if (newProgress >= COMPLETION_THRESHOLD) {
            newProgress = 100;
        }

        // Update Tokens
        const newTokens = agent.totalTokens + (agent.tps / 10); // approx tokens per 100ms tick

        // Update Load (random fluctuation)
        const loadChange = (Math.random() - 0.5) * 10;
        let newLoad = Math.max(0, Math.min(100, agent.computeLoad + loadChange));

        // Update Logs
        let newLog = agent.currentLog;
        if (Math.random() > 0.8) {
            // Pick a category based on task keywords or just random
            const categoryKeys = Object.keys(LOG_CATEGORIES);
            const randomCat = random(categoryKeys);
            newLog = random(LOG_CATEGORIES[randomCat] || AGENT_LOGS);
        }

        // Update Sub-agents
        const newSubAgents = agent.subAgents.map(sub => ({
            ...sub,
            status: Math.random() > 0.8 ? (sub.status === 'active' ? 'idle' : 'active') : sub.status,
            action: Math.random() > 0.9 ? random(SUB_ACTIONS) : sub.action
        }));

        return {
            ...agent,
            status: newProgress >= 100 ? 'complete' : 'working',
            progress: newProgress,
            computeLoad: newLoad,
            totalTokens: newTokens,
            currentLog: newLog,
            subAgents: newSubAgents
        };
    });

    return agents;
};
