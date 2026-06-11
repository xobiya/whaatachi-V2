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
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { UIProvider, useUIContext } from './context/UIContext';
import { DataProvider, useDataContext } from './context/DataContext';
import ErrorBoundary from './components/ErrorBoundary';

function AppContent() {
  const auth = useAuthContext();
  const ui = useUIContext();
  const data = useDataContext();
  const [authIntent, setAuthIntent] = useState<'register' | 'signin'>('register');
  const [isRegistering, setIsRegistering] = useState(false);
  const [paymentCountdown, setPaymentCountdown] = useState(0);
  const paymentTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    api.getMe().then(res => {
      if (res.user) {
        const p = res.user;
        auth.dispatch({ type: 'SET_CURRENT_USER', payload: p });
        auth.dispatch({ type: 'SET_LOGGED_IN', payload: true });
        auth.dispatch({ type: 'SET_USER_GENDER', payload: p.gender });
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const checkPath = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        auth.dispatch({ type: 'SET_USER_ROLE', payload: 'admin' });
        ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'admin' });
      } else if (path === '/history') {
        ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'history' });
      } else if (path === '/dashboard') {
        ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'dashboard' });
      } else if (path === '/browse') {
        ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'browse' });
      } else if (path === '/faq') {
        ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'faq' });
      } else if (path === '/stories') {
        ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'stories' });
      } else if (path === '/blog') {
        ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'blog' });
      } else if (path === '/support') {
        ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'support' });
      } else if (path === '/profile') {
        if (auth.state.currentUser) {
          data.dispatch({ type: 'SET_VIEWING_PROFILE', payload: auth.state.currentUser });
          ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'profile' });
        } else {
          ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'home' });
        }
      } else if (path === '/') {
        ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'home' });
      }
    };

    checkPath();

    const handlePopState = () => {
      checkPath();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [auth.dispatch, ui.dispatch, data.dispatch, auth.state.currentUser]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    let targetPath = '/';
    if (ui.state.currentView === 'home') targetPath = '/';
    else if (ui.state.currentView === 'browse') targetPath = '/browse';
    else targetPath = `/${ui.state.currentView}`;

    if (currentPath !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  }, [ui.state.currentView]);

  useEffect(() => {
    const view = ui.state.currentView;
    if (view === 'browse' || view === 'dashboard' || view === 'profile' || view === 'admin') {
      if (data.state.profiles.length === 0) {
        api.fetchProfiles({ limit: 100 }).then(res => {
          if (res && Array.isArray(res.profiles)) {
            data.dispatch({ type: 'SET_PROFILES', payload: res.profiles });
          }
        }).catch((err) => console.error('Failed to fetch profiles:', err));
      }
    }
    if (view === 'stories') {
      if (data.state.stories.length === 0) {
        api.fetchStories().then(res => {
          if (res && Array.isArray(res.stories)) {
            data.dispatch({ type: 'SET_STORIES', payload: res.stories });
          }
        }).catch((err) => console.error('Failed to fetch stories:', err));
      }
    }
    if (view === 'blog') {
      if (data.state.articles.length === 0) {
        api.fetchArticles().then(res => {
          if (res && Array.isArray(res.articles)) {
            data.dispatch({ type: 'SET_ARTICLES', payload: res.articles });
          }
        }).catch((err) => console.error('Failed to fetch articles:', err));
      }
    }
    if (view === 'admin') {
      api.fetchPayments().then(res => {
        if (res && Array.isArray(res.payments)) {
          data.dispatch({ type: 'MERGE_PAYMENTS', payload: res.payments });
        }
      }).catch((err) => console.error('Failed to fetch payments:', err));
    }
  }, [ui.state.currentView]);

  useEffect(() => {
    if (!auth.state.isLoggedIn) {
      auth.dispatch({ type: 'SET_CURRENT_USER', payload: null });
    }
  }, [auth.state.isLoggedIn, auth.dispatch]);

  const triggerNotification = (type: 'success' | 'info', text: string) => {
    ui.dispatch({ type: 'SET_NOTIFICATION', payload: { type, text } });
    setTimeout(() => ui.dispatch({ type: 'SET_NOTIFICATION', payload: null }), 5000);
  };

  const handleSubmitPayment = async (
    profileId: string,
    profileName: string,
    profileImage: string,
    senderName: string,
    senderPhone: string,
    transactionId: string,
    method: 'Telebirr' | 'CBE Birr',
    amount: number,
    receiptImage?: string
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
      receiptImage
    };

    data.dispatch({ type: 'ADD_PAYMENT', payload: newRequest });
    triggerNotification('info', ui.t('app.notify.submitted').replace('{txId}', transactionId));

    try {
      await api.submitPayment({
        profileId, profileName, profileImage,
        senderName, senderPhone, transactionId,
        method, amount, receiptImage,
      });
    } catch (err) {
      console.error('Payment submission to server failed (saved locally):', err);
    }
  };

  const handleApprovePayment = (paymentId: string) => {
    const payment = data.state.allPayments.find(p => p.id === paymentId);
    if (!payment) return;

    data.dispatch({ type: 'UPDATE_PAYMENT', payload: { id: paymentId, status: 'Approved' } });
    data.dispatch({ type: 'ADD_UNLOCK', payload: payment.profileId });

    const updatedProfiles = data.state.profiles.map((profile) => {
      if (profile.id === payment.profileId) {
        return { ...profile, verified: true };
      }
      return profile;
    });
    data.dispatch({ type: 'SET_PROFILES', payload: updatedProfiles });
    triggerNotification('success', ui.t('app.notify.approved').replace('{name}', payment.profileName));

    api.approvePayment(paymentId).catch((err) => console.error('Approve payment API error:', err));
  };

  const handleRejectPayment = (paymentId: string) => {
    data.dispatch({ type: 'UPDATE_PAYMENT', payload: { id: paymentId, status: 'Rejected' } });
    triggerNotification('info', ui.t('app.notify.rejected'));
    api.rejectPayment(paymentId).catch((err) => console.error('Reject payment API error:', err));
  };

  const handleAddStory = (coupleNames: string, story: string, year: string, image: string) => {
    const newStory: SuccessStory = {
      id: `story-${Date.now()}`,
      coupleNames,
      story,
      year,
      image
    };
    data.dispatch({ type: 'ADD_STORY', payload: newStory });
    triggerNotification('success', ui.t('app.notify.story-saved'));
    api.createStory({ coupleNames, story, year, image }).catch((err) => console.error('Create story API error:', err));
  };

  const handleRegisterUser = async (newProfile: Profile) => {
    setIsRegistering(true);
    setTimeout(() => setIsRegistering(false), 2000);
    const profileWithLookingFor = { ...newProfile, lookingFor: newProfile.lookingFor || (newProfile.gender === 'Male' ? 'Female' : 'Male') };
    auth.dispatch({ type: 'SET_CURRENT_USER', payload: profileWithLookingFor });
    auth.dispatch({ type: 'SET_LOGGED_IN', payload: true });
    auth.dispatch({ type: 'SET_USER_GENDER', payload: profileWithLookingFor.gender });
    ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'browse' });
    data.dispatch({ type: 'SET_PROFILES', payload: [profileWithLookingFor, ...data.state.profiles] });
    triggerNotification('success', ui.t('app.notify.welcome').replace('{name}', profileWithLookingFor.name));

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
    } catch (err) {
      console.error('Registration API error:', err);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentCountdown(300);
    data.dispatch({ type: 'SET_PAYMENT_MODAL', payload: false });
    data.dispatch({ type: 'SET_UNLOCK_TARGET', payload: null });
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

  const handleSignInUser = async (phone: string, telegram: string, instagram: string): Promise<boolean> => {
    const normalize = (s: string) => s.replace(/[@\s]/g, '').toLowerCase();
    const found = data.state.profiles.find((p) => {
      if (phone && (p.contactInfo.phone === phone || p.contactInfo.phone.replace(/\s/g, '') === phone.replace(/\s/g, ''))) return true;
      if (telegram && (normalize(p.contactInfo.telegram) === normalize(telegram) || p.contactInfo.telegram.toLowerCase() === telegram.toLowerCase())) return true;
      if (instagram && (normalize(p.contactInfo.instagram) === normalize(instagram) || p.contactInfo.instagram.toLowerCase() === instagram.toLowerCase())) return true;
      return false;
    });

    if (found) {
      const profileWithLookingFor = { ...found, lookingFor: found.lookingFor || (found.gender === 'Male' ? 'Female' : 'Male') };
      auth.dispatch({ type: 'SET_CURRENT_USER', payload: profileWithLookingFor });
      auth.dispatch({ type: 'SET_LOGGED_IN', payload: true });
      auth.dispatch({ type: 'SET_USER_GENDER', payload: profileWithLookingFor.gender });
      ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'browse' });
      triggerNotification('success', ui.t('app.notify.welcome-back').replace('{name}', found.name));

      await api.login(found.name, phone, telegram, instagram);
      return true;
    } else {
      return false;
    }
  };

  const handleSimulateTestLogin = async (profile: Profile) => {
    const updatedProfile = { ...profile, lookingFor: profile.lookingFor || (profile.gender === 'Male' ? 'Female' : 'Male') };
    auth.dispatch({ type: 'SET_CURRENT_USER', payload: updatedProfile });
    auth.dispatch({ type: 'SET_LOGGED_IN', payload: true });
    auth.dispatch({ type: 'SET_USER_GENDER', payload: updatedProfile.gender });
    ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'browse' });
    triggerNotification('success', ui.t('app.notify.welcome-back').replace('{name}', profile.name));
    try {
      await api.login(profile.name, undefined, profile.contactInfo.telegram, profile.contactInfo.instagram);
    } catch (err) {
      console.error('Test login API error:', err);
    }
  };

  const handleUpdateBio = (newBio: string) => {
    if (!auth.state.currentUser) return;
    const updatedUser = { ...auth.state.currentUser, bio: newBio };
    data.dispatch({ type: 'UPDATE_PROFILE', payload: updatedUser });
    auth.dispatch({ type: 'SET_CURRENT_USER', payload: updatedUser });
    triggerNotification('success', ui.t('app.notify.bio-updated'));
  };

  const handleUpdateStatus = (newStatus: 'Online' | 'Offline' | 'Recently Active') => {
    if (!auth.state.currentUser) return;
    const updatedUser = { ...auth.state.currentUser, status: newStatus };
    data.dispatch({ type: 'UPDATE_PROFILE', payload: updatedUser });
    auth.dispatch({ type: 'SET_CURRENT_USER', payload: updatedUser });
    triggerNotification('success', ui.t('app.notify.status-set').replace('{status}', newStatus));
  };

  const handleSaveProfile = (updated: Profile) => {
    data.dispatch({ type: 'UPDATE_PROFILE', payload: updated });
    if (auth.state.currentUser?.id === updated.id) {
      auth.dispatch({ type: 'SET_CURRENT_USER', payload: updated });
    }
    triggerNotification('success', ui.t('app.notify.profile-updated'));
    api.updateProfile(updated.id, updated).catch((err) => console.error('Update profile API error:', err));
  };

  const handleViewProfile = (profile: Profile) => {
    data.dispatch({ type: 'SET_VIEWING_PROFILE', payload: profile });
    ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'profile' });
  };

  const handleUnlockTrigger = (profile: Profile) => {
    if (!auth.state.isLoggedIn) {
      ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'home' });
      return;
    }
    data.dispatch({ type: 'SET_UNLOCK_TARGET', payload: profile });
    data.dispatch({ type: 'SET_PAYMENT_MODAL', payload: true });
  };

  const activePendingPayments = useMemo(() => {
    return data.state.allPayments.filter(p => p.status === 'Pending');
  }, [data.state.allPayments]);

  const unlockedProfilesList = useMemo(() => {
    return data.state.profiles.filter(p => data.state.unlockedIds.includes(p.id));
  }, [data.state.profiles, data.state.unlockedIds]);

  const userLookingFor = useMemo<'Male' | 'Female'>(() => {
    if (auth.state.currentUser?.lookingFor) return auth.state.currentUser.lookingFor;
    return auth.state.userGender === 'Male' ? 'Female' : 'Male';
  }, [auth.state.currentUser, auth.state.userGender]);

  const userHasPaid = useMemo(() => {
    if (!auth.state.currentUser) return false;
    const name = auth.state.currentUser.name.toLowerCase();
    return data.state.allPayments.some(p => p.status === 'Approved' && p.senderName.toLowerCase() === name);
  }, [data.state.allPayments, auth.state.currentUser]);

  if (ui.state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFFCF8] dark:bg-[#120A0E]">
        <div className="w-10 h-10 border-2 border-[#EB317A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Admin Panel (no header/footer) ──
  if (ui.state.currentView === 'admin') {
    return (
      <div className="font-sans">
        <AdminPanel
          allPayments={data.state.allPayments}
          setAllPayments={(p: any) => data.dispatch({ type: 'SET_PAYMENTS', payload: typeof p === 'function' ? p(data.state.allPayments) : p })}
          profiles={data.state.profiles}
          setProfiles={(p: any) => data.dispatch({ type: 'SET_PROFILES', payload: typeof p === 'function' ? p(data.state.profiles) : p })}
          stories={data.state.stories}
          setStories={(s: any) => data.dispatch({ type: 'SET_STORIES', payload: typeof s === 'function' ? s(data.state.stories) : s })}
          onApprove={handleApprovePayment}
          onReject={handleRejectPayment}
          setUserRole={(r) => auth.dispatch({ type: 'SET_USER_ROLE', payload: r })}
          setCurrentView={(v) => ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: v })}
          isLoggedIn={auth.state.isLoggedIn}
          darkMode={ui.state.darkMode}
          setDarkMode={(d) => ui.dispatch({ type: 'SET_DARK_MODE', payload: d })}
        />
      </div>
    );
  }

  // ── Onboarding (no header/footer) — shown when not logged in ──
  if (!auth.state.isLoggedIn && ui.state.currentView === 'home') {
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
        currentView={ui.state.currentView}
        setCurrentView={(v) => ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: v })}
        userRole={auth.state.userRole}
        setUserRole={(r) => auth.dispatch({ type: 'SET_USER_ROLE', payload: r })}
        isLoggedIn={auth.state.isLoggedIn}
        setIsLoggedIn={async (v) => {
          auth.dispatch({ type: 'SET_LOGGED_IN', payload: v });
          if (!v) {
            await api.logout().catch(() => {});
            ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'home' });
          }
        }}
        userGender={auth.state.userGender}
        setUserGender={(g) => auth.dispatch({ type: 'SET_USER_GENDER', payload: g })}
        pendingCount={activePendingPayments.length}
        darkMode={ui.state.darkMode}
        setDarkMode={(d) => ui.dispatch({ type: 'SET_DARK_MODE', payload: d })}
        lang={ui.state.lang}
        setLang={(l) => ui.dispatch({ type: 'SET_LANG', payload: l })}
        onOpenAuth={(tab) => { ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'home' }); setAuthIntent(tab || 'register'); }}
        currentUser={auth.state.currentUser}
      />

      {/* 2. Toast notifications */}
      {ui.state.notification && (
        <div
          className={`fixed top-20 right-5 z-55 max-w-sm p-4 rounded-2xl shadow-xl flex items-start gap-3 border animate-slide-up ${
            ui.state.notification.type === 'success'
              ? 'bg-[#F8F4ED] border-[#C9A84C]/40 text-[#1A1118]'
              : 'bg-[#F8F4ED] border-[#EB317A]/20 text-[#1A1118]'
          }`}
          id="toast-notification"
        >
          {ui.state.notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="h-5 w-5 text-[#EB317A] shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-bold text-xs text-[#EB317A]">{ui.t('app.name')}</p>
            <p className="text-[11px] font-medium leading-relaxed mt-0.5 text-gray-700">{ui.state.notification.text}</p>
          </div>
        </div>
      )}

      {/* 3. Core views */}
      <main className="grow" id="primary-view-stage">
        <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[#EB317A] border-t-transparent rounded-full animate-spin" /></div>}>

          {/* Browse — main post-registration listing */}
          {(ui.state.currentView === 'home' || ui.state.currentView === 'browse') && auth.state.isLoggedIn && auth.state.currentUser && (
            <ProfileListing
              profiles={data.state.profiles}
              currentUser={auth.state.currentUser}
              hasPaid={userHasPaid}
              onMakePayment={handleUnlockTrigger}
            />
          )}

          {/* Profile page */}
          {ui.state.currentView === 'profile' && (data.state.viewingProfile || auth.state.currentUser) && (
            <ProfilePage
              profile={data.state.viewingProfile || auth.state.currentUser!}
              isUnlocked={data.state.viewingProfile ? data.state.unlockedIds.includes(data.state.viewingProfile.id) : true}
              pendingPayment={data.state.viewingProfile ? data.state.allPayments.find(p => p.profileId === data.state.viewingProfile!.id && p.status === 'Pending') : undefined}
              userGender={auth.state.userGender}
              isOwnProfile={!data.state.viewingProfile || auth.state.currentUser?.id === data.state.viewingProfile.id}
              onBack={() => {
                ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'browse' });
              }}
              onUnlockClick={handleUnlockTrigger}
              onSaveProfile={handleSaveProfile}
            />
          )}

          {/* Discover dashboard (optional advanced browse) */}
          {ui.state.currentView === 'dashboard' && (
            <Dashboard
              profiles={data.state.profiles}
              hasPaid={userHasPaid}
              userGender={auth.state.userGender}
              userLookingFor={userLookingFor}
              isLoggedIn={auth.state.isLoggedIn}
              onMakePayment={handleUnlockTrigger}
            />
          )}

          {/* History */}
          {ui.state.currentView === 'history' && (
            <UnlockHistory
              unlockedProfiles={unlockedProfilesList}
              onBackToFinder={() => ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'browse' })}
              onViewProfile={handleViewProfile}
            />
          )}

          {/* FAQ */}
          {ui.state.currentView === 'faq' && <FAQSection />}

          {/* Success Stories */}
          {ui.state.currentView === 'stories' && (
            <SuccessStories
              stories={data.state.stories}
              onAddStory={handleAddStory}
            />
          )}

          {/* Blog */}
          {ui.state.currentView === 'blog' && <BlogPage articles={data.state.articles} />}

          {/* Support */}
          {ui.state.currentView === 'support' && <SupportPanel />}

        </Suspense>
      </main>

      {/* 4. Payment modal */}
      {data.state.activeUnlockTarget && (
        <PaymentModal
          profile={data.state.activeUnlockTarget}
          isOpen={data.state.isPaymentModalOpen}
          onClose={() => {
            data.dispatch({ type: 'SET_PAYMENT_MODAL', payload: false });
            data.dispatch({ type: 'SET_UNLOCK_TARGET', payload: null });
          }}
          onSubmitPayment={handleSubmitPayment}
          onPaymentSuccess={handlePaymentSuccess}
          userGender={auth.state.userGender}
          currentUser={auth.state.currentUser}
        />
      )}

      {/* 5. Footer */}
      <Footer
        setCurrentView={(v) => ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: v })}
        isLoggedIn={auth.state.isLoggedIn}
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
          <button onClick={() => {
            setPaymentCountdown(0);
            if (paymentTimerRef.current) clearInterval(paymentTimerRef.current);
          }} className="mt-6 px-6 py-2.5 bg-[#FFFCF8]/10 hover:bg-[#FFFCF8]/20 text-[#FFFCF8] rounded-xl text-sm font-bold transition-all cursor-pointer border border-[#FFFCF8]/20">
            Back to browsing
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <DataProvider>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </DataProvider>
      </UIProvider>
    </AuthProvider>
  );
}
