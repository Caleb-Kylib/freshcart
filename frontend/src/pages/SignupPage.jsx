import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, Loader2, ShoppingBasket, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer"
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on change
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic Validations
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    const result = await signup(formData.name, formData.email, formData.password, formData.role);
    setIsLoading(false);

    if (result.success) {
      navigate("/login");
    } else {
      setError(result.message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-brand-bg font-sans"
    >
      {/* Left Column: Hero Section (hidden on mobile, visible on lg) */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 text-white overflow-hidden bg-emerald-950">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-40 scale-105 transform transition-transform duration-[10000ms] hover:scale-100"
          style={{ backgroundImage: "url('/products/grocery-box.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950 via-emerald-900/90 to-emerald-950/40" />

        {/* Branding Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white border border-emerald-400 shadow-inner">
            <ShoppingBasket size={22} className="stroke-[2.5]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">FreshCart</span>
        </div>

        {/* Hero Marketing Copy & Value Prop */}
        <div className="relative z-10 my-auto max-w-md space-y-6">
          <h1 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight">
            Shop farm-fresh <br />
            <span className="text-emerald-400">produce anytime.</span>
          </h1>
          <p className="text-emerald-100/80 text-base leading-relaxed">
            Fresh groceries delivered directly to your doorstep. Join thousands of happy households eating healthier every day.
          </p>

          <div className="space-y-5 pt-4">
            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30 flex-shrink-0 mt-0.5 shadow-sm">
                <Check size={13} className="stroke-[3.5]" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm tracking-wide">Fresh Produce Daily</h4>
                <p className="text-emerald-200/60 text-xs mt-0.5">Handpicked organic fruits and vegetables from local farms.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30 flex-shrink-0 mt-0.5 shadow-sm">
                <Check size={13} className="stroke-[3.5]" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm tracking-wide">Fast Local Delivery</h4>
                <p className="text-emerald-200/60 text-xs mt-0.5">Direct to your kitchen in under 2 hours, fresh and chilled.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30 flex-shrink-0 mt-0.5 shadow-sm">
                <Check size={13} className="stroke-[3.5]" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm tracking-wide">Secure Payments</h4>
                <p className="text-emerald-200/60 text-xs mt-0.5">100% secure encrypted checkout with multiple payment options.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-emerald-300/50 font-medium">
          © {new Date().getFullYear()} FreshCart. All rights reserved.
        </div>
      </div>

      {/* Right Column: Authentication Card */}
      <div className="flex flex-col justify-center items-center lg:col-span-7 px-4 py-12 md:py-16 bg-brand-bg relative min-h-screen">
        {/* Mobile Header (only visible on mobile/tablet) */}
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
            <ShoppingBasket size={18} className="stroke-[2.5]" />
          </div>
          <span className="text-base font-extrabold tracking-tight text-brand-dark">FreshCart</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
          className="bg-white p-8 md:p-10 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100/80 w-full max-w-[480px]"
        >
          {/* Header Area */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 text-brand-primary border border-emerald-100 shadow-sm">
              <ShoppingBasket size={24} className="stroke-[2]" />
            </div>
            <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight">Create Account</h2>
            <p className="text-brand-muted mt-2 text-center text-sm md:text-base">
              Create an account to enjoy faster checkout and exclusive offers.
            </p>
          </div>

          {/* Error Message with AnimatePresence */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="mb-6 p-4 bg-red-50 text-brand-error rounded-2xl text-xs font-semibold border border-red-100 flex items-start gap-2.5 overflow-hidden"
              >
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-dark ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-brand-primary" size={18} />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  required
                  disabled={isLoading}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-brand-primary focus:ring-4 focus:ring-emerald-50 outline-none transition-all duration-200 bg-white placeholder-gray-400 text-brand-dark shadow-sm text-sm"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-dark ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-brand-primary" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="customer@example.com"
                  required
                  disabled={isLoading}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-brand-primary focus:ring-4 focus:ring-emerald-50 outline-none transition-all duration-200 bg-white placeholder-gray-400 text-brand-dark shadow-sm text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-dark ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-brand-primary" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3 rounded-2xl border border-gray-200 focus:border-brand-primary focus:ring-4 focus:ring-emerald-50 outline-none transition-all duration-200 bg-white placeholder-gray-400 text-brand-dark shadow-sm text-sm"
                />
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary transition-colors focus:outline-none p-1 rounded-md"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-dark ml-1">Confirm Password</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-brand-primary" size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3 rounded-2xl border border-gray-200 focus:border-brand-primary focus:ring-4 focus:ring-emerald-50 outline-none transition-all duration-200 bg-white placeholder-gray-400 text-brand-dark shadow-sm text-sm"
                />
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary transition-colors focus:outline-none p-1 rounded-md"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/15 transition-all duration-200 disabled:opacity-80 disabled:cursor-not-allowed text-sm shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={18} className="stroke-[2.5]" />
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Social Logins */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="px-3 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
              Or continue with
            </span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              disabled={isLoading}
              className="flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-semibold shadow-sm text-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-60"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-600 font-bold">Continue with Google</span>
            </button>
          </div>

          {/* Footer Navigation */}
          <p className="text-center text-sm mt-8 text-brand-muted font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-primary font-extrabold hover:text-brand-secondary transition-colors underline-offset-4 hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignupPage;
