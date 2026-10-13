import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, X, Loader2 } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed with this action? This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // 'danger' | 'warning' | 'info'
  isLoading = false
}) => {
  const getIconAndColors = () => {
    switch (type) {
      case 'warning':
        return {
          icon: <AlertCircle className="w-6 h-6" />,
          iconBg: 'bg-amber-50 dark:bg-amber-950/30 text-amber-500',
          confirmBtn: 'bg-amber-500 hover:bg-amber-600 hover:shadow-amber-500/10'
        };
      case 'info':
        return {
          icon: <Info className="w-6 h-6" />,
          iconBg: 'bg-primary/10 text-primary',
          confirmBtn: 'bg-primary hover:opacity-90 hover:shadow-primary/10'
        };
      case 'danger':
      default:
        return {
          icon: <AlertTriangle className="w-6 h-6" />,
          iconBg: 'bg-red-50 dark:bg-red-950/20 text-red-500',
          confirmBtn: 'bg-red-500 hover:bg-red-600 hover:shadow-red-500/10'
        };
    }
  };

  const { icon, iconBg, confirmBtn } = getIconAndColors();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isLoading ? onClose : undefined}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-[4px]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative bg-white dark:bg-card border border-border rounded-2xl shadow-2xl w-full max-w-[430px] overflow-hidden z-10 p-6 text-foreground"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-4 right-4 p-1 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer disabled:opacity-40"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Warning Icon & Content */}
            <div className="flex gap-4 items-start mt-2">
              <div className={`p-3 rounded-full flex-shrink-0 ${iconBg}`}>
                {icon}
              </div>
              
              <div className="space-y-1.5 flex-1 pr-4">
                <h3 className="font-bold text-base text-slate-800 dark:text-foreground">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {message}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 border border-border bg-[#f8fafc] dark:bg-[#15181f] text-foreground font-semibold rounded-xl text-xs hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
              >
                {cancelText}
              </button>
              
              <button
                type="button"
                disabled={isLoading}
                onClick={async () => {
                  if (onConfirm) {
                    await onConfirm();
                  }
                  onClose();
                }}
                className={`px-4 py-2 text-white font-semibold rounded-xl text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 ${confirmBtn}`}
              >
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{confirmText}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
