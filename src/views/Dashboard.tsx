import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, AlertCircle, Star, Sliders, CheckSquare, Square, RefreshCw, Lightbulb, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import { Profile } from '../types';
import ProfileCard from '../components/ProfileCard';
import { useAppContext } from '../context/AppContext';

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
      return 'bg-[#EB317A]/5 dark:bg-[#EB317A]/15 text-[#EB317A] dark:text-[#C9A84C] border-[#EB317A]/20 dark:border-[#C9A84C]/30';
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
  hasPaid: boolean;
  userGender: 'Male' | 'Female';
  userLookingFor: 'Male' | 'Female';
  isLoggedIn: boolean;
  onMakePayment?: (profile: Profile) => void;
}

export default function Dashboard({
  profiles, hasPaid, userGender, userLookingFor, isLoggedIn, onMakePayment
}: DashboardProps) {
  const { t } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [filterType, setFilterType] = useState<'all' | 'recent' | 'verified' | 'unlocked'>('all');
  const [ageRange, setAgeRange] = useState<number>(35);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

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
    setFilterType('all');
    setAgeRange(35);
    setSelectedInterests([]);
  };

  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            profile.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            profile.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity === 'All' || profile.city === selectedCity;
      const matchesAge = profile.age <= ageRange;

      let matchesCategory = true;
      if (filterType === 'recent') {
        matchesCategory = profile.status === 'Recently Active' || profile.status === 'Online';
      } else if (filterType === 'verified') {
        matchesCategory = profile.verified;
      }

      const matchesInterests = selectedInterests.length === 0 ||
                               profile.interests.some(interest => selectedInterests.includes(interest));
      const matchesGender = isLoggedIn ? profile.gender === userLookingFor : true;

      return matchesSearch && matchesCity && matchesAge && matchesCategory && matchesInterests && matchesGender;
    });
  }, [profiles, searchQuery, selectedCity, filterType, ageRange, selectedInterests, userLookingFor, isLoggedIn]);

  const filtersContent = (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">City</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" />
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full pl-9 pr-4 py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl bg-white dark:bg-[#1A1118] text-sm text-gray-800 dark:text-[#FFFCF8] focus:outline-hidden focus:border-[#EB317A] dark:focus:border-[#C9A84C] appearance-none">
            {cities.map((city) => (<option key={city} value={city}>{city}</option>))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">Max Age</label>
          <span className="text-xs font-bold text-[#EB317A] dark:text-[#C9A84C] bg-[#EB317A]/5 dark:bg-[#EB317A]/15 border border-[#EB317A]/20 dark:border-[#C9A84C]/20 px-2 py-0.5 rounded-md">{ageRange}</span>
        </div>
        <input type="range" min="18" max="50" value={ageRange} onChange={(e) => setAgeRange(Number(e.target.value))} className="w-full accent-[#EB317A] h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" />
        <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 font-medium">
          <span>18</span>
          <span>35</span>
          <span>50</span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">Interests</label>
        <div className="max-h-[200px] overflow-y-auto space-y-1.5 pr-1 border border-[#EDE6D9] dark:border-[#C9A84C]/10 p-2.5 rounded-xl bg-[#F8F4ED]/50 dark:bg-[#120A0E]/50">
          {allInterests.map((interest) => {
            const isChecked = selectedInterests.includes(interest);
            return (
              <button key={interest} type="button" onClick={() => toggleInterest(interest)} className="flex items-center gap-2.5 w-full text-left text-xs text-gray-600 dark:text-gray-400 hover:text-[#1A1118] dark:hover:text-[#FFFCF8] py-1.5 cursor-pointer transition-colors font-medium">
                {isChecked ? <CheckSquare className="h-4.5 w-4.5 text-[#EB317A] dark:text-[#C9A84C] shrink-0" /> : <Square className="h-4.5 w-4.5 text-gray-300 dark:text-gray-600 shrink-0" />}
                <span>{interest}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-[#F8F4ED] dark:bg-[#120A0E] rounded-2xl p-4 border border-[#C9A84C]/20 dark:border-[#C9A84C]/10">
        <p className="text-[11px] font-bold text-[#EB317A] dark:text-[#C9A84C] uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
          <Star className="h-3.5 w-3.5 text-[#C9A84C]" />
          Want more matches?
        </p>
        <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
          Keep your profile active & verify your payment to unlock more connections.
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FFFCF8] dark:bg-[#120A0E] min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1A1118] dark:text-[#FFFCF8] tracking-tight">{t('dashboard.discover')}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{filteredProfiles.length} {t('dashboard.matches-available')}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-1.5 text-xs font-bold text-[#EB317A] dark:text-[#C9A84C] bg-[#EB317A]/5 dark:bg-[#EB317A]/15 border border-[#EB317A]/20 dark:border-[#C9A84C]/20 rounded-xl px-3.5 py-2.5 cursor-pointer transition-colors">
              <Filter className="h-4 w-4" />
              {t('dashboard.filters')}
            </button>
            <button onClick={handleResetFilters} className="flex items-center gap-1 text-xs font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl px-3.5 py-2.5 cursor-pointer transition-colors">
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t('dashboard.reset')}</span>
            </button>
          </div>
        </div>

        {/* Mobile filter drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1A1118] rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 pb-8 animate-slide-up shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-[#1A1118] dark:text-[#FFFCF8] flex items-center gap-2 uppercase tracking-wider">
                  <Sliders className="h-4.5 w-4.5 text-[#EB317A] dark:text-[#C9A84C]" />
                  Filters
                </h3>
                <button onClick={() => setShowFilters(false)} className="p-2 text-gray-400 hover:text-[#1A1118] dark:hover:text-[#FFFCF8] cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {filtersContent}
              <button onClick={() => setShowFilters(false)} className="w-full mt-5 py-3.5 bg-[#EB317A] text-white font-bold text-sm rounded-xl cursor-pointer">
                Apply Filters
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-8 items-start">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-72 shrink-0 bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-5 shadow-sm lg:sticky lg:top-20">
            <h3 className="text-sm font-bold text-[#1A1118] dark:text-[#FFFCF8] flex items-center gap-2 uppercase tracking-wider pb-4 mb-4 border-b border-[#EDE6D9] dark:border-[#C9A84C]/10">
              <Sliders className="h-4.5 w-4.5 text-[#EB317A] dark:text-[#C9A84C]" />
              Filters
            </h3>
            {filtersContent}
          </div>

          <div className="flex-1 min-w-0 space-y-5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Search by name, city..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/15 pl-11 pr-4 py-3.5 rounded-2xl shadow-sm outline-hidden focus:border-[#EB317A] dark:focus:border-[#C9A84C] focus:ring-1 focus:ring-[#EB317A]/20 dark:focus:ring-[#C9A84C]/20 text-sm text-gray-800 dark:text-[#FFFCF8]" />
            </div>

            {/* Filter chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button onClick={() => setFilterType('all')} className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${filterType === 'all' ? 'bg-[#1A1118] dark:bg-[#EB317A] border-[#1A1118] dark:border-[#EB317A] text-white' : 'bg-white dark:bg-[#1A1118] border-[#EDE6D9] dark:border-[#C9A84C]/15 text-gray-600 dark:text-gray-400 hover:border-gray-300'}`}>
                All ({profiles.length})
              </button>
              <button onClick={() => setFilterType('recent')} className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${filterType === 'recent' ? 'bg-[#1A1118] dark:bg-[#EB317A] border-[#1A1118] dark:border-[#EB317A] text-white' : 'bg-white dark:bg-[#1A1118] border-[#EDE6D9] dark:border-[#C9A84C]/15 text-gray-600 dark:text-gray-400 hover:border-gray-300'}`}>
                Active
              </button>
              <button onClick={() => setFilterType('verified')} className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${filterType === 'verified' ? 'bg-[#1A1118] dark:bg-[#EB317A] border-[#1A1118] dark:border-[#EB317A] text-white' : 'bg-white dark:bg-[#1A1118] border-[#EDE6D9] dark:border-[#C9A84C]/15 text-gray-600 dark:text-gray-400 hover:border-gray-300'}`}>
                Verified
              </button>
            </div>

            {/* Pro Tips - collapsible on mobile */}
            <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden">
              <div className="absolute -right-2 -bottom-2 text-[#C9A84C]/5 dark:text-[#C9A84C]/10 rotate-12 pointer-events-none">
                <Lightbulb className="h-24 w-24 sm:h-32 sm:w-32" />
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-[#EDE6D9] dark:border-[#C9A84C]/10 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#EB317A]/5 dark:bg-[#EB317A]/15 rounded-lg text-[#EB317A] dark:text-[#C9A84C] shrink-0">
                    <Lightbulb className="h-4.5 w-4.5" />
                  </div>
                  <p className="text-xs font-bold text-[#1A1118] dark:text-[#FFFCF8] uppercase tracking-wider">Tip</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border tracking-wider uppercase ${getTagBadgeStyles(PRO_TIPS[currentTipIndex].color)}`}>
                    {PRO_TIPS[currentTipIndex].tag}
                  </span>
                  <div className="flex items-center border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-lg p-0.5 bg-[#F8F4ED]/50 dark:bg-[#120A0E]/50">
                    <button onClick={handlePrevTip} className="p-1 text-gray-400 hover:text-[#1A1118] dark:hover:text-[#FFFCF8] rounded-md cursor-pointer" type="button">
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-[9px] font-mono font-bold px-1.5 text-gray-400 dark:text-gray-500">{currentTipIndex + 1}/{PRO_TIPS.length}</span>
                    <button onClick={handleNextTip} className="p-1 text-gray-400 hover:text-[#1A1118] dark:hover:text-[#FFFCF8] rounded-md cursor-pointer" type="button">
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-1 relative z-10">
                <h4 className="text-xs font-bold text-[#1A1118] dark:text-[#FFFCF8]">{PRO_TIPS[currentTipIndex].title}</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-light">{PRO_TIPS[currentTipIndex].content}</p>
              </div>
            </div>

            {/* Info banner */}
            <div className="bg-[#F8F4ED] dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl p-3 text-gray-700 dark:text-gray-300 text-xs leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-[#C9A84C] shrink-0 mt-0.5" />
              <div>
                {isLoggedIn ? (
                  <><span className="font-bold">Viewing as {userGender}.</span> Unlock contacts for free and connect instantly.</>
                ) : (
                  <><span className="font-bold">Browsing all profiles.</span> Sign in to unlock contacts and connect.</>
                )}
              </div>
            </div>

            {/* Profiles grid */}
            {filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredProfiles.map((profile) => {
                  const showContact = hasPaid;
                  return (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      showContact={showContact}
                      userGender={userGender}
                      onMakePayment={onMakePayment}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl py-16 px-4 text-center max-w-xl mx-auto space-y-3">
                <div className="bg-[#F8F4ED] dark:bg-[#120A0E] text-gray-400 p-4 rounded-full w-14 h-14 flex items-center justify-center mx-auto text-xl font-bold">?</div>
                <h3 className="font-bold text-[#1A1118] dark:text-[#FFFCF8] text-lg">No Matches Found</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">Try different filters or locations.</p>
                <button onClick={handleResetFilters} className="px-4 py-2.5 bg-[#EB317A] hover:bg-[#F04B8E] text-white font-semibold text-xs rounded-lg shadow-sm cursor-pointer transition-all">Show All Profiles</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
