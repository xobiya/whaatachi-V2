import React, { useState, useRef, useEffect } from 'react';
import { X, Heart, ShieldCheck, Zap, Sparkles, CheckCircle, ArrowRight, UserPlus, Gift, AlertCircle, Upload, User, Phone, Instagram, Send, ArrowLeft, Check, Lock } from 'lucide-react';
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

const PRESET_MALE_IMAGES = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
];

const PRESET_FEMALE_IMAGES = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
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
  const [registerStep, setRegisterStep] = useState<number>(1);

  // --- Step 1 States ---
  const [selectedIntent, setSelectedIntent] = useState<string>('❤️ Relationship');
  const [lookingForGender, setLookingForGender] = useState<'Male' | 'Female'>('Female');

  // --- Step 2 States ---
  const [fullName, setFullName] = useState<string>('');
  const [telegramUsername, setTelegramUsername] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [instagramUsername, setInstagramUsername] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [myGender, setMyGender] = useState<'Male' | 'Female'>('Male'); // Defaults to opposite of lookingFor
  
  // Photo Option: 'preset' | 'upload'
  const [photoSource, setPhotoSource] = useState<'preset' | 'upload'>('preset');
  const [selectedPresetImage, setSelectedPresetImage] = useState<string>(PRESET_MALE_IMAGES[0]);
  const [localUploadedImage, setLocalUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Sign In States ---
  const [signInName, setSignInName] = useState<string>('');
  const [signInPhone, setSignInPhone] = useState<string>('');

  // Validation Warnings
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync tab style when parent changes initialTab
  useEffect(() => {
    setActiveTab(initialTab);
    setValidationError(null);
    setRegisterStep(1);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  // Sync myGender fallback when lookingForGender toggles
  const handleLookingForChange = (gender: 'Male' | 'Female') => {
    setLookingForGender(gender);
    const fallbackGender = gender === 'Female' ? 'Male' : 'Female';
    setMyGender(fallbackGender);
    setSelectedPresetImage(fallbackGender === 'Male' ? PRESET_MALE_IMAGES[0] : PRESET_FEMALE_IMAGES[0]);
  };

  const handleMyGenderChange = (gender: 'Male' | 'Female') => {
    setMyGender(gender);
    setSelectedPresetImage(gender === 'Male' ? PRESET_MALE_IMAGES[0] : PRESET_FEMALE_IMAGES[0]);
  };

  // Safe file reader helper
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

  // Handle register submission
  const handleCreateRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!fullName.trim()) {
      setValidationError('Please input your Full Name to continue.');
      return;
    }
    if (!telegramUsername.trim()) {
      setValidationError('Please write your Private Telegram Handle.');
      return;
    }
    if (!phoneNumber.trim()) {
      setValidationError('Phone number is strictly required for cash receipt audits.');
      return;
    }

    const ageNum = age ? parseInt(age, 10) : 24;
    const finalImage = photoSource === 'preset' 
      ? selectedPresetImage 
      : (localUploadedImage || (myGender === 'Male' ? PRESET_MALE_IMAGES[0] : PRESET_FEMALE_IMAGES[0]));

    // Map intent appropriately to database type
    let finalIntent: 'True Relationship' | 'Friendship' | 'Friends with Benefits' = 'True Relationship';
    if (selectedIntent === '🤝 Friend With Benefits' || selectedIntent === '🔥 Casual Connections') {
      finalIntent = 'Friends with Benefits';
    } else if (selectedIntent === '💕 Dating') {
      finalIntent = 'True Relationship';
    }

    const newProfile: Profile = {
      id: `custom-profile-${Date.now()}`,
      name: fullName.trim(),
      age: ageNum,
      city: 'Addis Ababa',
      bio: `Hi, I am looking for an authentic connection on Whaatachi channels. Intent objective: ${selectedIntent}.`,
      gender: myGender,
      image: finalImage,
      status: 'Online',
      relationshipIntent: finalIntent,
      interests: ['Coffee & Chat', 'Dinner Out', 'Night Life', 'Ethio Arts'],
      verified: false, // Men verified via receipt, ladies free
      contactInfo: {
        phone: phoneNumber.trim(),
        telegram: telegramUsername.trim().replace('@', ''),
        email: `${fullName.toLowerCase().replace(/\s+/g, '')}@example.com`
      }
    };

    onRegisterUser(newProfile);
    onClose();
  };

  // Handle sign in submission
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
    { label: '❤️ Relationship', desc: 'Serious and long term commitment' },
    { label: '💕 Dating', desc: 'Meet up and explore compatibility' },
    { label: '🤝 Friend With Benefits', desc: 'Mutually consensual casual dating' },
    { label: '🔥 Casual Connections', desc: 'No-strings attached conversations' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" id="auth-modal-overlay">
      {/* Background backing */}
      <div 
        className="fixed inset-0 bg-slate-900/70 dark:bg-black/80 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal core wrapper */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-left transform transition-all duration-300 animate-scaleUp"
          id="auth-modal-content"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-650 dark:text-slate-405 dark:hover:text-white bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-750 transition-colors cursor-pointer z-10"
            aria-label="Close interactive auth module"
          >
            <X className="h-4.5 w-4.5" />
          </button>

          {/* Card Header & Tab switchers */}
          <div className="flex border-b border-gray-150 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-850/30">
            <button
              onClick={() => {
                setActiveTab('register');
                setValidationError(null);
              }}
              className={`flex-1 text-center py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                activeTab === 'register'
                  ? 'border-pink-500 text-pink-600 dark:text-pink-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-gray-450 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Create Profile
            </button>
            <button
              onClick={() => {
                setActiveTab('signin');
                setValidationError(null);
              }}
              className={`flex-1 text-center py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                activeTab === 'signin'
                  ? 'border-pink-500 text-pink-600 dark:text-pink-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-gray-450 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Sign In Flow
            </button>
          </div>

          {/* Validation Warnings */}
          {validationError && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="p-6">
            {activeTab === 'register' ? (
              <div>
                {/* STEP 1: Find What You Are Looking For */}
                {registerStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest font-mono">Step 1 of 2</span>
                      <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mt-1">Find What You’re Looking For</h2>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 font-light">Determine your current meeting rhythm and target matching focus.</p>
                    </div>

                    {/* Choose an Option */}
                    <div className="space-y-2.5">
                      <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Choose an Option</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {intentOptions.map((opt) => {
                          const isSelected = selectedIntent === opt.label;
                          return (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() => setSelectedIntent(opt.label)}
                              className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1 ${
                                isSelected
                                  ? 'bg-pink-50/50 border-pink-500 dark:bg-pink-950/20 dark:border-pink-500'
                                  : 'bg-white border-gray-200 hover:border-gray-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700'
                              }`}
                            >
                              <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center justify-between">
                                {opt.label}
                                {isSelected && <Check className="h-3.5 w-3.5 text-pink-550 shrink-0" />}
                              </span>
                              <span className="text-[10px] text-gray-500 dark:text-slate-405 leading-tight font-light">{opt.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Looking For */}
                    <div className="space-y-2.5">
                      <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Looking For</label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['Female', 'Male'] as const).map((gender) => {
                          const isSelected = lookingForGender === gender;
                          return (
                            <button
                              key={gender}
                              type="button"
                              onClick={() => handleLookingForChange(gender)}
                              className={`py-3.5 px-4 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-2 ${
                                isSelected
                                  ? 'bg-pink-500 border-pink-500 text-white shadow-sm'
                                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700'
                              }`}
                            >
                              <span>{gender === 'Female' ? '👩 Women' : '👨 Men'}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={() => setRegisterStep(2)}
                      className="w-full mt-4 py-3 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Next: Create Profile</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* STEP 2: Create Profile details */}
                {registerStep === 2 && (
                  <form onSubmit={handleCreateRegisterSubmit} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest">Step 2 of 2</span>
                        <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">Registration Info</h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRegisterStep(1)}
                        className="text-xs text-gray-505 hover:text-pink-600 inline-flex items-center gap-1 cursor-pointer hover:underline"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back</span>
                      </button>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="E.g. Selamawit Abera"
                          className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-slate-750 rounded-xl text-xs bg-gray-50/50 dark:bg-slate-850 text-gray-800 dark:text-white focus:outline-hidden focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                        />
                      </div>
                    </div>

                    {/* Age & Gender options in a double grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Age (Optional)</label>
                        <input
                          type="number"
                          min="18"
                          max="60"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="E.g. 24"
                          className="w-full px-3 py-2 border border-gray-200 dark:border-slate-750 rounded-xl text-xs bg-gray-50/50 dark:bg-slate-850 text-gray-800 dark:text-white focus:outline-hidden focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">I am a</label>
                        <div className="grid grid-cols-2 bg-gray-50 dark:bg-slate-850/70 border border-gray-205 dark:border-slate-750 rounded-xl p-1 gap-1">
                          {(['Male', 'Female'] as const).map((genderOption) => {
                            const isSelected = myGender === genderOption;
                            return (
                              <button
                                key={genderOption}
                                type="button"
                                onClick={() => handleMyGenderChange(genderOption)}
                                className={`py-1 text-[10px] font-bold text-center rounded-lg transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-pink-500 text-white'
                                    : 'text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                                }`}
                              >
                                {genderOption === 'Male' ? 'Man' : 'Woman'}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Private Handles Container */}
                    <div className="bg-gray-50/50 dark:bg-slate-850/40 p-3 rounded-xl border border-gray-150 dark:border-slate-800/40 space-y-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-gray-450 dark:text-slate-400 uppercase tracking-wider">
                        <Lock className="h-3 w-3 text-pink-550 shrink-0" />
                        <span>Private contact info (Hidden until unlocked)</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Telegram Handle */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-gray-600 dark:text-slate-400">Telegram Username</label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1.5 text-xs text-gray-455 font-semibold">@</span>
                            <input
                              type="text"
                              required
                              value={telegramUsername}
                              onChange={(e) => setTelegramUsername(e.target.value)}
                              placeholder="Username"
                              className="w-full pl-6 pr-3 py-1 border border-gray-200 dark:border-slate-750 rounded-lg text-xs bg-white dark:bg-slate-900 text-gray-800 dark:text-white"
                            />
                          </div>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-gray-600 dark:text-slate-400">Phone Number (Required)</label>
                          <div className="relative">
                            <Phone className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
                            <input
                              type="tel"
                              required
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="0911XXXXXX"
                              className="w-full pl-6.5 pr-3 py-1 border border-gray-200 dark:border-slate-750 rounded-lg text-xs bg-white dark:bg-slate-900 text-gray-800 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Instagram Optional Handle */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-650 dark:text-slate-405">Instagram Username (Optional)</label>
                        <div className="relative">
                          <Instagram className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-gray-450" />
                          <input
                            type="text"
                            value={instagramUsername}
                            onChange={(e) => setInstagramUsername(e.target.value)}
                            placeholder="E.g. instaname (no '@')"
                            className="w-full pl-8 pr-3 py-1 border border-gray-200 dark:border-slate-750 rounded-lg text-xs bg-white dark:bg-slate-900 text-gray-800 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Image Selector Interactive Upload simulation */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-700 dark:text-slate-350 uppercase tracking-wider">Photo Upload</label>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        {/* Presets Grid */}
                        <div className="space-y-2">
                          <span className="block text-[10px] font-bold text-gray-400">Choose a default Avatar:</span>
                          <div className="flex gap-2">
                            {(myGender === 'Male' ? PRESET_MALE_IMAGES : PRESET_FEMALE_IMAGES).map((presetUrl, idx) => {
                              const isSelected = photoSource === 'preset' && selectedPresetImage === presetUrl;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setSelectedPresetImage(presetUrl);
                                    setPhotoSource('preset');
                                  }}
                                  className={`w-11 h-11 rounded-full overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                                    isSelected ? 'border-pink-500 scale-105 shadow-xs' : 'border-transparent opacity-75'
                                  }`}
                                >
                                  <img src={presetUrl} alt="Preset Headshot" className="w-full h-full object-cover" />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Manual upload simulation */}
                        <div className="space-y-1">
                          <span className="block text-[10px] font-bold text-gray-400">Or Upload Profile Image:</span>
                          <div>
                            <input
                              type="file"
                              ref={fileInputRef}
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className={`w-full py-2 px-3 border border-dashed rounded-xl text-[10px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                                photoSource === 'upload' && localUploadedImage
                                  ? 'border-emerald-400 bg-emerald-50/20 text-emerald-700 dark:text-emerald-400'
                                  : 'border-gray-250 hover:border-gray-350 dark:border-slate-700 dark:hover:border-slate-600 text-gray-700 dark:text-slate-300'
                              }`}
                            >
                              <Upload className="h-3.5 w-3.5 text-gray-400" />
                              <span>{photoSource === 'upload' && localUploadedImage ? 'Uploaded ✓' : 'Upload File'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Create Profile & Sign In</span>
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* SIGN IN MODULE FLOW */
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest font-mono">Authentication Access</span>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white mt-1">Implement Sign In Flow</h2>
                  <p className="text-xs text-gray-550 dark:text-slate-400 mt-0.5 font-light">Lookup existing matching accounts stored inside local storage.</p>
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
