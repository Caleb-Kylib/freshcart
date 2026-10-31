import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShoppingCart, ArrowRight, Truck, ShieldCheck, Leaf, Clock, BadgeCheck } from 'lucide-react';
import storeImage from '../assets/store.jpg';

const ColorfulHero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTIgMGEyIDIgMCAxIDAgNCAwYTIgMiAwIDEgMC00IDAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-20" />
        
        {/* Animated floating shapes */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-gradient-to-r from-green-500/25 to-lime-300/25 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-r from-emerald-500/30 to-green-300/30 rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-emerald-400/25 to-lime-300/25 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
      </div>

      <div className="container-custom relative z-10 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="text-white">
            {/* Colorful promo badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white px-5 py-3 rounded-full text-sm font-bold shadow-lg animate-float">
                <Zap size={18} className="animate-pulse" />
                Free delivery on orders above KES 2,000
              </div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-700 to-green-500 text-white px-5 py-3 rounded-full text-sm font-bold shadow-lg animate-float animation-delay-500">
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
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-200 via-green-100 to-emerald-200">
                Delivered to Your
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 via-lime-100 to-green-200">
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
                className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-bold px-10 py-5 rounded-2xl transition-all shadow-2xl shadow-green-900/30 hover:shadow-green-900/50 active:scale-95 transform hover:-translate-y-1"
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
                { icon: <BadgeCheck size={20} />, text: 'Certified Farms', color: 'from-brand-vibrant-green to-brand-vibrant-lime' },
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

          {/* Featured produce image */}
          <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[560px]">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-brand-vibrant-lime/40 to-brand-teal/40 blur-2xl" />
            <div className="relative h-full min-h-[320px] sm:min-h-[420px] lg:min-h-[560px] overflow-hidden rounded-[2rem] border border-white/30 shadow-2xl">
              <img
                src={storeImage}
                alt="Fresh fruit and vegetables ready for your kitchen"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/5 to-transparent" />
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/90 px-4 py-2 text-sm font-bold text-emerald-800 shadow-lg backdrop-blur-sm sm:left-7 sm:top-7">
                <Leaf size={16} />
                Fresh from local farms
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-lime-200">Picked fresh, delivered fast</p>
                <h2 className="max-w-md text-3xl font-black leading-tight text-white sm:text-4xl">
                  Bring home a little more freshness.
                </h2>
                <Link
                  to="/products?category=Fruits"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-emerald-800 shadow-lg transition hover:bg-lime-100"
                >
                  Explore fresh produce
                  <ArrowRight size={18} />
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