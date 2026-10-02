import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { IslamicPattern } from './IslamicPattern';
import { ThreeDImageCard } from './ThreeDImageCard';

interface DuaPageProps {
  imageSrc: string;
  onContinue: () => void;
  onBack: () => void;
  onTriggerGlow: () => void;
}

export const DuaPage: React.FC<DuaPageProps> = ({
  imageSrc,
  onContinue,
  onBack,
  onTriggerGlow,
}) => {
  const [isGlowing, setIsGlowing] = useState<boolean>(false);
  const [readCount, setReadCount] = useState<number>(1);

  const handleReadAgain = () => {
    setIsGlowing(true);
    setReadCount((prev) => prev + 1);
    onTriggerGlow();

    try {
      confetti({
        particleCount: 28,
        spread: 54,
        startVelocity: 16,
        origin: { y: 0.62 },
        colors: ['#fef08a', '#facc15', '#ca8a04', '#ffffff'],
        disableForReducedMotion: true,
        ticks: 90,
        gravity: 0.6,
        shapes: ['circle'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsGlowing(false);
    }, 1800);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4 sm:px-6 py-8 max-w-6xl mx-auto z-10">
      {/* Background Animated Islamic Geometric Pattern */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30">
        <IslamicPattern size={580} intensity={isGlowing ? 'vibrant' : 'subtle'} />
      </div>

      <div className="w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side: 3D Image Card for Page 2 */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <ThreeDImageCard
            imageSrc={imageSrc}
            title="Dua For John"
            subtitle="Mustahid Hasan"
            pageStepName="Page 02 · The Dua"
          />
        </div>

        {/* Right Side: The Dua Card */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full py-10 sm:py-14 px-6 sm:px-12 rounded-3xl glass-panel relative overflow-hidden transition-all duration-700 ${
              isGlowing
                ? 'border-amber-400/60 shadow-[0_0_60px_rgba(234,179,8,0.35)] scale-[1.01]'
                : 'border-amber-400/20 shadow-2xl'
            }`}
          >
            {/* Decorative Islamic Arch Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

            {/* Card Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium tracking-widest text-amber-300/80 uppercase">
                <span>🤲</span>
                <span>A Beautiful Dua For You</span>
                <span>🤲</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight mt-2.5">
                A Beautiful Dua For{' '}
                <span className="text-gold-gradient font-normal italic">
                  John
                </span>
              </h2>
            </div>

            {/* The Central Heartfelt Personalized Dua Text */}
            <div className="my-8 text-center">
              <p className="text-lg sm:text-2xl text-slate-100 font-light leading-relaxed tracking-wide font-sans">
                “May Allah bless you, <span className="text-gold-gradient font-semibold">Mustahid Hasan</span>, with{' '}
                <span className="text-amber-200 font-medium">Imaan</span>,{' '}
                <span className="text-amber-200 font-medium">peace</span>,{' '}
                <span className="text-amber-200 font-medium">good health</span>,{' '}
                <span className="text-amber-200 font-medium">happiness</span> and endless{' '}
                <span className="text-amber-200 font-medium">Barakah</span>. May He protect you from every difficulty, guide your heart toward what is good, and make every coming day better than the last. May Allah accept your duas, forgive your mistakes and keep you close to Him. Ameen. 🤲”
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-4 border-t border-white/10">
              <button
                onClick={handleReadAgain}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-medium text-amber-200 bg-white/5 hover:bg-white/10 border border-amber-400/30 hover:border-amber-400/60 transition-all cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Read Again 🤲</span>
                {readCount > 1 && (
                  <span className="text-xs text-amber-400/80 font-mono">({readCount})</span>
                )}
              </button>

              <button
                onClick={onContinue}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-3.5 rounded-xl text-sm font-semibold text-white glass-button-primary cursor-pointer shadow-lg"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>

            {/* Back Link */}
            <div className="text-center mt-5">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back to Welcome</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
