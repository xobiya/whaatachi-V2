import React from 'react';
import { Heart, ShieldCheck, Users, Sparkles, ArrowRight, ChevronRight, Lock, Phone, MessageCircle, Star, CheckCircle, Crown, MapPin } from 'lucide-react';
import { Profile } from '../types';

const asset = (file: string) => `/assets/${file}`;

interface HomeLandingProps {
  onJoinNowClick: (tab?: 'register' | 'signin') => void;
  featuredProfiles: Profile[];
  userGender: 'Male' | 'Female';
  isLoggedIn?: boolean;
  currentUser?: Profile | null;
  onGoToDashboard?: () => void;
  onLogout?: () => void;
}

const featured = [
  { name: 'Sara', age: 24, city: 'Addis Ababa', image: asset('Gemini_Generated_Image_48jenf48jenf48je.png'), intent: 'Relationship' },
  { name: 'Hana', age: 26, city: 'Hawassa', image: asset('Gemini_Generated_Image_4zte6t4zte6t4zte.png'), intent: 'Dating' },
  { name: 'Maya', age: 23, city: 'Bahir Dar', image: asset('Gemini_Generated_Image_69df6669df6669df.png'), intent: 'Open Connection' },
  { name: 'Bethel', age: 22, city: 'Addis Ababa', image: asset('ChatGPT Image Jun 8, 2026, 03_15_56 PM.png'), intent: 'Casual' },
];

