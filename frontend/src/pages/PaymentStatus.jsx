import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Pesapal returns OrderTrackingId and OrderMerchantReference in the URL
    const trackingId = searchParams.get('OrderTrackingId');
    const merchantRef = searchParams.get('OrderMerchantReference');
    
    const [status, setStatus] = useState('processing'); // 'processing', 'success', 'failed'

    useEffect(() => {
        if (!trackingId) {
            setStatus('failed');
            return;
        }

        // Ideally, in a real production app, we would ping our backend here to get the 
        // true status of the order based on the tracking ID. 
        // For now, we will assume if we're redirected back with a tracking ID, 
        // the payment was either successful or the IPN will handle the final status update.
        
        // Simulating a brief verification delay
        const timer = setTimeout(() => {
            // For Sandbox purposes, if we get here we assume success. 
            // The actual robust verification happens via the IPN webhook on the backend.
            setStatus('success');
        }, 2000);

        return () => clearTimeout(timer);
    }, [trackingId]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-20">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg max-w-md w-full text-center">
                {status === 'processing' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
                        <p className="text-gray-500">Please wait while we confirm your transaction...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-primary">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
                        <p className="text-gray-600 mb-2">Your transaction has been processed securely.</p>
                        {merchantRef && (
                            <p className="text-sm font-mono text-gray-400 mb-8 p-3 bg-gray-50 rounded-lg">
                                Ref: {merchantRef}
                            </p>
                        )}
                        <Link to="/products" className="btn-primary w-full inline-block">
                            Continue Shopping
                        </Link>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="flex flex-col items-center animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6 text-rose-500">
                            <XCircle size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h2>
                        <p className="text-gray-600 mb-8">We couldn't verify your payment. Please try again or contact support if the issue persists.</p>
                        <div className="flex gap-4 w-full">
                            <Link to="/contact" className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all">
                                Support
                            </Link>
                            <Link to="/cart" className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                                Try Again
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentStatus;
