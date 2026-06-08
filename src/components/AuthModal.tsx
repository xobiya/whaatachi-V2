import React, { useState, useRef, useEffect } from 'react';
import { X, Heart, ShieldCheck, Zap, Sparkles, CheckCircle, ArrowRight, UserPlus, Gift, AlertCircle, Upload, User, Phone, Instagram, Send, ArrowLeft, Check, Lock, Camera } from 'lucide-react';
import { Profile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'register' | 'signin';
  featuredProfiles: Profile[];
  onRegisterUser: (newProfile: Profile) => void;
  onSignInUser: (name: string, phone: string) => void;
  onSimulateTestLogin: (profile: Profile) => void;
}

const asset = (file: string) => `/assets/${file}`;

const PRESET_MALE_IMAGES = [
  asset('Gemini_Generated_Image_f05mrgf05mrgf05m.png'),
  asset('Gemini_Generated_Image_rj3k3urj3k3urj3k.png'),
  asset('photo_2026-06-08_16-58-42.jpg'),
];

const PRESET_FEMALE_IMAGES = [
  asset('Gemini_Generated_Image_48jenf48jenf48je.png'),
  asset('Gemini_Generated_Image_4zte6t4zte6t4zte.png'),
  asset('Gemini_Generated_Image_69df6669df6669df.png'),
];

