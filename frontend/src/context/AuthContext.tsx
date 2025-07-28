import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, LinkedInProfile } from '../types';
import { profileApi } from '../services/api';

interface AuthContextType extends AuthState {
  login: (accountId: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AUTHENTICATED'; payload: { accountId: string; profile?: LinkedInProfile } }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_AUTHENTICATED':
      return {
        ...state,
        isAuthenticated: true,
        accountId: action.payload.accountId,
        profile: action.payload.profile || null,
        loading: false,
        error: null
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOGOUT':
      return {
        isAuthenticated: false,
        accountId: null,
        profile: null,
        loading: false,
        error: null
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  isAuthenticated: false,
  accountId: null,
  profile: null,
  loading: false,
  error: null
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const storedAccountId = localStorage.getItem('accountId');
    if (storedAccountId) {
      login(storedAccountId);
    }
  }, []);

  const login = async (accountId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const profileResponse = await profileApi.getProfile(accountId);
      
      localStorage.setItem('accountId', accountId);
      dispatch({
        type: 'SET_AUTHENTICATED',
        payload: { accountId, profile: profileResponse.profile }
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch profile' });
    }
  };

  const logout = () => {
    localStorage.removeItem('accountId');
    dispatch({ type: 'LOGOUT' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 