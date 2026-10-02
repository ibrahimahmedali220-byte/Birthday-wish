import React, { useState } from 'react';
import { PageStep } from '../types';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { toggleAmbientAtmosphere } from '../utils/ambientSound';

interface NavigationHeaderProps {
  currentStep: PageStep;
  onNavigate: (step: PageStep) => void;
  onReset: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentStep,
  onNavigate,
  onReset,
}) => {
  const [soundOn, setSoundOn] = useState<boolean>(false);

  const handleToggleSound = () => {
    const active = toggleAmbientAtmosphere();
    setSoundOn(active);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-8 py-4 backdrop-blur-md bg-[#040814]/40 border-b border-white/5 transition-all">
      {/* Zone 1: Brand Wordmark */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 group text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 cursor-pointer"
        title="Return to Welcome"
      >
        <span className="font-display text-xl sm:text-2xl font-semibold tracking-wider text-amber-100 group-hover:text-amber-300 transition-colors">
          Nūr &amp; Dua
        </span>
        <span className="text-amber-400/60 text-xs tracking-widest uppercase font-sans hidden sm:inline">
          نُور وَدُعَاء
        </span>
      </button>

      {/* Zone 2: Step Indicator Links */}
      <nav aria-label="Steps" className="flex items-center gap-1.5 sm:gap-6">
        <button
          onClick={() => onNavigate('welcome')}
          className={`text-xs sm:text-sm font-medium transition-colors cursor-pointer py-1 ${
            currentStep === 'welcome'
              ? 'text-amber-300 border-b border-amber-300'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="hidden sm:inline">01. </span>Welcome
        </button>
        <span className="text-slate-600 text-xs select-none">/</span>
        <button
          onClick={() => onNavigate('dua')}
          className={`text-xs sm:text-sm font-medium transition-colors cursor-pointer py-1 ${
            currentStep === 'dua'
              ? 'text-amber-300 border-b border-amber-300'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="hidden sm:inline">02. </span>The Dua
        </button>
        <span className="text-slate-600 text-xs select-none">/</span>
        <button
          onClick={() => onNavigate('final')}
          className={`text-xs sm:text-sm font-medium transition-colors cursor-pointer py-1 ${
            currentStep === 'final'
              ? 'text-amber-300 border-b border-amber-300'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="hidden sm:inline">03. </span>Final
        </button>
      </nav>

      {/* Zone 3: Actions (Sound & Reset) */}
      <div className="flex items-center gap-2">
        {/* Halal Night Breeze Atmospheric Sound */}
        <button
          onClick={handleToggleSound}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            soundOn
              ? 'text-amber-300 bg-amber-400/20 border border-amber-400/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
          title={soundOn ? 'Silence Night Breeze' : 'Enable Soft Night Breeze (Ambient)'}
          aria-label={soundOn ? 'Silence Night Breeze' : 'Enable Soft Night Breeze (Ambient)'}
        >
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {currentStep !== 'welcome' && (
          <button
            onClick={onReset}
            className="p-2 text-slate-400 hover:text-amber-200 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            title="Start Over"
            aria-label="Start Over"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
