import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <div className="card group h-full flex flex-col relative">
            <div className="relative overflow-hidden h-64 bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                        }}
                        className="bg-white p-2 rounded-full shadow-lg text-primary hover:bg-primary hover:text-white transition-all"
                        title="Add to Cart"
                    >
                        <Plus size={20} />
                    </button>
                </div>
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            <Link to={`/products/${product.id}`} className="flex-1 p-5 flex flex-col">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{product.category}</p>
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">KES {product.price}</span>
                    <span className="text-sm text-gray-500">/{product.unit}</span>
                </div>
            </Link>

            <div className="p-5 pt-0">
                <button
                    onClick={() => addToCart(product)}
                    className="w-full py-3 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group-btn"
                >
                    <ShoppingBag size={18} />
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
