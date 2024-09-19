import { useAuth } from "../hooks/AuthContext";
import { Navigate } from "react-router-dom";

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }: any) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is not authenticated, redirect to login
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
