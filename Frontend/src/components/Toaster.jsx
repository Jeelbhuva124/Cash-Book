import { useToast } from '../context/ToastContext';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const TOAST_CONFIG = {
  success: {
    icon: CheckCircle2,
    bar: 'bg-emerald-500',
    iconColor: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  error: {
    icon: AlertCircle,
    bar: 'bg-rose-500',
    iconColor: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  warning: {
    icon: AlertTriangle,
    bar: 'bg-amber-500',
    iconColor: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  info: {
    icon: Info,
    bar: 'bg-blue-500',
    iconColor: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
};

function ToastItem({ toast, onRemove }) {
  const cfg = TOAST_CONFIG[toast.type] ?? TOAST_CONFIG.info;
  const Icon = cfg.icon;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.85, transition: { duration: 0.2 } }}
      className="relative flex items-start gap-3 w-80 max-w-full
        bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-4"
    >
      <span className={`absolute left-0 inset-y-0 w-1 rounded-l-2xl ${cfg.bar}`} />
      <span className={`mt-0.5 p-1.5 rounded-xl shrink-0 ${cfg.bg}`}>
        <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
      </span>
      <p className="flex-1 text-sm font-medium text-foreground leading-snug pt-0.5">
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 mt-0.5 p-1 rounded-lg text-muted-foreground
          hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.li>
  );
}

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <ul
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </ul>
  );
}
