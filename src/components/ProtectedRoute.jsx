import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Verifying Access...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={adminOnly ? "/admin/login" : "/login"} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
