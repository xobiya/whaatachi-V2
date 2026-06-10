import React, { useState } from 'react';
import { Heart, Menu, X, User, LogOut, Crown, ChevronDown, Moon, Sun, Compass, UserCircle } from 'lucide-react';
import TelegramIcon from './TelegramIcon';
import { Profile } from '../types';
import type { Lang } from '../i18n';
import { useAppContext } from '../context/AppContext';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userRole: 'user' | 'admin';
  setUserRole: (role: 'user' | 'admin') => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  userGender: 'Male' | 'Female';
  setUserGender: (gender: 'Male' | 'Female') => void;
  pendingCount: number;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  onOpenAuth?: (tab?: 'register' | 'signin') => void;
  currentUser?: Profile | null;
  onViewProfile?: (profile: Profile) => void;
}

const BOTTOM_NAV = [
  { labelKey: 'nav.matches', view: 'browse', icon: Compass },
  { labelKey: 'nav.support', view: 'support', icon: TelegramIcon },
];

export default function Header({
  currentView, setCurrentView,
  isLoggedIn, setIsLoggedIn,
  darkMode, setDarkMode,
  lang, setLang,
  onOpenAuth, currentUser,
  onViewProfile
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useAppContext();

  const handleNav = (view: string) => {
    setCurrentView(view);
    setIsOpen(false);
  };

  const isActive = (view: string) => currentView === view || (view === 'browse' && currentView === 'home');

  const userInitial = currentUser?.name?.[0] || 'U';

  return (
    <>
      {/* Top Header Bar */}
      <nav className="sticky top-0 z-50 bg-[#1A1118]/95 backdrop-blur-md border-b border-[#C9A84C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-14 sm:h-16">

            {/* Logo */}
            <button onClick={() => handleNav('home')} className="flex items-center gap-2 cursor-pointer">
              <img src="/assets/logos.png" alt="Whaatachi" className="h-14 sm:h-16 w-auto" />
              
            </button>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6">
              <button onClick={() => handleNav('browse')} className={`text-sm font-semibold transition-colors cursor-pointer ${isActive('browse') ? 'text-[#C9A84C]' : 'text-[#EDE6D9]/70 hover:text-[#FFFCF8]'}`}>{t('nav.matches')}</button>
              <button onClick={() => window.open('https://t.me/whaatachi_support', '_blank', 'noopener,noreferrer')} className="text-sm font-semibold transition-colors cursor-pointer text-[#EDE6D9]/70 hover:text-[#FFFCF8]">{t('nav.support')}</button>
            </div>

            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center gap-4">
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-[#EDE6D9]/50 hover:text-[#C9A84C] transition-colors cursor-pointer" title={darkMode ? t('common.light-mode') : t('common.dark-mode')}>
                {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              </button>
              <button onClick={() => setLang(lang === 'en' ? 'am' : 'en')} className="px-2.5 py-1.5 text-[10px] font-bold text-[#EDE6D9]/70 hover:text-[#C9A84C] border border-[#C9A84C]/20 hover:border-[#C9A84C]/60 rounded-lg transition-all cursor-pointer" title={lang === 'en' ? 'አማርኛ' : 'English'}>
                {lang === 'en' ? 'አማ' : 'EN'}
              </button>
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (currentUser && onViewProfile) {
                        onViewProfile(currentUser);
                      } else {
                        handleNav('profile');
                      }
                    }}
                    className="flex items-center gap-2 bg-[#FFFCF8]/5 border border-[#C9A84C]/20 rounded-full px-3 py-1.5 hover:bg-[#FFFCF8]/10 transition-colors cursor-pointer text-left focus:outline-hidden"
                  >
                    {currentUser?.image ? (
                      <img src={currentUser.image} alt="" className="w-7 h-7 rounded-full object-cover border border-[#C9A84C]/30" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#EB317A] text-[#C9A84C] flex items-center justify-center font-bold text-xs">
                        {userInitial}
                      </div>
                    )}
                    <span className="text-xs font-bold text-[#FFFCF8] max-w-[100px] truncate">{currentUser?.name || 'User'}</span>
                    <ChevronDown className="h-3 w-3 text-[#C9A84C]" />
                  </button>
                  <button onClick={() => { setIsLoggedIn(false); setCurrentView('home'); }} className="p-2 text-[#EDE6D9]/50 hover:text-[#C9A84C] transition-colors cursor-pointer">
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => onOpenAuth?.('register')} className="px-5 py-2 bg-[#EB317A] hover:bg-[#F04B8E] text-white text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-[#EB317A]/20">
                  <Crown className="h-4 w-4" />
                  {t('nav.create-profile')}
                </button>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="flex lg:hidden items-center gap-1">
              <button onClick={() => setLang(lang === 'en' ? 'am' : 'en')} className="px-2 py-1.5 text-[10px] font-bold text-[#EDE6D9]/70 hover:text-[#C9A84C] border border-[#C9A84C]/20 hover:border-[#C9A84C]/60 rounded-lg transition-all cursor-pointer" title={lang === 'en' ? 'አማርኛ' : 'English'}>
                {lang === 'en' ? 'አማ' : 'EN'}
              </button>
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-[#EDE6D9] cursor-pointer">
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#1A1118]/95 backdrop-blur-md border-t border-[#C9A84C]/10 safe-area-bottom">
        <div className="flex items-center justify-around py-1.5">
          {BOTTOM_NAV.map(({ labelKey, view, icon: Icon }) => (
            <button
              key={view}
              onClick={() => view === 'support' ? window.open('https://t.me/whaatachi_support', '_blank', 'noopener,noreferrer') : handleNav(view)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all cursor-pointer min-w-0 ${
                isActive(view)
                  ? 'text-[#C9A84C]'
                  : 'text-[#EDE6D9]/50 hover:text-[#FFFCF8]'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive(view) ? 'drop-shadow-[0_0_6px_rgba(201,168,76,0.4)]' : ''}`} />
              <span className={`text-[8px] font-bold tracking-wider ${isActive(view) ? 'text-[#C9A84C]' : 'text-[#EDE6D9]/50'}`}>
                {t(labelKey)}
              </span>
            </button>
          ))}
          <button
            onClick={() => {
              if (isLoggedIn && currentUser) {
                onViewProfile ? onViewProfile(currentUser) : handleNav('profile');
              } else {
                onOpenAuth?.('register');
              }
            }}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all cursor-pointer min-w-0 ${
              currentView === 'profile' ? 'text-[#C9A84C]' : 'text-[#EDE6D9]/50 hover:text-[#FFFCF8]'
            }`}
          >
            {isLoggedIn && currentUser?.image ? (
              <img src={currentUser.image} alt="" className="h-5 w-5 rounded-full object-cover border border-[#C9A84C]/40" referrerPolicy="no-referrer" />
            ) : (
              <UserCircle className={`h-5 w-5 ${currentView === 'profile' ? 'drop-shadow-[0_0_6px_rgba(201,168,76,0.4)]' : ''}`} />
            )}
            <span className={`text-[8px] font-bold tracking-wider ${currentView === 'profile' ? 'text-[#C9A84C]' : 'text-[#EDE6D9]/50'}`}>
              {isLoggedIn ? (currentUser?.name?.split(' ')[0] || t('nav.my-profile')) : t('nav.sign-in')}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Full screen overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-14 lg:hidden bg-[#120A0E] z-50 flex flex-col animate-fade-in">
          <div className="flex-1 overflow-y-auto px-4 py-5 pb-24">

            {/* User section */}
            {isLoggedIn && currentUser ? (
              <button
                onClick={() => { setIsOpen(false); onViewProfile ? onViewProfile(currentUser) : handleNav('profile'); }}
                className="w-full flex items-center gap-3 mb-6 p-3 bg-[#1A1118] rounded-2xl border border-[#C9A84C]/10 cursor-pointer text-left"
              >
                {currentUser.image ? (
                  <img src={currentUser.image} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-[#C9A84C]/30" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#EB317A] text-[#C9A84C] flex items-center justify-center font-bold text-lg">
                    {userInitial}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#FFFCF8] truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-[#EDE6D9]/50">{t('nav.my-profile')}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-[#C9A84C] rotate-[-90deg]" />
              </button>
            ) : (
              <div className="mb-6 p-4 bg-[#1A1118] rounded-2xl border border-[#C9A84C]/10 text-center">
                <p className="text-xs text-[#EDE6D9]/60 mb-3">{t('dashboard.sign-in-hint')}</p>
                <button onClick={() => { setIsOpen(false); onOpenAuth?.('register'); }} className="w-full py-3 bg-[#EB317A] hover:bg-[#F04B8E] text-white text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
                  <Crown className="h-4 w-4" />
                  {t('nav.create-profile')}
                </button>
              </div>
            )}

            {/* Settings */}
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-[#FFFCF8]/30 uppercase tracking-widest px-2 mb-2">{t('profile.basic-settings')}</p>
              <div className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold text-[#EDE6D9]/70">
                <div className="flex items-center gap-3">
                  {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
                  <span>{darkMode ? t('common.light-mode') : t('common.dark-mode')}</span>
                </div>
                <button onClick={() => setDarkMode(!darkMode)} className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${darkMode ? 'bg-[#C9A84C]' : 'bg-[#FFFCF8]/20'}`}>
                  <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${darkMode ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            {/* Logout */}
            {isLoggedIn && (
              <div className="mt-6 pt-4 border-t border-[#C9A84C]/10">
                <button onClick={() => { setIsLoggedIn(false); setIsOpen(false); setCurrentView('home'); }} className="w-full py-3 rounded-xl text-sm font-bold text-[#EB317A] hover:bg-[#EB317A]/10 transition-all cursor-pointer flex items-center justify-center gap-2">
                  <LogOut className="h-4 w-4" />
                  {t('nav.sign-out')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}


