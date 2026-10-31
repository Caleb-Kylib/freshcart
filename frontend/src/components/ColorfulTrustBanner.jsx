import React from 'react';
import { Truck, Timer, ShieldCheck, BadgeCheck, Package, HeadphonesIcon as Support } from 'lucide-react';

const ColorfulTrustBanner = () => {
  const trustItems = [
    {
      icon: <Truck size={24} />,
      title: 'Free Delivery',
      description: 'Orders over KES 2,000',
      gradient: 'from-brand-vibrant-green to-brand-primary',
      delay: '0'
    },
    {
      icon: <Timer size={24} />,
      title: 'Same-Day Delivery',
      description: 'Order before 12 PM',
      gradient: 'from-brand-primary to-brand-vibrant-blue',
      delay: '100'
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Freshness Guarantee',
      description: 'Or your money back',
      gradient: 'from-brand-vibrant-green to-brand-primary',
      delay: '200'
    },
    {
      icon: <BadgeCheck size={24} />,
      title: 'Certified Organic',
      description: 'From local farms',
      gradient: 'from-brand-primary to-brand-vibrant-blue',
      delay: '300'
    },
    {
      icon: <Package size={24} />,
      title: 'Careful Packaging',
      description: 'Eco-friendly materials',
      gradient: 'from-brand-vibrant-blue to-brand-vibrant-green',
      delay: '400'
    },
    {
      icon: <Support size={24} />,
      title: '24/7 Support',
      description: 'Always here to help',
      gradient: 'from-brand-vibrant-green to-brand-primary',
      delay: '500'
    },
  ];

  return (
    <section className="py-12 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-vibrant-blue/5 via-brand-vibrant-green/5 to-brand-vibrant-lime/5">
        {/* Animated dots pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48cGF0aCBkPSJNMjAgMjBtLTEgMGEgMSAxIDAgMSAwIDIgMGExIDEgMCAxIDAtMiAwIiBmaWxsPSJyZ2JhKDEwLCAxODQsIDk3LCAwLjA1KSIvPjwvZz48L3N2Zz4=')]" />
        
        {/* Floating shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-brand-vibrant-orange/10 to-brand-vibrant-yellow/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-brand-vibrant-green/10 to-brand-vibrant-lime/10 rounded-full blur-3xl animate-float animation-delay-1000" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className={`group relative p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 hover:border-transparent shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-in slide-in-from-bottom fade-in animation-delay-${item.delay}`}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
              
              {/* Gradient border on hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-2xl transition-all duration-500" />

              <div className="relative z-10">
                {/* Icon with gradient background */}
                <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg ring-1 ring-green-900/10 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}>
                  {item.icon}
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-700 transition-all duration-300">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  {item.description}
                </p>

                {/* Animated indicator */}
                <div className="mt-4 flex items-center">
                  <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-1000 group-hover:w-full`}
                      style={{ width: '70%' }}
                    />
                  </div>
                  <div className="ml-2 w-2 h-2 bg-green-500 rounded-full transition-all duration-300 group-hover:bg-emerald-700" />
                </div>
              </div>

              {/* Sparkle effect */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
              </div>
            </div>
          ))}
        </div>

        {/* Trust message */}
        <div className="text-center mt-12 pt-8 border-t border-gray-100">
          <p className="text-gray-600 text-lg">
            Trusted by <span className="font-bold text-brand-primary">5,000+</span> Nairobi households for fresh, organic groceries delivered with care ❤️
          </p>
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="w-5 h-5 text-yellow-400 fill-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-gray-600 text-sm ml-2">4.9/5 from 500+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ColorfulTrustBanner;