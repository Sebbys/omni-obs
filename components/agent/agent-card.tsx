import React from 'react';
import { Agent, SubAgent } from '../agent/types';
import { DotGauge } from './dot-gauge';
import { LoadingPixel, PixelCorner } from './icons';

interface AgentCardProps {
    agent: Agent;
}

const SubAgentNode: React.FC<{ sub: SubAgent; isLast: boolean }> = ({ sub, isLast }) => (
    <div className="relative pl-6 pb-2">
        {/* Tech Connector Lines (Circuit Trace Style) */}
        {/* Vertical Line */}
        <div className={`absolute left-[11px] top-0 w-px bg-white/10 ${isLast ? 'h-[14px]' : 'h-full'}`} />
        {/* Horizontal Line */}
        <div className="absolute left-[11px] top-[14px] w-4 h-px bg-white/10" />
        {/* Joint Dot */}
        <div
            className={`absolute left-[9px] top-[12px] w-[5px] h-[5px] rounded-full z-10 transition-all duration-500 ${sub.status === 'active'
                ? 'bg-jules-purple border border-jules-purple shadow-[0_0_6px_currentColor] animate-pulse'
                : 'bg-jules-bg border border-white/20'
                }`}
        />

        {/* Node Card */}
        <div className="flex items-center justify-between bg-white/[0.02] border border-dashed border-white/10 px-3 py-1.5 hover:bg-white/[0.04] hover:border-white/20 transition-all group/node">
            <div className="flex items-center gap-3">
                {/* Status LED */}
                <div className={`w-1.5 h-1.5 ${sub.status === 'active' ? 'bg-jules-purple shadow-[0_0_5px_currentColor]' : 'bg-white/20'}`} />
                <div className="flex flex-col">
                    <span className="text-[10px] text-white/70 font-mono leading-none group-hover/node:text-white transition-colors">
                        {sub.name}
                    </span>
                    <span className="text-[8px] text-white/30 font-mono leading-none mt-1">
                        TID: {Math.floor(Math.random() * 900) + 100}
                    </span>
                </div>
            </div>
            <div className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${sub.status === 'active' ? 'text-jules-accent bg-jules-accent/10' : 'text-white/20'}`}>
                {sub.action}
            </div>
        </div>
    </div>
);

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
    const isComplete = agent.status === 'complete';
    const hasSubAgents = agent.subAgents && agent.subAgents.length > 0;

    return (
        <div className="group relative bg-[#0d0616] border border-white/10 p-1 transition-all duration-300 hover:border-jules-accent/30 hover:shadow-[0_0_20px_rgba(110,68,255,0.05)]">

            {/* Decorative Corners */}
            <div className="absolute -top-px -left-px text-white/20 group-hover:text-jules-accent/50 transition-colors">
                <PixelCorner />
            </div>
            <div className="absolute -top-px -right-px text-white/20 group-hover:text-jules-accent/50 transition-colors">
                <PixelCorner rotate={90} />
            </div>
            <div className="absolute -bottom-px -left-px text-white/20 group-hover:text-jules-accent/50 transition-colors">
                <PixelCorner rotate={270} />
            </div>
            <div className="absolute -bottom-px -right-px text-white/20 group-hover:text-jules-accent/50 transition-colors">
                <PixelCorner rotate={180} />
            </div>

            <div className="p-4 flex flex-col h-full relative z-10">

                {/* --- HEADER: Model Info --- */}
                <div className="flex items-start justify-between mb-4 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 flex items-center justify-center border border-current ${isComplete ? 'text-green-500 border-green-500/50' : 'text-jules-orange border-jules-orange/50'}`}>
                            <div className={`w-1.5 h-1.5 bg-current ${!isComplete && 'animate-pulse'}`} />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-white tracking-widest font-mono">
                                {agent.name}
                            </h3>
                            <div className="flex gap-3 text-[9px] text-white/40 font-mono mt-0.5">
                                <span>REQ:{agent.reqId}</span>
                                <span className="text-jules-accent/70">{agent.model}</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-[10px] text-white/50 font-mono">TOKENS</div>
                        <div className="text-xs text-white font-mono tracking-wider">
                            {Math.floor(agent.totalTokens).toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* --- BODY: Task & Logs --- */}
                <div className="mb-4">
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="text-[10px] text-white/30 font-mono uppercase tracking-wider">Current Inference</span>
                        <span className="text-[10px] font-mono text-white/30">
                            {isComplete ? '100%' : `${Math.floor(agent.progress)}%`}
                        </span>
                    </div>
                    <div className="text-sm text-white/90 font-mono truncate mb-3">
                        {agent.task}
                    </div>

                    {/* Terminal Log Output */}
                    <div className="bg-black/40 border border-white/5 p-2 rounded-sm font-mono text-[10px] h-8 flex items-center overflow-hidden">
                        {isComplete ? (
                            <span className="text-green-500 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                Response synthesized successfully.
                            </span>
                        ) : (
                            <span className="text-jules-text/70 flex items-center gap-2 animate-flicker">
                                <span className="text-jules-orange">➜</span>
                                {agent.currentLog}
                            </span>
                        )}
                    </div>
                </div>

                {/* --- SUB-AGENTS: Logic Tree --- */}
                {hasSubAgents && (
                    <div className="flex-1 mb-4">
                        <div className="text-[9px] text-white/30 font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
                            <span className="w-1 h-1 bg-white/30" />
                            Inference Pipeline
                        </div>
                        <div className="relative ml-1">
                            {/* Main Trunk Line */}
                            <div className="absolute left-[11px] -top-2 bottom-4 w-px bg-gradient-to-b from-white/10 via-white/10 to-transparent" />

                            <div className="flex flex-col">
                                {agent.subAgents.map((sub, idx) => (
                                    <SubAgentNode
                                        key={sub.id}
                                        sub={sub}
                                        isLast={idx === agent.subAgents.length - 1}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- FOOTER: Load Gauge --- */}
                <div className="mt-auto pt-2">
                    <DotGauge
                        progress={isComplete ? 100 : agent.computeLoad}
                        activeColor={isComplete ? "bg-green-500" : "bg-jules-orange"}
                        inactiveColor="bg-white/5"
                        isWorking={!isComplete}
                    />
                    <div className="flex items-center justify-between mt-1.5">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-mono text-white/20">LOAD</span>
                                <span className="text-[9px] font-mono text-white/40">
                                    {isComplete ? '0.00' : (agent.computeLoad / 100).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-mono text-white/20">SPEED</span>
                            <span className={`text-[9px] font-mono ${isComplete ? 'text-white/40' : 'text-jules-accent'}`}>
                                {isComplete ? '0' : Math.floor(agent.tps)} T/s
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Background Grid Scanlines */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                }}
            />
        </div>
    );
};