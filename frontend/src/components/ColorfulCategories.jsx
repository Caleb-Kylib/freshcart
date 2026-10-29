import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const ColorfulCategories = () => {
  const categories = [
    {
      name: 'Fruits',
      description: 'Seasonal & exotic fruits',
      image: '/products/apple.jpg',
      gradient: 'from-brand-fruits to-brand-vibrant-orange',
      icon: '🍎',
      count: '24 items'
    },
    {
      name: 'Vegetables',
      description: 'Fresh farm vegetables',
      image: '/products/carrots.jpg',
      gradient: 'from-brand-vegetables to-brand-teal',
      icon: '🥦',
      count: '18 items'
    },
    {
      name: 'Herbs',
      description: 'Aromatic & medicinal',
      image: '/products/freshmint.jpg',
      gradient: 'from-brand-herbs to-brand-vibrant-purple',
      icon: '🌿',
      count: '12 items'
    },
    {
      name: 'Smoothies',
      description: 'Cold-pressed juices',
      image: '/products/berry-blast.jpg',
      gradient: 'from-brand-smoothies to-brand-vibrant-blue',
      icon: '🥤',
      count: '8 items'
    },
    {
      name: 'Bundles',
      description: 'Curated wellness packs',
      image: '/products/fruit-basket.jpg',
      gradient: 'from-brand-vibrant-pink to-brand-vibrant-purple',
      icon: '🎁',
      count: '6 items'
    },
    {
      name: 'Organic',
      description: 'Certified organic produce',
      image: '/products/leafy-greens.jpg',
      gradient: 'from-brand-primary to-brand-secondary',
      icon: '🌱',
      count: '15 items'
    },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/30 to-white" />
      
      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-brand-vibrant-orange/10 to-brand-vibrant-yellow/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-brand-vibrant-purple/10 to-brand-vibrant-pink/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Header with gradient text */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-gradient-to-r from-brand-vibrant-orange to-brand-vibrant-yellow rounded-full animate-pulse" />
            <div className="w-3 h-3 bg-gradient-to-r from-brand-vibrant-blue to-brand-smoothies rounded-full animate-pulse animation-delay-300" />
            <div className="w-3 h-3 bg-gradient-to-r from-brand-vibrant-purple to-brand-vibrant-pink rounded-full animate-pulse animation-delay-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-vibrant-orange via-brand-primary to-brand-vibrant-purple">
              Shop by Category
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our vibrant aisles filled with farm-fresh goodness
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/products?category=${category.name}`}
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-90`} />
              
              {/* Image overlay */}
              <div className="absolute inset-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 h-64 flex flex-col justify-between">
                {/* Top section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{category.icon}</div>
                    <div className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {category.count}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-white mb-2">{category.name}</h3>
                  <p className="text-gray-200 text-sm">{category.description}</p>
                </div>

                {/* Bottom section with arrow */}
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore collection
                  </span>
                  <div className="bg-white/20 p-3 rounded-full group-hover:bg-white/30 transition-all duration-300 group-hover:translate-x-2">
                    <ChevronRight className="text-white" size={20} />
                  </div>
                </div>
              </div>

              {/* Hover effect border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-3xl transition-all duration-500" />
            </Link>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-vibrant-orange to-brand-vibrant-yellow hover:from-brand-vibrant-yellow hover:to-brand-vibrant-orange text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 active:scale-95"
          >
            View All Categories
            <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ColorfulCategories;