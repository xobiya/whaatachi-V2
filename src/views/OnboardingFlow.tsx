import React, { useState, useRef, useEffect } from 'react';
import { Heart, Users, ArrowRight, ArrowLeft, User, Phone, Instagram, MapPin, Camera, Check, LogIn, UserPlus, X } from 'lucide-react';
import TelegramIcon from '../components/TelegramIcon';
import { Profile } from '../types';
import { useUIContext } from '../context/UIContext';
import SelectDropdown from '../components/SelectDropdown';

const CITIES = ['Addis Ababa', 'Adama', 'Hawassa', 'Bahir Dar', 'Dire Dawa', 'Gondar', 'Mekelle', 'Jimma', 'Dessie', 'Harar'];
const AREAS: Record<string, string[]> = {
  'Addis Ababa': ['Bole', 'Piassa', 'Kazanchis', 'Merkato', 'Megenagna', '4 Kilo', '6 Kilo', 'CMC', 'Gerji', 'Sarbet', 'Yeka', 'Akaky Kaliti'],
  'Adama': ['Center', 'Wonji', 'Kebena', 'Stadium Area'],
  'Hawassa': ['Tabor', 'Mehal Ketema', 'Haik Dar', 'Stadium'],
  'Bahir Dar': ['Tana', 'Belay Zeleke', 'Shewa Ber'],
  'Dire Dawa': ['Kezira', 'Dire', 'Addis Ketema'],
  'Gondar': ['Azezo', 'Maraki', 'Tewodros Square'],
  'Mekelle': ['Hawelti', 'Ayder', 'Adi Haki'],
  'Jimma': ['Center', 'Mendera'],
  'Dessie': ['Center', 'Wolda Road'],
  'Harar': ['Harar Jugol', 'New Town'],
};
const DEFAULT_AREA: Record<string, string> = {
  'Addis Ababa': 'Piassa',
  'Adama': 'Center',
  'Hawassa': 'Tabor',
  'Bahir Dar': 'Tana',
  'Dire Dawa': 'Kezira',
  'Gondar': 'Azezo',
  'Mekelle': 'Hawelti',
  'Jimma': 'Center',
  'Dessie': 'Center',
  'Harar': 'Harar Jugol',
};

const PRESET_MALE_IMAGES = [
  '/assets/1.avif',
  '/assets/2.avif',
  '/assets/3.avif',
  '/assets/1.avif',
];

const PRESET_FEMALE_IMAGES = [
  '/assets/One.avif',
  '/assets/two.avif',
  '/assets/three.avif',
  '/assets/four.avif',
];

type Intent = 'True Relationship' | 'Friendship' | 'Friends with Benefits' | 'Only Sex';
type Gender = 'Male' | 'Female';

interface RegFormData {
  name: string;
  age: string;
  phone: string;
  telegram: string;
  instagram: string;
  city: string;
  address: string;
  image: string;
  gender: Gender;
}

function isValidEthiopianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^(?:\+251|0)?[79]\d{8}$/.test(cleaned);
}

interface OnboardingFlowProps {
  onComplete: (profile: Profile) => void;
  onSignIn: (phone: string, telegram: string, instagram: string) => Promise<boolean>;
  authIntent?: 'register' | 'signin';
}

const INTENT_OPTIONS: { value: Intent; emoji: string; desc: string }[] = [
  { value: 'True Relationship', emoji: '❤️', desc: 'onboarding.intent-relationship' },
  { value: 'Friendship',        emoji: '🤝', desc: 'onboarding.intent-friendship'  },
  { value: 'Friends with Benefits', emoji: '💕', desc: 'onboarding.intent-fwb'  },
  { value: 'Only Sex',          emoji: '🔥', desc: 'onboarding.intent-sex'            },
];

const STEP_LABEL_KEYS = ['onboarding.step1-title', 'onboarding.step-gender-title', 'onboarding.step2-title', 'onboarding.step3-title'];

