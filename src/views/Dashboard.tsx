import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Filter, AlertCircle, Heart, Star, Sliders, CheckSquare, Square, RefreshCw, Layers, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { Profile, PaymentRequest } from '../types';
import ProfileCard from '../components/ProfileCard';

const PRO_TIPS = [
  {
    title: "Craft an Irresistible Bio",
    content: "Write a high-authenticity description detailing 2-3 specific hobbies, passions, or relationship values. Profiles with detailed copy receive up to 4x more matching unlocks!",
    tag: "Bio Craft",
    color: "pink"
  },
  {
    title: "Safety First: Chat on Telegram First",
    content: "Always stay on Telegram chat or Whaatachi secure channels before sharing direct physical telephone coordinates. Keep your digital identity secure until trust is fully mutual.",
    tag: "Safety Vector",
    color: "amber"
  },
  {
    title: "Exquisite Profile Photo Selection",
    content: "Select friendly, clear, well-lit headshots with natural smiles. Selfies with positive lighting perform best; avoid busy filters or group photos where you are hard to identify.",
    tag: "Photo Quality",
    color: "blue"
  },
  {
    title: "Open Conversational Warmth",
    content: "When unlocking a candidate's contact details, send a polite, contextual greeting. Reference common interests displayed on their profile card to instantly build comfortable rapport.",
    tag: "Great First Message",
    color: "emerald"
  },
  {
    title: "Decline and Report Safely",
    content: "We manually verify transactions to keep bad actors out, but stay alert. If any match asks for upfront financial assistance, block them and report their ID to our support line.",
    tag: "Security Guard",
    color: "purple"
  }
];

