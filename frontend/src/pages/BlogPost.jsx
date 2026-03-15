import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';

const blogPosts = [
    {
        id: 1,
        title: "The Benefits of Organic Produce: Why It Matters for Your Health",
        content: `
      <p>Organic produce has been a buzzword for years, but what does it actually mean for your health? Sourced directly from local farmers who avoid synthetic pesticides and fertilizers, organic fruits and vegetables are not just better for the environment—they are a powerhouse of nutrition.</p>
      
      <h3>1. Reduced Pesticide Exposure</h3>
      <p>One of the primary reasons consumers choose organic is to avoid the chemical residues found in conventional farming. Studies have shown that organic produce has significantly lower levels of pesticide residues.</p>

      <h3>2. Higher Nutrient Content</h3>
      <p>Organic crops often have higher levels of antioxidants, such as polyphenols, which can help protect your cells from damage. Because organic plants have to defend themselves without chemical aid, they often produce more of these natural protective compounds.</p>

      <h3>3. Better for the Heart</h3>
      <p>Increased intake of organic dairy and meat has been linked to higher levels of omega-3 fatty acids, which are essential for cardiovascular health.</p>

      <p>At FreshCart, we believe that everyone deserves access to the highest quality food. Our organic selection is hand-picked daily to ensure you get the freshest nutrients possible.</p>
    `,
        date: "March 5, 2026",
        author: "Dr. Nutritionist",
        image: "/products/vegetables.jpg",
        category: "Nutrition"
    },
    {
        id: 2,
        title: "Top 5 Superfoods for Better Heart Health You Need in Your Diet",
        content: `
      <p>Your heart is the engine of your body. Keeping it healthy through nutrition is one of the most effective ways to ensure a long and vibrant life. Here are five superfoods that should be staples in your grocery cart.</p>
      
      <h3>1. Blueberries</h3>
      <p>Loaded with anthocyanins, blueberries help reduce oxidative stress and inflammation in the arteries. Grab a pack of our fresh wild blueberries for a daily heart boost.</p>

      <h3>2. Kale and Spinach</h3>
      <p>Leafy greens are rich in Vitamin K and nitrates, which help protect your arteries and reduce blood pressure. Our organic kale is sourced directly from farms in Limuru.</p>

      <h3>3. Walnuts</h3>
      <p>A great source of fiber and micronutrients like magnesium, copper, and manganese. Research shows that including walnuts in your diet can lower "bad" LDL cholesterol.</p>

      <h3>4. Fatty Fish (Salmon)</h3>
      <p>Rich in omega-3 fatty acids, salmon is a superstar for heart health. It helps lower the risk of arrhythmia and atherosclerosis.</p>

      <h3>5. Avocado</h3>
      <p>Avocados are an excellent source of heart-healthy monounsaturated fats, which have been linked to reduced levels of cholesterol.</p>
    `,
        date: "March 4, 2026",
        author: "Health Expert",
        image: "/products/Blueberries.jpg",
        category: "Wellness"
    },
    {
        id: 3,
        title: "How to Maintain a Balanced Diet in a Busy Lifestyle: Practical Tips",
        content: `
      <p>In today's fast-paced world, finding time to cook healthy meals can feel like a secondary job. However, maintaining a balanced diet doesn't have to be complicated or time-consuming.</p>
      
      <h3>1. Master the Art of Meal Prep</h3>
      <p>Spend just two hours on Sunday prepping your base ingredients—roasted vegetables, cooked grains like quinoa, and washed greens. Use our fresh pre-cut vegetable packs to save even more time.</p>

      <h3>2. Smart Snacking</h3>
      <p>Avoid the vending machine by keeping healthy snacks within reach. Fresh fruit, nuts, or a quick smoothie made with FreshCart fruits can keep your energy levels stable throughout the day.</p>

      <h3>3. Hydration is Key</h3>
      <p>Sometimes we mistake thirst for hunger. Keep a bottle of water or one of our fresh, no-added-sugar juices at your desk to stay hydrated and focused.</p>

      <h3>4. Follow the 80/20 Rule</h3>
      <p>Don't aim for perfection. If you eat well 80% of the time, you can enjoy your favorite treats without guilt the other 20% of the time. Sustainability is more important than strictness.</p>
    `,
        date: "March 3, 2026",
        author: "Wellness Coach",
        image: "/products/berry-blast.jpg",
        category: "Lifestyle"
    }
];

const BlogPost = () => {
    const { id } = useParams();
    const post = blogPosts.find(p => p.id === parseInt(id)) || blogPosts[0];

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Article Header */}
            <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-20">
                    <div className="max-w-4xl mx-auto w-full">
                        <Link to="/blog" className="flex items-center text-white/80 hover:text-white mb-6 transition-colors font-bold uppercase tracking-widest text-xs">
                            <ArrowLeft size={16} className="mr-2" /> Back to Blog
                        </Link>
                        <span className="bg-green-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block shadow-lg">
                            {post.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center text-white/90 gap-6">
                            <div className="flex items-center font-bold">
                                <Calendar size={18} className="mr-2 text-green-400" />
                                {post.date}
                            </div>
                            <div className="flex items-center font-bold">
                                <User size={18} className="mr-2 text-green-400" />
                                By {post.author}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-16">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Article Content */}
                    <div className="flex-grow">
                        <div
                            className="prose prose-lg prose-green max-w-none text-gray-700 leading-relaxed space-y-6"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Tag Cloud & Share */}
                        <div className="mt-12 pt-12 border-t border-gray-100 flex flex-wrap justify-between items-center gap-6">
                            <div className="flex flex-wrap gap-2">
                                {['Health', 'Organic', 'Nairobi', 'Freshness'].map(tag => (
                                    <span key={tag} className="bg-gray-100 text-gray-500 px-4 py-2 rounded-xl text-sm font-bold">#{tag}</span>
                                ))}
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-gray-400 text-sm font-bold uppercase">Share This</span>
                                <div className="flex gap-2">
                                    <button className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                                        <Facebook size={20} />
                                    </button>
                                    <button className="p-3 bg-sky-50 text-sky-500 rounded-full hover:bg-sky-500 hover:text-white transition-all">
                                        <Twitter size={20} />
                                    </button>
                                    <button className="p-3 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-800 hover:text-white transition-all">
                                        <LinkIcon size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar for Desktop */}
                    <div className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-24 space-y-10">
                            <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100">
                                <h4 className="text-xl font-black text-emerald-900 mb-4">Want the freshest produce?</h4>
                                <p className="text-emerald-700 text-sm mb-6 leading-relaxed">Most of these ingredients are available in our shop for same-day delivery!</p>
                                <Link to="/products" className="block w-full text-center bg-emerald-600 text-white font-black py-4 rounded-2xl hover:bg-emerald-700 transition-colors shadow-xl shadow-emerald-100">
                                    Go Shopping
                                </Link>
                            </div>

                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Share2 size={20} className="text-green-500" />
                                    Related Reads
                                </h4>
                                <div className="space-y-6">
                                    {blogPosts.filter(p => p.id !== post.id).slice(0, 2).map(p => (
                                        <Link key={p.id} to={`/blog/${p.id}`} className="group block">
                                            <div className="h-32 rounded-2xl overflow-hidden mb-3">
                                                <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                            </div>
                                            <h5 className="font-bold text-gray-800 text-sm leading-snug group-hover:text-green-600 transition-colors">{p.title}</h5>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
