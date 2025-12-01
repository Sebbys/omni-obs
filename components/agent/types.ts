export interface SubAgent {
    id: string;
    name: string;
    action: string;
    status: 'active' | 'idle';
}

export interface Agent {
    id: string;
    name: string;
    task: string;
    status: 'working' | 'complete' | 'queued';
    progress: number; // 0 to 100 (Actual completion percentage)
    computeLoad: number; // 0 to 100 (Visual "gimmick" load for the gauge)
    timeRemaining: number; // in seconds
    speed: number; // progress increment per tick
    currentLog: string; // Dynamic status message
    subAgents: SubAgent[]; // Tree structure children

    // LLM Stats
    reqId: string; // Request ID
    model: string; // e.g. Gemini-1.5, GPT-4
    totalTokens: number; // Tokens generated so far
    tps: number; // Tokens per second (speed)
}