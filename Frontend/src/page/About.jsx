import React from 'react';
import { Target, Users, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const About = () => {
  return (
    <div className="flex flex-col min-h-screen pt-16 bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6"
        >
          Empowering Your <span className="text-primary">Financial Freedom</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-muted-foreground leading-relaxed"
        >
          Cash Book is built on a simple premise: managing your money shouldn't be a second job. We provide intuitive, powerful tools to help you track expenses, manage ledgers, and achieve your financial goals with absolute clarity.
        </motion.p>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-card border-t border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Target, title: 'Precision', desc: 'Accurate tracking down to the last rupee. No discrepancies, just data.' },
              { icon: Shield, title: 'Security', desc: 'Bank-grade encryption ensures your financial data is for your eyes only.' },
              { icon: Users, title: 'Accessibility', desc: 'Built for everyone—from students tracking allowances to business owners managing ledgers.' },
              { icon: Zap, title: 'Speed', desc: 'Lightning-fast entry and real-time syncing across all your devices.' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-background border border-border rounded-3xl shadow-sm hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
