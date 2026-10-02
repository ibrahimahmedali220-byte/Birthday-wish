import React from 'react';

interface IslamicPatternProps {
  className?: string;
  intensity?: 'subtle' | 'vibrant';
  size?: number;
}

export const IslamicPattern: React.FC<IslamicPatternProps> = ({
  className = '',
  intensity = 'subtle',
  size = 480,
}) => {
  const strokeColor = intensity === 'vibrant' ? 'rgba(250, 204, 21, 0.35)' : 'rgba(234, 179, 8, 0.15)';
  const secondaryStroke = intensity === 'vibrant' ? 'rgba(234, 179, 8, 0.25)' : 'rgba(234, 179, 8, 0.08)';

  return (
    <div
      className={`pointer-events-none select-none flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full animate-[spin_120s_linear_infinite]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="goldGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#eab308" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Central Ambient Glow */}
        <circle cx="100" cy="100" r="90" fill="url(#goldGlowGrad)" />

        {/* Outer Circular Rings */}
        <circle cx="100" cy="100" r="96" fill="none" stroke={secondaryStroke} strokeWidth="0.75" strokeDasharray="3,3" />
        <circle cx="100" cy="100" r="88" fill="none" stroke={strokeColor} strokeWidth="0.85" />
        <circle cx="100" cy="100" r="64" fill="none" stroke={strokeColor} strokeWidth="0.6" />
        <circle cx="100" cy="100" r="38" fill="none" stroke={secondaryStroke} strokeWidth="0.75" />

        {/* 8-Pointed Star (Rub el Hizb inspired geometric geometry) */}
        {/* First Square */}
        <rect
          x="50"
          y="50"
          width="100"
          height="100"
          fill="none"
          stroke={strokeColor}
          strokeWidth="0.9"
        />
        {/* Second Square rotated 45 deg */}
        <rect
          x="50"
          y="50"
          width="100"
          height="100"
          transform="rotate(45 100 100)"
          fill="none"
          stroke={strokeColor}
          strokeWidth="0.9"
        />

        {/* Secondary 8-pointed star rosette */}
        <polygon
          points="100,20 114,64 160,64 124,92 138,136 100,110 62,136 76,92 40,64 86,64"
          fill="none"
          stroke={secondaryStroke}
          strokeWidth="0.7"
        />
        <polygon
          points="100,20 114,64 160,64 124,92 138,136 100,110 62,136 76,92 40,64 86,64"
          transform="rotate(45 100 100)"
          fill="none"
          stroke={secondaryStroke}
          strokeWidth="0.7"
        />

        {/* Radial Axis Rays */}
        <line x1="100" y1="4" x2="100" y2="196" stroke={secondaryStroke} strokeWidth="0.5" strokeDasharray="2,4" />
        <line x1="4" y1="100" x2="196" y2="100" stroke={secondaryStroke} strokeWidth="0.5" strokeDasharray="2,4" />
        <line x1="32" y1="32" x2="168" y2="168" stroke={secondaryStroke} strokeWidth="0.5" strokeDasharray="2,4" />
        <line x1="32" y1="168" x2="168" y2="32" stroke={secondaryStroke} strokeWidth="0.5" strokeDasharray="2,4" />

        {/* Inner Floral Center */}
        <circle cx="100" cy="100" r="16" fill="rgba(234, 179, 8, 0.05)" stroke={strokeColor} strokeWidth="1" />
        <circle cx="100" cy="100" r="6" fill="rgba(250, 204, 21, 0.2)" stroke={strokeColor} strokeWidth="0.8" />
        <circle cx="100" cy="100" r="2" fill="#fde047" />
      </svg>
    </div>
  );
};
