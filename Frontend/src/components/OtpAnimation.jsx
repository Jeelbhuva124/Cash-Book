import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock } from 'lucide-react';

const OtpAnimation = () => {
  const [phase, setPhase] = useState('typing'); // 'typing', 'exploding', 'orbiting', 'converging', 'success'
  const [filledCount, setFilledCount] = useState(0);

  const digits = ['5', '4', '5', '4'];

  useEffect(() => {
    if (phase === 'typing') {
      const interval = setInterval(() => {
        setFilledCount((prev) => {
          if (prev < 4) return prev + 1;
          return prev;
        });
      }, 600);

      if (filledCount === 4) {
        clearInterval(interval);
        setTimeout(() => setPhase('exploding'), 300);
      }
      return () => clearInterval(interval);
    } else if (phase === 'exploding') {
      const timer = setTimeout(() => {
        setPhase('orbiting');
      }, 600);
      return () => clearTimeout(timer);
    } else if (phase === 'orbiting') {
      const timer = setTimeout(() => {
        setPhase('converging');
      }, 600);
      return () => clearTimeout(timer);
    } else if (phase === 'converging') {
      const timer = setTimeout(() => {
        setPhase('success');
      }, 600);
      return () => clearTimeout(timer);
    } else if (phase === 'success') {
      const timer = setTimeout(() => {
        setPhase('typing');
        setFilledCount(0);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase, filledCount]);

  // Determine positions of boxes based on phase
  const getBoxProps = (index) => {
    // 1. Typing Phase: Horizontal row
    if (phase === 'typing') {
      const spacing = 70;
      const startX = -105; // Centered for 4 boxes of ~60px
      return {
        x: startX + index * spacing,
        y: 0,
        scale: 1,
        opacity: 1
      };
    }
    
    // 2. Exploding & Orbiting: Diamond formation
    // 3. Converging: Center
    if (phase === 'exploding' || phase === 'orbiting') {
      const radius = 80;
      switch (index) {
        case 0: return { x: 0, y: -radius, scale: 0.9, opacity: 1 }; // Top
        case 1: return { x: radius, y: 0, scale: 0.9, opacity: 1 };  // Right
        case 2: return { x: 0, y: radius, scale: 0.9, opacity: 1 };  // Bottom
        case 3: return { x: -radius, y: 0, scale: 0.9, opacity: 1 }; // Left
        default: return { x: 0, y: 0 };
      }
    }
    
    if (phase === 'converging' || phase === 'success') {
      return { x: 0, y: 0, scale: 1, opacity: phase === 'success' && index !== 0 ? 0 : 1 };
    }
    
    return { x: 0, y: 0 };
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black overflow-hidden font-sans">
      <motion.div 
        className="w-full max-w-[420px] h-[480px] bg-[#111111] rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AnimatePresence mode="wait">
          {phase !== 'success' && (
            <motion.div
              key="verification-phase"
              className="absolute flex flex-col items-center w-full top-[60px]"
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">Let's verify your number</h2>
              <p className="text-[#888888] text-sm text-center px-4 leading-relaxed">
                We've sent a 4-digit code to your phone. It'll auto-verify once entered.
              </p>
            </motion.div>
          )}

          {phase === 'success' && (
            <motion.div
              key="success-header"
              className="absolute flex flex-col items-center w-full top-[60px]"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">Verified successfully</h2>
              <p className="text-[#888888] text-sm text-center px-4 leading-relaxed">
                Your phone number has been verified.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Central Animation Area */}
        <div className="relative w-full h-[200px] flex items-center justify-center mt-10">
          
          {/* Dashed Circle Background (visible during exploding/orbiting) */}
          <AnimatePresence>
            {(phase === 'exploding' || phase === 'orbiting') && (
              <motion.div 
                className="absolute w-[160px] h-[160px] rounded-full border border-dashed border-[#444444]"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.4 }}
              />
            )}
          </AnimatePresence>

          {/* Rotating Container for the Orbit Phase */}
          <motion.div
            className="relative w-full h-full flex items-center justify-center"
            animate={{ 
              rotate: phase === 'orbiting' ? 135 : 0 
            }}
            transition={{
              duration: 0.6,
              ease: "easeInOut"
            }}
          >
            {[0, 1, 2, 3].map((i) => {
              const isFilled = i < filledCount;
              const isActive = i === filledCount && phase === 'typing';
              const boxProps = getBoxProps(i);
              
              let bg = '#18181b';
              let border = '#27272a';
              let borderBottomRight = '#27272a';

              if (isActive) {
                border = '#fb923c';
                borderBottomRight = '#fb923c';
              } else if (isFilled && phase === 'typing') {
                border = '#52525b';
              }
              
              if (phase === 'exploding' || phase === 'orbiting') {
                border = '#27272a';
                borderBottomRight = '#fb923c'; // reddish-orange gradient feel on corner
              }

              if (phase === 'success' && i === 0) {
                bg = '#22c55e'; // Green background for the single box
                border = '#22c55e';
                borderBottomRight = '#22c55e';
              }

              return (
                <motion.div
                  key={i}
                  className="absolute w-[60px] h-[60px] rounded-2xl flex items-center justify-center overflow-hidden"
                  initial={false}
                  animate={{
                    x: boxProps.x,
                    y: boxProps.y,
                    scale: boxProps.scale,
                    opacity: boxProps.opacity,
                    backgroundColor: bg,
                    boxShadow: (phase === 'exploding' || phase === 'orbiting') 
                      ? '4px 4px 10px rgba(251, 146, 60, 0.15)' 
                      : (phase === 'success' && i === 0) 
                        ? '0px 0px 30px rgba(34, 197, 94, 0.4)' 
                        : '0px 0px 0px rgba(0,0,0,0)'
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    opacity: { duration: 0.2 }
                  }}
                  style={{
                    borderTop: `2px solid ${border}`,
                    borderLeft: `2px solid ${border}`,
                    borderRight: `2px solid ${borderBottomRight}`,
                    borderBottom: `2px solid ${borderBottomRight}`,
                  }}
                >
                  {/* Blinking Cursor */}
                  {isActive && (
                    <motion.div 
                      className="absolute w-0.5 h-6 bg-orange-400"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}

                  {/* Digit */}
                  {isFilled && phase !== 'success' && (
                    <span className="text-white text-2xl font-semibold">
                      {digits[i]}
                    </span>
                  )}

                  {/* Success Checkmark */}
                  {phase === 'success' && i === 0 && (
                    <motion.div
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Check className="w-8 h-8 text-white" strokeWidth={4} />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-10 w-full flex justify-center">
          <AnimatePresence mode="wait">
            {phase !== 'success' ? (
              <motion.div
                key="footer-resend"
                className="text-sm text-[#888888]"
                exit={{ opacity: 0, y: 10 }}
              >
                Didn't receive the code? <span className="text-white font-medium cursor-pointer hover:underline">Resend</span>
              </motion.div>
            ) : (
              <motion.div
                key="footer-secured"
                className="flex items-center gap-2 text-green-500"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Lock className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">Verified & Secured</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpAnimation;
