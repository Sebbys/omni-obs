
export const TASKS = [
    "Generating Chain of Thought",
    "Retrieving RAG Context",
    "Calculating Attention Masks",
    "Vector Embedding Search",
    "Safety Alignment Check",
    "Decoding Output Stream",
    "Fine-tuning LoRA Adapter",
    "Quantizing Weights (INT8)",
    "Prompt Cache Hydration",
    "Synthesizing Response",
    "Expanding Context Window",
    "Evaluating Hallucination Risk"
];

export const GENERAL_LOGS = [
    "Allocating KV cache...",
    "Loading model weights...",
    "Tokenizing input...",
    "Sampling top_k...",
    "Applying softmax...",
    "Context window filled...",
    "Garbage collecting tensors...",
    "Handshaking with GPU...",
    "Inference latency: 12ms",
    "Inference latency: 45ms",
    "Inference latency: 8ms",
    "Allocating VRAM...",
    "Model idle...",
    "Reading system prompt...",
    "Mounting weights..."
];

export const LOG_CATEGORIES: Record<string, string[]> = {
    CODE: [
        "Generating Python snippet...",
        "Parsing AST...",
        "Validating syntax...",
        "Refactoring code block...",
        "Checking imports...",
        "Formatting output...",
        "Detecting logic error...",
        "Optimizing loops...",
        "Generating unit tests..."
    ],
    AI: [
        "Adjusting temperature...",
        "Calculating loss...",
        "Normalizing logits...",
        "Epoch 42/100 complete...",
        "Gradient descent step...",
        "Optimizing weights...",
        "Attention head focus...",
        "Tokenizing stream...",
        "Vectorizing embeddings...",
        "Pruning neural weights..."
    ],
    NETWORK: [
        "Fetching context from DB...",
        "Rerouting via edge node...",
        "API Handshake success...",
        "Streaming chunk...",
        "Refreshing vector store...",
        "Establishing WS stream...",
        "Load balancing inference...",
        "Headers received...",
        "Payload decrypted..."
    ],
    DATA: [
        "Retrieving documents...",
        "Re-ranking search results...",
        "Sharding vector index...",
        "Sanitizing user input...",
        "Filtering PII...",
        "Embedding query...",
        "Query execution: 12ms...",
        "Parsing JSON schema...",
        "Compressing context..."
    ]
};

// Fallback for when specific categories aren't matched
export const AGENT_LOGS = GENERAL_LOGS;

export const SUB_ACTIONS = [
    "IDLE",
    "ATTN",
    "EMBED",
    "DECODE",
    "FETCH",
    "CACHE",
    "LOCK",
    "FREE",
    "MASK",
    "FORK",
    "EXEC"
];

export const MODELS = [
    "GEMINI-1.5-PRO",
    "GEMINI-1.5-FLASH",
    "LLAMA-3-70B",
    "MISTRAL-LARGE",
    "CLAUDE-3-OPUS",
    "GPT-4o-MINI"
];

export const MAX_DOTS_COLUMNS = 35;
export const MAX_DOTS_ROWS = 4;
export const TICK_RATE_MS = 100;