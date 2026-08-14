import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Loader2, Phone, XCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const normalizePhone = (value) => {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('0')) return `254${digits.slice(1)}`;
  if (digits.startsWith('7') || digits.startsWith('1')) return `254${digits}`;
  return digits;
};

const MpesaPaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { clearCart } = useCart();
  const order = state?.order;
  const [phone, setPhone] = useState(normalizePhone(state?.customerPhone || ''));
  const [status, setStatus] = useState('ready');
  const [message, setMessage] = useState('');
  const [activeOrder, setActiveOrder] = useState(order);

  useEffect(() => { if (!order) navigate('/checkout', { replace: true }); }, [order, navigate]);

  useEffect(() => {
    if (status !== 'waiting' || !activeOrder?._id) return undefined;
    const poll = async () => {
      try {
        const response = await fetch(`/api/orders/${activeOrder._id}/payment-status`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Could not check payment status.');
        setActiveOrder(data.order);
        if (data.order.paymentStatus === 'Paid') { clearCart(); setStatus('paid'); }
        if (data.order.paymentStatus === 'Failed') { setMessage(data.order.daraja?.resultDesc || 'The M-Pesa payment was not completed.'); setStatus('failed'); }
      } catch (error) { setMessage(error.message); }
    };
    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [status, activeOrder?._id, token, clearCart]);

  const paymentSummary = useMemo(() => activeOrder?.items || [], [activeOrder]);
  const sendStkPush = async (event) => {
    event.preventDefault();
    if (!/^254(7|1)\d{8}$/.test(phone)) { setMessage('Enter a valid Kenyan number, e.g. 254712345678.'); return; }
    setStatus('sending'); setMessage('');
    try {
      const response = await fetch(`/api/orders/${activeOrder._id}/stk-push`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ phone }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to send the M-Pesa prompt.');
      setActiveOrder(data.order); setStatus('waiting');
    } catch (error) { setMessage(error.message); setStatus('ready'); }
  };

  if (!order) return null;
  const content = status === 'paid' ? <>
    <CheckCircle2 className="mx-auto mb-5 text-emerald-600" size={60} /><h1 className="text-3xl font-black">Payment received</h1>
    <p className="mt-3 text-gray-600">Your FreshCart order is confirmed.</p><p className="mt-4 text-sm text-gray-500">Receipt: {activeOrder?.daraja?.receiptNumber || 'Confirmed by M-Pesa'}</p>
    <Link to="/products" className="btn-primary mt-8 inline-block">Continue shopping</Link>
  </> : status === 'failed' ? <>
    <XCircle className="mx-auto mb-5 text-rose-600" size={60} /><h1 className="text-3xl font-black">Payment not completed</h1><p className="mt-3 text-gray-600">{message}</p>
    <button onClick={() => { setStatus('ready'); setMessage(''); }} className="btn-primary mt-8">Try again</button>
  </> : <>
    <h1 className="text-3xl font-black text-gray-900">Pay with M-Pesa</h1><p className="mt-2 text-gray-500">A secure Daraja STK prompt will be sent to your phone.</p>
    <div className="my-7 rounded-2xl bg-gray-50 p-5 text-left"><p className="font-bold">Order #{activeOrder?._id?.slice(-8).toUpperCase()}</p>{paymentSummary.map((item, index) => <div key={index} className="mt-2 flex justify-between text-sm text-gray-600"><span>{item.name} × {item.quantity}</span><span>KES {item.price * item.quantity}</span></div>)}<div className="mt-4 flex justify-between border-t pt-4 text-lg font-black"><span>Total</span><span>KES {activeOrder?.totalAmount}</span></div></div>
    {status === 'waiting' ? <div className="py-5"><Loader2 className="mx-auto animate-spin text-emerald-600" size={40} /><h2 className="mt-4 text-xl font-bold">Check your phone</h2><p className="mt-2 text-gray-500">Enter your M-Pesa PIN to approve the payment. This page checks the confirmed Daraja status automatically.</p><button onClick={() => setStatus('ready')} className="mt-6 text-sm font-bold text-emerald-700">Send a new prompt</button></div> : <form onSubmit={sendStkPush} className="text-left"><label className="mb-2 block text-sm font-bold">M-Pesa phone number</label><div className="relative"><Phone className="absolute left-4 top-4 text-gray-400" size={18} /><input value={phone} onChange={(e) => setPhone(normalizePhone(e.target.value))} maxLength="12" placeholder="254712345678" className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4" /></div>{message && <p className="mt-3 text-sm text-rose-600">{message}</p>}<button disabled={status === 'sending'} className="btn-primary mt-6 w-full disabled:opacity-60">{status === 'sending' ? 'Sending prompt…' : 'Send M-Pesa prompt'}</button></form>}
  </>;
  return <div className="min-h-screen bg-gray-50 px-4 pb-24 pt-32"><div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">{content}</div></div>;
};

export default MpesaPaymentPage;
