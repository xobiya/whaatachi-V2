import React, { createContext, useContext, useReducer } from 'react';
import { Profile, PaymentRequest, SuccessStory, Article } from '../types';

interface DataState {
  profiles: Profile[];
  unlockedIds: string[];
  allPayments: PaymentRequest[];
  stories: SuccessStory[];
  articles: Article[];
  viewingProfile: Profile | null;
  activeUnlockTarget: Profile | null;
  isPaymentModalOpen: boolean;
}

type DataAction =
  | { type: 'SET_PROFILES'; payload: Profile[] }
  | { type: 'SET_UNLOCKED_IDS'; payload: string[] }
  | { type: 'SET_PAYMENTS'; payload: PaymentRequest[] }
  | { type: 'SET_STORIES'; payload: SuccessStory[] }
  | { type: 'SET_ARTICLES'; payload: Article[] }
  | { type: 'SET_VIEWING_PROFILE'; payload: Profile | null }
  | { type: 'SET_UNLOCK_TARGET'; payload: Profile | null }
  | { type: 'SET_PAYMENT_MODAL'; payload: boolean }
  | { type: 'UPDATE_PROFILE'; payload: Profile }
  | { type: 'ADD_UNLOCK'; payload: string }
  | { type: 'ADD_PAYMENT'; payload: PaymentRequest }
  | { type: 'UPDATE_PAYMENT'; payload: { id: string; status: 'Approved' | 'Rejected' } }
  | { type: 'ADD_STORY'; payload: SuccessStory };

function dataReducer(state: DataState, action: DataAction): DataState {
  switch (action.type) {
    case 'SET_PROFILES': return { ...state, profiles: action.payload };
    case 'SET_UNLOCKED_IDS': return { ...state, unlockedIds: action.payload };
    case 'SET_PAYMENTS': return { ...state, allPayments: action.payload };
    case 'SET_STORIES': return { ...state, stories: action.payload };
    case 'SET_ARTICLES': return { ...state, articles: action.payload };
    case 'SET_VIEWING_PROFILE': return { ...state, viewingProfile: action.payload };
    case 'SET_UNLOCK_TARGET': return { ...state, activeUnlockTarget: action.payload };
    case 'SET_PAYMENT_MODAL': return { ...state, isPaymentModalOpen: action.payload };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profiles: state.profiles.map(p => p.id === action.payload.id ? action.payload : p),
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

const initialDataState: DataState = {
  profiles: [],
  unlockedIds: [],
  allPayments: [],
  stories: [],
  articles: [],
  viewingProfile: null,
  activeUnlockTarget: null,
  isPaymentModalOpen: false,
};

const DataContext = createContext<{ state: DataState; dispatch: React.Dispatch<DataAction> } | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, initialDataState);
  return <DataContext.Provider value={{ state, dispatch }}>{children}</DataContext.Provider>;
}

export function useDataContext() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDataContext must be used within DataProvider');
  return ctx;
}
