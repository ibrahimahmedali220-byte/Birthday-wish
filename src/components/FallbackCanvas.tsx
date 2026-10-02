import React, { useMemo } from 'react';
import { PageStep } from '../types';

interface FallbackCanvasProps {
  currentStep: PageStep;
  glowBoost?: boolean;
}

export const FallbackCanvas: React.FC<FallbackCanvasProps> = ({ currentStep, glowBoost = false }) => {
  // Generate random twinkling stars deterministically
  const stars = useMemo(() => {
    return Array.from({ length: 90 }).map((_, i) => ({
      id: i,
      x: (i * 17) % 100,
      y: (i * 23) % 95,
      size: (i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5),
      opacity: 0.3 + ((i % 5) * 0.15),
      delay: (i % 7) * 0.6,
      duration: 2.5 + (i % 4) * 0.8,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Deep Night Sky Background with Radial Glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#02040b] via-[#050b1a] to-[#030612]" />
      
      {/* Distant Moonlight Aura */}
      <div
        className={`absolute rounded-full filter blur-[90px] transition-all duration-1000 ${
          glowBoost ? 'opacity-90 scale-125' : 'opacity-40'
        } ${
          currentStep === 'welcome'
            ? 'top-[12%] right-[15%] w-[360px] h-[360px] bg-amber-200/20'
            : currentStep === 'dua'
            ? 'top-[8%] left-1/2 -translate-x-1/2 w-[480px] h-[480px] bg-amber-300/15'
            : 'top-[10%] left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-amber-200/25'
        }`}
      />

      {/* 2D Crescent Moon SVG with soft golden gradient */}
      <div
        className={`absolute transition-all duration-1000 ease-out ${
          currentStep === 'welcome'
            ? 'top-16 right-8 md:right-28 w-28 h-28 md:w-44 md:h-44'
            : currentStep === 'dua'
            ? 'top-10 left-1/2 -translate-x-1/2 w-24 h-24 md:w-36 md:h-36 opacity-80'
            : 'top-12 left-1/2 -translate-x-1/2 w-32 h-32 md:w-48 md:h-48 scale-110'
        }`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_35px_rgba(250,204,21,0.5)]">
          <defs>
            <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="45%" stopColor="#fef08a" />
              <stop offset="85%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <filter id="moonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path
            d="M 50,5 A 45,45 0 1 0 95,50 A 38,38 0 1 1 50,5 Z"
            fill="url(#moonGrad)"
            filter="url(#moonGlow)"
          />
        </svg>
      </div>

      {/* Twinkling CSS Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white transition-opacity"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: star.size > 2 ? '0 0 6px rgba(254, 240, 138, 0.8)' : 'none',
            animation: `starTwinkle ${star.duration}s ease-in-out infinite ${star.delay}s`,
          }}
        />
      ))}

      {/* Floating 2D Lanterns on screen edges */}
      <div className="absolute top-20 left-4 md:left-14 w-12 md:w-16 animate-lantern-float">
        <svg viewBox="0 0 60 120" className="w-full h-auto drop-shadow-[0_10px_25px_rgba(234,179,8,0.45)]">
          <circle cx="30" cy="8" r="6" fill="none" stroke="#eab308" strokeWidth="2" />
          <path d="M 20,20 L 40,20 L 35,40 L 25,40 Z" fill="#ca8a04" />
          <rect x="22" y="40" width="16" height="38" rx="3" fill="#fef08a" fillOpacity="0.85" />
          <path d="M 20,78 L 40,78 L 30,105 Z" fill="#ca8a04" />
          <circle cx="30" cy="58" r="4" fill="#ffffff" filter="drop-shadow(0 0 6px #f59e0b)" />
        </svg>
      </div>

      <div className="hidden sm:block absolute top-48 right-6 md:right-16 w-10 md:w-14 animate-lantern-float-delayed">
        <svg viewBox="0 0 60 120" className="w-full h-auto drop-shadow-[0_10px_25px_rgba(234,179,8,0.45)]">
          <circle cx="30" cy="8" r="6" fill="none" stroke="#eab308" strokeWidth="2" />
          <path d="M 20,20 L 40,20 L 35,40 L 25,40 Z" fill="#ca8a04" />
          <rect x="22" y="40" width="16" height="38" rx="3" fill="#fef08a" fillOpacity="0.85" />
          <path d="M 20,78 L 40,78 L 30,105 Z" fill="#ca8a04" />
          <circle cx="30" cy="58" r="4" fill="#ffffff" filter="drop-shadow(0 0 6px #f59e0b)" />
        </svg>
      </div>
    </div>
  );
};
