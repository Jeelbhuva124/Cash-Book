import React from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Key,
  EyeOff,
  Server,
  Database,
  ArrowRight,
  Activity,
  Fingerprint,
} from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, index }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col rounded-[2rem] border border-border bg-card/30 px-8 py-8 shadow-sm backdrop-blur-xl overflow-hidden hover:shadow-2xl transition-shadow duration-500"
    >
      {/* Spotlight Effect (Inner Glow) */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-500 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(90, 117, 246, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      {/* Spotlight Edge (Border Glow) */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-500 group-hover:opacity-100 z-0 border-2 border-primary/50"
        style={{
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              250px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
          maskImage: useMotionTemplate`
            radial-gradient(
              250px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
        }}
      />

      <div className="relative z-10 flex-grow transition-transform duration-500 group-hover:-translate-y-2">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-background shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:border-primary/50 group-hover:bg-primary/5">
          <Icon className="h-8 w-8 text-primary transition-colors duration-500 group-hover:text-primary/70" />
        </div>

        <h3 className="mb-4 text-2xl font-bold text-foreground tracking-tight transition-colors duration-300 group-hover:text-primary">
          {title}
        </h3>

        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

export const Security = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-background relative overflow-hidden pt-12 group"
    >
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />

        {/* Base Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at center, var(--color-border) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(ellipse 60% 60% at 50% 0%, black, transparent)",
          }}
        />

        {/* Hover Highlight Grid Pattern */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(90, 117, 246, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(90, 117, 246, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            WebkitMaskImage: useMotionTemplate`
              radial-gradient(
                150px circle at ${mouseX}px ${mouseY}px,
                black 0%,
                transparent 100%
              )
            `,
            maskImage: useMotionTemplate`
              radial-gradient(
                150px circle at ${mouseX}px ${mouseY}px,
                black 0%,
                transparent 100%
              )
            `,
          }}
        />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center h-[240px] mb-8"
          >
            {/* Pulsing Rings */}
            {[1, 2, 3, 4].map((ring) => (
              <motion.div
                key={ring}
                className="absolute inset-0 m-auto rounded-full border border-primary/40 bg-primary/5"
                style={{ width: "140px", height: "140px" }}
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
            <div className="relative z-10 w-28 h-28 bg-card rounded-full shadow-2xl shadow-primary/30 flex items-center justify-center border border-border">
              <ShieldCheck className="w-12 h-12 text-primary" strokeWidth={2} />
            </div>

            {/* Extra subtle glow behind shield */}
            <div className="absolute inset-0 m-auto w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-3xl font-black tracking-tight text-foreground mb-6 leading-[1.1]"
          >
            Fort Knox for your <br />
            <span className="text-primary">Financial Data</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            We implement military-grade zero-knowledge encryption across all
            enterprise databases. Data remains entirely encrypted — meaning not
            even our highest-level administrators can access your sensitive
            information.
          </motion.p>
        </div>

        {/* Floating Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-24">
          {[
            { icon: Lock, text: "AES-256 Encryption" },
            { icon: Activity, text: "99.99% Uptime" },
            { icon: Fingerprint, text: "Zero-Knowledge" },
          ].map((badge, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{
                delay: 0.4 + idx * 0.15,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="flex items-center gap-2 px-6 py-3 bg-card/80 backdrop-blur-md border border-border rounded-full shadow-sm cursor-default transition-shadow hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50"
            >
              <badge.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">{badge.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          <FeatureCard
            index={0}
            icon={Lock}
            title="Encryption at Rest"
            description="All data is encrypted at rest using AES-256. Even if physical storage media were compromised, your data remains secure."
          />
          <FeatureCard
            index={1}
            icon={Key}
            title="Per-Tenant Vaults"
            description="Each business gets its own unique encryption keys, isolated from others to prevent cross-tenant data leakage."
          />
          <FeatureCard
            index={2}
            icon={EyeOff}
            title="Zero Visibility"
            description="Your raw financial data is encrypted such that Cash Book staff have zero visibility into your ledger entries."
          />
          <FeatureCard
            index={3}
            icon={Server}
            title="E2E Encryption"
            description="Data transmitted between your device and our servers is secured using modern TLS 1.3 protocols, guaranteeing safety."
          />
          <FeatureCard
            index={4}
            icon={Database}
            title="Automated Backups"
            description="Encrypted data is backed up continuously across regions. Highly redundant infrastructure ensures zero data loss."
          />
          <FeatureCard
            index={5}
            icon={ShieldCheck}
            title="Continuous Audits"
            description="Regular third-party security audits and penetration testing ensure compliance with global data protection standards."
          />
        </div>

        {/* Call to Action CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[3rem] bg-card/50 backdrop-blur-xl border border-border p-8 md:p-10 text-center overflow-hidden shadow-2xl"
        >
          {/* Animated background gradient for CTA */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-50 pointer-events-none" />

          {/* Glowing orb behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-3xl font-bold text-foreground mb-6 tracking-tight">
              Have Security Questions?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              Our dedicated security engineering team is available to discuss
              our architecture, encryption standards, and compliance in detail.
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:security@cashbook.com"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(90,117,246,0.3)] hover:shadow-[0_0_40px_rgba(90,117,246,0.5)]"
            >
              Contact Security Team
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

