import React from 'react';
import { Heart, ShieldCheck, Crown } from 'lucide-react';
import { useUIContext } from '../context/UIContext';

interface FooterProps {
  setCurrentView: (view: string) => void;
  isLoggedIn: boolean;
}

export default function Footer({ setCurrentView, isLoggedIn }: FooterProps) {
  const { t } = useUIContext();
  return (
    <footer className="bg-[#1A1118] text-[#EDE6D9]/50 border-t border-[#C9A84C]/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="col-span-2 lg:col-span-1">
            <span className="flex items-center gap-2">
              <img src="/assets/logos.png" alt="Whaatachi" className="h-8 w-auto" />
            </span>
            <p className="text-xs mt-3 leading-relaxed max-w-xs">
              {t('footer.desc')}
            </p>
            <div className="flex items-center gap-1.5 mt-4 text-[10px] text-[#EB317A]/70 bg-[#EB317A]/5 border border-[#EB317A]/20 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span>{t('footer.safety')}</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#FFFCF8] uppercase tracking-wider mb-4">{t('footer.discover')}</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('faq')} className="hover:text-[#C9A84C] transition-colors cursor-pointer">{t('footer.how-it-works')}</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#FFFCF8] uppercase tracking-wider mb-4">{t('footer.support')}</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('support')} className="hover:text-[#C9A84C] transition-colors cursor-pointer">{t('footer.help-center')}</button></li>
              <li><button onClick={() => setCurrentView('faq')} className="hover:text-[#C9A84C] transition-colors cursor-pointer">{t('footer.faq')}</button></li>
              <li><span className="cursor-default">support@whaatachi.com</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#FFFCF8] uppercase tracking-wider mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="cursor-default hover:text-[#C9A84C] transition-colors">{t('footer.privacy')}</span></li>
              <li><span className="cursor-default hover:text-[#C9A84C] transition-colors">{t('footer.terms')}</span></li>
              <li><span className="cursor-default hover:text-[#C9A84C] transition-colors">{t('footer.safety')}</span></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-[#C9A84C]/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#EDE6D9]/30 gap-3">
          <p>© {new Date().getFullYear()} Whaatachi. {t('footer.copyright')}</p>
          <span className="flex items-center gap-1.5">
            <Crown className="h-3 w-3 text-[#C9A84C]" />
            {t('footer.badge')}
          </span>
        </div>
      </div>
    </footer>
  );
}
