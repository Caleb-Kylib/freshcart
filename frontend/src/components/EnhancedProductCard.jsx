import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShoppingBag, Heart, Eye, Check, Star } from 'lucide-react';
import { useCart } from '../context/EnhancedCartContext';

const EnhancedProductCard = ({ product }) => {
    const { addToCart, isUpdating } = useCart();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showQuickView, setShowQuickView] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    
    // Get category-specific color
    const getCategoryColor = (category) => {
        const categoryMap = {
            'Fruits': 'from-brand-fruits to-brand-vibrant-orange',
            'Vegetables': 'from-brand-vegetables to-brand-teal',
            'Herbs': 'from-brand-herbs to-brand-vibrant-green',
            'Smoothies': 'from-brand-smoothies to-brand-vibrant-blue',
            'Lifestyle Bundles': 'from-brand-vibrant-lime to-brand-vibrant-green',
            'default': 'from-brand-primary to-brand-secondary'
        };
        
        return categoryMap[category] || categoryMap.default;
    };
    
    const categoryColor = getCategoryColor(product.category);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isUpdating) return;
        
        setAddedToCart(true);
        await addToCart(product, 1);
        
        // Reset added state after animation
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        
        // Add haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([30]);
        }
    };

    const handleQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowQuickView(!showQuickView);
    };

    return (
        <div 
            className="card group h-full flex flex-col relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image container with interactive overlay */}
            <div className="relative overflow-hidden h-64">
                {/* Main image */}
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Category badge with animation */}
                <div className={`absolute top-4 left-4 bg-gradient-to-r ${categoryColor} text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg z-20 transform transition-all duration-300 ${isHovered ? 'translate-x-0' : '-translate-x-2 opacity-90'}`}>
                    {product.category}
                </div>
                
                {/* Interactive buttons overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                    {/* Favorite button */}
                    <button
                        onClick={handleFavorite}
                        className={`p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 transform ${isFavorite ? 'bg-gradient-to-r from-brand-vibrant-lime to-brand-vibrant-green text-white scale-110' : 'bg-white/90 text-gray-800 hover:bg-white hover:scale-110'}`}
                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <Heart size={18} className={isFavorite ? "fill-current" : ""} />
                    </button>
                    
                    {/* Quick view button */}
                    <button
                        onClick={handleQuickView}
                        className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                        title="Quick view"
                    >
                        <Eye size={18} />
                    </button>
                </div>
                
                {/* Stock indicator with animation */}
                <div className="absolute bottom-4 left-4 right-4 z-20">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full h-2 overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ${product.stock > 20 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : product.stock > 5 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`}
                            style={{ width: `${Math.min((product.stock || 0) * 5, 100)}%` }}
                        />
                    </div>
                    <div className="text-xs text-white font-bold mt-1 text-center backdrop-blur-sm bg-black/40 rounded-full px-2 py-1 inline-block transform transition-all duration-300 hover:scale-105">
                        {product.stock || 'Many'} in stock
                    </div>
                </div>
                
                {/* Added to cart confirmation */}
                {addedToCart && (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/10 backdrop-blur-sm flex items-center justify-center z-30 animate-in fade-in duration-300">
                        <div className="bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-3">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-full">
                                <Check size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Added to cart!</p>
                                <p className="text-sm text-gray-600">Check your cart to continue</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Product info */}
            <Link to={`/product/${product._id || product.id}`} className="flex-1 p-6 flex flex-col group/link">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover/link:text-transparent group-hover/link:bg-clip-text group-hover/link:bg-gradient-to-r group-hover/link:from-brand-primary group-hover/link:to-brand-vibrant-blue transition-all duration-300 line-clamp-2">
                    {product.name}
                </h3>
                
                {product.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 group-hover/link:text-gray-700 transition-colors duration-300">
                        {product.description}
                    </p>
                )}
                
                <div className="mt-auto">
                    {/* Price and rating row */}
                    <div className="flex items-baseline justify-between mb-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-gray-900 group-hover/link:text-transparent group-hover/link:bg-clip-text group-hover/link:bg-gradient-to-r group-hover/link:from-brand-vibrant-orange group-hover/link:to-brand-vibrant-yellow transition-all duration-300">
                                KES {product.price}
                            </span>
                            <span className="text-sm text-gray-500">/{product.unit}</span>
                            
                            {/* Discount badge if applicable */}
                            {product.originalPrice && (
                                <span className="text-sm text-gray-400 line-through ml-2">
                                    KES {product.originalPrice}
                                </span>
                            )}
                        </div>
                        
                        {/* Rating stars with animation */}
                        <div className="flex items-center group/rating">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className={`w-4 h-4 transition-all duration-300 ${star <= 4 ? 'text-yellow-400 fill-yellow-400 group-hover/rating:scale-110 group-hover/rating:text-yellow-500' : 'text-gray-300 group-hover/rating:text-gray-400'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-xs text-gray-500 ml-1 group-hover/rating:text-gray-600 transition-colors">
                                (4.0)
                            </span>
                        </div>
                    </div>
                    
                    {/* Sales count with animation */}
                    {product.soldCount > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-brand-vibrant-orange to-brand-vibrant-yellow rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min((product.soldCount || 0) * 2, 100)}%` }}
                                />
                            </div>
                            <span className="whitespace-nowrap">{product.soldCount} sold</span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Add to cart button with enhanced interaction */}
            <div className="px-6 pb-6 pt-0">
                <button
                    onClick={handleAddToCart}
                    disabled={isUpdating}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden ${categoryColor}`}
                >
                    {/* Button background animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                    
                    {/* Button content */}
                    <div className="relative z-10 flex items-center justify-center gap-3">
                        {addedToCart ? (
                            <>
                                <Check size={20} className="animate-bounce" />
                                Added!
                            </>
                        ) : (
                            <>
                                <ShoppingBag size={20} className={isUpdating ? 'animate-pulse' : ''} />
                                {isUpdating ? 'Adding...' : 'Add to Cart'}
                                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">+</span>
                            </>
                        )}
                    </div>
                </button>
                
                {/* Quick actions row */}
                <div className="flex items-center justify-between mt-3">
                    <button
                        onClick={handleFavorite}
                        className={`flex items-center gap-1.5 text-sm transition-all duration-300 ${isFavorite ? 'text-brand-vibrant-green font-bold' : 'text-gray-500 hover:text-brand-vibrant-green'}`}
                    >
                        <Heart size={16} className={isFavorite ? "fill-current" : ""} />
                        {isFavorite ? 'Saved' : 'Save'}
                    </button>
                    
                    <button
                        onClick={handleQuickView}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-vibrant-blue transition-colors duration-300"
                    >
                        <Eye size={16} />
                        Quick View
                    </button>
                    
                    <span className="text-xs text-gray-400">
                        Free delivery
                    </span>
                </div>
            </div>
            
            {/* Hover effect border */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-3xl pointer-events-none transition-all duration-500" />
            
            {/* Quick view modal (simplified) */}
            {showQuickView && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-40 rounded-3xl p-6 flex flex-col animate-in fade-in duration-300">
                    <button
                        onClick={() => setShowQuickView(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                    <h4 className="text-lg font-bold mb-3">Quick View</h4>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                    <div className="mt-auto">
                        <button
                            onClick={handleAddToCart}
                            className={`w-full py-3 rounded-lg font-bold text-white ${categoryColor}`}
                        >
                            Add to Cart - KES {product.price}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedProductCard;