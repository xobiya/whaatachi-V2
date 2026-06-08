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
      return 'bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-950/30 dark:text-pink-400 dark:border-pink-900/30';
    case 'amber':
      return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-955/35 dark:text-amber-400 dark:border-amber-900/30';
    case 'blue':
      return 'bg-blue-50 text-blue-700 border-blue-105 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30';
    case 'emerald':
      return 'bg-emerald-50 text-emerald-700 border-emerald-110 dark:bg-emerald-955/30 dark:text-emerald-400 dark:border-emerald-900/30';
    case 'purple':
      return 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/30';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
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
    <div className="bg-gray-50 dark:bg-slate-950 py-10 transition-colors duration-200" id="discover-dashboard-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight flex items-center gap-2">
              Discover Authentic Connections
            </h1>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-light mt-1">
              Find serious, verified Habesha matches sharing your interests and regional location.
            </p>
          </div>

          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-750 bg-pink-50 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/30 rounded-lg px-3.5 py-2 cursor-pointer transition-colors shrink-0"
          >
            <RefreshCw className="h-3.5 w-3.5 animate-spin-slow" />
            Reset Filters
          </button>
        </div>

        {/* Dashboard Grid split into Sidebar filters and profile feed */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Sidebar controls */}
          <div className="col-span-1 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl p-5 space-y-6 shadow-3xs lg:sticky lg:top-20 transition-colors">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-wider pb-3 border-b border-gray-100 dark:border-slate-800">
              <Sliders className="h-4.5 w-4.5 text-pink-500" />
              Advanced Filters
            </h3>

            {/* Gender Switcher filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-350 uppercase tracking-wider">Candidate Gender</label>
              <div className="grid grid-cols-3 bg-gray-50 dark:bg-slate-850 border border-gray-150 dark:border-slate-800 rounded-xl p-1 gap-1">
                {['All', 'Men', 'Women'].map((genderOption) => {
                  const isSelect = 
                    (genderOption === 'All' && selectedGenderFilter === 'All') ||
                    (genderOption === 'Men' && selectedGenderFilter === 'Male') ||
                    (genderOption === 'Women' && selectedGenderFilter === 'Female');
                  
                  return (
                    <button
                      key={genderOption}
                      type="button"
                      onClick={() => {
                        setSelectedGenderFilter(genderOption === 'All' ? 'All' : (genderOption === 'Men' ? 'Male' : 'Female'));
                      }}
                      className={`py-1.5 text-center text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        isSelect
                          ? 'bg-pink-500 text-white shadow-xs'
                          : 'text-gray-500 dark:text-slate-400 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      {genderOption}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-350 uppercase tracking-wider">Ethiopian City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400 dark:text-slate-500" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-slate-750 hover:border-gray-300 dark:hover:border-slate-650 rounded-xl bg-gray-50/50 dark:bg-slate-850 text-sm text-gray-800 dark:text-slate-200 focus:outline-hidden focus:border-pink-500"
                >
                  {cities.map((city) => (
                    <option key={city} value={city} className="bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200">{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Intent selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-350 uppercase tracking-wider">Matching Rhythm</label>
              <select
                value={selectedIntent}
                onChange={(e) => setSelectedIntent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 dark:border-slate-755 hover:border-gray-300 dark:hover:border-slate-650 rounded-xl bg-gray-50/50 dark:bg-slate-850 text-sm text-gray-850 dark:text-slate-200 focus:outline-hidden focus:border-pink-500"
              >
                {intents.map((intent) => (
                  <option key={intent} value={intent} className="bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200">{intent === 'All' ? 'All Intents' : intent}</option>
                ))}
              </select>
            </div>

            {/* Age Range scale */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-700 dark:text-slate-350 uppercase tracking-wider">Maximum Age</label>
                <span className="text-xs font-bold text-pink-600 bg-pink-50 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/30 px-2 py-0.5 rounded-md">{ageRange} Years</span>
              </div>
              <input
                type="range"
                min="18"
                max="50"
                value={ageRange}
                onChange={(e) => setAgeRange(Number(e.target.value))}
                className="w-full accent-pink-600 dark:accent-pink-500 h-1.5 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 dark:text-slate-500 font-medium">
                <span>18</span>
                <span>35</span>
                <span>50</span>
              </div>
            </div>

            {/* Interests checklist */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-350 uppercase tracking-wider">Tag Interests</label>
              <div className="max-h-[160px] overflow-y-auto space-y-1.5 scrollbar-thin pr-1 border border-gray-100 dark:border-slate-800 p-2.5 rounded-xl bg-gray-50/50 dark:bg-slate-850/50">
                {allInterests.map((interest) => {
                  const isChecked = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className="flex items-center gap-2.5 w-full text-left text-xs text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 py-1 cursor-pointer transition-colors font-medium"
                    >
                      {isChecked ? (
                        <CheckSquare className="h-4.5 w-4.5 text-pink-500 shrink-0" />
                      ) : (
                        <Square className="h-4.5 w-4.5 text-gray-300 dark:text-slate-650 shrink-0" />
                      )}
                      <span>{interest}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Update Profile Reminder block */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-955/10 rounded-2xl p-4 border border-pink-100 dark:border-pink-900/30">
              <p className="text-[11px] font-extrabold text-pink-800 dark:text-pink-300 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                <Star className="h-3.5 w-3.5 fill-pink-500 text-pink-500" />
                Want more matches?
              </p>
              <p className="text-[10px] text-pink-650/95 dark:text-pink-350/90 leading-relaxed font-light">
                Keep your profile description active & verify your bank transfer code to boost system matching weights!
              </p>
            </div>

          </div>

          {/* Profile results deck */}
          <div className="col-span-1 lg:col-span-3 space-y-6">
            
            {/* Contextual rotating 'Pro Tip' box */}
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800/80 rounded-2xl p-5 shadow-3xs relative overflow-hidden transition-all" id="dashboard-pro-tip-carousel">
              {/* Subtle ambient lightbulb icon background */}
              <div className="absolute -right-2 -bottom-2 text-pink-500/5 dark:text-pink-500/[0.025] transform rotate-12 pointer-events-none select-none">
                <Lightbulb className="h-32 w-32" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800/60 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-pink-50 dark:bg-pink-950/30 rounded-lg text-pink-600 dark:text-pink-400 shrink-0">
                    <Lightbulb className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider font-sans">
                      Whaatachi Dashboard Pro-Tips
                    </h3>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 font-light font-mono">
                      Rotating contextual guidance for Habesha singles
                    </p>
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
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search candidates by name, location, interests, or bio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 pl-11 pr-4 py-3.5 rounded-2xl shadow-3xs outline-hidden focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm text-gray-850 dark:text-white dark:placeholder-slate-500 transition-colors"
              />
            </div>

            {/* Horizontal filter chips slider */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  filterType === 'all'
                    ? 'bg-gray-900 border-gray-900 dark:bg-white dark:border-white text-white dark:text-slate-950'
                    : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-700'
                }`}
              >
                All Profiles ({profiles.length})
              </button>
              
              <button
                onClick={() => setFilterType('recent')}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  filterType === 'recent'
                    ? 'bg-gray-900 border-gray-900 dark:bg-white dark:border-white text-white dark:text-slate-950'
                    : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-700'
                }`}
              >
                ⚡ Recently Active
              </button>

              <button
                onClick={() => setFilterType('verified')}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  filterType === 'verified'
                    ? 'bg-gray-900 border-gray-900 dark:bg-white dark:border-white text-white dark:text-slate-950'
                    : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-700'
                }`}
              >
                🛡️ Verified Only
              </button>

              {unlockedIds.length > 0 && (
                <button
                  onClick={() => setFilterType('unlocked')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                    filterType === 'unlocked'
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 hover:border-emerald-350 dark:hover:border-slate-700'
                  }`}
                >
                  🔓 Unlocked Contacts ({unlockedIds.length})
                </button>
              )}
            </div>

            {/* Quick gender help banner */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-xl p-3 text-blue-850 dark:text-blue-300 text-[11px] leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Viewing as: {userGender} candidate.</span>{' '}
                {userGender === 'Male' ? (
                  <span>Men cover a 200 ETB fee. To see what Whaatachi looks like as a female user (free instant reveals), toggle the Gender switcher in the header!</span>
                ) : (
                  <span>Women can unlock any contact profile details for completely FREE. Explore without transaction thresholds.</span>
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
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl py-16 px-4 text-center max-w-xl mx-auto space-y-3 transition-colors">
                <div className="bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 p-4 rounded-full w-14 h-14 flex items-center justify-center mx-auto text-xl font-bold">
                  ?
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">No Matching Cohorts Found</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-light max-w-sm mx-auto leading-relaxed">
                  Try relaxing your structural side selectors, resetting maximum age scale, or checking different Ethiopian locations.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-semibold text-xs rounded-lg shadow-xs hover:shadow-md cursor-pointer transition-all"
                >
                  Show All Active Profiles
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
