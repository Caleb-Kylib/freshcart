import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    
    // Get category-specific color
    const getCategoryColor = (category) => {
        const categoryMap = {
            'Fruits': 'bg-gradient-to-r from-brand-fruits to-brand-vibrant-orange',
            'Vegetables': 'bg-gradient-to-r from-brand-vegetables to-brand-teal',
            'Herbs': 'bg-gradient-to-r from-brand-herbs to-brand-vibrant-purple',
            'Smoothies': 'bg-gradient-to-r from-brand-smoothies to-brand-vibrant-blue',
            'Lifestyle Bundles': 'bg-gradient-to-r from-brand-vibrant-pink to-brand-vibrant-purple',
            'default': 'bg-gradient-to-r from-brand-primary to-brand-secondary'
        };
        
        return categoryMap[category] || categoryMap.default;
    };
    
    const categoryColor = getCategoryColor(product.category);

    return (
        <div className="card group h-full flex flex-col relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500">
            {/* Image container with gradient overlay */}
            <div className="relative overflow-hidden h-64">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Category badge */}
                <div className={`absolute top-4 left-4 ${categoryColor} text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg z-20`}>
                    {product.category}
                </div>
                
                {/* Quick action button */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                        }}
                        className="bg-white p-3 rounded-full shadow-xl text-gray-800 hover:bg-gradient-to-r hover:from-brand-vibrant-orange hover:to-brand-vibrant-yellow hover:text-white transition-all transform hover:scale-110"
                        title="Add to Cart"
                    >
                        <Plus size={20} />
                    </button>
                </div>
                
                {/* Stock indicator */}
                <div className="absolute bottom-4 left-4 right-4 z-20">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full h-2">
                        <div 
                            className={`h-full rounded-full ${product.stock > 20 ? 'bg-green-500' : product.stock > 5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min((product.stock || 0) * 5, 100)}%` }}
                        />
                    </div>
                    <div className="text-xs text-white font-bold mt-1 text-center backdrop-blur-sm bg-black/30 rounded-full px-2 py-1">
                        {product.stock || 'Many'} in stock
                    </div>
                </div>
            </div>

            {/* Product info */}
            <div className="flex-1 p-6 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-primary group-hover:to-brand-vibrant-blue transition-all duration-300 line-clamp-2">
                    {product.name}
                </h3>
                
                {product.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                )}
                
                <div className="mt-auto">
                    <div className="flex items-baseline justify-between mb-4">
                        <div>
                            <span className="text-2xl font-black text-gray-900">KES {product.price}</span>
                            <span className="text-sm text-gray-500 ml-2">/{product.unit}</span>
                        </div>
                        
                        {/* Rating stars */}
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                            <span className="text-xs text-gray-500 ml-1">(4.0)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add to cart button */}
            <div className="px-6 pb-6 pt-0">
                <button
                    onClick={() => addToCart(product)}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-95 ${categoryColor}`}
                >
                    <ShoppingBag size={20} />
                    Add to Cart
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">+</span>
                </button>
            </div>
            
            {/* Hover effect border */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-3xl pointer-events-none transition-all duration-500" />
        </div>
    );
};

export default ProductCard;
