import { useState, useEffect } from 'react';
import { User } from '@/types';
import { authService } from '@/services';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication check failed');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login({ email, password });
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, phone?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register({ email, password, firstName, lastName, phone });
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.logout();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken();
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Token refresh failed');
      throw err;
    }
  };

  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  const getAuthToken = () => {
    return authService.getAuthToken();
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshToken,
    isAuthenticated,
    getAuthToken,
    checkAuth,
  };
}