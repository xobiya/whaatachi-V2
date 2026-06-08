import React from 'react';
import { ShieldCheck, MapPin, Sparkles, Phone, Lock, Crown, Star, MessageCircle, Instagram } from 'lucide-react';
import { Profile, PaymentRequest } from '../types';

interface ProfileCardProps {
  key?: string | number;
  profile: Profile;
  isUnlocked: boolean;
  pendingPayment: PaymentRequest | undefined;
  onUnlockClick: (profile: Profile) => void;
  userGender: 'Male' | 'Female';
  onViewProfile?: (profile: Profile) => void;
}

export default function ProfileCard({
  profile, isUnlocked, pendingPayment, onUnlockClick, userGender, onViewProfile
}: ProfileCardProps) {

  return (
    <div className="bg-white dark:bg-[#1A1118] rounded-2xl border border-[#EDE6D9] dark:border-[#C9A84C]/10 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#C9A84C]/40 dark:hover:border-[#C9A84C]/30 transition-all duration-500 flex flex-col h-full group">

      <div className="relative pt-[120%] w-full bg-gray-100 dark:bg-[#120A0E] overflow-hidden">
        <img src={profile.image} alt={profile.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent"></div>

        <div className="absolute top-3 left-3 flex gap-1.5">
          {profile.status === 'Online' && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-white">Online</span>}
          {profile.verified && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#C9A84C] text-[#1A1118]">Verified</span>}
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
              ? 'bg-[#8B0020]/5 dark:bg-[#8B0020]/15 text-[#8B0020] dark:text-[#C9A84C] border-[#8B0020]/20 dark:border-[#C9A84C]/30'
              : profile.relationshipIntent === 'Friendship'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
          }`}>
            {profile.relationshipIntent}
          </span>
        </div>

        <div className="pt-4 mt-4 border-t border-[#EDE6D9] dark:border-[#C9A84C]/10">
          {isUnlocked ? (
            <div className="bg-[#F8F4ED] dark:bg-[#120A0E] rounded-xl p-3 space-y-2 animate-fade-in border border-[#EDE6D9] dark:border-[#C9A84C]/10">
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#8B0020] dark:text-[#C9A84C]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Contact Unlocked!</span>
              </div>
              <a href={`tel:${profile.contactInfo.phone}`} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 hover:text-[#8B0020] dark:hover:text-[#C9A84C] transition-colors">
                <Phone className="h-3.5 w-3.5 text-[#8B0020] dark:text-[#C9A84C]" />
                {profile.contactInfo.phone}
              </a>
              <a href={`https://t.me/${profile.contactInfo.telegram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 hover:text-[#8B0020] dark:hover:text-[#C9A84C] transition-colors">
                <MessageCircle className="h-3.5 w-3.5 text-[#8B0020] dark:text-[#C9A84C]" />
                {profile.contactInfo.telegram}
              </a>
              {profile.contactInfo.instagram && (
                <a href={`https://instagram.com/${profile.contactInfo.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 hover:text-[#8B0020] dark:hover:text-[#C9A84C] transition-colors">
                  <Instagram className="h-3.5 w-3.5 text-[#8B0020] dark:text-[#C9A84C]" />
                  {profile.contactInfo.instagram}
                </a>
              )}
            </div>
          ) : pendingPayment ? (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300 text-center animate-pulse">
              <span className="font-bold">Verification Pending</span>
              <p className="text-[10px] mt-1">TxID: {pendingPayment.transactionId}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {onViewProfile && (
                <button onClick={() => onViewProfile(profile)} className="w-full py-2.5 bg-[#F8F4ED] dark:bg-[#120A0E] hover:bg-[#EDE6D9] dark:hover:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/15 text-[#1A1118] dark:text-[#FFFCF8] font-bold text-xs rounded-xl transition-all cursor-pointer">
                  View Profile
                </button>
              )}
              <button onClick={() => onUnlockClick(profile)} className="w-full py-3 bg-[#8B0020] hover:bg-[#B31B3A] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#8B0020]/10">
                <Lock className="h-3.5 w-3.5" />
                <span>Unlock Contact</span>
                {userGender === 'Male' && (
                  <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-md font-extrabold">200 ETB</span>
                )}
                {userGender === 'Female' && (
                  <span className="text-[9px] bg-emerald-400/30 px-1.5 py-0.5 rounded-md font-extrabold">FREE</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
