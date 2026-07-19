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
      
      // Automatically log success and info toasts as persistent notifications
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
            time: 'Just now',
            unread: true,
            timestamp: Date.now()
          };
          
          const updated = [newNotif, ...currentNotifications].slice(0, 50); // Keep last 50
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

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};
