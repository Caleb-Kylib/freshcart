import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, ShoppingBag, Heart, Star } from 'lucide-react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 5000) => {
    const id = Date.now();
    const newToast = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toastSuccess = (message, duration = 5000) => 
    showToast(message, 'success', duration);
  
  const toastError = (message, duration = 5000) => 
    showToast(message, 'error', duration);
  
  const toastInfo = (message, duration = 5000) => 
    showToast(message, 'info', duration);
  
  const toastWarning = (message, duration = 5000) => 
    showToast(message, 'warning', duration);

  const toastCart = (productName, duration = 4000) => 
    showToast(`Added ${productName} to cart! 🛒`, 'cart', duration);
  
  const toastFavorite = (productName, duration = 4000) => 
    showToast(`Saved ${productName} to favorites! ❤️`, 'favorite', duration);

  return {
    toasts,
    showToast,
    removeToast,
    toastSuccess,
    toastError,
    toastInfo,
    toastWarning,
    toastCart,
    toastFavorite
  };
};

const ToastIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'error':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'warning':
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case 'info':
      return <Info className="w-5 h-5 text-blue-500" />;
    case 'cart':
      return <ShoppingBag className="w-5 h-5 text-brand-vibrant-orange" />;
    case 'favorite':
      return <Heart className="w-5 h-5 text-brand-vibrant-pink" />;
    default:
      return <Info className="w-5 h-5 text-gray-500" />;
  }
};

const ToastBackground = ({ type }) => {
  switch (type) {
    case 'success':
      return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
    case 'error':
      return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200';
    case 'warning':
      return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200';
    case 'info':
      return 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200';
    case 'cart':
      return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200';
    case 'favorite':
      return 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200';
    default:
      return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
  }
};

const ToastMessage = ({ type, message }) => {
  if (type === 'cart' || type === 'favorite') {
    return (
      <div className="flex items-center gap-3">
        <ToastIcon type={type} />
        <span className="font-medium text-gray-800">{message}</span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <ToastIcon type={type} />
      <div className="flex-1">
        <p className="font-medium text-gray-800">{message}</p>
      </div>
    </div>
  );
};

const ToastNotification = ({ toast, onRemove }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - (100 / (toast.duration / 50));
      });
    }, 50);

    return () => clearInterval(interval);
  }, [toast.duration]);

  return (
    <div className={`relative ${ToastBackground(toast.type)} border rounded-2xl shadow-xl p-4 mb-3 min-w-[300px] max-w-md transform transition-all duration-300 animate-in slide-in-from-right fade-in`}>
      <button
        onClick={() => onRemove(toast.id)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      
      <ToastMessage type={toast.type} message={toast.message} />
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-b-2xl overflow-hidden">
        <div 
          className={`h-full ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' :
            toast.type === 'warning' ? 'bg-yellow-500' :
            toast.type === 'info' ? 'bg-blue-500' :
            toast.type === 'cart' ? 'bg-gradient-to-r from-brand-vibrant-orange to-brand-vibrant-yellow' :
            'bg-gradient-to-r from-brand-vibrant-purple to-brand-vibrant-pink'
          } transition-all duration-50`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col items-end">
      {toasts.map(toast => (
        <ToastNotification
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};

// Quick action toast for common actions
export const QuickActionToast = ({ action, productName, onUndo }) => {
  const { toastCart, toastFavorite } = useToast();

  const handleAction = () => {
    if (action === 'cart') {
      toastCart(productName);
    } else if (action === 'favorite') {
      toastFavorite(productName);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[9999]">
      <div className="bg-gradient-to-r from-brand-vibrant-orange to-brand-vibrant-yellow text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom fade-in">
        <span className="font-bold">
          {action === 'cart' ? 'Added to cart!' : 'Added to favorites!'}
        </span>
        <button
          onClick={onUndo}
          className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm font-semibold transition-colors"
        >
          Undo
        </button>
        <button
          onClick={() => action === 'cart' ? window.location.href = '/cart' : window.location.href = '/favorites'}
          className="bg-white text-gray-900 hover:bg-gray-100 px-3 py-1 rounded-lg text-sm font-semibold transition-colors"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default ToastContainer;