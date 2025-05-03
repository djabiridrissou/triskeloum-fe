import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadUserQuery } from "./api";


const useAuthCheck = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useLoadUserQuery(null, { skip: false });

  useEffect(() => {
    if (!isLoading && error) {
      navigate("/login");
    }
  }, [error, isLoading, navigate]);

  return { user: data, isLoading };
};

export default useAuthCheck;