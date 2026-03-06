/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/authService';
import { storeAuthData, clearAuthData, getStoredUser, isAuthenticated } from '../utils/authUtils';
import { handleApiError } from '../utils/errorUtils';

// Create Auth Context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated()) {
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          // Optionally fetch fresh user data
          try {
            const userData = await authAPI.getProfile();
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } catch (error) {
            console.error('Failed to fetch user profile:', error);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { user: newUser, tokens } = response;
      
      storeAuthData(tokens, newUser);
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      const errorMessage = handleApiError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { user: loggedInUser, tokens } = response;
      
      storeAuthData(tokens, loggedInUser);
      setUser(loggedInUser);
      
      return { success: true, user: loggedInUser };
    } catch (error) {
      const errorMessage = handleApiError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      setUser(null);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      const updatedUser = response.user;
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = handleApiError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Change password
  const changePassword = async (oldPassword, newPassword, newPassword2) => {
    try {
      await authAPI.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        new_password2: newPassword2,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = handleApiError(error);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
