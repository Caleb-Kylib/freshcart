import { X, CheckCircle, AlertCircle } from "lucide-react";

const ConfirmationModal = ({ isOpen, onClose, type = 'info', title, message, onConfirm, confirmText = 'Confirm', loading = false }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-[#2E7D32]" />;
      case 'warning':
        return <AlertCircle className="w-12 h-12 text-[#F9A825]" />;
      case 'error':
        return <AlertCircle className="w-12 h-12 text-[#D32F2F]" />;
      default:
        return <CheckCircle className="w-12 h-12 text-[#00A300]" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-[#2E7D32] hover:bg-[#1B5E20]';
      case 'warning':
        return 'bg-[#F9A825] hover:bg-[#F57F17]';
      case 'error':
        return 'bg-[#D32F2F] hover:bg-[#B71C1C]';
      default:
        return 'bg-[#00A300] hover:bg-[#087E08]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-[#999] hover:text-[#1B2A1F] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 text-center">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>

          <h2 className="text-xl font-bold text-[#1B2A1F] mb-3">{title}</h2>
          <p className="text-[#666] text-sm leading-relaxed mb-8">{message}</p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-[#E2E8E0] text-[#1B2A1F] font-medium rounded-lg hover:bg-[#F7FAF5] transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 text-white font-medium rounded-lg transition-colors ${getButtonColor()} disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={loading}
            >
              {loading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
