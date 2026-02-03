import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");

        const result = login(email, password);
        if (result.success) {
            if (result.user.role === 'admin') {
                navigate("/admin");
            } else {
                setError("Access denied. This portal is for administrators only.");
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-4 text-white">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 text-center">Admin Portal</h2>
                    <p className="text-gray-500 mt-2 text-center font-medium">Management Console Login</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Admin Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                placeholder="admin@farmfresh.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 active:scale-[0.98] transition-all shadow-lg shadow-green-200 mt-4"
                    >
                        Access Dashboard <ArrowRight size={20} />
                    </button>
                </form>

                <div className="mt-8 flex flex-col gap-4 text-center">
                    <p className="text-sm text-gray-500">
                        Need an admin account?{" "}
                        <Link to="/admin/signup" className="text-green-600 font-bold hover:underline">
                            Request Access
                        </Link>
                    </p>
                    <Link to="/login" className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1">
                        Go to Customer Login
                    </Link>
                </div>

                {/* Demo Credentials */}
                <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2 text-center">Demo Admin Access</p>
                    <div className="flex flex-col gap-1 text-xs text-center">
                        <span className="text-gray-500">User: <span className="text-gray-900 font-bold">admin@farmfresh.com</span></span>
                        <span className="text-gray-500">Pass: <span className="text-gray-900 font-bold">password</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
