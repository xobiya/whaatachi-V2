import React, { useState } from 'react';
import { 
  Heart, Sparkles, MapPin, CheckCircle, ShieldCheck, 
  Edit2, Check, ArrowRight, MessageSquare, Flame, 
  Award, Lightbulb, Users, Key, AlertCircle, RefreshCw 
} from 'lucide-react';
import { Profile } from '../types';

interface HomeLoggedInProps {
  currentUser: Profile | null;
  onUpdateBio: (newBio: string) => void;
  onUpdateStatus: (newStatus: 'Online' | 'Offline' | 'Recently Active') => void;
  unlockedCount: number;
  onGoToMatches: () => void;
  onGoToHistory: () => void;
  onUnlockClick: (profile: Profile) => void;
  profiles: Profile[];
  unlockedIds: string[];
}

export default function HomeLoggedIn({
  currentUser,
  onUpdateBio,
  onUpdateStatus,
  unlockedCount,
  onGoToMatches,
  onGoToHistory,
  onUnlockClick,
  profiles,
  unlockedIds
}: HomeLoggedInProps) {
  // If no current user is provided, show fallback loading or template
  const user: Profile = currentUser || {
    id: 'placeholder-usr',
    name: 'Habesha Connector',
    age: 25,
    city: 'Addis Ababa',
    bio: 'Looking for a genuine connection and sharing interesting coffee stories.',
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=85',
    status: 'Online',
    relationshipIntent: 'True Relationship',
    interests: ['Ethio Coffee', 'Dating Out'],
    verified: true,
    contactInfo: {
      phone: '0911223344',
      telegram: 'habeshaconnect',
      instagram: '@habeshaconnect',
      email: 'habesha@example.com'
    }
  };

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState(user.bio);
  const [selectedStatus, setSelectedStatus] = useState<'Online' | 'Offline' | 'Recently Active'>(
    user.status as 'Online' | 'Offline' | 'Recently Active' || 'Online'
  );

  const handleSaveBio = () => {
    onUpdateBio(editedBio);
    setIsEditingBio(false);
  };

  const handleStatusChange = (status: 'Online' | 'Offline' | 'Recently Active') => {
    setSelectedStatus(status);
    onUpdateStatus(status);
  };

  // Find 3 premium recommended matches of opposite gender
  const oppositeGender = user.gender === 'Male' ? 'Female' : 'Male';
  const recommendations = profiles
    .filter(p => p.gender === oppositeGender && p.id !== user.id)
    .slice(0, 3);

  // Quick stats calculations
  const totalVerifiedMatches = profiles.filter(p => p.gender === oppositeGender && p.verified).length;
  const matchRatio = totalVerifiedMatches > 0 ? Math.round((totalVerifiedMatches / profiles.filter(p => p.gender === oppositeGender).length) * 100) : 100;

  return (
    <div className="bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-slate-150 py-8 lg:py-12 transition-colors duration-200" id="home-logged-in-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Row 1: Premium Headline Greeting and Quick Welcome Cover */}
        <div className="relative bg-gradient-to-r from-pink-600/10 via-rose-500/5 to-transparent dark:from-pink-950/20 dark:via-rose-955/10 rounded-3xl p-6 sm:p-8 border border-pink-100/50 dark:border-pink-900/30 overflow-hidden shadow-2xs" id="welcome-greetings-canopy">
          {/* Decorative shapes */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-pink-500/10 dark:bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-rose-500/10 dark:bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 text-[10.5px] font-bold tracking-wide uppercase">
                <Sparkles className="h-3 w-3 animate-spin duration-3000 text-pink-500" />
                <span>Habesha Premium Portal Active</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                Selam, <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">{user.name}</span>!
              </h2>
              <p className="text-sm text-gray-650 dark:text-slate-350 max-w-xl font-light leading-relaxed">
                Welcome back to your private dashboard. Your identity vectors are fully protected. Explore verified profiles in Addis Ababa, customize your matching mood, and unlock serious Telegram contact handles safely.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold pt-1">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-450">
                  <CheckCircle className="h-4 w-4" /> Account Verified
                </span>
                <span className="flex items-center gap-1 text-pink-600 dark:text-pink-400">
                  <Flame className="h-4 w-4" /> Lifetime Matchmaker Access
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={onGoToMatches}
                className="w-full sm:w-auto py-3.5 px-6 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5"
              >
                <Users className="h-4.5 w-4.5" />
                <span>Browse All Matches</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <button
                onClick={onGoToHistory}
                className="w-full sm:w-auto py-3.5 px-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-850 text-gray-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Key className="h-4.5 w-4.5 text-pink-500" />
                <span>Unlocked contacts ({unlockedCount})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Grid of Quick Metrics (3 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="dashboard-hub-metrics">
          
          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800/80 rounded-2xl p-5 shadow-3xs flex items-center gap-4">
            <div className="p-3 bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 rounded-xl">
              <Key className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-slate-500">Unlocked Private Keys</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{unlockedCount}</p>
              <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1 font-light">
                Direct Telegram, telephone handles waiting in history
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800/80 rounded-2xl p-5 shadow-3xs flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-400 rounded-xl">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-slate-500">Verified Genders Match</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{totalVerifiedMatches}</p>
              <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1 font-light">
                {matchRatio}% of active {oppositeGender.toLowerCase()}s manually verified
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800/80 rounded-2xl p-5 shadow-3xs flex items-center gap-4">
            <div className="p-3 bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 rounded-xl">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-slate-500">Connection Trust Badge</p>
              <p className="text-sm font-black text-emerald-600 dark:text-emerald-450 uppercase mt-0.5 tracking-wider font-sans">Gold Level Status</p>
              <p className="text-[10px] text-gray-550 dark:text-slate-400 mt-1.5 font-light leading-relaxed">
                No subscription. Pay CBE Birr/telebirr only when unlocking.
              </p>
            </div>
          </div>

        </div>

        {/* Row 3: Your Interactive Card (Left) vs Curated Matches Overview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Interactive Profile Customizer Card (4 columns) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs space-y-6 text-left" id="hub-interactive-card">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800/85 pb-4">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Your Identity Card</h3>
              <span className="text-[10px] text-pink-600 dark:text-pink-400 font-bold bg-pink-50 dark:bg-pink-955/30 px-2 py-0.5 rounded-md uppercase font-mono">
                {user.relationshipIntent}
              </span>
            </div>

            {/* Main Avatar & General Info Display */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative">
                <img 
                  src={user.image} 
                  alt={user.name} 
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-pink-500/80 shadow-md referrerPolicy"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white dark:border-slate-900 inline-block w-4 h-4 rounded-full"></span>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1">
                  <h4 className="text-base font-black text-gray-900 dark:text-slate-100">{user.name}, {user.age}</h4>
                  <ShieldCheck className="h-4.5 w-4.5 text-amber-500 fill-amber-500/25 shrink-0" />
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                  <span>{user.city}</span>
                </p>
              </div>
            </div>

            {/* Edit Mood / Status Selector */}
            <div className="space-y-2 border-t border-gray-100 dark:border-slate-800/70 pt-4">
              <label className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-slate-500">
                Your Status Mood
              </label>
              <div className="grid grid-cols-3 gap-1 bg-gray-50 dark:bg-slate-950/50 p-1 rounded-xl">
                {(['Online', 'Offline', 'Recently Active'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatusChange(status)}
                    className={`py-1 text-[10px] rounded-lg font-bold transition-all cursor-pointer ${
                      selectedStatus === status
                        ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-3xs'
                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {status === 'Online' ? 'Active' : status === 'Offline' ? 'Quiet' : 'Recent'}
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Bio copying */}
            <div className="space-y-2 border-t border-gray-100 dark:border-slate-800/70 pt-4">
              <div className="flex items-center justify-between">
                <label className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-slate-500">
                  Your Bio Copy (About You)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (isEditingBio) {
                      handleSaveBio();
                    } else {
                      setIsEditingBio(true);
                    }
                  }}
                  className="text-pink-600 dark:text-pink-400 hover:text-pink-700 text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  {isEditingBio ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Save
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-3 w-3" /> Edit
                    </>
                  )}
                </button>
              </div>

              {isEditingBio ? (
                <div className="space-y-2">
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-5 w-full bg-white dark:bg-slate-950/70 text-gray-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                    rows={4}
                    placeholder="Describe yourself to attract high verification matches..."
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditedBio(user.bio);
                        setIsEditingBio(false);
                      }}
                      className="py-1 px-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-[10.5px] font-bold rounded-lg cursor-pointer text-gray-600 dark:text-slate-350"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveBio}
                      className="py-1 px-3 bg-pink-605 bg-pink-600 hover:bg-pink-700 text-[10.5px] text-white font-extrabold rounded-lg cursor-pointer shadow-3xs"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-50/50 dark:bg-slate-950/20 border border-gray-100 dark:border-slate-800/60 rounded-xl">
                  <p className="text-xs text-gray-650 dark:text-slate-300 leading-relaxed font-light italic">
                    "{user.bio || "Write a detailed bio to complete your profile registration details!"}"
                  </p>
                </div>
              )}
            </div>

            {/* Account Details checklist */}
            <div className="space-y-2 border-t border-gray-100 dark:border-slate-800/70 pt-4">
              <label className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-slate-500">
                Locker Registration Data
              </label>
              <div className="space-y-2 font-mono text-[10.5px] text-gray-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Phone Account</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-200">
                    {user.contactInfo?.phone ? `${user.contactInfo.phone.substring(0, 4)}***${user.contactInfo.phone.slice(-3)}` : '091******44'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Telegram Handle</span>
                  <span className="font-semibold text-pink-600 dark:text-pink-400">
                    @{user.contactInfo?.telegram || 'user'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Block: Curated Matches Recommendations Overview (8 columns) */}
          <div className="lg:col-span-8 space-y-6 text-left" id="hub-recommendations-deck">
            
            {/* Direct matches title header bar */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
                  Curated Recommended Profiles Just for You
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-light">
                  Active verified {oppositeGender.toLowerCase()}s near {user.city} matched by compatibility
                </p>
              </div>

              <button
                type="button"
                onClick={onGoToMatches}
                className="text-xs text-pink-600 dark:text-pink-400 hover:text-pink-750 font-extrabold flex items-center gap-1 hover:underline cursor-pointer bg-pink-50 dark:bg-pink-955/20 px-3 py-1.5 rounded-xl border border-pink-100/30"
              >
                <span>View Filtered Board</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Recommendations Row/Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.length > 0 ? (
                recommendations.map((profile) => {
                  const isUnlockedStatus = unlockedIds.includes(profile.id);
                  return (
                    <div 
                      key={profile.id} 
                      className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-3xs flex flex-col justify-between hover:shadow-md transition-shadow group duration-200"
                    >
                      <div className="relative pt-[100%] bg-gray-100 dark:bg-slate-950 overflow-hidden">
                        <img 
                          src={profile.image} 
                          alt={profile.name} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                        
                        {/* Live active Indicator */}
                        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-full font-bold">
                          <span className={`h-1.5 w-1.5 rounded-full ${profile.status === 'Online' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          <span>{profile.status}</span>
                        </div>

                        {profile.verified && (
                          <span className="absolute top-3 right-3 bg-amber-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md">
                            Verified
                          </span>
                        )}

                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <p className="font-extrabold text-base leading-tight">
                            {profile.name}, {profile.age}
                          </p>
                          <p className="text-[10px] text-slate-205 flex items-center gap-0.5 mt-0.5 font-light">
                            <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                            <span>{profile.city}</span>
                          </p>
                        </div>
                      </div>

                      <div className="p-4 flex flex-col justify-between grow space-y-3">
                        <p className="text-xs text-gray-550 dark:text-slate-350 line-clamp-2 italic font-light">
                          "{profile.bio}"
                        </p>

                        <div className="flex flex-wrap gap-1">
                          {profile.interests.slice(0, 2).map((interest, idx) => (
                            <span 
                              key={idx} 
                              className="text-[9.5px] font-bold px-1.5 py-0.5 bg-gray-51 dark:bg-slate-800/80 rounded-md text-gray-500 dark:text-slate-400 border border-gray-100 dark:border-slate-800"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => onUnlockClick(profile)}
                          className={`mt-2 w-full py-2.5 text-center text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            isUnlockedStatus
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200/50'
                              : 'bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-955/20 text-pink-600 dark:text-pink-400 hover:from-pink-100 dark:hover:from-pink-900/35 border border-pink-100/20'
                          }`}
                        >
                          {isUnlockedStatus ? (
                            <>
                              <ShieldCheck className="h-4 w-4" />
                              <span>View Contact Keys</span>
                            </>
                          ) : (
                            <>
                              <Key className="h-3.5 w-3.5 text-pink-500" />
                              <span>Unlock Private Locker</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full border border-dashed border-gray-200 dark:border-slate-850 p-12 text-center rounded-2xl bg-white dark:bg-slate-900">
                  <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">No profile matches available right now</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Try resetting your filters or profile intent settings.</p>
                </div>
              )}
            </div>

            {/* Educational Quick Tips / Advisory Box */}
            <div className="bg-amber-50/40 dark:bg-amber-955/5 border border-amber-200/40 dark:border-amber-900/10 rounded-2xl p-5 shadow-3xs flex items-start gap-3.5 relative overflow-hidden">
              <div className="p-2 bg-amber-500/10 rounded-xl shrink-0 text-amber-600 dark:text-amber-400 mt-0.5">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-955 dark:text-amber-300">
                  Safe Dating Connection Vector
                </h4>
                <p className="text-xs text-gray-655 dark:text-slate-350 leading-relaxed font-light">
                  To protect the Habesha standard, we strictly advise communicating on our digital verification board or direct Telegram before sharing direct house locations. Never transfer money to any candidates requesting visual aid or transportation fees. Report flag IDs instantly in the Support panel!
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
