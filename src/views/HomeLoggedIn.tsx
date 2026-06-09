import React, { useState } from 'react';
import {
  Heart, Sparkles, MapPin, CheckCircle, ShieldCheck,
  Edit2, Check, ArrowRight, MessageSquare, Flame,
  Award, Lightbulb, Users, Key, AlertCircle, RefreshCw
} from 'lucide-react';
import { Profile } from '../types';
import { useAppContext } from '../context/AppContext';

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
  onViewProfile?: (profile: Profile) => void;
}

export default function HomeLoggedIn({
  currentUser, onUpdateBio, onUpdateStatus, unlockedCount,
  onGoToMatches, onGoToHistory, onUnlockClick, profiles, unlockedIds,
  onViewProfile
}: HomeLoggedInProps) {
  const { t } = useAppContext();
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

  const oppositeGender = user.gender === 'Male' ? 'Female' : 'Male';
  const recommendations = profiles
    .filter(p => p.gender === oppositeGender && p.id !== user.id)
    .slice(0, 3);

  const totalVerifiedMatches = profiles.filter(p => p.gender === oppositeGender && p.verified).length;
  const matchRatio = totalVerifiedMatches > 0 ? Math.round((totalVerifiedMatches / profiles.filter(p => p.gender === oppositeGender).length) * 100) : 100;

  return (
    <div className="bg-[#FFFCF8] dark:bg-[#120A0E] text-gray-800 dark:text-[#FFFCF8] py-8 lg:py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        <div className="relative bg-gradient-to-r from-[#EB317A]/10 via-[#F04B8E]/5 to-transparent dark:from-[#EB317A]/20 dark:via-[#EB317A]/10 rounded-3xl p-6 sm:p-8 border border-[#EB317A]/10 dark:border-[#C9A84C]/10 overflow-hidden shadow-sm">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#EB317A]/10 dark:bg-[#EB317A]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-[#C9A84C]/10 dark:bg-[#C9A84C]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EB317A]/10 dark:bg-[#EB317A]/20 text-[#EB317A] dark:text-[#C9A84C] text-[10.5px] font-bold tracking-wide uppercase">
                <Sparkles className="h-3 w-3 text-[#C9A84C]" />
                <span>{t('logged-in.premium')}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1A1118] dark:text-[#FFFCF8] leading-tight">
                Selam, <span className="text-[#EB317A] dark:text-[#C9A84C]">{user.name}</span>!
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl font-light leading-relaxed">
                {t('logged-in.welcome-back')}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold pt-1">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-4 w-4" /> {t('logged-in.verified')}
                </span>
                <span className="flex items-center gap-1 text-[#EB317A] dark:text-[#C9A84C]">
                  <Flame className="h-4 w-4" /> {t('logged-in.premium-member')}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <button onClick={onGoToMatches} className="w-full sm:w-auto py-3.5 px-6 bg-[#EB317A] hover:bg-[#F04B8E] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5">
                <Users className="h-4.5 w-4.5" />
                <span>{t('logged-in.browse-matches')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button onClick={onGoToHistory} className="w-full sm:w-auto py-3.5 px-6 bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/15 hover:bg-gray-50 dark:hover:bg-[#120A0E] text-gray-800 dark:text-[#FFFCF8] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
                <Key className="h-4.5 w-4.5 text-[#EB317A] dark:text-[#C9A84C]" />
                <span>{t('logged-in.unlocked-contacts')} ({unlockedCount})</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-[#EB317A]/5 dark:bg-[#EB317A]/15 text-[#EB317A] dark:text-[#C9A84C] rounded-xl">
              <Key className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-gray-500">{t('logged-in.unlocked-label')}</p>
              <p className="text-2xl font-black text-[#1A1118] dark:text-[#FFFCF8]">{unlockedCount}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-light">
                {t('logged-in.direct-info')}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-gray-500">{t('logged-in.verified-members')}</p>
              <p className="text-2xl font-black text-[#1A1118] dark:text-[#FFFCF8]">{totalVerifiedMatches}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-light">
                {matchRatio}{t('logged-in.verified-of')} {oppositeGender.toLowerCase()}s {t('common.verified')}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-[#C9A84C]/10 dark:bg-[#C9A84C]/15 text-[#C9A84C] rounded-xl">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-gray-500">{t('logged-in.trust-badge')}</p>
              <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase mt-0.5 tracking-wider">{t('logged-in.gold-level')}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1.5 font-light leading-relaxed">
                {t('logged-in.no-subscription')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <div className="lg:col-span-4 bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-3xl p-6 shadow-sm space-y-6 text-left">

            <div className="flex items-center justify-between border-b border-[#EDE6D9] dark:border-[#C9A84C]/10 pb-4">
              <h3 className="text-sm font-black text-[#1A1118] dark:text-[#FFFCF8] uppercase tracking-wider">{t('logged-in.your-profile')}</h3>
              <span className="text-[10px] text-[#EB317A] dark:text-[#C9A84C] font-bold bg-[#EB317A]/5 dark:bg-[#EB317A]/15 px-2 py-0.5 rounded-md uppercase font-mono">
                {user.relationshipIntent}
              </span>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <button
                type="button"
                onClick={() => onViewProfile?.(user)}
                className="relative group cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img src={user.image} alt={user.name} className="w-24 h-24 rounded-2xl object-cover border-2 border-[#C9A84C]/50 shadow-md group-hover:border-[#C9A84C] transition-colors" referrerPolicy="no-referrer" />
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white dark:border-[#120A0E] inline-block w-4 h-4 rounded-full"></span>
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => onViewProfile?.(user)}
                  className="flex items-center justify-center gap-1 hover:text-[#EB317A] dark:hover:text-[#C9A84C] transition-colors mx-auto"
                >
                  <h4 className="text-base font-black text-[#1A1118] dark:text-[#FFFCF8]">{user.name}, {user.age}</h4>
                  <ShieldCheck className="h-4.5 w-4.5 text-[#C9A84C] fill-[#C9A84C]/25 shrink-0" />
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-[#EB317A] dark:text-[#C9A84C] shrink-0" />
                  <span>{user.city}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2 border-t border-[#EDE6D9] dark:border-[#C9A84C]/10 pt-4">
              <label className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-gray-500">
                {t('logged-in.status')}
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#F8F4ED] dark:bg-[#120A0E] p-1 rounded-xl">
                {(['Online', 'Offline', 'Recently Active'] as const).map((status) => (
                  <button key={status} type="button" onClick={() => handleStatusChange(status)} className={`py-1 text-[10px] rounded-lg font-bold transition-all cursor-pointer ${
                    selectedStatus === status
                      ? 'bg-[#EB317A] text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-[#1A1118] dark:hover:text-[#FFFCF8]'
                  }`}>
                    {status === 'Online' ? t('logged-in.active') : status === 'Offline' ? t('logged-in.quiet') : t('logged-in.recent')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 border-t border-[#EDE6D9] dark:border-[#C9A84C]/10 pt-4">
              <div className="flex items-center justify-between">
                <label className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-gray-500">
                  {t('logged-in.about-you')}
                </label>
                <button type="button" onClick={() => { if (isEditingBio) { handleSaveBio(); } else { setIsEditingBio(true); } }} className="text-[#EB317A] dark:text-[#C9A84C] hover:text-[#F04B8E] dark:hover:text-[#E0C878] text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer">
                  {isEditingBio ? (
                    <><Check className="h-3.5 w-3.5" /> {t('logged-in.save')}</>
                  ) : (
                    <><Edit2 className="h-3 w-3" /> {t('logged-in.edit')}</>
                  )}
                </button>
              </div>

              {isEditingBio ? (
                <div className="space-y-2">
                  <textarea value={editedBio} onChange={(e) => setEditedBio(e.target.value)} className="w-full text-xs p-3 rounded-xl border border-[#EDE6D9] dark:border-[#C9A84C]/15 bg-white dark:bg-[#120A0E] text-gray-800 dark:text-[#FFFCF8] focus:outline-hidden focus:ring-1 focus:ring-[#EB317A] dark:focus:ring-[#C9A84C] focus:border-[#EB317A] dark:focus:border-[#C9A84C]" rows={4} placeholder="Describe yourself..." />
                  <div className="flex justify-end gap-1.5">
                    <button type="button" onClick={() => { setEditedBio(user.bio); setIsEditingBio(false); }} className="py-1 px-2.5 bg-gray-100 dark:bg-[#1A1118] hover:bg-gray-200 text-[10.5px] font-bold rounded-lg cursor-pointer text-gray-600 dark:text-gray-400">
                      Cancel
                    </button>
                    <button type="button" onClick={handleSaveBio} className="py-1 px-3 bg-[#EB317A] hover:bg-[#F04B8E] text-[10.5px] text-white font-extrabold rounded-lg cursor-pointer shadow-sm">
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-[#F8F4ED]/50 dark:bg-[#120A0E]/50 border border-[#EDE6D9] dark:border-[#C9A84C]/5 rounded-xl">
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-light italic">
                    "{user.bio || "Write a bio to complete your profile."}"
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2 border-t border-[#EDE6D9] dark:border-[#C9A84C]/10 pt-4">
              <label className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-gray-500">
                {t('logged-in.reg-data')}
              </label>
              <div className="space-y-2 font-mono text-[10.5px] text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>{t('logged-in.phone')}</span>
                  <span className="font-semibold text-gray-800 dark:text-[#FFFCF8]">
                    {user.contactInfo?.phone ? `${user.contactInfo.phone.substring(0, 4)}***${user.contactInfo.phone.slice(-3)}` : '091******44'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t('logged-in.telegram')}</span>
                  <span className="font-semibold text-[#EB317A] dark:text-[#C9A84C]">
                    @{user.contactInfo?.telegram || 'user'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6 text-left">

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#1A1118] dark:text-[#FFFCF8] tracking-tight">
                  Recommended Matches
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                  Active {oppositeGender.toLowerCase()}s near {user.city}
                </p>
              </div>

              <button type="button" onClick={onGoToMatches} className="text-xs text-[#EB317A] dark:text-[#C9A84C] hover:text-[#F04B8E] dark:hover:text-[#E0C878] font-extrabold flex items-center gap-1 hover:underline cursor-pointer bg-[#EB317A]/5 dark:bg-[#EB317A]/15 px-3 py-1.5 rounded-xl border border-[#EB317A]/10 dark:border-[#C9A84C]/20">
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.length > 0 ? (
                recommendations.map((profile) => {
                  const isUnlockedStatus = unlockedIds.includes(profile.id);
                  return (
                    <div key={profile.id} className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group duration-200">
                      <div 
                        onClick={() => onViewProfile?.(profile)}
                        className="relative pt-[100%] bg-gray-100 dark:bg-[#120A0E] overflow-hidden cursor-pointer"
                      >
                        <img src={profile.image} alt={profile.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

                        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-full font-bold">
                          <span className={`h-1.5 w-1.5 rounded-full ${profile.status === 'Online' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          <span>{profile.status}</span>
                        </div>

                        {profile.verified && (
                          <span className="absolute top-3 right-3 bg-[#C9A84C] text-[#1A1118] text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md">
                            Verified
                          </span>
                        )}

                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <p className="font-extrabold text-base leading-tight hover:underline">
                            {profile.name}, {profile.age}
                          </p>
                          <p className="text-[10px] text-white/70 flex items-center gap-0.5 mt-0.5 font-light">
                            <MapPin className="h-3 w-3 text-[#C9A84C] shrink-0" />
                            <span>{profile.city}</span>
                          </p>
                        </div>
                      </div>

                      <div className="p-4 flex flex-col justify-between grow space-y-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 italic font-light">
                          "{profile.bio}"
                        </p>

                        <div className="flex flex-wrap gap-1">
                          {profile.interests.slice(0, 2).map((interest, idx) => (
                            <span key={idx} className="text-[9.5px] font-bold px-1.5 py-0.5 bg-[#F8F4ED] dark:bg-[#120A0E] rounded-md text-gray-500 dark:text-gray-400 border border-[#EDE6D9] dark:border-[#C9A84C]/10">
                              {interest}
                            </span>
                          ))}
                        </div>

                        <button type="button" onClick={() => onUnlockClick(profile)} className={`mt-2 w-full py-2.5 text-center text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isUnlockedStatus
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 border border-emerald-200/50 dark:border-emerald-800'
                            : 'bg-[#EB317A]/5 dark:bg-[#EB317A]/15 text-[#EB317A] dark:text-[#C9A84C] hover:bg-[#EB317A]/10 dark:hover:bg-[#EB317A]/25 border border-[#EB317A]/10 dark:border-[#C9A84C]/20'
                        }`}>
                          {isUnlockedStatus ? (
                            <><ShieldCheck className="h-4 w-4" /><span>View Contact</span></>
                          ) : (
                            <><Key className="h-3.5 w-3.5" /><span>Unlock Contact</span></>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full border border-dashed border-[#EDE6D9] dark:border-[#C9A84C]/10 p-12 text-center rounded-2xl bg-white dark:bg-[#1A1118]">
                  <AlertCircle className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-800 dark:text-[#FFFCF8]">No profile matches available right now</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Try resetting your filters or profile intent settings.</p>
                </div>
              )}
            </div>

            <div className="bg-amber-50/40 dark:bg-amber-900/10 border border-amber-200/40 dark:border-amber-800/20 rounded-2xl p-5 shadow-sm flex items-start gap-3.5 relative overflow-hidden">
              <div className="p-2 bg-amber-500/10 rounded-xl shrink-0 text-amber-600 dark:text-amber-400 mt-0.5">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#1A1118] dark:text-amber-300">
                  Safe Dating Tips
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                  Always communicate on Telegram before sharing personal location details. Never send money to anyone on the platform. Report suspicious accounts via the Support panel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
