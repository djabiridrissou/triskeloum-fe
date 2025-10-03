import { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useLoadUserQuery } from "../services/api";
import Loading from "./Loading";

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { data: response, isLoading, error, refetch } = useLoadUserQuery({});
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && response?.user) {
      const userRole = response.user?.role?.name;
      if (!allowedRoles.includes(userRole)) {
        navigate('/unauthorized');
      }
    }
  }, [isLoading, response, allowedRoles, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !response?.user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = response.user.role.name;
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;