import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Key, EyeOff, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SecuritySection = () => {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
  };

  return (
    <section className="py-16 px-4 md:px-8 bg-background border-t border-border">
      
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="max-w-7xl mx-auto bg-[#f8fbff] dark:bg-primary/5 rounded-[2rem] border border-border relative overflow-hidden shadow-lg shadow-primary/5 group"
      >
        
        {/* Inner Background Grid Pattern (Base) */}
        <div 
          className="absolute inset-0 z-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--color-border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)
            `,
            backgroundSize: '2.5rem 2.5rem',
          }}
        />

        {/* Reveal Highlight Grid Pattern (Interactive Blue Glow) */}
        <div 
          className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(90, 117, 246, 0.8) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(90, 117, 246, 0.8) 1px, transparent 1px)
            `,
            backgroundSize: '2.5rem 2.5rem',
            WebkitMaskImage: `radial-gradient(150px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
            maskImage: `radial-gradient(150px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
          }}
        />

        {/* Radial fade to soften the grid on edges inside the box */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#f8fbff_80%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_80%)] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 md:p-10">
          
          {/* Left Content */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, x: -30 },
            visible: { 
              opacity: 1, 
              x: 0,
              transition: { 
                duration: 0.6,
                when: "beforeChildren",
                staggerChildren: 0.15
              }
            }
          }}
          className="space-y-6"
        >
          {/* Badge */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Trust & Security Posture
          </motion.div>

          {/* Heading */}
          <motion.h2 
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-[1.2]"
          >
            Zero-Knowledge Architecture as <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Standard</span>
          </motion.h2>

          {/* Description */}
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="text-muted-foreground text-sm leading-relaxed max-w-lg"
          >
            We implement military-grade zero-knowledge encryption across all enterprise databases. Data remains entirely encrypted — meaning not even our highest-level administrators can access your users' raw sensitive information.
          </motion.p>

          {/* Feature Pills */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-full shadow-sm hover:shadow-md transition-all cursor-default">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">AES-256 at rest</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-full shadow-sm hover:shadow-md transition-all cursor-default">
              <Key className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Per-tenant key vault</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-full shadow-sm hover:shadow-md transition-all cursor-default">
              <EyeOff className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Zero admin visibility</span>
            </div>
          </motion.div>

          {/* Button */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="pt-4"
          >
            <Link to="/security" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
              Read Security Posture
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>

        </motion.div>

        {/* Right Content - Animated Shield Rings */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative flex items-center justify-center h-[280px]"
        >
          {/* Pulsing Rings */}
          {[1, 2, 3, 4].map((ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0 m-auto rounded-full border border-primary/40 bg-primary/5"
              style={{ width: '160px', height: '160px' }}
              animate={{
                scale: [1, 2.5],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: ring * 0.75,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Center Shield Container */}
          <div className="relative z-10 w-36 h-36 bg-card rounded-full shadow-2xl shadow-primary/30 flex items-center justify-center border border-border">
            <ShieldCheck className="w-16 h-16 text-primary" strokeWidth={2} />
          </div>
          
          {/* Extra subtle glow behind shield */}
          <div className="absolute inset-0 m-auto w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
        </motion.div>
        </div>
      </div>
    </section>
  );
};
