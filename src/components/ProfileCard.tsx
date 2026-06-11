import React from 'react';
import { ShieldCheck, MapPin, Phone, Crown, Star, Instagram } from 'lucide-react';
import TelegramIcon from './TelegramIcon';
import { Profile } from '../types';
import { useUIContext } from '../context/UIContext';

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

interface ProfileCardProps {
  key?: string | number;
  profile: Profile;
  showContact: boolean;
  userGender: 'Male' | 'Female';
  onMakePayment?: (profile: Profile) => void;
}

export default function ProfileCard({
  profile, showContact, userGender, onMakePayment
}: ProfileCardProps) {
  const { t } = useUIContext();

  return (
    <div className="bg-white dark:bg-[#1A1118] rounded-2xl border border-[#EDE6D9] dark:border-[#C9A84C]/10 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#C9A84C]/40 dark:hover:border-[#C9A84C]/30 transition-all duration-500 flex flex-col h-full group">

      <div className="relative pt-[120%] w-full bg-gray-100 dark:bg-[#120A0E] overflow-hidden">
        <img src={profile.image} alt={profile.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent"></div>

        <div className="absolute top-3 left-3 flex gap-1.5">
          {profile.status === 'Online' && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-white">{t('profile-card.online')}</span>}
          {profile.verified && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#C9A84C] text-[#1A1118]">{t('profile-card.verified')}</span>}
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-lg font-bold">{profile.name}, {profile.age}</p>
          <p className="text-xs text-white/70 flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3" />
            {profile.city}, Ethiopia
          </p>
        </div>
      </div>

      <div className="p-4 flex flex-col grow justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {profile.interests.slice(0, 3).map((interest, idx) => (
              <span key={idx} className="bg-[#F8F4ED] dark:bg-[#120A0E] text-gray-600 dark:text-gray-400 text-[9px] font-medium px-2 py-0.5 rounded-full border border-[#EDE6D9] dark:border-[#C9A84C]/10">
                {interest}
              </span>
            ))}
          </div>

          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            profile.relationshipIntent === 'True Relationship'
              ? 'bg-[#EB317A]/5 dark:bg-[#EB317A]/15 text-[#EB317A] dark:text-[#C9A84C] border-[#EB317A]/20 dark:border-[#C9A84C]/30'
              : profile.relationshipIntent === 'Friendship'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
          }`}>
            {profile.relationshipIntent}
          </span>

          {profile.bio && (
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
              {profile.bio}
            </p>
          )}
        </div>

        <div className="pt-4 mt-4 border-t border-[#EDE6D9] dark:border-[#C9A84C]/10">
          {showContact ? (
            <div className="bg-[#F8F4ED] dark:bg-[#120A0E] rounded-xl p-3 space-y-2 animate-fade-in border border-[#EDE6D9] dark:border-[#C9A84C]/10">
              <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                <Phone className="h-3.5 w-3.5 text-[#EB317A] dark:text-[#C9A84C]" />
                <span>{profile.contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                <TelegramIcon className="h-3.5 w-3.5 text-[#EB317A] dark:text-[#C9A84C]" />
                <span>{profile.contactInfo.telegram}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                <Instagram className="h-3.5 w-3.5 text-[#EB317A] dark:text-[#C9A84C]" />
                <span>{profile.contactInfo.instagram || '---'}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="bg-[#F8F4ED] dark:bg-[#120A0E] rounded-xl p-3 space-y-2 border border-[#EDE6D9] dark:border-[#C9A84C]/10">
                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-[#EB317A] dark:text-[#C9A84C]" />
                  <span>{maskPhone(profile.contactInfo.phone)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                  <TelegramIcon className="h-3.5 w-3.5 shrink-0 text-[#EB317A] dark:text-[#C9A84C]" />
                  <span>{maskHandle(profile.contactInfo.telegram)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                  <Instagram className="h-3.5 w-3.5 shrink-0 text-[#EB317A] dark:text-[#C9A84C]" />
                  <span>{maskHandle(profile.contactInfo.instagram)}</span>
                </div>
              </div>
              <button
                onClick={() => onMakePayment?.(profile)}
                className="w-full bg-[#EB317A] hover:bg-[#F04B8E] text-white text-xs font-bold rounded-xl py-2.5 px-4 transition-all cursor-pointer text-center"
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
