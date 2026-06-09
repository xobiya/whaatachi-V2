import React from 'react';
import { Eye, Sparkles, Phone, MessageCircle, ArrowLeft, ShieldCheck, Mail, Instagram } from 'lucide-react';
import { Profile } from '../types';
import { useAppContext } from '../context/AppContext';

interface UnlockHistoryProps {
  unlockedProfiles: Profile[];
  onBackToFinder: () => void;
  onViewProfile?: (profile: Profile) => void;
}

export default function UnlockHistory({ unlockedProfiles, onBackToFinder, onViewProfile }: UnlockHistoryProps) {
  const { t } = useAppContext();
  return (
    <div className="bg-[#FFFCF8] dark:bg-[#120A0E] py-12 min-h-screen transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1A1118] dark:text-[#FFFCF8] tracking-tight flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-[#C9A84C]" />
              {t('history.title')}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t('history.desc')}
            </p>
          </div>

          <button onClick={onBackToFinder} className="px-4 py-2 bg-white dark:bg-[#1A1118] hover:bg-gray-50 dark:hover:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-xs font-bold text-gray-700 dark:text-[#FFFCF8] shadow-sm cursor-pointer transition-all flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            {t('history.back')}
          </button>
        </div>

        {unlockedProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlockedProfiles.map((profile) => (
              <div key={profile.id} className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 hover:border-emerald-300 dark:hover:border-emerald-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div 
                    onClick={() => onViewProfile?.(profile)}
                    className="flex items-center gap-3.5 pb-4 border-b border-[#EDE6D9] dark:border-[#C9A84C]/10 cursor-pointer group"
                  >
                    <img src={profile.image} alt={profile.name} loading="lazy" className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500/25 group-hover:ring-emerald-500 transition-all" referrerPolicy="no-referrer" />
                    <div>
                      <h3 className="font-bold text-[#1A1118] dark:text-[#FFFCF8] text-base flex items-center gap-1 group-hover:text-[#EB317A] dark:group-hover:text-[#C9A84C] hover:underline transition-colors">
                        {profile.name}
                        {profile.verified && <ShieldCheck className="h-4 w-4 text-[#C9A84C]" title={t('common.verified')} />}
                      </h3>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 px-1.5 py-0.5 rounded-sm inline-block mt-0.5">
                        {profile.relationshipIntent}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">
                        {profile.age} yrs &middot; {profile.city}
                      </p>
                    </div>
                  </div>

                  <div className="py-4 space-y-2.5">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t('history.direct-contacts')}</p>

                    <a href={`tel:${profile.contactInfo.phone}`} className="flex items-center gap-3 p-2.5 bg-[#F8F4ED] dark:bg-[#120A0E] hover:bg-emerald-50 dark:hover:bg-emerald-900/10 border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl text-xs text-gray-700 dark:text-gray-300 transition-colors cursor-pointer group">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 p-2 rounded-lg shrink-0 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/40 transition-colors">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{t('history.phone')}</p>
                        <p className="font-bold text-gray-800 dark:text-[#FFFCF8] mt-0.5">{profile.contactInfo.phone}</p>
                      </div>
                    </a>

                    <a href={`https://t.me/${profile.contactInfo.telegram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2.5 bg-[#F8F4ED] dark:bg-[#120A0E] hover:bg-sky-50 dark:hover:bg-sky-900/10 border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl text-xs text-gray-700 dark:text-gray-300 transition-colors cursor-pointer group">
                      <div className="bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 p-2 rounded-lg shrink-0 group-hover:bg-sky-200 dark:group-hover:bg-sky-800/40 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{t('history.telegram')}</p>
                        <p className="font-bold text-sky-600 dark:text-sky-400 mt-0.5">{profile.contactInfo.telegram}</p>
                      </div>
                    </a>

                    {profile.contactInfo.instagram && (
                      <a href={`https://instagram.com/${profile.contactInfo.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2.5 bg-[#F8F4ED] dark:bg-[#120A0E] hover:bg-[#EB317A]/5 dark:hover:bg-[#EB317A]/20 border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl text-xs text-gray-700 dark:text-gray-300 transition-colors cursor-pointer group">
                        <div className="bg-[#EB317A]/10 dark:bg-[#EB317A]/30 text-[#EB317A] dark:text-[#C9A84C] p-2 rounded-lg shrink-0 group-hover:bg-[#EB317A]/20 dark:group-hover:bg-[#EB317A]/40 transition-colors">
                          <Instagram className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{t('history.instagram')}</p>
                          <p className="font-bold text-[#EB317A] dark:text-[#C9A84C] mt-0.5">{profile.contactInfo.instagram}</p>
                        </div>
                      </a>
                    )}

                    <a href={`mailto:${profile.contactInfo.email}`} className="flex items-center gap-3 p-2.5 bg-[#F8F4ED] dark:bg-[#120A0E] hover:bg-amber-50 dark:hover:bg-amber-900/10 border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl text-xs text-gray-700 dark:text-gray-300 transition-colors cursor-pointer group">
                      <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 p-2 rounded-lg shrink-0 group-hover:bg-amber-200 dark:group-hover:bg-amber-800/40 transition-colors">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{t('history.email')}</p>
                        <p className="font-bold text-gray-800 dark:text-[#FFFCF8] truncate max-w-[130px] sm:max-w-none mt-0.5">{profile.contactInfo.email}</p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="border-t border-[#EDE6D9] dark:border-[#C9A84C]/10 pt-3 flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
                  <span>{t('history.lifetime')}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t('history.secure')}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl py-20 px-4 text-center max-w-xl mx-auto space-y-6 shadow-sm">
            <div className="bg-[#EB317A]/5 dark:bg-[#EB317A]/15 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto text-[#EB317A] dark:text-[#C9A84C] border border-[#EB317A]/10 dark:border-[#C9A84C]/20">
              <Eye className="h-10 w-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-[#1A1118] dark:text-[#FFFCF8] text-xl">{t('history.empty-title')}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-light max-w-sm mx-auto leading-relaxed">
                {t('history.empty-desc')}
              </p>
            </div>

            <button onClick={onBackToFinder} className="px-6 py-3 bg-[#EB317A] hover:bg-[#F04B8E] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer">
              {t('history.start')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
