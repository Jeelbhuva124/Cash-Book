import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Delete", 
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger" // danger, info
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative bg-white dark:bg-card border border-border rounded-2xl shadow-xl w-full max-w-[420px] overflow-hidden z-10 p-6 text-foreground"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Warning Icon & Content */}
            <div className="flex gap-4 items-start mt-2">
              <div className={`p-3 rounded-full flex-shrink-0 ${
                type === 'danger' 
                  ? 'bg-red-50 dark:bg-red-950/20 text-red-500' 
                  : 'bg-indigo-50 dark:bg-indigo-950/20 text-primary'
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              
              <div className="space-y-1.5 flex-1 pr-6">
                <h3 className="font-bold text-base text-slate-800 dark:text-foreground">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {message}
                </p>
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-border bg-[#f8fafc] dark:bg-[#15181f] text-foreground font-semibold rounded-xl text-xs hover:bg-muted transition-colors cursor-pointer"
              >
                {cancelText}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-4 py-2 text-white font-semibold rounded-xl text-xs hover:opacity-95 shadow-sm transition-all cursor-pointer ${
                  type === 'danger' 
                    ? 'bg-red-500 hover:shadow-red-500/10' 
                    : 'bg-primary hover:shadow-primary/10'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
