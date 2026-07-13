import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Phone, AlertCircle, Loader, CheckCircle2, XCircle, ShoppingBag, Calendar, Truck, Clock } from 'lucide-react';

const MpesaLogo = () => (
  <div className="flex items-center gap-1.5 font-sans tracking-tighter select-none">
    <span className="text-[#00A651] font-black text-3xl">m-</span>
    <div className="bg-[#E02626] text-white px-2 py-0.5 rounded-lg text-xs font-black tracking-widest uppercase rotate-[-2deg] shadow-sm">
      pesa
    </div>
  </div>
);

const MpesaPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  // Retrieve order details passed from Checkout
  const order = location.state?.order;
  const initialPhone = location.state?.customerPhone || '';
  const totalAmount = location.state?.order?.totalAmount || 0;

  // UX helper: clean and pre-format standard Kenyan numbers to 254 format
  const formatKenyanNumber = (phone) => {
    let cleaned = phone.replace(/\D/g, ''); // strip non-digits
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.slice(1);
    } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      cleaned = '254' + cleaned;
    }
    return cleaned;
  };

  const [step, setStep] = useState(0); // 0: Input, 1: Processing, 2: Success, 3: Failed
  const [phoneNumber, setPhoneNumber] = useState(formatKenyanNumber(initialPhone));
  const [phoneError, setPhoneError] = useState('');
  
  // Simulation states
  const [statusText, setStatusText] = useState('Sending payment request...');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [transactionId, setTransactionId] = useState('');
  const [failureReason, setFailureReason] = useState('');

  // Auto-redirect if no order details exist (someone directly browsing)
  useEffect(() => {
    if (!order) {
      navigate('/checkout');
    }
  }, [order, navigate]);

  // Generate random transaction ID and failure reasons on mount
  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let txId = 'RK';
    for (let i = 0; i < 8; i++) {
      txId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTransactionId(txId);

    const reasons = [
      'Insufficient balance in your M-Pesa account.',
      'Transaction cancelled by user (invalid PIN entered or prompt rejected).',
      'M-Pesa system timeout. Safe connection could not be established.'
    ];
    setFailureReason(reasons[Math.floor(Math.random() * reasons.length)]);
  }, [step]);

  // Simulation timeline ticker
  useEffect(() => {
    if (step !== 1) return;

    const timer = setInterval(() => {
      setElapsedTime((prev) => {
        const next = prev + 1;
        if (next >= 8) {
          clearInterval(timer);
          
          // 15% random failure probability
          const isFailed = Math.random() < 0.15;
          if (isFailed) {
            setStep(3); // Failed state
          } else {
            clearCart(); // Clear cart state on successful payment
            setStep(2); // Success state
          }
          return 8;
        }

        // Timeline status updates
        if (next >= 5) {
          setStatusText('Confirming payment...');
        } else if (next >= 2) {
          setStatusText('Waiting for customer PIN entry...');
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, clearCart]);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setPhoneError('');

    // Validations: Required, starts with 254, exactly 12 digits
    if (!phoneNumber) {
      setPhoneError('Phone number is required.');
      return;
    }

    if (!phoneNumber.startsWith('254')) {
      setPhoneError('Phone number must start with country code 254.');
      return;
    }

    if (phoneNumber.length !== 12) {
      setPhoneError('M-Pesa phone number must be exactly 12 digits long (e.g. 2547XXXXXXXX).');
      return;
    }

    // Trigger simulation
    setElapsedTime(0);
    setStatusText('Sending payment request...');
    setStep(1);
  };

  const handleTryAgain = () => {
    setStep(0);
    setElapsedTime(0);
  };

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 flex items-center justify-center font-sans px-4">
      <div className="w-full max-w-[540px] relative">
        <AnimatePresence mode="wait">
          
          {/* STEP 0: PHONE INPUT & SUMMARY */}
          {step === 0 && (
            <motion.div
              key="step-input"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgb(0,0,0,0.03)] border border-gray-100 p-8 md:p-10"
            >
              {/* Logo / Header */}
              <div className="flex flex-col items-center mb-8 border-b border-gray-50 pb-6">
                <MpesaLogo />
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 mt-3 uppercase tracking-wider">
                  <Lock size={12} className="text-[#00A651]" />
                  <span>Secure Checkout</span>
                </div>
                <p className="text-gray-500 text-sm mt-1.5 text-center">
                  Complete your payment securely using M-Pesa STK Push.
                </p>
              </div>

              {/* Order Summary */}
              <div className="bg-[#F8FAFC] rounded-2xl p-5 mb-8 border border-gray-100">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200/50">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#00A651]">Order Items</h4>
                  <span className="text-xs font-bold text-gray-400">{order.items?.length || 0} Products</span>
                </div>
                <div className="max-h-[140px] overflow-y-auto scrollbar-hide space-y-3.5 pr-1">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-gray-700 font-medium truncate max-w-[280px]">
                        {item.name} <span className="text-gray-400 text-xs">x{item.quantity}</span>
                      </span>
                      <span className="text-gray-900 font-mono text-xs">KES {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200/50 mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-gray-500">
                    <span>Delivery Fee</span>
                    <span>KES 0</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-gray-900 pt-2">
                    <span>Total Amount</span>
                    <span className="text-lg font-mono text-[#00A651]">KES {totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-gray-500 ml-1">
                    M-Pesa Phone Number
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00A651] transition-colors" size={18} />
                    <input
                      type="text"
                      maxLength={12}
                      placeholder="254712345678"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value.replace(/\D/g, '')); // only digits
                        setPhoneError('');
                      }}
                      className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-[#00A651] focus:ring-4 focus:ring-green-50 outline-none transition-all text-sm font-semibold tracking-wide"
                    />
                  </div>
                  {phoneError ? (
                    <div className="flex items-center gap-1.5 text-xs text-brand-error font-semibold mt-1.5 ml-1">
                      <AlertCircle size={14} className="flex-shrink-0" />
                      <span>{phoneError}</span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 font-medium ml-1">
                      Provide number format: <strong>2547XXXXXXXX</strong> or <strong>2541XXXXXXXX</strong>
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-[#00A651] text-white py-4 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-emerald-600 transition-all flex items-center justify-center gap-2.5 shadow-md shadow-emerald-500/10"
                >
                  Pay with M-Pesa
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* STEP 1: SIMULATOR PROCESSING SCREEN */}
          {step === 1 && (
            <motion.div
              key="step-processing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgb(0,0,0,0.03)] border border-gray-100 p-8 md:p-10 text-center"
            >
              {/* Mpesa secure branding */}
              <div className="flex justify-center mb-6">
                <MpesaLogo />
              </div>

              {/* Status Header */}
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-2">
                Waiting for M-Pesa Confirmation
              </h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8 font-medium">
                An M-Pesa payment request has been sent to <span className="font-bold text-gray-800">+{phoneNumber}</span>.
              </p>

              {/* Simulated Phone STK push Prompt mockup */}
              <div className="max-w-[260px] mx-auto bg-gray-950 text-white rounded-[2.2rem] p-4 border-[6px] border-gray-800 shadow-xl mb-8 relative overflow-hidden">
                {/* Speaker pill */}
                <div className="w-12 h-3 bg-gray-800 rounded-full mx-auto mb-5"></div>
                
                {/* STK Dialog Card */}
                <motion.div
                  animate={{ scale: [0.98, 1.02, 0.98] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="bg-white text-gray-900 rounded-2xl p-4 text-left border border-gray-100 shadow-md text-xs font-semibold"
                >
                  <div className="flex items-center gap-1 text-[#00A651] font-black tracking-tighter text-sm mb-2 border-b border-gray-100 pb-1.5">
                    M-Pesa STK
                  </div>
                  <p className="text-gray-700 leading-snug mb-3">
                    Do you want to pay KES {totalAmount} to FreshCart?
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center text-gray-400 font-mono tracking-widest text-[10px] select-none mb-3">
                    ENTER PIN: ****
                  </div>
                  <div className="flex gap-2 text-[10px] font-bold">
                    <span className="flex-1 text-center py-1.5 border border-gray-200 rounded-md text-gray-400">Cancel</span>
                    <span className="flex-1 text-center py-1.5 bg-[#00A651] text-white rounded-md">Send</span>
                  </div>
                </motion.div>

                {/* Home Indicator bar */}
                <div className="w-16 h-1 bg-gray-800 rounded-full mx-auto mt-6"></div>
              </div>

              {/* Progress timeline */}
              <div className="max-w-xs mx-auto space-y-4 mb-8 text-left">
                <div className="flex items-center gap-3.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border font-bold text-[10px] ${
                    elapsedTime >= 2 
                      ? 'bg-[#00A651] border-[#00A651] text-white' 
                      : 'border-emerald-600 text-emerald-600 bg-emerald-50'
                  }`}>
                    {elapsedTime >= 2 ? '✓' : '1'}
                  </div>
                  <span className={`text-xs font-bold ${elapsedTime >= 2 ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                    Sending payment request...
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border font-bold text-[10px] ${
                    elapsedTime >= 5 
                      ? 'bg-[#00A651] border-[#00A651] text-white' 
                      : elapsedTime >= 2 
                        ? 'border-emerald-600 text-emerald-600 bg-emerald-50 animate-pulse'
                        : 'border-gray-200 text-gray-400 bg-white'
                  }`}>
                    {elapsedTime >= 5 ? '✓' : '2'}
                  </div>
                  <span className={`text-xs font-bold ${
                    elapsedTime >= 5 
                      ? 'text-gray-400 line-through' 
                      : elapsedTime >= 2 
                        ? 'text-[#00A651]'
                        : 'text-gray-400'
                  }`}>
                    Waiting for customer confirmation...
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border font-bold text-[10px] ${
                    elapsedTime >= 7
                      ? 'bg-[#00A651] border-[#00A651] text-white'
                      : elapsedTime >= 5 
                        ? 'border-emerald-600 text-emerald-600 bg-emerald-50 animate-pulse'
                        : 'border-gray-200 text-gray-400 bg-white'
                  }`}>
                    {elapsedTime >= 7 ? '✓' : '3'}
                  </div>
                  <span className={`text-xs font-bold ${
                    elapsedTime >= 7 
                      ? 'text-gray-400 line-through' 
                      : elapsedTime >= 5 
                        ? 'text-[#00A651]' 
                        : 'text-gray-400'
                  }`}>
                    Confirming transaction...
                  </span>
                </div>
              </div>

              {/* Loader and wait helper text */}
              <div className="flex flex-col items-center border-t border-gray-50 pt-6">
                <Loader className="animate-spin text-[#00A651] mb-3" size={28} />
                <p className="text-xs text-gray-500 font-semibold tracking-wide">
                  {statusText}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                  <Clock size={12} />
                  <span>Estimated wait: <strong>{8 - elapsedTime}s</strong> remaining</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: SIMULATED SUCCESS SCREEN */}
          {step === 2 && (
            <motion.div
              key="step-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgb(0,0,0,0.03)] border border-gray-100 p-8 md:p-10 text-center"
            >
              {/* Checkmark Indicator */}
              <div className="w-20 h-20 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center mx-auto mb-6 text-[#00A651]">
                <CheckCircle2 size={44} className="stroke-[2.5]" />
              </div>

              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8 font-medium">
                Your payment was processed securely. Thank you for your order!
              </p>

              {/* Receipt Information Card */}
              <div className="bg-[#F8FAFC] rounded-3xl p-6 mb-8 border border-gray-100 text-left space-y-3.5 font-semibold text-sm">
                <div className="flex items-center justify-between pb-2.5 border-b border-gray-200/50">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Receipt Summary</span>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-black tracking-wide uppercase">
                    Paid
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Transaction ID</span>
                  <span className="text-gray-800 font-mono text-xs">{transactionId}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Amount Paid</span>
                  <span className="text-[#00A651] font-mono text-base font-black">KES {totalAmount}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Phone Number</span>
                  <span className="text-gray-800 font-medium">+{phoneNumber}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Date & Time</span>
                  <span className="text-gray-800 font-medium flex items-center gap-1.5 text-xs">
                    <Calendar size={14} className="text-gray-400" />
                    {new Date().toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2.5 border-t border-gray-200/50">
                  <span className="text-gray-400 font-medium">Estimated Delivery</span>
                  <span className="text-amber-600 font-bold flex items-center gap-1.5 text-xs">
                    <Truck size={14} className="text-amber-500" />
                    Within 2 Hours
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/products')}
                  className="w-full bg-[#00A651] hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-md shadow-emerald-500/10 active:scale-98"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all active:scale-98"
                >
                  View My Orders
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SIMULATED FAILURE SCREEN */}
          {step === 3 && (
            <motion.div
              key="step-failed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgb(0,0,0,0.03)] border border-gray-100 p-8 md:p-10 text-center"
            >
              {/* Failure Indicator */}
              <div className="w-20 h-20 bg-rose-50 rounded-full border border-rose-100 flex items-center justify-center mx-auto mb-6 text-brand-error">
                <XCircle size={44} className="stroke-[2.5]" />
              </div>

              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                Payment Failed
              </h2>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8 font-medium">
                Your M-Pesa transaction could not be processed. Please check the details and try again.
              </p>

              {/* Error Explanation Card */}
              <div className="bg-rose-50 border border-rose-100 rounded-3xl p-5 mb-8 text-left">
                <p className="text-xs font-black uppercase tracking-wider text-brand-error mb-2">
                  Failure Reason
                </p>
                <p className="text-gray-600 text-sm font-semibold leading-relaxed">
                  {failureReason}
                </p>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleTryAgain}
                  className="px-4 py-4 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-2xl font-black text-xs tracking-widest uppercase transition-all active:scale-95"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/checkout')}
                  className="px-4 py-4 bg-[#E02626] text-white hover:bg-red-700 rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-md active:scale-95"
                >
                  Return to Checkout
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default MpesaPaymentPage;
