import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete item", 
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel"
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative bg-white dark:bg-[#1e2229] border border-border dark:border-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-6 w-full max-w-[440px] z-10 space-y-5"
          >
            {/* Header / Title */}
            <div className="flex justify-between items-start">
              <h3 className="text-[18px] font-bold text-slate-800 dark:text-foreground tracking-tight">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description / Message */}
            <p className="text-[14px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              {message}
            </p>

            {/* Actions Footer */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-white hover:bg-slate-50 dark:bg-transparent dark:hover:bg-muted/40 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs transition-all shadow-[0_4px_12px_rgba(239,68,68,0.2)] hover:shadow-[0_4px_16px_rgba(239,68,68,0.3)] cursor-pointer"
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

export default DeleteConfirmModal;
