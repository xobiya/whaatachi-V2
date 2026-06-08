import React, { useEffect, useMemo, Suspense, lazy } from 'react';
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
import { Profile, PaymentRequest, SuccessStory } from './types';
import { INITIAL_PROFILES, INITIAL_SUCCESS_STORIES, INITIAL_ARTICLES } from './mockData';
import { CheckCircle, ShieldAlert } from 'lucide-react';
import { AppProvider, useAppContext } from './context/AppContext';

function AppContent() {
  const { state, dispatch, t } = useAppContext();

  // Check location on load and handle direct routing pathways
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

  // Sync currentView back to pathname for clean back/forward routing
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

  // Clear user data on logout
  useEffect(() => {
    if (!state.isLoggedIn) {
      localStorage.removeItem('whaatachi_logged_in_user_v1');
      dispatch({ type: 'SET_CURRENT_USER', payload: null });
    }
  }, [state.isLoggedIn, dispatch]);

  // Toast notifications helper
  const triggerNotification = (type: 'success' | 'info', text: string) => {
    dispatch({ type: 'SET_NOTIFICATION', payload: { type, text } });
    setTimeout(() => dispatch({ type: 'SET_NOTIFICATION', payload: null }), 5000);
  };

  // 1. Submit Payment Receipt
  const handleSubmitPayment = (
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
      status: amount === 0 ? 'Approved' : 'Pending'
    };

    dispatch({ type: 'ADD_PAYMENT', payload: newRequest });

    if (amount === 0) {
      dispatch({ type: 'ADD_UNLOCK', payload: profileId });
      triggerNotification('success', t('app.notify.unlocked-free').replace('{name}', profileName));
    } else {
      triggerNotification('info', t('app.notify.submitted').replace('{txId}', transactionId));
    }
  };

  // 2. Approve Payment (Admin Function)
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
  };

  // 3. Reject Payment (Admin Function)
  const handleRejectPayment = (paymentId: string) => {
    dispatch({ type: 'UPDATE_PAYMENT', payload: { id: paymentId, status: 'Rejected' } });
    triggerNotification('info', t('app.notify.rejected'));
  };

  // 4. Register manual couple success story
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
  };

  // 5. Onboarding: Register new user from the wizard
  const handleRegisterUser = (newProfile: Profile) => {
    const profileWithLookingFor = { ...newProfile, lookingFor: newProfile.lookingFor || (newProfile.gender === 'Male' ? 'Female' : 'Male') };
    dispatch({ type: 'SET_PROFILES', payload: [profileWithLookingFor, ...state.profiles] });
    localStorage.setItem('whaatachi_logged_in_user_v1', JSON.stringify(profileWithLookingFor));
    dispatch({ type: 'SET_CURRENT_USER', payload: profileWithLookingFor });
    dispatch({ type: 'SET_LOGGED_IN', payload: true });
    dispatch({ type: 'SET_USER_GENDER', payload: profileWithLookingFor.gender });
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'browse' });
    triggerNotification('success', t('app.notify.welcome').replace('{name}', profileWithLookingFor.name));
  };

  // 6. Quick sign-in (find existing user by name + phone)
  const handleSignInUser = (name: string, phone: string) => {
    // Match by name (case-insensitive), optionally verify phone
    const found = state.profiles.find(
      (p) => p.name.toLowerCase() === name.toLowerCase() &&
             (p.contactInfo.phone === phone || p.contactInfo.phone.replace(/\s/g,'') === phone.replace(/\s/g,''))
    ) || state.profiles.find(
      // Fallback: match by name only (phone may have been entered differently)
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
    } else {
      triggerNotification('info', t('app.notify.no-account'));
    }
  };

  // 7. Profile customization handlers
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

  // ── Admin Panel (no header/footer) ──
  if (state.currentView === 'admin') {
    return (
      <div className="font-sans">
        <AdminPanel
          allPayments={state.allPayments}
          setAllPayments={(p) => dispatch({ type: 'SET_PAYMENTS', payload: p })}
          profiles={state.profiles}
          setProfiles={(p) => dispatch({ type: 'SET_PROFILES', payload: p })}
          stories={state.stories}
          setStories={(s) => dispatch({ type: 'SET_STORIES', payload: s })}
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
      <Suspense fallback={<div />}>
        <OnboardingFlow
          onComplete={handleRegisterUser}
          onSignIn={handleSignInUser}
        />
      </Suspense>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFCF8] dark:bg-[#120A0E] text-[#1A1118] dark:text-[#FFFCF8] transition-colors duration-250" id="main-app-container">

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
        onOpenAuth={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'home' })}
        currentUser={state.currentUser}
      />

      {/* 2. Toast notifications */}
      {state.notification && (
        <div
          className={`fixed top-20 right-5 z-55 max-w-sm p-4 rounded-2xl shadow-xl flex items-start gap-3 border animate-slide-up ${
            state.notification.type === 'success'
              ? 'bg-[#F8F4ED] border-[#C9A84C]/40 text-[#1A1118]'
              : 'bg-[#F8F4ED] border-[#8B0020]/20 text-[#1A1118]'
          }`}
          id="toast-notification"
        >
          {state.notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="h-5 w-5 text-[#8B0020] shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-bold text-xs text-[#8B0020]">{t('app.name')}</p>
            <p className="text-[11px] font-medium leading-relaxed mt-0.5 text-gray-700">{state.notification.text}</p>
          </div>
        </div>
      )}

      {/* 3. Core views */}
      <main className="grow" id="primary-view-stage">
        <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[#8B0020] border-t-transparent rounded-full animate-spin" /></div>}>

          {/* Browse — main post-registration listing */}
          {(state.currentView === 'home' || state.currentView === 'browse') && state.isLoggedIn && state.currentUser && (
            <ProfileListing
              profiles={state.profiles}
              currentUser={state.currentUser}
              unlockedIds={state.unlockedIds}
              pendingPayments={state.allPayments}
              onUnlockClick={handleUnlockTrigger}
              onViewProfile={handleViewProfile}
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
              unlockedIds={state.unlockedIds}
              pendingPayments={state.allPayments}
              onUnlockClick={handleUnlockTrigger}
              userGender={state.userGender}
              userLookingFor={userLookingFor}
              isLoggedIn={state.isLoggedIn}
              onViewProfile={handleViewProfile}
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
          {state.currentView === 'blog' && <BlogPage articles={INITIAL_ARTICLES} />}

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
          userGender={state.userGender}
        />
      )}

      {/* 5. Footer */}
      <Footer
        setCurrentView={(v) => dispatch({ type: 'SET_CURRENT_VIEW', payload: v })}
        isLoggedIn={state.isLoggedIn}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
