import React from 'react';
import { Heart, ShieldCheck, Crown } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
  isLoggedIn: boolean;
}

export default function Footer({ setCurrentView, isLoggedIn }: FooterProps) {
  return (
    <footer className="bg-[#1A1118] text-[#EDE6D9]/50 border-t border-[#C9A84C]/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="col-span-2 lg:col-span-1">
            <span className="flex items-center gap-2 text-lg font-black text-[#FFFCF8]">
              <div className="bg-[#8B0020] p-1 rounded-lg">
                <Heart className="h-4 w-4 text-[#C9A84C] fill-[#C9A84C]" />
              </div>
              Whaatachi
            </span>
            <p className="text-xs mt-3 leading-relaxed max-w-xs">
              Ethiopia's premium dating platform. Real people, verified profiles, private connections.
            </p>
            <div className="flex items-center gap-1.5 mt-4 text-[10px] text-[#C9A84C]/70 bg-[#C9A84C]/5 border border-[#C9A84C]/20 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span>Men pay 200 ETB — women join free</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#FFFCF8] uppercase tracking-wider mb-4">Discover</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView(isLoggedIn ? 'dashboard' : 'home')} className="hover:text-[#C9A84C] transition-colors cursor-pointer">Browse Profiles</button></li>
              <li><button onClick={() => setCurrentView('stories')} className="hover:text-[#C9A84C] transition-colors cursor-pointer">Success Stories</button></li>
              <li><button onClick={() => setCurrentView('faq')} className="hover:text-[#C9A84C] transition-colors cursor-pointer">How It Works</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#FFFCF8] uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('support')} className="hover:text-[#C9A84C] transition-colors cursor-pointer">Help Center</button></li>
              <li><button onClick={() => setCurrentView('faq')} className="hover:text-[#C9A84C] transition-colors cursor-pointer">FAQ</button></li>
              <li><span className="cursor-default">support@whaatachi.com</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#FFFCF8] uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="cursor-default hover:text-[#C9A84C] transition-colors">Privacy Policy</span></li>
              <li><span className="cursor-default hover:text-[#C9A84C] transition-colors">Terms of Use</span></li>
              <li><span className="cursor-default hover:text-[#C9A84C] transition-colors">Safety Guidelines</span></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-[#C9A84C]/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#EDE6D9]/30 gap-3">
          <p>© {new Date().getFullYear()} Whaatachi. All rights reserved.</p>
          <span className="flex items-center gap-1.5">
            <Crown className="h-3 w-3 text-[#C9A84C]" />
            Premium Ethiopian Dating
          </span>
        </div>
      </div>
    </footer>
  );
}
