import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ManagerLoginPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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

    const result = await login(email, password, 'manager');
    if (result.success) {
      navigate("/manager");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B5D1E] px-4">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-[#E2E8E0]">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-[#00A300] rounded-2xl flex items-center justify-center mb-4 text-white">
            <Shield size={32} />
          </div>
          <h2 className="text-3xl font-bold text-[#1B2A1F] text-center">Manager Portal</h2>
          <p className="text-[#999] mt-2 text-center font-medium">Daily Operations Access</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#FFEBEE] text-[#D32F2F] rounded-xl text-sm font-medium border border-[#D32F2F]/20 flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 mb-8">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-bold text-[#1B2A1F] mb-2">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-3 text-[#999]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@freshcart.com"
                className="w-full pl-12 pr-4 py-3 border border-[#E2E8E0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00A300]/20 focus:border-[#00A300] transition"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-bold text-[#1B2A1F] mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-3 text-[#999]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 border border-[#E2E8E0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00A300]/20 focus:border-[#00A300] transition"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#00A300] text-white font-bold py-3 rounded-xl hover:bg-[#087E08] transition duration-300 flex items-center justify-center gap-2 mt-6"
          >
            Sign In
            <ArrowRight size={20} />
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="p-4 bg-[#E8F5E9] rounded-xl border border-[#00A300]/20 mb-6">
          <p className="text-xs text-[#0B5D1E] font-semibold mb-2">Demo Credentials:</p>
          <p className="text-xs text-[#0B5D1E]"><strong>Email:</strong> manager@demo.com</p>
          <p className="text-xs text-[#0B5D1E]"><strong>Password:</strong> password123</p>
        </div>

        {/* Links */}
        <div className="flex items-center justify-between text-sm">
          <Link
            to="/admin/login"
            className="text-[#00A300] hover:text-[#087E08] font-semibold transition"
          >
            Admin Portal
          </Link>
          <Link
            to="/login"
            className="text-[#999] hover:text-[#1B2A1F] font-semibold transition"
          >
            Customer Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ManagerLoginPage;
