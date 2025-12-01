import React from 'react';

export const PixelDivider: React.FC = () => {
    return (
        <div className="w-full h-8 flex items-center justify-between opacity-30 select-none overflow-hidden my-8">
            {/* Left Blocks */}
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-jules-purple" />
                <div className="w-2 h-4 bg-jules-purple translate-y-2" />
                <div className="w-2 h-2 bg-jules-purple" />
                <div className="w-2 h-2 bg-jules-purple translate-y-[-4px]" />
            </div>

            {/* Center Line */}
            <div className="flex-1 mx-4 h-[2px] bg-gradient-to-r from-transparent via-jules-purple to-transparent border-t border-dashed border-jules-purple/50" />

            {/* Right Blocks */}
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-jules-purple translate-y-[-4px]" />
                <div className="w-2 h-2 bg-jules-purple" />
                <div className="w-2 h-4 bg-jules-purple translate-y-2" />
                <div className="w-2 h-2 bg-jules-purple" />
            </div>
        </div>
    );
};

export const HeaderBanner: React.FC = () => {
    return (
        <div className="w-full bg-[#1e1235] border-y border-white/5 p-8 relative overflow-hidden mb-12">

            {/* Decorative background grid pattern */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `radial-gradient(#6e44ff 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                }}>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between relative z-10 max-w-5xl mx-auto">
                {/* Step Number (Like Image 1) */}
                <div className="flex items-center gap-6">
                    <div className="relative w-16 h-16 flex items-center justify-center bg-jules-purple shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                        <span className="text-2xl font-bold text-white">4</span>
                        {/* Pixel Nubs on Box */}
                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-4 bg-[#120822]" />
                        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-4 bg-[#120822]" />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <p className="text-white text-lg md:text-xl font-medium tracking-tight">
                            Jules monitors the swarm.
                        </p>
                        <p className="text-jules-text/60 text-sm max-w-md">
                            Approve the PR, merge it to your branch, and publish it on GitHub.
                        </p>
                    </div>
                </div>

                {/* Right Side Action (Like Image 1) */}
                <div className="mt-6 md:mt-0 flex items-center bg-[#150a25] border border-white/10 px-4 py-3 rounded-sm">
                    <svg className="w-6 h-6 text-white mr-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span className="font-mono text-sm text-white/80">Publish Branch</span>
                </div>
            </div>
        </div>
    );
};
