import { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useLoadUserQuery, useRefreshTokenMutation } from "../services/api";
import Loading from "./Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { data: response, isLoading, error, refetch } = useLoadUserQuery(undefined);
  const [refreshToken] = useRefreshTokenMutation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleTokenRefresh = async () => {
      if (error && 'status' in error && error.status === 401) {
        const refreshTokenValue = localStorage.getItem('refreshToken');
        console.log("🔄 Refreshing token...", error);
        
        if (refreshTokenValue) {
          try {
            const result: any = await refreshToken().unwrap();
            
            localStorage.setItem('accessToken', result.payload.token);
            localStorage.setItem('refreshToken', result.payload.refreshToken);
            
            refetch();
          } catch (refreshError) {
            console.error("❌ Refresh failed:", refreshError);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/login', { replace: true });
          }
        } else {
          navigate('/login', { replace: true });
        }
      }
    };

    handleTokenRefresh();
  }, [error, refreshToken, refetch, navigate]);

  useEffect(() => {
    if (!isLoading && response?.payload) {
      const userRole = response.payload.role;
      
      if (!allowedRoles.includes(userRole)) {
        navigate('/unauthorized', { replace: true });
      }
    }
  }, [isLoading, response, allowedRoles, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !response?.payload) {
    return <Navigate to="/login" replace />;
  }

  const userRole = response.payload.role;
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;