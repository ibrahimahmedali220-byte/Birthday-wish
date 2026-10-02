import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface ThreeDImageCardProps {
  imageSrc: string;
  title: string;
  subtitle?: string;
  pageStepName: string;
}

export const ThreeDImageCard: React.FC<ThreeDImageCardProps> = ({
  imageSrc,
  title,
  subtitle,
  pageStepName,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -11;
    const rotateY = ((x - centerX) / centerX) * 11;

    setTilt({
      x: rotateX,
      y: rotateY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  return (
    <div className="relative w-full max-w-[320px] sm:max-w-[360px] md:max-w-[380px] mx-auto select-none">
      {/* Dynamic 3D Deep Ground Shadow */}
      <div
        className="absolute -inset-4 bg-gradient-to-b from-amber-500/20 via-black/80 to-black/95 rounded-[32px] blur-2xl -z-10 transition-transform duration-500"
        style={{
          transform: `translate(${tilt.y * -0.5}px, ${Math.abs(tilt.x) * 1.5 + 24}px) scale(0.92)`,
          opacity: isHovered ? 0.95 : 0.75,
        }}
      />

      {/* Main Interactive 3D Card Container */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, x: -30, rotateY: 15 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.025, 1.025, 1.025)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative group rounded-3xl p-2.5 sm:p-3 bg-gradient-to-b from-amber-400/35 via-slate-900/90 to-amber-950/80 border border-amber-400/40 shadow-[0_30px_70px_rgba(0,0,0,0.85),0_0_35px_rgba(234,179,8,0.25)] backdrop-blur-xl"
      >
        {/* Image Frame */}
        <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#02050f] border border-amber-300/30">
          {/* Main Visual Image */}
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />

          {/* Dynamic Light Glare Reflection */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 240px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.7) 0%, rgba(234,179,8,0.2) 40%, transparent 80%)`,
            }}
          />

          {/* Vignette Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-black/35 pointer-events-none" />

          {/* Top Decorative Filigree Corner Badges */}
          <div className="absolute top-3 left-3 text-amber-300/70 text-xs font-serif select-none pointer-events-none">
            ✦
          </div>
          <div className="absolute top-3 right-3 text-amber-300/70 text-xs font-serif select-none pointer-events-none">
            ✦
          </div>

          {/* Bottom Card Label */}
          <div className="absolute bottom-0 inset-x-0 p-4 text-center z-10 pointer-events-none">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 border border-amber-400/30 text-[11px] font-medium text-amber-300 tracking-wider uppercase mb-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{pageStepName}</span>
            </div>
            <h4 className="font-display text-lg sm:text-xl text-white font-medium tracking-wide drop-shadow-md">
              {title}
            </h4>
            {subtitle && (
              <p className="text-xs text-slate-300 font-light mt-0.5 drop-shadow">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
