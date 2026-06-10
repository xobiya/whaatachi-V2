import React, { useState, useMemo, useEffect } from 'react';
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auto-select first pending payment when payments tab opens
  useEffect(() => {
    if (activeTab === 'payments') {
      const pending = allPayments.find(p => p.status === 'Pending');
      if (pending) {
        setSelectedRequest(pending);
      } else if (allPayments.length > 0) {
        setSelectedRequest(allPayments[0]);
      }
    }
  }, [activeTab]);
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
  const [newProfileInstagram, setNewProfileInstagram] = useState('');
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
        instagram: newProfileInstagram.trim().startsWith('@') ? newProfileInstagram.trim() : `@${newProfileInstagram.trim()}`,
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
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse';
    }
  };

  // Auth gate check
  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-br from-[#0A0A0F] via-[#0F0F1A] to-[#1A0A0F] min-h-screen text-slate-100 flex flex-col justify-center items-center px-4 relative overflow-hidden" id="admin-security-gate">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.08)_0%,transparent_60%)]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[150px]" />
        
        <div className="relative z-10 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-2xl shadow-pink-500/20 mb-5">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Access</h1>
            <p className="text-sm text-slate-400 mt-1">Enter your passcode to continue</p>
          </div>

          <div className="bg-[#14141F]/80 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-xl">
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Passcode</label>
                <div className="relative">
                  <input
                    type={showPasscode ? 'text' : 'password'}
                    required
                    placeholder="Enter passcode"
                    value={passcode}
                    onChange={(e) => { setPasscode(e.target.value); setError(null); }}
                    className="w-full bg-slate-900/50 border border-slate-700/50 focus:border-pink-500 rounded-xl px-4 pr-11 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors"
                  />
                  <button type="button" onClick={() => setShowPasscode(!showPasscode)} className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
                    {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {error && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                    {error}
                  </p>
                )}
              </div>
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold rounded-xl transition-all cursor-pointer text-sm shadow-lg shadow-pink-500/10">
                Sign In
              </button>
            </form>
          </div>

          <div className="mt-4 bg-[#14141F]/50 backdrop-blur-xl border border-slate-800/30 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Key className="h-3 w-3 text-amber-400" /> Demo passcode:
              </span>
              <span className="font-mono text-pink-400 font-bold tracking-wider bg-pink-500/5 px-2 py-0.5 rounded-md text-[11px]">admin123</span>
            </div>
          </div>

          <button onClick={() => setCurrentView(isLoggedIn ? 'dashboard' : 'home')} className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition-colors mx-auto block cursor-pointer">
            ← Back to app
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col lg:flex-row font-sans" id="admin-workspace">
      
      {/* ========================================================= */}
      {/* 1. LEFT ADMIN SIDEBAR PANEL                               */}
      {/* ========================================================= */}
      
      {/* Mobile Header bar */}
      <div className="lg:hidden bg-[#0F0F1A] border-b border-gray-800 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-pink-600 to-rose-500 p-1.5 rounded-lg text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="font-extrabold tracking-tight text-white shrink-0 text-sm">Whaatachi Control Panel</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 bg-gray-800 rounded-lg text-gray-400 border border-gray-700 hover:text-white hover:bg-gray-700 cursor-pointer"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Actual Sidebar responsive shell */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}
        fixed lg:static top-0 bottom-0 left-0 z-40 bg-[#0F0F1A] border-r border-gray-800 flex flex-col shrink-0 transition-all duration-300 ease-in-out
      `}>
        
        {/* Admin Brand Logo Wrapper */}
        <div className={`border-b border-gray-800 flex items-center ${sidebarCollapsed ? 'p-3 justify-center' : 'p-4 justify-between'}`}>
          {sidebarCollapsed ? (
            <div className="bg-gradient-to-tr from-pink-600 to-rose-500 p-2 rounded-xl text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2.5">
                <div className="bg-gradient-to-tr from-pink-600 to-rose-500 p-2 rounded-xl text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-black text-[15px] tracking-tight text-white block">Whaatachi B2B</span>
                  <span className="text-[9px] font-bold text-pink-400 tracking-wider block uppercase">Control Suite v1.2</span>
                </div>
              </div>
            </>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:block p-1 bg-gray-800 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 cursor-pointer"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight className={`h-3.5 w-3.5 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 bg-gray-800 rounded-md text-gray-400 hover:text-white cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Navigation Tab selection lists */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-2">
          {!sidebarCollapsed && (
            <div className="px-4 mb-1">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">MANAGEMENT</span>
            </div>
          )}
          
          <div className="space-y-0.5 px-2">
            {/* Dashboard tab */}
            <button
              onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                sidebarCollapsed ? 'justify-center' : 'justify-between'
              } ${
                activeTab === 'dashboard' 
                  ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-xs' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
              title={sidebarCollapsed ? 'Dashboard' : ''}
            >
              <span className="flex items-center gap-2.5">
                <LayoutDashboard className="h-4.5 w-4.5 shrink-0" />
                {!sidebarCollapsed && <span>Metrics Overview</span>}
              </span>
              {!sidebarCollapsed && activeTab !== 'dashboard' && <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />}
            </button>

            {/* Payments verifications tab */}
            <button
              onClick={() => { setActiveTab('payments'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                sidebarCollapsed ? 'justify-center' : 'justify-between'
              } ${
                activeTab === 'payments' 
                  ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-xs' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
              title={sidebarCollapsed ? 'Payments' : ''}
            >
              <span className="flex items-center gap-2.5">
                <Smartphone className="h-4.5 w-4.5 shrink-0" />
                {!sidebarCollapsed && <span>Receipt Queue</span>}
              </span>
              {!sidebarCollapsed && pendingCount > 0 ? (
                <span className="bg-amber-400 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black animate-pulse shrink-0">
                  {pendingCount}
                </span>
              ) : !sidebarCollapsed ? null : null}
            </button>

            {/* Profiles matches manager tab */}
            <button
              onClick={() => { setActiveTab('members'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                sidebarCollapsed ? 'justify-center' : 'justify-between'
              } ${
                activeTab === 'members' 
                  ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-xs' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
              title={sidebarCollapsed ? 'Members' : ''}
            >
              <span className="flex items-center gap-2.5">
                <Users className="h-4.5 w-4.5 shrink-0" />
                {!sidebarCollapsed && <span>Member Candidates</span>}
              </span>
              {!sidebarCollapsed && (
                <span className="bg-gray-700 text-gray-300 text-[10px] px-1.5 py-0.5 rounded-md font-semibold shrink-0">
                  {profiles.length}
                </span>
              )}
            </button>

            {/* Success Stories moderator tab */}
            <button
              onClick={() => { setActiveTab('stories'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                sidebarCollapsed ? 'justify-center' : 'justify-between'
              } ${
                activeTab === 'stories' 
                  ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-xs' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
              title={sidebarCollapsed ? 'Stories' : ''}
            >
              <span className="flex items-center gap-2.5">
                <Sparkles className="h-4.5 w-4.5 shrink-0" />
                {!sidebarCollapsed && <span>Success Stories</span>}
              </span>
              {!sidebarCollapsed && activeTab !== 'stories' && <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />}
            </button>

            {/* Resolution Desk support tab */}
            <button
              onClick={() => { setActiveTab('support'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                sidebarCollapsed ? 'justify-center' : 'justify-between'
              } ${
                activeTab === 'support' 
                  ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-xs' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
              title={sidebarCollapsed ? 'Support' : ''}
            >
              <span className="flex items-center gap-2.5">
                <MessageSquare className="h-4.5 w-4.5 shrink-0" />
                {!sidebarCollapsed && <span>Help Desk</span>}
              </span>
              {!sidebarCollapsed && activeTab !== 'support' && <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />}
            </button>
          </div>

          {!sidebarCollapsed && (
            <div className="px-4 mt-4 mb-1">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">SYSTEM</span>
            </div>
          )}

          <div className="space-y-0.5 px-2">
            {/* Config Settings tab */}
            <button
              onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                sidebarCollapsed ? 'justify-center' : 'justify-between'
              } ${
                activeTab === 'settings' 
                  ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-xs' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
              title={sidebarCollapsed ? 'Settings' : ''}
            >
              <span className="flex items-center gap-2.5">
                <Sliders className="h-4.5 w-4.5 shrink-0" />
                {!sidebarCollapsed && <span>Platform Settings</span>}
              </span>
              {!sidebarCollapsed && activeTab !== 'settings' && <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />}
            </button>
          </div>
        </nav>

        {/* Sidebar Footer lock back links */}
        <div className="p-3 border-t border-gray-800 space-y-2">
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} p-2 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors cursor-pointer`}
            title={sidebarCollapsed ? 'Toggle theme' : ''}
          >
            {sidebarCollapsed ? (
              <span className="text-[10px] font-mono text-pink-400">D</span>
            ) : (
              <>
                <span>Theme</span>
                <span className="px-2 py-0.5 rounded-md bg-gray-800 font-mono text-[10px] text-pink-400 border border-gray-700">
                  {darkMode ? 'DARK' : 'LIGHT'}
                </span>
              </>
            )}
          </button>

          <button
            onClick={handleAdminLogout}
            className={`w-full py-2.5 rounded-lg bg-gray-800/60 border border-gray-700 hover:bg-red-900/30 hover:border-red-800/50 text-red-400 text-xs font-extrabold flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-center gap-2'} cursor-pointer transition-all`}
            title={sidebarCollapsed ? 'Lock Session' : ''}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span>Lock Session</span>}
          </button>
        </div>

      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN HUB WORKSPACE CONTENT                             */}
      {/* ========================================================= */}
      <main className="flex-1 overflow-y-auto max-h-screen p-4 sm:p-8" id="admin-hub-workspace">
        
        {/* TOP STATUS NAVIGATION BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-200 mb-6">
          <div>
            <span className="text-[10px] font-extrabold text-pink-500 uppercase tracking-widest block">ADMIN PLATFORM CONTROL</span>
            <h2 className="text-2xl font-black text-gray-900 capitalize flex items-center gap-2.5">
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
            <span className="text-xs text-gray-400 font-light hidden sm:inline">Active Token: <strong className="font-mono text-emerald-600 uppercase">admin-secured</strong></span>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
            <button
              onClick={() => {
                setCurrentView(isLoggedIn ? 'dashboard' : 'home');
              }}
              className="px-3 py-1.5 rounded-lg bg-pink-50 border border-pink-200 text-pink-600 text-xs font-bold hover:bg-pink-100 transition-all cursor-pointer"
            >
              Public App View
            </button>
          </div>
        </div>

        {/* METRICS & WARNING BANNER */}
        {maintenanceMode && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-700 text-xs flex items-center gap-3 animate-fadeIn">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
            <div>
              <p className="font-extrabold text-amber-800">MAINTENANCE SYSTEM LOCKOUT ACTIVE</p>
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
              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Audited Platform Revenue</p>
                  <h3 className="text-3xl font-black text-gray-900">{revenueSum} <span className="text-xs font-semibold text-gray-500">ETB</span></h3>
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-2">
                    <TrendingUp className="h-3.5 w-3.5" /> 100% Valid transfers
                  </p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl border border-emerald-200">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>

              {/* Card 2: Pending verifications */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Pending Slip Verifications</p>
                  <h3 className="text-3xl font-black text-gray-900">{pendingCount} <span className="text-xs font-semibold text-gray-500">slips</span></h3>
                  <p className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5 mt-2 animate-pulse">
                    <Clock className="h-3.5 w-3.5" /> Review SLA 11m
                  </p>
                </div>
                <div className="bg-amber-50 text-amber-600 p-3 rounded-xl border border-amber-200">
                  <Clock className="h-6 w-6" />
                </div>
              </div>

              {/* Card 3: Member count details */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Matchmaking Candidates</p>
                  <h3 className="text-3xl font-black text-gray-900">{profiles.length} <span className="text-xs font-semibold text-gray-500">singles</span></h3>
                  <p className="text-[10px] text-pink-600 font-bold flex items-center gap-0.5 mt-2">
                    <Heart className="h-3.5 w-3.5 fill-pink-500 text-pink-500" /> Active pool
                  </p>
                </div>
                <div className="bg-pink-50 text-pink-600 p-3 rounded-xl border border-pink-200">
                  <Users className="h-6 w-6" />
                </div>
              </div>

              {/* Card 4: Base connections fee */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Standard Connections Rate</p>
                  <h3 className="text-3xl font-black text-gray-900">{matchFee} <span className="text-xs font-semibold text-gray-500">ETB</span></h3>
                  <p className="text-[10px] text-blue-600 font-bold flex items-center gap-0.5 mt-2">
                    <Settings className="h-3.5 w-3.5" /> Managed dynamically
                  </p>
                </div>
                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl border border-blue-200">
                  <Sliders className="h-6 w-6" />
                </div>
              </div>

            </div>

            {/* Premium Custom SVG Charts & Graphics Representation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Analytics Chart Graphic (SVG bar charts of Regional growth in major cities) */}
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Demographic Distribution</h4>
                    <p className="text-[10px] text-gray-400 font-medium">Breakdown of dating registrations in metropolitan Ethiopian hubs</p>
                  </div>
                  <span className="text-[10px] bg-gray-100 px-2 py-0.5 border border-gray-200 text-pink-600 rounded-md font-mono">LIVE UPDATE</span>
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
                      <div className="flex justify-between text-xs font-bold text-gray-600">
                        <span>{cityStat.city}</span>
                        <span>{cityStat.count.toLocaleString()} candidates ({cityStat.percent}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-200">
                        <div className={`${cityStat.color} h-full rounded-full`} style={{ width: `${cityStat.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick informational footer of SVG indicators */}
                <div className="pt-4 flex gap-4 text-[10px] text-gray-500 border-t border-gray-200 justify-center">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-pink-500" /> Female registrants ({femalePremiumCount})
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Verified serial gentlemen ({malePremiumCount})
                  </div>
                </div>

              </div>

              {/* Right Column: Matched Tickets Ticker & Feed */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col space-y-4">
                <div className="pb-2 border-b border-gray-200">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Match Events Ticker</h4>
                  <p className="text-[10px] text-gray-400 font-medium">Real-time simulator activity matches</p>
                </div>

                <div className="space-y-4 divide-y divide-gray-100 flex-1 overflow-y-auto max-h-[280px] scrollbar-none pr-1">
                  {[
                    { id: 1, text: 'Mihret (F) initiated a direct chat help resolution ticket.', time: '10 mins ago', type: 'ticket' },
                    { id: 2, text: 'Abel (M) submitted transaction FT2401120015 for review.', time: '15 mins ago', type: 'payment' },
                    { id: 3, text: 'Sam Hob (M) unlocked Bethel Elias direct telegram access.', time: '1 hour ago', type: 'match' },
                    { id: 4, text: 'Kidist Hailu (F) gained instantly free contact verified reveal.', time: '2 hours ago', type: 'female_free' },
                    { id: 5, text: 'Yosef (M) updated Telegram contact digits of Addis.', time: '5 hours ago', type: 'profile' }
                  ].map((tickerItem) => (
                    <div key={tickerItem.id} className="pt-3 first:pt-0 flex items-start gap-2 text-xs font-light text-gray-500">
                      <div className="mt-0.5">
                        {tickerItem.type === 'ticket' && <MessageSquare className="h-3 w-3 text-blue-500" />}
                        {tickerItem.type === 'payment' && <Smartphone className="h-3 w-3 text-amber-500 font-bold" />}
                        {tickerItem.type === 'match' && <Heart className="h-3 w-3 text-pink-500" />}
                        {tickerItem.type === 'female_free' && <Sparkles className="h-3 w-3 text-emerald-500" />}
                        {tickerItem.type === 'profile' && <Users className="h-3 w-3 text-gray-400" />}
                      </div>
                      <div className="space-y-0.5">
                        <p className="leading-relaxed">{tickerItem.text}</p>
                        <span className="text-[9px] text-gray-400 font-bold">{tickerItem.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

            {/* Quick Action Simulator Tools */}
            <div className="bg-white border border-gray-200 p-5 rounded-2xl space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-600 flex items-center gap-1.5">
                  <Sliders className="h-4.5 w-4.5 text-pink-500" /> Quick Seed & Database Commands
                </h4>
                <p className="text-[10px] text-gray-400">Inject preset mock parameters to test various app pathways instantly</p>
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
                      contactInfo: { phone: '0900112233', telegram: '@zene_abera', instagram: '@zenebech', email: 'zenebech@whaatachi.com' }
                    };
                    setProfiles(prev => [sample, ...prev]);
                    alert('Simulated FEMALE candidate injected! Verify discover match feed.');
                  }}
                  className="px-4 py-2.5 bg-gray-50 border border-gray-200 hover:border-pink-300 text-gray-600 hover:text-gray-900 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all text-center justify-center cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-pink-500" />
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
                      contactInfo: { phone: '0933445566', telegram: '@brook_shif', instagram: '@brook_shif', email: 'brook@whaatachi.com' }
                    };
                    setProfiles(prev => [sample, ...prev]);
                    alert('Simulated MALE candidate injected! Verify discover list.');
                  }}
                  className="px-4 py-2.5 bg-gray-50 border border-gray-200 hover:border-blue-300 text-gray-600 hover:text-gray-900 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all text-center justify-center cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-blue-500" />
                  Seed Male Member
                </button>

                {/* Mock submission */}
                <button
                  onClick={() => {
                    const randTx = `RE${Math.floor(Math.random() * 9000000) + 1000000}`;
                    const methods = ['Telebirr', 'CBE Birr'] as const;
                    const method = methods[Math.floor(Math.random() * methods.length)];
                    const customReq: PaymentRequest = {
                      id: `t-pay-${Date.now()}`,
                      profileId: 'p5',
                      profileName: 'Helen Gebru',
                      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
                      senderName: 'Lomi Teklu',
                      senderPhone: '0988000444',
                      transactionId: randTx,
                      method,
                      amount: matchFee,
                      timestamp: 'Just now',
                      status: 'Pending',
                      receiptImage: method === 'Telebirr'
                        ? 'https://placehold.co/400x600/fef3c7/92400e?text=Telebirr+Receipt'
                        : 'https://placehold.co/400x600/e0e7ff/3730a3?text=CBE+Birr+Receipt'
                    };
                    setAllPayments(prev => [customReq, ...prev]);
                    alert(`Simulated ${method} payment ${randTx} submitted. Check Receipt tab queue!`);
                  }}
                  className="px-4 py-2.5 bg-gray-50 border border-gray-200 hover:border-amber-300 text-gray-600 hover:text-gray-900 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all text-center justify-center cursor-pointer"
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
                  className="px-4 py-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-red-300 text-gray-500 hover:text-red-500 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all text-center justify-center cursor-pointer"
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
            
            <div className="bg-white border border-gray-200 p-4 rounded-2xl text-xs text-gray-600">
              <p className="font-extrabold text-pink-600 flex items-center gap-1 mb-1">
                <AlertTriangle className="h-4 w-4" /> MODERATION POLICIES
              </p>
              Match verification requests must match the official Telebirr or CBE Birr reference. Inspect reference ID, Sender Name, and payment methods. Tap <strong>Verify & Approve</strong> to unlock the Telegram access immediately on their screens.
            </div>

            {/* Payment Receipt Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <Smartphone className="h-4.5 w-4.5 text-pink-500" />
                  Payment Queue ({allPayments.length})
                </h4>
              </div>

              {allPayments.length > 0 ? (
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 border-b border-gray-200">
                        <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Receipt</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Depositor</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Match</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Tx ID</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Amount</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Status</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-600">
                      {allPayments.map((payment) => (
                        <tr
                          key={payment.id}
                          className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                            selectedRequest?.id === payment.id ? 'bg-pink-50' : ''
                          }`}
                          onClick={() => setSelectedRequest(payment)}
                        >
                          <td className="p-3" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedRequest(payment)}
                              className="w-10 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 hover:border-pink-300 transition-colors shrink-0 block"
                            >
                              <img
                                src={payment.receiptImage || 'https://placehold.co/80x96/f5f5f5/ccc?text=N/A'}
                                alt="Receipt"
                                className="w-full h-full object-cover"
                              />
                            </button>
                          </td>
                          <td className="p-3">
                            <p className="font-extrabold text-gray-900">{payment.senderName}</p>
                            <p className="text-[10px] text-gray-400">{payment.senderPhone}</p>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <img src={payment.profileImage} alt={payment.profileName} className="w-6 h-6 rounded-full object-cover shrink-0" />
                              <span className="truncate max-w-[80px] sm:max-w-none text-gray-600">{payment.profileName}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-sm text-[9px] font-extrabold uppercase ${
                              payment.method === 'Telebirr' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                            }`}>
                              {payment.method}
                            </span>
                            <p className="font-mono text-[9px] text-gray-400 uppercase mt-1">{payment.transactionId}</p>
                          </td>
                          <td className="p-3 font-extrabold text-gray-900">
                            {payment.amount} ETB
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(payment.status)}`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                            {payment.status === 'Pending' ? (
                              <div className="flex gap-1.5 justify-end">
                                <button
                                  onClick={() => onApprove(payment.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all shadow-xs flex items-center gap-1"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => onReject(payment.id)}
                                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all shadow-xs flex items-center gap-1"
                                >
                                  <X className="h-3.5 w-3.5" />
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className={`text-[10px] font-bold uppercase ${
                                payment.status === 'Approved' ? 'text-emerald-600' : 'text-red-400'
                              }`}>
                                {payment.status === 'Approved' ? 'Verified' : 'Flagged'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-16 text-center text-xs text-gray-400 space-y-2">
                  <Smartphone className="h-8 w-8 text-gray-300 mx-auto" />
                  <p>No active transactions submitted yet inside mock environment.</p>
                </div>
              )}
            </div>

            {/* Receipt Detail Modal */}
            {selectedRequest && (
              <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs" onClick={() => setSelectedRequest(null)}></div>
                <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin animate-fadeIn">
                  
                  {/* Modal header */}
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-tr from-pink-600 to-rose-500 p-2 rounded-xl text-white">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-black text-base text-gray-900">Receipt Verification</h3>
                        <p className="text-[10px] text-gray-400 font-medium">Transaction #{selectedRequest.transactionId}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="p-1.5 bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Left: Receipt Image */}
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Uploaded Receipt</p>
                      <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
                        {selectedRequest.receiptImage ? (
                          <img
                            src={selectedRequest.receiptImage}
                            alt="Payment Receipt"
                            className="w-full h-auto max-h-[400px] object-contain bg-white"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                            <Smartphone className="h-12 w-12 mb-2" />
                            <p className="text-xs font-medium">No receipt image uploaded</p>
                            <p className="text-[10px]">User submitted without screenshot</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Transaction Details */}
                    <div className="space-y-5">
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Transaction Details</p>
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-bold uppercase text-[10px]">Reference</span>
                            <span className="font-mono font-bold text-gray-900">{selectedRequest.transactionId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-bold uppercase text-[10px]">Method</span>
                            <span className={`font-extrabold uppercase ${
                              selectedRequest.method === 'Telebirr' ? 'text-blue-600' : 'text-purple-600'
                            }`}>{selectedRequest.method}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-bold uppercase text-[10px]">Amount</span>
                            <span className="font-extrabold text-emerald-700">{selectedRequest.amount}.00 ETB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-bold uppercase text-[10px]">Status</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(selectedRequest.status)}`}>
                              {selectedRequest.status}
                            </span>
                          </div>
                          <div className="border-t border-gray-200 pt-2 mt-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400 font-bold uppercase text-[10px]">Timestamp</span>
                              <span className="text-gray-500">{selectedRequest.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Sender Info</p>
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-bold uppercase text-[10px]">Name</span>
                            <span className="font-bold text-gray-900">{selectedRequest.senderName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-bold uppercase text-[10px]">Phone</span>
                            <span className="text-gray-600">{selectedRequest.senderPhone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-bold uppercase text-[10px]">Target</span>
                            <span className="text-gray-600">{selectedRequest.profileName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Approve / Reject Actions */}
                      {selectedRequest.status === 'Pending' && (
                        <div className="space-y-2 pt-2">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Moderation Action</p>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => {
                                onApprove(selectedRequest.id);
                                setSelectedRequest(null);
                              }}
                              className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve & Verify
                            </button>
                            <button
                              onClick={() => {
                                onReject(selectedRequest.id);
                                setSelectedRequest(null);
                              }}
                              className="py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-2"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject & Flag
                            </button>
                          </div>
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[10px] text-amber-700 flex items-start gap-2 mt-3">
                            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                            <span>Verify the receipt image matches the transaction reference before approving. This action cannot be undone.</span>
                          </div>
                        </div>
                      )}

                      {selectedRequest.status !== 'Pending' && (
                        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
                          selectedRequest.status === 'Approved'
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                            : 'bg-red-50 border border-red-200 text-red-600'
                        }`}>
                          {selectedRequest.status === 'Approved' ? (
                            <><CheckCircle className="h-5 w-5" /> This payment has been verified and approved</>
                          ) : (
                            <><XCircle className="h-5 w-5" /> This payment has been rejected and flagged</>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* SUBVIEW 3: MANAGE MEMBER PROFILES (CRUD MATCH POOL)     */}
        {/* ========================================================= */}
        {activeTab === 'members' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header filters bar */}
            <div className="bg-white border border-gray-200 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search box */}
              <div className="relative w-full md:max-w-xs text-gray-400">
                <Search className="absolute left-3 top-2.5 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search single candidate or tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-hidden focus:border-pink-500"
                />
              </div>

              {/* Selection Filters */}
              <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                
                {/* Gender filter */}
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value as any)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-500 outline-hidden"
                >
                  <option value="All">All Genders</option>
                  <option value="Male">♂ Males</option>
                  <option value="Female">♀ Females</option>
                </select>

                {/* City filter */}
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-500 outline-hidden"
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
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-500 outline-hidden"
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
                <div key={profile.id} className="bg-white border border-gray-200 rounded-3xl p-5 space-y-4 flex flex-col justify-between shadow-sm hover:border-gray-300 transition-all">
                  
                  {/* Top user bar info */}
                  <div className="flex gap-4 items-start">
                    <img src={profile.image} alt={profile.name} className="w-14 h-14 rounded-full object-cover shrink-0 border border-gray-200" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-gray-900">{profile.name}</span>
                        {profile.verified && <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 fill-emerald-500/10" />}
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">{profile.age} years old · {profile.city}</p>
                      
                      <div className="flex gap-2 mt-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          profile.gender === 'Male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'
                        }`}>
                          {profile.gender}
                        </span>
                        <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-[9px] font-bold truncate max-w-[125px]">
                          {profile.relationshipIntent}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio brief */}
                  <p className="text-xs text-gray-500 line-clamp-2 font-light">{profile.bio}</p>

                  {/* Direct Contact info sensitive tags */}
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl space-y-1 font-mono text-[10px]">
                    <p className="text-gray-400 font-bold uppercase tracking-wider text-[8px]">DISCLOSED ACCESS MATRIX:</p>
                    <p>Telegram: <span className="text-pink-600 font-extrabold select-all">{profile.contactInfo.telegram}</span></p>
                    <p>Phone: <span className="text-gray-700 font-bold select-all">{profile.contactInfo.phone}</span></p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 justify-end pt-1 border-t border-gray-100">
                    <button
                      onClick={() => handleToggleProfileVerification(profile.id)}
                      className="px-2.5 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-500 text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer"
                      title="Toggle verified badge status"
                    >
                      {profile.verified ? 'Unverify' : 'Verify Match'}
                    </button>
                    <button
                      onClick={() => setEditingProfile(profile)}
                      className="px-2.5 py-1.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-pink-300 text-pink-600 text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="h-3 w-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProfile(profile.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer"
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
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs" onClick={() => setIsCreatingProfile(false)}></div>
                <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative z-10 scale-in shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <h3 className="font-extrabold text-base text-gray-900">Createverified Match Candidate</h3>
                    <button onClick={() => setIsCreatingProfile(false)} className="text-gray-400 hover:text-gray-600 p-1"><X className="h-5 w-5" /></button>
                  </div>

                  <form onSubmit={handleCreateNewProfile} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="font-bold text-gray-500 block uppercase">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mahlet Desalegn"
                          value={newProfileName}
                          onChange={(e) => setNewProfileName(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-900 text-xs outline-hidden focus:border-pink-500"
                        />
                      </div>

                      {/* Age */}
                      <div className="space-y-1">
                        <label className="font-bold text-gray-500 block uppercase">Age</label>
                        <input
                          type="number"
                          required
                          min={18}
                          max={99}
                          value={newProfileAge}
                          onChange={(e) => setNewProfileAge(Number(e.target.value))}
                          className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-900 text-xs outline-hidden focus:border-pink-500"
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Gender selection */}
                      <div className="space-y-1 font-bold text-gray-500 block">
                        <label className="uppercase">Candidate Gender</label>
                        <select
                          value={newProfileGender}
                          onChange={(e) => setNewProfileGender(e.target.value as any)}
                          className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-600 outline-hidden"
                        >
                          <option value="Female">Female candidate</option>
                          <option value="Male">Male candidate</option>
                        </select>
                      </div>

                      {/* City */}
                      <div className="space-y-1 font-bold text-gray-500 block">
                        <label className="uppercase">Ethiopian City</label>
                        <select
                          value={newProfileCity}
                          onChange={(e) => setNewProfileCity(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-600 outline-hidden"
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
                      <label className="font-bold text-gray-500 block uppercase">Bio statement</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Write dynamic candidate introduction description..."
                        value={newProfileBio}
                        onChange={(e) => setNewProfileBio(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-900 text-xs outline-hidden focus:border-pink-500"
                      />
                    </div>

                    {/* Image URL with standard defaults */}
                    <div className="space-y-1">
                      <label className="font-bold text-gray-500 block uppercase">Photo URL</label>
                      <input
                        type="text"
                        placeholder="Paste image link manually, or use sample"
                        value={newProfileImage}
                        onChange={(e) => setNewProfileImage(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-900 text-xs font-mono outline-hidden focus:border-pink-500"
                      />
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setNewProfileImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80')}
                          className="px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-[9px] hover:text-gray-900"
                        >
                          Unsplash Female
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewProfileImage('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80')}
                          className="px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-[9px] hover:text-gray-900"
                        >
                          Unsplash Male
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Telegram handle */}
                      <div className="space-y-1">
                        <label className="font-bold text-gray-500 block uppercase">Telegram Handle (Required)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. @mahlet_des"
                          value={newProfileTelegram}
                          onChange={(e) => setNewProfileTelegram(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-900 text-xs outline-hidden focus:border-pink-500"
                        />
                      </div>

                      {/* Phone handle */}
                      <div className="space-y-1">
                        <label className="font-bold text-gray-500 block uppercase">Phone Number</label>
                        <input
                          type="text"
                          placeholder="e.g. +251 912 345 678"
                          value={newProfilePhone}
                          onChange={(e) => setNewProfilePhone(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-900 text-xs outline-hidden focus:border-pink-500"
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Intent selector */}
                      <div className="space-y-1 block font-bold text-gray-500 block">
                        <label className="uppercase">Relationship Intent</label>
                        <select
                          value={newProfileIntent}
                          onChange={(e) => setNewProfileIntent(e.target.value as any)}
                          className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-600 outline-hidden"
                        >
                          <option value="True Relationship">True Relationship</option>
                          <option value="Friendship">Friendship</option>
                          <option value="Friends with Benefits">Friends with Benefits</option>
                        </select>
                      </div>

                      {/* Interests */}
                      <div className="space-y-1">
                        <label className="font-bold text-gray-500 block uppercase">Interests (Comma separated)</label>
                        <input
                          type="text"
                          placeholder="e.g., Macchiato, Yoga, History"
                          value={newProfileInterests}
                          onChange={(e) => setNewProfileInterests(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-900 text-xs outline-hidden focus:border-pink-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-3 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setIsCreatingProfile(false)}
                        className="px-4 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-xl text-gray-600 transition-colors"
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
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs" onClick={() => setEditingProfile(null)}></div>
                <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative z-10 scale-in shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <h3 className="font-extrabold text-base text-gray-900">Modify Candidate Profile: {editingProfile.name}</h3>
                    <button onClick={() => setEditingProfile(null)} className="text-gray-400 hover:text-gray-600 p-1"><X className="h-5 w-5" /></button>
                  </div>

                  <form onSubmit={handleSaveEditedProfile} className="space-y-4 text-xs">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="font-bold text-gray-500 block uppercase">Name</label>
                        <input
                          type="text"
                          required
                          value={editingProfile.name}
                          onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-900 outline-hidden focus:border-pink-500"
                        />
                      </div>

                      {/* Age */}
                      <div className="space-y-1">
                        <label className="font-bold text-gray-500 block uppercase">Age</label>
                        <input
                          type="number"
                          required
                          value={editingProfile.age}
                          onChange={(e) => setEditingProfile({ ...editingProfile, age: Number(e.target.value) })}
                          className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-900 outline-hidden focus:border-pink-500"
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* City */}
                      <div className="space-y-1 block font-bold text-gray-500">
                        <label className="uppercase">City</label>
                        <select
                          value={editingProfile.city}
                          onChange={(e) => setEditingProfile({ ...editingProfile, city: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-600 outline-hidden"
                        >
                          <option value="Addis Ababa">Addis Ababa</option>
                          <option value="Hawassa">Hawassa</option>
                          <option value="Adama">Adama</option>
                          <option value="Gondar">Gondar</option>
                          <option value="Bahir Dar">Bahir Dar</option>
                        </select>
                      </div>

                      {/* Intent */}
                      <div className="space-y-1 block font-bold text-gray-500">
                        <label className="uppercase">Relationship Intent</label>
                        <select
                          value={editingProfile.relationshipIntent}
                          onChange={(e) => setEditingProfile({ ...editingProfile, relationshipIntent: e.target.value as any })}
                          className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-600 outline-hidden"
                        >
                          <option value="True Relationship">True Relationship</option>
                          <option value="Friendship">Friendship</option>
                          <option value="Friends with Benefits">Friends with Benefits</option>
                        </select>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-1">
                      <label className="font-bold text-gray-500 block uppercase">Bio</label>
                      <textarea
                        rows={3}
                        required
                        value={editingProfile.bio}
                        onChange={(e) => setEditingProfile({ ...editingProfile, bio: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-900 outline-hidden focus:border-pink-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Telegram */}
                      <div className="space-y-1">
                        <label className="font-bold text-gray-500 block uppercase">Telegram Handler</label>
                        <input
                          type="text"
                          required
                          value={editingProfile.contactInfo.telegram}
                          onChange={(e) => setEditingProfile({
                            ...editingProfile,
                            contactInfo: { ...editingProfile.contactInfo, telegram: e.target.value }
                          })}
                          className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-900 outline-hidden focus:border-pink-500"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <label className="font-bold text-gray-500 block uppercase">Contact Phone</label>
                        <input
                          type="text"
                          required
                          value={editingProfile.contactInfo.phone}
                          onChange={(e) => setEditingProfile({
                            ...editingProfile,
                            contactInfo: { ...editingProfile.contactInfo, phone: e.target.value }
                          })}
                          className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-900 outline-hidden focus:border-pink-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-3 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setEditingProfile(null)}
                        className="px-4 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-xl text-gray-600 transition-colors"
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
              <div className="bg-white border border-gray-200 p-5 rounded-2xl space-y-4">
                <div className="pb-3 border-b border-gray-200">
                  <h4 className="text-xs font-black uppercase tracking-widest text-pink-600 flex items-center gap-1.5">
                    <Sparkles className="h-4.5 w-4.5" /> Publish Success Story
                  </h4>
                  <p className="text-[10px] text-gray-400">Feature a new happy couple on landing page</p>
                </div>

                <form onSubmit={handleCreateSuccessStory} className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500 block uppercase">Couple representation names</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mahlet & Brook"
                      value={newStoryNames}
                      onChange={(e) => setNewStoryNames(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-500 block uppercase">Couple story</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Share how Whaatachi private matchmaking helped them resolve their searches..."
                      value={newStoryText}
                      onChange={(e) => setNewStoryText(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-900 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-500 block uppercase">Match Year</label>
                      <input
                        type="text"
                        required
                        value={newStoryYear}
                        onChange={(e) => setNewStoryYear(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-gray-500 block uppercase border-gray-200">Mock Image Seed</label>
                      <select
                        value={newStoryImage}
                        onChange={(e) => setNewStoryImage(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-600"
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
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                    <FileText className="h-4.5 w-4.5 text-pink-500" /> Active Success Stories ({stories.length})
                  </h4>
                </div>

                <div className="divide-y divide-gray-100 text-xs">
                  {stories.map(story => (
                    <div key={story.id} className="p-5 flex gap-4 sm:flex-row flex-col items-start hover:bg-gray-50 transition-colors">
                      <img src={story.image} alt={story.coupleNames} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-gray-200" />
                      <div className="space-y-1 pl-1 flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-black text-gray-900 text-sm">{story.coupleNames}</span>
                          <span className="text-[10px] bg-pink-50 text-pink-600 font-mono font-bold px-2 py-0.5 rounded-md border border-pink-200">MATCH YEAR: {story.year}</span>
                        </div>
                        <p className="text-gray-500 leading-relaxed font-light">{story.story}</p>
                        
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => handleDeleteStory(story.id)}
                            className="px-2.5 py-1 text-[10px] text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center gap-1 cursor-pointer"
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
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3 font-sans shadow-sm animate-fadeIn h-[65vh]">
            
            {/* Inbox sidebar */}
            <div className="border-r border-gray-200 flex flex-col max-h-full">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <span className="text-[9px] font-bold text-gray-500 block uppercase tracking-widest mb-1">MEMBER CONCERNS</span>
                <h4 className="text-sm font-black text-gray-900">Direct Chat Support Inbox</h4>
              </div>
              
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100 scrollbar-thin">
                {mockTickets.map(ticker => (
                  <div
                    key={ticker.id}
                    onClick={() => setSelectedTicketId(ticker.id)}
                    className={`p-4 cursor-pointer transition-colors text-left space-y-1.5 ${
                      selectedTicketId === ticker.id ? 'bg-pink-50 shadow-inner' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-900">{ticker.username}</span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                        ticker.status === 'Open' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {ticker.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate font-light leading-none">{ticker.message}</p>
                    <p className="text-[9px] text-gray-400 font-bold">{ticker.timestamp} · Sim: {ticker.senderType}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversation terminal pane */}
            <div className="md:col-span-2 flex flex-col justify-between max-h-full bg-white">
              
              {/* Selected ticket details */}
              {selectedTicketId ? (
                <>
                  {(() => {
                    const ticket = mockTickets.find(t => t.id === selectedTicketId);
                    if (!ticket) return null;
                    return (
                      <>
                        {/* Conversation Header */}
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center shrink-0">
                          <div>
                            <h4 className="text-xs font-black text-gray-900">{ticket.username}</h4>
                            <p className="text-[10px] text-gray-500">Contact: {ticket.phone} · Role: {ticket.senderType}</p>
                          </div>
                          <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-md border ${
                            ticket.status === 'Open' ? 'border-amber-200 text-amber-600' : 'border-gray-200 text-gray-500'
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
                              <span className="text-[9px] text-gray-400 font-bold mb-1">
                                {chat.sender === 'user' ? ticket.username : 'Whaatachi Admin Team'} · {chat.time}
                              </span>
                              <div className={`p-3 rounded-2xl ${
                                chat.sender === 'user' 
                                  ? 'bg-gray-100 border border-gray-200 rounded-tl-none text-gray-700' 
                                  : 'bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-tr-none font-bold shadow-xs'
                              }`}>
                                {chat.text}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Presets macro replies & Input box form */}
                        <div className="p-4 bg-gray-50 border-t border-gray-200 shrink-0 space-y-3">
                          
                          {/* Predefined replies quick triggers */}
                          <div className="flex flex-wrap gap-2 text-[10px]">
                            <button
                              onClick={() => setTicketReplyInput('Hi! Your Telebirr transaction reference has been verified and approved by the moderator. Your target contact in Hawassa represents verified matches. Check history!')}
                              className="px-2 py-1 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-gray-900"
                            >
                              ✓ Telebirr Verified
                            </button>
                            <button
                              onClick={() => setTicketReplyInput('Good day, your CBE Birr reference code cannot be located on our terminal logs. Please supply a screenshot of your slip or call our automated support at +251 911000000.')}
                              className="px-2 py-1 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-gray-900"
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
                              className="w-full border border-gray-200 p-2.5 rounded-xl bg-gray-50 text-gray-900 text-xs outline-hidden focus:border-pink-500"
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
                <div className="m-auto text-xs text-gray-400 py-16 text-center space-y-2">
                  <MessageSquare className="h-8 w-8 text-gray-300 mx-auto animate-bounce" />
                  <p>Resolutions Inbox complete.</p>
                  <p className="text-[10px] text-gray-400">Select active ticket from column to reply.</p>
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
            <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="pb-3 border-b border-gray-200">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-600">PLATFORM CORE FEES MATRIX</h3>
                <p className="text-[10px] text-gray-400">Configure matchmaking cost parameters for the male payment gateway.</p>
              </div>

              <div className="space-y-4 text-xs">
                <p className="text-gray-500 font-light">
                  A high quality matchmaking pool is maintained with serious candidates. Change the unlock connection rates across the whole site dynamically.
                </p>

                <div className="flex bg-gray-50 border border-gray-200 rounded-2xl p-4 items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block">CURRENT GLOBAL COST</span>
                    <span className="text-xl font-bold text-gray-900 tracking-widest">{matchFee} <small className="text-xs font-normal">ETB</small></span>
                  </div>
                  
                  <div className="flex gap-1">
                    {[100, 200, 300, 500].map(feeOption => (
                      <button
                        key={feeOption}
                        onClick={() => handleSaveMatchFee(feeOption)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-extrabold transition-all cursor-pointer ${
                          matchFee === feeOption 
                            ? 'bg-pink-600 border-pink-500 text-white' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-900'
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
            <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="pb-3 border-b border-gray-200">
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-700 flex items-center gap-1.5">
                  <Key className="h-4.5 w-4.5 text-emerald-600" />
                  GATE ACCESS PASSCODE CREDENTIALS
                </h3>
                <p className="text-[10px] text-gray-400">Update the bypassed key security passphrase</p>
              </div>

              <form onSubmit={handleUpdatePasscode} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 block uppercase">New Admin Passphrase Key</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. secureAccess99"
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-2xl text-gray-900 outline-hidden focus:border-pink-500"
                  />
                </div>

                {changeSuccess && (
                  <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 animate-fadeIn">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Passcode updated inside browser localStorage successfully!
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-extrabold rounded-xl cursor-pointer"
                  >
                    Save Secret Passcode
                  </button>
                </div>
              </form>
            </div>

            {/* Platform mode control options */}
            <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="pb-3 border-b border-gray-200">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-600">PLATFORM SYSTEM FLAGS</h3>
                <p className="text-[10px] text-gray-400">Toggle system flags that affect dating services immediately</p>
              </div>

              <div className="space-y-3 text-xs">
                
                {/* Mode toggle 1 */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <h5 className="font-bold text-gray-700">Maintenance Mode</h5>
                    <p className="text-[10px] text-gray-400">Bypasses registration processes for routine platform debugging</p>
                  </div>
                  <button
                    onClick={handleToggleMaintenance}
                    className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${
                      maintenanceMode 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {maintenanceMode ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                {/* Mode toggle 2 */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <h5 className="font-bold text-gray-700">Simulate Female Premium Free-reveal Mode</h5>
                    <p className="text-[10px] text-gray-400">Allows female members to reveal compatible male counts instantly</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-[9px]">
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
