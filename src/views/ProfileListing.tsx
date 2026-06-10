import React, { useMemo, useState } from 'react';
import { Profile } from '../types';
import { MapPin, Phone, Instagram, Heart, Search, Filter, X } from 'lucide-react';
import TelegramIcon from '../components/TelegramIcon';
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
  hasPaid: boolean;
  onMakePayment?: (profile: Profile) => void;
}

export default function ProfileListing({
  profiles,
  currentUser,
  hasPaid,
  onMakePayment,
}: ProfileListingProps) {
  const { t } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIntent, setFilterIntent] = useState<string | null>(currentUser.relationshipIntent);
  const [filterCity, setFilterCity] = useState<string | null>(null);
  const [usePreference, setUsePreference] = useState(false);
  const [ageMin, setAgeMin] = useState<number>(18);
  const [ageMax, setAgeMax] = useState<number>(60);
  const [showFilters, setShowFilters] = useState(false);

  const targetGender = currentUser.lookingFor || (currentUser.gender === 'Male' ? 'Female' : 'Male');

  const filteredProfiles = useMemo(() => {
    let list = profiles
      .filter((p) => p.gender === targetGender);

    if (usePreference) {
      const prefAgeMin = Math.max(18, currentUser.age - 5);
      const prefAgeMax = Math.min(60, currentUser.age + 5);
      list = list.filter((p) =>
        p.relationshipIntent === currentUser.relationshipIntent &&
        p.city === currentUser.city &&
        p.age >= prefAgeMin &&
        p.age <= prefAgeMax
      );
    } else {
      list = list.filter((p) => {
        const q = searchQuery.toLowerCase();
        if (q && !p.name.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q) && !(p.address || '').toLowerCase().includes(q)) return false;
        if (filterIntent !== null && p.relationshipIntent !== filterIntent) return false;
        if (filterCity !== null && p.city !== filterCity) return false;
        if (p.age < ageMin || p.age > ageMax) return false;
        return true;
      });
    }
    return list;
  }, [profiles, currentUser, targetGender, searchQuery, filterIntent, filterCity, usePreference, ageMin, ageMax]);

  const cities = useMemo(() => {
    const set = new Set<string>();
    profiles.forEach((p) => set.add(p.city));
    return ['All', ...Array.from(set)];
  }, [profiles]);

  const intents = useMemo(() => {
    const base = ['True Relationship', 'Friendship', 'Friends with Benefits', 'Only Sex'];
    return ['All', ...base.sort((a, b) => {
      if (a === currentUser.relationshipIntent) return -1;
      if (b === currentUser.relationshipIntent) return 1;
      return 0;
    })];
  }, [currentUser.relationshipIntent]);

  return (
    <div className="bg-[#FFFCF8] dark:bg-[#120A0E] min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Heart className="h-5 w-5 text-[#EB317A] dark:text-[#C9A84C]" />
            <h1 className="text-2xl sm:text-3xl font-black text-[#1A1118] dark:text-[#FFFCF8] tracking-tight">
              {targetGender === 'Female' ? t('profile-listing.women') : t('profile-listing.men')} {t('profile-listing.near-you')}
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {filteredProfiles.length} {t('profile-listing.profiles-found')}
            {currentUser.gender === 'Female' && (
              <span className="ml-2 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] font-bold">{t('profile-listing.free-women')}</span>
            )}
            
          </p>
        </div>

        {/* Search + Filter bar */}
        <div className="flex gap-2 mb-4 max-w-2xl mx-auto w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('profile-listing.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-sm text-gray-800 dark:text-[#FFFCF8] focus:outline-none focus:border-[#EB317A] dark:focus:border-[#C9A84C] transition-colors placeholder:text-gray-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-xs font-bold text-gray-600 dark:text-[#FFFCF8]/60 hover:border-[#EB317A] dark:hover:border-[#C9A84C] cursor-pointer transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">{t('profile-listing.filters')}</span>
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-4 mb-4 grid grid-cols-2 sm:grid-cols-3 gap-3 shadow-sm max-w-2xl mx-auto">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('profile-listing.city')}</label>
              <select
                value={filterCity || 'All'}
                onChange={(e) => setFilterCity(e.target.value === 'All' ? null : e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl text-xs text-gray-800 dark:text-[#FFFCF8] focus:outline-none"
              >
                {cities.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('profile-listing.age-min')}</label>
              <input
                type="number" min={18} max={ageMax} value={ageMin}
                onChange={(e) => setAgeMin(Math.max(18, Math.min(Number(e.target.value), ageMax)))}
                className="w-full px-3 py-2.5 bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl text-xs text-gray-800 dark:text-[#FFFCF8] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('profile-listing.age-max')}</label>
              <input
                type="number" min={ageMin} max={60} value={ageMax}
                onChange={(e) => setAgeMax(Math.min(60, Math.max(Number(e.target.value), ageMin)))}
                className="w-full px-3 py-2.5 bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl text-xs text-gray-800 dark:text-[#FFFCF8] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Intent chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mb-5 justify-start sm:justify-center max-w-2xl mx-auto">
          <button
            onClick={() => { setUsePreference(!usePreference); setFilterIntent(null); setFilterCity(null); setAgeMin(18); setAgeMax(60); }}
            className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all cursor-pointer border ${
              usePreference
                ? 'bg-[#C9A84C] border-[#C9A84C] text-[#1A1118]'
                : 'bg-white dark:bg-[#1A1118] border-[#EDE6D9] dark:border-[#C9A84C]/15 text-gray-600 dark:text-gray-400 hover:border-gray-300'
            }`}
          >
            {t('profile-listing.my-preference')}
          </button>
          {intents.map((intent) => (
            <button
              key={intent}
              onClick={() => { setFilterIntent(intent === 'All' ? null : intent); setUsePreference(false); }}
              className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all cursor-pointer border ${
                (intent === 'All' && filterIntent === null && !usePreference) || filterIntent === intent
                  ? 'bg-[#1A1118] dark:bg-[#EB317A] border-[#1A1118] dark:border-[#EB317A] text-white'
                  : 'bg-white dark:bg-[#1A1118] border-[#EDE6D9] dark:border-[#C9A84C]/15 text-gray-600 dark:text-gray-400 hover:border-gray-300'
              }`}
            >
              {intent === 'All' ? t('profile-listing.all-types') : intent}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {filteredProfiles.map((profile) => {
              const showContact = hasPaid || currentUser.gender === 'Female';
              const badge = INTENT_BADGE[profile.relationshipIntent] || INTENT_BADGE['Friendship'];
              return (
                <ProfileListCard
                  key={profile.id}
                  profile={profile}
                  showContact={showContact}
                  badge={badge}
                  onMakePayment={onMakePayment}
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
              onClick={() => { setSearchQuery(''); setFilterIntent(null); setFilterCity(null); setUsePreference(false); setAgeMin(18); setAgeMax(60); }}
              className="mt-4 px-4 py-2 bg-[#EB317A] hover:bg-[#F04B8E] text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
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
  showContact: boolean;
  badge: { label: string; cls: string };
  onMakePayment?: (profile: Profile) => void;
}

function maskPhone(val: string) {
  const digits = val.replace(/\D/g, '');
  if (digits.length >= 9) return digits.slice(0, 2) + 'XX XXX' + digits.slice(-3);
  return val.slice(0, 3) + '***';
}
function maskHandle(val: string) {
  if (!val || val === '---') return '---';
  const at = val.startsWith('@') ? '@' : '';
  const body = val.replace(/^@/, '');
  if (body.length <= 2) return at + body + '***';
  return at + body.slice(0, 2) + '...';
}

function ProfileListCard({
  profile, showContact, badge, onMakePayment
}: ProfileListCardProps) {
  const { t } = useAppContext();

  return (
    <div className="bg-white dark:bg-[#1A1118] rounded-2xl border border-[#EDE6D9] dark:border-[#C9A84C]/10 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#C9A84C]/30 dark:hover:border-[#C9A84C]/20 transition-all duration-400 flex flex-col group">
      {/* Photo */}
      <div className="relative pt-[125%] w-full bg-gray-100 dark:bg-[#120A0E] overflow-hidden">
        <img
          src={profile.image}
          alt={profile.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute top-2 left-2 flex gap-1">
          {profile.status === 'Online' && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-white">{t('profile-card.online')}</span>}
          {profile.verified && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#C9A84C] text-[#1A1118]">✓</span>}
        </div>
        <div className="absolute bottom-2 left-2 right-2 text-white">
          <p className="text-sm font-bold leading-tight truncate">{profile.name}, {profile.age}</p>
          <p className="text-[10px] text-white/60 flex items-center gap-0.5 mt-0.5 truncate">
            <MapPin className="h-2.5 w-2.5 shrink-0" />
            {profile.address ? `${profile.address}, ` : ''}{profile.city}
          </p>
        </div>
      </div>

      <div className="p-3 flex flex-col grow">
        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border mb-2 ${badge.cls}`}>
          {badge.label}
        </span>

        <div className="mt-auto pt-2 border-t border-[#EDE6D9] dark:border-[#C9A84C]/10">
          {showContact ? (
            <div className="space-y-1.5 bg-[#F8F4ED] dark:bg-[#120A0E] rounded-xl p-2.5 border border-[#EDE6D9] dark:border-[#C9A84C]/10">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-700 dark:text-gray-300">
                <Phone className="h-3 w-3 text-[#EB317A] dark:text-[#C9A84C] shrink-0" />
                <span className="truncate">{profile.contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-700 dark:text-gray-300">
                <TelegramIcon className="h-3 w-3 text-[#EB317A] dark:text-[#C9A84C] shrink-0" />
                <span className="truncate">{profile.contactInfo.telegram}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-700 dark:text-gray-300">
                <Instagram className="h-3 w-3 text-[#EB317A] dark:text-[#C9A84C] shrink-0" />
                <span className="truncate">{profile.contactInfo.instagram || '---'}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="space-y-1.5 bg-[#F8F4ED] dark:bg-[#120A0E] rounded-xl p-2.5 border border-[#EDE6D9] dark:border-[#C9A84C]/10">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                  <Phone className="h-3 w-3 shrink-0 text-[#EB317A] dark:text-[#C9A84C]" />
                  <span className="truncate">{maskPhone(profile.contactInfo.phone)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                  <TelegramIcon className="h-3 w-3 shrink-0 text-[#EB317A] dark:text-[#C9A84C]" />
                  <span className="truncate">{maskHandle(profile.contactInfo.telegram)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                  <Instagram className="h-3 w-3 shrink-0 text-[#EB317A] dark:text-[#C9A84C]" />
                  <span className="truncate">{maskHandle(profile.contactInfo.instagram)}</span>
                </div>
              </div>
              <button
                onClick={() => onMakePayment?.(profile)}
                className="w-full bg-[#EB317A] hover:bg-[#F04B8E] text-white text-[10px] font-bold rounded-xl py-2 px-3 transition-all cursor-pointer text-center"
              >
                {t('profile-card.see-contact')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
