import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../utils/cn';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (type: ToastType, title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = `toast_${Date.now()}_${Math.random()}`;
      const newToast: ToastMessage = { id, type, title, message };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast viewport */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2 sm:p-0">
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-utility-success shrink-0" />,
            error: <AlertCircle className="w-5 h-5 text-brand-red shrink-0" />,
            warning: <AlertCircle className="w-5 h-5 text-utility-warning shrink-0" />,
            info: <Info className="w-5 h-5 text-utility-info shrink-0" />,
          };

          const borders = {
            success: 'border-utility-success/40 bg-brand-black-card text-white shadow-2xl',
            error: 'border-brand-red/50 bg-brand-black-card text-white shadow-2xl',
            warning: 'border-utility-warning/40 bg-brand-black-card text-white shadow-2xl',
            info: 'border-utility-info/40 bg-brand-black-card text-white shadow-2xl',
          };

          return (
            <div
              key={toast.id}
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-2xl transition-all animate-in slide-in-from-bottom-5 duration-200',
                borders[toast.type]
              )}
            >
              {icons[toast.type]}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white tracking-tight">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-brand-white/70 mt-0.5">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/40 hover:text-white transition-colors p-1"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4 text-brand-red" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
