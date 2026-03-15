import React from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Globe, ArrowRight } from 'lucide-react';

const Contact = () => {
    const contactInfo = [
        {
            icon: <Phone size={24} />,
            title: "Phone",
            details: "+254 700 000 000",
            subDetails: "Mon-Sat 8:00 AM - 6:00 PM",
            color: "bg-blue-50 text-blue-600"
        },
        {
            icon: <Mail size={24} />,
            title: "Email",
            details: "hello@freshcart.co.ke",
            subDetails: "24/7 Support Response",
            color: "bg-emerald-50 text-emerald-600"
        },
        {
            icon: <MapPin size={24} />,
            title: "Location",
            details: "The Well Mall, Karen",
            subDetails: "Nairobi, Kenya",
            color: "bg-orange-50 text-orange-600"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Hero Banner Section */}
            <div className="relative py-32 px-4 mb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=2574&auto=format&fit=crop"
                        alt="Contact Us Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
                </div>
                <div className="container-custom relative z-10 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                    <span className="bg-primary/20 text-primary-light border border-primary/30 py-1.5 px-4 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6 inline-block backdrop-blur-md">
                        Get In Touch
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-8">
                        We'd Love to <br />
                        <span className="text-primary italic">Hear from You</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-xl text-gray-200 font-medium leading-relaxed">
                        Have questions about our fresh produce or delivery zones? Our team is here to help you bring the farm to your table.
                    </p>
                </div>
            </div>

            <div className="container-custom pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {contactInfo.map((info, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white hover:-translate-y-2 transition-all duration-500 group animate-in fade-in slide-in-from-left-4 duration-700"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <div className={`w-14 h-14 ${info.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                                    {info.icon}
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">{info.title}</h3>
                                <p className="font-bold text-gray-800 text-lg mb-1">{info.details}</p>
                                <p className="text-gray-500 font-medium text-sm">{info.subDetails}</p>
                            </div>
                        ))}

                        {/* Social Links */}
                        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group animate-in fade-in slide-in-from-left-4 duration-700 delay-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full"></div>
                            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                                <Globe size={20} className="text-primary" /> Follow Us
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {['Instagram', 'Facebook', 'Twitter', 'WhatsApp'].map((social) => (
                                    <a
                                        key={social}
                                        href="#"
                                        className="py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-primary hover:border-primary transition-all text-center"
                                    >
                                        {social}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-gray-200 border border-gray-100 relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 blur-[100px] rounded-full -mr-20 -mt-20"></div>

                            <div className="relative z-10">
                                <h2 className="text-3xl font-black text-gray-900 mb-10 flex items-center gap-4">
                                    <MessageSquare size={32} className="text-primary" /> Send us a Message
                                </h2>

                                <form className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-gray-700 ml-1 uppercase tracking-widest">Full Name</label>
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-gray-800"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-gray-700 ml-1 uppercase tracking-widest">Email Address</label>
                                            <input
                                                type="email"
                                                placeholder="john@example.com"
                                                className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-gray-800"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-700 ml-1 uppercase tracking-widest">Subject</label>
                                        <select className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-gray-800 appearance-none">
                                            <option>General Inquiry</option>
                                            <option>Order Support</option>
                                            <option>Wholesale/Partnering</option>
                                            <option>Feedback</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-700 ml-1 uppercase tracking-widest">Your Message</label>
                                        <textarea
                                            placeholder="How can we help you today?"
                                            className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-gray-800 min-h-[200px] resize-none"
                                        ></textarea>
                                    </div>

                                    <button className="w-full md:w-auto bg-primary text-white font-black px-12 py-6 rounded-3xl transition-all shadow-xl shadow-emerald-200 hover:bg-emerald-700 transform active:scale-95 flex items-center justify-center gap-4 group">
                                        Send Message <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Google Maps Embed */}
                <div className="rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200 border-8 border-white bg-white h-[600px] relative animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <iframe
                        title="FreshCart Location - The Well Mall Karen"
                        src="https://maps.app.goo.gl/d9J9SYhZcNxmafdR7"
                        className="w-full h-full border-0 grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>

                    {/* Floating Info Tag on Map */}
                    <div className="absolute bottom-10 left-10 right-10 md:left-auto md:w-96 bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/50 animate-in fade-in slide-in-from-right-10 duration-1000 delay-500">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                                <MapPin size={32} />
                            </div>
                            <div>
                                <h4 className="font-black text-xl text-gray-900 leading-tight">Visit Our Hub</h4>
                                <p className="text-gray-500 font-bold text-sm mt-1">The Well Mall, Karen, Nairobi</p>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Store Hours</p>
                                <p className="font-bold text-gray-800 text-sm">8am - 8pm Daily</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Parking</p>
                                <p className="font-bold text-gray-800 text-sm">Free Secure Slot</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
