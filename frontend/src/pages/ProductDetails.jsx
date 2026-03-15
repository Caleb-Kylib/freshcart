import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, ArrowLeft, Check, Star, ShieldCheck, Truck, Leaf, ChevronRight, Share2, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import ProductCarousel from '../components/ProductCarousel';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, featuredProducts } = useProducts();
    const { addToCart } = useCart();
    const { user } = useAuth();
    
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [mainImage, setMainImage] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([]);

    const product = products.find(p => String(p._id || p.id) === String(id));

    // Simple thumbnail mock (since our schema only has one image usually)
    const thumbnails = product ? [
        product.image,
        "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2670&auto=format&fit=crop", // placeholder 1
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2670&auto=format&fit=crop"  // placeholder 2
    ] : [];

    useEffect(() => {
        if (product) {
            setMainImage(product.image);
            
            // Filter related products (same category)
            const related = products
                .filter(p => p.category === product.category && String(p._id || p.id) !== String(id))
                .slice(0, 8);
            setRelatedProducts(related);
            
            setQuantity(1);
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
        if (!user) {
            navigate('/login');
            return;
        }
        
        addToCart(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="pt-32 pb-20 min-h-screen bg-[#FDFDFD]">
            {/* Success Toast */}
            {added && (
                <div className="fixed top-24 right-8 z-[110] animate-in slide-in-from-right-10 duration-300">
                    <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500">
                        <div className="bg-white/20 p-1.5 rounded-full">
                            <Check size={18} strokeWidth={3} />
                        </div>
                        <div>
                            <p className="font-black text-xs uppercase tracking-widest">Added to Cart!</p>
                            <p className="text-[10px] opacity-80 font-bold">{quantity}x {product.name} in basket</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="container-custom">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 mb-10 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight size={12} className="opacity-40" />
                    <Link to="/products" className="hover:text-primary transition-colors">Shop</Link>
                    <ChevronRight size={12} className="opacity-40" />
                    <Link to={`/products?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
                    <ChevronRight size={12} className="opacity-40" />
                    <span className="text-gray-900 truncate max-w-[150px]">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 mb-20">
                    {/* Left: Image Section */}
                    <div className="lg:col-span-7">
                        <div className="sticky top-32 space-y-6">
                            <div className="relative group">
                                <div className="aspect-square bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-100/50 border border-gray-100 ring-1 ring-black/5">
                                    <img
                                        src={mainImage}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                    />
                                    {/* Overlay Badges */}
                                    <div className="absolute top-8 left-8 flex flex-col gap-3">
                                        <span className="bg-white/95 backdrop-blur-md text-primary font-black text-[9px] uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-sm border border-emerald-50">
                                            Fresh Sourced
                                        </span>
                                        {product.stock < 10 && (
                                            <span className="bg-rose-500/95 backdrop-blur-sm text-white font-black text-[9px] uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
                                                Limited Stock
                                            </span>
                                        )}
                                    </div>
                                    <button className="absolute top-8 right-8 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-gray-100 text-gray-400 hover:text-primary transition-colors">
                                        <Share2 size={18} />
                                    </button>
                                </div>
                                <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-4 px-2">
                                {thumbnails.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMainImage(img)}
                                        className={`w-20 sm:w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all p-1 bg-white ${mainImage === img ? 'border-primary shadow-lg scale-105' : 'border-transparent hover:border-gray-200'}`}
                                    >
                                        <img src={img} alt="thumb" className="w-full h-full object-cover rounded-xl" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="lg:col-span-5 flex flex-col justify-center">
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">4.9 (120+ Reviews)</span>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-md ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {product.stock > 0 ? 'In Stock' : 'Sold Out'}
                                </span>
                            </div>

                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">{product.category}</p>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1] mb-6 tracking-tight italic">
                                {product.name}
                            </h1>

                            <div className="flex items-baseline gap-3 mb-8">
                                <span className="text-4xl font-black text-emerald-600 tracking-tighter flex items-baseline">
                                    <span className="text-xl font-bold mr-1 italic">KES</span>
                                    {product.price}
                                </span>
                                <span className="text-lg font-bold text-gray-400 uppercase tracking-widest">
                                    / {product.unit}
                                </span>
                            </div>

                            <div className="space-y-4 mb-10">
                                <p className="text-base text-gray-600 leading-relaxed font-medium pl-6 border-l-4 border-emerald-500/30">
                                    {product.description || "Freshly harvested and sourced directly from our local partner farms to ensure the highest quality and nutritional value for your family."}
                                </p>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Brand</p>
                                        <p className="font-bold text-gray-800">FreshCart Select</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">SKU</p>
                                        <p className="font-bold text-gray-800">FC-{String(product._id || product.id).slice(-6).toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Controls */}
                        <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-emerald-100/30 border border-gray-100 mb-10 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-100 transition-colors"></div>
                           
                            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                                {/* Quantity Picker */}
                                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-2xl border border-gray-100 min-w-[150px]">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-900 hover:text-emerald-600 hover:scale-105 transition-all active:scale-95 border border-transparent hover:border-emerald-100"
                                    >
                                        <Minus size={18} strokeWidth={3} />
                                    </button>
                                    <span className="font-black text-xl text-gray-900 mx-4">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-900 hover:text-emerald-600 hover:scale-105 transition-all active:scale-95 border border-transparent hover:border-emerald-100"
                                    >
                                        <Plus size={18} strokeWidth={3} />
                                    </button>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={added || product.stock === 0}
                                    className={`flex-1 w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] transition-all transform active:scale-95 ${added
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : product.stock === 0 
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-200 hover:-translate-y-1'
                                        }`}
                                >
                                    {added ? (
                                        <>
                                            <Check size={18} strokeWidth={3} />
                                            Harvested!
                                        </>
                                    ) : product.stock === 0 ? (
                                        'Out of Stock'
                                    ) : (
                                        <>
                                            <ShoppingBag size={18} strokeWidth={3} />
                                            Add To Cart
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Product Perks */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: Truck, text: 'Nairobi Express', color: 'emerald' },
                                { icon: Leaf, text: 'Strictly Organic', color: 'amber' },
                                { icon: ShieldCheck, text: 'Secure Checkout', color: 'blue' }
                            ].map((perk, i) => (
                                <div key={i} className={`flex flex-col items-center text-center p-4 rounded-[2rem] bg-${perk.color}-50/50 text-${perk.color}-700 border border-${perk.color}-100/50 hover:scale-105 transition-transform cursor-default group`}>
                                    <perk.icon size={20} className="mb-2 group-hover:animate-bounce" />
                                    <span className="text-[8px] font-black uppercase tracking-wider">{perk.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <section className="mb-32">
                    <div className="flex border-b border-gray-100 mb-10 overflow-x-auto no-scrollbar">
                        {['description', 'delivery', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-10 py-5 font-black text-xs uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary rounded-t-full"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white p-10 sm:p-14 rounded-[4rem] border border-gray-100 shadow-sm min-h-[300px] animate-in fade-in duration-500">
                        {activeTab === 'description' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-6 italic tracking-tight">Farm Highlights</h3>
                                    <p className="text-gray-600 leading-relaxed font-medium mb-6 italic">
                                        "Our {product.name.toLowerCase()} are grown in the mineral-rich soils of the Rift Valley, utilizing sustainable farming practices that prioritize natural growth cycles over industrial speed."
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            'Zero synthetic pesticide usage',
                                            'Hand-picked at peak ripeness',
                                            'Minimal plastic packaging',
                                            'Sourced within 100km of Nairobi'
                                        ].map((point, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-gray-50 rounded-[3rem] p-8 flex items-center justify-center">
                                    <div className="text-center group">
                                        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-emerald-50 group-hover:scale-110 transition-transform">
                                            <Info size={32} className="text-primary" />
                                        </div>
                                        <p className="font-black text-xs uppercase tracking-widest text-gray-900 mb-2">Storage Tip</p>
                                        <p className="text-xs text-gray-500 font-bold max-w-[200px] mx-auto">Keep in a cool, dry place. For maximum freshness, consume within 4 days of delivery.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'delivery' && (
                            <div className="max-w-3xl">
                                <h3 className="text-2xl font-black text-gray-900 mb-8 italic tracking-tight">Delivery Logistics</h3>
                                <div className="grid gap-8">
                                    <div className="flex gap-6">
                                        <div className="bg-emerald-50 p-4 rounded-3xl h-fit">
                                            <Truck size={24} className="text-emerald-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-sm uppercase tracking-widest mb-2">Same Day Delivery</h4>
                                            <p className="text-gray-600 text-sm font-medium leading-relaxed">Place your order before 12:00 PM and receive it today. Valid for all Nairobi residential areas including Kilimani, Westlands, and Karen.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="bg-orange-50 p-4 rounded-3xl h-fit">
                                            <ShieldCheck size={24} className="text-orange-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-sm uppercase tracking-widest mb-2">Freshness Guarantee</h4>
                                            <p className="text-gray-600 text-sm font-medium leading-relaxed">If any item doesn't meet your quality expectations, you can return it with the rider immediately for a full refund or instant replacement.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="text-center py-10">
                                <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Star size={40} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2 italic">Be The First To Review</h3>
                                <p className="text-gray-500 font-bold text-sm mb-8">Share your experience with our {product.name.toLowerCase()} and help others shop fresh.</p>
                                <button className="btn-primary">Write A Review</button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Featured Products Section */}
                {featuredProducts.length > 0 && (
                    <section className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight italic">Recommended For You</h2>
                                <p className="text-gray-400 font-bold text-sm mt-1 uppercase tracking-widest">Hand-picked fresh arrivals</p>
                            </div>
                            <Link to="/products" className="group flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest hover:gap-4 transition-all">
                                See Full Shop <ChevronRight size={18} />
                            </Link>
                        </div>
                        <ProductCarousel products={featuredProducts} />
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
