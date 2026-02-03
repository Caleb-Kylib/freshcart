import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={adminOnly ? "/admin/login" : "/login"} />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default ProtectedRoute;
