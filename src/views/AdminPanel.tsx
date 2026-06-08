import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, UserCheck, Trash2, XCircle, DollarSign, TrendingUp, Users, 
  Clock, AlertTriangle, Sparkles, Image, CheckCircle2,
  Lock, Eye, EyeOff, Key, Settings, ShieldAlert,
  Search, Plus, Edit, MessageSquare, Sliders, LogOut,
  MapPin, Check, CheckCircle, FileText, LayoutDashboard,
  Menu, X, ChevronRight, RefreshCw, Smartphone, Heart
} from 'lucide-react';
import { Profile, PaymentRequest, SuccessStory } from '../types';

interface AdminPanelProps {
  allPayments: PaymentRequest[];
  setAllPayments: React.Dispatch<React.SetStateAction<PaymentRequest[]>>;
  profiles: Profile[];
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
  stories: SuccessStory[];
  setStories: React.Dispatch<React.SetStateAction<SuccessStory[]>>;
  onApprove: (paymentId: string) => void;
  onReject: (paymentId: string) => void;
  setUserRole: (role: 'user' | 'admin') => void;
  setCurrentView: (view: string) => void;
  isLoggedIn: boolean;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function AdminPanel({
  allPayments,
  setAllPayments,
  profiles,
  setProfiles,
  stories,
  setStories,
  onApprove,
  onReject,
  setUserRole,
  setCurrentView,
  isLoggedIn,
  darkMode,
  setDarkMode
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'payments' | 'members' | 'stories' | 'support' | 'settings'>('dashboard');
  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(null);
  
  // Mobile Sidebar toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Read existing passcode (with default fallback) from localStorage
  const getStoredPasscode = () => {
    return localStorage.getItem('whaatachi_admin_passcode_v1') || 'admin123';
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('whaatachi_admin_auth_v1') === 'true';
  });

  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Platform Matchmaking fee control (Dynamic Birr)
  const [matchFee, setMatchFee] = useState<number>(() => {
    const saved = localStorage.getItem('whaatachi_match_fee_v1');
    return saved ? parseInt(saved, 10) : 200;
  });

  // Maintenance mode state
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(() => {
    return localStorage.getItem('whaatachi_maintenance_mode') === 'true';
  });

  // Security passcode drawer controls inside Settings view
  const [newPasscode, setNewPasscode] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);

  // Support / Help Desk simulating replies
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>('t-1');
  const [mockTickets, setMockTickets] = useState([
    {
      id: 't-1',
      username: 'Abel Mekonnen',
      phone: '0911223344',
      message: 'Hello, I made a CBE Birr transfer 20 minutes ago. Transaction ID is FT2401120015. Please approve my reveal!',
      timestamp: 'Today, 10:15 AM',
      senderType: 'Male',
      status: 'Open',
      chatHistory: [
        { sender: 'user', text: 'Hello, I made a CBE Birr transfer 20 minutes ago.', time: '10:15 AM' },
        { sender: 'user', text: 'Transaction ID is FT2401120015. Please approve my reveal as soon as possible!', time: '10:16 AM' }
      ]
    },
    {
      id: 't-2',
      username: 'Helen Gebru',
      phone: '0916333444',
      message: 'I am getting a warning screen that my photo does not match the rules. Let me know what to change.',
      timestamp: 'Today, 09:24 AM',
      senderType: 'Female',
      status: 'Open',
      chatHistory: [
        { sender: 'user', text: 'I am getting a warning screen that my photo does not match the rules.', time: '09:24 AM' }
      ]
    },
    {
      id: 't-3',
      username: 'Samuel Solomon',
      phone: '0924999888',
      message: 'Thank you mods! The last contact I unlocked was excellent. We are meeting in Gondar this weekend.',
      timestamp: 'Yesterday, 18:40 PM',
      senderType: 'Male',
      status: 'Resolved',
      chatHistory: [
        { sender: 'user', text: 'How do I know my profile is visible to ladies in Gondar?', time: '06:30 PM' },
        { sender: 'agent', text: 'Hi Samuel! All registered Gondar profiles see you on their search feeds instantly!', time: '06:35 PM' },
        { sender: 'user', text: 'Thank you mods! The last contact I unlocked was excellent. We are meeting in Gondar this weekend.', time: '18:40 PM' }
      ]
    }
  ]);
  const [ticketReplyInput, setTicketReplyInput] = useState('');

  // Profiles Manager editing states
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Male' | 'Female'>('All');
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [verificationFilter, setVerificationFilter] = useState<'All' | 'Verified' | 'Unverified'>('All');
  
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  // Success story creation state
  const [newStoryNames, setNewStoryNames] = useState('');
  const [newStoryText, setNewStoryText] = useState('');
  const [newStoryYear, setNewStoryYear] = useState('2026');
  const [newStoryImage, setNewStoryImage] = useState('https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?w=600&auto=format&fit=crop&q=80');

