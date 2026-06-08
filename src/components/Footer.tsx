import React from 'react';
import { Heart, Mail, Phone, ShieldCheck, HelpCircle } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
  isLoggedIn: boolean;
}

export default function Footer({ setCurrentView, isLoggedIn }: FooterProps) {
  return (
    <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-900 mt-auto" id="app-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Slogan */}
          <div className="space-y-4 md:col-span-1">
            <span className="flex items-center gap-2 text-xl font-bold text-white">
              <div className="bg-pink-900/40 p-1.5 rounded-full text-pink-400">
                <Heart className="h-5 w-5 fill-pink-500 text-pink-500" />
              </div>
              Whaatachi
            </span>
            <p className="text-xs text-gray-500 leading-relaxed">
              Ethiopia's safest, highest-integrity community platform for discovering true relationships, authentic friendships, and local connections. Built for Addis, Hawassa, Adama, & beyond.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-pink-400 bg-pink-950/40 border border-pink-900/30 p-2 rounded-lg">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Men undergo secure CBE/Telebirr fee verification to ensure zero spam.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">Discovery</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => setCurrentView(isLoggedIn ? 'dashboard' : 'home')} 
                  className="hover:text-pink-400 transition-colors cursor-pointer text-left"
                >
                  Hot Match Boards
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('dashboard')} 
                  className="hover:text-pink-400 transition-colors cursor-pointer text-left"
                >
                  Locate Verified Members
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('stories')} 
                  className="hover:text-pink-400 transition-colors cursor-pointer text-left"
                >
                  Love Found: Success Stories
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('blog')} 
                  className="hover:text-pink-400 transition-colors cursor-pointer text-left"
                >
                  Safety Blogs & Advices
                </button>
              </li>
            </ul>
          </div>

          {/* Support Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">Safety & Policy</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => setCurrentView('faq')} 
                  className="hover:text-pink-400 transition-colors cursor-pointer text-left"
                >
                  How Verification Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('faq')} 
                  className="hover:text-pink-400 transition-colors cursor-pointer text-left"
                >
                  Pricing & 200 ETB Fee
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('support')} 
                  className="hover:text-pink-400 transition-colors cursor-pointer text-left inline-flex items-center gap-1"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-sky-400" />
                  Live Help & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Contact Support</h3>
            <p className="text-xs text-gray-500">Need help with CBE/Telebirr transfers or approval delays?</p>
            <div className="space-y-2 text-xs">
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-500" />
                <span>+251 900 123 456</span>
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>support@whaatachi.com</span>
              </span>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-900 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-600 gap-4">
          <p>© {new Date().getFullYear()} Whaatachi Ethiopia. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-gray-500 transition-colors cursor-pointer text-left">Terms of Use</span>
            <span>•</span>
            <span className="hover:text-gray-500 transition-colors cursor-pointer text-left">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-gray-500 transition-colors cursor-pointer text-left">Safety Guidelines</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
