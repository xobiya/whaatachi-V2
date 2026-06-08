import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PaymentModal from './components/PaymentModal';
import HomeLanding from './views/HomeLanding';
import HomeLoggedIn from './views/HomeLoggedIn';
import AuthModal from './components/AuthModal';
import Dashboard from './views/Dashboard';
import UnlockHistory from './views/UnlockHistory';
import FAQSection from './views/FAQSection';
import SuccessStories from './views/SuccessStories';
import BlogPage from './views/BlogPage';
import AdminPanel from './views/AdminPanel';
import SupportPanel from './views/SupportPanel';
import ProfilePage from './views/ProfilePage';
import { Profile, PaymentRequest, SuccessStory } from './types';
import { INITIAL_PROFILES, INITIAL_SUCCESS_STORIES, INITIAL_ARTICLES } from './mockData';
import { Heart, Sparkles, UserCheck, CheckCircle, ShieldAlert } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/admin') {
      return 'admin';
    }
    return 'home';
  });
  const [userRole, setUserRole] = useState<'user' | 'admin'>(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/admin') {
      return 'admin';
    }
    const saved = localStorage.getItem('whaatachi_admin_auth_v1');
    return saved === 'true' ? 'admin' : 'user';
  });

  // Check location on load and handle direct routing pathways
  useEffect(() => {
    const checkPath = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setUserRole('admin');
        setCurrentView('admin');
      } else if (path === '/history') {
        setCurrentView('history');
      } else if (path === '/dashboard') {
        setCurrentView('dashboard');
      } else if (path === '/faq') {
        setCurrentView('faq');
      } else if (path === '/stories') {
        setCurrentView('stories');
      } else if (path === '/blog') {
        setCurrentView('blog');
      } else if (path === '/support') {
        setCurrentView('support');
      } else if (path === '/profile') {
        setCurrentView('profile');
      } else if (path === '/') {
        setCurrentView('home');
      }
    };
    
    checkPath();

    const handlePopState = () => {
      checkPath();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync currentView back to pathname for clean back/forward routing
  useEffect(() => {
    const currentPath = window.location.pathname;
    let targetPath = '/';
    if (currentView === 'home') targetPath = '/';
    else targetPath = `/${currentView}`;

    if (currentPath !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  }, [currentView]);
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('whaatachi_logged_in_user_v1') !== null;
  });
  const [currentUser, setCurrentUser] = useState<Profile | null>(() => {
    const savedUser = localStorage.getItem('whaatachi_logged_in_user_v1');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [userGender, setUserGender] = useState<'Male' | 'Female'>(() => {
    const savedUser = localStorage.getItem('whaatachi_logged_in_user_v1');
    if (savedUser) {
      try {
        return JSON.parse(savedUser).gender;
      } catch (e) {
        return 'Male';
      }
    }
    return 'Male';
  });

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.removeItem('whaatachi_logged_in_user_v1');
      setCurrentUser(null);
    }
  }, [isLoggedIn]);

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('whaatachi_dark_mode_v1');
    return saved ? JSON.parse(saved) : true; // default to dark mode like in elegant designs!
  });

  useEffect(() => {
    localStorage.setItem('whaatachi_dark_mode_v1', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persistence vectors
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('whaatachi_profiles_v1');
    if (saved) {
      try {
        const parsed: Profile[] = JSON.parse(saved);
        const parsedIds = new Set(parsed.map(p => p.id));
        const missing = INITIAL_PROFILES.filter(ip => !parsedIds.has(ip.id));
        if (missing.length > 0) {
          return [...parsed, ...missing];
        }
        return parsed;
      } catch (e) {
        return INITIAL_PROFILES;
      }
    }
    return INITIAL_PROFILES;
  });

  const [unlockedIds, setUnlockedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('whaatachi_unlocked_v1');
    return saved ? JSON.parse(saved) : [];
  });

  // Pre-seed some default pending payment verifications matching the admin panel mockup
  const [allPayments, setAllPayments] = useState<PaymentRequest[]>(() => {
    const saved = localStorage.getItem('whaatachi_payments_v1');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'pay-mock-1',
        profileId: 'p1', // Selamawit Tekle
        profileName: 'Selamawit Tekle',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
        senderName: 'Abel Mekonnen',
        senderPhone: '0911223344',
        transactionId: 'FT2401120015',
        method: 'CBE Birr',
        amount: 200,
        timestamp: 'June 8, 2026 09:30 AM',
        status: 'Pending'
      },
      {
        id: 'pay-mock-2',
        profileId: 'p3', // Kidist Hailu
        profileName: 'Kidist Hailu',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        senderName: 'Daniel Tadesse',
        senderPhone: '0922445566',
        transactionId: 'RE8520359811',
        method: 'Telebirr',
        amount: 200,
        timestamp: 'June 8, 2026 10:15 AM',
        status: 'Pending'
      }
    ];
  });

  const [stories, setStories] = useState<SuccessStory[]>(() => {
    const saved = localStorage.getItem('whaatachi_stories_v1');
    return saved ? JSON.parse(saved) : INITIAL_SUCCESS_STORIES;
  });

  const [viewingProfile, setViewingProfile] = useState<Profile | null>(null);
  const [activeUnlockTarget, setActiveUnlockTarget] = useState<Profile | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'register' | 'signin'>('register');
  const [showNotification, setShowNotification] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  // Sync state with client storage
  useEffect(() => {
    localStorage.setItem('whaatachi_profiles_v1', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('whaatachi_unlocked_v1', JSON.stringify(unlockedIds));
  }, [unlockedIds]);

  useEffect(() => {
    localStorage.setItem('whaatachi_payments_v1', JSON.stringify(allPayments));
  }, [allPayments]);

  useEffect(() => {
    localStorage.setItem('whaatachi_stories_v1', JSON.stringify(stories));
  }, [stories]);

  // Toast notifications helper
  const triggerNotification = (type: 'success' | 'info', text: string) => {
    setShowNotification({ type, text });
    setTimeout(() => setShowNotification(null), 5000);
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

    setAllPayments((prev) => [newRequest, ...prev]);

    if (amount === 0) {
      // Free Reveal for females - instantly unlock
      setUnlockedIds((prev) => [...prev, profileId]);
      triggerNotification('success', `Success! Profile for ${profileName} has been immediately unlocked for FREE!`);
    } else {
      triggerNotification('info', `Transfer submitted! Reference No. ${transactionId} has been queued for verification.`);
    }
  };

  // 2. Approve Payment (Admin Function)
  const handleApprovePayment = (paymentId: string) => {
    const payment = allPayments.find(p => p.id === paymentId);
    if (!payment) return;

    // Set payment status
    setAllPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: 'Approved' } : p))
    );

    // Add profile ID to target unlocked list
    setUnlockedIds((prev) => {
      if (!prev.includes(payment.profileId)) {
        return [...prev, payment.profileId];
      }
      return prev;
    });

    // Award verified badge to user who completed their payment verification
    setProfiles((prev) =>
      prev.map((profile) => {
        // If this payment was matching their initial registered profile, verify them
        if (profile.name.toLowerCase() === payment.senderName.toLowerCase()) {
          return { ...profile, verified: true };
        }
        return profile;
      })
    );

    triggerNotification('success', `Receipt Approved! Unlocked direct contact for ${payment.profileName}.`);
  };

  // 3. Reject Payment (Admin Function)
  const handleRejectPayment = (paymentId: string) => {
    setAllPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: 'Rejected' } : p))
    );
    triggerNotification('info', 'Receipt rejected/flagged as invalid by moderator.');
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
    setStories((prev) => [newStory, ...prev]);
    triggerNotification('success', 'Your story has been saved and is now live!');
  };

  // 5. Onboarding: Register custom user profiles
  const handleRegisterUser = (newProfile: Profile) => {
    const profileWithLookingFor = { ...newProfile, lookingFor: newProfile.lookingFor || (newProfile.gender === 'Male' ? 'Female' : 'Male') };
    setProfiles((prev) => [profileWithLookingFor, ...prev]);
    localStorage.setItem('whaatachi_logged_in_user_v1', JSON.stringify(profileWithLookingFor));
    setCurrentUser(profileWithLookingFor);
    setIsLoggedIn(true);
    setUserGender(profileWithLookingFor.gender);
    setCurrentView('dashboard');
    triggerNotification('success', `Welcome ${profileWithLookingFor.name}! Your premium profile is registered.`);
  };

  // 6. Onboarding: Sign in user matching name/phone
  const handleSignInUser = (name: string, phone: string) => {
    const found = profiles.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (found) {
      const profileWithLookingFor = { ...found, lookingFor: found.lookingFor || (found.gender === 'Male' ? 'Female' : 'Male') };
      localStorage.setItem('whaatachi_logged_in_user_v1', JSON.stringify(profileWithLookingFor));
      setCurrentUser(profileWithLookingFor);
      setIsLoggedIn(true);
      setUserGender(profileWithLookingFor.gender);
      setCurrentView('dashboard');
      triggerNotification('success', `Welcome back, ${found.name}!`);
    } else {
      // Lazy fallback profile registration so user is never locked out of testing
      const fallbackProfile: Profile = {
        id: `custom-profile-${Date.now()}`,
        name: name,
        age: 24,
        city: 'Addis Ababa',
        bio: 'Looking for negative connections or friendships.',
        gender: 'Male',
        lookingFor: 'Female',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
        status: 'Online',
        relationshipIntent: 'True Relationship',
        interests: ['Ethio Coffee', 'Dating Out'],
        verified: true,
        contactInfo: {
          phone: phone || '0911223344',
          telegram: name.toLowerCase().replace(/\s+/g, ''),
          instagram: '',
          email: `${name.toLowerCase().replace(/\s+/g, '')}@example.com`
        }
      };
      setProfiles((prev) => [fallbackProfile, ...prev]);
      localStorage.setItem('whaatachi_logged_in_user_v1', JSON.stringify(fallbackProfile));
      setCurrentUser(fallbackProfile);
      setIsLoggedIn(true);
      setUserGender(fallbackProfile.gender);
      setCurrentView('dashboard');
      triggerNotification('success', `Welcome ${name}! We have prepared a fast track profile for you.`);
    }
  };

  // 7. Onboarding: Simulated test accounts switcher
  const handleSimulateTestLogin = (profile: Profile) => {
    const profileWithLookingFor = { ...profile, lookingFor: profile.lookingFor || (profile.gender === 'Male' ? 'Female' : 'Male') };
    localStorage.setItem('whaatachi_logged_in_user_v1', JSON.stringify(profileWithLookingFor));
    setCurrentUser(profileWithLookingFor);
    setIsLoggedIn(true);
    setUserGender(profileWithLookingFor.gender);
    setCurrentView('dashboard');
    triggerNotification('success', `Logged in as test candidate ${profileWithLookingFor.name}!`);
  };

  // 8. Profile customization handlers
  const handleUpdateBio = (newBio: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, bio: newBio };
    setCurrentUser(updatedUser);
    localStorage.setItem('whaatachi_logged_in_user_v1', JSON.stringify(updatedUser));
    
    setProfiles((prev) => 
      prev.map(p => p.id === currentUser.id ? updatedUser : p)
    );
    triggerNotification('success', 'Your profile bio has been updated successfully!');
  };

  const handleUpdateStatus = (newStatus: 'Online' | 'Offline' | 'Recently Active') => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, status: newStatus };
    setCurrentUser(updatedUser);
    localStorage.setItem('whaatachi_logged_in_user_v1', JSON.stringify(updatedUser));

    setProfiles((prev) => 
      prev.map(p => p.id === currentUser.id ? updatedUser : p)
    );
    triggerNotification('success', `Your live status is now set to ${newStatus === 'Online' ? 'Active' : newStatus === 'Offline' ? 'Quiet' : 'Recent'}`);
  };

  const handleSaveProfile = (updated: Profile) => {
    setProfiles((prev) => prev.map(p => p.id === updated.id ? updated : p));
    if (currentUser?.id === updated.id) {
      setCurrentUser(updated);
      localStorage.setItem('whaatachi_logged_in_user_v1', JSON.stringify(updated));
      setUserGender(updated.gender);
    }
    triggerNotification('success', 'Profile updated successfully!');
  };

  const handleViewProfile = (profile: Profile) => {
    setViewingProfile(profile);
    setCurrentView('profile');
  };

  const handleOpenAuth = (tab: 'register' | 'signin' = 'register') => {
    setAuthModalInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleUnlockTrigger = (profile: Profile) => {
    if (!isLoggedIn) {
      handleOpenAuth('register');
      return;
    }
    setActiveUnlockTarget(profile);
    setIsPaymentModalOpen(true);
  };

  const activePendingPayments = useMemo(() => {
    return allPayments.filter(p => p.status === 'Pending');
  }, [allPayments]);

  const unlockedProfilesList = useMemo(() => {
    return profiles.filter(p => unlockedIds.includes(p.id));
  }, [profiles, unlockedIds]);

  const userLookingFor = useMemo<'Male' | 'Female'>(() => {
    if (currentUser?.lookingFor) return currentUser.lookingFor;
    return userGender === 'Male' ? 'Female' : 'Male';
  }, [currentUser, userGender]);

  if (currentView === 'admin') {
    return (
      <div className="font-sans">
        <AdminPanel
          allPayments={allPayments}
          setAllPayments={setAllPayments}
          profiles={profiles}
          setProfiles={setProfiles}
          stories={stories}
          setStories={setStories}
          onApprove={handleApprovePayment}
          onReject={handleRejectPayment}
          setUserRole={setUserRole}
          setCurrentView={setCurrentView}
          isLoggedIn={isLoggedIn}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFCF8] dark:bg-[#120A0E] text-[#1A1118] dark:text-[#FFFCF8] transition-colors duration-250" id="main-app-container">
      
      {/* 1. Header with role switches */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        userRole={userRole}
        setUserRole={setUserRole}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        userGender={userGender}
        setUserGender={setUserGender}
        pendingCount={activePendingPayments.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAuth={handleOpenAuth}
        currentUser={currentUser}
      />

      {/* 2. Success/Info popups */}
      {showNotification && (
        <div 
          className={`fixed top-20 right-5 z-55 max-w-sm p-4 rounded-2xl shadow-xl flex items-start gap-3 border animate-slide-up ${
            showNotification.type === 'success'
              ? 'bg-[#F8F4ED] border-[#C9A84C]/40 text-[#1A1118]'
              : 'bg-[#F8F4ED] border-[#8B0020]/20 text-[#1A1118]'
          }`}
          id="toast-notification"
        >
          {showNotification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="h-5 w-5 text-[#8B0020] shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-bold text-xs text-[#8B0020]">Whaatachi</p>
            <p className="text-[11px] font-medium leading-relaxed mt-0.5 text-gray-700">{showNotification.text}</p>
          </div>
        </div>
      )}

      {/* 3. Core Tab panels */}
      <main className="grow" id="primary-view-stage">
        
        {/* Landing Home */}
        {currentView === 'home' && (
          isLoggedIn ? (
            <HomeLoggedIn
              currentUser={currentUser}
              onUpdateBio={handleUpdateBio}
              onUpdateStatus={handleUpdateStatus}
              unlockedCount={unlockedIds.length}
              onGoToMatches={() => setCurrentView('dashboard')}
              onGoToHistory={() => setCurrentView('history')}
              onUnlockClick={handleUnlockTrigger}
              profiles={profiles}
              unlockedIds={unlockedIds}
            />
          ) : (
            <HomeLanding
              onJoinNowClick={(tab) => {
                handleOpenAuth(tab || 'register');
              }}
              featuredProfiles={profiles}
              userGender={userGender}
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
              onGoToDashboard={() => setCurrentView('dashboard')}
              onLogout={() => setIsLoggedIn(false)}
            />
          )
        )}

        {/* Profile page */}
        {currentView === 'profile' && viewingProfile && (
          <ProfilePage
            profile={viewingProfile}
            isUnlocked={unlockedIds.includes(viewingProfile.id)}
            pendingPayment={allPayments.find(p => p.profileId === viewingProfile.id && p.status === 'Pending')}
            userGender={userGender}
            isOwnProfile={currentUser?.id === viewingProfile.id}
            onBack={() => setCurrentView('dashboard')}
            onUnlockClick={handleUnlockTrigger}
            onSaveProfile={handleSaveProfile}
          />
        )}

        {/* Discover matches dashboard */}
        {currentView === 'dashboard' && (
          <Dashboard
            profiles={profiles}
            unlockedIds={unlockedIds}
            pendingPayments={allPayments}
            onUnlockClick={handleUnlockTrigger}
            userGender={userGender}
            userLookingFor={userLookingFor}
            isLoggedIn={isLoggedIn}
            onViewProfile={handleViewProfile}
          />
        )}

        {/* History unlocked vault */}
        {currentView === 'history' && (
          <UnlockHistory
            unlockedProfiles={unlockedProfilesList}
            onBackToFinder={() => setCurrentView('dashboard')}
          />
        )}

        {/* FAQ guides */}
        {currentView === 'faq' && <FAQSection />}

        {/* Success Stories submission list */}
        {currentView === 'stories' && (
          <SuccessStories
            stories={stories}
            onAddStory={handleAddStory}
          />
        )}

        {/* Educational safety blog */}
        {currentView === 'blog' && <BlogPage articles={INITIAL_ARTICLES} />}

        {/* Interactive Chat Resolution support */}
        {currentView === 'support' && <SupportPanel />}

      </main>

      {/* 4. Contact Lock Payment Drawer Modal */}
      {activeUnlockTarget && (
        <PaymentModal
          profile={activeUnlockTarget}
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setActiveUnlockTarget(null);
          }}
          onSubmitPayment={handleSubmitPayment}
          userGender={userGender}
        />
      )}

      {/* 5. Authentication overlay Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalInitialTab}
        featuredProfiles={profiles}
        onRegisterUser={handleRegisterUser}
        onSignInUser={handleSignInUser}
        onSimulateTestLogin={handleSimulateTestLogin}
      />

      {/* 6. Footer */}
      <Footer 
        setCurrentView={setCurrentView}
        isLoggedIn={isLoggedIn}
      />

    </div>
  );
}
