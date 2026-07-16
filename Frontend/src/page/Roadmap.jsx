import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Map, CheckCircle2, CircleDashed, Clock, Sparkles, Check } from 'lucide-react';

const roadmapItems = [
  {
    phase: "Q3 2026",
    status: "completed",
    title: "Core Foundation",
    description: "Launch of the initial platform with essential ledger features.",
    features: [
      "User authentication & security",
      "Daily transaction logging",
      "Basic income/expense dashboards",
      "Cloud sync integration"
    ],
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  },
  {
    phase: "Q4 2026",
    status: "in-progress",
    title: "Advanced Analytics & Reporting",
    description: "Deep dive into financial health with better visualization tools.",
    features: [
      "PDF & Excel export generation",
      "Category-wise spending trends",
      "Custom date range filtering",
      "Budget goal setting"
    ],
    icon: CircleDashed,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20"
  },
  {
    phase: "Q1 2027",
    status: "planned",
    title: "AI Integration & Automation",
    description: "Smart features to automate repetitive financial tasks.",
    features: [
      "Receipt scanning (OCR)",
      "Automated categorization via AI",
      "Predictive expense forecasting",
      "Smart anomaly detection"
    ],
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  {
    phase: "Q2 2027",
    status: "planned",
    title: "Business & Collaboration",
    description: "Tools for small businesses and family finance management.",
    features: [
      "Multi-user account access",
      "Role-based permissions",
      "Invoice generation",
      "Vendor & Client ledgers"
    ],
    icon: Sparkles,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20"
  }
];

export const Roadmap = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="flex flex-col min-h-screen pt-16 bg-background">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
        >
          <Map className="w-8 h-8 text-primary" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6"
        >
          Product <span className="text-primary">Roadmap</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground leading-relaxed"
        >
          See what we've built, what we're working on right now, and what's coming next to make Cash Book even better.
        </motion.p>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-background relative overflow-hidden" ref={containerRef}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Central Axis (Static Grey Line) */}
          <div className="absolute left-1/2 top-8 bottom-8 w-[2px] bg-border hidden md:block transform -translate-x-1/2 rounded-full" />
          
          {/* Active Progress Line (Green/Primary) */}
          <motion.div 
            className="absolute left-1/2 top-8 bottom-8 w-[2px] bg-primary hidden md:block transform -translate-x-1/2 origin-top rounded-full z-10"
            style={{ scaleY }}
          />

          <div className="space-y-12 relative z-20">
            {roadmapItems.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <div key={index} className="relative flex flex-col md:flex-row items-start justify-between group">
                  
                  {/* Content Container (Card) */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -40 : 40, y: 20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`w-full md:w-[48%] flex flex-col bg-card border border-border/60 p-6 rounded-2xl relative z-20 ${isEven ? 'md:order-1 md:text-right md:items-end' : 'md:order-3 md:text-left md:items-start'}`}
                  >
                    
                    {/* Header Group */}
                    <div className={`flex items-center gap-4 mb-5 w-full ${isEven ? 'flex-row-reverse justify-start' : 'flex-row justify-start'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className={`flex flex-col ${isEven ? 'items-end' : 'items-start'}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${item.color} mb-0.5`}>
                          {item.phase} · {item.status}
                        </span>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">{item.title}</h3>
                      </div>
                    </div>

                    <p className={`text-muted-foreground text-sm leading-relaxed mb-6 w-full ${isEven ? 'text-right' : 'text-left'}`}>
                      {item.description}
                    </p>

                    <ul className={`space-y-3 w-full flex flex-col ${isEven ? 'items-end' : 'items-start'}`}>
                      {item.features.map((feature, fIndex) => (
                        <li key={fIndex} className={`flex items-center gap-3 text-sm font-medium text-foreground/80 ${isEven ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={3} />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Empty space for zig-zag alignment */}
                  <div className={`hidden md:block w-[48%] ${isEven ? 'order-3' : 'order-1'}`} />

                  {/* Center Node (Dot Effect) */}
                  <div className="hidden md:flex absolute left-1/2 top-7 transform -translate-x-1/2 justify-center z-30">
                    <div className="w-4 h-4 rounded-full bg-muted border-2 border-background ring-[4px] ring-background flex items-center justify-center overflow-hidden">
                      <motion.div 
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true, margin: "-45% 0px" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-full h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
