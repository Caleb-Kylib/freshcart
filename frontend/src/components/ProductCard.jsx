import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/EnhancedCartContext';

const getCategoryGradient = (category) => {
  const map = {
    'Fruits':            'from-orange-500 to-amber-400',
    'Vegetables':        'from-teal-500  to-emerald-400',
    'Herbs':             'from-purple-500 to-violet-400',
    'Smoothies':         'from-blue-500  to-cyan-400',
    'Lifestyle Bundles': 'from-pink-500  to-rose-400',
  };
  return map[category] ?? 'from-emerald-600 to-green-400';
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const gradient = getCategoryGradient(product.category);

  return (
    <div className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">

      {/* Image */}
      <div className="relative overflow-hidden h-56 bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Category pill */}
        <span className={`absolute top-3 left-3 bg-gradient-to-r ${gradient} text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow`}>
          {product.category}
        </span>

        {/* Quick-add button */}
        <button
          onClick={(e) => { e.preventDefault(); addToCart(product); }}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg text-gray-700 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 duration-300"
          aria-label={`Quick add ${product.name}`}
        >
          <Plus size={18} />
        </button>

        {/* Stock bar */}
        {product.stock !== undefined && (
          <div className="absolute bottom-0 inset-x-0 px-3 pb-2">
            <div className="h-1.5 bg-white/40 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className={`h-full rounded-full ${product.stock > 20 ? 'bg-green-400' : product.stock > 5 ? 'bg-yellow-400' : 'bg-red-400'}`}
                style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <Link to={`/product/${product._id || product.id}`} className="flex-1 flex flex-col p-5">
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-1 line-clamp-2 group-hover:text-emerald-700 transition-colors">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{product.description}</p>
        )}

        <div className="mt-auto flex items-baseline justify-between">
          <span className="text-xl font-black text-gray-900">KES {product.price}</span>
          <span className="text-sm text-gray-400">/{product.unit}</span>
        </div>
      </Link>

      {/* Add to cart */}
      <div className="px-5 pb-5">
        <button
          onClick={() => addToCart(product)}
          className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r ${gradient} hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md`}
        >
          <ShoppingBag size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
