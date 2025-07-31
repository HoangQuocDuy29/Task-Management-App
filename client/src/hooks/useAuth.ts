import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { getUser, setAuth, clearAuth, User } from '../utils/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = getUser();
    setUser(savedUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;
      
      setAuth(token, user);
      setUser(user);
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  return { user, login, logout, loading };
};