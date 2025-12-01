"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AgentCard } from './agent-card';
import { HeaderBanner, PixelDivider } from './pixel-decoration';
import { fetchAgentState } from '@/lib/agent-simulation';
import { TICK_RATE_MS } from './constants';

export const AgentSimulationView: React.FC = () => {
    const { data: agents } = useQuery({
        queryKey: ['agent-simulation'],
        queryFn: fetchAgentState,
        refetchInterval: TICK_RATE_MS,
        // Keep data fresh, don't cache too aggressively for this realtime-like view
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: false
    });

    return (
        <div className="min-h-screen bg-[#05020a] text-white font-sans selection:bg-jules-purple/30">
            <HeaderBanner />

            <div className="max-w-7xl mx-auto px-6 pb-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-mono font-bold tracking-tight flex items-center gap-3">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        ACTIVE AGENT SWARM
                    </h2>
                    <div className="text-xs font-mono text-white/40">
                        SYSTEM STATUS: <span className="text-green-400">OPTIMAL</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents?.map((agent) => (
                        <AgentCard key={agent.id} agent={agent} />
                    ))}
                    {!agents && (
                        // Loading Skeletons
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-[300px] bg-white/5 border border-white/10 animate-pulse rounded-sm" />
                        ))
                    )}
                </div>

                <PixelDivider />

                <div className="text-center text-[10px] text-white/20 font-mono">
                    MIST-UMBRA NEURAL INTERFACE v2.4.0 // CONNECTED TO HIVE MIND
                </div>
            </div>
        </div>
    );
};
