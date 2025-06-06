import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
