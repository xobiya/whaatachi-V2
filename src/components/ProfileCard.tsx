import React from 'react';
import { ShieldCheck, MapPin, Sparkles, MessageCircle, Phone, Lock, Eye, AlertCircle } from 'lucide-react';
import { Profile, PaymentRequest } from '../types';

interface ProfileCardProps {
  key?: string | number;
  profile: Profile;
  isUnlocked: boolean;
  pendingPayment: PaymentRequest | undefined;
  onUnlockClick: (profile: Profile) => void;
  userGender: 'Male' | 'Female';
}

export default function ProfileCard({
  profile,
  isUnlocked,
  pendingPayment,
  onUnlockClick,
  userGender
}: ProfileCardProps) {
  
  // Status badge styling helper
  const getStatusColor = (status: Profile['status']) => {
    switch (status) {
      case 'Online':
        return 'bg-emerald-500 ring-emerald-100 dark:ring-emerald-950';
      case 'Recently Active':
        return 'bg-amber-500 ring-amber-100 dark:ring-amber-955';
      default:
        return 'bg-gray-400 ring-gray-100 dark:ring-slate-800';
    }
  };

  // Intent badge styling helper
  const getIntentBadgeStyles = (intent: Profile['relationshipIntent']) => {
    switch (intent) {
      case 'True Relationship':
        return 'bg-pink-50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-305 border-pink-100 dark:border-pink-900/40';
      case 'Friendship':
        return 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-305 border-sky-100 dark:border-sky-900/40';
      default: // Friends with Benefits
        return 'bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-305 border-violet-100 dark:border-violet-900/40';
    }
  };

  return (
    <div 
      className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-150 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg hover:border-gray-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col h-full"
      id={`profile-card-${profile.id}`}
    >
      
      {/* Photo header container */}
      <div className="relative pt-[110%] w-full bg-gray-100 dark:bg-slate-800 overflow-hidden shrink-0 group">
        <img 
          src={profile.image} 
          alt={profile.name}
          className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span 
            className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-xs inline-flex items-center gap-1 bg-gray-900/50 dark:bg-slate-950/65 backdrop-blur-xs"
          >
            <span className={`w-2 h-2 rounded-full ${getStatusColor(profile.status)} ring-4`}></span>
            {profile.status}
          </span>
          
          <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-extrabold border shadow-sm ${getIntentBadgeStyles(profile.relationshipIntent)}`}>
            {profile.relationshipIntent}
          </span>
        </div>

        {/* Verification Checkmark wrapper info overlay */}
        {profile.verified && (
          <div className="absolute top-3 right-3 bg-amber-500 dark:bg-amber-600 text-white p-1.5 rounded-full shadow-md border border-amber-450 z-10" title="Whaatachi Verified Member">
            <ShieldCheck className="h-4.5 w-4.5 fill-amber-350/10" />
          </div>
        )}

        {/* Shadow Overlay Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent"></div>

        {/* Floating title on image bottom */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-lg font-bold flex items-center gap-1.5">
            {profile.name}, {profile.age}
          </p>
          <p className="text-xs font-medium text-gray-250 dark:text-slate-300 flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3 text-red-500 shrink-0" />
            {profile.city}, Ethiopia
          </p>
        </div>
      </div>

      {/* Body content */}
      <div className="p-4 flex flex-col grow justify-between">
        
        {/* Info & Tags */}
        <div className="space-y-3.5">
          <p className="text-xs text-gray-650 dark:text-slate-350 line-clamp-3 leading-relaxed font-light min-h-[48px]">
            "{profile.bio}"
          </p>

          <div className="flex flex-wrap gap-1.5">
            {profile.interests.map((interest, idx) => (
              <span 
                key={idx}
                className="bg-gray-100 hover:bg-gray-250 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded-md transition-colors"
              >
                #{interest}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button & Contact reveals */}
        <div className="pt-4 border-t border-gray-100 dark:border-slate-800 mt-4">
          
          {isUnlocked ? (
            // Contact Is Unlocked! Show elegant details
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-3 text-emerald-800 dark:text-emerald-300 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Contact Unlocked!</span>
              </div>
              
              <div className="space-y-1.5 text-xs text-gray-800 dark:text-slate-200">
                <a 
                  href={`tel:${profile.contactInfo.phone}`}
                  className="flex items-center gap-2 font-medium hover:underline hover:text-emerald-650 dark:hover:text-emerald-400 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Call: <strong className="font-bold">{profile.contactInfo.phone}</strong></span>
                </a>
                <a 
                  href={`https://t.me/${profile.contactInfo.telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 font-medium hover:underline hover:text-sky-600 dark:text-sky-400 transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                  <span>Telegram: <strong className="font-bold text-sky-600 dark:text-sky-400">{profile.contactInfo.telegram}</strong></span>
                </a>
              </div>
            </div>
          ) : pendingPayment ? (
            // Payment submission is pending admin check
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl p-3 text-amber-900 dark:text-amber-300 animate-pulse">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-705 dark:text-amber-400 mb-1">
                <AlertCircle className="h-3.5 w-3.5 mt-0.5" />
                <span>Verification Pending</span>
              </div>
              <p className="text-[10px] text-amber-600 dark:text-amber-450 font-medium leading-relaxed">
                Moderator is auditing TxID: <code className="bg-white dark:bg-slate-800 px-1 py-0.5 border dark:border-slate-700 rounded-sm text-pink-600 dark:text-pink-400">{pendingPayment.transactionId}</code>
              </p>
            </div>
          ) : (
            // Contact is locked. Prompt to unlock
            <button
              onClick={() => onUnlockClick(profile)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-xs md:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white"
            >
              <Lock className="h-3.5 w-3.5 text-pink-205" />
              <span>Unlock Contact Info</span>
              {userGender === 'Male' && (
                <span className="text-[10px] bg-pink-805/50 px-1.5 py-0.5 rounded-md font-bold text-pink-100">
                  200 ETB
                </span>
              )}
              {userGender === 'Female' && (
                <span className="text-[10px] bg-emerald-805/50 px-1.5 py-0.5 rounded-md font-bold text-emerald-100">
                  FREE
                </span>
              )}
            </button>
          )}

        </div>

      </div>

    </div>
  );
}
