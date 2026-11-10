import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, ShoppingBag, Heart } from 'lucide-react';

// ─── Context ────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};

// ─── Provider ────────────────────────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    setTimeout(() => removeToast(id), duration);
    return id;
  }, [removeToast]);

  const toastSuccess  = useCallback((msg, dur) => showToast(msg, 'success',  dur), [showToast]);
  const toastError    = useCallback((msg, dur) => showToast(msg, 'error',    dur), [showToast]);
  const toastInfo     = useCallback((msg, dur) => showToast(msg, 'info',     dur), [showToast]);
  const toastWarning  = useCallback((msg, dur) => showToast(msg, 'warning',  dur), [showToast]);
  const toastCart     = useCallback((msg, dur) => showToast(msg, 'cart',     dur ?? 3500), [showToast]);
  const toastFavorite = useCallback((msg, dur) => showToast(msg, 'favorite', dur ?? 3500), [showToast]);

  return (
    <ToastContext.Provider value={{
      toasts, showToast, removeToast,
      toastSuccess, toastError, toastInfo, toastWarning, toastCart, toastFavorite,
    }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// ─── Internal helpers (plain functions, not components) ───────────────────────
function getIcon(type) {
  switch (type) {
    case 'success':  return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'error':    return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'warning':  return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case 'info':     return <Info        className="w-5 h-5 text-blue-500" />;
    case 'cart':     return <ShoppingBag className="w-5 h-5 text-orange-500" />;
    case 'favorite': return <Heart       className="w-5 h-5 text-pink-500" />;
    default:         return <Info        className="w-5 h-5 text-gray-500" />;
  }
}

function getBg(type) {
  switch (type) {
    case 'success':  return 'bg-green-50  border-green-200';
    case 'error':    return 'bg-red-50    border-red-200';
    case 'warning':  return 'bg-yellow-50 border-yellow-200';
    case 'info':     return 'bg-blue-50   border-blue-200';
    case 'cart':     return 'bg-orange-50 border-orange-200';
    case 'favorite': return 'bg-pink-50   border-pink-200';
    default:         return 'bg-gray-50   border-gray-200';
  }
}

function getBar(type) {
  switch (type) {
    case 'success':  return 'bg-green-500';
    case 'error':    return 'bg-red-500';
    case 'warning':  return 'bg-yellow-500';
    case 'info':     return 'bg-blue-500';
    case 'cart':     return 'bg-gradient-to-r from-orange-400 to-amber-400';
    case 'favorite': return 'bg-gradient-to-r from-pink-400 to-rose-400';
    default:         return 'bg-gray-400';
  }
}

// ─── Single toast item ────────────────────────────────────────────────────────
const ToastItem = ({ toast, onRemove }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const step = 100 / (toast.duration / 50);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) { clearInterval(interval); return 0; }
        return prev - step;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [toast.duration]);

  return (
    <div
      className={`relative flex items-start gap-3 ${getBg(toast.type)} border rounded-2xl shadow-xl px-4 py-3 mb-3 w-80 max-w-sm`}
      role="alert"
    >
      <div className="mt-0.5 shrink-0">{getIcon(toast.type)}</div>
      <p className="flex-1 text-sm font-medium text-gray-800 pr-4">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/50 rounded-b-2xl overflow-hidden">
        <div
          className={`h-full ${getBar(toast.type)} transition-none`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// ─── Container (rendered inside the provider) ────────────────────────────────
const ToastContainer = () => {
  const { toasts, removeToast } = useContext(ToastContext);
  if (!toasts.length) return null;
  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col items-end pointer-events-none"
      aria-live="polite"
    >
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
};

export default ToastProvider;
