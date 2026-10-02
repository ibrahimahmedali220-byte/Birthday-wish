import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronRight, MousePointerClick } from 'lucide-react';
import { ThreeDImageCard } from './ThreeDImageCard';

interface WelcomePageProps {
  imageSrc: string;
  onBegin: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  imageSrc,
  onBegin,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between items-center px-4 sm:px-6 py-8 max-w-6xl mx-auto z-10">
      {/* Decorative Top Accent */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2 text-xs sm:text-sm tracking-[0.25em] uppercase text-amber-300/80 font-medium mb-6"
      >
        <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-amber-400/60" />
        <span>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
        <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-amber-400/60" />
      </motion.div>

      {/* Two Column Layout on Desktop, Centered on Mobile */}
      <div className="w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side: 3D Image Card with 3D Deep Shadow */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <ThreeDImageCard
            imageSrc={imageSrc}
            title="For John"
            subtitle="Mustahid Hasan"
            pageStepName="Page 01 · Welcome"
          />
        </div>

        {/* Right Side: Welcome Message & 3D Animated Button */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full py-8 sm:py-12 px-6 sm:px-10 rounded-3xl glass-panel relative overflow-hidden"
          >
            {/* Subtle Ambient Radial Lighting within card */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Opening Heading */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.15] mb-5">
              A Special Dua For You,{' '}
              <span className="text-gold-gradient font-normal italic block sm:inline">
                John
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-xl mb-8">
              May Allah fill your life with peace, happiness, Imaan and Barakah.
            </p>

            {/* 3D Animated "Begin Your Dua" Button with Animated Mouse Cursor */}
            <div className="relative inline-block mt-2">
              {/* Glowing Pulse Aura */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400/50 via-yellow-300/40 to-amber-500/50 blur-lg opacity-75 group-hover:opacity-100 animate-pulse" />

              <motion.button
                onClick={onBegin}
                whileHover={{ scale: 1.04, translateY: -2 }}
                whileTap={{ scale: 0.98, translateY: 3 }}
                className="relative group inline-flex items-center gap-3.5 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-semibold text-white tracking-wide cursor-pointer overflow-hidden transition-all duration-200"
                style={{
                  background: 'linear-gradient(180deg, #facc15 0%, #ca8a04 50%, #854d0e 100%)',
                  boxShadow: '0 8px 0 #713f12, 0 16px 28px rgba(0,0,0,0.6), inset 0 2px 2px rgba(255,255,255,0.4)',
                }}
              >
                {/* 3D Specular Light Sweep */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />

                <span className="drop-shadow-md text-amber-50 font-bold">Begin Your Dua</span>
                <Sparkles className="w-5 h-5 text-amber-100 drop-shadow group-hover:rotate-45 transition-transform duration-300" />
                <ChevronRight className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>

              {/* Animated Mouse Cursor Indicator */}
              <motion.div
                animate={{
                  x: [0, 8, 0],
                  y: [0, -6, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  ease: 'easeInOut',
                }}
                className="absolute -bottom-7 -right-5 pointer-events-none flex items-center gap-1 bg-black/80 border border-amber-400/60 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-mono shadow-md backdrop-blur-sm"
              >
                <MousePointerClick className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                <span>Click Here</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Small Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-400/90 font-light"
      >
        <span>Made with a sincere dua for John (Mustahid Hasan) 🤲</span>
      </motion.footer>
    </div>
  );
};
