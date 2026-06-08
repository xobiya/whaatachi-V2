import React from 'react';
import { ShieldCheck, MapPin, Sparkles, MessageCircle, Phone, Lock, Eye, Crown, Star } from 'lucide-react';
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
  profile, isUnlocked, pendingPayment, onUnlockClick, userGender
}: ProfileCardProps) {

  return (
    <div className="bg-white rounded-2xl border border-[#EDE6D9] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#C9A84C]/40 transition-all duration-500 flex flex-col h-full group">

      {/* Photo */}
      <div className="relative pt-[120%] w-full bg-gray-100 overflow-hidden">
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

      {/* Body */}
      <div className="p-4 flex flex-col grow justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {profile.interests.slice(0, 3).map((interest, idx) => (
              <span key={idx} className="bg-[#F8F4ED] text-gray-600 text-[9px] font-medium px-2 py-0.5 rounded-full">
                {interest}
              </span>
            ))}
          </div>

          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${profile.relationshipIntent === 'True Relationship' ? 'bg-[#8B0020]/5 text-[#8B0020] border-[#8B0020]/20' : profile.relationshipIntent === 'Friendship' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
            {profile.relationshipIntent}
          </span>
        </div>

        {/* Action */}
        <div className="pt-4 mt-4 border-t border-[#EDE6D9]">
          {isUnlocked ? (
            <div className="bg-[#F8F4ED] rounded-xl p-3 space-y-2 animate-fade-in">
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#8B0020]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Contact Unlocked!</span>
              </div>
              <a href={`tel:${profile.contactInfo.phone}`} className="flex items-center gap-2 text-xs text-gray-700 hover:text-[#8B0020] transition-colors">
                <Phone className="h-3.5 w-3.5 text-[#8B0020]" />
                {profile.contactInfo.phone}
              </a>
              <a href={`https://t.me/${profile.contactInfo.telegram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-gray-700 hover:text-[#8B0020] transition-colors">
                <MessageCircle className="h-3.5 w-3.5 text-[#8B0020]" />
                {profile.contactInfo.telegram}
              </a>
            </div>
          ) : pendingPayment ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 text-center animate-pulse">
              <span className="font-bold">Verification Pending</span>
              <p className="text-[10px] mt-1">TxID: {pendingPayment.transactionId}</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
