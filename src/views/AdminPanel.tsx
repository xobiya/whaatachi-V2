import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, UserCheck, Trash2, XCircle, DollarSign, TrendingUp, Users, 
  Clock, AlertTriangle, Sparkles, Image, CheckCircle2,
  Lock, Eye, EyeOff, Key, Settings, ShieldAlert,
  Search, Plus, Edit, MessageSquare, Sliders, LogOut,
  MapPin, Check, CheckCircle, FileText, LayoutDashboard,
  Menu, X, ChevronRight, RefreshCw, Smartphone, Heart
} from 'lucide-react';
import { Profile, PaymentRequest, SuccessStory, Article } from '../types';
import * as api from '../services/api';

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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'payments' | 'members' | 'settings'>('dashboard');
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Platform Matchmaking fee control (Dynamic Birr)
  const [matchFee, setMatchFee] = useState<number>(200);

  // Maintenance mode state
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);

  // Security passcode drawer controls inside Settings view
  const [newPasscode, setNewPasscode] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);

  // Member list/grid view mode toggle
  const [memberViewMode, setMemberViewMode] = useState<'grid' | 'list'>('grid');
  const [memberPage, setMemberPage] = useState(1);
  const [memberPageSize, setMemberPageSize] = useState(10);

  // Toast notification system
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'loading'; message: string } | null>(null);
  const toastTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = (type: 'success' | 'error' | 'loading', message: string, duration = 3000) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ type, message });
    if (type !== 'loading') {
      toastTimer.current = setTimeout(() => setToast(null), duration);
    }
  };

  const clearToast = () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(null);
  };

  // Articles management
  const [articles, setArticles] = useState<Article[]>([]);
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleExcerpt, setNewArticleExcerpt] = useState('');
  const [newArticleCategory, setNewArticleCategory] = useState('Dating Tips');
  const [newArticleContent, setNewArticleContent] = useState('');

  // FAQs management
  const [allFaqs, setAllFaqs] = useState<any[]>([]);
  const [newFaqCategory, setNewFaqCategory] = useState('');
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [editingFaq, setEditingFaq] = useState<any | null>(null);

  // Dashboard stats from API
  const [apiStats, setApiStats] = useState<any>(null);

  // Fetch articles and FAQs on mount
  useEffect(() => {
    api.fetchArticles().then((res) => setArticles(res.articles)).catch(() => showToast('error', 'Failed to load articles'));
    api.fetchAllFaqs().then((res) => setAllFaqs(res.faqs)).catch(() => showToast('error', 'Failed to load FAQs'));
    api.fetchAdminStats().then((res) => setApiStats(res.stats)).catch(() => showToast('error', 'Failed to load stats'));
  }, []);

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
  const [newStoryImage, setNewStoryImage] = useState('/assets/1.avif');

  // New Profile Form inputs
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileAge, setNewProfileAge] = useState<number>(25);
  const [newProfileCity, setNewProfileCity] = useState('Addis Ababa');
  const [newProfileBio, setNewProfileBio] = useState('');
  const [newProfileGender, setNewProfileGender] = useState<'Male' | 'Female'>('Female');
  const [newProfileImage, setNewProfileImage] = useState('/assets/One.avif');
  const [newProfileIntent, setNewProfileIntent] = useState<'True Relationship' | 'Friendship' | 'Friends with Benefits'>('True Relationship');
  const [newProfileTelegram, setNewProfileTelegram] = useState('');
  const [newProfileInstagram, setNewProfileInstagram] = useState('');
  const [newProfilePhone, setNewProfilePhone] = useState('');
  const [newProfileInterests, setNewProfileInterests] = useState('Coffee, Music, Literature');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.adminLogin(passcode.trim());
      setIsAuthenticated(true);
      setUserRole('admin');
    } catch {
      setError('Invalid administrative passcode.');
    }
  };

  const handleAdminLogout = async () => {
    await api.logout().catch(() => {});
    setIsAuthenticated(false);
    setUserRole('user');
    setCurrentView(isLoggedIn ? 'dashboard' : 'home');
  };

  const handleUpdatePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscode.trim()) return;
    try {
      await api.updateAdminPasscode(newPasscode.trim());
      setChangeSuccess(true);
      setNewPasscode('');
      setTimeout(() => {
        setChangeSuccess(false);
      }, 2500);
    } catch {
      showToast('error', 'Failed to update passcode');
    }
  };

  const handleSaveMatchFee = (fee: number) => {
    setMatchFee(fee);
    showToast('success', `Match fee updated to ${fee} ETB`);
  };

  // Toggle Maintenance Mode
  const handleToggleMaintenance = () => {
    setMaintenanceMode(prev => !prev);
  };

  // Profiles Manager CRUD
  const handleDeleteProfile = (profileId: string) => {
    if (window.confirm('Are you absolutely sure you want to delete this profile? All unlock links will be destroyed.')) {
      setProfiles(prev => prev.filter(p => p.id !== profileId));
    }
  };

  const handleToggleProfileVerification = async (profileId: string) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === profileId) {
        return { ...p, verified: !p.verified };
      }
      return p;
    }));
    try {
      const res = await api.toggleProfileVerification(profileId);
      setProfiles(prev => prev.map(p => {
        if (p.id === profileId) {
          return { ...p, verified: res.verified };
        }
        return p;
      }));
    } catch {
      setProfiles(prev => prev.map(p => {
        if (p.id === profileId) {
          return { ...p, verified: !p.verified };
        }
        return p;
      }));
      showToast('error', 'Failed to update verification status on server');
    }
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
      showToast('error', 'Please fill out Name and Telegram fields.');
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
    showToast('success', 'Match candidate created and verified!');
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
      showToast('error', 'Fill in couple names and their story text.');
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
    showToast('success', 'Success story published!');
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

  // Pagination for list view
  const totalFiltered = filteredProfiles.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / memberPageSize));
  const safePage = Math.min(memberPage, totalPages);
  const paginatedProfiles = filteredProfiles.slice((safePage - 1) * memberPageSize, safePage * memberPageSize);

  // Cities extracted
  // Reset page when filters change
  useEffect(() => { setMemberPage(1); }, [searchQuery, genderFilter, cityFilter, verificationFilter]);

  const uniqueCities = useMemo(() => {
    const list = profiles.map(p => p.city);
    return Array.from(new Set(list));
  }, [profiles]);

  // Statistics Computations (merge local + API)
  const pendingCount = allPayments.filter(p => p.status === 'Pending').length;
  const approvedPaymentsList = allPayments.filter(p => p.status === 'Approved');
  const revenueSum = apiStats?.revenue ?? approvedPaymentsList.reduce((sum, p) => sum + p.amount, 0);
  const malePremiumCount = profiles.filter(p => p.gender === 'Male' && p.verified).length;
  const femalePremiumCount = profiles.filter(p => p.gender === 'Female').length;
  const totalUsers = apiStats?.totalUsers ?? profiles.length;
  const verifiedCount = apiStats?.verifiedUsers ?? profiles.filter(p => p.verified).length;
  const totalApprovedPayments = apiStats?.approvedPayments ?? approvedPaymentsList.length;

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

  // Action dropdown component for members table
  function ActionDropdown({ profile, onToggleVerify, onEdit, onDelete }: {
    profile: Profile;
    onToggleVerify: (id: string) => void;
    onEdit: (p: Profile) => void;
    onDelete: (id: string) => void;
  }) {
    const [open, setOpen] = useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleClick = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
      };
      if (open) document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    return (
      <div ref={ref} className="relative inline-block">
        <button
          onClick={() => setOpen(!open)}
          className="p-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all cursor-pointer"
          title="Actions"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="8" cy="3" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="8" cy="13" r="1.5" />
          </svg>
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
            <button
              onClick={() => { onToggleVerify(profile.id); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-left hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {profile.verified ? (
                <><X className="h-3.5 w-3.5 text-gray-400" /> Unverify</>
              ) : (
                <><CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Verify</>
              )}
            </button>
            <button
              onClick={() => { onEdit(profile); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-left hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Edit className="h-3.5 w-3.5 text-pink-500" /> Edit
            </button>
            <button
              onClick={() => { onDelete(profile.id); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-left hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" /> Ban
            </button>
          </div>
        )}
      </div>
    );
  }

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

      {/* Mobile backdrop overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Header bar */}
      <div className="lg:hidden bg-[#0F0F1A] border-b border-gray-800 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-pink-600 to-rose-500 p-1.5 rounded-lg text-white shadow-lg shadow-pink-600/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="font-extrabold tracking-tight text-white shrink-0 text-sm">Whaatachi Control Panel</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 bg-gray-800 rounded-lg text-gray-400 border border-gray-700 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer"
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Actual Sidebar responsive shell */}
      <aside
        className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}
        fixed lg:static top-0 bottom-0 left-0 z-40 bg-[#0F0F1A] border-r border-gray-800 flex flex-col shrink-0 transition-all duration-300 ease-in-out
        shadow-[inset_-1px_0_0_0_rgba(255,255,255,0.03)]
      `}
      >

        {/* Admin Brand Logo Wrapper */}
        <div className={`border-b border-gray-800 flex items-center ${sidebarCollapsed ? 'p-3 justify-center' : 'p-4 justify-between'}`}>
          {sidebarCollapsed ? (
            <div className="bg-gradient-to-tr from-pink-600 to-rose-500 p-2 rounded-xl text-white shadow-lg shadow-pink-600/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-pink-600 to-rose-500 p-2 rounded-xl text-white shadow-lg shadow-pink-600/20 shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="font-black text-[15px] tracking-tight text-white block leading-tight">Whaatachi</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] font-bold text-pink-400 tracking-wider uppercase">Admin Panel</span>
                  <span className="px-1 py-0.5 rounded bg-pink-600/20 border border-pink-500/30 text-[8px] font-bold text-pink-300 uppercase">v1.2</span>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center justify-center w-6 h-6 bg-gray-800/60 rounded-md text-gray-500 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronRight className={`h-3.5 w-3.5 transition-transform duration-200 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
            </button>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden flex items-center justify-center w-6 h-6 bg-gray-800/60 rounded-md text-gray-500 hover:text-white transition-colors cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Admin Profile Summary (expanded only) */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-b border-gray-800/60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm">
                A
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Administrator</p>
                <p className="text-[9px] text-gray-500 truncate">Full access · Root</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3" role="navigation" aria-label="Admin navigation">
          {!sidebarCollapsed && (
            <div className="px-4 mb-2 flex items-center gap-3">
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Management</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>
          )}

          <div className="space-y-0.5 px-2">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Metrics Overview', badge: null },
              { id: 'payments', icon: Smartphone, label: 'Receipt Queue', badge: pendingCount > 0 ? { text: String(pendingCount), className: 'bg-amber-400 text-white' } : null },
              { id: 'members', icon: Users, label: 'Member Candidates', badge: { text: String(profiles.length), className: 'bg-gray-700 text-gray-300' } },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => { setActiveTab(item.id as typeof activeTab); setIsSidebarOpen(false); }}
                    className={`
                      w-full flex items-center text-xs font-bold transition-all duration-150 cursor-pointer
                      ${sidebarCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2.5'}
                      ${isActive
                        ? 'text-white'
                        : 'text-gray-400 hover:text-gray-200'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full" />
                    )}
                    <span className={`flex items-center gap-2.5 ${sidebarCollapsed ? '' : 'pl-1'}`}>
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all duration-150
                        ${isActive
                          ? 'bg-gradient-to-br from-pink-600 to-rose-500 text-white shadow-sm shadow-pink-600/20'
                          : 'text-gray-400 group-hover:bg-gray-800/80 group-hover:text-gray-200'
                        }
                      `}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </span>
                    {!sidebarCollapsed && item.badge && (
                      <span className={`${item.badge.className} text-[10px] px-1.5 py-0.5 rounded-full font-black shrink-0 ml-2`}>
                        {item.badge.text}
                      </span>
                    )}
                  </button>
                  {/* CSS tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-900 text-white text-[11px] font-bold rounded-md whitespace-nowrap shadow-xl border border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!sidebarCollapsed && (
            <div className="px-4 mt-5 mb-2 flex items-center gap-3">
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">System</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>
          )}

          <div className="space-y-0.5 px-2">
            {[
              { id: 'settings', icon: Sliders, label: 'Platform Settings', badge: null },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => { setActiveTab(item.id as typeof activeTab); setIsSidebarOpen(false); }}
                    className={`
                      w-full flex items-center text-xs font-bold transition-all duration-150 cursor-pointer
                      ${sidebarCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2.5'}
                      ${isActive
                        ? 'text-white'
                        : 'text-gray-400 hover:text-gray-200'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full" />
                    )}
                    <span className={`flex items-center gap-2.5 ${sidebarCollapsed ? '' : 'pl-1'}`}>
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all duration-150
                        ${isActive
                          ? 'bg-gradient-to-br from-pink-600 to-rose-500 text-white shadow-sm shadow-pink-600/20'
                          : 'text-gray-400 group-hover:bg-gray-800/80 group-hover:text-gray-200'
                        }
                      `}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </span>
                  </button>
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-900 text-white text-[11px] font-bold rounded-md whitespace-nowrap shadow-xl border border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-800 space-y-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} p-2 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors cursor-pointer group`}
            title={sidebarCollapsed ? 'Toggle theme' : ''}
            aria-label="Toggle theme"
          >
            {sidebarCollapsed ? (
              <span className="text-xs text-pink-400">{darkMode ? '\u2600' : '\u263D'}</span>
            ) : (
              <>
                <span className="flex items-center gap-2">
                  {darkMode ? <span className="text-amber-400">\u2600</span> : <span className="text-indigo-400">\u263D</span>}
                  Theme
                </span>
                <span className="px-2 py-0.5 rounded-md bg-gray-800 font-mono text-[10px] text-pink-400 border border-gray-700">
                  {darkMode ? 'DARK' : 'LIGHT'}
                </span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to lock the admin session?')) {
                handleAdminLogout();
              }
            }}
            className={`w-full py-2.5 rounded-lg bg-gray-800/60 border border-gray-700 hover:bg-red-900/30 hover:border-red-800/50 text-red-400 hover:text-red-300 text-xs font-extrabold flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-center gap-2'} cursor-pointer transition-all group`}
            title={sidebarCollapsed ? 'Lock Session' : ''}
            aria-label="Lock Session"
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

              {/* Card 3: Total users */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Total Registered Users</p>
                  <h3 className="text-3xl font-black text-gray-900">{totalUsers} <span className="text-xs font-semibold text-gray-500">users</span></h3>
                  <p className="text-[10px] text-pink-600 font-bold flex items-center gap-0.5 mt-2">
                    <Heart className="h-3.5 w-3.5 fill-pink-500 text-pink-500" /> {malePremiumCount} Male · {femalePremiumCount} Female
                  </p>
                </div>
                <div className="bg-pink-50 text-pink-600 p-3 rounded-xl border border-pink-200">
                  <Users className="h-6 w-6" />
                </div>
              </div>

              {/* Card 4: Verified users */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Verified Users</p>
                  <h3 className="text-3xl font-black text-gray-900">{verifiedCount} <span className="text-xs font-semibold text-gray-500">verified</span></h3>
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-2">
                    <ShieldCheck className="h-3.5 w-3.5" /> {totalApprovedPayments} approved payments
                  </p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl border border-emerald-200">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              </div>

              {/* Card 5: Base connections fee */}
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
                      image: '/assets/two.avif',
                      status: 'Online',
                      relationshipIntent: 'True Relationship',
                      interests: ['Jazz', 'Hiking', 'Kitfo'],
                      verified: true,
                      contactInfo: { phone: '0900112233', telegram: '@zene_abera', instagram: '@zenebech', email: 'zenebech@whaatachi.com' }
                    };
                    setProfiles(prev => [sample, ...prev]);
                    showToast('success', 'Female candidate injected into discovery feed');
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
                      image: '/assets/2.avif',
                      status: 'Recently Active',
                      relationshipIntent: 'True Relationship',
                      interests: ['Macchiato', 'Tech', 'Sketching'],
                      verified: false,
                      contactInfo: { phone: '0933445566', telegram: '@brook_shif', instagram: '@brook_shif', email: 'brook@whaatachi.com' }
                    };
                    setProfiles(prev => [sample, ...prev]);
                    showToast('success', 'Male candidate injected into discovery feed');
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
                      profileImage: '/assets/three.avif',
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

                {/* Reload data from API */}
                <button
                  onClick={() => {
                    if (window.confirm('Reload all data from the server?')) {
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-red-300 text-gray-500 hover:text-red-500 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all text-center justify-center cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reload from Server
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
                <>
                  {/* Desktop table */}
                  <div className="overflow-x-auto scrollbar-thin hidden sm:block">
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

                  {/* Mobile cards */}
                  <div className="sm:hidden divide-y divide-gray-100">
                    {allPayments.map((payment) => (
                      <div key={payment.id} className="p-4 hover:bg-gray-50 transition-colors" onClick={() => setSelectedRequest(payment)}>
                        <div className="flex items-start gap-3 mb-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedRequest(payment); }}
                            className="w-14 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shrink-0"
                          >
                            <img
                              src={payment.receiptImage || 'https://placehold.co/80x96/f5f5f5/ccc?text=N/A'}
                              alt="Receipt"
                              className="w-full h-full object-cover"
                            />
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className="font-extrabold text-gray-900 text-sm">{payment.senderName}</p>
                            <p className="text-[11px] text-gray-400">{payment.senderPhone}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <img src={payment.profileImage} alt={payment.profileName} className="w-5 h-5 rounded-full object-cover shrink-0" />
                              <span className="text-xs text-gray-500 truncate">{payment.profileName}</span>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${getStatusBadge(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-extrabold uppercase ${
                              payment.method === 'Telebirr' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                            }`}>
                              {payment.method}
                            </span>
                            <span className="font-mono text-[9px] text-gray-400 uppercase">{payment.transactionId}</span>
                          </div>
                          <span className="font-extrabold text-gray-900">{payment.amount} ETB</span>
                        </div>
                        {payment.status === 'Pending' && (
                          <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => onApprove(payment.id)}
                              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => onReject(payment.id)}
                              className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1"
                            >
                              <X className="h-3.5 w-3.5" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-16 text-center text-xs text-gray-400 space-y-2">
                  <Smartphone className="h-8 w-8 text-gray-300 mx-auto" />
                  <p>No active transactions submitted yet inside mock environment.</p>
                </div>
              )}
            </div>

            {/* Receipt Detail Modal */}
            {selectedRequest && (
              <div className="fixed inset-0 z-55 flex items-center justify-center sm:p-4">
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs" onClick={() => setSelectedRequest(null)}></div>
                <div className="bg-white border border-gray-200 sm:rounded-3xl rounded-none p-4 sm:p-8 max-w-2xl w-full relative z-10 shadow-2xl h-full sm:max-h-[90vh] overflow-y-auto scrollbar-thin animate-fadeIn">
                  
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

                {/* View mode toggle */}
                <div className="flex bg-gray-100 rounded-xl border border-gray-200 p-0.5">
                  <button
                    onClick={() => setMemberViewMode('grid')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      memberViewMode === 'grid' ? 'bg-white text-pink-600 shadow-xs' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="Grid view"
                  >
                    <div className="flex gap-0.5">
                      <div className="w-1.5 h-1.5 rounded-xs bg-current" />
                      <div className="w-1.5 h-1.5 rounded-xs bg-current" />
                      <div className="w-1.5 h-1.5 rounded-xs bg-current" />
                    </div>
                  </button>
                  <button
                    onClick={() => setMemberViewMode('list')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      memberViewMode === 'list' ? 'bg-white text-pink-600 shadow-xs' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="List view"
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="w-3 h-0.5 rounded-xs bg-current" />
                      <div className="w-3 h-0.5 rounded-xs bg-current" />
                      <div className="w-3 h-0.5 rounded-xs bg-current" />
                    </div>
                  </button>
                </div>

                {/* Create Profile toggle button */}
                <button
                  onClick={() => setIsCreatingProfile(true)}
                  className="bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 text-white rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-all outline-hidden shrink-0 cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Match Candidate
                </button>
              </div>

            </div>

            {/* Profiles lists - Grid / List toggle */}
            {memberViewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProfiles.map((profile) => (
                  <div key={profile.id} className="bg-white border border-gray-200 rounded-3xl p-5 space-y-4 flex flex-col justify-between shadow-sm hover:border-gray-300 transition-all">
                    
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

                    <p className="text-xs text-gray-500 line-clamp-2 font-light">{profile.bio}</p>

                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl space-y-1 font-mono text-[10px]">
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[8px]">DISCLOSED ACCESS MATRIX:</p>
                      <p>Telegram: <span className="text-pink-600 font-extrabold select-all">{profile.contactInfo.telegram}</span></p>
                      <p>Phone: <span className="text-gray-700 font-bold select-all">{profile.contactInfo.phone}</span></p>
                    </div>

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
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500">
                    Showing {paginatedProfiles.length} of {totalFiltered} members
                  </span>
                </div>
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 border-b border-gray-200">
                        <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Member</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Age</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-[10px]">City</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Gender</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Intent</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Telegram</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Verified</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-600">
                      {paginatedProfiles.map((profile) => (
                        <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <img src={profile.image} alt={profile.name} className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-200" />
                              <span className="font-bold text-gray-900">{profile.name}</span>
                            </div>
                          </td>
                          <td className="p-3">{profile.age}</td>
                          <td className="p-3">{profile.city}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              profile.gender === 'Male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'
                            }`}>
                              {profile.gender}
                            </span>
                          </td>
                          <td className="p-3 text-gray-500">{profile.relationshipIntent}</td>
                          <td className="p-3 font-mono text-[10px] text-pink-600 font-bold">{profile.contactInfo.telegram}</td>
                          <td className="p-3">
                            {profile.verified ? (
                              <span className="text-emerald-600 flex items-center gap-1 text-[10px] font-bold">
                                <ShieldCheck className="h-3.5 w-3.5" /> Verified
                              </span>
                            ) : (
                              <span className="text-gray-400 text-[10px]">Unverified</span>
                            )}
                          </td>
                          <td className="p-3 text-right relative">
                            <ActionDropdown
                              profile={profile}
                              onToggleVerify={handleToggleProfileVerification}
                              onEdit={setEditingProfile}
                              onDelete={handleDeleteProfile}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalFiltered === 0 && (
                  <div className="py-12 text-center text-xs text-gray-400 space-y-2">
                    <Users className="h-8 w-8 text-gray-300 mx-auto" />
                    <p>No matching members found.</p>
                    <p className="text-[10px]">Try adjusting your search or filters.</p>
                  </div>
                )}
                {totalFiltered > 0 && (
                  <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-bold">Rows per page:</span>
                      <select
                        value={memberPageSize}
                        onChange={(e) => { setMemberPageSize(Number(e.target.value)); setMemberPage(1); }}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-gray-600 outline-hidden cursor-pointer"
                      >
                        {[10, 25, 50, 100].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-bold">
                        Page {safePage} of {totalPages}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setMemberPage(p => Math.max(1, p - 1))}
                          disabled={safePage <= 1}
                          className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-[11px] transition-all cursor-pointer"
                        >
                          Prev
                        </button>
                        <button
                          onClick={() => setMemberPage(p => Math.min(totalPages, p + 1))}
                          disabled={safePage >= totalPages}
                          className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-[11px] transition-all cursor-pointer"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

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

                    {/* Photo upload */}
                    <div className="space-y-1">
                      <label className="font-bold text-gray-500 block uppercase">Photo</label>
                      <div className="flex items-center gap-3">
                        <label className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 p-2.5 rounded-xl cursor-pointer hover:border-pink-300 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  if (ev.target?.result) setNewProfileImage(ev.target.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                          <svg className="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                          </svg>
                          <span className="text-xs text-gray-500 font-medium truncate">
                            {newProfileImage?.startsWith('data:') ? 'Photo uploaded' : 'Upload photo...'}
                          </span>
                        </label>
                        {newProfileImage?.startsWith('data:') && (
                          <button
                            type="button"
                            onClick={() => setNewProfileImage('')}
                            className="p-2 bg-red-50 border border-red-200 rounded-xl text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Remove photo"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                      {newProfileImage?.startsWith('data:') && (
                        <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                          <img src={newProfileImage} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Telegram username */}
                      <div className="space-y-1">
                        <label className="font-bold text-gray-500 block uppercase">Telegram Username (Required)</label>
                        <input
                          type="text"
                          required
                          placeholder="mahlet_des"
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

                      {/* Instagram */}
                      <div className="space-y-1">
                        <label className="font-bold text-gray-500 block uppercase">Instagram</label>
                        <input
                          type="text"
                          placeholder="username"
                          value={newProfileInstagram}
                          onChange={(e) => setNewProfileInstagram(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-900 text-xs outline-hidden focus:border-pink-500"
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Intent selector */}
                      <div className="space-y-1 font-bold text-gray-500 block">
                        <label className="uppercase">Intent</label>
                        <select
                          value={newProfileIntent}
                          onChange={(e) => setNewProfileIntent(e.target.value as any)}
                          className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-gray-600 outline-hidden"
                        >
                          <option value="True Relationship">True Relationship</option>
                          <option value="Friendship">Friendship</option>
                          <option value="Friends with Benefits">Friends with Benefits</option>
                          <option value="Sex">Sex</option>
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
                    Passcode updated successfully!
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
