import React, { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import { t as i18nTranslate, Lang } from '../i18n';

interface UIState {
  currentView: string;
  darkMode: boolean;
  lang: Lang;
  notification: { type: 'success' | 'info'; text: string } | null;
  loading: boolean;
}

type UIAction =
  | { type: 'SET_CURRENT_VIEW'; payload: string }
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'SET_LANG'; payload: Lang }
  | { type: 'SET_NOTIFICATION'; payload: { type: 'success' | 'info'; text: string } | null }
  | { type: 'SET_LOADING'; payload: boolean };

function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'SET_CURRENT_VIEW': return { ...state, currentView: action.payload };
    case 'SET_DARK_MODE': return { ...state, darkMode: action.payload };
    case 'SET_LANG': return { ...state, lang: action.payload };
    case 'SET_NOTIFICATION': return { ...state, notification: action.payload };
    case 'SET_LOADING': return { ...state, loading: action.payload };
    default: return state;
  }
}

const initialUIState: UIState = {
  currentView: 'home',
  darkMode: true,
  lang: 'en',
  notification: null,
  loading: false,
};

interface UIContextType {
  state: UIState;
  dispatch: React.Dispatch<UIAction>;
  t: (key: string) => string;
}

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(uiReducer, initialUIState);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);

  const translate = useMemo(() => (key: string) => i18nTranslate(key, state.lang), [state.lang]);

  return <UIContext.Provider value={{ state, dispatch, t: translate }}>{children}</UIContext.Provider>;
}

export function useUIContext() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUIContext must be used within UIProvider');
  return ctx;
}
