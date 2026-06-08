import React, { useMemo, useState } from 'react';
import { Profile, PaymentRequest } from '../types';
import { MapPin, Lock, Phone, MessageCircle, Sparkles, Heart, Search, Filter, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const INTENT_BADGE: Record<string, { label: string; cls: string }> = {
  'True Relationship': { label: '❤️ True Relationship', cls: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  'Friendship': { label: '🤝 Friendship', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  'Friends with Benefits': { label: '💕 FWB', cls: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  'Only Sex': { label: '🔥 Only Sex', cls: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
};

interface ProfileListingProps {
  profiles: Profile[];
  currentUser: Profile;
  unlockedIds: string[];
  pendingPayments: PaymentRequest[];
  onUnlockClick: (profile: Profile) => void;
  onViewProfile?: (profile: Profile) => void;
}

export default function ProfileListing({
  profiles,
  currentUser,
  unlockedIds,
  pendingPayments,
  onUnlockClick,
  onViewProfile,
}: ProfileListingProps) {
  const { t } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIntent, setFilterIntent] = useState<string>('All');
  const [filterCity, setFilterCity] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const targetGender = currentUser.lookingFor || (currentUser.gender === 'Male' ? 'Female' : 'Male');

  const filteredProfiles = useMemo(() => {
    return profiles
      .filter((p) => p.id !== currentUser.id && p.gender === targetGender)
      .filter((p) => {
        const q = searchQuery.toLowerCase();
        if (q && !p.name.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q) && !(p.address || '').toLowerCase().includes(q)) return false;
        if (filterIntent !== 'All' && p.relationshipIntent !== filterIntent) return false;
        if (filterCity !== 'All' && p.city !== filterCity) return false;
        return true;
      });
  }, [profiles, currentUser, targetGender, searchQuery, filterIntent, filterCity]);

  const cities = useMemo(() => {
    const set = new Set<string>();
    profiles.forEach((p) => set.add(p.city));
    return ['All', ...Array.from(set)];
  }, [profiles]);

  const intents = ['All', 'True Relationship', 'Friendship', 'Friends with Benefits', 'Only Sex'];

  return (
    <div className="bg-[#FFFCF8] dark:bg-[#120A0E] min-h-screen transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Heart className="h-5 w-5 text-[#8B0020] dark:text-[#C9A84C]" />
            <h1 className="text-2xl sm:text-3xl font-black text-[#1A1118] dark:text-[#FFFCF8] tracking-tight">
              {targetGender === 'Female' ? t('profile-listing.women') : t('profile-listing.men')} {t('profile-listing.near-you')}
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {filteredProfiles.length} {t('profile-listing.profiles-found')}
            {currentUser.gender === 'Female' && (
              <span className="ml-2 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] font-bold">{t('profile-listing.free-women')}</span>
            )}
            {currentUser.gender === 'Male' && (
              <span className="ml-2 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-[10px] font-bold">{t('profile-listing.per-unlock')}</span>
            )}
          </p>
        </div>

        {/* Search + Filter bar */}
        <div className="flex gap-2 mb-4 max-w-xl mx-auto w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('profile-listing.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-sm text-gray-800 dark:text-[#FFFCF8] focus:outline-none focus:border-[#8B0020] dark:focus:border-[#C9A84C] transition-colors placeholder:text-gray-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-xs font-bold text-gray-600 dark:text-[#FFFCF8]/60 hover:border-[#8B0020] dark:hover:border-[#C9A84C] cursor-pointer transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">{t('profile-listing.filters')}</span>
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-4 mb-4 grid grid-cols-2 gap-3 shadow-sm max-w-xl mx-auto">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('profile-listing.intent')}</label>
              <select
                value={filterIntent}
                onChange={(e) => setFilterIntent(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl text-xs text-gray-800 dark:text-[#FFFCF8] focus:outline-none"
              >
                {intents.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('profile-listing.city')}</label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl text-xs text-gray-800 dark:text-[#FFFCF8] focus:outline-none"
              >
                {cities.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Intent chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mb-5 justify-start sm:justify-center max-w-xl mx-auto">
          {intents.map((intent) => (
            <button
              key={intent}
              onClick={() => setFilterIntent(intent)}
              className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all cursor-pointer border ${
                filterIntent === intent
                  ? 'bg-[#1A1118] dark:bg-[#8B0020] border-[#1A1118] dark:border-[#8B0020] text-white'
                  : 'bg-white dark:bg-[#1A1118] border-[#EDE6D9] dark:border-[#C9A84C]/15 text-gray-600 dark:text-gray-400 hover:border-gray-300'
              }`}
            >
              {intent === 'All' ? t('profile-listing.all-types') : intent}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filteredProfiles.map((profile) => {
              const isUnlocked = unlockedIds.includes(profile.id);
              const pending = pendingPayments.find((p) => p.profileId === profile.id && p.status === 'Pending');
              const badge = INTENT_BADGE[profile.relationshipIntent] || INTENT_BADGE['Friendship'];
              return (
                <ProfileListCard
                  key={profile.id}
                  profile={profile}
                  isUnlocked={isUnlocked}
                  pending={pending}
                  userGender={currentUser.gender}
                  badge={badge}
                  onUnlockClick={onUnlockClick}
                  onViewProfile={onViewProfile}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[#F8F4ED] dark:bg-[#1A1118] flex items-center justify-center mx-auto mb-4 text-2xl">👀</div>
            <h3 className="font-bold text-[#1A1118] dark:text-[#FFFCF8] text-lg">{t('profile-listing.no-results')}</h3>
            <p className="text-xs text-gray-500 mt-1">{t('profile-listing.no-results-desc')}</p>
            <button
              onClick={() => { setSearchQuery(''); setFilterIntent('All'); setFilterCity('All'); }}
              className="mt-4 px-4 py-2 bg-[#8B0020] hover:bg-[#B31B3A] text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
            >
              {t('profile-listing.clear-filters')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Individual profile card ── */
interface ProfileListCardProps {
  key?: React.Key;
  profile: Profile;
  isUnlocked: boolean;
  pending: PaymentRequest | undefined;
  userGender: 'Male' | 'Female';
  badge: { label: string; cls: string };
  onUnlockClick: (p: Profile) => void;
  onViewProfile?: (p: Profile) => void;
}

function ProfileListCard({
  profile, isUnlocked, pending, userGender, badge, onUnlockClick, onViewProfile
}: ProfileListCardProps) {
  const isFemaleUser = userGender === 'Female';
  const { t } = useAppContext();

  return (
    <div className="bg-white dark:bg-[#1A1118] rounded-2xl border border-[#EDE6D9] dark:border-[#C9A84C]/10 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#C9A84C]/30 dark:hover:border-[#C9A84C]/20 transition-all duration-400 flex flex-col group">
      {/* Photo */}
      <div
        className={`relative pt-[125%] w-full bg-gray-100 dark:bg-[#120A0E] overflow-hidden ${onViewProfile ? 'cursor-pointer' : ''}`}
        onClick={onViewProfile ? () => onViewProfile(profile) : undefined}
      >
        <img
          src={profile.image}
          alt={profile.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent" />
        {/* Status */}
        <div className="absolute top-2 left-2 flex gap-1">
          {profile.status === 'Online' && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-white">{t('profile-card.online')}</span>}
          {profile.verified && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#C9A84C] text-[#1A1118]">✓</span>}
        </div>
        {/* Name overlay */}
        <div className="absolute bottom-2 left-2 right-2 text-white">
          <p className="text-sm font-bold leading-tight truncate">{profile.name}, {profile.age}</p>
          <p className="text-[10px] text-white/60 flex items-center gap-0.5 mt-0.5 truncate">
            <MapPin className="h-2.5 w-2.5 shrink-0" />
            {profile.address ? `${profile.address}, ` : ''}{profile.city}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col grow">
        {/* Intent badge */}
        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border mb-2 ${badge.cls}`}>
          {badge.label}
        </span>

        {/* Contact area */}
        <div className="mt-auto pt-2 border-t border-[#EDE6D9] dark:border-[#C9A84C]/10">
          {isUnlocked ? (
            <div className="space-y-1.5 bg-[#F8F4ED] dark:bg-[#120A0E] rounded-xl p-2.5 border border-[#EDE6D9] dark:border-[#C9A84C]/10">
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                <Sparkles className="h-3 w-3" /> {t('profile-listing.unlocked')}
              </div>
              <a href={`tel:${profile.contactInfo.phone}`} className="flex items-center gap-1.5 text-[10px] text-gray-700 dark:text-gray-300 hover:text-[#8B0020] dark:hover:text-[#C9A84C] transition-colors">
                <Phone className="h-3 w-3 text-[#8B0020] dark:text-[#C9A84C] shrink-0" />
                <span className="truncate">{profile.contactInfo.phone}</span>
              </a>
              <a href={`https://t.me/${profile.contactInfo.telegram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] text-gray-700 dark:text-gray-300 hover:text-[#8B0020] dark:hover:text-[#C9A84C] transition-colors">
                <MessageCircle className="h-3 w-3 text-[#8B0020] dark:text-[#C9A84C] shrink-0" />
                <span className="truncate">{profile.contactInfo.telegram}</span>
              </a>
            </div>
          ) : pending ? (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl px-2.5 py-2 text-[10px] text-amber-700 dark:text-amber-300 text-center">
              <p className="font-bold">{t('profile-listing.pending')}</p>
              <p className="text-[9px] opacity-70 mt-0.5">TxID: {pending.transactionId}</p>
            </div>
          ) : (
            <button
              id={`see-contact-${profile.id}`}
              onClick={() => onUnlockClick(profile)}
              className="w-full py-2.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm"
              style={{
                background: isFemaleUser
                  ? 'linear-gradient(135deg, #059669, #10b981)'
                  : 'linear-gradient(135deg, #8B0020, #B31B3A)',
                color: 'white',
                boxShadow: isFemaleUser ? '0 4px 12px rgba(5,150,105,0.25)' : '0 4px 12px rgba(139,0,32,0.25)',
              }}
            >
              <Lock className="h-3 w-3" />
              {t('profile-card.see-contact')}
              {isFemaleUser ? (
                <span className="text-[8px] bg-white/20 px-1 py-0.5 rounded-md font-extrabold">{t('profile-listing.free')}</span>
              ) : (
                <span className="text-[8px] bg-white/20 px-1 py-0.5 rounded-md font-extrabold">200 ETB</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
