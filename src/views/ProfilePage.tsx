import React, { useState, useRef, useMemo } from 'react';
import { ArrowLeft, MapPin, ShieldCheck, Phone, Instagram, Mail, Lock, Sparkles, Star, Crown, Heart, Edit3, Check, X, Plus, User, Camera, Calendar } from 'lucide-react';
import TelegramIcon from '../components/TelegramIcon';
import { Profile, PaymentRequest } from '../types';
import { useAppContext } from '../context/AppContext';


const ALL_INTERESTS = [
  'Coffee Ceremony', 'Macchiato', 'Technology', 'Literature', 'Jazz', 'Hiking',
  'Photography', 'Art Galleries', 'Traditional Food', 'Fitness', 'Philosophy',
  'Business', 'Road Trips', 'Tennis', 'Volunteering', 'History',
  'Cooking', 'Content Creation', 'Bole Cafes', 'Design',
  'Lake Walks', 'Acoustic Music', 'Family Values', 'Travel',
  'Music', 'Dancing', 'Reading', 'Movies', 'Fashion', 'Sports'
];

const PRESET_MALE_IMAGES = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
];

const PRESET_FEMALE_IMAGES = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
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
  const { t } = useAppContext();
  const [editing, setEditing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states to edit the WHOLE data
  const [editName, setEditName] = useState(profile.name);
  const [editAge, setEditAge] = useState(profile.age);
  const [editCity, setEditCity] = useState(profile.city);
  const [editGender, setEditGender] = useState(profile.gender);
  const [editLookingFor, setEditLookingFor] = useState(profile.lookingFor || (profile.gender === 'Male' ? 'Female' : 'Male'));
  const [editImage, setEditImage] = useState(profile.image);
  const [editStatus, setEditStatus] = useState(profile.status);
  const [editRelationshipIntent, setEditRelationshipIntent] = useState(profile.relationshipIntent);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editInterests, setEditInterests] = useState<string[]>(profile.interests);
  
  // Contact info states
  const [editPhone, setEditPhone] = useState(profile.contactInfo.phone);
  const [editTelegram, setEditTelegram] = useState(profile.contactInfo.telegram);
  const [editInstagram, setEditInstagram] = useState(profile.contactInfo.instagram || '');
  const [editEmail, setEditEmail] = useState(profile.contactInfo.email);

  const handleSave = () => {
    if (onSaveProfile) {
      onSaveProfile({
        ...profile,
        name: editName,
        age: Number(editAge),
        city: editCity,
        gender: editGender,
        lookingFor: editLookingFor,
        image: editImage,
        status: editStatus,
        relationshipIntent: editRelationshipIntent,
        bio: editBio,
        interests: editInterests,
        contactInfo: {
          phone: editPhone,
          telegram: editTelegram.startsWith('@') ? editTelegram : `@${editTelegram}`,
          instagram: editInstagram ? (editInstagram.startsWith('@') ? editInstagram : `@${editInstagram}`) : '',
          email: editEmail
        }
      });
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setEditName(profile.name);
    setEditAge(profile.age);
    setEditCity(profile.city);
    setEditGender(profile.gender);
    setEditLookingFor(profile.lookingFor || (profile.gender === 'Male' ? 'Female' : 'Male'));
    setEditImage(profile.image);
    setEditStatus(profile.status);
    setEditRelationshipIntent(profile.relationshipIntent);
    setEditBio(profile.bio);
    setEditInterests(profile.interests);
    setEditPhone(profile.contactInfo.phone);
    setEditTelegram(profile.contactInfo.telegram);
    setEditInstagram(profile.contactInfo.instagram || '');
    setEditEmail(profile.contactInfo.email);
    setEditing(false);
  };

  const toggleEditInterest = (interest: string) => {
    if (editInterests.includes(interest)) {
      setEditInterests(editInterests.filter(i => i !== interest));
    } else {
      setEditInterests([...editInterests, interest]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setEditImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const cities = ['Addis Ababa', 'Adama', 'Hawassa', 'Bahir Dar', 'Dire Dawa', 'Gondar'];

  return (
    <div className="bg-[#FFFCF8] dark:bg-[#120A0E] min-h-screen transition-colors duration-200 pb-20">
      
      {/* Premium Header Grid/Cover Background */}
      <div className="relative bg-gradient-to-b from-[#EB317A]/20 via-[#C9A84C]/10 to-[#FFFCF8] dark:from-[#EB317A]/40 dark:via-[#EB317A]/15 dark:to-[#120A0E] h-28 sm:h-36 flex items-center justify-between px-4 sm:px-6 border-b border-[#EDE6D9] dark:border-[#C9A84C]/10">
        <button 
          onClick={onBack} 
          className="p-2 bg-[#1A1118] border border-[#C9A84C]/30 rounded-full text-[#C9A84C] hover:bg-[#EB317A] hover:text-white transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
        </button>

        {isOwnProfile && !editing && (
          <button 
            onClick={() => setEditing(true)} 
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#EB317A] hover:bg-[#F04B8E] text-white font-extrabold text-[10px] sm:text-xs rounded-xl shadow-md transition-all cursor-pointer border border-[#C9A84C]/20"
          >
            <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{t('profile.edit-profile')}</span>
          </button>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-3 sm:px-4 -mt-10 sm:-mt-16 relative z-10 space-y-4 sm:space-y-6">
        
        {/* Core Profile Card (Avatar & Identity) */}
        <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-4 sm:p-6 shadow-md flex flex-col items-center text-center relative overflow-hidden">
          
          {/* Avatar Container in Profile Size */}
          <div className="relative group">
            <div 
              className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#C9A84C] dark:border-[#C9A84C]/80 shadow-lg relative bg-gray-100 dark:bg-[#120A0E] ${editing ? 'cursor-pointer' : ''}`}
              onClick={editing ? () => fileInputRef.current?.click() : undefined}
            >
              <img 
                src={editing ? editImage : profile.image} 
                alt={editing ? editName : profile.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
              {editing && (
                <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1 transition-opacity">
                  <Camera className="h-5 w-5 text-[#C9A84C]" />
                  <span>{t('profile.upload-photo')}</span>
                </div>
              )}
            </div>
            {editing && <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />}
            
            {/* Status indicator badge */}
            <span className={`absolute bottom-2 right-2 border-2 border-white dark:border-[#1A1118] w-4 h-4 rounded-full ${
              (editing ? editStatus : profile.status) === 'Online' 
                ? 'bg-emerald-500' 
                : (editing ? editStatus : profile.status) === 'Offline'
                  ? 'bg-gray-400'
                  : 'bg-amber-500'
            }`} />
          </div>

          {/* Identity details */}
          <div className="mt-3 sm:mt-4 space-y-1.5">
            {editing ? (
              <div className="flex gap-2 justify-center items-center flex-wrap">
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  className="text-center text-lg sm:text-xl font-black border-b border-[#EB317A] dark:border-[#C9A84C] bg-transparent text-[#1A1118] dark:text-[#FFFCF8] focus:outline-hidden max-w-[160px] sm:max-w-[200px]"
                  placeholder="Your Name"
                />
                <div className="relative">
                  <input 
                    type="number" 
                    value={editAge} 
                    disabled
                    className="text-center text-lg sm:text-xl font-black border-b border-gray-300 dark:border-gray-600 bg-transparent text-gray-400 dark:text-gray-500 max-w-[50px] sm:max-w-[60px] cursor-not-allowed"
                    placeholder="Age"
                  />
                  <Lock className="h-3 w-3 text-gray-400 absolute -right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5">
                <h1 className="text-xl sm:text-2xl font-black text-[#1A1118] dark:text-[#FFFCF8]">
                  {profile.name}, {profile.age}
                </h1>
                {profile.verified && <ShieldCheck className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5 text-[#C9A84C] fill-[#C9A84C]/10" />}
              </div>
            )}

            {editing ? (
              <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#EB317A] dark:text-[#C9A84C]" />
                <select 
                  value={editCity} 
                  onChange={(e) => setEditCity(e.target.value)} 
                  className="border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-lg px-2 py-1 bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] outline-hidden text-[10px] sm:text-xs"
                >
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <span>Ethiopia</span>
              </div>
            ) : (
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-[#EB317A] dark:text-[#C9A84C]" />
                <span>{profile.city}, Ethiopia</span>
              </p>
            )}

            {!editing && (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EB317A]/5 dark:bg-[#EB317A]/15 text-[#EB317A] dark:text-[#C9A84C] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
                <span>{profile.status}</span>
              </div>
            )}
          </div>
        </div>

        {/* Edit Photo Upload Section */}
        {editing && (
          <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 sm:space-y-4">
            <h3 className="text-xs font-bold text-[#1A1118] dark:text-[#FFFCF8] uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="h-4 w-4 text-[#EB317A] dark:text-[#C9A84C]" />
              <span>{t('profile.change-photo')}</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex flex-col items-start gap-2">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">{t('profile.upload-new')}</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-xs font-bold text-gray-700 dark:text-[#FFFCF8] hover:border-[#EB317A] dark:hover:border-[#C9A84C] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Camera className="h-4 w-4" />
                  {t('profile.select-file')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Basic Configuration Parameters (Gender, intent, status) */}
        {editing && (
          <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 sm:space-y-4">
            <h3 className="text-xs font-bold text-[#1A1118] dark:text-[#FFFCF8] uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="h-4 w-4 text-[#EB317A] dark:text-[#C9A84C]" />
              <span>{t('profile.basic-settings')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase flex items-center gap-1">
                  {t('profile.my-gender')} <Lock className="h-3 w-3 text-gray-400" />
                </label>
                <div className="w-full text-xs border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl p-2.5 bg-gray-100 dark:bg-[#1A1118]/50 text-gray-400 dark:text-gray-500 flex items-center justify-between">
                  <span>{editGender}</span>
                  <span className="text-[8px] text-gray-400 italic">Locked</span>
                </div>
                <p className="text-[8px] text-amber-500/80 italic">Contact support to change gender</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{t('profile.looking-for')}</label>
                <select 
                  value={editLookingFor} 
                  onChange={(e) => setEditLookingFor(e.target.value as 'Male' | 'Female')} 
                  className="w-full text-xs border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl p-2.5 bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] outline-hidden"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{t('profile.relationship-intent')}</label>
                <select 
                  value={editRelationshipIntent} 
                  onChange={(e) => setEditRelationshipIntent(e.target.value)} 
                  className="w-full text-xs border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl p-2.5 bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] outline-hidden"
                >
                  <option value="True Relationship">True Relationship</option>
                  <option value="Friendship">Friendship</option>
                  <option value="Friends with Benefits">Friends with Benefits</option>
                  <option value="Only Sex">Only Sex</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{t('profile.live-status')}</label>
                <select 
                  value={editStatus} 
                  onChange={(e) => setEditStatus(e.target.value as Profile['status'])} 
                  className="w-full text-xs border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl p-2.5 bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] outline-hidden"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Recently Active">Recently Active</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Bio card */}
        <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2.5 sm:space-y-3">
          <div className="flex items-center gap-2 border-b border-[#EDE6D9] dark:border-[#C9A84C]/5 pb-2">
            <Heart className="h-4.5 w-4.5 text-[#EB317A] dark:text-[#C9A84C]" />
            <h2 className="text-xs font-bold text-[#1A1118] dark:text-[#FFFCF8] uppercase tracking-wider">{t('profile.about')}</h2>
          </div>
          {editing ? (
            <textarea 
              value={editBio} 
              onChange={(e) => setEditBio(e.target.value)} 
              rows={3} 
              className="w-full border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl p-2.5 sm:p-3 bg-[#F8F4ED]/50 dark:bg-[#120A0E] text-[11px] sm:text-xs text-gray-800 dark:text-[#FFFCF8] focus:outline-hidden focus:border-[#EB317A] dark:focus:border-[#C9A84C] resize-none"
              placeholder="Tell other members about yourself..."
            />
          ) : (
            <p className="text-[11px] sm:text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-light whitespace-pre-line">{profile.bio}</p>
          )}
        </div>

        {/* Intent & Interests Card */}
        <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 sm:space-y-4">
          {!editing && (
            <div className="flex flex-wrap items-center gap-3 border-b border-[#EDE6D9] dark:border-[#C9A84C]/5 pb-3">
              <span className={`inline-block text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase ${
                profile.relationshipIntent === 'True Relationship'
                  ? 'bg-[#EB317A]/5 dark:bg-[#EB317A]/15 text-[#EB317A] dark:text-[#C9A84C] border-[#EB317A]/20 dark:border-[#C9A84C]/30'
                  : profile.relationshipIntent === 'Friendship'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
              }`}>
                {profile.relationshipIntent}
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1 font-semibold">
                <User className="h-3.5 w-3.5" />
                {profile.gender}
              </span>
            </div>
          )}

          {/* Interests */}
          <div>
            <p className="text-[10px] font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider mb-2">{t('profile.interests-hobbies')}</p>
            {editing ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {editInterests.map((interest, idx) => (
                    <span key={idx} className="bg-[#EB317A]/10 dark:bg-[#EB317A]/30 text-[#EB317A] dark:text-[#C9A84C] text-[10px] px-2.5 py-1 rounded-full border border-[#EB317A]/30 dark:border-[#C9A84C]/40 flex items-center gap-1">
                      {interest}
                      <button onClick={() => setEditInterests(editInterests.filter(i => i !== interest))} className="hover:scale-110 transition-transform cursor-pointer">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="border-t border-[#EDE6D9] dark:border-[#C9A84C]/10 pt-2.5">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold mb-1.5">{t('profile.select-add-interests')}</p>
                  <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto p-1 bg-[#F8F4ED]/30 dark:bg-[#120A0E]/30 rounded-xl border border-[#EDE6D9]/50 dark:border-transparent">
                    {ALL_INTERESTS.filter(i => !editInterests.includes(i)).map((interest) => (
                      <button key={interest} onClick={() => toggleEditInterest(interest)} className="bg-[#F8F4ED] dark:bg-[#120A0E] text-gray-500 dark:text-gray-400 hover:text-[#EB317A] dark:hover:text-[#C9A84C] text-[10.5px] px-2.5 py-1 rounded-full border border-[#EDE6D9] dark:border-[#C9A84C]/10 hover:border-[#EB317A]/30 dark:hover:border-[#C9A84C]/40 transition-colors cursor-pointer">
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

        {/* Contact info card */}
        <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 border-b border-[#EDE6D9] dark:border-[#C9A84C]/5 pb-2">
            <Crown className="h-4.5 w-4.5 text-[#EB317A] dark:text-[#C9A84C]" />
            <h2 className="text-xs font-bold text-[#1A1118] dark:text-[#FFFCF8] uppercase tracking-wider">{t('profile.contact-info')}</h2>
          </div>

          {editing ? (
            <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase flex items-center gap-1">
                    {t('profile.phone')} <Lock className="h-3 w-3 text-gray-400" />
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 sm:left-3.5 sm:top-3.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={editPhone} 
                      disabled
                      className="w-full text-[11px] sm:text-xs pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl bg-gray-100 dark:bg-[#1A1118]/50 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[8px] text-amber-500/80 italic">Verify to change phone number</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{t('profile.telegram')}</label>
                  <div className="relative">
                    <TelegramIcon className="absolute left-3 top-2.5 sm:left-3.5 sm:top-3.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={editTelegram} 
                      onChange={(e) => setEditTelegram(e.target.value)} 
                      className="w-full text-[11px] sm:text-xs pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] focus:outline-hidden focus:border-[#EB317A] dark:focus:border-[#C9A84C]"
                      placeholder="e.g. @telegramhandle"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{t('profile.instagram')}</label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-2.5 sm:left-3.5 sm:top-3.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={editInstagram} 
                      onChange={(e) => setEditInstagram(e.target.value)} 
                      className="w-full text-[11px] sm:text-xs pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] focus:outline-hidden focus:border-[#EB317A] dark:focus:border-[#C9A84C]"
                      placeholder="e.g. @instahandle"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{t('profile.email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 sm:left-3.5 sm:top-3.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                    <input 
                      type="email" 
                      value={editEmail} 
                      onChange={(e) => setEditEmail(e.target.value)} 
                      className="w-full text-[11px] sm:text-xs pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl bg-white dark:bg-[#1A1118] text-gray-800 dark:[#FFFCF8] focus:outline-hidden focus:border-[#EB317A] dark:focus:border-[#C9A84C]"
                      placeholder="e.g. email@example.com"
                    />
                  </div>
                </div>
            </div>
          ) : isUnlocked ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 p-2 rounded-lg shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{t('profile.phone')}</p>
                  <p className="font-bold text-gray-800 dark:text-[#FFFCF8] text-xs sm:text-sm">{profile.contactInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl">
                <div className="bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 p-2 rounded-lg shrink-0">
                  <TelegramIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{t('profile.telegram')}</p>
                  <p className="font-bold text-sky-600 dark:text-sky-400 text-xs sm:text-sm">{profile.contactInfo.telegram}</p>
                </div>
              </div>

              {profile.contactInfo.instagram && (
                <div className="flex items-center gap-3 p-3 bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl">
                  <div className="bg-[#EB317A]/10 dark:bg-[#EB317A]/30 text-[#EB317A] dark:text-[#C9A84C] p-2 rounded-lg shrink-0">
                    <Instagram className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{t('profile.instagram')}</p>
                    <p className="font-bold text-[#EB317A] dark:text-[#C9A84C] text-xs sm:text-sm">{profile.contactInfo.instagram}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl">
                <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 p-2 rounded-lg shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{t('profile.email')}</p>
                  <p className="font-bold text-gray-800 dark:text-[#FFFCF8] text-xs sm:text-sm truncate">{profile.contactInfo.email}</p>
                </div>
              </div>
            </div>
          ) : pendingPayment ? (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl p-4 text-xs text-amber-800 dark:text-amber-300 text-center animate-pulse">
              <span className="font-bold">{t('profile.verify-pending')}</span>
              <p className="text-[10px] mt-1">{t('profile.verify-pending-desc').replace('{txId}', pendingPayment.transactionId)}</p>
            </div>
          ) : (
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-xl p-4 sm:p-6">
                <Lock className="h-8 w-8 sm:h-10 sm:w-10 text-[#EB317A] dark:text-[#C9A84C] mx-auto mb-2 sm:mb-3 animate-bounce" />
                <p className="text-xs sm:text-sm font-bold text-[#1A1118] dark:text-[#FFFCF8]">{t('profile.contact-locked')}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 font-light">{t('profile.contact-locked-desc')}</p>
              </div>
              
              <button
                onClick={() => onUnlockClick(profile)}
                className="w-full py-3 sm:py-3.5 bg-[#EB317A] hover:bg-[#F04B8E] text-white font-extrabold text-[10px] sm:text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[#EB317A]/20"
              >
                <Lock className="h-4 w-4" />
                <span>{t('profile.see-contact-btn')}</span>
                <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-md font-extrabold ml-1">{t('profile.free-badge')}</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Save / Cancel Fixed Action Bar in Edit Mode */}
      {editing && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1A1118]/95 backdrop-blur-md border-t border-[#EDE6D9] dark:border-[#C9A84C]/10 p-3 sm:p-4 flex gap-3 z-50 shadow-lg pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] lg:pb-3">
          <button 
            type="button"
            onClick={handleCancel} 
            className="flex-1 py-3 bg-[#F8F4ED] dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/15 text-[#1A1118] dark:text-[#FFFCF8] font-bold text-xs rounded-xl hover:bg-[#EDE6D9] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <X className="h-4 w-4" />
            {t('profile.cancel')}
          </button>
          <button 
            type="button"
            onClick={handleSave} 
            className="flex-1 py-3 bg-[#EB317A] hover:bg-[#F04B8E] text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-[#EB317A]/15"
          >
            <Check className="h-4 w-4" />
            {t('profile.save-profile')}
          </button>
        </div>
      )}
    </div>
  );
}
