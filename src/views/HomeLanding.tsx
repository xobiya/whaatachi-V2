import React from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  UserPlus, 
  MapPin, 
  Search, 
  Users, 
  Shield, 
  Play, 
  MessageSquare,
  Sparkles as SparklesIcon 
} from 'lucide-react';
import { Profile } from '../types';

interface HomeLandingProps {
  onJoinNowClick: (tab?: 'register' | 'signin') => void;
  featuredProfiles: Profile[];
  userGender: 'Male' | 'Female';
  isLoggedIn?: boolean;
  currentUser?: Profile | null;
  onGoToDashboard?: () => void;
  onLogout?: () => void;
}

export default function HomeLanding({
  onJoinNowClick,
  featuredProfiles,
  userGender,
  isLoggedIn = false,
  currentUser = null,
  onGoToDashboard,
  onLogout
}: HomeLandingProps) {

  // Safety fallback profiles if featuredProfiles empty or short to match the exact mockup elements (Lili, Abel, Selam, etc.)
  const activeProfiles = featuredProfiles && featuredProfiles.length >= 6 
    ? featuredProfiles.slice(0, 6) 
    : [
        {
          id: 'p1',
          name: 'Selam',
          age: 24,
          city: 'Addis Ababa',
          image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=500&auto=format&fit=crop&q=80',
          relationshipIntent: 'True Relationship',
          verified: true,
          status: 'Online',
          bio: 'Looking for a genuine romantic partner to share beautiful live melodies and coffee session.'
        },
        {
          id: 'p2',
          name: 'Daniel',
          age: 27,
          city: 'Addis Ababa',
          image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
          relationshipIntent: 'Friendship',
          verified: true,
          status: 'Online',
          bio: 'Architect, looking for a sincere dynamic partner to explore beautiful galleries around Bole.'
        },
        {
          id: 'p3',
          name: 'Maya',
          age: 22,
          city: 'Addis Ababa',
          image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=500&auto=format&fit=crop&q=80',
          relationshipIntent: 'Fun',
          verified: true,
          status: 'Online',
          bio: 'Lover of Hawassa lake breeze, morning runs, and playing tennis.'
        },
        {
          id: 'p4',
          name: 'Abel',
          age: 29,
          city: 'Addis Ababa',
          image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
          relationshipIntent: 'True Relationship',
          verified: true,
          status: 'Online',
          bio: 'Business consultant. Passionate about pediatrics development and traditional cooking.'
        },
        {
          id: 'p5',
          name: 'Lili',
          age: 25,
          city: 'Addis Ababa',
          image: 'https://images.unsplash.com/photo-1507152832244-10d45ee79330?w=500&auto=format&fit=crop&q=80',
          relationshipIntent: 'Friendship',
          verified: true,
          status: 'Online',
          bio: 'Medical student, passionate child-care worker. Let\'s make beautiful memories.'
        },
        {
          id: 'p6',
          name: 'Nahom',
          age: 26,
          city: 'Addis Ababa',
          image: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=500&auto=format&fit=crop&q=80',
          relationshipIntent: 'Fun',
          verified: true,
          status: 'Online',
          bio: 'Passionate salsa trainer and street photographer. Let\'s capture beautiful vibes.'
        }
      ];

  return (
    <div className="bg-white dark:bg-[#05060f] text-gray-900 dark:text-gray-100 flex flex-col min-h-screen font-sans selection:bg-pink-600 selection:text-white" id="home-landing-view">
      
      {/* 1. Hero Section with gorgeous happy couple background image */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center pt-8 pb-16 lg:py-24" id="hero-premium-backdrop-wrapper">
        
        {/* Background Image: Happy Couple with referrerPolicy="no-referrer" to bypass iframe sandboxing restrictions */}
        <img 
          src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1600&auto=format&fit=crop&q=80" 
          alt="Happy Dating Couple Relations"
          className="absolute inset-0 w-full h-full object-cover object-[center_28%] transition-all duration-700 select-none z-0 pointer-events-none"
          referrerPolicy="no-referrer"
          id="hero-happy-couple-image"
        />
        
        {/* Gradients that guarantee massive readability of the text on the left in both light and dark themes */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent dark:from-[#05060f] dark:via-[#05060f]/90 dark:to-transparent hidden lg:block z-0 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/20 dark:from-[#05060f] dark:via-[#05060f]/80 dark:to-[#05060f]/20 lg:hidden z-0 pointer-events-none"></div>
        
        {/* Ambient subtle rose corner glow light */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 z-10 w-full mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Bold Headline & Call to action exactly styled with the photo specs */}
            <div className="lg:col-span-7 space-y-7 text-left max-w-2xl mx-auto lg:mx-0 p-4 sm:p-0">
              
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-sans font-black tracking-tight leading-none text-gray-905 dark:text-white">
                  Find People.<br />
                  Build Connections.<br />
                  <span className="text-[#e61c5d] bg-clip-text">
                    Your Way.
                  </span>
                </h1>
              </div>

              <p className="text-gray-650 dark:text-gray-300 text-sm sm:text-base lg:text-lg font-normal leading-relaxed max-w-xl">
                Find men and women for true relationship, friendship, friends with benefits or just fun. Real people, real connections, real you.
              </p>

              {/* Pink Inline badges with icons matching the exact uploaded image design details */}
              <div className="flex flex-wrap gap-4 pt-1">
                <div className="flex items-center gap-1.5 text-pink-600 dark:text-pink-500 text-xs sm:text-sm font-bold tracking-wide">
                  <Users className="h-4.5 w-4.5 text-pink-600 dark:text-pink-500" />
                  <span>50K+ Active Members</span>
                </div>
                <div className="flex items-center gap-1.5 text-pink-600 dark:text-pink-500 text-xs sm:text-sm font-bold tracking-wide">
                  <Heart className="h-4.5 w-4.5 fill-pink-600 dark:fill-pink-500 text-pink-600 dark:text-pink-500" />
                  <span>12K+ Success Stories</span>
                </div>
                <div className="flex items-center gap-1.5 text-pink-600 dark:text-pink-500 text-xs sm:text-sm font-bold tracking-wide">
                  <ShieldCheck className="h-4.5 w-4.5 text-pink-600 dark:text-pink-500" />
                  <span>100% Safe & Secure</span>
                </div>
              </div>

              {/* Double Hero primary trigger buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => onJoinNowClick('register')}
                  className="px-8 py-3.5 bg-[#e61c5d] hover:bg-[#c2144b] text-white font-black text-xs sm:text-sm rounded-lg shadow-lg hover:shadow-pink-600/10 transition-all flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Join Now</span>
                </button>
                
                <a
                  href="#how-it-works"
                  className="px-8 py-3.5 bg-transparent border-2 border-gray-400 dark:border-white/60 hover:border-gray-900 dark:hover:border-white text-gray-800 dark:text-white font-bold text-xs sm:text-sm rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-current text-gray-800 dark:text-white" />
                  <span>How It Works</span>
                </a>
              </div>
            </div>

            {/* Right Column: User Live Card or Overlapping premium previews for visual luxury */}
            <div className="lg:col-span-5 w-full max-w-sm mx-auto p-4 sm:p-0">
              {isLoggedIn && currentUser ? (
                /* Profile Preview for Logged in Users */
                <div className="relative bg-white/95 dark:bg-[#0d0e1b]/95 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden text-left">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">Matchmaker Live Hub</span>
                    </div>
                    <span className="text-[10px] font-mono text-pink-600 dark:text-pink-500 px-2 py-0.5 rounded bg-pink-500/10 font-black">
                      Active Account
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <img 
                      src={currentUser.image || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=85"} 
                      alt={currentUser.name} 
                      className="w-20 h-20 rounded-xl object-cover border border-pink-500/40 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-gray-900 dark:text-white">{currentUser.name}, {currentUser.age}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-pink-500" />
                        <span>{currentUser.city || "Addis Ababa, ET"}</span>
                      </p>
                      <span className="inline-block text-[9px] bg-emerald-500/15 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 font-extrabold px-1.5 py-0.5 rounded">
                        Verified Match
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/5 space-y-3">
                    <button
                      onClick={onGoToDashboard}
                      className="w-full py-3 bg-[#e61c5d] hover:bg-[#c2144b] text-white font-extrabold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4 text-white" />
                      <span>Enter Matching Board</span>
                    </button>
                    
                    <button
                      onClick={onLogout}
                      className="w-full py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                /* Static High fidelity Mockup elements to look premium when logged out */
                <div className="relative space-y-4">
                  
                  {/* Floating badge for active matching count */}
                  <div className="absolute -top-6 -left-6 bg-white dark:bg-[#0d0e1b] border border-gray-200 dark:border-pink-500/30 p-3 rounded-xl shadow-2xl flex items-center gap-2 transform -rotate-3 z-20">
                    <div className="h-8 w-8 rounded-full bg-pink-500/10 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-pink-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-[11.5px] font-black text-gray-900 dark:text-white">1,400+</p>
                      <p className="text-[8px] text-gray-500 dark:text-gray-400 font-bold">Online in Addis</p>
                    </div>
                  </div>

                  {/* Profile Preview Mini-Card A */}
                  <div className="bg-white/95 dark:bg-[#0b0c15]/90 backdrop-blur-md p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-2xl flex items-center gap-3 transform -rotate-1 relative hover:rotate-0 transition-transform duration-350 select-none">
                    <img 
                      src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&auto=format&fit=crop&q=80" 
                      alt="Habesha Girl" 
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-pink-500/20"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left grow overflow-hidden">
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">Selamawit, 24</h4>
                        <span className="text-[7.5px] bg-[#e61c5d] text-white px-1.5 py-0.2 rounded-full font-bold">VIP</span>
                      </div>
                      <p className="text-[9.5px] text-gray-500 dark:text-gray-400 line-clamp-1">"Coffee enthusiast looking for premium true relationship..."</p>
                    </div>
                    <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded-md self-center shrink-0">
                      Active
                    </span>
                  </div>

                  {/* Profile Preview Mini-Card B */}
                  <div className="bg-white/95 dark:bg-[#0b0c15]/90 backdrop-blur-md p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-2xl flex items-center gap-3 transform rotate-2 relative hover:rotate-0 transition-transform duration-350 select-none">
                    <img 
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80" 
                      alt="Habesha Guy" 
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-blue-500/20"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left grow overflow-hidden">
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">Abel Mekonnen, 28</h4>
                        <span className="text-[7.5px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-black uppercase">Gold</span>
                      </div>
                      <p className="text-[9.5px] text-gray-500 dark:text-gray-400 line-clamp-1">"Architect. Sincere, ready to construct beautiful matching story..."</p>
                    </div>
                    <span className="text-[9px] font-black text-pink-600 dark:text-pink-400 bg-pink-500/10 border border-pink-500/25 px-1.5 py-0.5 rounded-md self-center shrink-0">
                      Nearby
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 2. "I'M HERE FOR" Intents block */}
      <section className="py-12 bg-slate-50 dark:bg-[#090a13] border-t border-gray-200 dark:border-white/5 text-center" id="whats-your-vibe">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="space-y-1 mb-10">
            <span className="text-xs font-bold text-pink-600 dark:text-pink-500 uppercase tracking-[0.2em]">I'M HERE FOR</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Vibe 1: True Relationship */}
            <div 
              onClick={() => onJoinNowClick('register')} 
              className="bg-white dark:bg-[#0c0d18] border border-gray-200 dark:border-white/5 hover:border-pink-500/40 p-6 rounded-xl text-center space-y-4 hover:shadow-2xl hover:shadow-pink-500/5 transition-all cursor-pointer group"
            >
              <div className="h-12 w-12 rounded-xl bg-pink-500/10 border border-pink-500/25 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                <Heart className="h-6 w-6 text-[#e61c5d] fill-[#e61c5d]/20" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white group-hover:text-pink-500 transition-colors">True Relationship</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-light">Find your life partner</p>
              </div>
            </div>

            {/* Vibe 2: Friendship */}
            <div 
              onClick={() => onJoinNowClick('register')} 
              className="bg-white dark:bg-[#0c0d18] border border-gray-200 dark:border-white/5 hover:border-blue-500/40 p-6 rounded-xl text-center space-y-4 hover:shadow-2xl hover:shadow-blue-500/5 transition-all cursor-pointer group"
            >
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                <Users className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">Friendship</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-light">Meet new friends</p>
              </div>
            </div>

            {/* Vibe 3: Friends with Benefits */}
            <div 
              onClick={() => onJoinNowClick('register')} 
              className="bg-white dark:bg-[#0c0d18] border border-gray-200 dark:border-white/5 hover:border-yellow-500/40 p-6 rounded-xl text-center space-y-4 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all cursor-pointer group"
            >
              <div className="h-12 w-12 rounded-xl bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                <Sparkles className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">Friends with Benefits</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-light">No strings attached</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. "How It Works" Connecting Steps Block */}
      <section className="py-20 bg-white dark:bg-[#05060f] border-t border-gray-200 dark:border-white/5" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          
          <div className="inline-block relative mb-14">
            <h2 className="text-3xl font-black text-gray-905 dark:text-white tracking-tight leading-none pb-2">
              How It Works
            </h2>
            <div className="h-0.5 w-16 bg-[#e61c5d] mx-auto mt-1 rounded-full"></div>
          </div>

          {/* Dotted Connection Engine Wrapper */}
          <div className="relative">
            
            {/* Horizontal line for desktop layout */}
            <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] border-t-2 border-dashed border-gray-200 dark:border-gray-800 z-0"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8 relative z-10">
              
              {/* Step 1: Create Account */}
              <div className="space-y-4 group">
                <div className="relative mx-auto h-[88px] w-[88px] rounded-full border border-pink-500/30 bg-white dark:bg-[#0c0d18] flex items-center justify-center transition-all duration-300 group-hover:border-pink-500 group-hover:shadow-lg group-hover:shadow-pink-500/10">
                  <UserPlus className="h-8 w-8 text-pink-600 dark:text-pink-500" />
                  {/* Circular Step Badge */}
                  <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-pink-500 text-white font-mono text-xs font-black flex items-center justify-center shadow-lg">
                    1
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">Create Account</h3>
                  <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed font-light px-4">
                    Register with your basic info and preferred way to connect.
                  </p>
                </div>
              </div>

              {/* Step 2: Payment (Men Only) */}
              <div className="space-y-4 group">
                <div className="relative mx-auto h-[88px] w-[88px] rounded-full border border-cyan-500/30 bg-white dark:bg-[#0c0d18] flex items-center justify-center transition-all duration-300 group-hover:border-cyan-500 group-hover:shadow-lg group-hover:shadow-cyan-500/10">
                  <Zap className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                  {/* Circular Step Badge */}
                  <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-cyan-500 text-white font-mono text-xs font-black flex items-center justify-center shadow-lg">
                    2
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">Payment (Men Only)</h3>
                  <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed font-light px-4">
                    Men pay 200 Birr to get full access. Women join for free.
                  </p>
                </div>
              </div>

              {/* Step 3: Find & Connect */}
              <div className="space-y-4 group">
                <div className="relative mx-auto h-[88px] w-[88px] rounded-full border border-yellow-500/30 bg-white dark:bg-[#0c0d18] flex items-center justify-center transition-all duration-300 group-hover:border-yellow-500 group-hover:shadow-lg group-hover:shadow-yellow-500/10">
                  <Search className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  {/* Circular Step Badge */}
                  <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-yellow-500 text-white font-mono text-xs font-black flex items-center justify-center shadow-lg">
                    3
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-300 transition-colors">Find & Connect</h3>
                  <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed font-light px-4">
                    Search people based on what you're looking for.
                  </p>
                </div>
              </div>

              {/* Step 4: Get Contacts */}
              <div className="space-y-4 group">
                <div className="relative mx-auto h-[88px] w-[88px] rounded-full border border-pink-500/30 bg-white dark:bg-[#0c0d18] flex items-center justify-center transition-all duration-300 group-hover:border-[#e61c5d] group-hover:shadow-lg group-hover:shadow-pink-500/10">
                  <MessageSquare className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                  {/* Circular Step Badge */}
                  <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-pink-500 text-white font-mono text-xs font-black flex items-center justify-center shadow-lg">
                    4
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-300 transition-colors">Get Contacts</h3>
                  <p className="text-xs text-gray-550 dark:text-gray-300 leading-relaxed font-light px-4">
                    After payment, view contacts and start connecting.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. Complete "Join Whaatachi" Pricing & Trust grid block */}
      <section className="py-20 bg-slate-50 dark:bg-[#080911] border-t border-gray-200 dark:border-white/5" id="join-whaatachi">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-905 dark:text-white tracking-tight leading-none">
              Join Whaatachi
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Gents pricing component (Col span 4) */}
            <div className="lg:col-span-4 bg-white dark:bg-[#0d0e1b] rounded-2xl p-6 border-l-4 border-l-blue-500 border-y border-r border-gray-200 dark:border-white/5 relative flex flex-col justify-between shadow-xl h-full">
              <span className="absolute top-4 right-4 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[9px] font-sans font-black uppercase px-2 py-0.5 rounded">
                Men
              </span>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Men Only Connection</h3>
                </div>
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-5xl font-black text-gray-900 dark:text-white">200</span>
                  <span className="text-lg font-bold text-gray-500 dark:text-gray-450">Birr</span>
                </div>
                
                <ul className="space-y-4 text-xs text-gray-650 dark:text-gray-300 pt-2 text-left">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                    <span>Full access to all members</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                    <span>View contacts (Phone, Telegram, IG)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                    <span>Advanced search & filters</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                    <span>Send messages</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                    <span>24/7 Customer support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onJoinNowClick('register')}
                className="mt-8 w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wide rounded-lg cursor-pointer transition-colors shadow-lg"
              >
                Pay 200 Birr & Continue
              </button>
            </div>

            {/* Ladies pricing component (Col span 4) */}
            <div className="lg:col-span-4 bg-white dark:bg-[#0d0e1b] rounded-2xl p-6 border-l-4 border-l-pink-500 border-y border-r border-gray-200 dark:border-white/5 relative flex flex-col justify-between shadow-xl h-full">
              <span className="absolute top-4 right-4 bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-[9px] font-sans font-black uppercase px-2 py-0.5 rounded">
                Women
              </span>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Women Access</h3>
                </div>
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-5xl font-black text-gray-900 dark:text-white">Free</span>
                </div>
                
                <ul className="space-y-4 text-xs text-gray-650 dark:text-gray-300 pt-2 text-left">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4.5 w-4.5 text-pink-500 shrink-0" />
                    <span>Create profile for free</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4.5 w-4.5 text-pink-500 shrink-0" />
                    <span>Browse members</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4.5 w-4.5 text-pink-500 shrink-0" />
                    <span>Receive messages</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4.5 w-4.5 text-pink-500 shrink-0" />
                    <span>View limited info</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="h-4.5 w-4.5 text-pink-500 shrink-0" />
                    <span>Upgrade anytime (optional)</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onJoinNowClick('register')}
                className="mt-8 w-full py-3.5 bg-[#e61c5d] hover:bg-[#c2144b] text-white text-xs font-black uppercase tracking-wide rounded-lg cursor-pointer transition-colors shadow-lg"
              >
                Join For Free
              </button>
            </div>

            {/* Corporate/trust values list (Col span 4) */}
            <div className="lg:col-span-4 space-y-6 text-left p-2 sm:p-4 self-center">
              
              {/* Pillar 1: Safe & Secure */}
              <div className="flex gap-4">
                <div className="h-9 w-9 rounded-full bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center shrink-0">
                  <Shield className="h-4.5 w-4.5 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Safe & Secure</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-light leading-snug">Your privacy is our priority</p>
                </div>
              </div>

              {/* Pillar 2: Real People */}
              <div className="flex gap-4">
                <div className="h-9 w-9 rounded-full bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center shrink-0">
                  <Users className="h-4.5 w-4.5 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Real People</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-light leading-snug">Verified profiles for real connections</p>
                </div>
              </div>

              {/* Pillar 3: Fast & Easy */}
              <div className="flex gap-4">
                <div className="h-9 w-9 rounded-full bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center shrink-0">
                  <Zap className="h-4.5 w-4.5 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Fast & Easy</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-light leading-snug">Quick registration and simple process</p>
                </div>
              </div>

              {/* Pillar 4: 24/7 Support */}
              <div className="flex gap-4">
                <div className="h-9 w-9 rounded-full bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-4.5 w-4.5 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">24/7 Support</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-light leading-snug">We are here to help you anytime</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. "Featured Members" section matching the exact circular avatar glow sliders */}
      <section className="py-20 bg-white dark:bg-[#05060f] border-t border-gray-200 dark:border-white/5" id="featured-members-onboard">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="flex justify-between items-end mb-12">
            <div className="text-left space-y-1">
              <h2 className="text-2.5xl font-black text-gray-900 dark:text-white tracking-tight">Featured Members</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-light">Meet some of our newest and most active members</p>
            </div>
            
            <button 
              onClick={() => onJoinNowClick('register')}
              className="px-4 py-2 border border-pink-500/40 hover:border-pink-500 text-pink-600 dark:text-pink-500 text-xs font-bold rounded-full transition-all cursor-pointer"
            >
              View All
            </button>
          </div>

          {/* Glowing Avatar Profiles Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {activeProfiles.map((profile) => (
              <div 
                key={profile.id} 
                onClick={() => onJoinNowClick('register')}
                className="bg-slate-50 dark:bg-[#0c0d18] border border-gray-200 dark:border-white/5 hover:border-pink-500/30 rounded-xl p-4 text-center cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/5 group"
              >
                {/* Image Avatar Container with glowing green indicator */}
                <div className="relative mx-auto w-24 h-24 mb-4">
                  <img 
                    src={profile.image} 
                    alt={profile.name} 
                    className="w-full h-full rounded-full object-cover border-2 border-gray-200 dark:border-white/10 group-hover:border-pink-500 transition-colors duration-300" 
                    referrerPolicy="no-referrer"
                  />
                  {/* Status Indicator */}
                  <span className="absolute top-1 left-1 bg-emerald-500 text-[8px] font-black uppercase tracking-wider text-white px-1.5 py-0.5 rounded-full shadow-lg">
                    ● ONLINE
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                    {profile.name}, {profile.age}
                  </h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-light line-clamp-1">
                    Looking for {profile.relationshipIntent || "True Relationship"}
                  </p>
                  <p className="text-[9px] text-[#e61c5d] font-bold inline-flex items-center gap-0.5 justify-center">
                    <MapPin className="h-2.5 w-2.5 fill-[#e61c5d]/20 shrink-0" />
                    <span>{profile.city || "Addis Ababa"}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
