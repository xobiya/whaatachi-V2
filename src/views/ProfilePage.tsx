import React, { useState } from 'react';
import { ArrowLeft, MapPin, ShieldCheck, Phone, MessageCircle, Instagram, Mail, Lock, Sparkles, Star, Crown, Heart, Edit3, Check, X, Plus } from 'lucide-react';
import { Profile, PaymentRequest } from '../types';

const ALL_INTERESTS = [
  'Coffee Ceremony', 'Macchiato', 'Technology', 'Literature', 'Jazz', 'Hiking',
  'Photography', 'Art Galleries', 'Traditional Food', 'Fitness', 'Philosophy',
  'Business', 'Road Trips', 'Tennis', 'Volunteering', 'History',
  'Cooking', 'Content Creation', 'Bole Cafes', 'Design',
  'Lake Walks', 'Acoustic Music', 'Family Values', 'Travel',
  'Music', 'Dancing', 'Reading', 'Movies', 'Fashion', 'Sports'
];

interface ProfilePageProps {
  profile: Profile;
  isUnlocked: boolean;
  pendingPayment: PaymentRequest | undefined;
  userGender: 'Male' | 'Female';
  isOwnProfile: boolean;
  onBack: () => void;
  onUnlockClick: (profile: Profile) => void;
  onSaveProfile?: (updated: Profile) => void;
}

