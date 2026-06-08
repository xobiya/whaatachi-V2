import React, { useState } from 'react';
import { Heart, Menu, X, User, LogOut, Crown, ChevronDown, Moon, Sun } from 'lucide-react';
import { Profile } from '../types';
import type { Lang } from '../i18n';

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

export default function Header({
  currentView, setCurrentView,
  isLoggedIn, setIsLoggedIn,
  darkMode, setDarkMode,
  lang, setLang,
  onOpenAuth, currentUser,
  onViewProfile
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (view: string) => {
    setCurrentView(view);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#1A1118]/95 backdrop-blur-md border-b border-[#C9A84C]/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <button onClick={() => handleNav('home')} className="flex items-center gap-2 cursor-pointer">
            <div className="bg-[#8B0020] p-1.5 rounded-lg">
              <Heart className="h-5 w-5 text-[#C9A84C] fill-[#C9A84C]" />
            </div>
            <span className="text-lg font-black text-[#FFFCF8] tracking-tight">
              Whaatachi
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            <button onClick={() => handleNav('browse')} className={`text-sm font-semibold transition-colors cursor-pointer ${currentView === 'browse' || currentView === 'home' ? 'text-[#C9A84C]' : 'text-[#EDE6D9]/70 hover:text-[#FFFCF8]'}`}>Matches</button>
            <button onClick={() => handleNav('history')} className={`text-sm font-semibold transition-colors cursor-pointer ${currentView === 'history' ? 'text-[#C9A84C]' : 'text-[#EDE6D9]/70 hover:text-[#FFFCF8]'}`}>Unlocked</button>
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-[#EDE6D9]/50 hover:text-[#C9A84C] transition-colors cursor-pointer" title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
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
                    <div className="w-7 h-7 rounded-full bg-[#8B0020] text-[#C9A84C] flex items-center justify-center font-bold text-xs">
                      {currentUser?.name?.[0] || 'U'}
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
              <>
                <button onClick={() => onOpenAuth?.('signin')} className="text-sm font-semibold text-[#EDE6D9]/70 hover:text-[#FFFCF8] transition-colors cursor-pointer">Sign In</button>
                <button onClick={() => onOpenAuth?.('register')} className="px-5 py-2 bg-[#8B0020] hover:bg-[#B31B3A] text-white text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-[#8B0020]/20">
                  <Crown className="h-4 w-4" />
                  Create Profile
                </button>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden items-center gap-1.5">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-[#EDE6D9]/50 hover:text-[#C9A84C] transition-colors cursor-pointer" title={darkMode ? 'Light' : 'Dark'}>
              {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
            <button onClick={() => setLang(lang === 'en' ? 'am' : 'en')} className="px-2 py-1 text-[9px] font-bold text-[#EDE6D9]/70 hover:text-[#C9A84C] border border-[#C9A84C]/20 hover:border-[#C9A84C]/60 rounded-lg transition-all cursor-pointer">
              {lang === 'en' ? 'አማ' : 'EN'}
            </button>
            {!isLoggedIn && (
              <button onClick={() => onOpenAuth?.('register')} className="px-4 py-1.5 bg-[#8B0020] text-white text-xs font-bold rounded-lg cursor-pointer">
                Join
              </button>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-[#EDE6D9] cursor-pointer">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#1A1118] border-t border-[#C9A84C]/10">
          <div className="px-4 py-4 space-y-2">
            {[
              { label: 'Matches', view: 'browse' },
              { label: 'Unlocked', view: 'history' },
            ].map((link) => (
              <button key={link.view} onClick={() => handleNav(link.view)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${currentView === link.view ? 'bg-[#8B0020]/30 text-[#C9A84C]' : 'text-[#EDE6D9]/70 hover:bg-[#FFFCF8]/5'}`}>
                {link.label}
              </button>
            ))}
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (currentUser && onViewProfile) {
                      onViewProfile(currentUser);
                    } else {
                      handleNav('profile');
                    }
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${currentView === 'profile' ? 'bg-[#8B0020]/30 text-[#C9A84C]' : 'text-[#EDE6D9]/70 hover:bg-[#FFFCF8]/5'}`}
                >
                  My Profile
                </button>
                <button onClick={() => { setIsLoggedIn(false); setIsOpen(false); setCurrentView('home'); }} className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#EDE6D9]/70 hover:bg-[#FFFCF8]/5">
                  Sign Out
                </button>
              </>
            ) : (
              <button onClick={() => { setIsOpen(false); onOpenAuth?.('register'); }} className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-[#C9A84C] hover:bg-[#FFFCF8]/5">
                Create Profile
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
