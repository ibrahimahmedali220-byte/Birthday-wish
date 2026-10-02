import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import skylineImage from '../assets/images/islamic_sky_silhouette_1790953331301.jpg';
import { ThreeDImageCard } from './ThreeDImageCard';

interface FinalPageProps {
  imageSrc: string;
  onOpenMakeDua: () => void;
  onRestart: () => void;
  onBack: () => void;
}

export const FinalPage: React.FC<FinalPageProps> = ({
  imageSrc,
  onOpenMakeDua,
  onRestart,
  onBack,
}) => {
  const [ameenClicked, setAmeenClicked] = useState<boolean>(false);

  const handleAmeen = () => {
    setAmeenClicked(true);
    try {
      confetti({
        particleCount: 36,
        spread: 60,
        startVelocity: 18,
        origin: { y: 0.6 },
        colors: ['#fef08a', '#facc15', '#ca8a04', '#ffffff'],
        disableForReducedMotion: true,
        ticks: 85,
        gravity: 0.55,
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between items-center px-4 sm:px-6 py-8 max-w-6xl mx-auto z-10 text-center">
      {/* Distant Mosque Skyline Silhouette */}
      <div className="fixed bottom-0 left-0 right-0 h-44 sm:h-56 pointer-events-none z-0 overflow-hidden opacity-30 select-none">
        <img
          src={skylineImage}
          alt=""
          className="w-full h-full object-cover object-bottom filter brightness-75 contrast-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#02040b] via-[#02040b]/60 to-transparent" />
      </div>

      {/* Top Blessing Marker */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-xs sm:text-sm tracking-[0.2em] uppercase text-amber-300/80 font-medium mb-4"
      >
        ✦ خاتمة الدُّعَاء ✦
      </motion.div>

      {/* Two Column Layout on Desktop, Centered on Mobile */}
      <div className="w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Side: 3D Image Card for Page 3 */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <ThreeDImageCard
            imageSrc={imageSrc}
            title="Blessings For John"
            subtitle="Mustahid Hasan"
            pageStepName="Page 03 · Final Blessing"
          />
        </div>

        {/* Right Side: Final Blessing Card */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full py-8 sm:py-10 px-6 sm:px-10 rounded-3xl glass-panel relative z-10 overflow-hidden text-center"
          >
            {/* Subtle radial ambient highlight */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            {/* Center Text 1 */}
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight mb-2">
              May Allah Make Your{' '}
              <span className="text-gold-gradient font-normal italic block sm:inline">Journey Beautiful</span>
            </h2>

            {/* Exact User Dedication */}
            <div className="inline-block px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-200 text-sm font-medium tracking-wide my-3">
              For John — with a sincere dua 🤲
            </div>

            {/* Poetic Benediction */}
            <div className="space-y-2.5 my-5 max-w-lg mx-auto">
              <p className="text-base sm:text-lg text-slate-200 font-light leading-relaxed">
                May every difficulty become easier,
              </p>
              <p className="text-base sm:text-lg text-amber-100 font-light leading-relaxed">
                every dua find its way to acceptance,
              </p>
              <p className="text-base sm:text-lg text-slate-200 font-light leading-relaxed">
                and every new day bring you closer to Allah.
              </p>
            </div>

            {/* Ameen Ya Rabb Section */}
            <div className="my-5">
              <button
                onClick={handleAmeen}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-base font-medium transition-all cursor-pointer ${
                  ameenClicked
                    ? 'bg-amber-400/25 border border-amber-400/60 text-amber-100 shadow-[0_0_25px_rgba(234,179,8,0.3)]'
                    : 'bg-white/5 border border-amber-400/30 text-amber-200 hover:bg-white/10 hover:border-amber-400/50'
                }`}
              >
                <span>Ameen Ya Rabb</span>
                <span className="text-lg">🤲</span>
              </button>
              <p className="text-[11px] text-slate-400 mt-1.5 font-light">
                (Tap to say Ameen from the heart)
              </p>
            </div>

            {/* Action Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <button
                onClick={onOpenMakeDua}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl glass-button-primary text-sm sm:text-base font-semibold text-white cursor-pointer shadow-lg"
              >
                <span>Make A Dua</span>
                <span className="text-base">🤲</span>
              </button>
            </div>

            {/* Navigation helpers */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-white/10 text-xs text-slate-400">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back to Dua</span>
              </button>
              <span className="text-slate-600">·</span>
              <button
                onClick={onRestart}
                className="inline-flex items-center gap-1 hover:text-amber-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start Over</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Small Peaceful Closure Quote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-6 text-xs text-slate-400/80 font-light max-w-md mx-auto"
      >
        “Verily, in the remembrance of Allah do hearts find rest.” — Surah Ar-Ra'd (13:28)
      </motion.p>
    </div>
  );
};
