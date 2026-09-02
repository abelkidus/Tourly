import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/Log_in" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/welcome" replace />;
  }

  return children ? children : <Outlet />;
}

export default AdminRoute;
