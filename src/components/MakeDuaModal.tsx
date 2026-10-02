import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, Heart } from 'lucide-react';

interface MakeDuaModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
}

export const MakeDuaModal: React.FC<MakeDuaModalProps> = ({ isOpen, onClose, recipientName }) => {
  const [reflectionSeconds, setReflectionSeconds] = useState<number>(0);
  const [personalDuaText, setPersonalDuaText] = useState<string>('');
  const [duaKept, setDuaKept] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'reflection' | 'dhikr'>('reflection');
  const [dhikrCount, setDhikrCount] = useState<number>(0);
  const [selectedDhikr, setSelectedDhikr] = useState<string>('SubhanAllah');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen) {
      setReflectionSeconds(0);
      setDuaKept(false);
      setDhikrCount(0);
      interval = setInterval(() => {
        setReflectionSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg p-6 sm:p-9 rounded-3xl glass-panel border border-amber-400/30 text-center shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hands Icon */}
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 text-2xl shadow-inner">
            🤲
          </div>

          <h3 className="font-display text-2xl sm:text-3xl text-white font-medium mb-2">
            A Moment of Sincere Dua
          </h3>

          <p className="text-sm sm:text-base text-amber-100 font-light leading-relaxed mb-5">
            Take a moment.
            <br />
            Make a sincere dua from your heart.
            <br />
            <span className="text-amber-300 font-normal">Allah knows what is in your heart. 🤲</span>
          </p>

          {/* Mode Switcher */}
          <div className="inline-flex p-1 bg-black/40 border border-white/10 rounded-xl mb-5">
            <button
              onClick={() => setActiveTab('reflection')}
              className={`px-3.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'reflection'
                  ? 'bg-amber-400/25 text-amber-200 border border-amber-400/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Heart Reflection
            </button>
            <button
              onClick={() => setActiveTab('dhikr')}
              className={`px-3.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'dhikr'
                  ? 'bg-amber-400/25 text-amber-200 border border-amber-400/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Quiet Dhikr Counter
            </button>
          </div>

          {activeTab === 'reflection' ? (
            <>
              {/* Silent Contemplation Counter */}
              <div className="mb-5 py-1.5 px-4 inline-flex items-center gap-2 rounded-full bg-black/40 border border-white/10 text-xs text-slate-300 font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Time in silent reflection: {reflectionSeconds}s</span>
              </div>

              {/* Optional Personal Heart Reflection (Client-side only) */}
              <div className="mb-5 text-left">
                <label htmlFor="dua-notes" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Whisper your intention or silent prayer (optional, never saved or transmitted):
                </label>
                <textarea
                  id="dua-notes"
                  rows={3}
                  value={personalDuaText}
                  onChange={(e) => setPersonalDuaText(e.target.value)}
                  placeholder="E.g., Ya Allah, grant ease to my loved ones, guide our steps and forgive our shortcomings..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 resize-none font-light"
                />
              </div>
            </>
          ) : (
            <div className="mb-5 bg-black/30 p-4 rounded-2xl border border-white/10">
              <div className="flex justify-center gap-2 mb-3">
                {[
                  { label: 'سُبْحَانَ اللَّهِ', name: 'SubhanAllah' },
                  { label: 'الْحَمْدُ لِلَّهِ', name: 'Alhamdulillah' },
                  { label: 'اللَّهُ أَكْبَرُ', name: 'Allahu Akbar' },
                  { label: 'أَسْتَغْفِرُ اللَّهَ', name: 'Astaghfirullah' },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setSelectedDhikr(item.name);
                      setDhikrCount(0);
                    }}
                    className={`px-2.5 py-1 text-[11px] rounded-lg transition-colors ${
                      selectedDhikr === item.name
                        ? 'bg-amber-400/30 text-amber-200 border border-amber-400/40'
                        : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              <div className="my-4">
                <button
                  onClick={() => setDhikrCount((c) => c + 1)}
                  className="w-24 h-24 mx-auto rounded-full bg-amber-400/10 hover:bg-amber-400/20 border-2 border-amber-400/50 flex flex-col items-center justify-center transition-transform active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.2)]"
                >
                  <span className="text-2xl font-mono text-amber-200 font-bold">{dhikrCount}</span>
                  <span className="text-[10px] text-amber-300/80 uppercase tracking-widest mt-0.5">Tap</span>
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Tap the circle with each remembrance. Reset happens automatically.
              </p>
            </div>
          )}

          {/* Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setDuaKept(true);
                setTimeout(() => {
                  onClose();
                }, 1000);
              }}
              className="w-full sm:w-auto px-8 py-3 rounded-xl glass-button-primary text-sm font-medium text-white inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {duaKept ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Ameen. Supplication Concluded</span>
                </>
              ) : (
                <>
                  <span>Conclude With Ameen</span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </>
              )}
            </button>
          </div>

          <p className="mt-4 text-[11px] text-slate-400/80 font-light">
            “And when My servants ask you concerning Me, indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.” — Surah Al-Baqarah (2:186)
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
