import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShoppingCart, ArrowRight, Truck, ShieldCheck, Leaf, Clock, BadgeCheck } from 'lucide-react';

const ColorfulHero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-vibrant-blue via-brand-vibrant-purple to-brand-vibrant-pink opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTIgMGEyIDIgMCAxIDAgNCAwYTIgMiAwIDEgMC00IDAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-20" />
        
        {/* Animated floating shapes */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-gradient-to-r from-brand-vibrant-orange/30 to-brand-vibrant-yellow/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-r from-brand-vibrant-purple/30 to-brand-vibrant-pink/30 rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-brand-teal/30 to-brand-vibrant-blue/30 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
      </div>

      <div className="container-custom relative z-10 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="text-white">
            {/* Colorful promo badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-vibrant-orange to-brand-vibrant-yellow text-white px-5 py-3 rounded-full text-sm font-bold shadow-lg animate-float">
                <Zap size={18} className="animate-pulse" />
                Free delivery on orders above KES 2,000
              </div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-vibrant-purple to-brand-vibrant-pink text-white px-5 py-3 rounded-full text-sm font-bold shadow-lg animate-float animation-delay-500">
                <Clock size={18} />
                Same-day delivery
              </div>
            </div>

            {/* Main heading with gradient text */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-200">
                Fresh Groceries
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-vibrant-yellow via-brand-vibrant-orange to-brand-vibrant-coral">
                Delivered to Your
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-teal via-brand-vibrant-blue to-brand-vibrant-purple">
                Door in Hours
              </span>
            </h1>

            <p className="text-xl text-gray-200 mb-10 max-w-lg leading-relaxed backdrop-blur-sm bg-white/5 rounded-2xl p-6">
              Shop from Nairobi's freshest selection of organic fruits, vegetables, juices, and more. Farm-picked daily, delivered same-day with love ❤️
            </p>

            {/* Colorful CTAs */}
            <div className="flex flex-wrap gap-5 mb-12">
              <Link
                to="/products"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-vibrant-orange to-brand-vibrant-yellow hover:from-brand-vibrant-yellow hover:to-brand-vibrant-orange text-white font-bold px-10 py-5 rounded-2xl transition-all shadow-2xl shadow-orange-500/30 hover:shadow-3xl hover:shadow-orange-500/50 active:scale-95 transform hover:-translate-y-1"
              >
                <ShoppingCart size={22} />
                Start Shopping Now
              </Link>
              <Link
                to="/products?category=Fruits"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white font-bold px-10 py-5 rounded-2xl border-2 border-white/30 backdrop-blur-lg transition-all hover:border-white/50"
              >
                Today's Fresh Deals
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            {/* Colorful trust indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { icon: <Truck size={20} />, text: 'Same-Day Delivery', color: 'from-brand-vibrant-blue to-brand-smoothies' },
                { icon: <ShieldCheck size={20} />, text: 'Freshness Guarantee', color: 'from-brand-primary to-brand-teal' },
                { icon: <Leaf size={20} />, text: '100% Organic', color: 'from-brand-vegetables to-brand-teal' },
                { icon: <BadgeCheck size={20} />, text: 'Certified Farms', color: 'from-brand-vibrant-purple to-brand-vibrant-pink' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`bg-gradient-to-r ${item.color} p-3 rounded-xl shadow-lg`}>
                    <div className="text-white">{item.icon}</div>
                  </div>
                  <span className="text-sm font-semibold text-white">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Featured deals card */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              {/* Card background effects */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-r from-brand-vibrant-orange/20 to-brand-vibrant-yellow/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-r from-brand-vibrant-purple/20 to-brand-vibrant-pink/20 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-4 py-2 rounded-full animate-pulse shadow-lg">🔥 HOT DEAL</span>
                  <span className="text-gray-300 text-sm font-semibold">Ends Sunday</span>
                </div>
                
                <h3 className="text-white text-3xl font-bold mb-3">Weekend Super Saver</h3>
                <p className="text-gray-300 mb-8 text-lg">Up to 40% off on fresh vegetables and cold-pressed juices 🥤</p>

                {/* Colorful product preview */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { img: "/products/carrots.jpg", name: "Carrots", price: "120", color: "from-orange-500 to-amber-500" },
                    { img: "/products/Broccoligreen.jpg", name: "Broccoli", price: "250", color: "from-emerald-500 to-green-500" },
                    { img: "/products/cucumber.jpg", name: "Cucumber", price: "80", color: "from-lime-500 to-emerald-500" },
                  ].map((item, i) => (
                    <div key={i} className="relative group">
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                      <div className="bg-white/10 rounded-xl p-4 text-center border border-white/10 backdrop-blur-sm">
                        <img src={item.img} alt={item.name} className="w-full h-20 object-cover rounded-lg mb-3 shadow-lg" />
                        <p className="text-white text-sm font-bold">{item.name}</p>
                        <p className="text-emerald-300 text-xs font-bold mt-1">KES {item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to="/products?category=Vegetables"
                  className="block text-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50"
                >
                  🥦 Shop Fresh Vegetables
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gradient-to-b from-white to-transparent rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default ColorfulHero;