const getTagBadgeStyles = (color: string) => {
  switch (color) {
    case 'pink':
      return 'bg-[#8B0020]/5 text-[#8B0020] border-[#8B0020]/20';
    case 'amber':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'blue':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'emerald':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'purple':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

interface DashboardProps {
  profiles: Profile[];
  unlockedIds: string[];
  pendingPayments: PaymentRequest[];
  onUnlockClick: (profile: Profile) => void;
  userGender: 'Male' | 'Female';
}

export default function Dashboard({
  profiles,
  unlockedIds,
  pendingPayments,
  onUnlockClick,
  userGender
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedIntent, setSelectedIntent] = useState('All');
  const [filterType, setFilterType] = useState<'all' | 'recent' | 'verified' | 'unlocked'>('all');
  const [ageRange, setAgeRange] = useState<number>(35); // Max age filter
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGenderFilter, setSelectedGenderFilter] = useState<'All' | 'Male' | 'Female'>(() => 
    userGender === 'Male' ? 'Female' : 'Male'
  );

  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Auto rotate tips every 12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % PRO_TIPS.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % PRO_TIPS.length);
  };

  const handlePrevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + PRO_TIPS.length) % PRO_TIPS.length);
  };

  const cities = ['All', 'Addis Ababa', 'Adama', 'Hawassa', 'Bahir Dar', 'Dire Dawa', 'Gondar'];
  const intents = ['All', 'True Relationship', 'Friendship', 'Friends with Benefits'];

  // All interests present in raw mock profiles
  const allInterests = useMemo(() => {
    const set = new Set<string>();
    profiles.forEach(p => p.interests.forEach(i => set.add(i)));
    return Array.from(set);
  }, [profiles]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('All');
    setSelectedIntent('All');
    setFilterType('all');
    setAgeRange(35);
    setSelectedInterests([]);
    setSelectedGenderFilter(userGender === 'Male' ? 'Female' : 'Male');
  };

  // Filter logic
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      // 1. Text Search query (matches name, bio, or city)
      const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            profile.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            profile.city.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. City filter
      const matchesCity = selectedCity === 'All' || profile.city === selectedCity;

      // 3. Intent filter
      const matchesIntent = selectedIntent === 'All' || profile.relationshipIntent === selectedIntent;

      // 4. Age filter
      const matchesAge = profile.age <= ageRange;

      // 5. Special Status Category Tabs
      let matchesCategory = true;
      if (filterType === 'recent') {
        matchesCategory = profile.status === 'Recently Active' || profile.status === 'Online';
      } else if (filterType === 'verified') {
        matchesCategory = profile.verified;
      } else if (filterType === 'unlocked') {
        matchesCategory = unlockedIds.includes(profile.id);
      }

      // 6. Selected Interests tag match (matches if profile matches AT LEAST ONE selected interest if list is populated)
      const matchesInterests = selectedInterests.length === 0 || 
                               profile.interests.some(interest => selectedInterests.includes(interest));

      // 7. Core Gender match filter
      const matchesGender = selectedGenderFilter === 'All' || profile.gender === selectedGenderFilter;

      return matchesSearch && matchesCity && matchesIntent && matchesAge && matchesCategory && matchesInterests && matchesGender;
    });
  }, [profiles, searchQuery, selectedCity, selectedIntent, filterType, ageRange, selectedInterests, unlockedIds, selectedGenderFilter]);

  return (
    <div className="bg-[#FFFCF8] py-10" id="discover-dashboard-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#1A1118] tracking-tight">
              Discover Connections
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Find verified Ethiopian singles near you
            </p>
          </div>

          <button onClick={handleResetFilters} className="flex items-center gap-1 text-xs font-bold text-[#8B0020] bg-[#8B0020]/5 border border-[#8B0020]/20 rounded-lg px-3.5 py-2 cursor-pointer transition-colors shrink-0">
            <RefreshCw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>

        {/* Dashboard Grid split into Sidebar filters and profile feed */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Sidebar controls */}
          <div className="col-span-1 bg-white border border-[#EDE6D9] rounded-2xl p-5 space-y-6 shadow-sm lg:sticky lg:top-20">
            <h3 className="text-sm font-bold text-[#1A1118] flex items-center gap-2 uppercase tracking-wider pb-3 border-b border-[#EDE6D9]">
              <Sliders className="h-4.5 w-4.5 text-[#8B0020]" />
              Filters
            </h3>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1A1118]/70 uppercase tracking-wider">Looking For</label>
              <div className="grid grid-cols-3 bg-[#F8F4ED] border border-[#EDE6D9] rounded-xl p-1 gap-1">
                {['All', 'Men', 'Women'].map((genderOption) => {
                  const isSelect = (genderOption === 'All' && selectedGenderFilter === 'All') || (genderOption === 'Men' && selectedGenderFilter === 'Male') || (genderOption === 'Women' && selectedGenderFilter === 'Female');
                  return (
                    <button key={genderOption} type="button" onClick={() => setSelectedGenderFilter(genderOption === 'All' ? 'All' : (genderOption === 'Men' ? 'Male' : 'Female'))} className={`py-1.5 text-center text-[10px] font-bold rounded-lg transition-all cursor-pointer ${isSelect ? 'bg-[#8B0020] text-white' : 'text-gray-500 hover:text-[#1A1118]'}`}>
                      {genderOption}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1A1118]/70 uppercase tracking-wider">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" />
                <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-[#EDE6D9] rounded-xl bg-white text-sm text-gray-800 focus:outline-hidden focus:border-[#8B0020]">
                  {cities.map((city) => (<option key={city} value={city}>{city}</option>))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1A1118]/70 uppercase tracking-wider">Intent</label>
              <select value={selectedIntent} onChange={(e) => setSelectedIntent(e.target.value)} className="w-full px-4 py-2 border border-[#EDE6D9] rounded-xl bg-white text-sm text-gray-800 focus:outline-hidden focus:border-[#8B0020]">
                {intents.map((intent) => (<option key={intent} value={intent}>{intent === 'All' ? 'All Intents' : intent}</option>))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[#1A1118]/70 uppercase tracking-wider">Max Age</label>
                <span className="text-xs font-bold text-[#8B0020] bg-[#8B0020]/5 border border-[#8B0020]/20 px-2 py-0.5 rounded-md">{ageRange}</span>
              </div>
              <input type="range" min="18" max="50" value={ageRange} onChange={(e) => setAgeRange(Number(e.target.value))} className="w-full accent-[#8B0020] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              <div className="flex justify-between text-[10px] text-gray-400 dark:text-slate-500 font-medium">
                <span>18</span>
                <span>35</span>
                <span>50</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-[#1A1118]/70 uppercase tracking-wider">Interests</label>
              <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1 border border-[#EDE6D9] p-2.5 rounded-xl bg-[#F8F4ED]/50">
                {allInterests.map((interest) => {
                  const isChecked = selectedInterests.includes(interest);
                  return (
                    <button key={interest} type="button" onClick={() => toggleInterest(interest)} className="flex items-center gap-2.5 w-full text-left text-xs text-gray-600 hover:text-[#1A1118] py-1 cursor-pointer transition-colors font-medium">
                      {isChecked ? <CheckSquare className="h-4.5 w-4.5 text-[#8B0020] shrink-0" /> : <Square className="h-4.5 w-4.5 text-gray-300 shrink-0" />}
                      <span>{interest}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#F8F4ED] rounded-2xl p-4 border border-[#C9A84C]/20">
              <p className="text-[11px] font-bold text-[#8B0020] uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                <Star className="h-3.5 w-3.5 text-[#C9A84C]" />
                Want more matches?
              </p>
              <p className="text-[10px] text-gray-600 leading-relaxed">
                Keep your profile active & verify your payment to unlock more connections.
              </p>
            </div>

          </div>

          {/* Profile results deck */}
          <div className="col-span-1 lg:col-span-3 space-y-6">
            
            {/* Contextual rotating 'Pro Tip' box */}
            <div className="bg-white border border-[#EDE6D9] rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all" id="dashboard-pro-tip-carousel">
              <div className="absolute -right-2 -bottom-2 text-[#C9A84C]/5 transform rotate-12 pointer-events-none select-none">
                <Lightbulb className="h-32 w-32" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE6D9] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#8B0020]/5 rounded-lg text-[#8B0020] shrink-0">
                    <Lightbulb className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#1A1118] uppercase tracking-wider">Pro Tips</h3>
                    <p className="text-[10px] text-gray-400">Rotating guidance for better connections</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Category Tag */}
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border tracking-wider uppercase font-sans ${getTagBadgeStyles(PRO_TIPS[currentTipIndex].color)}`}>
                    {PRO_TIPS[currentTipIndex].tag}
                  </span>

                  {/* Nav controls */}
                  <div className="flex items-center border border-gray-150 dark:border-slate-850 rounded-lg p-0.5 bg-gray-50/50 dark:bg-slate-950/20">
                    <button
                      onClick={handlePrevTip}
                      className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Previous Tip"
                      aria-label="Previous tip"
                      type="button"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-[9px] font-mono font-bold px-1.5 text-gray-450 dark:text-slate-500">
                      {currentTipIndex + 1}/{PRO_TIPS.length}
                    </span>
                    <button
                      onClick={handleNextTip}
                      className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Next Tip"
                      aria-label="Next tip"
                      type="button"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tip Content */}
              <div className="space-y-1 relative z-10 animate-fadeIn">
                <h4 className="text-xs font-bold text-gray-950 dark:text-white flex items-center gap-1.5">
                  {PRO_TIPS[currentTipIndex].title}
                </h4>
                <p className="text-[11px] text-gray-550 dark:text-slate-350 leading-relaxed font-light">
                  {PRO_TIPS[currentTipIndex].content}
                </p>
              </div>
            </div>

            {/* Search inputs bar */}
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Search by name, city, or interests..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-[#EDE6D9] pl-11 pr-4 py-3.5 rounded-2xl shadow-sm outline-hidden focus:border-[#8B0020] focus:ring-1 focus:ring-[#8B0020]/20 text-sm text-gray-800" />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
              <button onClick={() => setFilterType('all')} className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${filterType === 'all' ? 'bg-[#1A1118] border-[#1A1118] text-white' : 'bg-white border-[#EDE6D9] text-gray-600 hover:border-gray-300'}`}>
                All ({profiles.length})
              </button>
              <button onClick={() => setFilterType('recent')} className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${filterType === 'recent' ? 'bg-[#1A1118] border-[#1A1118] text-white' : 'bg-white border-[#EDE6D9] text-gray-600 hover:border-gray-300'}`}>
                ⚡ Active
              </button>
              <button onClick={() => setFilterType('verified')} className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${filterType === 'verified' ? 'bg-[#1A1118] border-[#1A1118] text-white' : 'bg-white border-[#EDE6D9] text-gray-600 hover:border-gray-300'}`}>
                Verified
              </button>
              {unlockedIds.length > 0 && (
                <button onClick={() => setFilterType('unlocked')} className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${filterType === 'unlocked' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-[#EDE6D9] text-emerald-700 hover:border-emerald-300'}`}>
                  Unlocked ({unlockedIds.length})
                </button>
              )}
            </div>

            <div className="bg-[#F8F4ED] border border-[#EDE6D9] rounded-xl p-3 text-gray-700 text-xs leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-[#C9A84C] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Viewing as {userGender}.</span>{' '}
                {userGender === 'Male' ? (
                  <span>Men pay 200 ETB per unlock. Women get free access.</span>
                ) : (
                  <span>Women unlock contacts for free. No payment needed.</span>
                )}
              </div>
            </div>

            {/* Profiles Feed Grid */}
            {filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProfiles.map((profile) => {
                  const isUnlocked = unlockedIds.includes(profile.id);
                  const pPayment = pendingPayments.find(
                    (p) => p.profileId === profile.id && p.status === 'Pending'
                  );

                  return (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      isUnlocked={isUnlocked}
                      pendingPayment={pPayment}
                      onUnlockClick={onUnlockClick}
                      userGender={userGender}
                    />
                  );
                })}
              </div>
            ) : (
              // Empty search state
              <div className="bg-white border border-[#EDE6D9] rounded-2xl py-16 px-4 text-center max-w-xl mx-auto space-y-3">
                <div className="bg-[#F8F4ED] text-gray-400 p-4 rounded-full w-14 h-14 flex items-center justify-center mx-auto text-xl font-bold">?</div>
                <h3 className="font-bold text-[#1A1118] text-lg">No Matches Found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">Try different filters or locations.</p>
                <button onClick={handleResetFilters} className="px-4 py-2.5 bg-[#8B0020] hover:bg-[#B31B3A] text-white font-semibold text-xs rounded-lg shadow-sm cursor-pointer transition-all">
                  Show All Profiles
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
