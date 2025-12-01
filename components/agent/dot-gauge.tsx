
import React, { useMemo } from 'react';
import { MAX_DOTS_COLUMNS, MAX_DOTS_ROWS } from './constants';

interface DotGaugeProps {
    progress: number; // 0 to 100
    activeColor?: string;
    inactiveColor?: string;
    isWorking?: boolean;
}

export const DotGauge: React.FC<DotGaugeProps> = ({
    progress,
    activeColor = "bg-jules-orange",
    inactiveColor = "bg-jules-dim",
    isWorking = false
}) => {
    // We fill based on columns now, so each row acts in unison
    const activeCols = Math.ceil((progress / 100) * MAX_DOTS_COLUMNS);

    const dots = useMemo(() => {
        return Array.from({ length: MAX_DOTS_ROWS * MAX_DOTS_COLUMNS }).map((_, i) => {
            // Calculate which column this dot belongs to
            const colIndex = i % MAX_DOTS_COLUMNS;

            // If this column index is less than the active count, it's lit
            const isActive = colIndex < activeCols;
            const isLeading = colIndex === activeCols - 1;

            // The leading column pulses if the agent is working
            // We animate the whole column edge
            const animationClass = (isActive && isLeading && isWorking) ? 'animate-pulse brightness-150' : '';

            return (
                <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-[1px] transition-all duration-75 ${isActive ? activeColor : inactiveColor
                        } ${animationClass}`}
                />
            );
        });
    }, [activeCols, activeColor, inactiveColor, isWorking]);

    return (
        <div
            className="grid gap-[3px]"
            style={{
                gridTemplateColumns: `repeat(${MAX_DOTS_COLUMNS}, minmax(0, 1fr))`
            }}
        >
            {dots}
        </div>
    );
};
