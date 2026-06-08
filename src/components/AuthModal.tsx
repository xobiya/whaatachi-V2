import React, { useState, useRef, useEffect } from 'react';
import { X, AlertCircle, User, Phone, Send, UserPlus, Camera, MapPin, MessageCircle, Instagram } from 'lucide-react';
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
  const [selectedIntent, setSelectedIntent] = useState('True Relationship');
  const [city, setCity] = useState('Addis Ababa');

  const [photoSource, setPhotoSource] = useState<'preset' | 'upload'>('preset');
  const [selectedPresetImage, setSelectedPresetImage] = useState(PRESET_MALE_IMAGES[0]);
  const [localUploadedImage, setLocalUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [signInName, setSignInName] = useState('');
  const [signInPhone, setSignInPhone] = useState('');

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
      setValidationError('Please enter your full name.');
      return;
    }
    if (!phoneNumber.trim()) {
      setValidationError('Phone number is required.');
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
      city: city,
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
        instagram: instagramUsername.trim().replace('@', '') || '',
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
    { label: 'True Relationship', desc: 'Serious & long term' },
    { label: 'Friendship', desc: 'Meet new people' },
    { label: 'Friends with Benefits', desc: 'Casual dating' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#1A1118]/80 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-[#FFFCF8] dark:bg-[#120A0E] border border-[#C9A84C]/20 rounded-3xl shadow-2xl overflow-hidden text-left transform transition-all duration-300 animate-scaleIn">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-[#8B0020] dark:hover:text-[#C9A84C] bg-[#F8F4ED] dark:bg-[#1A1118] hover:bg-[#F0D4D4] dark:hover:bg-[#8B0020]/20 transition-colors cursor-pointer z-10"
            aria-label="Close"
          >
            <X className="h-4.5 w-4.5" />
          </button>

          <div className="flex border-b border-[#EDE6D9] dark:border-[#C9A84C]/10 bg-[#F8F4ED]/50 dark:bg-[#1A1118]/50">
            <button
              onClick={() => { setActiveTab('register'); setValidationError(null); }}
              className={`flex-1 text-center py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                activeTab === 'register'
                  ? 'border-[#8B0020] dark:border-[#C9A84C] text-[#8B0020] dark:text-[#C9A84C] bg-[#FFFCF8] dark:bg-[#120A0E]'
                  : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-[#1A1118] dark:hover:text-[#FFFCF8]'
              }`}
            >
              Create Profile
            </button>
            <button
              onClick={() => { setActiveTab('signin'); setValidationError(null); }}
              className={`flex-1 text-center py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                activeTab === 'signin'
                  ? 'border-[#8B0020] dark:border-[#C9A84C] text-[#8B0020] dark:text-[#C9A84C] bg-[#FFFCF8] dark:bg-[#120A0E]'
                  : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-[#1A1118] dark:hover:text-[#FFFCF8]'
              }`}
            >
              Sign In
            </button>
          </div>

          {validationError && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-[#8B0020]/5 dark:bg-[#8B0020]/10 border border-[#8B0020]/20 dark:border-[#8B0020]/30 text-[#8B0020] dark:text-[#F0D4D4] text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 text-[#8B0020] dark:text-[#F0D4D4]" />
              <span className="font-semibold">{validationError}</span>
            </div>
          )}

          <div className="p-6">
            {activeTab === 'register' ? (
              <form onSubmit={handleCreateRegisterSubmit} className="space-y-4">
                <div>
                  <h2 className="text-xl font-black text-[#1A1118] dark:text-[#FFFCF8]">Create Your Profile</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Join thousands finding real connections in Ethiopia</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="E.g. Dawit Haile" className="w-full pl-9 pr-4 py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-sm bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:border-[#8B0020] dark:focus:border-[#C9A84C] focus:ring-1 focus:ring-[#8B0020]/20 dark:focus:ring-[#C9A84C]/20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">Age</label>
                    <input type="number" min="18" max="60" value={age} onChange={(e) => setAge(e.target.value)} placeholder="24" className="w-full px-4 py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-sm bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:border-[#8B0020] dark:focus:border-[#C9A84C] focus:ring-1 focus:ring-[#8B0020]/20 dark:focus:ring-[#C9A84C]/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">I am</label>
                    <div className="grid grid-cols-2 bg-[#F8F4ED] dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl p-1 gap-1">
                      {(['Male', 'Female'] as const).map((g) => (
                        <button key={g} type="button" onClick={() => handleMyGenderChange(g)} className={`py-2 text-xs font-bold text-center rounded-lg transition-all cursor-pointer ${myGender === g ? 'bg-[#8B0020] dark:bg-[#8B0020] text-white' : 'text-gray-500 dark:text-gray-400 hover:text-[#1A1118] dark:hover:text-[#FFFCF8]'}`}>
                          {g === 'Male' ? 'Man' : 'Woman'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">Looking For</label>
                  <div className="grid grid-cols-3 gap-2">
                    {intentOptions.map((opt) => (
                      <button key={opt.label} type="button" onClick={() => setSelectedIntent(opt.label)} className={`p-3 rounded-xl border text-center cursor-pointer transition-all text-xs ${
                        selectedIntent === opt.label
                          ? 'bg-[#8B0020]/5 dark:bg-[#8B0020]/15 border-[#8B0020] dark:border-[#C9A84C] text-[#8B0020] dark:text-[#C9A84C] font-bold'
                          : 'bg-white dark:bg-[#1A1118] border-[#EDE6D9] dark:border-[#C9A84C]/15 hover:border-[#C9A84C]/50 text-gray-600 dark:text-gray-400'
                      }`}>
                        <span className="font-semibold">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">City / Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full pl-9 pr-4 py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-sm bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] focus:outline-hidden focus:border-[#8B0020] dark:focus:border-[#C9A84C] focus:ring-1 focus:ring-[#8B0020]/20 dark:focus:ring-[#C9A84C]/20 appearance-none cursor-pointer">
                      {ETHIOPIAN_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input type="tel" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="0911XXXXXX" className="w-full pl-9 pr-4 py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-sm bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:border-[#8B0020] dark:focus:border-[#C9A84C]" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">Telegram Username</label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input type="text" value={telegramUsername} onChange={(e) => setTelegramUsername(e.target.value)} placeholder="@yourusername" className="w-full pl-9 pr-4 py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-sm bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:border-[#8B0020] dark:focus:border-[#C9A84C]" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">Instagram Username</label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input type="text" value={instagramUsername} onChange={(e) => setInstagramUsername(e.target.value)} placeholder="@yourusername" className="w-full pl-9 pr-4 py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-sm bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:border-[#8B0020] dark:focus:border-[#C9A84C]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">Profile Photo</label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex gap-2">
                      {(myGender === 'Male' ? PRESET_MALE_IMAGES : PRESET_FEMALE_IMAGES).slice(0, 3).map((url, idx) => (
                        <button key={idx} type="button" onClick={() => { setSelectedPresetImage(url); setPhotoSource('preset'); }} className={`w-14 h-14 rounded-full overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${photoSource === 'preset' && selectedPresetImage === url ? 'border-[#8B0020] dark:border-[#C9A84C] scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">or</span>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs font-bold text-[#8B0020] dark:text-[#C9A84C] hover:text-[#B31B3A] dark:hover:text-[#E0C878] flex items-center gap-1 cursor-pointer">
                      <Camera className="h-3.5 w-3.5" /> Upload Photo
                    </button>
                    <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
                  </div>
                  {photoSource === 'upload' && localUploadedImage && (
                    <div className="mt-1">
                      <img src={localUploadedImage} alt="Preview" className="w-14 h-14 rounded-full object-cover border-2 border-[#C9A84C]" />
                    </div>
                  )}
                </div>

                <button type="submit" className="w-full py-3.5 bg-[#8B0020] hover:bg-[#B31B3A] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#8B0020]/20 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer">
                  <UserPlus className="h-4 w-4" />
                  <span>Create Profile & Start Connecting</span>
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-[#8B0020] dark:text-[#C9A84C] uppercase tracking-widest">Welcome Back</span>
                  <h2 className="text-xl font-black text-[#1A1118] dark:text-[#FFFCF8] mt-1">Sign In</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Access your existing Whaatachi profile</p>
                </div>

                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">Full Name</label>
                    <input type="text" required value={signInName} onChange={(e) => setSignInName(e.target.value)} placeholder="Enter your registered name" className="w-full px-4 py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-sm bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:border-[#8B0020] dark:focus:border-[#C9A84C] focus:ring-1 focus:ring-[#8B0020]/20 dark:focus:ring-[#C9A84C]/20" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">Phone Number (Optional)</label>
                    <input type="tel" value={signInPhone} onChange={(e) => setSignInPhone(e.target.value)} placeholder="0911XXXXXX" className="w-full px-4 py-3 border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl text-sm bg-white dark:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:border-[#8B0020] dark:focus:border-[#C9A84C]" />
                  </div>

                  <button type="submit" className="w-full py-3.5 bg-[#8B0020] hover:bg-[#B31B3A] text-white font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-[#8B0020]/20">
                    <Send className="h-3.5 w-3.5" />
                    <span>Sign In</span>
                  </button>
                </form>

                <div className="border-t border-[#EDE6D9] dark:border-[#C9A84C]/10 pt-4 space-y-2.5">
                  <span className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">Quick Test Login</span>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-light leading-snug">Click a profile to explore Whaatachi instantly:</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {featuredProfiles.slice(0, 3).map((testProfile) => (
                      <button key={testProfile.id} onClick={() => { onSimulateTestLogin(testProfile); onClose(); }} className="p-2 border border-[#EDE6D9] dark:border-[#C9A84C]/15 hover:border-[#8B0020]/30 dark:hover:border-[#C9A84C]/30 rounded-xl bg-[#F8F4ED]/20 dark:bg-[#1A1118]/50 cursor-pointer text-left flex items-center gap-2 group transition-all shrink-0">
                        <img src={testProfile.image} alt={testProfile.name} className="w-8 h-8 rounded-full object-cover border group-hover:border-[#8B0020] dark:group-hover:border-[#C9A84C] transition-colors" referrerPolicy="no-referrer" />
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
