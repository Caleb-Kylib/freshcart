import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isAdminLoggedIn");

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
