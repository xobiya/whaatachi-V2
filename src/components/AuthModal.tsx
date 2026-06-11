import React, { useState, useRef, useEffect } from 'react';
import { X, AlertCircle, User, Phone, Send, UserPlus, Camera, MapPin, Instagram } from 'lucide-react';
import TelegramIcon from './TelegramIcon';
import { Profile } from '../types';
import { sanitizeInput, sanitizePhone, sanitizeTelegram, sanitizeInstagram } from '../utils/sanitize';
import { useUIContext } from '../context/UIContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'register' | 'signin';
  featuredProfiles: Profile[];
  onRegisterUser: (newProfile: Profile) => void;
  onSignInUser: (name: string, phone: string, telegram?: string, instagram?: string) => void;
  onSimulateTestLogin: (profile: Profile) => void;
}

const PRESET_MALE_IMAGES = [
  '/assets/1.avif',
  '/assets/2.avif',
  '/assets/3.avif',
];

const PRESET_FEMALE_IMAGES = [
  '/assets/One.avif',
  '/assets/two.avif',
  '/assets/One.avif',
];

const ETHIOPIAN_CITIES = [
  'Addis Ababa', 'Adama', 'Hawassa', 'Bahir Dar', 'Dire Dawa', 'Gondar', 'Mekelle', 'Jimma', 'Dessie', 'Other'
];

