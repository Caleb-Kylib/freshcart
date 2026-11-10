import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShoppingCart, ArrowRight, Truck, ShieldCheck, Leaf, Clock, BadgeCheck } from 'lucide-react';

const ColorfulHero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">

      {/* Background image + overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/products/grocery-section.jpg"
          alt="Fresh grocery store"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/95 via-green-800/90 to-emerald-700/85" />
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="container-custom relative z-10 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div className="text-white">
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="inline-flex items-center gap-2 bg-green-600/80 text-white px-5 py-3 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
                <Zap size={18} className="animate-pulse" />
                Free delivery on orders above KES 2,000
              </div>
              <div className="inline-flex items-center gap-2 bg-emerald-700/80 text-white px-5 py-3 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
                <Clock size={18} />
                Same-day delivery
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] mb-8">
              <span className="text-white">Fresh Groceries</span><br />
              <span className="text-emerald-200">Delivered to Your</span><br />
              <span className="text-lime-300">Door in Hours</span>
            </h1>

            <p className="text-xl text-gray-200 mb-10 max-w-lg leading-relaxed bg-white/5 backdrop-blur-sm rounded-2xl p-6">
              Shop from Nairobi's freshest selection of organic fruits, vegetables, juices, and more.
              Farm-picked daily, delivered same-day with love ❤️
            </p>

            <div className="flex flex-wrap gap-5 mb-12">
              <Link
                to="/products"
                className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-10 py-5 rounded-2xl transition-all shadow-2xl active:scale-95 hover:-translate-y-1"
              >
                <ShoppingCart size={22} />
                Start Shopping Now
              </Link>
              <Link
                to="/products?category=Fruits"
                className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white font-bold px-10 py-5 rounded-2xl border-2 border-white/30 backdrop-blur-lg transition-all"
              >
                Today's Fresh Deals
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <Truck size={18} />,       text: 'Same-Day Delivery',   bg: 'bg-blue-600' },
                { icon: <ShieldCheck size={18} />,  text: 'Freshness Guarantee', bg: 'bg-emerald-600' },
                { icon: <Leaf size={18} />,          text: '100% Organic',        bg: 'bg-green-600' },
                { icon: <BadgeCheck size={18} />,   text: 'Certified Farms',     bg: 'bg-teal-600' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`${item.bg} p-2.5 rounded-xl shadow-md shrink-0`}>
                    <div className="text-white">{item.icon}</div>
                  </div>
                  <span className="text-sm font-semibold text-white leading-tight">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — image card */}
          <div className="hidden lg:block relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-emerald-400/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl aspect-[4/5]">
              <img
                src="/products/fruit-basket.jpg"
                alt="Fresh fruit basket"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-950/80 via-transparent to-transparent" />
              <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-emerald-800 shadow-lg backdrop-blur-sm">
                <Leaf size={16} />
                Fresh from local farms
              </div>
              <div className="absolute inset-x-0 bottom-0 p-7">
                <p className="text-xs font-bold uppercase tracking-widest text-lime-200 mb-2">Farm to door</p>
                <h2 className="text-3xl font-black text-white leading-tight mb-4">
                  Bring home a little more freshness.
                </h2>
                <Link
                  to="/products?category=Fruits"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-emerald-800 shadow-lg hover:bg-lime-50 transition-colors"
                >
                  Explore fresh produce <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default ColorfulHero;
