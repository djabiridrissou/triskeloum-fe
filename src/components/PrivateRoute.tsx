import { Navigate, Outlet } from "react-router-dom";
import useAuthCheck from "../services/useAuth";

const PrivateRoute = () => {
  const { user, isLoading } = useAuthCheck();

  if (isLoading) return <div>Loading...</div>;

  return user ? <Outlet /> : <Navigate to="login" replace />;
};

export default PrivateRoute;