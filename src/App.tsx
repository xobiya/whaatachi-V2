import React, { useEffect, useMemo, Suspense, lazy, useState, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PaymentModal from './components/PaymentModal';
import OnboardingFlow from './views/OnboardingFlow';
import ProfileListing from './views/ProfileListing';
const Dashboard = lazy(() => import('./views/Dashboard'));
const UnlockHistory = lazy(() => import('./views/UnlockHistory'));
const FAQSection = lazy(() => import('./views/FAQSection'));
const SuccessStories = lazy(() => import('./views/SuccessStories'));
const BlogPage = lazy(() => import('./views/BlogPage'));
const AdminPanel = lazy(() => import('./views/AdminPanel'));
const SupportPanel = lazy(() => import('./views/SupportPanel'));
const ProfilePage = lazy(() => import('./views/ProfilePage'));
import { Heart } from 'lucide-react';
import { Profile, PaymentRequest, SuccessStory } from './types';
import * as api from './services/api';
import { CheckCircle, ShieldAlert, Clock } from 'lucide-react';
import { AppProvider, useAppContext } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';

function AppContent() {
  const { state, dispatch, t } = useAppContext();
  const [authIntent, setAuthIntent] = useState<'register' | 'signin'>('register');
  const [isRegistering, setIsRegistering] = useState(false);
  const [paymentCountdown, setPaymentCountdown] = useState(0);
  const paymentTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const checkPath = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        dispatch({ type: 'SET_USER_ROLE', payload: 'admin' });
        dispatch({ type: 'SET_CURRENT_VIEW', payload: 'admin' });
      } else if (path === '/history') {
        dispatch({ type: 'SET_CURRENT_VIEW', payload: 'history' });
      } else if (path === '/dashboard') {
        dispatch({ type: 'SET_CURRENT_VIEW', payload: 'dashboard' });
      } else if (path === '/browse') {
        dispatch({ type: 'SET_CURRENT_VIEW', payload: 'browse' });
      } else if (path === '/faq') {
        dispatch({ type: 'SET_CURRENT_VIEW', payload: 'faq' });
      } else if (path === '/stories') {
        dispatch({ type: 'SET_CURRENT_VIEW', payload: 'stories' });
      } else if (path === '/blog') {
        dispatch({ type: 'SET_CURRENT_VIEW', payload: 'blog' });
      } else if (path === '/support') {
        dispatch({ type: 'SET_CURRENT_VIEW', payload: 'support' });
      } else if (path === '/profile') {
        const savedUser = localStorage.getItem('whaatachi_logged_in_user_v1');
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            dispatch({ type: 'SET_VIEWING_PROFILE', payload: parsedUser });
            dispatch({ type: 'SET_CURRENT_VIEW', payload: 'profile' });
          } catch (e) {
            dispatch({ type: 'SET_CURRENT_VIEW', payload: 'home' });
          }
        } else {
          dispatch({ type: 'SET_CURRENT_VIEW', payload: 'home' });
        }
      } else if (path === '/') {
        dispatch({ type: 'SET_CURRENT_VIEW', payload: 'home' });
      }
    };

    checkPath();

    const handlePopState = () => {
      checkPath();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [dispatch]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    let targetPath = '/';
    if (state.currentView === 'home') targetPath = '/';
    else if (state.currentView === 'browse') targetPath = '/browse';
    else targetPath = `/${state.currentView}`;

    if (currentPath !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  }, [state.currentView]);

  useEffect(() => {
    if (!state.isLoggedIn) {
      localStorage.removeItem('whaatachi_logged_in_user_v1');
      dispatch({ type: 'SET_CURRENT_USER', payload: null });
    }
  }, [state.isLoggedIn, dispatch]);

  const triggerNotification = (type: 'success' | 'info', text: string) => {
    dispatch({ type: 'SET_NOTIFICATION', payload: { type, text } });
    setTimeout(() => dispatch({ type: 'SET_NOTIFICATION', payload: null }), 5000);
  };

  const handleSubmitPayment = async (
    profileId: string,
    profileName: string,
    profileImage: string,
    senderName: string,
    senderPhone: string,
    transactionId: string,
    method: 'Telebirr' | 'CBE Birr',
    amount: number
  ) => {
    const newRequest: PaymentRequest = {
      id: `p-${Date.now()}`,
      profileId,
      profileName,
      profileImage,
      senderName,
      senderPhone,
      transactionId: transactionId.toUpperCase(),
      method,
      amount,
      timestamp: new Date().toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Pending',
      receiptImage: undefined
    };

    dispatch({ type: 'ADD_PAYMENT', payload: newRequest });
    triggerNotification('info', t('app.notify.submitted').replace('{txId}', transactionId));

    try {
      await api.submitPayment({
        profileId, profileName, profileImage,
        senderName, senderPhone, transactionId,
        method, amount,
      });
    } catch {
      // local-only fallback
    }
  };

  const handleApprovePayment = (paymentId: string) => {
    const payment = state.allPayments.find(p => p.id === paymentId);
    if (!payment) return;

    dispatch({ type: 'UPDATE_PAYMENT', payload: { id: paymentId, status: 'Approved' } });
    dispatch({ type: 'ADD_UNLOCK', payload: payment.profileId });

    const updatedProfiles = state.profiles.map((profile) => {
      if (profile.name.toLowerCase() === payment.senderName.toLowerCase()) {
        return { ...profile, verified: true };
      }
      return profile;
    });
    dispatch({ type: 'SET_PROFILES', payload: updatedProfiles });
    triggerNotification('success', t('app.notify.approved').replace('{name}', payment.profileName));

    api.approvePayment(paymentId).catch(() => {});
  };

  const handleRejectPayment = (paymentId: string) => {
    dispatch({ type: 'UPDATE_PAYMENT', payload: { id: paymentId, status: 'Rejected' } });
    triggerNotification('info', t('app.notify.rejected'));
    api.rejectPayment(paymentId).catch(() => {});
  };

  const handleAddStory = (coupleNames: string, story: string, year: string, image: string) => {
    const newStory: SuccessStory = {
      id: `story-${Date.now()}`,
      coupleNames,
      story,
      year,
      image
    };
    dispatch({ type: 'ADD_STORY', payload: newStory });
    triggerNotification('success', t('app.notify.story-saved'));
    api.createStory({ coupleNames, story, year, image }).catch(() => {});
  };

  const handleRegisterUser = async (newProfile: Profile) => {
    setIsRegistering(true);
    setTimeout(() => setIsRegistering(false), 2000);
    const profileWithLookingFor = { ...newProfile, lookingFor: newProfile.lookingFor || (newProfile.gender === 'Male' ? 'Female' : 'Male') };
    dispatch({ type: 'SET_CURRENT_USER', payload: profileWithLookingFor });
    dispatch({ type: 'SET_LOGGED_IN', payload: true });
    dispatch({ type: 'SET_USER_GENDER', payload: profileWithLookingFor.gender });
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'browse' });
    dispatch({ type: 'SET_PROFILES', payload: [profileWithLookingFor, ...state.profiles] });
    localStorage.setItem('whaatachi_logged_in_user_v1', JSON.stringify(profileWithLookingFor));
    triggerNotification('success', t('app.notify.welcome').replace('{name}', profileWithLookingFor.name));

    try {
      const result = await api.register({
        id: newProfile.id,
        name: newProfile.name,
        gender: newProfile.gender,
        age: newProfile.age,
        city: newProfile.city,
        address: newProfile.address,
        bio: newProfile.bio,
        image: newProfile.image,
        status: newProfile.status,
        relationshipIntent: newProfile.relationshipIntent,
        lookingFor: newProfile.lookingFor,
        phone: newProfile.contactInfo.phone,
        telegram: newProfile.contactInfo.telegram,
        instagram: newProfile.contactInfo.instagram,
        email: newProfile.contactInfo.email,
      });
      localStorage.setItem('whaatachi_token_v1', result.token);
    } catch {
      // local-only fallback
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentCountdown(300);
    dispatch({ type: 'SET_PAYMENT_MODAL', payload: false });
    dispatch({ type: 'SET_UNLOCK_TARGET', payload: null });
    if (paymentTimerRef.current) clearInterval(paymentTimerRef.current);
    paymentTimerRef.current = setInterval(() => {
      setPaymentCountdown(prev => {
        if (prev <= 1) {
          if (paymentTimerRef.current) clearInterval(paymentTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSignInUser = async (name: string, phone: string, telegram?: string, instagram?: string): Promise<boolean> => {
    const normalize = (s: string) => s.replace(/[@\s]/g, '').toLowerCase();
    const found = state.profiles.find((p) => {
      if (p.name.toLowerCase() !== name.toLowerCase()) return false;
      if (phone && (p.contactInfo.phone === phone || p.contactInfo.phone.replace(/\s/g, '') === phone.replace(/\s/g, ''))) return true;
      if (telegram && (normalize(p.contactInfo.telegram) === normalize(telegram) || p.contactInfo.telegram.toLowerCase() === telegram.toLowerCase())) return true;
      if (instagram && (normalize(p.contactInfo.instagram) === normalize(instagram) || p.contactInfo.instagram.toLowerCase() === instagram.toLowerCase())) return true;
      return false;
    }) || state.profiles.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );

    if (found) {
      const profileWithLookingFor = { ...found, lookingFor: found.lookingFor || (found.gender === 'Male' ? 'Female' : 'Male') };
      localStorage.setItem('whaatachi_logged_in_user_v1', JSON.stringify(profileWithLookingFor));
      dispatch({ type: 'SET_CURRENT_USER', payload: profileWithLookingFor });
      dispatch({ type: 'SET_LOGGED_IN', payload: true });
      dispatch({ type: 'SET_USER_GENDER', payload: profileWithLookingFor.gender });
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'browse' });
      triggerNotification('success', t('app.notify.welcome-back').replace('{name}', found.name));

      try {
        const result = await api.login(name, phone);
        localStorage.setItem('whaatachi_token_v1', result.token);
      } catch {
        // local-only fallback
      }

      return true;
    } else {
      return false;
    }
  };

  const handleSimulateTestLogin = async (profile: Profile) => {
    const updatedProfile = { ...profile, lookingFor: profile.lookingFor || (profile.gender === 'Male' ? 'Female' : 'Male') };
    localStorage.setItem('whaatachi_logged_in_user_v1', JSON.stringify(updatedProfile));
    dispatch({ type: 'SET_CURRENT_USER', payload: updatedProfile });
    dispatch({ type: 'SET_LOGGED_IN', payload: true });
    dispatch({ type: 'SET_USER_GENDER', payload: updatedProfile.gender });
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'browse' });
    triggerNotification('success', t('app.notify.welcome-back').replace('{name}', profile.name));
    try {
      const result = await api.login(profile.name);
      localStorage.setItem('whaatachi_token_v1', result.token);
    } catch {
      // local-only fallback
    }
  };

  const handleUpdateBio = (newBio: string) => {
    if (!state.currentUser) return;
    const updatedUser = { ...state.currentUser, bio: newBio };
    dispatch({ type: 'UPDATE_PROFILE', payload: updatedUser });
    localStorage.setItem('whaatachi_logged_in_user_v1', JSON.stringify(updatedUser));
    triggerNotification('success', t('app.notify.bio-updated'));
  };

  const handleUpdateStatus = (newStatus: 'Online' | 'Offline' | 'Recently Active') => {
    if (!state.currentUser) return;
    const updatedUser = { ...state.currentUser, status: newStatus };
    dispatch({ type: 'UPDATE_PROFILE', payload: updatedUser });
    localStorage.setItem('whaatachi_logged_in_user_v1', JSON.stringify(updatedUser));
    triggerNotification('success', t('app.notify.status-set').replace('{status}', newStatus));
  };

  const handleSaveProfile = (updated: Profile) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: updated });
    if (state.currentUser?.id === updated.id) {
      localStorage.setItem('whaatachi_logged_in_user_v1', JSON.stringify(updated));
    }
    triggerNotification('success', t('app.notify.profile-updated'));
    api.updateProfile(updated.id, updated).catch(() => {});
  };

  const handleViewProfile = (profile: Profile) => {
    dispatch({ type: 'SET_VIEWING_PROFILE', payload: profile });
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'profile' });
  };

  const handleUnlockTrigger = (profile: Profile) => {
    if (!state.isLoggedIn) {
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'home' });
      return;
    }
    dispatch({ type: 'SET_UNLOCK_TARGET', payload: profile });
    dispatch({ type: 'SET_PAYMENT_MODAL', payload: true });
  };

  const activePendingPayments = useMemo(() => {
    return state.allPayments.filter(p => p.status === 'Pending');
  }, [state.allPayments]);

  const unlockedProfilesList = useMemo(() => {
    return state.profiles.filter(p => state.unlockedIds.includes(p.id));
  }, [state.profiles, state.unlockedIds]);

  const userLookingFor = useMemo<'Male' | 'Female'>(() => {
    if (state.currentUser?.lookingFor) return state.currentUser.lookingFor;
    return state.userGender === 'Male' ? 'Female' : 'Male';
  }, [state.currentUser, state.userGender]);

  const userHasPaid = useMemo(() => {
    if (!state.currentUser) return false;
    const name = state.currentUser.name.toLowerCase();
    return state.allPayments.some(p => p.status === 'Approved' && p.senderName.toLowerCase() === name);
  }, [state.allPayments, state.currentUser]);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFFCF8] dark:bg-[#120A0E]">
        <div className="w-10 h-10 border-2 border-[#EB317A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Admin Panel (no header/footer) ──
  if (state.currentView === 'admin') {
    return (
      <div className="font-sans">
        <AdminPanel
          allPayments={state.allPayments}
          setAllPayments={(p: any) => dispatch({ type: 'SET_PAYMENTS', payload: typeof p === 'function' ? p(state.allPayments) : p })}
          profiles={state.profiles}
          setProfiles={(p: any) => dispatch({ type: 'SET_PROFILES', payload: typeof p === 'function' ? p(state.profiles) : p })}
          stories={state.stories}
          setStories={(s: any) => dispatch({ type: 'SET_STORIES', payload: typeof s === 'function' ? s(state.stories) : s })}
          onApprove={handleApprovePayment}
          onReject={handleRejectPayment}
          setUserRole={(r) => dispatch({ type: 'SET_USER_ROLE', payload: r })}
          setCurrentView={(v) => dispatch({ type: 'SET_CURRENT_VIEW', payload: v })}
          isLoggedIn={state.isLoggedIn}
          darkMode={state.darkMode}
          setDarkMode={(d) => dispatch({ type: 'SET_DARK_MODE', payload: d })}
        />
      </div>
    );
  }

  // ── Onboarding (no header/footer) — shown when not logged in ──
  if (!state.isLoggedIn && state.currentView === 'home') {
    return (
      <OnboardingFlow
        onComplete={handleRegisterUser}
        onSignIn={handleSignInUser}
        authIntent={authIntent}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFCF8] dark:bg-[#120A0E] text-[#1A1118] dark:text-[#FFFCF8] transition-colors duration-250 pb-16 lg:pb-0" id="main-app-container">

      {/* 1. Header */}
      <Header
        currentView={state.currentView}
        setCurrentView={(v) => dispatch({ type: 'SET_CURRENT_VIEW', payload: v })}
        userRole={state.userRole}
        setUserRole={(r) => dispatch({ type: 'SET_USER_ROLE', payload: r })}
        isLoggedIn={state.isLoggedIn}
        setIsLoggedIn={(v) => {
          dispatch({ type: 'SET_LOGGED_IN', payload: v });
          if (!v) {
            localStorage.removeItem('whaatachi_logged_in_user_v1');
            localStorage.removeItem('whaatachi_token_v1');
            dispatch({ type: 'SET_CURRENT_VIEW', payload: 'home' });
          }
        }}
        userGender={state.userGender}
        setUserGender={(g) => dispatch({ type: 'SET_USER_GENDER', payload: g })}
        pendingCount={activePendingPayments.length}
        darkMode={state.darkMode}
        setDarkMode={(d) => dispatch({ type: 'SET_DARK_MODE', payload: d })}
        lang={state.lang}
        setLang={(l) => dispatch({ type: 'SET_LANG', payload: l })}
        onOpenAuth={(tab) => { dispatch({ type: 'SET_CURRENT_VIEW', payload: 'home' }); setAuthIntent(tab || 'register'); }}
        currentUser={state.currentUser}
      />

      {/* 2. Toast notifications */}
      {state.notification && (
        <div
          className={`fixed top-20 right-5 z-55 max-w-sm p-4 rounded-2xl shadow-xl flex items-start gap-3 border animate-slide-up ${
            state.notification.type === 'success'
              ? 'bg-[#F8F4ED] border-[#C9A84C]/40 text-[#1A1118]'
              : 'bg-[#F8F4ED] border-[#EB317A]/20 text-[#1A1118]'
          }`}
          id="toast-notification"
        >
          {state.notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="h-5 w-5 text-[#EB317A] shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-bold text-xs text-[#EB317A]">{t('app.name')}</p>
            <p className="text-[11px] font-medium leading-relaxed mt-0.5 text-gray-700">{state.notification.text}</p>
          </div>
        </div>
      )}

      {/* 3. Core views */}
      <main className="grow" id="primary-view-stage">
        <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[#EB317A] border-t-transparent rounded-full animate-spin" /></div>}>

          {/* Browse — main post-registration listing */}
          {(state.currentView === 'home' || state.currentView === 'browse') && state.isLoggedIn && state.currentUser && (
            <ProfileListing
              profiles={state.profiles}
              currentUser={state.currentUser}
              hasPaid={userHasPaid}
              onMakePayment={handleUnlockTrigger}
            />
          )}

          {/* Profile page */}
          {state.currentView === 'profile' && (state.viewingProfile || state.currentUser) && (
            <ProfilePage
              profile={state.viewingProfile || state.currentUser!}
              isUnlocked={state.viewingProfile ? state.unlockedIds.includes(state.viewingProfile.id) : true}
              pendingPayment={state.viewingProfile ? state.allPayments.find(p => p.profileId === state.viewingProfile!.id && p.status === 'Pending') : undefined}
              userGender={state.userGender}
              isOwnProfile={!state.viewingProfile || state.currentUser?.id === state.viewingProfile.id}
              onBack={() => {
                if (!state.viewingProfile || state.currentUser?.id === state.viewingProfile.id) {
                  dispatch({ type: 'SET_CURRENT_VIEW', payload: 'browse' });
                } else {
                  dispatch({ type: 'SET_CURRENT_VIEW', payload: 'browse' });
                }
              }}
              onUnlockClick={handleUnlockTrigger}
              onSaveProfile={handleSaveProfile}
            />
          )}

          {/* Discover dashboard (optional advanced browse) */}
          {state.currentView === 'dashboard' && (
            <Dashboard
              profiles={state.profiles}
              hasPaid={userHasPaid}
              userGender={state.userGender}
              userLookingFor={userLookingFor}
              isLoggedIn={state.isLoggedIn}
              onMakePayment={handleUnlockTrigger}
            />
          )}

          {/* History */}
          {state.currentView === 'history' && (
            <UnlockHistory
              unlockedProfiles={unlockedProfilesList}
              onBackToFinder={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'browse' })}
              onViewProfile={handleViewProfile}
            />
          )}

          {/* FAQ */}
          {state.currentView === 'faq' && <FAQSection />}

          {/* Success Stories */}
          {state.currentView === 'stories' && (
            <SuccessStories
              stories={state.stories}
              onAddStory={handleAddStory}
            />
          )}

          {/* Blog */}
          {state.currentView === 'blog' && <BlogPage articles={state.articles} />}

          {/* Support */}
          {state.currentView === 'support' && <SupportPanel />}

        </Suspense>
      </main>

      {/* 4. Payment modal */}
      {state.activeUnlockTarget && (
        <PaymentModal
          profile={state.activeUnlockTarget}
          isOpen={state.isPaymentModalOpen}
          onClose={() => {
            dispatch({ type: 'SET_PAYMENT_MODAL', payload: false });
            dispatch({ type: 'SET_UNLOCK_TARGET', payload: null });
          }}
          onSubmitPayment={handleSubmitPayment}
          onPaymentSuccess={handlePaymentSuccess}
          userGender={state.userGender}
        />
      )}

      {/* 5. Footer */}
      <Footer
        setCurrentView={(v) => dispatch({ type: 'SET_CURRENT_VIEW', payload: v })}
        isLoggedIn={state.isLoggedIn}
      />

      {isRegistering && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1A1118]/95 backdrop-blur-sm transition-opacity duration-500">
          <div className="relative">
            <Heart className="h-16 w-16 text-[#EB317A] animate-pulse" fill="#EB317A" />
            <Heart className="absolute -top-4 -right-8 h-8 w-8 text-[#C9A84C] animate-bounce" fill="#C9A84C" />
            <Heart className="absolute -bottom-4 -left-8 h-8 w-8 text-pink-400 animate-ping" fill="#F472B6" />
          </div>
          <div className="mt-8 text-center space-y-2">
            <h2 className="text-xl font-black text-[#FFFCF8] tracking-tight">Finding your match...</h2>
            <p className="text-sm text-[#EDE6D9]/60 font-light">Setting up your romantic journey</p>
          </div>
          <div className="mt-8 flex gap-3">
            <div className="w-2 h-2 rounded-full bg-[#EB317A] animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      {paymentCountdown > 0 && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1A1118]/95 backdrop-blur-sm transition-opacity duration-500">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-black text-[#FFFCF8] tracking-tight">Payment Submitted!</h2>
          <p className="text-sm text-[#EDE6D9]/60 font-light mt-2 max-w-xs text-center">
            Please wait approximately 5 minutes for admin approval. Your contact will be unlocked once approved.
          </p>
          <div className="flex items-center gap-3 bg-[#F8F4ED]/10 border border-[#C9A84C]/20 rounded-xl px-8 py-4 mt-8">
            <Clock className="h-6 w-6 text-[#C9A84C]" />
            <span className="text-3xl font-black text-[#FFFCF8] tabular-nums">
              {String(Math.floor(paymentCountdown / 60)).padStart(2, '0')}:{String(paymentCountdown % 60).padStart(2, '0')}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Estimated time remaining for review
          </p>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AppProvider>
  );
}
