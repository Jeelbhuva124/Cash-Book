import { createContext, useCallback, useContext, useState } from 'react';

const genId = () => Math.random().toString(36).slice(2, 9);

const ToastContext = createContext(undefined);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = 'info', duration = 3500) => {
      const id = genId();
      setToasts((prev) => [...prev, { id, message, type }]);

      // Log notifications persistently
      if (type === 'success' || type === 'info') {
        try {
          const stored = localStorage.getItem('cashbook_notifications');
          const currentNotifications = stored ? JSON.parse(stored) : [];
          
          let title = type === 'success' ? 'Success' : 'Notification';
          if (message.toLowerCase().includes('transaction')) title = 'Transaction Update';
          if (message.toLowerCase().includes('profile')) title = 'Profile Update';
          if (message.toLowerCase().includes('cashbook')) title = 'Cashbook Update';
          
          const newNotif = {
            id,
            title,
            message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: true,
            timestamp: Date.now()
          };
          
          const updated = [newNotif, ...currentNotifications].slice(0, 50);
          localStorage.setItem('cashbook_notifications', JSON.stringify(updated));
          window.dispatchEvent(new CustomEvent('notificationsUpdated', { detail: updated }));
        } catch (e) {
          console.error('Failed to log notification', e);
        }
      }

      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  const toastHelpers = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, toast: toastHelpers }}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};
