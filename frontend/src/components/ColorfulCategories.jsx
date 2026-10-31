import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const ColorfulCategories = () => {
  const categories = [
    {
      name: 'Fruits',
      description: 'Seasonal & exotic fruits',
      image: '/products/mango.jpg',
    },
    {
      name: 'Vegetables',
      description: 'Fresh farm vegetables',
      image: '/products/grocery-section.jpg',
    },
    {
      name: 'Herbs',
      description: 'Aromatic & medicinal',
      image: '/products/freshmint.jpg',
    },
    {
      name: 'Smoothies',
      description: 'Cold-pressed juices',
      image: '/products/strawberryjuice.jpg',
    },
    {
      name: 'Bundles',
      description: 'Curated wellness packs',
      image: '/products/grocery-box.jpg',
    },
    {
      name: 'Organic',
      description: 'Certified organic produce',
      image: '/products/home-banner.jpg',
    },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/30 to-white" />
      
      <div className="container-custom relative z-10">
        {/* Header with gradient text */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-800 via-green-600 to-emerald-500">
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
              className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden bg-emerald-50">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-5">
                <div>
                  <h3 className="text-xl font-black text-gray-900 transition-colors group-hover:text-emerald-700">{category.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{category.description}</p>
                  <span className="mt-3 inline-block text-sm font-semibold text-emerald-700">
                    Explore collection
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-800 hover:to-emerald-700 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-lg shadow-green-900/20 hover:shadow-xl hover:shadow-green-900/30 active:scale-95"
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