  // New Profile Form inputs
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileAge, setNewProfileAge] = useState<number>(25);
  const [newProfileCity, setNewProfileCity] = useState('Addis Ababa');
  const [newProfileBio, setNewProfileBio] = useState('');
  const [newProfileGender, setNewProfileGender] = useState<'Male' | 'Female'>('Female');
  const [newProfileImage, setNewProfileImage] = useState('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80');
  const [newProfileIntent, setNewProfileIntent] = useState<'True Relationship' | 'Friendship' | 'Friends with Benefits'>('True Relationship');
  const [newProfileTelegram, setNewProfileTelegram] = useState('');
  const [newProfilePhone, setNewProfilePhone] = useState('');
  const [newProfileInterests, setNewProfileInterests] = useState('Coffee, Music, Literature');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPass = getStoredPasscode();
    if (passcode.trim() === storedPass) {
      localStorage.setItem('whaatachi_admin_auth_v1', 'true');
      setIsAuthenticated(true);
      setError(null);
      setUserRole('admin');
    } else {
      setError('Invalid administrative passcode. Please verify your bypass key credentials.');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('whaatachi_admin_auth_v1');
    setIsAuthenticated(false);
    setUserRole('user');
    setCurrentView(isLoggedIn ? 'dashboard' : 'home');
  };

  const handleUpdatePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscode.trim()) return;
    localStorage.setItem('whaatachi_admin_passcode_v1', newPasscode.trim());
    setChangeSuccess(true);
    setNewPasscode('');
    setTimeout(() => {
      setChangeSuccess(false);
    }, 2500);
  };

  const handleSaveMatchFee = (fee: number) => {
    setMatchFee(fee);
    localStorage.setItem('whaatachi_match_fee_v1', fee.toString());
    alert(`Match fee updated to ${fee} ETB successfully globally!`);
  };

  // Toggle Maintenance Mode
  const handleToggleMaintenance = () => {
    const nextVal = !maintenanceMode;
    setMaintenanceMode(nextVal);
    localStorage.setItem('whaatachi_maintenance_mode', nextVal.toString());
  };

  // Profiles Manager CRUD
  const handleDeleteProfile = (profileId: string) => {
    if (window.confirm('Are you absolutely sure you want to delete this profile? All unlock links will be destroyed.')) {
      setProfiles(prev => prev.filter(p => p.id !== profileId));
    }
  };

  const handleToggleProfileVerification = (profileId: string) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === profileId) {
        return { ...p, verified: !p.verified };
      }
      return p;
    }));
  };

  const handleSaveEditedProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;
    
    setProfiles(prev => prev.map(p => {
      if (p.id === editingProfile.id) {
        return editingProfile;
      }
      return p;
    }));
    setEditingProfile(null);
  };

  const handleCreateNewProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim() || !newProfileTelegram.trim()) {
      alert('Please fill out Name and Telegram handle fields.');
      return;
    }

    const interestsArr = newProfileInterests.split(',').map(item => item.trim()).filter(Boolean);

    const created: Profile = {
      id: `p-${Date.now()}`,
      name: newProfileName.trim(),
      age: Number(newProfileAge),
      city: newProfileCity,
      bio: newProfileBio.trim() || 'No bio submitted yet.',
      gender: newProfileGender,
      image: newProfileImage.trim(),
      status: 'Online',
      relationshipIntent: newProfileIntent,
      interests: interestsArr.length > 0 ? interestsArr : ['Macchiato', 'Music'],
      verified: true, // Auto verified since admin created it
      contactInfo: {
        phone: newProfilePhone.trim() || '+251 900 000 000',
        telegram: newProfileTelegram.trim().startsWith('@') ? newProfileTelegram.trim() : `@${newProfileTelegram.trim()}`,
        email: `${newProfileName.trim().toLowerCase().replace(/\s+/g, '')}@whaatachi.com`
      }
    };

    setProfiles(prev => [created, ...prev]);
    setIsCreatingProfile(false);
    
    // Clear fields
    setNewProfileName('');
    setNewProfileBio('');
    setNewProfileTelegram('');
    setNewProfilePhone('');
    alert('Match candidate created and verified instantly!');
  };

  // Success Stories CRUD
  const handleDeleteStory = (storyId: string) => {
    if (window.confirm('Delete this success story from the landing page?')) {
      setStories(prev => prev.filter(s => s.id !== storyId));
    }
  };

  const handleCreateSuccessStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryNames.trim() || !newStoryText.trim()) {
      alert('Fill in couple names and their story text.');
      return;
    }
    const created: SuccessStory = {
      id: `story-${Date.now()}`,
      coupleNames: newStoryNames.trim(),
      story: newStoryText.trim(),
      year: newStoryYear,
      image: newStoryImage.trim()
    };
    setStories(prev => [created, ...prev]);
    setNewStoryNames('');
    setNewStoryText('');
    alert('Success story published successfully!');
  };

  // Support Inbox simulator
  const handleSendTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketReplyInput.trim() || !selectedTicketId) return;

    setMockTickets(prev => prev.map(t => {
      if (t.id === selectedTicketId) {
        return {
          ...t,
          status: 'Resolved',
          chatHistory: [
            ...t.chatHistory,
            { sender: 'agent', text: ticketReplyInput.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          ]
        };
      }
      return t;
    }));
    setTicketReplyInput('');
  };

  // Filter profiles based on inputs
  const filteredProfiles = useMemo(() => {
    return profiles.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.contactInfo.telegram.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGender = genderFilter === 'All' || p.gender === genderFilter;
      const matchesCity = cityFilter === 'All' || p.city === cityFilter;
      const matchesVerification = verificationFilter === 'All' || 
                                  (verificationFilter === 'Verified' && p.verified) ||
                                  (verificationFilter === 'Unverified' && !p.verified);
      return matchesSearch && matchesGender && matchesCity && matchesVerification;
    });
  }, [profiles, searchQuery, genderFilter, cityFilter, verificationFilter]);

  // Cities extracted
  const uniqueCities = useMemo(() => {
    const list = profiles.map(p => p.city);
    return Array.from(new Set(list));
  }, [profiles]);

  // Statistics Computations
  const pendingCount = allPayments.filter(p => p.status === 'Pending').length;
  const approvedPaymentsList = allPayments.filter(p => p.status === 'Approved');
  const revenueSum = approvedPaymentsList.reduce((sum, p) => sum + p.amount, 0);
  const malePremiumCount = profiles.filter(p => p.gender === 'Male' && p.verified).length;
  const femalePremiumCount = profiles.filter(p => p.gender === 'Female').length;

  const getStatusBadge = (status: PaymentRequest['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Rejected':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default:
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse';
    }
  };

  // Auth gate check
  if (!isAuthenticated) {
    return (
      <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col justify-center items-center px-4 relative overflow-hidden" id="admin-security-gate">
        {/* Decorative Grid overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-35" />
        
        {/* Soft backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]" />
        
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-2xl space-y-6 text-center relative z-10 transition-colors">
          
          {/* Logo Header */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 text-white flex items-center justify-center shadow-lg relative">
            <Lock className="h-7 w-7" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-pink-500 tracking-wider uppercase">AUTHENTICATION REQUIRED</span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Whaatachi Admin Gate
            </h1>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Unlock the core dashboard to approve CBE & Telebirr receipts, create mock candidates, and edit platform match rates.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left text-xs">
              <label className="font-bold text-slate-355 uppercase tracking-widest text-[9px] block">
                Administrative Passcode
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  required
                  placeholder="Enter secret passcode"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setError(null);
                  }}
                  className="w-full border border-slate-800 focus:border-pink-550 rounded-2xl pl-4 pr-12 py-3.5 bg-slate-950 text-white text-xs outline-hidden focus:ring-1 focus:ring-pink-500/25 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {error && (
                <p className="text-[10px] text-rose-450 font-bold mt-2 flex items-center gap-1.5 animate-bounce">
                  <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white rounded-2xl text-xs font-extrabold tracking-wider shadow-md hover:shadow-pink-500/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="h-4 w-4" />
              ACCESS MODERATION CONSOLE
            </button>
          </form>

          {/* Bypass Code Help bar */}
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2 text-left">
            <div className="flex justify-between items-center">
              <p className="text-[9px] text-slate-500 font-bold flex items-center gap-1 uppercase">
                <Key className="h-3 w-3 text-amber-500" /> Security Bypass key:
              </p>
              <span className="text-[8px] bg-amber-500/10 text-amber-400 font-extrabold px-1.5 py-0.5 rounded-sm">DEMO ENV</span>
            </div>
            
            <p className="text-xs font-mono font-bold text-pink-400 bg-pink-950/20 px-2 py-1 rounded-md text-center border border-pink-900/30 select-all tracking-wider">
              admin123
            </p>
          </div>

          <button
            onClick={() => setCurrentView(isLoggedIn ? 'dashboard' : 'home')}
            className="text-xs text-slate-400 hover:text-white transition-all underline outline-hidden"
          >
            ← Return to User Dating Venue
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans" id="admin-workspace">
      
      {/* ========================================================= */}
      {/* 1. LEFT ADMIN SIDEBAR PANEL                               */}
      {/* ========================================================= */}
      
      {/* Mobile Header bar */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-pink-100 dark:bg-pink-950/40 p-1.5 rounded-lg text-pink-600 dark:text-pink-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="font-extrabold tracking-tight text-white shrink-0 text-sm">Whaatachi Control Panel</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 bg-slate-950 rounded-lg text-slate-450 border border-slate-800"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Actual Sidebar responsive shell */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 transition-transform duration-300 ease-in-out
      `}>
        
        {/* Admin Brand Logo Wrapper */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-pink-600 to-rose-500 p-2 rounded-xl text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="font-black text-[15px] tracking-tight text-white block">Whaatachi B2B</span>
              <span className="text-[9px] font-bold text-pink-400 tracking-wider block uppercase">Control Suite v1.2</span>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 bg-slate-950 rounded-md text-slate-400"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Navigation Tab selection lists */}
        <nav className="p-4 flex-1 space-y-1.5 overflow-y-auto scrollbar-thin">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-3 mb-2">MANAGEMENT DESKS</p>
          
          {/* Dashboard tab */}
          <button
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-xs' 
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <LayoutDashboard className="h-4.5 w-4.5" />
              Metrics Overview
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          </button>

          {/* Payments verifications tab */}
          <button
            onClick={() => { setActiveTab('payments'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'payments' 
                ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-xs' 
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Smartphone className="h-4.5 w-4.5" />
              Receipt Verification Queue
            </span>
            {pendingCount > 0 ? (
              <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                {pendingCount}
              </span>
            ) : (
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            )}
          </button>

          {/* Profiles matches manager tab */}
          <button
            onClick={() => { setActiveTab('members'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'members' 
                ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-xs' 
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Users className="h-4.5 w-4.5" />
              Member Candidates
            </span>
            <span className="bg-slate-830 text-slate-200 text-[10px] px-1.5 py-0.5 rounded-md font-semibold">
              {profiles.length}
            </span>
          </button>

          {/* Success Stories moderator tab */}
          <button
            onClick={() => { setActiveTab('stories'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'stories' 
                ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-xs' 
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Sparkles className="h-4.5 w-4.5" />
              Landing Stories Moderator
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          </button>

          {/* Resolution Desk support tab */}
          <button
            onClick={() => { setActiveTab('support'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'support' 
                ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-xs' 
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <MessageSquare className="h-4.5 w-4.5" />
              Direct Support Help Desk
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          </button>

          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-3 pt-4 mb-2">SYSTEM CONTROL</p>

          {/* Config Settings tab */}
          <button
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings' 
                ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-xs' 
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Sliders className="h-4.5 w-4.5" />
              Platform Admin Settings
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          </button>

        </nav>

        {/* Sidebar Footer lock back links */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-850 hover:text-white transition-colors"
          >
            <span>Theme Control:</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-950 font-mono text-[10px] text-pink-400 border border-slate-800">
              {darkMode ? 'DARK' : 'LIGHT'}
            </span>
          </button>

          <button
            onClick={handleAdminLogout}
            className="w-full py-2.5 rounded-xl bg-slate-955 border border-slate-800 hover:bg-red-950/20 text-red-400 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Lock Session
          </button>
        </div>

      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN HUB WORKSPACE CONTENT                             */}
      {/* ========================================================= */}
      <main className="flex-1 overflow-y-auto max-h-screen p-4 sm:p-8" id="admin-hub-workspace">
        
        {/* TOP STATUS NAVIGATION BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800/60 mb-6">
          <div>
            <span className="text-[10px] font-extrabold text-pink-500 uppercase tracking-widest block">ADMIN PLATFORM CONTROL</span>
            <h2 className="text-2xl font-black text-white capitalize flex items-center gap-2.5">
              {activeTab === 'dashboard' && <LayoutDashboard className="h-6 w-6 text-pink-500" />}
              {activeTab === 'payments' && <Smartphone className="h-6 w-6 text-pink-500" />}
              {activeTab === 'members' && <Users className="h-6 w-6 text-pink-500" />}
              {activeTab === 'stories' && <Sparkles className="h-6 w-6 text-pink-500" />}
              {activeTab === 'support' && <MessageSquare className="h-6 w-6 text-pink-500" />}
              {activeTab === 'settings' && <Sliders className="h-6 w-6 text-pink-500" />}
              {activeTab} Workspace
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-light hidden sm:inline">Active Token: <strong className="font-mono text-emerald-450 uppercase">admin-secured</strong></span>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
            <button
              onClick={() => {
                setCurrentView(isLoggedIn ? 'dashboard' : 'home');
              }}
              className="px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold hover:bg-pink-500/25 transition-all cursor-pointer"
            >
              Public App View
            </button>
          </div>
        </div>

        {/* METRICS & WARNING BANNER */}
        {maintenanceMode && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-amber-300 text-xs flex items-center gap-3 animate-fadeIn">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
            <div>
              <p className="font-extrabold text-amber-200">MAINTENANCE SYSTEM LOCKOUT ACTIVE</p>
              <p className="font-light">Whaatachi is simulating an admin maintenance lock. All normal user database registers will be queued under security.</p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUBVIEW 1: METRICS OVERVIEW (DASHBOARD)                   */}
        {/* ========================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Core Stats Cards Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Revenue in Birr */}
              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Audited Platform Revenue</p>
                  <h3 className="text-3xl font-black text-white">{revenueSum} <span className="text-xs font-semibold text-slate-500">ETB</span></h3>
                  <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 mt-2">
                    <TrendingUp className="h-3.5 w-3.5" /> 100% Valid transfers
                  </p>
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl border border-emerald-500/20">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>

              {/* Card 2: Pending verifications */}
              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Pending Slip Verifications</p>
                  <h3 className="text-3xl font-black text-white">{pendingCount} <span className="text-xs font-semibold text-slate-500">slips</span></h3>
                  <p className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5 mt-2 animate-pulse">
                    <Clock className="h-3.5 w-3.5" /> Review SLA 11m
                  </p>
                </div>
                <div className="bg-amber-500/10 text-amber-400 p-3 rounded-xl border border-amber-500/20">
                  <Clock className="h-6 w-6" />
                </div>
              </div>

              {/* Card 3: Member count details */}
              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Matchmaking Candidates</p>
                  <h3 className="text-3xl font-black text-white">{profiles.length} <span className="text-xs font-semibold text-slate-500">singles</span></h3>
                  <p className="text-[10px] text-pink-400 font-bold flex items-center gap-0.5 mt-2">
                    <Heart className="h-3.5 w-3.5 fill-pink-500 text-pink-500" /> Active pool
                  </p>
                </div>
                <div className="bg-pink-500/10 text-pink-400 p-3 rounded-xl border border-pink-500/20">
                  <Users className="h-6 w-6" />
                </div>
              </div>

              {/* Card 4: Base connections fee */}
              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Standard Connections Rate</p>
                  <h3 className="text-3xl font-black text-white">{matchFee} <span className="text-xs font-semibold text-slate-500">ETB</span></h3>
                  <p className="text-[10px] text-blue-400 font-bold flex items-center gap-0.5 mt-2">
                    <Settings className="h-3.5 w-3.5" /> Managed dynamically
                  </p>
                </div>
                <div className="bg-blue-500/10 text-blue-400 p-3 rounded-xl border border-blue-500/20">
                  <Sliders className="h-6 w-6" />
                </div>
              </div>

            </div>

            {/* Premium Custom SVG Charts & Graphics Representation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Analytics Chart Graphic (SVG bar charts of Regional growth in major cities) */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Demographic Distribution</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Breakdown of dating registrations in metropolitan Ethiopian hubs</p>
                  </div>
                  <span className="text-[10px] bg-slate-950 px-2 py-0.5 border border-slate-800 text-pink-400 rounded-md font-mono">LIVE UPDATE</span>
                </div>

                {/* Simulated Custom Bar chart blocks with nice styles */}
                <div className="space-y-3 pt-2">
                  {[
                    { city: 'Addis Ababa', count: 28400, percent: 84, color: 'bg-pink-500' },
                    { city: 'Hawassa', count: 3200, percent: 54, color: 'bg-rose-500' },
                    { city: 'Adama', count: 1800, percent: 36, color: 'bg-blue-500' },
                    { city: 'Gondar', count: 1200, percent: 24, color: 'bg-amber-500' },
                    { city: 'Bahir Dar', count: 900, percent: 18, color: 'bg-emerald-500' }
                  ].map((cityStat) => (
                    <div key={cityStat.city} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>{cityStat.city}</span>
                        <span>{cityStat.count.toLocaleString()} candidates ({cityStat.percent}%)</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80">
                        <div className={`${cityStat.color} h-full rounded-full`} style={{ width: `${cityStat.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick informational footer of SVG indicators */}
                <div className="pt-4 flex gap-4 text-[10px] text-slate-450 border-t border-slate-800/50 justify-center">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-pink-500" /> Female registrants ({femalePremiumCount})
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Verified serial gentlemen ({malePremiumCount})
                  </div>
                </div>

              </div>

              {/* Right Column: Matched Tickets Ticker & Feed */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col space-y-4">
                <div className="pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Match Events Ticker</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Real-time simulator activity matches</p>
                </div>

                <div className="space-y-4 divide-y divide-slate-800 flex-1 overflow-y-auto max-h-[280px] scrollbar-none pr-1">
                  {[
                    { id: 1, text: 'Mihret (F) initiated a direct chat help resolution ticket.', time: '10 mins ago', type: 'ticket' },
                    { id: 2, text: 'Abel (M) submitted transaction FT2401120015 for review.', time: '15 mins ago', type: 'payment' },
                    { id: 3, text: 'Sam Hob (M) unlocked Bethel Elias direct telegram access.', time: '1 hour ago', type: 'match' },
                    { id: 4, text: 'Kidist Hailu (F) gained instantly free contact verified reveal.', time: '2 hours ago', type: 'female_free' },
                    { id: 5, text: 'Yosef (M) updated Telegram contact digits of Addis.', time: '5 hours ago', type: 'profile' }
                  ].map((tickerItem) => (
                    <div key={tickerItem.id} className="pt-3 first:pt-0 flex items-start gap-2 text-xs font-light text-slate-350">
                      <div className="mt-0.5">
                        {tickerItem.type === 'ticket' && <MessageSquare className="h-3 w-3 text-blue-400" />}
                        {tickerItem.type === 'payment' && <Smartphone className="h-3 w-3 text-amber-400 font-bold" />}
                        {tickerItem.type === 'match' && <Heart className="h-3 w-3 text-pink-500" />}
                        {tickerItem.type === 'female_free' && <Sparkles className="h-3 w-3 text-emerald-400" />}
                        {tickerItem.type === 'profile' && <Users className="h-3 w-3 text-slate-400" />}
                      </div>
                      <div className="space-y-0.5">
                        <p className="leading-relaxed">{tickerItem.text}</p>
                        <span className="text-[9px] text-slate-500 font-bold">{tickerItem.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

            {/* Quick Action Simulator Tools */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-300 flex items-center gap-1.5">
                  <Sliders className="h-4.5 w-4.5 text-pink-500" /> Quick Seed & Database Commands
                </h4>
                <p className="text-[10px] text-slate-500">Inject preset mock parameters to test various app pathways instantly</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                
                {/* Seed option 1 */}
                <button
                  onClick={() => {
                    const sample: Profile = {
                      id: `p-sim-${Date.now()}`,
                      name: 'Zenebech Abera',
                      age: 22,
                      city: 'Adama',
                      bio: 'Lover of acoustic Ethiopian jazz, hiking, and traditional Habesha kitfo. Say hi!',
                      gender: 'Female',
                      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
                      status: 'Online',
                      relationshipIntent: 'True Relationship',
                      interests: ['Jazz', 'Hiking', 'Kitfo'],
                      verified: true,
                      contactInfo: { phone: '0900112233', telegram: '@zene_abera', email: 'zenebech@whaatachi.com' }
                    };
                    setProfiles(prev => [sample, ...prev]);
                    alert('Simulated FEMALE candidate injected! Verify discover match feed.');
                  }}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-pink-500 text-slate-300 hover:text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all text-center justify-center cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-pink-550" />
                  Seed Female Member
                </button>

                {/* Seed option 2 */}
                <button
                  onClick={() => {
                    const sample: Profile = {
                      id: `p-sim-m-${Date.now()}`,
                      name: 'Brook Shiferaw',
                      age: 28,
                      city: 'Addis Ababa',
                      bio: 'Pristine Macchiato addict, tech consultant. Sketching architectures, buscando genuine connection.',
                      gender: 'Male',
                      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
                      status: 'Recently Active',
                      relationshipIntent: 'True Relationship',
                      interests: ['Macchiato', 'Tech', 'Sketching'],
                      verified: false,
                      contactInfo: { phone: '0933445566', telegram: '@brook_shif', email: 'brook@whaatachi.com' }
                    };
                    setProfiles(prev => [sample, ...prev]);
                    alert('Simulated MALE candidate injected! Verify discover list.');
                  }}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-blue-500 text-slate-300 hover:text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all text-center justify-center cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-blue-500" />
                  Seed Male Member
                </button>

                {/* Mock submission */}
                <button
                  onClick={() => {
                    const randTx = `RE${Math.floor(Math.random() * 9000000) + 1000000}`;
                    const customReq: PaymentRequest = {
                      id: `t-pay-${Date.now()}`,
                      profileId: 'p5',
                      profileName: 'Helen Gebru',
                      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
                      senderName: 'Lomi Teklu',
                      senderPhone: '0988000444',
                      transactionId: randTx,
                      method: 'Telebirr',
                      amount: matchFee,
                      timestamp: 'Just now',
                      status: 'Pending'
                    };
                    setAllPayments(prev => [customReq, ...prev]);
                    alert(`Simulated Pending payment ${randTx} submitted. Check Receipt tab queue!`);
                  }}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-amber-500 text-slate-300 hover:text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all text-center justify-center cursor-pointer"
                >
                  <Smartphone className="h-4 w-4 text-amber-500" />
                  Simulate Male Payment Submit
                </button>

                {/* Reset local matches */}
                <button
                  onClick={() => {
                    if (window.confirm('Reset state to factory values? This clears manual candidates.')) {
                      localStorage.clear();
                      alert('Local Storage pruned. Reload application component to fetch initial baseline data.');
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-850 hover:bg-slate-800/40 hover:border-red-500 text-slate-400 hover:text-red-400 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all text-center justify-center cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reset Demo DB
                </button>

              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* SUBVIEW 2: CBE & TELEBIRR RECEIPTS VERIFICATION QUEUE     */}
        {/* ========================================================= */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-xs text-slate-300">
              <p className="font-extrabold text-pink-400 flex items-center gap-1 mb-1">
                <AlertTriangle className="h-4 w-4" /> MODERATION POLICIES
              </p>
              Match verification requests must match the official Telebirr or CBE Birr reference. Inspect reference ID, Sender Name, and payment methods. Tap <strong>Verify & Approve</strong> to unlock the Telegram access immediately on their screens.
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Payment Receipt Table list */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-350 flex items-center gap-2">
                    <Smartphone className="h-4.5 w-4.5 text-pink-550" />
                    Pending & Historical Payments ({allPayments.length})
                  </h4>
                </div>

                {allPayments.length > 0 ? (
                  <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-950 text-slate-400 border-b border-slate-830">
                          <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Depositor</th>
                          <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Unlocking Match</th>
                          <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Tx ID</th>
                          <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Amount</th>
                          <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Status</th>
                          <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850 font-medium text-slate-300">
                        {allPayments.map((payment) => (
                          <tr 
                            key={payment.id}
                            className={`hover:bg-slate-850/40 transition-colors cursor-pointer ${
                              selectedRequest?.id === payment.id ? 'bg-pink-900/10' : ''
                            }`}
                            onClick={() => setSelectedRequest(payment)}
                          >
                            <td className="p-4">
                              <div>
                                <p className="font-extrabold text-white">{payment.senderName}</p>
                                <p className="text-[10px] text-slate-500">{payment.senderPhone}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <img src={payment.profileImage} alt={payment.profileName} className="w-6 h-6 rounded-full object-cover shrink-0" />
                                <span className="truncate max-w-[80px] sm:max-w-none text-slate-300">{payment.profileName}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-sm text-[9px] font-extrabold uppercase ${
                                payment.method === 'Telebirr' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                              }`}>
                                {payment.method}
                              </span>
                              <p className="font-mono text-[9px] text-slate-450 uppercase mt-1">{payment.transactionId}</p>
                            </td>
                            <td className="p-4 font-extrabold text-white">
                              {payment.amount} ETB
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(payment.status)}`}>
                                {payment.status}
                              </span>
                            </td>
                            <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                              {payment.status === 'Pending' ? (
                                <div className="flex gap-1 justify-end">
                                  <button
                                    onClick={() => onApprove(payment.id)}
                                    className="bg-emerald-550 hover:bg-emerald-600 text-white rounded-md p-1 cursor-pointer shadow-xs transition-colors"
                                    title="Approve immediately"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => onReject(payment.id)}
                                    className="bg-rose-550 hover:bg-rose-600 text-white rounded-md p-1 cursor-pointer shadow-xs transition-colors"
                                    title="Reject or flag slip"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[9px] text-slate-550 font-bold uppercase italic">Verified</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-16 text-center text-xs text-slate-500 space-y-2">
                    <Smartphone className="h-8 w-8 text-slate-700 mx-auto" />
                    <p>No active transactions submitted yet inside mock environment.</p>
                  </div>
                )}
              </div>

              {/* Inspector Panel detail */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 lg:sticky lg:top-24">
                <div className="pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#00E676] flex items-center gap-1.5">
                    <CheckCircle className="h-4.5 w-4.5 text-emerald-400" />
                    TELEBIRR/CBE INVESTIGATOR
                  </h4>
                  <p className="text-[10px] text-slate-500">Inspect simulated bank terminal transfer logs</p>
                </div>

                {selectedRequest ? (
                  <div className="space-y-4 text-xs animate-fadeIn">
                    
                    {/* Simulated mobile success ticket screen */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-[10px] text-slate-350 space-y-3 relative">
                      <div className="absolute top-2 right-2 border border-emerald-500/20 bg-emerald-500/5 px-1.5 py-0.5 text-[#00E676] text-[8px] rounded-sm uppercase tracking-widest font-sans font-bold animate-pulse">
                        Terminal Active
                      </div>
                      
                      <div className="text-center font-sans">
                        <p className="font-black text-rose-500 tracking-wider">WHAATACHI MERCH BANK</p>
                        <p className="text-[8px] text-slate-500">ETHIOPIA PAYMENT RESOLUTION</p>
                      </div>

                      <div className="space-y-1 pt-2 border-t border-dashed border-slate-800">
                        <p>REF NO: <span className="text-white font-bold">{selectedRequest.transactionId}</span></p>
                        <p>METHOD: <span className="text-blue-400 uppercase font-black">{selectedRequest.method}</span></p>
                        <p>AMOUNT: <span className="text-[#00E676] font-extrabold">{selectedRequest.amount}.00 ETB</span></p>
                        <p>DEPOSITOR: <span className="text-white font-bold">{selectedRequest.senderName}</span></p>
                        <p>PHONE: <span>{selectedRequest.senderPhone}</span></p>
                        <p>MATCH REVEAL: <span>{selectedRequest.profileName}</span></p>
                        <p>TIMESTAMP: <span className="text-slate-400">{selectedRequest.timestamp}</span></p>
                      </div>

                      <div className="text-center text-[8px] text-slate-600 font-sans pt-1 border-t border-dashed border-slate-800">
                        *** AUTOMATED AUDIT OK ***
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <p className="font-extrabold text-slate-300">Quick Moderation Review:</p>
                      <ul className="space-y-1.5 text-slate-400 list-disc pl-4 font-light text-[11px]">
                        <li>Ensure transaction reference is not repetitive.</li>
                        <li>Receipt values are checked against real standard fee of {selectedRequest.amount} Birr.</li>
                      </ul>
                    </div>

                    {selectedRequest.status === 'Pending' && (
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          onClick={() => {
                            onApprove(selectedRequest.id);
                            setSelectedRequest(null);
                          }}
                          className="py-2.5 bg-emerald-550 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer text-center"
                        >
                          Approve reveal
                        </button>
                        <button
                          onClick={() => {
                            onReject(selectedRequest.id);
                            setSelectedRequest(null);
                          }}
                          className="py-2.5 bg-rose-550 hover:bg-rose-650 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer text-center"
                        >
                          Flag fraud
                        </button>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-slate-500 font-light">
                    <Smartphone className="h-7 w-7 text-slate-750 mx-auto mb-2 animate-bounce" />
                    Select a payment reference from the queue to run receipt terminal auditing.
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* SUBVIEW 3: MANAGE MEMBER PROFILES (CRUD MATCH POOL)     */}
        {/* ========================================================= */}
        {activeTab === 'members' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header filters bar */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search box */}
              <div className="relative w-full md:max-w-xs text-slate-400">
                <Search className="absolute left-3 top-2.5 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search single candidate or tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-850 bg-slate-950 text-white focus:outline-hidden focus:border-pink-500"
                />
              </div>

              {/* Selection Filters */}
              <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                
                {/* Gender filter */}
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-350 outline-hidden"
                >
                  <option value="All">All Genders</option>
                  <option value="Male">♂ Males</option>
                  <option value="Female">♀ Females</option>
                </select>

                {/* City filter */}
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-350 outline-hidden"
                >
                  <option value="All">All Cities</option>
                  {uniqueCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>

                {/* Verification badge filter */}
                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-350 outline-hidden"
                >
                  <option value="All">All Badges</option>
                  <option value="Verified">Verified Only</option>
                  <option value="Unverified">Unverified Only</option>
                </select>

                {/* Create Profile toggle button */}
                <button
                  onClick={() => setIsCreatingProfile(true)}
                  className="bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 text-white rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-all outline-hidden shrink-0 cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Match Candidate
                </button>
              </div>

            </div>

            {/* Profiles lists Grid card views */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <div key={profile.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 flex flex-col justify-between shadow-3xs hover:border-slate-700 transition-all">
                  
                  {/* Top user bar info */}
                  <div className="flex gap-4 items-start">
                    <img src={profile.image} alt={profile.name} className="w-14 h-14 rounded-full object-cover shrink-0 border border-slate-800" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-white">{profile.name}</span>
                        {profile.verified && <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 fill-emerald-500/10" />}
                      </div>
                      <p className="text-[11px] text-slate-450 font-medium">{profile.age} years old · {profile.city}</p>
                      
                      <div className="flex gap-2 mt-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          profile.gender === 'Male' ? 'bg-blue-500/15 text-blue-400' : 'bg-pink-500/15 text-pink-400'
                        }`}>
                          {profile.gender}
                        </span>
                        <span className="bg-slate-950 text-slate-400 px-2 py-0.5 rounded-full text-[9px] font-bold truncate max-w-[125px]">
                          {profile.relationshipIntent}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio brief */}
                  <p className="text-xs text-slate-400 line-clamp-2 font-light">{profile.bio}</p>

                  {/* Direct Contact info sensitive tags */}
                  <div className="p-3 bg-slate-950/80 border border-slate-850 rounded-2xl space-y-1 font-mono text-[10px]">
                    <p className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">DISCLOSED ACCESS MATRIX:</p>
                    <p>Telegram: <span className="text-pink-400 font-extrabold select-all">{profile.contactInfo.telegram}</span></p>
                    <p>Phone: <span className="text-slate-300 font-bold select-all">{profile.contactInfo.phone}</span></p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 justify-end pt-1 border-t border-slate-800/50">
                    <button
                      onClick={() => handleToggleProfileVerification(profile.id)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-350 text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer"
                      title="Toggle verified badge status"
                    >
                      {profile.verified ? 'Unverify' : 'Verify Match'}
                    </button>
                    <button
                      onClick={() => setEditingProfile(profile)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-pink-500 text-pink-405 text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="h-3 w-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProfile(profile.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-955/15 hover:bg-rose-950/40 border border-rose-900/30 text-rose-455 text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" /> Ban
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Profile Creation Dialog Modal */}
            {isCreatingProfile && (
              <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs" onClick={() => setIsCreatingProfile(false)}></div>
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative z-10 scale-in shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-805">
                    <h3 className="font-extrabold text-base text-white">Createverified Match Candidate</h3>
                    <button onClick={() => setIsCreatingProfile(false)} className="text-slate-400 hover:text-white p-1"><X className="h-5 w-5" /></button>
                  </div>

                  <form onSubmit={handleCreateNewProfile} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-400 block uppercase">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mahlet Desalegn"
                          value={newProfileName}
                          onChange={(e) => setNewProfileName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white text-xs outline-hidden focus:border-pink-500"
                        />
                      </div>

                      {/* Age */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-400 block uppercase">Age</label>
                        <input
                          type="number"
                          required
                          min={18}
                          max={99}
                          value={newProfileAge}
                          onChange={(e) => setNewProfileAge(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white text-xs outline-hidden focus:border-pink-500"
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Gender selection */}
                      <div className="space-y-1 font-bold text-slate-400 block">
                        <label className="uppercase">Candidate Gender</label>
                        <select
                          value={newProfileGender}
                          onChange={(e) => setNewProfileGender(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-300 outline-hidden"
                        >
                          <option value="Female">Female candidate</option>
                          <option value="Male">Male candidate</option>
                        </select>
                      </div>

                      {/* City */}
                      <div className="space-y-1 font-bold text-slate-400 block">
                        <label className="uppercase">Ethiopian City</label>
                        <select
                          value={newProfileCity}
                          onChange={(e) => setNewProfileCity(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-300 outline-hidden"
                        >
                          <option value="Addis Ababa">Addis Ababa</option>
                          <option value="Hawassa">Hawassa</option>
                          <option value="Adama">Adama</option>
                          <option value="Gondar">Gondar</option>
                          <option value="Bahir Dar">Bahir Dar</option>
                        </select>
                      </div>

                    </div>

                    {/* Bio */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-400 block uppercase">Bio statement</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Write dynamic candidate introduction description..."
                        value={newProfileBio}
                        onChange={(e) => setNewProfileBio(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white text-xs outline-hidden focus:border-pink-500"
                      />
                    </div>

                    {/* Image URL with standard defaults */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-400 block uppercase">Photo URL</label>
                      <input
                        type="text"
                        placeholder="Paste image link manually, or use sample"
                        value={newProfileImage}
                        onChange={(e) => setNewProfileImage(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white text-xs font-mono outline-hidden focus:border-pink-500"
                      />
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setNewProfileImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80')}
                          className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[9px] hover:text-white"
                        >
                          Unsplash Female
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewProfileImage('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80')}
                          className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[9px] hover:text-white"
                        >
                          Unsplash Male
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Telegram handle */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-400 block uppercase">Telegram Handle (Required)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. @mahlet_des"
                          value={newProfileTelegram}
                          onChange={(e) => setNewProfileTelegram(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-805 p-2.5 rounded-xl text-white text-xs outline-hidden focus:border-pink-500"
                        />
                      </div>

                      {/* Phone handle */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-400 block uppercase">Phone Number</label>
                        <input
                          type="text"
                          placeholder="e.g. +251 912 345 678"
                          value={newProfilePhone}
                          onChange={(e) => setNewProfilePhone(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-805 p-2.5 rounded-xl text-white text-xs outline-hidden focus:border-pink-500"
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Intent selector */}
                      <div className="space-y-1 block font-bold text-slate-450 block">
                        <label className="uppercase">Relationship Intent</label>
                        <select
                          value={newProfileIntent}
                          onChange={(e) => setNewProfileIntent(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-300 outline-hidden"
                        >
                          <option value="True Relationship">True Relationship</option>
                          <option value="Friendship">Friendship</option>
                          <option value="Friends with Benefits">Friends with Benefits</option>
                        </select>
                      </div>

                      {/* Interests */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-400 block uppercase">Interests (Comma separated)</label>
                        <input
                          type="text"
                          placeholder="e.g., Macchiato, Yoga, History"
                          value={newProfileInterests}
                          onChange={(e) => setNewProfileInterests(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-805 p-2.5 rounded-xl text-white text-xs outline-hidden focus:border-pink-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsCreatingProfile(false)}
                        className="px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-850 rounded-xl text-slate-305 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-extrabold rounded-xl transition-colors"
                      >
                        Create & Verify Instant
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}

            {/* Profile editing form dialog */}
            {editingProfile && (
              <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs" onClick={() => setEditingProfile(null)}></div>
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative z-10 scale-in shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                    <h3 className="font-extrabold text-base text-white">Modify Candidate Profile: {editingProfile.name}</h3>
                    <button onClick={() => setEditingProfile(null)} className="text-slate-400 hover:text-white p-1"><X className="h-5 w-5" /></button>
                  </div>

                  <form onSubmit={handleSaveEditedProfile} className="space-y-4 text-xs">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-400 block uppercase">Name</label>
                        <input
                          type="text"
                          required
                          value={editingProfile.name}
                          onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white outline-hidden focus:border-pink-500"
                        />
                      </div>

                      {/* Age */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-400 block uppercase">Age</label>
                        <input
                          type="number"
                          required
                          value={editingProfile.age}
                          onChange={(e) => setEditingProfile({ ...editingProfile, age: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white outline-hidden focus:border-pink-500"
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* City */}
                      <div className="space-y-1 block font-bold text-slate-400">
                        <label className="uppercase">City</label>
                        <select
                          value={editingProfile.city}
                          onChange={(e) => setEditingProfile({ ...editingProfile, city: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-305 outline-hidden"
                        >
                          <option value="Addis Ababa">Addis Ababa</option>
                          <option value="Hawassa">Hawassa</option>
                          <option value="Adama">Adama</option>
                          <option value="Gondar">Gondar</option>
                          <option value="Bahir Dar">Bahir Dar</option>
                        </select>
                      </div>

                      {/* Intent */}
                      <div className="space-y-1 block font-bold text-slate-400">
                        <label className="uppercase">Relationship Intent</label>
                        <select
                          value={editingProfile.relationshipIntent}
                          onChange={(e) => setEditingProfile({ ...editingProfile, relationshipIntent: e.target.value as any })}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-305 outline-hidden"
                        >
                          <option value="True Relationship">True Relationship</option>
                          <option value="Friendship">Friendship</option>
                          <option value="Friends with Benefits">Friends with Benefits</option>
                        </select>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-400 block uppercase">Bio</label>
                      <textarea
                        rows={3}
                        required
                        value={editingProfile.bio}
                        onChange={(e) => setEditingProfile({ ...editingProfile, bio: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white outline-hidden focus:border-pink-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Telegram */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-400 block uppercase">Telegram Handler</label>
                        <input
                          type="text"
                          required
                          value={editingProfile.contactInfo.telegram}
                          onChange={(e) => setEditingProfile({
                            ...editingProfile,
                            contactInfo: { ...editingProfile.contactInfo, telegram: e.target.value }
                          })}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white outline-hidden focus:border-pink-550"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-400 block uppercase">Contact Phone</label>
                        <input
                          type="text"
                          required
                          value={editingProfile.contactInfo.phone}
                          onChange={(e) => setEditingProfile({
                            ...editingProfile,
                            contactInfo: { ...editingProfile.contactInfo, phone: e.target.value }
                          })}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white outline-hidden focus:border-pink-550"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-3 border-t border-slate-805">
                      <button
                        type="button"
                        onClick={() => setEditingProfile(null)}
                        className="px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-850 rounded-xl text-slate-350 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-extrabold rounded-xl transition-all"
                      >
                        Save Updated Values
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* SUBVIEW 4: LANDING SUCCESS STORIES BOARD MODERATOR        */}
        {/* ========================================================= */}
        {activeTab === 'stories' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Story create form */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-black uppercase tracking-widest text-pink-400 flex items-center gap-1.5">
                    <Sparkles className="h-4.5 w-4.5" /> Publish Success Story
                  </h4>
                  <p className="text-[10px] text-slate-500">Feature a new happy couple on landing page</p>
                </div>

                <form onSubmit={handleCreateSuccessStory} className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400 block uppercase">Couple representation names</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mahlet & Brook"
                      value={newStoryNames}
                      onChange={(e) => setNewStoryNames(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-400 block uppercase">Couple story</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Share how Whaatachi private matchmaking helped them resolve their searches..."
                      value={newStoryText}
                      onChange={(e) => setNewStoryText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-400 block uppercase">Match Year</label>
                      <input
                        type="text"
                        required
                        value={newStoryYear}
                        onChange={(e) => setNewStoryYear(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-400 block uppercase border-slate-800">Mock Image Seed</label>
                      <select
                        value={newStoryImage}
                        onChange={(e) => setNewStoryImage(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-xl text-slate-300"
                      >
                        <option value="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80">Couple cafe</option>
                        <option value="https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?w=600&auto=format&fit=crop&q=80">Couple sunset</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-extrabold rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Publish to Public Landing
                  </button>
                </form>
              </div>

              {/* Story visual grid lists */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-805 rounded-2xl overflow-hidden shadow-xs">
                <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <FileText className="h-4.5 w-4.5 text-pink-500" /> Active Success Stories ({stories.length})
                  </h4>
                </div>

                <div className="divide-y divide-slate-800 text-xs">
                  {stories.map(story => (
                    <div key={story.id} className="p-5 flex gap-4 sm:flex-row flex-col items-start hover:bg-slate-850/20 transition-colors">
                      <img src={story.image} alt={story.coupleNames} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-800" />
                      <div className="space-y-1 pl-1 flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-black text-white text-sm">{story.coupleNames}</span>
                          <span className="text-[10px] bg-pink-500/10 text-pink-400 font-mono font-bold px-2 py-0.5 rounded-md border border-pink-900/30">MATCH YEAR: {story.year}</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed font-light">{story.story}</p>
                        
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => handleDeleteStory(story.id)}
                            className="px-2.5 py-1 text-[10px] text-rose-400 bg-rose-500/10 hover:bg-rose-550/20 border border-red-950 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" /> Remove Story
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* SUBVIEW 5: CHAT TICKETS DIRECT RESOLUTION DESK            */}
        {/* ========================================================= */}
        {activeTab === 'support' && (
          <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3 font-sans shadow-xs animate-fadeIn h-[65vh]">
            
            {/* Inbox sidebar */}
            <div className="border-r border-slate-800 flex flex-col max-h-full">
              <div className="p-4 bg-slate-950/60 border-b border-slate-800">
                <span className="text-[9px] font-bold text-slate-500 block uppercase tracking-widest mb-1">MEMBER CONCERNS</span>
                <h4 className="text-sm font-black text-white">Direct Chat Support Inbox</h4>
              </div>
              
              <div className="flex-1 overflow-y-auto divide-y divide-slate-850 scrollbar-thin">
                {mockTickets.map(ticker => (
                  <div
                    key={ticker.id}
                    onClick={() => setSelectedTicketId(ticker.id)}
                    className={`p-4 cursor-pointer transition-colors text-left space-y-1.5 ${
                      selectedTicketId === ticker.id ? 'bg-pink-950/20 shadow-inner' : 'hover:bg-slate-850/30'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-200">{ticker.username}</span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                        ticker.status === 'Open' ? 'bg-amber-400/10 text-amber-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {ticker.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate font-light leading-none">{ticker.message}</p>
                    <p className="text-[9px] text-slate-550 font-bold">{ticker.timestamp} · Sim: {ticker.senderType}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversation terminal pane */}
            <div className="md:col-span-2 flex flex-col justify-between max-h-full bg-slate-950">
              
              {/* Selected ticket details */}
              {selectedTicketId ? (
                <>
                  {(() => {
                    const ticket = mockTickets.find(t => t.id === selectedTicketId);
                    if (!ticket) return null;
                    return (
                      <>
                        {/* Conversation Header */}
                        <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex justify-between items-center shrink-0">
                          <div>
                            <h4 className="text-xs font-black text-white">{ticket.username}</h4>
                            <p className="text-[10px] text-slate-550">Contact: {ticket.phone} · Role: {ticket.senderType}</p>
                          </div>
                          <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-md border ${
                            ticket.status === 'Open' ? 'border-amber-500/20 text-amber-400' : 'border-slate-800 text-slate-500'
                          }`}>
                            TICKET STATUS: {ticket.status}
                          </span>
                        </div>

                        {/* Conversational timeline lists */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin text-xs">
                          {ticket.chatHistory.map((chat, idx) => (
                            <div 
                              key={idx} 
                              className={`flex flex-col max-w-[85%] ${
                                chat.sender === 'user' ? 'text-left mr-auto' : 'text-right ml-auto'
                              }`}
                            >
                              <span className="text-[9px] text-slate-550 font-bold mb-1">
                                {chat.sender === 'user' ? ticket.username : 'Whaatachi Admin Team'} · {chat.time}
                              </span>
                              <div className={`p-3 rounded-2xl ${
                                chat.sender === 'user' 
                                  ? 'bg-slate-905 border border-slate-800 rounded-tl-none text-slate-300' 
                                  : 'bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-tr-none font-bold shadow-xs'
                              }`}>
                                {chat.text}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Presets macro replies & Input box form */}
                        <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0 space-y-3">
                          
                          {/* Predefined replies quick triggers */}
                          <div className="flex flex-wrap gap-2 text-[10px]">
                            <button
                              onClick={() => setTicketReplyInput('Hi! Your Telebirr transaction reference has been verified and approved by the moderator. Your target contact in Hawassa represents verified matches. Check history!')}
                              className="px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                            >
                              ✓ Telebirr Verified
                            </button>
                            <button
                              onClick={() => setTicketReplyInput('Good day, your CBE Birr reference code cannot be located on our terminal logs. Please supply a screenshot of your slip or call our automated support at +251 911000000.')}
                              className="px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                            >
                              ✗ Invalid CBE Birr ID
                            </button>
                          </div>

                          <form onSubmit={handleSendTicketReply} className="flex gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Write administrative message reply as Whaatachi Moderator..."
                              value={ticketReplyInput}
                              onChange={(e) => setTicketReplyInput(e.target.value)}
                              className="w-full border border-slate-850 p-2.5 rounded-xl bg-slate-950 text-white text-xs outline-hidden focus:border-pink-500"
                            />
                            <button
                              type="submit"
                              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 font-extrabold text-white rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              Reply
                            </button>
                          </form>
                        </div>
                      </>
                    );
                  })()}
                </>
              ) : (
                <div className="m-auto text-xs text-slate-500 py-16 text-center space-y-2">
                  <MessageSquare className="h-8 w-8 text-slate-700 mx-auto animate-bounce" />
                  <p>Resolutions Inbox complete.</p>
                  <p className="text-[10px] text-slate-600">Select active ticket from column to reply.</p>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* SUBVIEW 6: PLATFORM ADMIN SETTINGS CONSOLE               */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl animate-fadeIn">
            
            {/* Dynamic Price match fee changes */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">PLATFORM CORE FEES MATRIX</h3>
                <p className="text-[10px] text-slate-550">Configure matchmaking cost parameters for the male payment gateway.</p>
              </div>

              <div className="space-y-4 text-xs">
                <p className="text-slate-400 font-light">
                  A high quality matchmaking pool is maintained with serious candidates. Change the unlock connection rates across the whole site dynamically.
                </p>

                <div className="flex bg-slate-950 border border-slate-850 rounded-2xl p-4 items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">CURRENT GLOBAL COST</span>
                    <span className="text-xl font-bold text-white tracking-widest">{matchFee} <small className="text-xs font-normal">ETB</small></span>
                  </div>
                  
                  <div className="flex gap-1">
                    {[100, 200, 300, 500].map(feeOption => (
                      <button
                        key={feeOption}
                        onClick={() => handleSaveMatchFee(feeOption)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-extrabold transition-all cursor-pointer ${
                          matchFee === feeOption 
                            ? 'bg-pink-600 border-pink-500 text-white' 
                            : 'border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white'
                        }`}
                      >
                        {feeOption} ETB
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Passcode changer */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="pb-3 border-b border-slate-805">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#00E676] flex items-center gap-1.5">
                  <Key className="h-4.5 w-4.5 text-emerald-400" />
                  GATE ACCESS PASSCODE CREDENTIALS
                </h3>
                <p className="text-[10px] text-slate-550">Update the bypassed key security passphrase</p>
              </div>

              <form onSubmit={handleUpdatePasscode} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 block uppercase">New Admin Passphrase Key</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. secureAccess99"
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-2xl text-white outline-hidden focus:border-pink-500"
                  />
                </div>

                {changeSuccess && (
                  <p className="text-[11px] text-emerald-405 font-bold flex items-center gap-1 animate-fadeIn">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Passcode updated inside browser localStorage successfully!
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-pink-650 hover:bg-pink-700 text-white font-extrabold rounded-xl cursor-pointer"
                  >
                    Save Secret Passcode
                  </button>
                </div>
              </form>
            </div>

            {/* Platform mode control options */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="pb-3 border-b border-slate-805">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">PLATFORM SYSTEM FLAGS</h3>
                <p className="text-[10px] text-slate-500">Toggle system flags that affect dating services immediately</p>
              </div>

              <div className="space-y-3 text-xs">
                
                {/* Mode toggle 1 */}
                <div className="flex items-center justify-between p-3 bg-slate-950/80 rounded-xl border border-slate-850">
                  <div>
                    <h5 className="font-bold text-slate-200">Maintenance Mode</h5>
                    <p className="text-[10px] text-slate-500">Bypasses registration processes for routine platform debugging</p>
                  </div>
                  <button
                    onClick={handleToggleMaintenance}
                    className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${
                      maintenanceMode 
                        ? 'bg-amber-400 text-slate-950' 
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {maintenanceMode ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                {/* Mode toggle 2 */}
                <div className="flex items-center justify-between p-3 bg-slate-950/80 rounded-xl border border-slate-850">
                  <div>
                    <h5 className="font-bold text-slate-200">Simulate Female Premium Free-reveal Mode</h5>
                    <p className="text-[10px] text-slate-500">Allows female members to reveal compatible male counts instantly</p>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold text-[9px]">
                    ALWAYS ON
                  </span>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
