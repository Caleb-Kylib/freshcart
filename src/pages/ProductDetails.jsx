import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, ArrowLeft, Check } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const product = products.find(p => p.id === parseInt(id));
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    if (!product) {
        return (
            <div className="pt-32 pb-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                <Link to="/products" className="text-primary hover:underline">Back to Shop</Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="pt-32 pb-20 min-h-screen bg-white">
            <div className="container-custom">
                <Link to="/products" className="inline-flex items-center text-gray-500 mb-8 hover:text-primary transition-colors">
                    <ArrowLeft size={18} className="mr-2" /> Back to Shop
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Image */}
                    <div className="h-96 md:h-[500px] bg-gray-100 rounded-3xl overflow-hidden shadow-sm">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Details */}
                    <div>
                        <span className="text-primary font-semibold tracking-wider uppercase text-sm bg-green-50 px-3 py-1 rounded-full">{product.category}</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4">{product.name}</h1>
                        <p className="text-3xl font-bold text-gray-900 mb-6">KES {product.price}<span className="text-lg text-gray-500 font-medium">/{product.unit}</span></p>

                        <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                            {product.description}
                        </p>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="flex items-center border border-gray-300 rounded-full bg-white px-4 py-2">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-1 hover:text-primary transition-colors"
                                >
                                    <Minus size={20} />
                                </button>
                                <span className="mx-4 font-bold text-lg min-w-[20px] text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-1 hover:text-primary transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className={`w-full md:w-auto px-10 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-95 shadow-lg ${added ? 'bg-green-700 text-white' : 'bg-primary text-white hover:bg-green-700 hover:shadow-xl'}`}
                        >
                            {added ? (
                                <>
                                    <Check size={24} /> Added to Cart
                                </>
                            ) : (
                                <>
                                    <ShoppingBag size={24} /> Add to Cart
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
