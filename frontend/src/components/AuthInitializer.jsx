import { useEffect } from 'react';
import { getMeRequest } from '../api/auth.api';
import useAuth from '../hooks/useAuth';

const AuthInitializer = ({ children }) => {
  const { token, setUser } = useAuth();

  useEffect(() => {
    if (token) {
      getMeRequest()
        .then(res => setUser(res.data))
        .catch(() => {});
    }
  }, [token]);

  return children;
};

export default AuthInitializer;