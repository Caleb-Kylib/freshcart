import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Mail, Lock, ArrowRight, AlertCircle, BarChart3, TrendingUp, Users, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ManagerLoginPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && user.role !== 'manager') {
      navigate('/', { replace: true });
    } else if (user && user.role === 'manager') {
      navigate('/manager', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password, 'manager');
    if (result.success) {
      navigate("/manager");
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B5D1E] via-[#0A4016] to-[#051F0F] flex items-center justify-center px-4 py-8">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00A300]/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00A300]/5 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Features */}
        <div className="hidden md:block text-white space-y-8">
          <div>
            <h1 className="text-5xl font-black mb-4 leading-tight">
              Manager <br />
              <span className="text-[#00A300]">Control Center</span>
            </h1>
            <p className="text-[#A8D5B8] text-lg font-medium">
              Supervise daily operations, manage inventory, and drive business insights with real-time analytics.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#00A300]/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingUp className="text-[#00A300]" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Sales Analytics</h3>
                <p className="text-[#A8D5B8] text-sm">Track daily sales trends and revenue performance</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#00A300]/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <BarChart3 className="text-[#00A300]" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Inventory Management</h3>
                <p className="text-[#A8D5B8] text-sm">Monitor stock levels and manage replenishment</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#00A300]/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users className="text-[#00A300]" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Cashier Activity</h3>
                <p className="text-[#A8D5B8] text-sm">Oversee team performance and staff metrics</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#00A300]/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="text-[#00A300]" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Order Management</h3>
                <p className="text-[#A8D5B8] text-sm">Handle order processing and customer requests</p>
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-block px-4 py-2 bg-[#00A300]/20 border border-[#00A300]/40 rounded-lg">
            <p className="text-[#00A300] text-sm font-bold">✓ Access to 6 management modules</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E2E8E0]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00A300] to-[#087E08] px-8 py-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center">
                  <Shield size={28} className="text-[#00A300]" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-white text-center">Manager Login</h2>
              <p className="text-[#E8F5E9] text-sm text-center mt-2 font-medium">Access your daily operations dashboard</p>
            </div>

            {/* Form Content */}
            <div className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-[#FFEBEE] text-[#D32F2F] rounded-lg text-sm font-medium border border-[#D32F2F]/20 flex items-center gap-3 animate-pulse">
                  <AlertCircle size={20} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-bold text-[#1B2A1F] mb-2.5">Email Address</label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-3.5 top-3.5 text-[#00A300]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="manager@freshcart.com"
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#E2E8E0] rounded-lg text-sm font-medium focus:outline-none focus:border-[#00A300] focus:ring-2 focus:ring-[#00A300]/20 transition-all"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-bold text-[#1B2A1F] mb-2.5">Password</label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3.5 top-3.5 text-[#00A300]" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#E2E8E0] rounded-lg text-sm font-medium focus:outline-none focus:border-[#00A300] focus:ring-2 focus:ring-[#00A300]/20 transition-all"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded accent-[#00A300]" disabled={loading} />
                    <span className="text-[#666] font-medium">Remember me</span>
                  </label>
                  <a href="#" className="text-[#00A300] hover:text-[#087E08] font-semibold transition">
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#00A300] to-[#087E08] text-white font-bold py-3.5 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In to Dashboard
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-8 p-4 bg-[#F7FAF5] rounded-lg border border-[#E2E8E0]">
                <p className="text-xs font-bold text-[#0B5D1E] uppercase tracking-widest mb-3">Demo Access</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-[#666] font-medium">Email</p>
                    <p className="text-sm font-mono text-[#1B2A1F] font-bold">manager@demo.com</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#666] font-medium">Password</p>
                    <p className="text-sm font-mono text-[#1B2A1F] font-bold">password123</p>
                  </div>
                </div>
              </div>

              {/* Portal Links */}
              <div className="mt-8 pt-6 border-t border-[#E2E8E0]">
                <p className="text-xs text-[#999] text-center font-medium mb-4">Other Access Portals</p>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/admin/login"
                    className="px-4 py-2 bg-[#F7FAF5] hover:bg-[#E2E8E0] text-[#1B2A1F] font-bold rounded-lg transition-colors text-sm text-center"
                  >
                    Admin Portal
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-[#F7FAF5] hover:bg-[#E2E8E0] text-[#1B2A1F] font-bold rounded-lg transition-colors text-sm text-center"
                  >
                    Customer Login
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#F7FAF5] px-8 py-4 border-t border-[#E2E8E0]">
              <p className="text-xs text-[#999] text-center">
                FreshCart Manager Dashboard © 2026 | <a href="#" className="text-[#00A300] hover:text-[#087E08]">Privacy Policy</a>
              </p>
            </div>
          </div>

          {/* Mobile Features - shown only on small screens */}
          <div className="md:hidden mt-8 space-y-4">
            <div className="flex items-center gap-3 text-white">
              <CheckCircle2 size={20} className="text-[#00A300] flex-shrink-0" />
              <span className="text-sm font-medium">Real-time sales analytics</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <CheckCircle2 size={20} className="text-[#00A300] flex-shrink-0" />
              <span className="text-sm font-medium">Inventory management</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <CheckCircle2 size={20} className="text-[#00A300] flex-shrink-0" />
              <span className="text-sm font-medium">Order processing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerLoginPage;
