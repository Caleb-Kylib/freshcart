import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Phone } from 'lucide-react';
import { useLocation } from 'react-router-dom';


const WhatsAppChat = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Don't show on admin pages
    if (location.pathname.startsWith('/admin')) {
        return null;
    }


    // Show button after a short delay
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const whatsappNumber = "254747723727"; // Replace with real support number
    const welcomeMessage = "Hello! 👋 Welcome to FreshCart Kenya. How can we help you today with your organic grocery order?";

    const handleChatRedirect = () => {
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi FreshCart! I have a question about my order.")}`;
        window.open(url, '_blank');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-8 right-8 z-[1000] flex flex-col items-end">
            {/* Chat Popup */}
            {isOpen && (
                <div className="mb-4 w-72 md:w-80 bg-white rounded-[2.5rem] shadow-2xl border border-emerald-50 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-emerald-600 p-6 text-white relative">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 hover:bg-white/20 p-1 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <Phone size={24} />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-emerald-600"></div>
                            </div>
                            <div>
                                <h4 className="font-black text-lg leading-tight">FreshCart Support</h4>
                                <p className="text-xs font-bold text-emerald-100 opacity-80">Online • Usually replies in 5 min</p>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 bg-gray-50/50">
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 mb-4">
                            <p className="text-sm text-gray-700 font-medium leading-relaxed">
                                {welcomeMessage}
                            </p>
                            <span className="text-[10px] text-gray-400 font-bold block mt-2 text-right">
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>

                    {/* Footer Button */}
                    <div className="p-6 pt-0 bg-gray-50/50">
                        <button
                            onClick={handleChatRedirect}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                            Start Chat on WhatsApp <Send size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group relative flex items-center justify-center w-16 h-16 rounded-[1.5rem] shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-90 ${isOpen ? 'bg-gray-900 text-white rotate-90' : 'bg-emerald-600 text-white shadow-emerald-200'}`}
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} className="animate-pulse" />}

                {!isOpen && (
                    <span className="absolute right-full mr-4 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
                        Chat with us
                    </span>
                )}

                {!isOpen && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 border-4 border-white rounded-full"></div>
                )}
            </button>
        </div>
    );
};

export default WhatsAppChat;
