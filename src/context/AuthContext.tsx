import React, { createContext, useContext, useReducer } from 'react';
import { Profile } from '../types';

interface AuthState {
  isLoggedIn: boolean;
  currentUser: Profile | null;
  userGender: 'Male' | 'Female';
  userRole: 'user' | 'admin';
  isAuthModalOpen: boolean;
  authModalInitialTab: 'register' | 'signin';
}

type AuthAction =
  | { type: 'SET_LOGGED_IN'; payload: boolean }
  | { type: 'SET_CURRENT_USER'; payload: Profile | null }
  | { type: 'SET_USER_GENDER'; payload: 'Male' | 'Female' }
  | { type: 'SET_USER_ROLE'; payload: 'user' | 'admin' }
  | { type: 'SET_AUTH_MODAL'; payload: { open: boolean; tab: 'register' | 'signin' } };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOGGED_IN': return { ...state, isLoggedIn: action.payload };
    case 'SET_CURRENT_USER': return { ...state, currentUser: action.payload };
    case 'SET_USER_GENDER': return { ...state, userGender: action.payload };
    case 'SET_USER_ROLE': return { ...state, userRole: action.payload };
    case 'SET_AUTH_MODAL': return { ...state, isAuthModalOpen: action.payload.open, authModalInitialTab: action.payload.tab };
    default: return state;
  }
}

const initialAuthState: AuthState = {
  isLoggedIn: false,
  currentUser: null,
  userGender: 'Male',
  userRole: 'user',
  isAuthModalOpen: false,
  authModalInitialTab: 'register',
};

const AuthContext = createContext<{ state: AuthState; dispatch: React.Dispatch<AuthAction> } | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
