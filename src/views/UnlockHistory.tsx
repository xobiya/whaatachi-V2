import React from 'react';
import { Eye, Heart, Sparkles, Phone, MessageCircle, ArrowLeft, ShieldCheck, Mail } from 'lucide-react';
import { Profile } from '../types';

interface UnlockHistoryProps {
  unlockedProfiles: Profile[];
  onBackToFinder: () => void;
}

export default function UnlockHistory({ unlockedProfiles, onBackToFinder }: UnlockHistoryProps) {
  return (
    <div className="bg-gray-50 dark:bg-slate-950 py-12 min-h-screen transition-colors duration-200" id="history-unlocked-view">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 col-span-1">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-pink-500 fill-pink-500/10" />
              Unlocked Connections Vault
            </h1>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              Here is your history of unlocked profiles. Call or chat with them directly on secure networks.
            </p>
          </div>

          <button
            onClick={onBackToFinder}
            className="px-4 py-2 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-gray-700 dark:text-slate-200 shadow-3xs cursor-pointer transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Match Finder
          </button>
        </div>

        {/* List Grid */}
        {unlockedProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlockedProfiles.map((profile) => (
              <div 
                key={profile.id}
                className="bg-white dark:bg-slate-900 border border-gray-205 dark:border-slate-800 hover:border-emerald-250 dark:hover:border-emerald-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                id={`unlocked-card-${profile.id}`}
              >
                <div>
                  {/* Photo row */}
                  <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100 dark:border-slate-800">
                    <img 
                      src={profile.image} 
                      alt={profile.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500/25"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="font-bold text-gray-950 dark:text-white text-base flex items-center gap-1">
                        {profile.name}
                        {profile.verified && <ShieldCheck className="h-4 w-4 text-amber-500 fill-amber-50 dark:fill-amber-950/20" title="Verified Member" />}
                      </h3>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 px-1.5 py-0.5 rounded-sm inline-block mt-0.5">
                        {profile.relationshipIntent}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 font-medium mt-1">
                        {profile.age} yrs • {profile.city}
                      </p>
                    </div>
                  </div>

                  {/* Contact cards */}
                  <div className="py-4 space-y-2.5">
                    <p className="text-xs font-semibold text-gray-700 dark:text-slate-350 uppercase tracking-wider">Direct Contacts:</p>
                    
                    {/* Phone Row */}
                    <a 
                      href={`tel:${profile.contactInfo.phone}`}
                      className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-slate-850 hover:bg-emerald-50 dark:hover:bg-emerald-950/10 border border-gray-150 dark:border-slate-750 rounded-xl text-xs text-gray-805 dark:text-slate-205 transition-colors cursor-pointer group"
                    >
                      <div className="bg-emerald-100 dark:bg-emerald-905/30 text-emerald-700 dark:text-emerald-400 p-2 rounded-lg shrink-0 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/40 transition-colors">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">Phone Number</p>
                        <p className="font-bold text-gray-800 dark:text-slate-200 mt-0.5">{profile.contactInfo.phone}</p>
                      </div>
                    </a>

                    {/* Telegram Row */}
                    <a 
                      href={`https://t.me/${profile.contactInfo.telegram.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-slate-850 hover:bg-sky-50 dark:hover:bg-sky-950/10 border border-gray-150 dark:border-slate-750 rounded-xl text-xs text-gray-805 dark:text-slate-205 transition-colors cursor-pointer group"
                    >
                      <div className="bg-sky-100 dark:bg-sky-905/30 text-sky-700 dark:text-sky-400 p-2 rounded-lg shrink-0 group-hover:bg-sky-200 dark:group-hover:bg-sky-900/40 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">Telegram Username</p>
                        <p className="font-bold text-sky-600 dark:text-sky-400 mt-0.5">{profile.contactInfo.telegram}</p>
                      </div>
                    </a>

                    {/* Email Row */}
                    <a 
                      href={`mailto:${profile.contactInfo.email}`}
                      className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-slate-850 hover:bg-pink-50 dark:hover:bg-pink-950/10 border border-gray-150 dark:border-slate-750 rounded-xl text-xs text-gray-805 dark:text-slate-205 transition-colors cursor-pointer group"
                    >
                      <div className="bg-pink-100 dark:bg-pink-905/30 text-pink-700 dark:text-pink-400 p-2 rounded-lg shrink-0 group-hover:bg-pink-200 dark:group-hover:bg-pink-900/40 transition-colors font-medium">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">Email Address</p>
                        <p className="font-bold text-gray-800 dark:text-slate-200 truncate max-w-[130px] sm:max-w-none mt-0.5">{profile.contactInfo.email}</p>
                      </div>
                    </a>

                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-slate-800 pt-3 flex items-center justify-between text-[11px] text-gray-400 dark:text-slate-500">
                  <span>Unlocked Lifetime Access</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">● Secure Connection</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl py-20 px-4 text-center max-w-xl mx-auto space-y-6 shadow-xs">
            <div className="bg-pink-50 dark:bg-pink-950/40 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto text-pink-600 dark:text-pink-400 border border-pink-100 dark:border-pink-900/30">
              <Eye className="h-10 w-10 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-extrabold text-gray-955 dark:text-white text-xl">Your Vault is Empty</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-light max-w-sm mx-auto leading-relaxed">
                Connect with candidates and verify CBE or Telebirr receipts to instantly reveal direct contact networks here.
              </p>
            </div>

            <button
              onClick={onBackToFinder}
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg hover:from-pink-700 transition-all cursor-pointer"
            >
              Start Discovering Connections
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