export default function OnboardingFlow({ onComplete, onSignIn, authIntent }: OnboardingFlowProps) {
  // Sign-in state
  const [showSignIn, setShowSignIn] = useState(false);
  const [signInContactType, setSignInContactType] = useState<'phone' | 'telegram' | 'instagram'>('phone');
  const [signInContact, setSignInContact] = useState('');
  const [signInError, setSignInError] = useState<string | null>(null);

  useEffect(() => {
    if (authIntent === 'signin') {
      setShowSignIn(true);
    }
  }, [authIntent]);

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    if (!signInContact.trim()) {
      setSignInError(t('auth.required-one-contact'));
      return;
    }
    const phone = signInContactType === 'phone' ? signInContact.trim() : '';
    const telegram = signInContactType === 'telegram' ? signInContact.trim() : '';
    const instagram = signInContactType === 'instagram' ? signInContact.trim() : '';
    onSignIn(phone, telegram, instagram).then(success => {
      if (!success) {
        setSignInError(t('app.notify.no-account'));
      }
    });
  };

  // Registration wizard
  const [step, setStep] = useState(1);
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const [selectedLookingFor, setSelectedLookingFor] = useState<Gender | null>(null);
  const [form, setForm] = useState<RegFormData>({
    name: '', age: '', phone: '', telegram: '', instagram: '',
    city: 'Addis Ababa', address: DEFAULT_AREA['Addis Ababa'], image: '', gender: 'Male',
  });
  const [regErrors, setRegErrors] = useState<Partial<RegFormData>>({});
  const [toastError, setToastError] = useState<string | null>(null);
  const { t } = useUIContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── helpers ── */
  const setField = (field: keyof RegFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setRegErrors(prev => ({ ...prev, [field]: undefined }));
    if (toastError) setToastError(null);
  };

  const validateReg = (): boolean => {
    const e: Partial<RegFormData> = {};
    const msgs: string[] = [];
    if (!form.name.trim()) { e.name = 'Full name is required'; msgs.push('Full name is required'); }
    if (!form.age || Number(form.age) < 18 || Number(form.age) > 60) { e.age = 'Age must be 18–60'; msgs.push('Age must be 18–60'); }
    const hasPhone = form.phone.trim().length > 0;
    const hasTelegram = form.telegram.trim().length > 0;
    const hasInstagram = form.instagram.trim().length > 0;
    if (!hasPhone && !hasTelegram && !hasInstagram) {
      const msg = 'At least phone, Telegram, or Instagram is required';
      e.phone = msg; e.telegram = msg; e.instagram = msg;
      msgs.push(msg);
    }
    if (hasPhone && !isValidEthiopianPhone(form.phone)) {
      e.phone = 'Please enter a valid Ethiopian phone number (e.g., +251 9XX XXX XXX)';
      msgs.push('Invalid Ethiopian phone number');
    }
    if (!form.city) { e.city = 'City is required'; msgs.push('City is required'); }
    if (!form.address.trim()) { e.address = 'Area / Location is required'; msgs.push('Area / Location is required'); }
    if (!form.image) { e.image = 'Profile photo is required'; msgs.push('Profile photo is required'); }
    setRegErrors(e);
    if (msgs.length > 0) setToastError(msgs.join(' • '));
    return Object.keys(e).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setField('image', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleRegSubmit = () => {
    if (!validateReg()) return;
    const finalImage = form.image;
    const tg = form.telegram.startsWith('@') ? form.telegram : `@${form.telegram}`;
    const ig = form.instagram ? (form.instagram.startsWith('@') ? form.instagram : `@${form.instagram}`) : '';

    onComplete({
      id: `user-${Date.now()}`,
      name: form.name.trim(),
      age: Number(form.age),
      city: form.city,
      address: form.address,
      bio: `Looking for ${selectedIntent} in ${form.city}.`,
      gender: form.gender,
      lookingFor: selectedLookingFor || (form.gender === 'Male' ? 'Female' : 'Male'),
      image: finalImage,
      status: 'Online',
      relationshipIntent: selectedIntent!,
      interests: [],
      verified: false,
      contactInfo: { phone: form.phone, telegram: tg, instagram: ig, email: '' },
    });
  };


  /* ────────────────────────────── RENDER ────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#120A0E] via-[#1A1118] to-[#0D0610] flex flex-col items-center px-4 py-6 relative overflow-hidden">
      {/* Blobs */}
      <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-[#EB317A]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-[#C9A84C]/8 rounded-full blur-[80px] pointer-events-none" />

      {/* Logo + Sign In row */}
        <div className="flex items-center justify-between w-full max-w-lg mb-4 z-10">
          <div className="flex items-center gap-2">
            <img src="/assets/logos.png" alt="Whaatachi" className="h-16 sm:h-20 w-auto" />
          </div>
        <button
          onClick={() => setShowSignIn(true)}
          className="px-4 py-2 bg-[#FFFCF8]/5 border border-[#C9A84C]/20 hover:border-[#C9A84C]/50 text-[#C9A84C] hover:text-[#E0C878] text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
        >
          <LogIn className="h-3.5 w-3.5" />
          {t('auth.sign-in')}
        </button>
      </div>

      {/* ══════════ SIGN IN / REGISTRATION (toggle) ══════════ */}
      {showSignIn ? (
        <div className="w-full max-w-lg bg-[#1A1118]/80 backdrop-blur-xl border border-[#C9A84C]/10 rounded-2xl p-5 shadow-2xl z-10">
          <div className="flex items-center gap-2 mb-5">
            <button onClick={() => { setShowSignIn(false); setSignInError(null); }} className="flex items-center gap-1 text-[#FFFCF8]/40 hover:text-[#C9A84C] text-xs font-bold cursor-pointer transition-colors">
              <ArrowLeft className="h-4 w-4" /> {t('onboarding.back')}
            </button>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest">{t('auth.welcome-back')}</span>
            <h2 className="text-xl font-black text-[#FFFCF8] mt-1">{t('auth.sign-in-title')}</h2>
            <p className="text-xs text-[#EDE6D9]/50 mb-5">{t('auth.sign-in-desc')}</p>
          </div>
          {signInError && (
            <div className="mb-4 p-3 rounded-xl bg-pink-500/10 border border-pink-400/30 text-pink-300 text-xs">{signInError}</div>
          )}
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[9px] font-bold text-[#FFFCF8]/40 uppercase tracking-widest">Sign in with</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#FFFCF8]/5 rounded-xl border border-[#FFFCF8]/10">
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
                          ? 'bg-[#C9A84C] text-[#1A1118]'
                          : 'text-[#FFFCF8]/50 hover:text-[#FFFCF8]/80'
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
              <label className="block text-[9px] font-bold text-[#FFFCF8]/40 uppercase tracking-widest">
                {signInContactType === 'phone' ? t('auth.phone-label') : signInContactType === 'telegram' ? t('auth.telegram-label') : t('auth.instagram-label')}
              </label>
              <div className="relative">
                {(() => {
                  const Icon = signInContactType === 'phone' ? Phone : signInContactType === 'telegram' ? TelegramIcon : Instagram;
                  const placeholder = signInContactType === 'phone' ? '+251 9XX XXX XXX' : signInContactType === 'telegram' ? '@yourusername' : '@instahandle';
                  const inputType = signInContactType === 'phone' ? 'tel' : 'text';
                  return (
                    <>
                      <Icon className="absolute left-3.5 top-3 h-4 w-4 text-[#FFFCF8]/30" />
                      <input
                        type={inputType}
                        value={signInContact}
                        onChange={(e) => setSignInContact(e.target.value)}
                        placeholder={placeholder}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FFFCF8]/5 border border-[#FFFCF8]/10 rounded-xl text-sm text-[#FFFCF8] placeholder:text-[#FFFCF8]/25 focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                      />
                    </>
                  );
                })()}
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-[#EB317A] hover:bg-[#F04B8E] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#EB317A]/20 mt-1">
              <LogIn className="h-4 w-4" /> {t('auth.sign-in-btn')}
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* Step indicator */}
          <div className="w-full max-w-lg mb-4 z-10">
            <div className="flex items-center justify-between">
              {STEP_LABEL_KEYS.map((key, idx) => {
                const s = idx + 1;
                const isActive = s === step;
                const isDone = s < step;
                return (
                  <React.Fragment key={s}>
                    <div className="flex flex-col items-center min-w-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 border-2 shrink-0 ${
                        isDone   ? 'bg-[#C9A84C] border-[#C9A84C] text-[#1A1118]' :
                        isActive ? 'bg-[#EB317A] border-[#EB317A] text-white shadow-lg shadow-[#EB317A]/40' :
                                   'bg-[#1A1118] border-[#C9A84C]/20 text-[#FFFCF8]/40'
                      }`}>
                        {isDone ? <Check className="h-3 w-3" /> : s}
                      </div>
                      <span className={`text-[7px] font-bold mt-1 tracking-wider text-center leading-tight ${isActive ? 'text-[#C9A84C]' : 'text-[#FFFCF8]/30'}`}>
                        {t(key).toUpperCase()}
                      </span>
                    </div>
                    {idx < STEP_LABEL_KEYS.length - 1 && (
                      <div className={`h-px flex-1 mx-1.5 mt-0 transition-all duration-500 ${isDone ? 'bg-[#C9A84C]' : 'bg-[#FFFCF8]/10'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="w-full max-w-lg bg-[#1A1118]/80 backdrop-blur-xl border border-[#C9A84C]/10 rounded-2xl p-5 shadow-2xl z-10">

            {/* ── STEP 1: Intent ── */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-black text-[#FFFCF8] mb-0.5">{t('onboarding.step1-title')}</h2>
                <p className="text-xs text-[#EDE6D9]/50 mb-4">{t('onboarding.step1-desc')}</p>
                <div className="flex flex-col gap-2.5">
                  {INTENT_OPTIONS.map(opt => {
                    const active = selectedIntent === opt.value;
                    return (
                      <button
                        key={opt.value}
                        id={`intent-${opt.value.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setSelectedIntent(opt.value)}
                        className={`group relative flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left cursor-pointer transition-all duration-250 ${
                          active
                            ? 'border-[#C9A84C] bg-[#C9A84C]/10 shadow-lg shadow-[#C9A84C]/10'
                            : 'border-[#FFFCF8]/8 bg-[#FFFCF8]/3 hover:border-[#C9A84C]/40'
                        }`}
                      >
                        {active && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#C9A84C] flex items-center justify-center">
                            <Check className="h-2.5 w-2.5 text-[#1A1118]" />
                          </div>
                        )}
                        <span className="text-2xl shrink-0">{opt.emoji}</span>
                        <div className="min-w-0">
                          <div className={`text-sm font-bold truncate ${active ? 'text-[#C9A84C]' : 'text-[#FFFCF8]'}`}>{opt.value}</div>
                          <div className="text-[10px] text-[#FFFCF8]/40 leading-tight">{t(opt.desc)}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button
                  id="intent-next-btn"
                  disabled={!selectedIntent}
                  onClick={() => setStep(2)}
                  className="mt-5 w-full py-3 bg-[#EB317A] hover:bg-[#F04B8E] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#EB317A]/20"
                >
                  {t('onboarding.continue')} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* ── STEP 2: I am (Gender) ── */}
            {step === 2 && (
              <div>
                <button onClick={() => setStep(1)} className="flex items-center gap-1 text-[#FFFCF8]/40 hover:text-[#C9A84C] text-xs font-bold mb-4 cursor-pointer transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" /> {t('onboarding.back')}
                </button>
                <h2 className="text-xl font-black text-[#FFFCF8] mb-0.5">{t('onboarding.step-gender-title')}</h2>
                <p className="text-xs text-[#EDE6D9]/50 mb-5">{t('onboarding.step-gender-desc')}</p>

                <div className="flex gap-3">
                  {(['Male', 'Female'] as Gender[]).map(g => {
                    const active = form.gender === g;
                    const label = g === 'Male' ? t('auth.man') : t('auth.woman');
                    return (
                      <button
                        key={g}
                        id={`gender-step-${g.toLowerCase()}`}
                        onClick={() => {
                          setField('gender', g);
                          setSelectedLookingFor(g === 'Male' ? 'Female' : 'Male');
                        }}
                        className={`flex-1 flex flex-col items-center justify-center gap-2 py-8 rounded-2xl border-2 cursor-pointer transition-all duration-250 ${
                          active
                            ? 'border-[#C9A84C] bg-[#C9A84C]/10 shadow-xl shadow-[#C9A84C]/10'
                            : 'border-[#FFFCF8]/8 bg-[#FFFCF8]/3 hover:border-[#C9A84C]/40'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${active ? 'bg-[#C9A84C]/20' : 'bg-[#FFFCF8]/5'}`}>
                          <User className={`h-6 w-6 ${active ? 'text-[#C9A84C]' : 'text-[#FFFCF8]/50'}`} />
                        </div>
                        <span className={`text-base font-black ${active ? 'text-[#C9A84C]' : 'text-[#FFFCF8]'}`}>{label}</span>
                        {active && <Check className="h-4 w-4 text-[#C9A84C]" />}
                      </button>
                    );
                  })}
                </div>

                <button
                  id="gender-next-btn"
                  onClick={() => setStep(3)}
                  className="mt-5 w-full py-3 bg-[#EB317A] hover:bg-[#F04B8E] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#EB317A]/20"
                >
                  {t('onboarding.continue')} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* ── STEP 3: Looking For ── */}
            {step === 3 && (
              <div>
                <button onClick={() => setStep(2)} className="flex items-center gap-1 text-[#FFFCF8]/40 hover:text-[#C9A84C] text-xs font-bold mb-4 cursor-pointer transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" /> {t('onboarding.back')}
                </button>
                <h2 className="text-xl font-black text-[#FFFCF8] mb-0.5">{t('onboarding.step2-title')}</h2>
                <p className="text-xs text-[#EDE6D9]/50 mb-5">{t('onboarding.step2-desc')}</p>

                <div className="flex gap-3">
                  {(['Men', 'Women'] as const).map(label => {
                    const val: Gender = label === 'Men' ? 'Male' : 'Female';
                    const labelT = label === 'Men' ? t('auth.men') : t('auth.women');
                    const active = selectedLookingFor === val;
                    return (
                      <button
                        key={label}
                        id={`looking-for-${label.toLowerCase()}`}
                        onClick={() => setSelectedLookingFor(val)}
                        className={`flex-1 flex flex-col items-center justify-center gap-2 py-8 rounded-2xl border-2 cursor-pointer transition-all duration-250 ${
                          active
                            ? 'border-[#C9A84C] bg-[#C9A84C]/10 shadow-xl shadow-[#C9A84C]/10'
                            : 'border-[#FFFCF8]/8 bg-[#FFFCF8]/3 hover:border-[#C9A84C]/40'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${active ? 'bg-[#C9A84C]/20' : 'bg-[#FFFCF8]/5'}`}>
                          <Users className={`h-6 w-6 ${active ? 'text-[#C9A84C]' : 'text-[#FFFCF8]/50'}`} />
                        </div>
                        <span className={`text-base font-black ${active ? 'text-[#C9A84C]' : 'text-[#FFFCF8]'}`}>{labelT}</span>
                        {active && <Check className="h-4 w-4 text-[#C9A84C]" />}
                      </button>
                    );
                  })}
                </div>

                <button
                  id="looking-for-next-btn"
                  disabled={!selectedLookingFor}
                  onClick={() => setStep(4)}
                  className="mt-5 w-full py-3 bg-[#EB317A] hover:bg-[#F04B8E] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#EB317A]/20"
                >
                  {t('onboarding.continue')} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* ── STEP 4: Registration Form ── */}
            {step === 4 && (
              <div>
                <button onClick={() => setStep(3)} className="flex items-center gap-1 text-[#FFFCF8]/40 hover:text-[#C9A84C] text-xs font-bold mb-4 cursor-pointer transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" /> {t('onboarding.back')}
                </button>
                <h2 className="text-xl font-black text-[#FFFCF8] mb-0.5">{t('onboarding.step3-title')}</h2>
                <p className="text-xs text-[#EDE6D9]/50 mb-4">{t('onboarding.step3-desc')}</p>

                {toastError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-400/30 animate-fade-in">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 text-[10px] font-bold leading-relaxed">{toastError}</span>
                      <button onClick={() => setToastError(null)} className="ml-auto shrink-0 text-red-400/60 hover:text-red-400 cursor-pointer">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">

                   {/* Gender (read-only, chosen in step 2) */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#C9A84C]/8 border border-[#C9A84C]/20 rounded-xl">
                    <User className="h-4 w-4 text-[#C9A84C] shrink-0" />
                    <span className="text-[11px] font-bold text-[#C9A84C]">
                      {form.gender === 'Male' ? t('auth.man') : t('auth.woman')}
                    </span>
                    <span className="text-[8px] text-[#FFFCF8]/30 ml-auto">{t('onboarding.back')} to change</span>
                  </div>

                   {/* Profile Photo */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#FFFCF8]/50 uppercase tracking-wider mb-1.5">{t('onboarding.photo-label')}</label>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#C9A84C]/30 bg-[#FFFCF8]/5 shrink-0">
                        {form.image
                          ? <img src={form.image} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-[#FFFCF8]/20"><Camera className="h-5 w-5" /></div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-[#FFFCF8]/40 mb-1 truncate">{t('onboarding.photo-desc')}</p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-[#FFFCF8]/5 border border-[#FFFCF8]/10 rounded-xl text-[10px] font-bold text-[#FFFCF8] hover:border-[#C9A84C]/60 hover:text-[#C9A84C] transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Camera className="h-3.5 w-3.5" />
                          {t('auth.upload-photo')}
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#FFFCF8]/50 uppercase tracking-wider mb-1">{t('onboarding.name-label')}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-[#FFFCF8]/30" />
                      <input
                        id="reg-name" type="text" value={form.name}
                        onChange={e => setField('name', e.target.value)}
                        placeholder="Your full name"
                        className={`w-full pl-9 pr-3.5 py-2.5 bg-[#FFFCF8]/5 border ${regErrors.name ? 'border-red-500' : 'border-[#FFFCF8]/10'} rounded-xl text-sm text-[#FFFCF8] placeholder:text-[#FFFCF8]/25 focus:outline-none focus:border-[#C9A84C]/60 transition-colors`}
                      />
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#FFFCF8]/50 uppercase tracking-wider mb-1">{t('onboarding.age-label')}</label>
                    <input
                      id="reg-age" type="number" value={form.age} min={18} max={60}
                      onChange={e => setField('age', e.target.value)}
                      placeholder="Your age (18–60)"
                      className={`w-full px-3.5 py-2.5 bg-[#FFFCF8]/5 border ${regErrors.age ? 'border-red-500' : 'border-[#FFFCF8]/10'} rounded-xl text-sm text-[#FFFCF8] placeholder:text-[#FFFCF8]/25 focus:outline-none focus:border-[#C9A84C]/60 transition-colors`}
                    />
                  </div>

                  {/* Contact info hint */}
                  <p className="text-[10px] text-[#FFFCF8]/40 -mt-1">{t('auth.required-one-contact')}</p>

                  {/* Phone */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#FFFCF8]/50 uppercase tracking-wider mb-1">{t('auth.phone-label')}</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-[#FFFCF8]/30" />
                      <input
                        id="reg-phone" type="tel" value={form.phone}
                        onChange={e => setField('phone', e.target.value)}
                        placeholder="+251 9XX XXX XXX"
                        className={`w-full pl-9 pr-3.5 py-2.5 bg-[#FFFCF8]/5 border ${regErrors.phone ? 'border-red-500' : 'border-[#FFFCF8]/10'} rounded-xl text-sm text-[#FFFCF8] placeholder:text-[#FFFCF8]/25 focus:outline-none focus:border-[#C9A84C]/60 transition-colors`}
                      />
                    </div>
                  </div>

                  {/* Telegram */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#FFFCF8]/50 uppercase tracking-wider mb-1">{t('auth.telegram-label')}</label>
                    <div className="relative">
                      <TelegramIcon className="absolute left-3 top-2.5 h-4 w-4 text-[#FFFCF8]/30" />
                      <input
                        id="reg-telegram" type="text" value={form.telegram}
                        onChange={e => setField('telegram', e.target.value)}
                        placeholder="@yourusername"
                        className={`w-full pl-9 pr-3.5 py-2.5 bg-[#FFFCF8]/5 border ${regErrors.telegram ? 'border-red-500' : 'border-[#FFFCF8]/10'} rounded-xl text-sm text-[#FFFCF8] placeholder:text-[#FFFCF8]/25 focus:outline-none focus:border-[#C9A84C]/60 transition-colors`}
                      />
                    </div>
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#FFFCF8]/50 uppercase tracking-wider mb-1">
                      {t('auth.instagram-label')} <span className="text-[#FFFCF8]/25 normal-case">{t('onboarding.optional')}</span>
                    </label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-2.5 h-4 w-4 text-[#FFFCF8]/30" />
                      <input
                        id="reg-instagram" type="text" value={form.instagram}
                        onChange={e => setField('instagram', e.target.value)}
                        placeholder="@instahandle"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-[#FFFCF8]/5 border border-[#FFFCF8]/10 rounded-xl text-sm text-[#FFFCF8] placeholder:text-[#FFFCF8]/25 focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#FFFCF8]/50 uppercase tracking-wider mb-1">{t('onboarding.city-label')}</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#FFFCF8]/30 z-10" />
                      <SelectDropdown
                        value={form.city}
                        onChange={(v) => { setField('city', v); setField('address', DEFAULT_AREA[v] || ''); }}
                        options={CITIES}
                        placeholder={t('onboarding.select-city')}
                        error={!!regErrors.city}
                      />
                    </div>
                  </div>

                  {/* Area */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#FFFCF8]/50 uppercase tracking-wider mb-1">{t('onboarding.area-label')}</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#FFFCF8]/30 z-10" />
                      {AREAS[form.city] ? (
                        <SelectDropdown
                          value={form.address}
                          onChange={(v) => setField('address', v)}
                          options={AREAS[form.city]}
                          placeholder={t('onboarding.select-area')}
                          error={!!regErrors.address}
                        />
                      ) : (
                        <input
                          id="reg-address" type="text" value={form.address}
                          onChange={e => setField('address', e.target.value)}
                          placeholder="e.g. Bole, Piassa..."
                          className={`w-full pl-9 pr-3.5 py-2.5 bg-[#FFFCF8]/5 border ${regErrors.address ? 'border-red-500' : 'border-[#FFFCF8]/10'} rounded-xl text-sm text-[#FFFCF8] placeholder:text-[#FFFCF8]/25 focus:outline-none focus:border-[#C9A84C]/60 transition-colors`}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Summary chips */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#FFFCF8]/5">
                  {selectedIntent && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C9A84C]/15 text-[#C9A84C] text-[10px] font-bold border border-[#C9A84C]/30">{selectedIntent}</span>
                  )}
                  {selectedLookingFor && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EB317A]/15 text-[#EB317A] text-[10px] font-bold border border-[#EB317A]/30">
                      {t('onboarding.looking-for-chip').replace('{gender}', selectedLookingFor === 'Male' ? t('auth.men') : t('auth.women'))}
                    </span>
                  )}
                </div>

                <button
                  id="register-submit-btn"
                  onClick={handleRegSubmit}
                  className="mt-4 w-full py-3 bg-[#EB317A] hover:bg-[#F04B8E] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#EB317A]/20"
                >
                  <Check className="h-4 w-4" /> {t('onboarding.create-browse')}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
