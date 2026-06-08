import React, { useState, useRef } from 'react';
import { Heart, Users, ArrowRight, ArrowLeft, User, Phone, MessageCircle, Instagram, MapPin, Camera, Check, LogIn, UserPlus } from 'lucide-react';
import { Profile } from '../types';

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
  'Dessie': ['Center', 'Woldia Road'],
  'Harar': ['Harar Jugol', 'New Town'],
};

const PRESET_MALE_IMAGES = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
];

const PRESET_FEMALE_IMAGES = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&auto=format&fit=crop&q=80',
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

interface OnboardingFlowProps {
  onComplete: (profile: Profile) => void;
  onSignIn: (name: string, phone: string) => void;
}

const INTENT_OPTIONS: { value: Intent; emoji: string; desc: string }[] = [
  { value: 'True Relationship', emoji: '❤️', desc: 'Serious commitment & long-term love' },
  { value: 'Friendship',        emoji: '🤝', desc: 'Genuine connections & social bonds'  },
  { value: 'Friends with Benefits', emoji: '💕', desc: 'Casual & fun without the label'  },
  { value: 'Only Sex',          emoji: '🔥', desc: 'No strings — adults only'            },
];

const STEP_LABELS = ['What you want', 'Looking for', 'Your Profile'];

export default function OnboardingFlow({ onComplete, onSignIn }: OnboardingFlowProps) {
  // 'register' | 'signin'
  const [mode, setMode] = useState<'register' | 'signin'>('register');

  // Registration wizard
  const [step, setStep] = useState(1);
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const [selectedLookingFor, setSelectedLookingFor] = useState<Gender | null>(null);
  const [form, setForm] = useState<RegFormData>({
    name: '', age: '', phone: '', telegram: '', instagram: '',
    city: 'Addis Ababa', address: '', image: '', gender: 'Male',
  });
  const [regErrors, setRegErrors] = useState<Partial<RegFormData>>({});

  // Sign-in form
  const [siName, setSiName] = useState('');
  const [siPhone, setSiPhone] = useState('');
  const [siErrors, setSiErrors] = useState<{ name?: string; phone?: string }>({});
  const [siError, setSiError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── helpers ── */
  const setField = (field: keyof RegFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setRegErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateReg = (): boolean => {
    const e: Partial<RegFormData> = {};
    if (!form.name.trim())                                       e.name    = 'Full name is required';
    if (!form.age || Number(form.age) < 18 || Number(form.age) > 60) e.age = 'Age must be 18–60';
    if (!form.phone.trim())                                      e.phone   = 'Phone number is required';
    if (!form.telegram.trim())                                   e.telegram = 'Telegram username is required';
    if (!form.city)                                              e.city    = 'City is required';
    if (!form.address.trim())                                    e.address = 'Area / Location is required';
    setRegErrors(e);
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
    const presets = form.gender === 'Male' ? PRESET_MALE_IMAGES : PRESET_FEMALE_IMAGES;
    const finalImage = form.image || presets[0];
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

  const handleSignIn = () => {
    const e: { name?: string; phone?: string } = {};
    if (!siName.trim())  e.name  = 'Name is required';
    if (!siPhone.trim()) e.phone = 'Phone number is required';
    setSiErrors(e);
    if (Object.keys(e).length > 0) return;
    setSiError('');
    onSignIn(siName.trim(), siPhone.trim());
  };

  const presets = form.gender === 'Male' ? PRESET_MALE_IMAGES : PRESET_FEMALE_IMAGES;

  /* ────────────────────────────── RENDER ────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#120A0E] via-[#1A1118] to-[#0D0610] flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Blobs */}
      <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-[#8B0020]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[35vw] h-[35vw] bg-[#C9A84C]/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Logo */}
      <div className="flex items-center gap-2 mb-6 z-10">
        <div className="bg-[#8B0020] p-2 rounded-xl shadow-lg shadow-[#8B0020]/30">
          <Heart className="h-6 w-6 text-[#C9A84C] fill-[#C9A84C]" />
        </div>
        <span className="text-2xl font-black text-[#FFFCF8] tracking-tight">Whaatachi</span>
      </div>

      {/* Mode toggle tabs */}
      <div className="flex rounded-2xl border border-[#FFFCF8]/8 bg-[#FFFCF8]/3 p-1 mb-6 z-10">
        <button
          id="tab-register"
          onClick={() => { setMode('register'); setSiError(''); }}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mode === 'register'
              ? 'bg-[#8B0020] text-white shadow-md shadow-[#8B0020]/30'
              : 'text-[#FFFCF8]/40 hover:text-[#FFFCF8]/70'
          }`}
        >
          <UserPlus className="h-3.5 w-3.5" /> Create Profile
        </button>
        <button
          id="tab-signin"
          onClick={() => { setMode('signin'); }}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mode === 'signin'
              ? 'bg-[#8B0020] text-white shadow-md shadow-[#8B0020]/30'
              : 'text-[#FFFCF8]/40 hover:text-[#FFFCF8]/70'
          }`}
        >
          <LogIn className="h-3.5 w-3.5" /> Sign In
        </button>
      </div>

      {/* ══════════ SIGN IN PANEL ══════════ */}
      {mode === 'signin' && (
        <div className="w-full max-w-sm bg-[#1A1118]/80 backdrop-blur-xl border border-[#C9A84C]/10 rounded-3xl p-8 shadow-2xl z-10">
          <h2 className="text-2xl font-black text-[#FFFCF8] mb-1">Welcome Back</h2>
          <p className="text-sm text-[#EDE6D9]/50 mb-7">Enter your registered name &amp; phone to continue</p>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[10px] font-bold text-[#FFFCF8]/50 uppercase tracking-wider mb-1.5">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-[#FFFCF8]/30" />
                <input
                  id="signin-name"
                  type="text"
                  value={siName}
                  onChange={e => { setSiName(e.target.value); setSiErrors(p => ({ ...p, name: undefined })); setSiError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                  placeholder="Your registered full name"
                  className={`w-full pl-10 pr-4 py-3 bg-[#FFFCF8]/5 border ${
                    siErrors.name ? 'border-red-500' : 'border-[#FFFCF8]/10'
                  } rounded-xl text-sm text-[#FFFCF8] placeholder:text-[#FFFCF8]/25 focus:outline-none focus:border-[#C9A84C]/60 transition-colors`}
                />
              </div>
              {siErrors.name && <p className="text-red-400 text-[10px] mt-1">{siErrors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[10px] font-bold text-[#FFFCF8]/50 uppercase tracking-wider mb-1.5">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-[#FFFCF8]/30" />
                <input
                  id="signin-phone"
                  type="tel"
                  value={siPhone}
                  onChange={e => { setSiPhone(e.target.value); setSiErrors(p => ({ ...p, phone: undefined })); setSiError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                  placeholder="+251 9XX XXX XXX"
                  className={`w-full pl-10 pr-4 py-3 bg-[#FFFCF8]/5 border ${
                    siErrors.phone ? 'border-red-500' : 'border-[#FFFCF8]/10'
                  } rounded-xl text-sm text-[#FFFCF8] placeholder:text-[#FFFCF8]/25 focus:outline-none focus:border-[#C9A84C]/60 transition-colors`}
                />
              </div>
              {siErrors.phone && <p className="text-red-400 text-[10px] mt-1">{siErrors.phone}</p>}
            </div>

            {/* Server-level error */}
            {siError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-xs font-medium">
                {siError}
              </div>
            )}

            <button
              id="signin-submit-btn"
              onClick={handleSignIn}
              className="w-full py-3.5 bg-[#8B0020] hover:bg-[#B31B3A] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#8B0020]/20 mt-2"
            >
              <LogIn className="h-4 w-4" /> Sign In
            </button>
          </div>

          <p className="mt-6 text-center text-[#FFFCF8]/30 text-xs">
            No account yet?{' '}
            <button onClick={() => setMode('register')} className="text-[#C9A84C] font-bold hover:underline cursor-pointer">
              Create a profile
            </button>
          </p>
        </div>
      )}

      {/* ══════════ REGISTRATION WIZARD ══════════ */}
      {mode === 'register' && (
        <>
          {/* Step indicator */}
          <div className="flex items-center gap-0 mb-6 z-10">
            {STEP_LABELS.map((label, idx) => {
              const s = idx + 1;
              const isActive = s === step;
              const isDone = s < step;
              return (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 border-2 ${
                      isDone   ? 'bg-[#C9A84C] border-[#C9A84C] text-[#1A1118]' :
                      isActive ? 'bg-[#8B0020] border-[#8B0020] text-white shadow-lg shadow-[#8B0020]/40' :
                                 'bg-[#1A1118] border-[#C9A84C]/20 text-[#FFFCF8]/40'
                    }`}>
                      {isDone ? <Check className="h-4 w-4" /> : s}
                    </div>
                    <span className={`text-[9px] font-bold mt-1 tracking-wider hidden sm:block ${isActive ? 'text-[#C9A84C]' : 'text-[#FFFCF8]/30'}`}>
                      {label.toUpperCase()}
                    </span>
                  </div>
                  {idx < STEP_LABELS.length - 1 && (
                    <div className={`h-0.5 w-10 sm:w-14 mt-0 sm:-mt-4 transition-all duration-500 mx-1 ${isDone ? 'bg-[#C9A84C]' : 'bg-[#FFFCF8]/10'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="w-full max-w-lg bg-[#1A1118]/80 backdrop-blur-xl border border-[#C9A84C]/10 rounded-3xl p-7 sm:p-10 shadow-2xl z-10">

            {/* ── STEP 1: Intent ── */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-black text-[#FFFCF8] mb-1">Looking For</h2>
                <p className="text-sm text-[#EDE6D9]/50 mb-6">What kind of connection are you seeking?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {INTENT_OPTIONS.map(opt => {
                    const active = selectedIntent === opt.value;
                    return (
                      <button
                        key={opt.value}
                        id={`intent-${opt.value.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setSelectedIntent(opt.value)}
                        className={`group relative flex flex-col items-start gap-1 p-4 rounded-2xl border-2 text-left cursor-pointer transition-all duration-250 hover:-translate-y-0.5 hover:shadow-xl ${
                          active
                            ? 'border-[#C9A84C] bg-[#C9A84C]/10 shadow-lg shadow-[#C9A84C]/10'
                            : 'border-[#FFFCF8]/8 bg-[#FFFCF8]/3 hover:border-[#C9A84C]/40'
                        }`}
                      >
                        {active && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#C9A84C] flex items-center justify-center">
                            <Check className="h-3 w-3 text-[#1A1118]" />
                          </div>
                        )}
                        <span className="text-3xl">{opt.emoji}</span>
                        <span className={`text-sm font-bold ${active ? 'text-[#C9A84C]' : 'text-[#FFFCF8]'}`}>{opt.value}</span>
                        <span className="text-[11px] text-[#FFFCF8]/40 leading-tight">{opt.desc}</span>
                      </button>
                    );
                  })}
                </div>
                <button
                  id="intent-next-btn"
                  disabled={!selectedIntent}
                  onClick={() => setStep(2)}
                  className="mt-6 w-full py-3.5 bg-[#8B0020] hover:bg-[#B31B3A] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#8B0020]/20"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* ── STEP 2: Looking For (Gender) ── */}
            {step === 2 && (
              <div>
                <button onClick={() => setStep(1)} className="flex items-center gap-1 text-[#FFFCF8]/40 hover:text-[#C9A84C] text-xs font-bold mb-5 cursor-pointer transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <h2 className="text-2xl font-black text-[#FFFCF8] mb-1">I'm Looking For</h2>
                <p className="text-sm text-[#EDE6D9]/50 mb-8">Who would you like to connect with?</p>

                <div className="grid grid-cols-2 gap-4">
                  {(['Men', 'Women'] as const).map(label => {
                    const val: Gender = label === 'Men' ? 'Male' : 'Female';
                    const active = selectedLookingFor === val;
                    return (
                      <button
                        key={label}
                        id={`looking-for-${label.toLowerCase()}`}
                        onClick={() => setSelectedLookingFor(val)}
                        className={`flex flex-col items-center justify-center gap-3 py-10 rounded-2xl border-2 cursor-pointer transition-all duration-250 hover:-translate-y-1 hover:shadow-2xl ${
                          active
                            ? 'border-[#C9A84C] bg-[#C9A84C]/10 shadow-xl shadow-[#C9A84C]/10'
                            : 'border-[#FFFCF8]/8 bg-[#FFFCF8]/3 hover:border-[#C9A84C]/40'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${active ? 'bg-[#C9A84C]/20' : 'bg-[#FFFCF8]/5'}`}>
                          <Users className={`h-7 w-7 ${active ? 'text-[#C9A84C]' : 'text-[#FFFCF8]/50'}`} />
                        </div>
                        <span className={`text-lg font-black ${active ? 'text-[#C9A84C]' : 'text-[#FFFCF8]'}`}>{label}</span>
                        {active && <Check className="h-5 w-5 text-[#C9A84C]" />}
                      </button>
                    );
                  })}
                </div>

                <button
                  id="looking-for-next-btn"
                  disabled={!selectedLookingFor}
                  onClick={() => setStep(3)}
                  className="mt-6 w-full py-3.5 bg-[#8B0020] hover:bg-[#B31B3A] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#8B0020]/20"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* ── STEP 3: Registration Form ── */}
            {step === 3 && (
              <div>
                <button onClick={() => setStep(2)} className="flex items-center gap-1 text-[#FFFCF8]/40 hover:text-[#C9A84C] text-xs font-bold mb-5 cursor-pointer transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <h2 className="text-2xl font-black text-[#FFFCF8] mb-1">Create Your Profile</h2>
                <p className="text-sm text-[#EDE6D9]/50 mb-5">Fill in your details to join</p>

                <div className="space-y-4 max-h-[52vh] overflow-y-auto pr-1">

                  {/* Gender toggle */}
                  <div className="flex gap-2">
                    {(['Male', 'Female'] as Gender[]).map(g => (
                      <button
                        key={g}
                        id={`gender-${g.toLowerCase()}`}
                        type="button"
                        onClick={() => { setField('gender', g); setField('image', ''); }}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                          form.gender === g
                            ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]'
                            : 'border-[#FFFCF8]/10 text-[#FFFCF8]/50 hover:border-[#FFFCF8]/20'
                        }`}
                      >
                        {g === 'Male' ? '♂ Male' : '♀ Female'}
                      </button>
                    ))}
                  </div>

                  {/* Profile Photo */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#FFFCF8]/50 uppercase tracking-wider mb-2">Profile Photo</label>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#C9A84C]/30 bg-[#FFFCF8]/5 shrink-0">
                        {form.image
                          ? <img src={form.image} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-[#FFFCF8]/20"><Camera className="h-6 w-6" /></div>
                        }
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] text-[#FFFCF8]/40 mb-1.5">Choose a preset or upload your own</p>
                        <div className="flex gap-1.5 flex-wrap">
                          {presets.map((url, i) => (
                            <button
                              key={i} type="button" onClick={() => setField('image', url)}
                              className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${form.image === url ? 'border-[#C9A84C] scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                              <img src={url} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                          <button
                            type="button" onClick={() => fileInputRef.current?.click()}
                            className="w-9 h-9 rounded-lg border-2 border-dashed border-[#FFFCF8]/20 flex items-center justify-center text-[#FFFCF8]/30 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all cursor-pointer"
                          >
                            <Camera className="h-4 w-4" />
                          </button>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#FFFCF8]/50 uppercase tracking-wider mb-1.5">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-4 w-4 text-[#FFFCF8]/30" />
                      <input
                        id="reg-name" type="text" value={form.name}
                        onChange={e => setField('name', e.target.value)}
                        placeholder="Your full name"
                        className={`w-full pl-10 pr-4 py-3 bg-[#FFFCF8]/5 border ${regErrors.name ? 'border-red-500' : 'border-[#FFFCF8]/10'} rounded-xl text-sm text-[#FFFCF8] placeholder:text-[#FFFCF8]/25 focus:outline-none focus:border-[#C9A84C]/60 transition-colors`}
                      />
                    </div>
                    {regErrors.name && <p className="text-red-400 text-[10px] mt-1">{regErrors.name}</p>}
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#FFFCF8]/50 uppercase tracking-wider mb-1.5">Age *</label>
                    <input
                      id="reg-age" type="number" value={form.age} min={18} max={60}
                      onChange={e => setField('age', e.target.value)}
                      placeholder="Your age (18–60)"
                      className={`w-full px-4 py-3 bg-[#FFFCF8]/5 border ${regErrors.age ? 'border-red-500' : 'border-[#FFFCF8]/10'} rounded-xl text-sm text-[#FFFCF8] placeholder:text-[#FFFCF8]/25 focus:outline-none focus:border-[#C9A84C]/60 transition-colors`}
                    />
                    {regErrors.age && <p className="text-red-400 text-[10px] mt-1">{regErrors.age}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#FFFCF8]/50 uppercase tracking-wider mb-1.5">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-[#FFFCF8]/30" />
                      <input
                        id="reg-phone" type="tel" value={form.phone}
                        onChange={e => setField('phone', e.target.value)}
                        placeholder="+251 9XX XXX XXX"
                        className={`w-full pl-10 pr-4 py-3 bg-[#FFFCF8]/5 border ${regErrors.phone ? 'border-red-500' : 'border-[#FFFCF8]/10'} rounded-xl text-sm text-[#FFFCF8] placeholder:text-[#FFFCF8]/25 focus:outline-none focus:border-[#C9A84C]/60 transition-colors`}
                      />
                    </div>
                    {regErrors.phone && <p className="text-red-400 text-[10px] mt-1">{regErrors.phone}</p>}
                  </div>

                  {/* Telegram */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#FFFCF8]/50 uppercase tracking-wider mb-1.5">Telegram Username *</label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3.5 top-3.5 h-4 w-4 text-[#FFFCF8]/30" />
                      <input
                        id="reg-telegram" type="text" value={form.telegram}
                        onChange={e => setField('telegram', e.target.value)}
                        placeholder="@yourusername"
                        className={`w-full pl-10 pr-4 py-3 bg-[#FFFCF8]/5 border ${regErrors.telegram ? 'border-red-500' : 'border-[#FFFCF8]/10'} rounded-xl text-sm text-[#FFFCF8] placeholder:text-[#FFFCF8]/25 focus:outline-none focus:border-[#C9A84C]/60 transition-colors`}
                      />
                    </div>
                    {regErrors.telegram && <p className="text-red-400 text-[10px] mt-1">{regErrors.telegram}</p>}
                  </div>

                  {/* Instagram (optional) */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#FFFCF8]/50 uppercase tracking-wider mb-1.5">
                      Instagram Username <span className="text-[#FFFCF8]/25 normal-case">(optional)</span>
                    </label>
                    <div className="relative">
                      <Instagram className="absolute left-3.5 top-3.5 h-4 w-4 text-[#FFFCF8]/30" />
                      <input
                        id="reg-instagram" type="text" value={form.instagram}
                        onChange={e => setField('instagram', e.target.value)}
                        placeholder="@instahandle"
                        className="w-full pl-10 pr-4 py-3 bg-[#FFFCF8]/5 border border-[#FFFCF8]/10 rounded-xl text-sm text-[#FFFCF8] placeholder:text-[#FFFCF8]/25 focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#FFFCF8]/50 uppercase tracking-wider mb-1.5">City *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-[#FFFCF8]/30" />
                      <select
                        id="reg-city" value={form.city}
                        onChange={e => { setField('city', e.target.value); setField('address', ''); }}
                        className={`w-full pl-10 pr-4 py-3 bg-[#FFFCF8]/5 border ${regErrors.city ? 'border-red-500' : 'border-[#FFFCF8]/10'} rounded-xl text-sm text-[#FFFCF8] appearance-none focus:outline-none focus:border-[#C9A84C]/60 transition-colors`}
                      >
                        {CITIES.map(c => <option key={c} value={c} className="bg-[#1A1118]">{c}</option>)}
                      </select>
                    </div>
                    {regErrors.city && <p className="text-red-400 text-[10px] mt-1">{regErrors.city}</p>}
                  </div>

                  {/* Area */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#FFFCF8]/50 uppercase tracking-wider mb-1.5">Area / Neighborhood *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-[#FFFCF8]/30" />
                      {AREAS[form.city] ? (
                        <select
                          id="reg-address" value={form.address}
                          onChange={e => setField('address', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 bg-[#FFFCF8]/5 border ${regErrors.address ? 'border-red-500' : 'border-[#FFFCF8]/10'} rounded-xl text-sm text-[#FFFCF8] appearance-none focus:outline-none focus:border-[#C9A84C]/60 transition-colors`}
                        >
                          <option value="" className="bg-[#1A1118]">Select area...</option>
                          {AREAS[form.city].map(a => <option key={a} value={a} className="bg-[#1A1118]">{a}</option>)}
                        </select>
                      ) : (
                        <input
                          id="reg-address" type="text" value={form.address}
                          onChange={e => setField('address', e.target.value)}
                          placeholder="e.g. Bole, Piassa..."
                          className={`w-full pl-10 pr-4 py-3 bg-[#FFFCF8]/5 border ${regErrors.address ? 'border-red-500' : 'border-[#FFFCF8]/10'} rounded-xl text-sm text-[#FFFCF8] placeholder:text-[#FFFCF8]/25 focus:outline-none focus:border-[#C9A84C]/60 transition-colors`}
                        />
                      )}
                    </div>
                    {regErrors.address && <p className="text-red-400 text-[10px] mt-1">{regErrors.address}</p>}
                  </div>
                </div>

                {/* Summary chips */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#FFFCF8]/5">
                  {selectedIntent && (
                    <span className="px-3 py-1 rounded-full bg-[#C9A84C]/15 text-[#C9A84C] text-[10px] font-bold border border-[#C9A84C]/30">{selectedIntent}</span>
                  )}
                  {selectedLookingFor && (
                    <span className="px-3 py-1 rounded-full bg-[#8B0020]/15 text-[#8B0020] text-[10px] font-bold border border-[#8B0020]/30">
                      Looking for {selectedLookingFor === 'Male' ? 'Men' : 'Women'}
                    </span>
                  )}
                </div>

                <button
                  id="register-submit-btn"
                  onClick={handleRegSubmit}
                  className="mt-5 w-full py-3.5 bg-[#8B0020] hover:bg-[#B31B3A] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#8B0020]/20"
                >
                  <Check className="h-4 w-4" /> Create Profile &amp; Browse
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