export default function HomeLanding({ onJoinNowClick, onGoToDashboard }: HomeLandingProps) {
  return (
    <div className="bg-[#FFFCF8] dark:bg-[#120A0E] text-gray-900 dark:text-[#FFFCF8] min-h-screen font-sans transition-colors duration-200">

      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <img src={asset('Gemini_Generated_Image_oicvomoicvomoicv.png')} alt="" className="absolute inset-0 w-full h-full object-cover object-[center_30%] pointer-events-none select-none" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1118]/90 via-[#1A1118]/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1118]/60 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold tracking-wider uppercase mb-6 animate-slide-up">
              <Crown className="h-3.5 w-3.5" />
              Ethiopia's Premium Dating Platform
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#FFFCF8] leading-[1.05] tracking-tight animate-slide-up stagger-1">
              Find Your Match
              <br />
              <span className="text-[#C9A84C]">in Ethiopia</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#EDE6D9]/80 mt-4 max-w-lg font-light tracking-wide animate-slide-up stagger-2">
              Relationship, Dating & Private Connections — trusted by thousands across Ethiopia.
            </p>
            <div className="flex flex-wrap gap-4 mt-8 animate-slide-up stagger-3">
              <button onClick={() => onJoinNowClick('register')} className="px-8 py-3.5 bg-[#8B0020] hover:bg-[#B31B3A] text-white font-bold text-sm rounded-lg shadow-xl shadow-[#8B0020]/20 transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5">
                <Heart className="h-4 w-4" />
                Create Profile
              </button>
              <button onClick={() => { const el = document.getElementById('browse-profiles'); el?.scrollIntoView({ behavior: 'smooth' }); }} className="px-8 py-3.5 border-2 border-[#C9A84C]/40 hover:border-[#C9A84C] text-[#FFFCF8] font-bold text-sm rounded-lg transition-all flex items-center gap-2 cursor-pointer">
                Browse Profiles
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-6 mt-10 animate-slide-up stagger-4">
              <div className="flex items-center gap-2 text-[#EDE6D9]/60 text-xs">
                <ShieldCheck className="h-4 w-4 text-[#C9A84C]" />
                Verified Members
              </div>
              <div className="flex items-center gap-2 text-[#EDE6D9]/60 text-xs">
                <Heart className="h-4 w-4 text-[#C9A84C]" />
                12K+ Matches
              </div>
              <div className="flex items-center gap-2 text-[#EDE6D9]/60 text-xs">
                <Users className="h-4 w-4 text-[#C9A84C]" />
                Private & Safe
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#FFFCF8] dark:bg-[#120A0E]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#8B0020] dark:text-[#C9A84C] uppercase tracking-[0.25em]">I'm Here For</span>
            <h2 className="text-3xl font-black text-[#1A1118] dark:text-[#FFFCF8] mt-2">What Are You Looking For?</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '❤️', label: 'Relationship', desc: 'Serious commitment' },
              { icon: '💕', label: 'Dating', desc: 'Explore compatibility' },
              { icon: '🤝', label: 'Open Connection', desc: 'Mutually consensual' },
              { icon: '🔥', label: 'Casual', desc: 'No strings attached' },
            ].map((item) => (
              <button key={item.label} onClick={() => onJoinNowClick('register')} className="group bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 hover:border-[#C9A84C]/50 rounded-2xl p-6 text-center transition-all cursor-pointer hover:shadow-xl hover:shadow-[#C9A84C]/5 hover:-translate-y-1">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className="text-lg font-bold text-[#1A1118] dark:text-[#FFFCF8] group-hover:text-[#8B0020] dark:group-hover:text-[#C9A84C] transition-colors">{item.label}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#F8F4ED] dark:bg-[#1A1118]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <span className="text-xs font-bold text-[#1A1118]/60 dark:text-[#FFFCF8]/50 uppercase tracking-[0.2em]">Looking For</span>
            <div className="flex gap-3">
              <button onClick={() => onJoinNowClick('register')} className="px-10 py-3.5 bg-[#1A1118] dark:bg-[#8B0020] text-[#FFFCF8] rounded-xl font-bold text-sm hover:bg-[#8B0020] dark:hover:bg-[#B31B3A] transition-all cursor-pointer shadow-lg flex items-center gap-2">
                <Users className="h-4 w-4" />
                Women
              </button>
              <button onClick={() => onJoinNowClick('register')} className="px-10 py-3.5 bg-white dark:bg-[#1A1118] border-2 border-[#EDE6D9] dark:border-[#C9A84C]/20 text-[#1A1118] dark:text-[#FFFCF8] rounded-xl font-bold text-sm hover:border-[#C9A84C] transition-all cursor-pointer flex items-center gap-2">
                <Users className="h-4 w-4" />
                Men
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="browse-profiles" className="py-20 bg-[#FFFCF8] dark:bg-[#120A0E]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-xs font-bold text-[#8B0020] dark:text-[#C9A84C] uppercase tracking-[0.25em]">Featured Members</span>
              <h2 className="text-3xl font-black text-[#1A1118] dark:text-[#FFFCF8] mt-2">Active Singles Near You</h2>
            </div>
            <button onClick={() => onJoinNowClick('register')} className="hidden sm:flex items-center gap-1 text-sm font-bold text-[#8B0020] dark:text-[#C9A84C] hover:text-[#B31B3A] dark:hover:text-[#E0C878] transition-colors cursor-pointer">
              View All <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((person, i) => (
              <div key={i} className="group bg-white dark:bg-[#1A1118] rounded-2xl overflow-hidden border border-[#EDE6D9] dark:border-[#C9A84C]/10 hover:border-[#C9A84C]/40 hover:shadow-2xl transition-all duration-500">
                <div className="relative pt-[120%] bg-gray-100 dark:bg-[#120A0E] overflow-hidden">
                  <img src={person.image} alt={person.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C9A84C]/90 text-[#1A1118]">{person.intent}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-lg font-bold">{person.name}, {person.age}</p>
                    <p className="text-xs text-white/70 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {person.city}, Ethiopia
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="bg-[#F8F4ED] dark:bg-[#120A0E] rounded-xl p-3 mb-3 relative overflow-hidden border border-[#EDE6D9] dark:border-[#C9A84C]/5">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                      <Phone className="h-3 w-3" />
                      <span className="blur-sm select-none">+251 911 234 567</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <MessageCircle className="h-3 w-3" />
                      <span className="blur-sm select-none">@telegram_handle</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F8F4ED]/80 dark:via-[#120A0E]/80 to-transparent shimmer"></div>
                  </div>
                  <button onClick={() => onJoinNowClick('register')} className="w-full py-3 bg-[#8B0020] hover:bg-[#B31B3A] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#8B0020]/10">
                    <Lock className="h-3.5 w-3.5" />
                    Unlock Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#1A1118]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-[0.25em]">Simple Pricing</span>
            <h2 className="text-3xl font-black text-[#FFFCF8] mt-2">Pay Only When You Connect</h2>
            <p className="text-[#EDE6D9]/60 mt-2 text-sm max-w-md mx-auto">No monthly fees. Just a one-time unlock per contact.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-[#FFFCF8] rounded-3xl p-8 border border-[#C9A84C]/20 shadow-2xl relative">
              <div className="absolute top-0 right-0 bg-[#C9A84C] text-[#1A1118] text-[10px] font-black px-3 py-1 rounded-bl-2xl rounded-tr-3xl uppercase tracking-wider">Popular</div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#8B0020]/10 flex items-center justify-center">
                  <Crown className="h-6 w-6 text-[#8B0020]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#1A1118]">For Men</h3>
                  <p className="text-xs text-gray-500">Full access to all women profiles</p>
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-black text-[#1A1118]">200</span>
                <span className="text-lg font-bold text-gray-500">ETB</span>
                <span className="text-xs text-gray-400 ml-2">per unlock</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                {['View phone, Telegram & Instagram', 'Verified female profiles only', 'Secure Telebirr & CBE Birr', '24/7 support', 'No subscription required'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-[#C9A84C] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => onJoinNowClick('register')} className="w-full py-3.5 bg-[#8B0020] hover:bg-[#B31B3A] text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg">
                Create Profile — Pay When Ready
              </button>
            </div>

            <div className="bg-[#FFFCF8] rounded-3xl p-8 border border-[#EDE6D9] shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#1A1118]">For Women</h3>
                  <p className="text-xs text-gray-500">Free — always</p>
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-black text-[#1A1118]">Free</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                {['Create profile for free', 'Receive unlimited messages', 'View interested men', 'Verified gentleman only', 'Privacy protected'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-[#C9A84C] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => onJoinNowClick('register')} className="w-full py-3.5 bg-[#1A1118] hover:bg-[#8B0020] text-white font-bold rounded-xl transition-all cursor-pointer">
                Join Free
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8 text-xs text-[#EDE6D9]/50">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#C9A84C]" /> Paid via Telebirr</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#C9A84C]" /> Paid via CBE Birr</span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F8F4ED] dark:bg-[#1A1118]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-[#1A1118] dark:text-[#FFFCF8]">Why Trust Whaatachi</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Lock, title: 'Private Contacts', desc: 'Your info is hidden until you choose to share' },
              { icon: ShieldCheck, title: 'Verified Profiles', desc: 'Every member is manually verified' },
              { icon: Heart, title: 'Secure Payment', desc: 'Safe Telebirr & CBE Birr transactions' },
              { icon: Users, title: 'Fake Account Removal', desc: 'Zero tolerance for spam or bots' },
            ].map((item) => (
              <div key={item.title} className="bg-white dark:bg-[#1A1118] rounded-2xl p-6 border border-[#EDE6D9] dark:border-[#C9A84C]/10 text-center hover:shadow-lg dark:hover:shadow-[#C9A84C]/5 transition-all">
                <div className="w-12 h-12 rounded-full bg-[#8B0020]/5 dark:bg-[#8B0020]/15 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-[#8B0020] dark:text-[#C9A84C]" />
                </div>
                <h3 className="text-sm font-bold text-[#1A1118] dark:text-[#FFFCF8]">{item.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
