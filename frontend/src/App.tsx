import React, { useEffect, useMemo, Suspense, useState, useRef, startTransition } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PaymentModal from './components/PaymentModal';
import OnboardingFlow from './views/OnboardingFlow';
import ProfileListing from './views/ProfileListing';
import { lazyWithRetry } from './utils/lazyWithRetry';
const Dashboard = lazyWithRetry(() => import('./views/Dashboard'));
const UnlockHistory = lazyWithRetry(() => import('./views/UnlockHistory'));
const AdminPanel = lazyWithRetry(() => import('./views/AdminPanel'));
const SupportPanel = lazyWithRetry(() => import('./views/SupportPanel'));
const ProfilePage = lazyWithRetry(() => import('./views/ProfilePage'));
import { Heart } from 'lucide-react';
import { Profile, PaymentRequest } from './types';
import * as api from './services/api';
import { CheckCircle, ShieldAlert, Clock, X, Phone, Instagram, Sparkles } from 'lucide-react';
import SafeImage from './components/SafeImage';
import TelegramIcon from './components/TelegramIcon';
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
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [paymentCountdown, setPaymentCountdown] = useState(0);
  const paymentTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialRender = useRef(true);
  const [showApprovalCelebration, setShowApprovalCelebration] = useState(false);
  const [celebratedProfile, setCelebratedProfile] = useState<{ profileId: string; profileName: string; profileImage: string } | null>(null);
  const pendingApprovalRef = useRef<{ profileId: string; profileName: string; profileImage: string } | null>(null);
  const lastFetchRef = useRef(0);
  const profilesRef = useRef(data.state.profiles);
  profilesRef.current = data.state.profiles;

  useEffect(() => {
    let retries = 0;
    const maxRetries = 5;
    function checkSession() {
      api.getMe().then(res => {
        if (res?.user) {
          const p = res.user;
          auth.dispatch({ type: 'SET_CURRENT_USER', payload: p });
          auth.dispatch({ type: 'SET_LOGGED_IN', payload: true });
          auth.dispatch({ type: 'SET_USER_GENDER', payload: p.gender });
          api.fetchPayments().then(payRes => {
            if (payRes?.payments) {
              const approvedIds = payRes.payments
                .filter(pay => pay.status === 'Approved')
                .map(pay => pay.profileId);
              data.dispatch({ type: 'SET_UNLOCKED_IDS', payload: approvedIds });
              data.dispatch({ type: 'SET_PAYMENTS', payload: payRes.payments });
            }
          }).catch(() => {}).finally(() => {
            setIsCheckingSession(false);
          });
        } else if (retries < maxRetries) {
          retries++;
          setTimeout(checkSession, retries * 1000);
        } else {
          setIsCheckingSession(false);
        }
      }).catch(() => {
        if (retries < maxRetries) {
          retries++;
          setTimeout(checkSession, retries * 1000);
        } else {
          setIsCheckingSession(false);
        }
      });
    }
    checkSession();
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
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    const currentPath = window.location.pathname;
    let targetPath = '/';
    if (ui.state.currentView === 'home') targetPath = '/';
    else if (ui.state.currentView === 'browse') targetPath = '/browse';
    else targetPath = `/${ui.state.currentView}`;

    if (currentPath !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  }, [ui.state.currentView]);

  const prevLoggedInRef = useRef(auth.state.isLoggedIn);
  useEffect(() => {
    const view = ui.state.currentView;
    const justLoggedIn = auth.state.isLoggedIn && !prevLoggedInRef.current;
    prevLoggedInRef.current = auth.state.isLoggedIn;

    if (view === 'home' || view === 'browse' || view === 'dashboard' || view === 'profile' || view === 'admin') {
      if (!auth.state.isLoggedIn && view === 'home') {
        // Don't fetch profiles on home before login — the onboarding screen is shown
      } else {
        // Reset debounce after login so the first authenticated fetch always goes through
        if (justLoggedIn) lastFetchRef.current = 0;
        if (Date.now() - lastFetchRef.current < 30000) return;
        lastFetchRef.current = Date.now();
        api.fetchProfiles({ limit: 1000 }).then(res => {
          if (res && Array.isArray(res.profiles)) {
            // MERGE instead of SET — preserves the existing list while updating/adding profiles
            startTransition(() => {
              data.dispatch({ type: 'MERGE_PROFILES', payload: res.profiles });
            });
          }
        }).catch((err) => console.error('Failed to fetch profiles:', err));
      }
    }
    if (view === 'admin') {
      api.fetchPayments().then(res => {
        if (res && Array.isArray(res.payments)) {
          data.dispatch({ type: 'MERGE_PAYMENTS', payload: res.payments });
        }
      }).catch((err) => console.error('Failed to fetch payments:', err));
    }
  }, [ui.state.currentView, auth.state.isLoggedIn]);

  useEffect(() => {
    if (!auth.state.isLoggedIn) {
      auth.dispatch({ type: 'SET_CURRENT_USER', payload: null });
    }
  }, [auth.state.isLoggedIn, auth.dispatch]);

  // Background payment polling — detects newly approved payments in real-time
  useEffect(() => {
    if (!auth.state.isLoggedIn) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.fetchPayments();
        if (!res?.payments) return;

        // Merge payments list in local state for real-time visibility
        data.dispatch({ type: 'MERGE_PAYMENTS', payload: res.payments });

        // For admin, the merge takes care of updating the list of requests
        if (auth.state.userRole === 'admin') return;

        // Check if any of the user's payments changed state to Approved/Rejected
        for (const payment of res.payments) {
          if (payment.status === 'Approved') {
            data.dispatch({ type: 'ADD_UNLOCK', payload: payment.profileId });

            const profile = profilesRef.current.find(p => p.id === payment.profileId);
            if (profile) {
              data.dispatch({ type: 'UPDATE_PROFILE', payload: { ...profile, verified: true } });
            }

            // Trigger celebration if it matches our pending approval target
            if (pendingApprovalRef.current?.profileId === payment.profileId) {
              if (paymentTimerRef.current) clearInterval(paymentTimerRef.current);
              setPaymentCountdown(0);
              pendingApprovalRef.current = null;
              setCelebratedProfile({
                profileId: payment.profileId,
                profileName: payment.profileName,
                profileImage: payment.profileImage,
              });
              setShowApprovalCelebration(true);
            }
          } else if (payment.status === 'Rejected') {
            if (pendingApprovalRef.current?.profileId === payment.profileId) {
              if (paymentTimerRef.current) clearInterval(paymentTimerRef.current);
              setPaymentCountdown(0);
              pendingApprovalRef.current = null;
              triggerNotification('info', ui.t('app.notify.rejected'));
            }
          }
        }
      } catch (err) {
        console.error('Background payment poll error:', err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [auth.state.isLoggedIn, auth.state.userRole, data.state.unlockedIds]);

  // Background profiles polling — matches showing up in real-time on both sides
  useEffect(() => {
    if (!auth.state.isLoggedIn) return;

    const interval = setInterval(() => {
      api.fetchProfiles({ limit: 1000 }).then(res => {
        if (res && Array.isArray(res.profiles)) {
          startTransition(() => {
            data.dispatch({ type: 'MERGE_PROFILES', payload: res.profiles });
          });
        }
      }).catch((err) => console.error('Background profiles poll error:', err));
    }, 60000);

    return () => clearInterval(interval);
  }, [auth.state.isLoggedIn]);

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
    try {
      const res = await api.submitPayment({
        profileId, profileName, profileImage,
        senderName, senderPhone, transactionId,
        method, amount, receiptImage,
      });

      if (res?.payment) {
        data.dispatch({ type: 'ADD_PAYMENT', payload: res.payment });
      }
      triggerNotification('info', ui.t('app.notify.submitted').replace('{txId}', transactionId));
    } catch (err: any) {
      triggerNotification('info', err?.message || 'Payment submission failed.');
    }
  };

  const handleApprovePayment = async (paymentId: string) => {
    try {
      await api.approvePayment(paymentId);
      const payment = data.state.allPayments.find(p => p.id === paymentId);
      if (!payment) return;

      data.dispatch({ type: 'UPDATE_PAYMENT', payload: { id: paymentId, status: 'Approved' } });
      data.dispatch({ type: 'ADD_UNLOCK', payload: payment.profileId });

      const profile = data.state.profiles.find(p => p.id === payment.profileId);
      if (profile) {
        data.dispatch({ type: 'UPDATE_PROFILE', payload: { ...profile, verified: true } });
      }
      triggerNotification('success', ui.t('app.notify.approved').replace('{name}', payment.profileName));
    } catch {
      triggerNotification('info', 'Failed to approve payment on server.');
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    try {
      await api.rejectPayment(paymentId);
      data.dispatch({ type: 'UPDATE_PAYMENT', payload: { id: paymentId, status: 'Rejected' } });
      triggerNotification('info', ui.t('app.notify.rejected'));
    } catch {
      triggerNotification('info', 'Failed to reject payment on server.');
    }
  };

  const handleRevokePayment = async (paymentId: string) => {
    try {
      await api.rejectPayment(paymentId);
      const payment = data.state.allPayments.find(p => p.id === paymentId);
      if (!payment) return;

      data.dispatch({ type: 'REMOVE_UNLOCK', payload: payment.profileId });
      data.dispatch({ type: 'UPDATE_PAYMENT', payload: { id: paymentId, status: 'Rejected' } });
      triggerNotification('info', 'Contact access revoked');
    } catch {
      triggerNotification('info', 'Failed to revoke payment on server.');
    }
  };

  const handleRegisterUser = async (newProfile: Profile) => {
    setIsRegistering(true);
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

      const serverUser = result.user;
      const serverProfile = { ...serverUser, lookingFor: serverUser.lookingFor || (serverUser.gender === 'Male' ? 'Female' : 'Male') };
      auth.dispatch({ type: 'SET_CURRENT_USER', payload: serverProfile });
      auth.dispatch({ type: 'SET_LOGGED_IN', payload: true });
      auth.dispatch({ type: 'SET_USER_GENDER', payload: serverProfile.gender });
      if (result?.token) api.setToken(result.token);
      triggerNotification('success', ui.t('app.notify.welcome').replace('{name}', serverProfile.name));

      // Fetch all profiles immediately so the browse view has data
        try {
          const profilesRes = await api.fetchProfiles({ limit: 1000 });
          if (profilesRes && Array.isArray(profilesRes.profiles)) {
            data.dispatch({ type: 'SET_PROFILES', payload: profilesRes.profiles });
          }
          lastFetchRef.current = Date.now();
        } catch {
          data.dispatch({ type: 'SET_PROFILES', payload: [serverProfile] });
        }

        ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'browse' });
    } catch (err: any) {
      console.error('Registration API error:', err);
      triggerNotification('info', err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handlePaymentSuccess = () => {
    const target = data.state.activeUnlockTarget;
    if (target) {
      pendingApprovalRef.current = {
        profileId: target.id,
        profileName: target.name,
        profileImage: target.image,
      };
    }
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
    try {
      const res = await api.login(undefined, phone || undefined, telegram || undefined, instagram || undefined);
      if (res?.token) api.setToken(res.token);
      if (res?.user) {
        const profileWithLookingFor = { ...res.user, lookingFor: res.user.lookingFor || (res.user.gender === 'Male' ? 'Female' : 'Male') };
        auth.dispatch({ type: 'SET_CURRENT_USER', payload: profileWithLookingFor });
        auth.dispatch({ type: 'SET_LOGGED_IN', payload: true });
        auth.dispatch({ type: 'SET_USER_GENDER', payload: profileWithLookingFor.gender });
        triggerNotification('success', ui.t('app.notify.welcome-back').replace('{name}', res.user.name));

        // Fetch all profiles immediately so the browse view has data
        try {
          const profilesRes = await api.fetchProfiles({ limit: 1000 });
          if (profilesRes && Array.isArray(profilesRes.profiles)) {
            data.dispatch({ type: 'SET_PROFILES', payload: profilesRes.profiles });
          }
          lastFetchRef.current = Date.now();
        } catch {}

        ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'browse' });
        return true;
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
    }
    return false;
  };

  const handleSimulateTestLogin = async (profile: Profile) => {
    const updatedProfile = { ...profile, lookingFor: profile.lookingFor || (profile.gender === 'Male' ? 'Female' : 'Male') };
    auth.dispatch({ type: 'SET_CURRENT_USER', payload: updatedProfile });
    auth.dispatch({ type: 'SET_LOGGED_IN', payload: true });
    auth.dispatch({ type: 'SET_USER_GENDER', payload: updatedProfile.gender });
    triggerNotification('success', ui.t('app.notify.welcome-back').replace('{name}', profile.name));
    try {
      const testRes = await api.login(profile.name, undefined, profile.contactInfo.telegram, profile.contactInfo.instagram);
      if (testRes?.token) api.setToken(testRes.token);
    } catch (err) {
      console.error('Test login API error:', err);
    }
    try {
      const profilesRes = await api.fetchProfiles({ limit: 1000 });
      if (profilesRes && Array.isArray(profilesRes.profiles)) {
        data.dispatch({ type: 'SET_PROFILES', payload: profilesRes.profiles });
      }
      lastFetchRef.current = Date.now();
    } catch {}
    ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'browse' });
  };

  const handleUpdateBio = async (newBio: string) => {
    if (!auth.state.currentUser) return;
    try {
      const res = await api.updateProfile(auth.state.currentUser.id, { bio: newBio });
      if (res?.user) {
        data.dispatch({ type: 'UPDATE_PROFILE', payload: res.user });
        auth.dispatch({ type: 'SET_CURRENT_USER', payload: res.user });
      }
      triggerNotification('success', ui.t('app.notify.bio-updated'));
    } catch {
      triggerNotification('info', 'Failed to update bio on server.');
    }
  };

  const handleUpdateStatus = async (newStatus: 'Online' | 'Offline' | 'Recently Active') => {
    if (!auth.state.currentUser) return;
    try {
      const res = await api.updateProfile(auth.state.currentUser.id, { status: newStatus });
      if (res?.user) {
        data.dispatch({ type: 'UPDATE_PROFILE', payload: res.user });
        auth.dispatch({ type: 'SET_CURRENT_USER', payload: res.user });
      }
      triggerNotification('success', ui.t('app.notify.status-set').replace('{status}', newStatus));
    } catch {
      triggerNotification('info', 'Failed to update status on server.');
    }
  };

  const handleSaveProfile = async (updated: Profile) => {
    try {
      const res = await api.updateProfile(updated.id, updated);
      if (res?.user) {
        data.dispatch({ type: 'UPDATE_PROFILE', payload: res.user });
        if (auth.state.currentUser?.id === updated.id) {
          auth.dispatch({ type: 'SET_CURRENT_USER', payload: res.user });
        }
      }
      triggerNotification('success', ui.t('app.notify.profile-updated'));
    } catch {
      triggerNotification('info', 'Failed to update profile on server.');
    }
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
    const idSet = new Set(data.state.unlockedIds);
    return data.state.profiles.filter(p => idSet.has(p.id));
  }, [data.state.profiles, data.state.unlockedIds]);

  const userLookingFor = useMemo<'Male' | 'Female'>(() => {
    if (auth.state.currentUser?.lookingFor) return auth.state.currentUser.lookingFor;
    return auth.state.userGender === 'Male' ? 'Female' : 'Male';
  }, [auth.state.currentUser, auth.state.userGender]);

  const userHasPaid = useMemo(() => {
    if (!auth.state.currentUser) return false;
    return auth.state.currentUser.verified || data.state.allPayments.some(p => p.status === 'Approved' && p.userId === auth.state.currentUser.id);
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
          onApprove={handleApprovePayment}
          onReject={handleRejectPayment}
          onRevoke={handleRevokePayment}
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
            api.clearToken();
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
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh] py-20">
            <div className="relative mx-auto w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-[#C9A84C]/10" />
              <div className="absolute inset-0 rounded-full border-4 border-t-[#EB317A] border-r-[#C9A84C] border-b-transparent border-l-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#EB317A]/20 to-[#C9A84C]/20 animate-pulse" />
            </div>
          </div>
        }>

          {isCheckingSession ? (
            <div className="flex items-center justify-center min-h-[60vh] py-20">
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-[#C9A84C]/10" />
                <div className="absolute inset-0 rounded-full border-4 border-t-[#EB317A] border-r-[#C9A84C] border-b-transparent border-l-transparent animate-spin" />
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#EB317A]/20 to-[#C9A84C]/20 animate-pulse" />
              </div>
            </div>
          ) : (
            <>
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
              isUnlocked={data.state.viewingProfile ? (userHasPaid || data.state.unlockedIds.includes(data.state.viewingProfile.id)) : true}
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
              currentUserId={auth.state.currentUser?.id}
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

          {/* Support */}
          {ui.state.currentView === 'support' && <SupportPanel />}
            </>
          )}

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
            pendingApprovalRef.current = null;
            if (paymentTimerRef.current) clearInterval(paymentTimerRef.current);
          }} className="mt-6 px-6 py-2.5 bg-[#FFFCF8]/10 hover:bg-[#FFFCF8]/20 text-[#FFFCF8] rounded-xl text-sm font-bold transition-all cursor-pointer border border-[#FFFCF8]/20">
            Back to browsing
          </button>
        </div>
      )}

      {showApprovalCelebration && celebratedProfile && (() => {
        const profile = data.state.profiles.find(p => p.id === celebratedProfile.profileId);
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A1118]/95 backdrop-blur-sm transition-opacity duration-500 p-4">
            <div className="bg-[#1A1118] border border-[#C9A84C]/20 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-scale-in">
              <div className="relative bg-gradient-to-br from-[#EB317A]/20 via-[#1A1118] to-[#C9A84C]/10 p-6 text-center border-b border-[#C9A84C]/10">
                <button onClick={() => { setShowApprovalCelebration(false); setCelebratedProfile(null); }} className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#FFFCF8]/5 hover:bg-[#FFFCF8]/10 text-[#FFFCF8]/50 hover:text-[#FFFCF8] transition-all cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-8 w-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-black text-[#FFFCF8] tracking-tight">Congratulations!</h2>
                <p className="text-sm text-[#EDE6D9]/60 mt-1">
                  Your payment for <span className="font-bold text-[#C9A84C]">{celebratedProfile.profileName}</span> has been approved
                </p>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest text-center">Contact Details</p>
                {profile ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-[#FFFCF8]/5 border border-[#FFFCF8]/10 rounded-xl">
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[#FFFCF8]/5">
                        <SafeImage src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#FFFCF8]">{profile.name}, {profile.age}</p>
                        <p className="text-[10px] text-[#EDE6D9]/50">{profile.city}</p>
                      </div>
                    </div>
                    <a href={`tel:${profile.contactInfo.phone}`} className="flex items-center gap-3 p-3 bg-[#FFFCF8]/5 hover:bg-[#FFFCF8]/10 border border-[#FFFCF8]/10 rounded-xl transition-all cursor-pointer group">
                      <div className="p-2 rounded-lg bg-[#EB317A]/20 text-[#EB317A] group-hover:bg-[#EB317A]/30 transition-colors">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#EDE6D9]/40 font-bold uppercase tracking-widest">Phone</p>
                        <p className="text-sm font-bold text-[#FFFCF8]">{profile.contactInfo.phone}</p>
                      </div>
                    </a>
                    <a href={`https://t.me/${profile.contactInfo.telegram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-[#FFFCF8]/5 hover:bg-[#FFFCF8]/10 border border-[#FFFCF8]/10 rounded-xl transition-all cursor-pointer group">
                      <div className="p-2 rounded-lg bg-[#EB317A]/20 text-[#EB317A] group-hover:bg-[#EB317A]/30 transition-colors">
                        <TelegramIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#EDE6D9]/40 font-bold uppercase tracking-widest">Telegram</p>
                        <p className="text-sm font-bold text-[#EB317A]">{profile.contactInfo.telegram}</p>
                      </div>
                    </a>
                    {profile.contactInfo.instagram && (
                      <a href={`https://instagram.com/${profile.contactInfo.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-[#FFFCF8]/5 hover:bg-[#FFFCF8]/10 border border-[#FFFCF8]/10 rounded-xl transition-all cursor-pointer group">
                        <div className="p-2 rounded-lg bg-[#EB317A]/20 text-[#EB317A] group-hover:bg-[#EB317A]/30 transition-colors">
                          <Instagram className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[10px] text-[#EDE6D9]/40 font-bold uppercase tracking-widest">Instagram</p>
                          <p className="text-sm font-bold text-[#EB317A]">{profile.contactInfo.instagram}</p>
                        </div>
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-[#EDE6D9]/60 text-center">Contact details available in your unlock history.</p>
                )}
                <button onClick={() => { setShowApprovalCelebration(false); setCelebratedProfile(null); ui.dispatch({ type: 'SET_CURRENT_VIEW', payload: 'browse' }); }} className="w-full py-3 bg-[#EB317A] hover:bg-[#F04B8E] text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-[#EB317A]/20">
                  Start Connecting
                </button>
              </div>
            </div>
          </div>
        );
      })()}
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
