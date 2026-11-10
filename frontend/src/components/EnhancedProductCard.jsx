import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Eye, Check } from 'lucide-react';
import { useCart } from '../context/EnhancedCartContext';

const CATEGORY_GRADIENT = {
  'Fruits':            'from-orange-500 to-amber-400',
  'Vegetables':        'from-teal-500 to-emerald-400',
  'Herbs':             'from-purple-500 to-violet-400',
  'Smoothies':         'from-blue-500 to-cyan-400',
  'Lifestyle Bundles': 'from-pink-500 to-rose-400',
};
const defaultGradient = 'from-emerald-600 to-green-400';

const EnhancedProductCard = ({ product }) => {
  const { addToCart, isUpdating } = useCart();
  const [isFavorite,    setIsFavorite]    = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [addedToCart,   setAddedToCart]   = useState(false);

  const gradient = CATEGORY_GRADIENT[product.category] ?? defaultGradient;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUpdating) return;
    setAddedToCart(true);
    await addToCart(product, 1);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(f => !f);
    if (navigator.vibrate) navigator.vibrate([30]);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(v => !v);
  };

  return (
    <div className="group flex flex-col h-full relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">

      {/* Image */}
      <div className="relative overflow-hidden h-64">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category badge */}
        <span className={`absolute top-4 left-4 bg-gradient-to-r ${gradient} text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg z-20`}>
          {product.category}
        </span>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <button
            onClick={handleFavorite}
            className={`p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 ${isFavorite ? 'bg-pink-500 text-white scale-110' : 'bg-white/90 text-gray-800 hover:scale-110'}`}
            aria-label="Toggle favourite"
          >
            <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
          </button>
          <button
            onClick={handleQuickView}
            className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 shadow-lg hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
            aria-label="Quick view"
          >
            <Eye size={18} />
          </button>
        </div>

        {/* Stock bar */}
        {product.stock !== undefined && (
          <div className="absolute bottom-3 left-4 right-4 z-20">
            <div className="bg-white/80 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${product.stock > 20 ? 'bg-green-500' : product.stock > 5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Added confirmation overlay */}
        {addedToCart && (
          <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center z-30">
            <div className="bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-3">
              <div className="bg-green-500 p-2 rounded-full">
                <Check size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Added to cart!</p>
                <p className="text-sm text-gray-500">Check your cart to continue</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <Link to={`/product/${product._id || product.id}`} className="flex-1 p-6 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
        )}
        <div className="mt-auto flex items-baseline justify-between">
          <span className="text-2xl font-black text-gray-900">KES {product.price}</span>
          <span className="text-sm text-gray-400">/{product.unit}</span>
        </div>
        {product.soldCount > 0 && (
          <p className="text-xs text-gray-400 mt-2">{product.soldCount} sold</p>
        )}
      </Link>

      {/* Add to cart */}
      <div className="px-6 pb-6">
        <button
          onClick={handleAddToCart}
          disabled={isUpdating}
          className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r ${gradient} hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md`}
        >
          {addedToCart ? (
            <><Check size={20} className="animate-bounce" /> Added!</>
          ) : (
            <><ShoppingBag size={20} /> {isUpdating ? 'Adding…' : 'Add to Cart'}</>
          )}
        </button>

        <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
          <button
            onClick={handleFavorite}
            className={`flex items-center gap-1.5 transition-colors ${isFavorite ? 'text-pink-500 font-semibold' : 'hover:text-pink-500'}`}
          >
            <Heart size={15} className={isFavorite ? 'fill-current' : ''} />
            {isFavorite ? 'Saved' : 'Save'}
          </button>
          <button onClick={handleQuickView} className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
            <Eye size={15} /> Quick View
          </button>
          <span>Free delivery</span>
        </div>
      </div>

      {/* Quick view panel */}
      {showQuickView && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-40 rounded-3xl p-6 flex flex-col">
          <button
            onClick={() => setShowQuickView(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl leading-none"
          >
            ✕
          </button>
          <h4 className="text-lg font-bold mb-2">{product.name}</h4>
          <p className="text-gray-600 text-sm mb-4 flex-1">{product.description || 'No description available.'}</p>
          <button
            onClick={handleAddToCart}
            className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r ${gradient}`}
          >
            Add to Cart — KES {product.price}
          </button>
        </div>
      )}
    </div>
  );
};

export default EnhancedProductCard;
