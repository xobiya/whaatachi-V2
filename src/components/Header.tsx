import React, { useState } from 'react';
import { Heart, Menu, X, User, ShieldAlert, Sparkles, LogOut, CheckCircle2, Sun, Moon } from 'lucide-react';
import { Profile } from '../types';

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
  onOpenAuth?: (tab?: 'register' | 'signin') => void;
  currentUser?: Profile | null;
}

export default function Header({
  currentView,
  setCurrentView,
  userRole,
  setUserRole,
  isLoggedIn,
  setIsLoggedIn,
  userGender,
  setUserGender,
  pendingCount,
  darkMode,
  setDarkMode,
  onOpenAuth,
  currentUser
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setIsOpen(false);
  };

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Find Matches', view: 'dashboard' },
    { label: 'How It Works', view: 'faq' },
    { label: 'Success Stories', view: 'stories' },
    { label: 'Safety & Blog', view: 'blog' },
    { label: 'Help Desk', view: 'support' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-xs transition-colors duration-200" id="nav-header">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16 gap-4">
          
          {/* Left Side Group: Logo and Desktop Navigation */}
          <div className="flex items-center gap-8 lg:gap-10 xl:gap-12">
            {/* Logo */}
            <div className="flex items-center shrink-0">
              <button 
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-2 cursor-pointer focus:outline-hidden"
                id="logo-button"
              >
                <div className="bg-pink-100 dark:bg-pink-950/50 p-2 rounded-full text-pink-600 dark:text-pink-400">
                  <Heart className="h-5 w-5 fill-pink-500 text-pink-500 animate-pulse" />
                </div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                  Whaatachi
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              {navLinks.map((link) => {
                const isActive = currentView === link.view || 
                  (link.view === 'home' && currentView === 'landing') || 
                  (link.view === 'dashboard' && (currentView === 'dashboard' || currentView === 'history'));
                
                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.view)}
                    className={`text-sm font-medium transition-colors cursor-pointer py-2 ${
                      isActive
                        ? 'text-pink-600 dark:text-pink-400 border-b-2 border-pink-500 py-2 inline-flex items-center font-semibold'
                        : 'text-gray-650 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white py-2 inline-flex items-center'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side: Action Simulator Controls */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            
            {/* Elegant Dark mode switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-gray-500 dark:text-slate-300 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <Sun className="h-4.5 w-4.5 text-amber-400" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-slate-705" />
              )}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {currentUser?.image ? (
                    <img 
                      src={currentUser.image} 
                      alt={currentUser.name} 
                      className="w-8 h-8 rounded-full object-cover border border-pink-100 dark:border-pink-900"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-semibold text-sm">
                      {userGender === 'Male' ? 'M' : 'F'}
                    </div>
                  )}
                  <div className="text-left max-w-[120px]">
                    <p className="text-xs font-semibold text-gray-900 dark:text-slate-100 truncate" title={currentUser?.name || "Habesha Acc"}>
                      {currentUser?.name || 'Habesha Acc'}
                    </p>
                    <p className="text-[10px] text-gray-450 dark:text-slate-400 font-mono font-bold truncate">
                      {currentUser?.city || `Standard ${userGender}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setCurrentView('home');
                  }}
                  className="p-1 px-2 rounded-lg text-gray-400 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-300 hover:bg-pink-50 dark:hover:bg-pink-950/20 cursor-pointer transition-colors"
                  title="Logout Simulator"
                  id="logout-button"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth?.('signin')}
                  className="px-4 py-2 text-sm font-medium text-gray-650 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 transition-all cursor-pointer"
                  id="login-button"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth?.('register')}
                  className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white rounded-lg shadow-xs hover:shadow-sm cursor-pointer transition-all flex items-center gap-1"
                  id="register-button"
                >
                  Join Whaatachi
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu, gender and role quick selectors */}
          <div className="flex items-center lg:hidden gap-2">
            
            {/* Mobile dark mode option */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg text-gray-500 dark:text-slate-300 hover:bg-gray-105 hover:bg-gray-100 dark:hover:bg-slate-800"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-450 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-hidden cursor-pointer"
              id="mobile-menu-toggle"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="xl:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.view)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentView === link.view
                    ? 'bg-pink-50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300 font-semibold'
                    : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}



            <div className="border-t border-gray-100 dark:border-slate-800 pt-2 mt-2">
              {isLoggedIn ? (
                <div className="px-3 py-2">
                  <div className="flex items-center gap-3 mb-3">
                    {currentUser?.image ? (
                      <img 
                        src={currentUser.image} 
                        alt={currentUser.name} 
                        className="w-9 h-9 rounded-full object-cover border border-pink-100 dark:border-pink-900"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold">
                        {userGender === 'Male' ? 'M' : 'F'}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-gray-850 dark:text-slate-100 truncate max-w-[150px]">
                        {currentUser?.name || 'Habesha User'}
                      </p>
                      <p className="text-xs text-gray-450 dark:text-slate-400 font-mono">Mode: {userGender}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setIsOpen(false);
                      setCurrentView('home');
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-md text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out Simulation
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenAuth?.('signin');
                    }}
                    className="w-full text-center block px-4 py-2 text-sm font-medium text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/20 rounded-md transition-all cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenAuth?.('register');
                    }}
                    className="w-full text-center block px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 rounded-md shadow-sm transition-all cursor-pointer"
                  >
                    Join Whaatachi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