export default function ProfilePage({ profile, isUnlocked, pendingPayment, userGender, isOwnProfile, onBack, onUnlockClick, onSaveProfile }: ProfilePageProps) {
  const [editing, setEditing] = useState(false);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editInterests, setEditInterests] = useState<string[]>(profile.interests);
  const [editStatus, setEditStatus] = useState(profile.status);

  const handleSave = () => {
    if (onSaveProfile) {
      onSaveProfile({
        ...profile,
        bio: editBio,
        interests: editInterests,
        status: editStatus,
      });
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setEditBio(profile.bio);
    setEditInterests(profile.interests);
    setEditStatus(profile.status);
    setEditing(false);
  };

  const toggleEditInterest = (interest: string) => {
    if (editInterests.includes(interest)) {
      setEditInterests(editInterests.filter(i => i !== interest));
    } else {
      setEditInterests([...editInterests, interest]);
    }
  };

  return (
    <div className="bg-[#FFFCF8] dark:bg-[#120A0E] min-h-screen transition-colors duration-200 pb-10">
      {/* Cover image */}
      <div className="relative h-56 sm:h-72 bg-gray-100 dark:bg-[#1A1118] overflow-hidden">
        <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <button onClick={onBack} className="absolute top-4 left-4 p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all cursor-pointer z-10">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-1">
            {profile.verified && <ShieldCheck className="h-5 w-5 text-[#C9A84C]" />}
            {profile.status === 'Online' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">Online</span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{profile.name}, {profile.age}</h1>
          <p className="text-sm text-white/70 flex items-center gap-1.5 mt-0.5">
            <MapPin className="h-4 w-4" />
            {profile.city}, Ethiopia
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-6 relative z-10 space-y-4">
        {/* Bio card */}
        <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#8B0020]/5 dark:bg-[#8B0020]/15 rounded-lg">
                <Heart className="h-4 w-4 text-[#8B0020] dark:text-[#C9A84C]" />
              </div>
              <h2 className="text-sm font-bold text-[#1A1118] dark:text-[#FFFCF8] uppercase tracking-wider">About</h2>
            </div>
            {isOwnProfile && !editing && (
              <button onClick={() => setEditing(true)} className="p-1.5 text-[#8B0020] dark:text-[#C9A84C] hover:bg-[#8B0020]/10 dark:hover:bg-[#C9A84C]/10 rounded-lg transition-colors cursor-pointer">
                <Edit3 className="h-4 w-4" />
              </button>
            )}
          </div>
          {editing ? (
            <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} rows={4} className="w-full border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl p-3 bg-[#F8F4ED]/50 dark:bg-[#120A0E] text-sm text-gray-800 dark:text-[#FFFCF8] focus:outline-hidden focus:border-[#8B0020] dark:focus:border-[#C9A84C] resize-none" />
          ) : (
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{profile.bio}</p>
          )}
        </div>

        {/* Intent & info card */}
        <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${
              profile.relationshipIntent === 'True Relationship'
                ? 'bg-[#8B0020]/5 dark:bg-[#8B0020]/15 text-[#8B0020] dark:text-[#C9A84C] border-[#8B0020]/20 dark:border-[#C9A84C]/30'
                : profile.relationshipIntent === 'Friendship'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
            }`}>
              {profile.relationshipIntent}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {profile.city}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{profile.age} years old</span>
            {editing && (
              <div className="flex items-center gap-1">
                <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Status:</label>
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as Profile['status'])} className="text-xs border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-lg px-2 py-1 bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] outline-hidden">
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Recently Active">Recently Active</option>
                </select>
              </div>
            )}
          </div>

          {/* Interests */}
          <div>
            <p className="text-[10px] font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider mb-2">Interests</p>
            {editing ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {editInterests.map((interest, idx) => (
                    <span key={idx} className="bg-[#8B0020]/10 dark:bg-[#8B0020]/30 text-[#8B0020] dark:text-[#C9A84C] text-xs px-3 py-1 rounded-full border border-[#8B0020]/30 dark:border-[#C9A84C]/40 flex items-center gap-1">
                      {interest}
                      <button onClick={() => setEditInterests(editInterests.filter(i => i !== interest))} className="hover:scale-110 transition-transform cursor-pointer">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="border-t border-[#EDE6D9] dark:border-[#C9A84C]/10 pt-2">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold mb-1.5">Add interests:</p>
                  <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto">
                    {ALL_INTERESTS.filter(i => !editInterests.includes(i)).map((interest) => (
                      <button key={interest} onClick={() => toggleEditInterest(interest)} className="bg-[#F8F4ED] dark:bg-[#120A0E] text-gray-500 dark:text-gray-400 hover:text-[#8B0020] dark:hover:text-[#C9A84C] text-xs px-3 py-1 rounded-full border border-[#EDE6D9] dark:border-[#C9A84C]/10 hover:border-[#8B0020]/30 dark:hover:border-[#C9A84C]/40 transition-colors cursor-pointer">
                        <Plus className="h-3 w-3 inline mr-0.5" />
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {profile.interests.map((interest, idx) => (
                  <span key={idx} className="bg-[#F8F4ED] dark:bg-[#120A0E] text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-full border border-[#EDE6D9] dark:border-[#C9A84C]/10">
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact or unlock card */}
        <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-[#8B0020]/5 dark:bg-[#8B0020]/15 rounded-lg">
              <Crown className="h-4 w-4 text-[#8B0020] dark:text-[#C9A84C]" />
            </div>
            <h2 className="text-sm font-bold text-[#1A1118] dark:text-[#FFFCF8] uppercase tracking-wider">Contact</h2>
          </div>

          {isUnlocked ? (
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 p-3.5 bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 p-2 rounded-lg shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Phone</p>
                  <a href={`tel:${profile.contactInfo.phone}`} className="font-bold text-gray-800 dark:text-[#FFFCF8] text-sm">{profile.contactInfo.phone}</a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl">
                <div className="bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 p-2 rounded-lg shrink-0">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Telegram</p>
                  <a href={`https://t.me/${profile.contactInfo.telegram.replace('@', '')}`} target="_blank" rel="noreferrer" className="font-bold text-gray-800 dark:text-[#FFFCF8] text-sm">{profile.contactInfo.telegram}</a>
                </div>
              </div>

              {profile.contactInfo.instagram && (
                <div className="flex items-center gap-3 p-3.5 bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl">
                  <div className="bg-[#8B0020]/10 dark:bg-[#8B0020]/30 text-[#8B0020] dark:text-[#C9A84C] p-2 rounded-lg shrink-0">
                    <Instagram className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Instagram</p>
                    <a href={`https://instagram.com/${profile.contactInfo.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="font-bold text-gray-800 dark:text-[#FFFCF8] text-sm">{profile.contactInfo.instagram}</a>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3.5 bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl">
                <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 p-2 rounded-lg shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Email</p>
                  <p className="font-bold text-gray-800 dark:text-[#FFFCF8] text-sm truncate">{profile.contactInfo.email}</p>
                </div>
              </div>
            </div>
          ) : pendingPayment ? (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl p-4 text-xs text-amber-800 dark:text-amber-300 text-center animate-pulse">
              <span className="font-bold">Verification Pending</span>
              <p className="text-[10px] mt-1">Transaction {pendingPayment.transactionId} is being reviewed</p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl p-6">
                <Lock className="h-10 w-10 text-[#8B0020] dark:text-[#C9A84C] mx-auto mb-3" />
                <p className="text-sm font-bold text-[#1A1118] dark:text-[#FFFCF8]">Contact Details Locked</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pay to unlock phone number, Telegram, Instagram and more</p>
              </div>
              <button onClick={() => onUnlockClick(profile)} className="w-full py-4 bg-[#8B0020] hover:bg-[#B31B3A] text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#8B0020]/10">
                <Lock className="h-4 w-4" />
                <span>Unlock Contact</span>
                {userGender === 'Male' && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md font-extrabold">200 ETB</span>}
                {userGender === 'Female' && <span className="text-[10px] bg-emerald-400/30 px-1.5 py-0.5 rounded-md font-extrabold">FREE</span>}
              </button>
            </div>
          )}
        </div>

        {/* Stats card */}
        <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-[#8B0020]/5 dark:bg-[#8B0020]/15 rounded-lg">
              <Star className="h-4 w-4 text-[#8B0020] dark:text-[#C9A84C]" />
            </div>
            <h2 className="text-sm font-bold text-[#1A1118] dark:text-[#FFFCF8] uppercase tracking-wider">Profile Stats</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl p-3">
              <p className="font-bold text-[#1A1118] dark:text-[#FFFCF8]">{profile.age}</p>
              <p className="text-gray-500 dark:text-gray-400 text-[10px] mt-0.5">Age</p>
            </div>
            <div className="bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl p-3">
              <p className="font-bold text-[#1A1118] dark:text-[#FFFCF8]">{profile.city}</p>
              <p className="text-gray-500 dark:text-gray-400 text-[10px] mt-0.5">Location</p>
            </div>
            <div className="bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl p-3">
              <p className="font-bold text-[#1A1118] dark:text-[#FFFCF8]">{profile.verified ? 'Verified' : 'Unverified'}</p>
              <p className="text-gray-500 dark:text-gray-400 text-[10px] mt-0.5">Status</p>
            </div>
            <div className="bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl p-3">
              <p className="font-bold text-[#1A1118] dark:text-[#FFFCF8] capitalize">{profile.status}</p>
              <p className="text-gray-500 dark:text-gray-400 text-[10px] mt-0.5">Activity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit action buttons */}
      {editing && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1A1118] border-t border-[#EDE6D9] dark:border-[#C9A84C]/10 p-4 flex gap-3 z-50">
          <button onClick={handleCancel} className="flex-1 py-3.5 bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/15 text-[#1A1118] dark:text-[#FFFCF8] font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 py-3.5 bg-[#8B0020] hover:bg-[#B31B3A] text-white font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#8B0020]/10">
            <Check className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
