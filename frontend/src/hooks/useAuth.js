import useAuthStore from '../store/authStore';

const useAuth = () => {
  const { token, user, login, logout, setUser } = useAuthStore();
  return {
    token,
    user,
    isAuthenticated: !!token,  // похідне від token
    login,
    logout,
    setUser,
  };
};

export default useAuth;