import { useToast } from '../context/ToastContext';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const TOAST_CONFIG = {
  success: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50/95 dark:bg-emerald-950/90',
    border: 'border-emerald-200/90 dark:border-emerald-800/80',
    textColor: 'text-emerald-900 dark:text-emerald-100',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    dismissBorder: 'border-emerald-300 dark:border-emerald-700',
    dismissBg: 'bg-emerald-100/90 dark:bg-emerald-900/90 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-rose-50/95 dark:bg-rose-950/90',
    border: 'border-rose-200/90 dark:border-rose-800/80',
    textColor: 'text-rose-900 dark:text-rose-100',
    iconColor: 'text-rose-600 dark:text-rose-400',
    dismissBorder: 'border-rose-300 dark:border-rose-700',
    dismissBg: 'bg-rose-100/90 dark:bg-rose-900/90 text-rose-600 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-800',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50/95 dark:bg-amber-950/90',
    border: 'border-amber-200/90 dark:border-amber-800/80',
    textColor: 'text-amber-900 dark:text-amber-100',
    iconColor: 'text-amber-600 dark:text-amber-400',
    dismissBorder: 'border-amber-300 dark:border-amber-700',
    dismissBg: 'bg-amber-100/90 dark:bg-amber-900/90 text-amber-600 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50/95 dark:bg-blue-950/90',
    border: 'border-blue-200/90 dark:border-blue-800/80',
    textColor: 'text-blue-900 dark:text-blue-100',
    iconColor: 'text-blue-600 dark:text-blue-400',
    dismissBorder: 'border-blue-300 dark:border-blue-700',
    dismissBg: 'bg-blue-100/90 dark:bg-blue-900/90 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800',
  },
};

function ToastItem({ toast, onRemove }) {
  const cfg = TOAST_CONFIG[toast.type] ?? TOAST_CONFIG.info;
  const Icon = cfg.icon;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.85, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`relative flex items-center gap-3 min-w-[280px] max-w-md ${cfg.bg} ${cfg.border} border rounded-2xl shadow-xl shadow-black/10 backdrop-blur-xl px-5 py-3.5`}
    >
      {/* Floating Top-Left Close Button (Matching Screenshot Reference) */}
      <button
        onClick={() => onRemove(toast.id)}
        className={`absolute -top-2 -left-2 w-5 h-5 rounded-full border ${cfg.dismissBorder} ${cfg.dismissBg} flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer`}
        aria-label="Dismiss alert"
      >
        <X className="w-3 h-3 stroke-[2.5]" />
      </button>

      {/* Icon */}
      <div className="shrink-0">
        <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
      </div>

      {/* Message */}
      <p className={`flex-1 text-sm font-semibold leading-snug ${cfg.textColor}`}>
        {toast.message}
      </p>
    </motion.li>
  );
}

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <ul
      aria-live="polite"
      aria-label="Alerts & Notifications"
      className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
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
