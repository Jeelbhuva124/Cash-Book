import React, { useEffect, useState } from 'react';

export const ScrambleText = ({ text, delay = 0, className = "", flipboard = false }) => {
  // Initialize with zeros for alphanumeric characters, keep symbols/spaces intact
  const [displayText, setDisplayText] = useState(() => {
    if (typeof text !== 'string') return text;
    return text.replace(/[a-zA-Z0-9]/g, '0');
  });

  useEffect(() => {
    if (typeof text !== 'string') return;
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const originalTextArr = text.split('');
    let scrambleInterval;
    let loopInterval;
    let startTimeout;

    const runScramble = () => {
      let iteration = 0;
      clearInterval(scrambleInterval);
      
      // Calculate how much to increment iteration per frame (35ms) to reach text.length in 3000ms
      const framesCount = 3000 / 35;
      const step = Math.max(text.length / framesCount, 0.02);

      scrambleInterval = setInterval(() => {
        setDisplayText(() =>
          originalTextArr
            .map((letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              if (!/[a-zA-Z0-9]/.test(letter)) {
                return letter; // Preserve symbols like ₹, +, -, % and spaces
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(scrambleInterval);
          setDisplayText(text); // Ensure it lands perfectly on the target text
        }

        iteration += step;
      }, 35);
    };

    // Initial run after delay
    startTimeout = setTimeout(() => {
      runScramble();
      // Start the 15-second loop AFTER the initial delay finishes
      loopInterval = setInterval(runScramble, 15000);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(scrambleInterval);
      clearInterval(loopInterval);
    };
  }, [text, delay]);

  if (flipboard) {
    return (
      <span className={`inline-flex gap-[2px] items-center ${className}`}>
        {displayText.split("").map((char, i) => {
          if (char === " ") return <span key={i} className="w-1.5" />;
          return (
            <span 
              key={i} 
              className="inline-flex items-center justify-center bg-zinc-900 border border-zinc-700/60 rounded-[3px] relative overflow-hidden text-white shadow-[0_2px_4px_rgba(0,0,0,0.4)] font-mono px-[3px] py-[1px] min-w-[0.9em] text-center uppercase"
            >
              {/* Horizontal split line to simulate physical flaps */}
              <span className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/80 z-10 -translate-y-[50%]" />
              <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              <span className="relative z-20 drop-shadow-md">{char}</span>
            </span>
          );
        })}
      </span>
    );
  }

  return <span className={`font-mono uppercase ${className}`}>{displayText}</span>;
};