export default function AuthModal({
  isOpen,
  onClose,
  initialTab = 'register',
  featuredProfiles,
  onRegisterUser,
  onSignInUser,
  onSimulateTestLogin
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'register' | 'signin'>(initialTab);

  const [fullName, setFullName] = useState<string>('');
  const [telegramUsername, setTelegramUsername] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [instagramUsername, setInstagramUsername] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [myGender, setMyGender] = useState<'Male' | 'Female'>('Male');
  const [selectedIntent, setSelectedIntent] = useState<string>('True Relationship');
  
  const [photoSource, setPhotoSource] = useState<'preset' | 'upload'>('preset');
  const [selectedPresetImage, setSelectedPresetImage] = useState<string>(PRESET_MALE_IMAGES[0]);
  const [localUploadedImage, setLocalUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [signInName, setSignInName] = useState<string>('');
  const [signInPhone, setSignInPhone] = useState<string>('');

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
    setValidationError(null);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleMyGenderChange = (gender: 'Male' | 'Female') => {
    setMyGender(gender);
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

  const handleCreateRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!fullName.trim()) {
      setValidationError('Please input your Full Name to continue.');
      return;
    }
    if (!phoneNumber.trim()) {
      setValidationError('Phone number is strictly required.');
      return;
    }

    const ageNum = age ? parseInt(age, 10) : 24;
    const finalImage = photoSource === 'preset' 
      ? selectedPresetImage 
      : (localUploadedImage || (myGender === 'Male' ? PRESET_MALE_IMAGES[0] : PRESET_FEMALE_IMAGES[0]));

    let finalIntent: 'True Relationship' | 'Friendship' | 'Friends with Benefits' = 'True Relationship';
    if (selectedIntent === 'Friends with Benefits') {
      finalIntent = 'Friends with Benefits';
    } else if (selectedIntent === 'Friendship') {
      finalIntent = 'Friendship';
    }

    const newProfile: Profile = {
      id: `custom-profile-${Date.now()}`,
      name: fullName.trim(),
      age: ageNum,
      city: 'Addis Ababa',
      bio: `Hi, I'm looking for an authentic connection on Whaatachi.`,
      gender: myGender,
      image: finalImage,
      status: 'Online',
      relationshipIntent: finalIntent,
      interests: ['Coffee & Chat', 'Dinner Out', 'Night Life', 'Ethio Arts'],
      verified: false,
      contactInfo: {
        phone: phoneNumber.trim(),
        telegram: telegramUsername.trim().replace('@', '') || fullName.toLowerCase().replace(/\s+/g, ''),
        email: `${fullName.toLowerCase().replace(/\s+/g, '')}@example.com`
      }
    };

    onRegisterUser(newProfile);
    onClose();
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!signInName.trim()) {
      setValidationError('Please enter your registered name.');
      return;
    }

    onSignInUser(signInName.trim(), signInPhone.trim());
    onClose();
  };

  const intentOptions = [
    { label: 'True Relationship', desc: 'Serious and long term commitment' },
    { label: 'Friendship', desc: 'Meet new people and explore' },
    { label: 'Friends with Benefits', desc: 'Mutually consensual casual dating' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" id="auth-modal-overlay">
      {/* Background backing */}
        <div 
          className="fixed inset-0 bg-[#1A1118]/80 backdrop-blur-xs transition-opacity duration-300"
          onClick={onClose}
        ></div>

      {/* Modal core wrapper */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="relative w-full max-w-lg bg-[#FFFCF8] border border-[#C9A84C]/20 rounded-3xl shadow-2xl overflow-hidden text-left transform transition-all duration-300 animate-scaleIn"
          id="auth-modal-content"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-[#8B0020] bg-[#F8F4ED] hover:bg-[#F0D4D4] transition-colors cursor-pointer z-10"
            aria-label="Close interactive auth module"
          >
            <X className="h-4.5 w-4.5" />
          </button>

          {/* Card Header & Tab switchers */}
          <div className="flex border-b border-[#EDE6D9] bg-[#F8F4ED]/50">
            <button onClick={() => { setActiveTab('register'); setValidationError(null); }} className={`flex-1 text-center py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${activeTab === 'register' ? 'border-[#8B0020] text-[#8B0020] bg-[#FFFCF8]' : 'border-transparent text-gray-400 hover:text-[#1A1118]'}`}>
              Create Profile
            </button>
            <button onClick={() => { setActiveTab('signin'); setValidationError(null); }} className={`flex-1 text-center py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${activeTab === 'signin' ? 'border-[#8B0020] text-[#8B0020] bg-[#FFFCF8]' : 'border-transparent text-gray-400 hover:text-[#1A1118]'}`}>
              Sign In
            </button>
          </div>

          {/* Validation Warnings */}
          {validationError && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-[#8B0020]/5 border border-[#8B0020]/20 text-[#8B0020] text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 text-[#8B0020]" />
              <span className="font-semibold">{validationError}</span>
            </div>
          )}

          <div className="p-6">
            {activeTab === 'register' ? (
              <form onSubmit={handleCreateRegisterSubmit} className="space-y-4">
                <div>
                  <h2 className="text-xl font-black text-[#1A1118]">Create Your Profile</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Join thousands finding real connections in Ethiopia</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1118]/70 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="E.g. Dawit Haile" className="w-full pl-9 pr-4 py-2.5 border border-[#EDE6D9] rounded-xl text-xs bg-white text-gray-800 focus:outline-hidden focus:border-[#8B0020] focus:ring-1 focus:ring-[#8B0020]/20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1A1118]/70 uppercase tracking-wider">Age</label>
                    <input type="number" min="18" max="60" value={age} onChange={(e) => setAge(e.target.value)} placeholder="24" className="w-full px-3 py-2.5 border border-[#EDE6D9] rounded-xl text-xs bg-white text-gray-800 focus:outline-hidden focus:border-[#8B0020] focus:ring-1 focus:ring-[#8B0020]/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1A1118]/70 uppercase tracking-wider">I am a</label>
                    <div className="grid grid-cols-2 bg-[#F8F4ED] border border-[#EDE6D9] rounded-xl p-1 gap-1">
                      {(['Male', 'Female'] as const).map((g) => (
                        <button key={g} type="button" onClick={() => handleMyGenderChange(g)} className={`py-1.5 text-[10px] font-bold text-center rounded-lg transition-all cursor-pointer ${myGender === g ? 'bg-[#8B0020] text-white' : 'text-gray-500 hover:text-[#1A1118]'}`}>{g === 'Male' ? 'Man' : 'Woman'}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1118]/70 uppercase tracking-wider">Looking For</label>
                  <div className="grid grid-cols-3 gap-2">
                    {intentOptions.map((opt) => (
                      <button key={opt.label} type="button" onClick={() => setSelectedIntent(opt.label)} className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${selectedIntent === opt.label ? 'bg-[#8B0020]/5 border-[#8B0020] text-[#8B0020] font-bold' : 'bg-white border-[#EDE6D9] hover:border-[#C9A84C]/50 text-gray-600'}`}>
                        <span className="text-[10px] font-semibold">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1118]/70 uppercase tracking-wider">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input type="tel" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="0911XXXXXX" className="w-full pl-9 pr-4 py-2.5 border border-[#EDE6D9] rounded-xl text-xs bg-white text-gray-800 focus:outline-hidden focus:border-[#8B0020] focus:ring-1 focus:ring-[#8B0020]/20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#1A1118]/70 uppercase tracking-wider">Profile Photo</label>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {(myGender === 'Male' ? PRESET_MALE_IMAGES : PRESET_FEMALE_IMAGES).slice(0, 3).map((url, idx) => (
                        <button key={idx} type="button" onClick={() => { setSelectedPresetImage(url); setPhotoSource('preset'); }} className={`w-12 h-12 rounded-full overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${photoSource === 'preset' && selectedPresetImage === url ? 'border-[#8B0020] scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400">or</span>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[10px] font-bold text-[#8B0020] hover:text-[#B31B3A] flex items-center gap-1 cursor-pointer">
                      <Camera className="h-3.5 w-3.5" /> Upload
                    </button>
                    <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
                  </div>
                </div>

                <button type="submit" className="w-full py-3.5 bg-[#8B0020] hover:bg-[#B31B3A] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#8B0020]/20 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer">
                  <UserPlus className="h-4 w-4" />
                  <span>Create Profile & Start Connecting</span>
                </button>
              </form>
            ) : (
              /* SIGN IN MODULE FLOW */
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-[#8B0020] uppercase tracking-widest">Welcome Back</span>
                  <h2 className="text-xl font-black text-[#1A1118] mt-1">Sign In</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Access your existing Whaatachi profile</p>
                </div>

                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      value={signInName}
                      onChange={(e) => setSignInName(e.target.value)}
                      placeholder="Enter your exact registered name"
                      className="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-750 rounded-xl text-xs bg-gray-50/50 dark:bg-slate-850 text-gray-800 dark:text-white focus:outline-hidden focus:border-pink-500"
                    />
                  </div>

                  {/* Phone Lookup Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Phone Number (Optional Lookup)</label>
                    <input
                      type="tel"
                      value={signInPhone}
                      onChange={(e) => setSignInPhone(e.target.value)}
                      placeholder="0911XXXXXX"
                      className="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-750 rounded-xl text-xs bg-gray-50/50 dark:bg-slate-850 text-gray-800 dark:text-white focus:outline-hidden focus:border-pink-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gray-950 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Retrieve Session Account</span>
                  </button>
                </form>

                {/* Instant test simulator account carousel */}
                <div className="border-t border-gray-150 dark:border-slate-800 pt-4 space-y-2.5">
                  <span className="block text-xs font-bold text-gray-700 dark:text-slate-350 uppercase tracking-wider">Simulate Login with Test Account:</span>
                  <p className="text-[10px] text-gray-500 dark:text-slate-400 font-light leading-snug">Click any profile beneath to instantly explore Whaatachi under their specific gender-intent perspective:</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {featuredProfiles.slice(0, 3).map((testProfile) => (
                      <button
                        key={testProfile.id}
                        onClick={() => {
                          onSimulateTestLogin(testProfile);
                          onClose();
                        }}
                        className="p-2 border border-gray-200 hover:border-pink-300 dark:border-slate-800 dark:hover:border-pink-900/50 rounded-xl bg-gray-50/20 dark:bg-slate-900/35 cursor-pointer text-left flex items-center gap-2 group transition-all shrink-0"
                      >
                        <img src={testProfile.image} alt={testProfile.name} className="w-8 h-8 rounded-full object-cover border group-hover:border-pink-500 transition-colors" referrerPolicy="no-referrer" />
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-bold text-gray-900 dark:text-white truncate">{testProfile.name.split(' ')[0]}</p>
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
