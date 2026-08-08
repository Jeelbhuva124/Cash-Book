import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../Assets/logo.png';

export const SplashScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Keep splash screen visible for 2.5 seconds to allow full flip animation
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Give time for exit animation to complete before removing from DOM
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 800); 
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
          style={{ perspective: 1200 }}
        >
          {/* Main animated container */}
          <motion.div
            initial={{ scale: 0.2, rotateY: 180, opacity: 0, z: -500 }}
            animate={{ scale: 1.2, rotateY: 0, opacity: 1, z: 0 }}
            transition={{
              duration: 1.8,
              type: "spring",
              damping: 15,
              stiffness: 40,
              mass: 1.5
            }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative flex flex-col items-center justify-center"
          >
            {/* Pulsing glow behind the logo to add depth */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.3, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2 // Starts pulsing after the flip lands
              }}
              className="absolute inset-0 bg-primary/30 blur-[60px] rounded-full"
              style={{ transform: "translateZ(-50px)" }}
            />
            
            {/* The Logo */}
            <motion.img 
              src={logo} 
              alt="Cash-Book Logo" 
              className="w-56 h-auto relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              style={{ backfaceVisibility: "hidden" }} // Prevents seeing the image when flipped backwards
            />
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
