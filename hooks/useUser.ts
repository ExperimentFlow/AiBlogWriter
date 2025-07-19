import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  role: 'admin' | 'user' | 'manager';
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  domain?: string;
  logo?: string;
  favicon?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserSession {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export const useUser = () => {
  const [session, setSession] = useState<UserSession>({
    user: null,
    tenant: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = useCallback(async () => {
    try {
      setSession(prev => ({ ...prev, isLoading: true, error: null }));

      // Validate session with backend using cookies
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This ensures cookies are sent
      });

      if (response.ok) {
        const data = await response.json();
        setSession({
          user: data.user,
          tenant: data.tenant,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        // No valid session found
        setSession({
          user: null,
          tenant: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setSession({
        user: null,
        tenant: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to check session',
      });
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setSession(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        const sessionData = {
          user: data.user,
          tenant: data.tenant,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        };

        setSession(sessionData);
        
        return { success: true, data: sessionData };
      } else {
        const errorMessage = data.error || 'Login failed';
        setSession(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'Network error during login';
      setSession(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (registerData: RegisterData) => {
    try {
      setSession(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (response.ok) {
        const sessionData = {
          user: data.user,
          tenant: data.tenant,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        };

        setSession(sessionData);
        
        return { success: true, data: sessionData };
      } else {
        const errorMessage = data.error || 'Registration failed';
        setSession(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = 'Network error during registration';
      setSession(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setSession(prev => ({ ...prev, isLoading: true }));

      // Call logout endpoint
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });

      // Reset session state
      setSession({
        user: null,
        tenant: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      setSession({
        user: null,
        tenant: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      return { success: true };
    }
  }, []);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    try {
      setSession(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedSession = {
          ...session,
          user: { ...session.user!, ...data.user },
          isLoading: false,
          error: null,
        };

        setSession(updatedSession);
        
        return { success: true, data: updatedSession };
      } else {
        const errorMessage = data.error || 'Update failed';
        setSession(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Update user error:', error);
      const errorMessage = 'Network error during update';
      setSession(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [session]);

  const refreshSession = useCallback(async () => {
    try {
      setSession(prev => ({ ...prev, isLoading: true, error: null }));

      // Get fresh session data from the server
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const sessionData = {
          user: data.user,
          tenant: data.tenant,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        };

        setSession(sessionData);
        
        return { success: true, data: sessionData };
      } else {
        setSession(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: 'Failed to refresh session' };
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      setSession(prev => ({ ...prev, isLoading: false, error: 'Failed to refresh session' }));
      return { success: false, error: 'Failed to refresh session' };
    }
  }, []);

  const clearError = useCallback(() => {
    setSession(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    user: session.user,
    tenant: session.tenant,
    isAuthenticated: session.isAuthenticated,
    isLoading: session.isLoading,
    error: session.error,

    // Actions
    login,
    register,
    logout,
    updateUser,
    refreshSession,
    clearError,

    // Computed values
    isAdmin: session.user?.role === 'admin',
    isManager: session.user?.role === 'manager',
    isUser: session.user?.role === 'user',
    fullName: session.user ? `${session.user.firstName} ${session.user.lastName}` : '',
    initials: session.user ? `${session.user.firstName[0]}${session.user.lastName[0]}` : '',
  };
}; 