export default function AuthModal({
  isOpen, onClose, initialTab = 'register', featuredProfiles,
  onRegisterUser, onSignInUser, onSimulateTestLogin
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'register' | 'signin'>(initialTab);

  const [fullName, setFullName] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [age, setAge] = useState('');
  const [myGender, setMyGender] = useState<'Male' | 'Female'>('Male');
  const [lookingFor, setLookingFor] = useState<'Male' | 'Female'>('Female');
  const [city, setCity] = useState('Addis Ababa');
  const [bio, setBio] = useState('');
  const [relationshipIntent, setRelationshipIntent] = useState<'True Relationship' | 'Friendship' | 'Friends with Benefits' | 'Only Sex'>('True Relationship');

  const [photoSource, setPhotoSource] = useState<'preset' | 'upload'>('preset');
  const [selectedPresetImage, setSelectedPresetImage] = useState(PRESET_MALE_IMAGES[0]);
  const [localUploadedImage, setLocalUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [signInName, setSignInName] = useState('');
  const [signInContactType, setSignInContactType] = useState<'phone' | 'telegram' | 'instagram'>('phone');
  const [signInContact, setSignInContact] = useState('');

  const [validationError, setValidationError] = useState<string | null>(null);
  const { t } = useUIContext();

  useEffect(() => {
    setActiveTab(initialTab);
    setValidationError(null);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleMyGenderChange = (gender: 'Male' | 'Female') => {
    setMyGender(gender);
    setLookingFor(gender === 'Male' ? 'Female' : 'Male');
    setSelectedPresetImage(gender === 'Male' ? PRESET_MALE_IMAGES[0] : PRESET_FEMALE_IMAGES[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalUploadedImage(reader.result as string);
        setPhotoSource('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  function isValidEthiopianPhone(phone: string): boolean {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return /^(?:\+251|0)?[79]\d{8}$/.test(cleaned);
  }

  const handleCreateRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!fullName.trim()) {
      setValidationError(t('auth.required-name'));
      return;
    }
    const hasPhone = phoneNumber.trim().length > 0;
    const hasTelegram = telegramUsername.trim().length > 0;
    const hasInstagram = instagramUsername.trim().length > 0;
    if (!hasPhone && !hasTelegram && !hasInstagram) {
      setValidationError(t('auth.required-one-contact'));
      return;
    }
    if (hasPhone && !isValidEthiopianPhone(phoneNumber)) {
      setValidationError(t('auth.invalid-ethiopian-phone'));
      return;
    }

    const ageNum = age ? parseInt(age, 10) : 24;
    const finalImage = photoSource === 'preset'
      ? selectedPresetImage
      : (localUploadedImage || (myGender === 'Male' ? PRESET_MALE_IMAGES[0] : PRESET_FEMALE_IMAGES[0]));

    const safeName = sanitizeInput(fullName);
    const safePhone = sanitizePhone(phoneNumber);
    const safeTelegram = sanitizeTelegram(telegramUsername);
    const safeInstagram = sanitizeInstagram(instagramUsername);
    const safeCity = sanitizeInput(city);
    const safeBio = sanitizeInput(bio) || `Hi, I'm looking for an authentic connection on Whaatachi.`;

    const newProfile: Profile = {
      id: `custom-profile-${Date.now()}`,
      name: safeName,
      age: ageNum,
      city: safeCity,
      bio: safeBio,
      gender: myGender,
      lookingFor,
      image: finalImage,
      status: 'Online',
      relationshipIntent,
      interests: ['Coffee & Chat', 'Dinner Out', 'Night Life', 'Ethio Arts'],
      verified: false,
      contactInfo: {
        phone: safePhone,
        telegram: safeTelegram.replace('@', '') || safeName.toLowerCase().replace(/\s+/g, ''),
        instagram: safeInstagram.replace('@', '') || '',
        email: `${safeName.toLowerCase().replace(/\s+/g, '')}@example.com`
      }
    };

    onRegisterUser(newProfile);
    onClose();
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!signInName.trim()) {
      setValidationError(t('auth.required-name-signin'));
      return;
    }
    if (!signInContact.trim()) {
      setValidationError(t('auth.required-one-contact'));
      return;
    }

    const phone = signInContactType === 'phone' ? signInContact.trim() : '';
    const telegram = signInContactType === 'telegram' ? signInContact.trim() : '';
    const instagram = signInContactType === 'instagram' ? signInContact.trim() : '';
    onSignInUser(signInName.trim(), phone, telegram, instagram);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#1A1118]/80 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="flex items-start sm:items-center justify-center min-h-screen p-3 sm:p-4">
        <div className="relative w-full max-w-md sm:max-w-lg bg-[#FFFCF8] dark:bg-[#120A0E] border border-[#C9A84C]/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-left transform transition-all duration-300 animate-scaleIn my-4 sm:my-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-[#EB317A] dark:hover:text-[#C9A84C] bg-[#F8F4ED] dark:bg-[#1A1118] hover:bg-[#FAD0E8] dark:hover:bg-[#EB317A]/20 transition-colors cursor-pointer z-10"
            aria-label={t('auth.close')}
          >
            <X className="h-4.5 w-4.5" />
          </button>

          <div className="flex border-b border-[#EDE6D9] dark:border-[#C9A84C]/10 bg-[#F8F4ED]/50 dark:bg-[#1A1118]/50">
            <button
              onClick={() => { setActiveTab('register'); setValidationError(null); }}
              className={`flex-1 text-center py-3 sm:py-4 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                activeTab === 'register'
                  ? 'border-[#EB317A] dark:border-[#C9A84C] text-[#EB317A] dark:text-[#C9A84C] bg-[#FFFCF8] dark:bg-[#120A0E]'
                  : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-[#1A1118] dark:hover:text-[#FFFCF8]'
              }`}
            >
              {t('auth.register')}
            </button>
            <button
              onClick={() => { setActiveTab('signin'); setValidationError(null); }}
              className={`flex-1 text-center py-3 sm:py-4 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                activeTab === 'signin'
                  ? 'border-[#EB317A] dark:border-[#C9A84C] text-[#EB317A] dark:text-[#C9A84C] bg-[#FFFCF8] dark:bg-[#120A0E]'
                  : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-[#1A1118] dark:hover:text-[#FFFCF8]'
              }`}
            >
              {t('auth.sign-in')}
            </button>
          </div>

          {validationError && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-[#EB317A]/5 dark:bg-[#EB317A]/10 border border-[#EB317A]/20 dark:border-[#EB317A]/30 text-[#EB317A] dark:text-[#FAD0E8] text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 text-[#EB317A] dark:text-[#FAD0E8]" />
              <span className="font-semibold">{validationError}</span>
            </div>
          )}

          <div className="p-4 sm:p-6">
            {activeTab === 'register' ? (
              <form onSubmit={handleCreateRegisterSubmit} className="space-y-3 sm:space-y-4">
                <div className="text-center pb-1 sm:pb-2">
                  <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#EB317A] to-pink-600 flex items-center justify-center shadow-lg shadow-[#EB317A]/20 mb-3 sm:mb-4">
                    <UserPlus className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#1A1118] dark:text-[#FFFCF8] tracking-tight">{t('auth.create-profile')}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">{t('auth.join-desc')}</p>
                </div>

                <div className="relative pt-2">
                  <div className="absolute inset-x-0 top-0 border-t border-[#EDE6D9] dark:border-[#C9A84C]/10" />
                  <span className="relative -top-2.5 inline-block bg-[#FFFCF8] dark:bg-[#120A0E] px-2 text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Basic Info</span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">{t('auth.full-name-label')}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-gray-400" />
                    <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="E.g. Dawit Haile" className="w-full pl-9 pr-4 py-2.5 sm:py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-sm bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:border-[#EB317A] dark:focus:border-[#C9A84C] focus:ring-1 focus:ring-[#EB317A]/20 dark:focus:ring-[#C9A84C]/20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">{t('auth.age')}</label>
                    <input type="number" min="18" max="60" value={age} onChange={(e) => setAge(e.target.value)} placeholder="24" className="w-full px-4 py-2.5 sm:py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-sm bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:border-[#EB317A] dark:focus:border-[#C9A84C] focus:ring-1 focus:ring-[#EB317A]/20 dark:focus:ring-[#C9A84C]/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">{t('auth.i-am')}</label>
                    <div className="grid grid-cols-2 bg-[#F8F4ED] dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl p-1 gap-1">
                      {(['Male', 'Female'] as const).map((g) => (
                        <button key={g} type="button" onClick={() => handleMyGenderChange(g)} className={`py-2 text-xs font-bold text-center rounded-lg transition-all cursor-pointer ${myGender === g ? 'bg-[#EB317A] dark:bg-[#EB317A] text-white' : 'text-gray-500 dark:text-gray-400 hover:text-[#1A1118] dark:hover:text-[#FFFCF8]'}`}>
                          {g === 'Male' ? t('auth.man') : t('auth.woman')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative pt-2">
                  <div className="absolute inset-x-0 top-0 border-t border-[#EDE6D9] dark:border-[#C9A84C]/10" />
                  <span className="relative -top-2.5 inline-block bg-[#FFFCF8] dark:bg-[#120A0E] px-2 text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">About You</span>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">{t('auth.looking-for')}</label>
                  <div className="grid grid-cols-2 bg-[#F8F4ED] dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl p-1 gap-1">
                    {(['Male', 'Female'] as const).map((s) => (
                      <button key={s} type="button" onClick={() => setLookingFor(s)} className={`py-2 text-xs font-bold text-center rounded-lg transition-all cursor-pointer ${lookingFor === s ? 'bg-[#EB317A] dark:bg-[#EB317A] text-white' : 'text-gray-500 dark:text-gray-400 hover:text-[#1A1118] dark:hover:text-[#FFFCF8]'}`}>
                        {s === 'Male' ? t('auth.men') : t('auth.women')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">{t('auth.city-label')}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full pl-9 pr-4 py-2.5 sm:py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-sm bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] focus:outline-hidden focus:border-[#EB317A] dark:focus:border-[#C9A84C] focus:ring-1 focus:ring-[#EB317A]/20 dark:focus:ring-[#C9A84C]/20 appearance-none cursor-pointer">
                      {ETHIOPIAN_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">{t('profile.relationship-intent')}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 bg-[#F8F4ED] dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl p-1 gap-1">
                    {(['True Relationship', 'Friendship', 'Friends with Benefits', 'Only Sex'] as const).map((intent) => (
                      <button key={intent} type="button" onClick={() => setRelationshipIntent(intent)} className={`py-2 text-[10px] font-bold text-center rounded-lg transition-all cursor-pointer ${relationshipIntent === intent ? 'bg-[#EB317A] dark:bg-[#EB317A] text-white' : 'text-gray-500 dark:text-gray-400 hover:text-[#1A1118] dark:hover:text-[#FFFCF8]'}`}>
                        {intent === 'True Relationship' ? 'Relationship' : intent === 'Friendship' ? 'Friendship' : intent === 'Friends with Benefits' ? 'FWB' : 'Only Sex'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">{t('profile.about')}</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Write a short bio about yourself..." rows={2} className="w-full px-4 py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-sm bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:border-[#EB317A] dark:focus:border-[#C9A84C] resize-none" />
                </div>

                <div className="relative pt-2">
                  <div className="absolute inset-x-0 top-0 border-t border-[#EDE6D9] dark:border-[#C9A84C]/10" />
                  <span className="relative -top-2.5 inline-block bg-[#FFFCF8] dark:bg-[#120A0E] px-2 text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Contact</span>
                </div>

                <p className="text-[11px] text-gray-500 dark:text-gray-400 -mt-2">{t('auth.required-one-contact')}</p>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">{t('auth.phone-label')}</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+251 9XX XXX XXX" className="w-full pl-9 pr-4 py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-sm bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:border-[#EB317A] dark:focus:border-[#C9A84C]" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">{t('auth.telegram-label')}</label>
                  <div className="relative">
                    <TelegramIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input type="text" value={telegramUsername} onChange={(e) => setTelegramUsername(e.target.value)} placeholder="@yourusername" className="w-full pl-9 pr-4 py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-sm bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:border-[#EB317A] dark:focus:border-[#C9A84C]" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">{t('auth.instagram-label')}</label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input type="text" value={instagramUsername} onChange={(e) => setInstagramUsername(e.target.value)} placeholder="@yourusername" className="w-full pl-9 pr-4 py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-sm bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:border-[#EB317A] dark:focus:border-[#C9A84C]" />
                  </div>
                </div>

                <div className="relative pt-2">
                  <div className="absolute inset-x-0 top-0 border-t border-[#EDE6D9] dark:border-[#C9A84C]/10" />
                  <span className="relative -top-2.5 inline-block bg-[#FFFCF8] dark:bg-[#120A0E] px-2 text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Photo</span>
                </div>

                <div className="bg-[#F8F4ED]/50 dark:bg-[#1A1118]/50 border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex gap-2">
                      {(myGender === 'Male' ? PRESET_MALE_IMAGES : PRESET_FEMALE_IMAGES).slice(0, 3).map((url, idx) => (
                        <button key={idx} type="button" onClick={() => { setSelectedPresetImage(url); setPhotoSource('preset'); }} className={`w-14 h-14 rounded-full overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${photoSource === 'preset' && selectedPresetImage === url ? 'border-[#EB317A] dark:border-[#C9A84C] scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                          <img src={url} alt="" loading="lazy" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{t('auth.or')}</span>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs font-bold text-[#EB317A] dark:text-[#C9A84C] hover:text-[#F04B8E] dark:hover:text-[#E0C878] flex items-center gap-1 cursor-pointer">
                      <Camera className="h-3.5 w-3.5" /> {t('auth.upload-photo')}
                    </button>
                    <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
                  </div>
                  {photoSource === 'upload' && localUploadedImage && (
                    <div className="mt-1">
                      <img src={localUploadedImage} alt="Preview" loading="lazy" className="w-14 h-14 rounded-full object-cover border-2 border-[#C9A84C]" />
                    </div>
                  )}
                </div>

                <button type="submit" className="w-full py-3.5 bg-[#EB317A] hover:bg-[#F04B8E] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#EB317A]/20 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer">
                  <UserPlus className="h-4 w-4" />
                  <span>{t('auth.create-submit')}</span>
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-[#EB317A] dark:text-[#C9A84C] uppercase tracking-widest">{t('auth.welcome-back')}</span>
                  <h2 className="text-xl font-black text-[#1A1118] dark:text-[#FFFCF8] mt-1">{t('auth.sign-in-title')}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('auth.sign-in-desc')}</p>
                </div>

                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-[#1A1118]/60 dark:text-[#FFFCF8]/50 uppercase tracking-widest">{t('auth.sign-in-name')}</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                      <input type="text" required value={signInName} onChange={(e) => setSignInName(e.target.value)} placeholder="e.g. Dawit Haile" className="w-full pl-10 pr-4 py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-sm bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:border-[#EB317A] dark:focus:border-[#C9A84C]" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-[#1A1118]/60 dark:text-[#FFFCF8]/50 uppercase tracking-widest">Sign in with</label>
                    <div className="grid grid-cols-3 gap-1 p-1 bg-[#F8F4ED] dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl">
                      {(['phone', 'telegram', 'instagram'] as const).map((type) => {
                        const Icon = type === 'phone' ? Phone : type === 'telegram' ? TelegramIcon : Instagram;
                        const label = type === 'phone' ? t('auth.phone-label') : type === 'telegram' ? t('auth.telegram-label') : t('auth.instagram-label');
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => { setSignInContactType(type); setSignInContact(''); }}
                            className={`flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                              signInContactType === type
                                ? 'bg-[#EB317A] dark:bg-[#EB317A] text-white'
                                : 'text-gray-500 dark:text-gray-400 hover:text-[#1A1118] dark:hover:text-[#FFFCF8]'
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{label}</span>
                            <span className="sm:hidden">{type === 'phone' ? 'Phone' : type === 'telegram' ? 'TG' : 'IG'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-[#1A1118]/60 dark:text-[#FFFCF8]/50 uppercase tracking-widest">
                      {signInContactType === 'phone' ? t('auth.phone-label') : signInContactType === 'telegram' ? t('auth.telegram-label') : t('auth.instagram-label')}
                    </label>
                    <div className="relative">
                      {(() => {
                        const Icon = signInContactType === 'phone' ? Phone : signInContactType === 'telegram' ? TelegramIcon : Instagram;
                        const placeholder = signInContactType === 'phone' ? '+251 9XX XXX XXX' : signInContactType === 'telegram' ? '@yourusername' : '@instahandle';
                        const inputType = signInContactType === 'phone' ? 'tel' : 'text';
                        return (
                          <>
                            <Icon className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                            <input
                              type={inputType}
                              value={signInContact}
                              onChange={(e) => setSignInContact(e.target.value)}
                              placeholder={placeholder}
                              className="w-full pl-10 pr-4 py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-sm bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:border-[#EB317A] dark:focus:border-[#C9A84C]"
                            />
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3.5 bg-[#EB317A] hover:bg-[#F04B8E] text-white font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-[#EB317A]/20 mt-2">
                    <Send className="h-3.5 w-3.5" />
                    <span>{t('auth.sign-in-btn')}</span>
                  </button>
                </form>

                <div className="border-t border-[#EDE6D9] dark:border-[#C9A84C]/10 pt-4 space-y-2.5">
                  <span className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">{t('auth.quick-test')}</span>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-light leading-snug">{t('auth.quick-test-desc')}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {featuredProfiles.slice(0, 3).map((testProfile) => (
                      <button key={testProfile.id} onClick={() => { onSimulateTestLogin(testProfile); onClose(); }} className="p-2 border border-[#EDE6D9] dark:border-[#C9A84C]/15 hover:border-[#EB317A]/30 dark:hover:border-[#C9A84C]/30 rounded-xl bg-[#F8F4ED]/20 dark:bg-[#1A1118]/50 cursor-pointer text-left flex items-center gap-2 group transition-all shrink-0">
                        <img src={testProfile.image} alt={testProfile.name} className="w-8 h-8 rounded-full object-cover border group-hover:border-[#EB317A] dark:group-hover:border-[#C9A84C] transition-colors" referrerPolicy="no-referrer" />
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-bold text-[#1A1118] dark:text-[#FFFCF8] truncate">{testProfile.name.split(' ')[0]}</p>
                          <p className="text-[8px] text-gray-400 font-mono italic capitalize">{testProfile.gender}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
