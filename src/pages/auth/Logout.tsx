import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { api, useLogoutMutation } from '../../services/api';
import Loading from '../../components/Loading';

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation({});

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout().unwrap();
        localStorage.clear();
        dispatch(api.util.resetApiState());
        navigate('/login', { replace: true });
      } catch (error) {
        console.error('Logout error:', error);
        localStorage.clear();
        dispatch(api.util.resetApiState());
        navigate('/login', { replace: true });
      }
    };

    handleLogout();
  }, [navigate, dispatch, logout]);

  return <Loading />;
};

export default Logout;