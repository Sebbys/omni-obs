import React from 'react';

export const OctopusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        {/* Stylized Pixelated/Retro Octopus/Brain Shape */}
        <path
            d="M30 20 H70 V30 H80 V40 H90 V70 H80 V80 H70 V90 H60 V80 H40 V90 H30 V80 H20 V70 H10 V40 H20 V30 H30 Z"
            fill="currentColor"
            fillOpacity="0.2"
        />
        <path
            d="M35 25 H65 V35 H75 V45 H85 V65 H75 V75 H65 V85 H55 V75 H45 V85 H35 V75 H25 V65 H15 V45 H25 V35 Z"
            fill="currentColor"
        />
        {/* Eyes */}
        <rect x="35" y="45" width="10" height="10" fill="#120822" />
        <rect x="55" y="45" width="10" height="10" fill="#120822" />
    </svg>
);

export const PixelCorner: React.FC<{ className?: string, rotate?: number }> = ({ className, rotate = 0 }) => (
    <svg
        className={className}
        style={{ transform: `rotate(${rotate}deg)` }}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
    >
        <rect x="0" y="0" width="4" height="20" fill="currentColor" />
        <rect x="4" y="0" width="4" height="4" fill="currentColor" />
        <rect x="8" y="0" width="12" height="4" fill="currentColor" />
    </svg>
);

export const LoadingPixel: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="2" y="2" width="8" height="8" fill="currentColor" className="animate-[pulse_1s_ease-in-out_infinite]" />
        <rect x="14" y="2" width="8" height="8" fill="currentColor" className="animate-[pulse_1s_ease-in-out_0.2s_infinite]" />
        <rect x="14" y="14" width="8" height="8" fill="currentColor" className="animate-[pulse_1s_ease-in-out_0.4s_infinite]" />
        <rect x="2" y="14" width="8" height="8" fill="currentColor" className="animate-[pulse_1s_ease-in-out_0.6s_infinite]" />
    </svg>
);