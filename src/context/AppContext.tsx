import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { Profile, PaymentRequest, SuccessStory, Article } from '../types';
import { t as i18nTranslate, Lang } from '../i18n';

interface AppState {
  isLoggedIn: boolean;
  currentUser: Profile | null;
  userGender: 'Male' | 'Female';
  currentView: string;
  userRole: 'user' | 'admin';
  darkMode: boolean;
  lang: Lang;
  profiles: Profile[];
  unlockedIds: string[];
  allPayments: PaymentRequest[];
  stories: SuccessStory[];
  articles: Article[];
  viewingProfile: Profile | null;
  activeUnlockTarget: Profile | null;
  isPaymentModalOpen: boolean;
  isAuthModalOpen: boolean;
  authModalInitialTab: 'register' | 'signin';
  notification: { type: 'success' | 'info'; text: string } | null;
  loading: boolean;
}

type Action =
  | { type: 'SET_LOGGED_IN'; payload: boolean }
  | { type: 'SET_CURRENT_USER'; payload: Profile | null }
  | { type: 'SET_USER_GENDER'; payload: 'Male' | 'Female' }
  | { type: 'SET_CURRENT_VIEW'; payload: string }
  | { type: 'SET_USER_ROLE'; payload: 'user' | 'admin' }
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'SET_LANG'; payload: Lang }
  | { type: 'SET_PROFILES'; payload: Profile[] }
  | { type: 'SET_UNLOCKED_IDS'; payload: string[] }
  | { type: 'SET_PAYMENTS'; payload: PaymentRequest[] }
  | { type: 'SET_STORIES'; payload: SuccessStory[] }
  | { type: 'SET_ARTICLES'; payload: Article[] }
  | { type: 'SET_VIEWING_PROFILE'; payload: Profile | null }
  | { type: 'SET_UNLOCK_TARGET'; payload: Profile | null }
  | { type: 'SET_PAYMENT_MODAL'; payload: boolean }
  | { type: 'SET_AUTH_MODAL'; payload: { open: boolean; tab: 'register' | 'signin' } }
  | { type: 'SET_NOTIFICATION'; payload: { type: 'success' | 'info'; text: string } | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_PROFILE'; payload: Profile }
  | { type: 'ADD_UNLOCK'; payload: string }
  | { type: 'ADD_PAYMENT'; payload: PaymentRequest }
  | { type: 'UPDATE_PAYMENT'; payload: { id: string; status: 'Approved' | 'Rejected' } }
  | { type: 'ADD_STORY'; payload: SuccessStory };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_LOGGED_IN': return { ...state, isLoggedIn: action.payload };
    case 'SET_CURRENT_USER': return { ...state, currentUser: action.payload };
    case 'SET_USER_GENDER': return { ...state, userGender: action.payload };
    case 'SET_CURRENT_VIEW': return { ...state, currentView: action.payload };
    case 'SET_USER_ROLE': return { ...state, userRole: action.payload };
    case 'SET_DARK_MODE': return { ...state, darkMode: action.payload };
    case 'SET_LANG': return { ...state, lang: action.payload };
    case 'SET_PROFILES': return { ...state, profiles: action.payload };
    case 'SET_UNLOCKED_IDS': return { ...state, unlockedIds: action.payload };
    case 'SET_PAYMENTS': return { ...state, allPayments: action.payload };
    case 'SET_STORIES': return { ...state, stories: action.payload };
    case 'SET_ARTICLES': return { ...state, articles: action.payload };
    case 'SET_VIEWING_PROFILE': return { ...state, viewingProfile: action.payload };
    case 'SET_UNLOCK_TARGET': return { ...state, activeUnlockTarget: action.payload };
    case 'SET_PAYMENT_MODAL': return { ...state, isPaymentModalOpen: action.payload };
    case 'SET_AUTH_MODAL': return { ...state, isAuthModalOpen: action.payload.open, authModalInitialTab: action.payload.tab };
    case 'SET_NOTIFICATION': return { ...state, notification: action.payload };
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profiles: state.profiles.map(p => p.id === action.payload.id ? action.payload : p),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser,
      };
    case 'ADD_UNLOCK':
      return { ...state, unlockedIds: state.unlockedIds.includes(action.payload) ? state.unlockedIds : [...state.unlockedIds, action.payload] };
    case 'ADD_PAYMENT':
      return { ...state, allPayments: [action.payload, ...state.allPayments] };
    case 'UPDATE_PAYMENT':
      return { ...state, allPayments: state.allPayments.map(p => p.id === action.payload.id ? { ...p, status: action.payload.status } : p) };
    case 'ADD_STORY':
      return { ...state, stories: [action.payload, ...state.stories] };
    default:
      return state;
  }
}

const initialState = (): AppState => ({
  isLoggedIn: false,
  currentUser: null,
  userGender: 'Male',
  currentView: 'home',
  userRole: 'user',
  darkMode: true,
  lang: 'en',
  profiles: [],
  unlockedIds: [],
  allPayments: [],
  stories: [],
  articles: [],
  viewingProfile: null,
  activeUnlockTarget: null,
  isPaymentModalOpen: false,
  isAuthModalOpen: false,
  authModalInitialTab: 'register',
  notification: null,
  loading: false,
});

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, initialState);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);

  const translate = useMemo(() => (key: string) => i18nTranslate(key, state.lang), [state.lang]);

  return (
    <AppContext.Provider value={{ state, dispatch, t: translate }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
