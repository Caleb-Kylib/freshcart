import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

const blogPosts = [
    {
        id: 1,
        title: "The Benefits of Organic Produce: Why It Matters for Your Health",
        excerpt: "Discover why switching to organic fruits and vegetables can significantly improve your overall well-being and reduce exposure to harmful pesticides.",
        date: "March 5, 2026",
        author: "Dr. Nutritionist",
        image: "/products/vegetables.jpg",
        category: "Nutrition"
    },
    {
        id: 2,
        title: "Top 5 Superfoods for Better Heart Health You Need in Your Diet",
        excerpt: "Heart health is paramount. Learn which five superfoods are scientifically proven to support cardiovascular health and how to incorporate them into your meals.",
        date: "March 4, 2026",
        author: "Health Expert",
        image: "/products/Blueberries.jpg",
        category: "Wellness"
    },
    {
        id: 3,
        title: "How to Maintain a Balanced Diet in a Busy Lifestyle: Practical Tips",
        excerpt: "Busy schedule? No problem. We provide actionable advice on how to eat healthily even when you're short on time, including meal prepping and smart snacking.",
        date: "March 3, 2026",
        author: "Wellness Coach",
        image: "/products/berry-blast.jpg",
        category: "Lifestyle"
    }
];

const Blog = () => {
    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Hero Section */}
            <div className="relative py-32 px-4 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"
                        alt="Wellness Blog Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
                </div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <span className="bg-primary/20 text-primary-light border border-primary/30 py-1.5 px-4 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6 inline-block backdrop-blur-md">
                        FreshCart Wellness
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                        Insights for a <br />
                        <span className="text-primary italic">Healhier You</span>
                    </h1>
                    <p className="text-xl max-w-2xl mx-auto text-gray-200 font-medium leading-relaxed">
                        Expert nutrition tips, seasonal recipes, and lifestyle guides to help you thrive on nature's finest.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content - Blog Posts Grid */}
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {blogPosts.map((post) => (
                                <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100">
                                    <div className="relative h-56 overflow-hidden group">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center text-gray-500 text-sm mb-4 space-x-4">
                                            <div className="flex items-center">
                                                <Calendar size={14} className="mr-1.5" />
                                                {post.date}
                                            </div>
                                            <div className="flex items-center">
                                                <User size={14} className="mr-1.5" />
                                                {post.author}
                                            </div>
                                        </div>

                                        <h2 className="text-xl font-bold text-gray-800 mb-3 hover:text-green-600 transition-colors">
                                            <Link to={`/blog/${post.id}`}>{post.title}</Link>
                                        </h2>

                                        <p className="text-gray-600 mb-6 flex-grow">
                                            {post.excerpt}
                                        </p>

                                        <Link
                                            to={`/blog/${post.id}`}
                                            className="inline-flex items-center text-green-600 font-bold hover:text-green-700 transition-colors"
                                        >
                                            Read Full Article <ArrowRight size={16} className="ml-2" />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-8">
                            {/* Search Widget */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold mb-4 text-gray-800">Search Articles</h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search keywords..."
                                        className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold mb-4 text-gray-800">Categories</h3>
                                <ul className="space-y-3">
                                    {['Nutrition', 'Wellness', 'Lifestyle', 'Recipes', 'Sustainability'].map((cat) => (
                                        <li key={cat}>
                                            <button className="flex items-center justify-between w-full group hover:bg-green-50 p-2 rounded-lg transition-colors">
                                                <span className="text-gray-600 group-hover:text-green-700">{cat}</span>
                                                <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full group-hover:bg-green-100 group-hover:text-green-700">12</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Newsletter */}
                            <div className="bg-green-600 p-6 rounded-2xl shadow-md text-white">
                                <h3 className="text-xl font-bold mb-2">Join our Newsletter</h3>
                                <p className="text-green-50 text-sm mb-6">Get weekly nutrition tips and exclusive offers straight to your inbox.</p>
                                <form className="space-y-3">
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 rounded-xl text-gray-800 focus:outline-none"
                                    />
                                    <button className="w-full bg-white text-green-600 font-bold py-3 rounded-xl hover:bg-green-50 transition-colors">
                                        Subscribe Now
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
