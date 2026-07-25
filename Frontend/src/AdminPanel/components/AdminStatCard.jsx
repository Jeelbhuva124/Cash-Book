import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const AdminStatCard = ({ 
  title, 
  value, 
  change, 
  isIncrease = true, 
  icon: Icon, 
  colorAccent = "primary",
  description 
}) => {
  const accentClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    info: "bg-sky-500/10 text-sky-500 border-sky-500/20"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </span>
          <h3 className="text-2xl font-black text-foreground tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-2xl border ${accentClasses[colorAccent] || accentClasses.primary}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
        {change && (
          <div className={`flex items-center gap-1 font-bold ${isIncrease ? "text-emerald-500" : "text-rose-500"}`}>
            {isIncrease ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{change}</span>
          </div>
        )}
        {description && (
          <span className="text-muted-foreground font-medium">
            {description}
          </span>
        )}
      </div>
    </motion.div>
  );
};
