import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, AlertCircle, Star, Sliders, CheckSquare, Square, RefreshCw, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { Profile, PaymentRequest } from '../types';
import ProfileCard from '../components/ProfileCard';

const PRO_TIPS = [
  {
    title: "Craft an Irresistible Bio",
    content: "Write a high-authenticity description detailing 2-3 specific hobbies, passions, or relationship values. Profiles with detailed copy receive up to 4x more matching unlocks!",
    tag: "Bio Craft",
    color: "red"
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
    case 'red':
      return 'bg-[#8B0020]/5 dark:bg-[#8B0020]/15 text-[#8B0020] dark:text-[#C9A84C] border-[#8B0020]/20 dark:border-[#C9A84C]/30';
    case 'amber':
      return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    case 'blue':
      return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    case 'emerald':
      return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    case 'purple':
      return 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    default:
      return 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
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
  profiles, unlockedIds, pendingPayments, onUnlockClick, userGender
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedIntent, setSelectedIntent] = useState('All');
  const [filterType, setFilterType] = useState<'all' | 'recent' | 'verified' | 'unlocked'>('all');
  const [ageRange, setAgeRange] = useState<number>(35);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSexFilter, setSelectedSexFilter] = useState<'Male' | 'Female'>(() =>
    userGender === 'Male' ? 'Female' : 'Male'
  );

  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % PRO_TIPS.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleNextTip = () => setCurrentTipIndex((prev) => (prev + 1) % PRO_TIPS.length);
  const handlePrevTip = () => setCurrentTipIndex((prev) => (prev - 1 + PRO_TIPS.length) % PRO_TIPS.length);

  const cities = ['All', 'Addis Ababa', 'Adama', 'Hawassa', 'Bahir Dar', 'Dire Dawa', 'Gondar'];
  const intents = ['All', 'True Relationship', 'Friendship', 'Friends with Benefits'];

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
    setSelectedSexFilter(userGender === 'Male' ? 'Female' : 'Male');
  };

  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            profile.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            profile.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity === 'All' || profile.city === selectedCity;
      const matchesIntent = selectedIntent === 'All' || profile.relationshipIntent === selectedIntent;
      const matchesAge = profile.age <= ageRange;

      let matchesCategory = true;
      if (filterType === 'recent') {
        matchesCategory = profile.status === 'Recently Active' || profile.status === 'Online';
      } else if (filterType === 'verified') {
        matchesCategory = profile.verified;
      } else if (filterType === 'unlocked') {
        matchesCategory = unlockedIds.includes(profile.id);
      }

      const matchesInterests = selectedInterests.length === 0 ||
                               profile.interests.some(interest => selectedInterests.includes(interest));
      const matchesGender = profile.gender === selectedSexFilter;

      return matchesSearch && matchesCity && matchesIntent && matchesAge && matchesCategory && matchesInterests && matchesGender;
    });
  }, [profiles, searchQuery, selectedCity, selectedIntent, filterType, ageRange, selectedInterests, unlockedIds, selectedSexFilter]);

  return (
    <div className="bg-[#FFFCF8] dark:bg-[#120A0E] py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#1A1118] dark:text-[#FFFCF8] tracking-tight">
              Discover Connections
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Find verified Ethiopian singles near you
            </p>
          </div>

          <button onClick={handleResetFilters} className="flex items-center gap-1 text-xs font-bold text-[#8B0020] dark:text-[#C9A84C] bg-[#8B0020]/5 dark:bg-[#8B0020]/15 border border-[#8B0020]/20 dark:border-[#C9A84C]/20 rounded-lg px-3.5 py-2 cursor-pointer transition-colors shrink-0">
            <RefreshCw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          <div className="col-span-1 bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-5 space-y-6 shadow-sm lg:sticky lg:top-20">
            <h3 className="text-sm font-bold text-[#1A1118] dark:text-[#FFFCF8] flex items-center gap-2 uppercase tracking-wider pb-3 border-b border-[#EDE6D9] dark:border-[#C9A84C]/10">
              <Sliders className="h-4.5 w-4.5 text-[#8B0020] dark:text-[#C9A84C]" />
              Filters
            </h3>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">Sex</label>
              <div className="grid grid-cols-2 bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl p-1 gap-1">
                {['Men', 'Women'].map((sexOption) => {
                  const isSelect = (sexOption === 'Men' && selectedSexFilter === 'Male') || (sexOption === 'Women' && selectedSexFilter === 'Female');
                  return (
                    <button key={sexOption} type="button" onClick={() => setSelectedSexFilter(sexOption === 'Men' ? 'Male' : 'Female')} className={`py-1.5 text-center text-[10px] font-bold rounded-lg transition-all cursor-pointer ${isSelect ? 'bg-[#8B0020] text-white' : 'text-gray-500 dark:text-gray-400 hover:text-[#1A1118] dark:hover:text-[#FFFCF8]'}`}>
                      {sexOption}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" />
                <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl bg-white dark:bg-[#1A1118] text-sm text-gray-800 dark:text-[#FFFCF8] focus:outline-hidden focus:border-[#8B0020] dark:focus:border-[#C9A84C]">
                  {cities.map((city) => (<option key={city} value={city}>{city}</option>))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">Intent</label>
              <select value={selectedIntent} onChange={(e) => setSelectedIntent(e.target.value)} className="w-full px-4 py-2 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl bg-white dark:bg-[#1A1118] text-sm text-gray-800 dark:text-[#FFFCF8] focus:outline-hidden focus:border-[#8B0020] dark:focus:border-[#C9A84C]">
                {intents.map((intent) => (<option key={intent} value={intent}>{intent === 'All' ? 'All Intents' : intent}</option>))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">Max Age</label>
                <span className="text-xs font-bold text-[#8B0020] dark:text-[#C9A84C] bg-[#8B0020]/5 dark:bg-[#8B0020]/15 border border-[#8B0020]/20 dark:border-[#C9A84C]/20 px-2 py-0.5 rounded-md">{ageRange}</span>
              </div>
              <input type="range" min="18" max="50" value={ageRange} onChange={(e) => setAgeRange(Number(e.target.value))} className="w-full accent-[#8B0020] h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" />
              <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                <span>18</span>
                <span>35</span>
                <span>50</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">Interests</label>
              <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1 border border-[#EDE6D9] dark:border-[#C9A84C]/10 p-2.5 rounded-xl bg-[#F8F4ED]/50 dark:bg-[#120A0E]/50">
                {allInterests.map((interest) => {
                  const isChecked = selectedInterests.includes(interest);
                  return (
                    <button key={interest} type="button" onClick={() => toggleInterest(interest)} className="flex items-center gap-2.5 w-full text-left text-xs text-gray-600 dark:text-gray-400 hover:text-[#1A1118] dark:hover:text-[#FFFCF8] py-1 cursor-pointer transition-colors font-medium">
                      {isChecked ? <CheckSquare className="h-4.5 w-4.5 text-[#8B0020] dark:text-[#C9A84C] shrink-0" /> : <Square className="h-4.5 w-4.5 text-gray-300 dark:text-gray-600 shrink-0" />}
                      <span>{interest}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#F8F4ED] dark:bg-[#120A0E] rounded-2xl p-4 border border-[#C9A84C]/20 dark:border-[#C9A84C]/10">
              <p className="text-[11px] font-bold text-[#8B0020] dark:text-[#C9A84C] uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                <Star className="h-3.5 w-3.5 text-[#C9A84C]" />
                Want more matches?
              </p>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                Keep your profile active & verify your payment to unlock more connections.
              </p>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-3 space-y-6">

            <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all">
              <div className="absolute -right-2 -bottom-2 text-[#C9A84C]/5 dark:text-[#C9A84C]/10 transform rotate-12 pointer-events-none select-none">
                <Lightbulb className="h-32 w-32" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE6D9] dark:border-[#C9A84C]/10 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#8B0020]/5 dark:bg-[#8B0020]/15 rounded-lg text-[#8B0020] dark:text-[#C9A84C] shrink-0">
                    <Lightbulb className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#1A1118] dark:text-[#FFFCF8] uppercase tracking-wider">Pro Tips</h3>
                    <p className="text-[10px] text-gray-400">Rotating guidance for better connections</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border tracking-wider uppercase font-sans ${getTagBadgeStyles(PRO_TIPS[currentTipIndex].color)}`}>
                    {PRO_TIPS[currentTipIndex].tag}
                  </span>

                  <div className="flex items-center border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-lg p-0.5 bg-[#F8F4ED]/50 dark:bg-[#120A0E]/50">
                    <button onClick={handlePrevTip} className="p-1 text-gray-400 hover:text-[#1A1118] dark:hover:text-[#FFFCF8] rounded-md hover:bg-white dark:hover:bg-[#1A1118] transition-colors cursor-pointer" title="Previous Tip" type="button">
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-[9px] font-mono font-bold px-1.5 text-gray-400 dark:text-gray-500">
                      {currentTipIndex + 1}/{PRO_TIPS.length}
                    </span>
                    <button onClick={handleNextTip} className="p-1 text-gray-400 hover:text-[#1A1118] dark:hover:text-[#FFFCF8] rounded-md hover:bg-white dark:hover:bg-[#1A1118] transition-colors cursor-pointer" title="Next Tip" type="button">
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1 relative z-10 animate-fade-in">
                <h4 className="text-xs font-bold text-[#1A1118] dark:text-[#FFFCF8] flex items-center gap-1.5">
                  {PRO_TIPS[currentTipIndex].title}
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                  {PRO_TIPS[currentTipIndex].content}
                </p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Search by name, city, or interests..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/15 pl-11 pr-4 py-3.5 rounded-2xl shadow-sm outline-hidden focus:border-[#8B0020] dark:focus:border-[#C9A84C] focus:ring-1 focus:ring-[#8B0020]/20 dark:focus:ring-[#C9A84C]/20 text-sm text-gray-800 dark:text-[#FFFCF8]" />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
              <button onClick={() => setFilterType('all')} className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${filterType === 'all' ? 'bg-[#1A1118] dark:bg-[#8B0020] border-[#1A1118] dark:border-[#8B0020] text-white' : 'bg-white dark:bg-[#1A1118] border-[#EDE6D9] dark:border-[#C9A84C]/15 text-gray-600 dark:text-gray-400 hover:border-gray-300'}`}>
                All ({profiles.length})
              </button>
              <button onClick={() => setFilterType('recent')} className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${filterType === 'recent' ? 'bg-[#1A1118] dark:bg-[#8B0020] border-[#1A1118] dark:border-[#8B0020] text-white' : 'bg-white dark:bg-[#1A1118] border-[#EDE6D9] dark:border-[#C9A84C]/15 text-gray-600 dark:text-gray-400 hover:border-gray-300'}`}>
                ⚡ Active
              </button>
              <button onClick={() => setFilterType('verified')} className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${filterType === 'verified' ? 'bg-[#1A1118] dark:bg-[#8B0020] border-[#1A1118] dark:border-[#8B0020] text-white' : 'bg-white dark:bg-[#1A1118] border-[#EDE6D9] dark:border-[#C9A84C]/15 text-gray-600 dark:text-gray-400 hover:border-gray-300'}`}>
                Verified
              </button>
              {unlockedIds.length > 0 && (
                <button onClick={() => setFilterType('unlocked')} className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${filterType === 'unlocked' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white dark:bg-[#1A1118] border-[#EDE6D9] dark:border-[#C9A84C]/15 text-emerald-700 dark:text-emerald-400 hover:border-emerald-300'}`}>
                  Unlocked ({unlockedIds.length})
                </button>
              )}
            </div>

            <div className="bg-[#F8F4ED] dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl p-3 text-gray-700 dark:text-gray-300 text-xs leading-relaxed flex items-start gap-2.5">
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
              <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl py-16 px-4 text-center max-w-xl mx-auto space-y-3">
                <div className="bg-[#F8F4ED] dark:bg-[#120A0E] text-gray-400 p-4 rounded-full w-14 h-14 flex items-center justify-center mx-auto text-xl font-bold">?</div>
                <h3 className="font-bold text-[#1A1118] dark:text-[#FFFCF8] text-lg">No Matches Found</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">Try different filters or locations.</p>
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
