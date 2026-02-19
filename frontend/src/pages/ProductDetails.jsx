import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, ArrowLeft, Check, Star, ShieldCheck, Truck, Leaf, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import ProductCarousel from '../components/ProductCarousel';

const ProductDetails = () => {
    const { id } = useParams();
    const { products } = useProducts();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const product = products.find(p => String(p._id || p.id) === String(id));

    useEffect(() => {
        if (product && products.length > 0) {
            const related = products
                .filter(p => p.category === product.category && String(p._id || p.id) !== String(id))
                .slice(0, 8);
            setRelatedProducts(related);
            // Reset quantity when product changes
            setQuantity(1);
            // Scroll to top when product changes
            window.scrollTo(0, 0);
        }
    }, [id, product, products]);

    if (!product) {
        return (
            <div className="pt-32 pb-20 text-center min-h-screen flex flex-col items-center justify-center">
                <div className="bg-gray-50 p-10 rounded-[3rem] border border-dashed border-gray-200">
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Product Not Found</h2>
                    <p className="text-gray-500 mb-8 max-w-xs mx-auto">The item you're looking for might have been harvested or moved.</p>
                    <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                        <ArrowLeft size={18} /> Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="pt-32 pb-20 min-h-screen bg-[#FDFDFD]">
            <div className="container-custom">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-10 overflow-x-auto whitespace-nowrap pb-2">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/products" className="hover:text-primary transition-colors">Shop</Link>
                    <ChevronRight size={14} />
                    <Link to={`/products?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-900 truncate max-w-[150px]">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 mb-32">
                    {/* Left: Image Section */}
                    <div className="lg:col-span-7">
                        <div className="relative group">
                            <div className="aspect-square bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-100 border border-gray-100 ring-1 ring-black/5">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Overlay Badges */}
                                <div className="absolute top-8 left-8 flex flex-col gap-3">
                                    <span className="bg-white/90 backdrop-blur-md text-primary font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full shadow-sm border border-emerald-50">
                                        Premium Quality
                                    </span>
                                    {product.stock < 10 && (
                                        <span className="bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full shadow-lg animate-pulse">
                                            Low Stock
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Decorative Background Element */}
                            <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="lg:col-span-5 flex flex-col justify-center">
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <span className="text-xs font-bold text-gray-400">4.9 (120+ Reviews)</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight italic">
                                {product.name}
                            </h1>

                            <div className="flex items-baseline gap-3 mb-8">
                                <span className="text-4xl font-black text-emerald-600 tracking-tighter">
                                    <span className="text-xl font-bold mr-1 italic">KES</span>
                                    {product.price}
                                </span>
                                <span className="text-lg font-bold text-gray-400 uppercase tracking-widest">
                                    / {product.unit}
                                </span>
                            </div>

                            <p className="text-lg text-gray-600 leading-relaxed font-medium mb-10 border-l-4 border-emerald-500 pl-6">
                                {product.description || "Freshly harvested and sourced directly from our local partner farms to ensure the highest quality and nutritional value for your family."}
                            </p>
                        </div>

                        {/* Order Controls */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-emerald-100 border border-gray-50 mb-10">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                {/* Quantity Picker */}
                                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-2xl border border-gray-100 min-w-[140px]">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-900 hover:text-emerald-600 hover:scale-105 transition-all active:scale-95"
                                    >
                                        <Minus size={20} strokeWidth={3} />
                                    </button>
                                    <span className="font-black text-xl text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-900 hover:text-emerald-600 hover:scale-105 transition-all active:scale-95"
                                    >
                                        <Plus size={20} strokeWidth={3} />
                                    </button>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={added}
                                    className={`flex-1 w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all transform active:scale-95 ${added
                                            ? 'bg-emerald-100 text-emerald-700 pointer-events-none'
                                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-200'
                                        }`}
                                >
                                    {added ? (
                                        <>
                                            <Check size={20} strokeWidth={3} />
                                            Done!
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingBag size={20} strokeWidth={3} />
                                            Harvest to Cart
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Product Perks */}
                        <div className="grid grid-cols-3 gap-4 italic font-bold">
                            <div className="flex flex-col items-center text-center p-4 rounded-3xl bg-emerald-50/50 text-emerald-700 border border-emerald-100/50">
                                <Truck size={20} className="mb-2" />
                                <span className="text-[10px] uppercase tracking-tighter">Fast Delivery</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 rounded-3xl bg-amber-50/50 text-amber-700 border border-amber-100/50">
                                <Leaf size={20} className="mb-2" />
                                <span className="text-[10px] uppercase tracking-tighter">100% Organic</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 rounded-3xl bg-blue-50/50 text-blue-700 border border-blue-100/50">
                                <ShieldCheck size={20} className="mb-2" />
                                <span className="text-[10px] uppercase tracking-tighter">Safe Pay</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* You May Also Like Section */}
                {relatedProducts.length > 0 && (
                    <section className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight italic">You May Also Like</h2>
                                <p className="text-gray-400 font-bold text-sm mt-1 uppercase tracking-widest">More from {product.category}</p>
                            </div>
                            <Link to="/products" className="group flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest hover:gap-4 transition-all">
                                See Full Shop <ChevronRight size={18} />
                            </Link>
                        </div>
                        <ProductCarousel products={relatedProducts} />
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
