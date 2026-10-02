/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { PageStep, ToastMessage } from './types';
import { ThreeCanvas } from './components/ThreeCanvas';
import { FallbackCanvas } from './components/FallbackCanvas';
import { NavigationHeader } from './components/NavigationHeader';
import { WelcomePage } from './components/WelcomePage';
import { DuaPage } from './components/DuaPage';
import { FinalPage } from './components/FinalPage';
import { MakeDuaModal } from './components/MakeDuaModal';
import { Toast } from './components/Toast';

import page1Image from './assets/images/user_page1_sitting.png';
import page2Image from './assets/images/user_page2_river.png';
import page3Image from './assets/images/user_page3_scooter.jpg';

export default function App() {
  const [currentStep, setCurrentStep] = useState<PageStep>('welcome');
  const [glowBoost, setGlowBoost] = useState<boolean>(false);
  const [isMakeDuaOpen, setIsMakeDuaOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState<boolean>(true);

  // Trigger grand celebration confetti effect on page transition
  const triggerPageCelebration = useCallback(() => {
    try {
      // Main central burst
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#fef08a', '#facc15', '#eab308', '#ffffff', '#ca8a04'],
        disableForReducedMotion: true,
        ticks: 120,
        gravity: 0.7,
      });

      // Side fireworks burst for celebratory feel
      setTimeout(() => {
        confetti({
          particleCount: 30,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.65 },
          colors: ['#fef08a', '#facc15', '#ca8a04', '#ffffff'],
        });
        confetti({
          particleCount: 30,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.65 },
          colors: ['#fef08a', '#facc15', '#ca8a04', '#ffffff'],
        });
      }, 150);
    } catch {
      // ignore
    }
  }, []);

  // Initialize query parameters for step on mount
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const stepParam = urlParams.get('step') as PageStep | null;

      if (stepParam && ['welcome', 'dua', 'final'].includes(stepParam)) {
        setCurrentStep(stepParam);
      }

      // Check WebGL support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) {
        setIsWebGLSupported(false);
      }
    } catch {
      setIsWebGLSupported(false);
    }
  }, []);

  // Update step with celebration animation
  const navigateToStep = useCallback((step: PageStep) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger celebration when moving to a new step
    triggerPageCelebration();

    try {
      const url = new URL(window.location.href);
      if (step === 'welcome') {
        url.searchParams.delete('step');
      } else {
        url.searchParams.set('step', step);
      }
      url.searchParams.set('user', 'John');
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }
  }, [triggerPageCelebration]);

  const handleTriggerGlow = () => {
    setGlowBoost(true);
    setTimeout(() => setGlowBoost(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-amber-400/20 selection:text-amber-200">
      {/* 3D WebGL Canvas or High-Fidelity 2D Fallback */}
      {isWebGLSupported ? (
        <ThreeCanvas currentStep={currentStep} glowBoost={glowBoost} />
      ) : (
        <FallbackCanvas currentStep={currentStep} glowBoost={glowBoost} />
      )}

      {/* Ambient Radial Vignette */}
      <div className="fixed inset-0 pointer-events-none bg-radial-gradient from-transparent via-[#030712]/30 to-[#030712]/80 z-[1]" />

      {/* Persistent Navigation Header */}
      <NavigationHeader
        currentStep={currentStep}
        onNavigate={navigateToStep}
        onReset={() => navigateToStep('welcome')}
      />

      {/* Main Cinematic Viewport Stage */}
      <main className="relative z-10 flex-1 flex flex-col pt-16 sm:pt-20">
        <AnimatePresence mode="wait">
          {currentStep === 'welcome' && (
            <motion.section
              key="welcome-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col"
            >
              <WelcomePage
                imageSrc={page1Image}
                onBegin={() => navigateToStep('dua')}
              />
            </motion.section>
          )}

          {currentStep === 'dua' && (
            <motion.section
              key="dua-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col"
            >
              <DuaPage
                imageSrc={page2Image}
                onContinue={() => navigateToStep('final')}
                onBack={() => navigateToStep('welcome')}
                onTriggerGlow={handleTriggerGlow}
              />
            </motion.section>
          )}

          {currentStep === 'final' && (
            <motion.section
              key="final-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col"
            >
              <FinalPage
                imageSrc={page3Image}
                onOpenMakeDua={() => setIsMakeDuaOpen(true)}
                onRestart={() => navigateToStep('welcome')}
                onBack={() => navigateToStep('dua')}
              />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Interactive Contemplation Modal */}
      <MakeDuaModal
        isOpen={isMakeDuaOpen}
        onClose={() => setIsMakeDuaOpen(false)}
        recipientName="John"
      />

      {/* Status Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
