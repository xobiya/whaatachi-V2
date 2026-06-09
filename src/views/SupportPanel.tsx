import React, { useState, useRef, useEffect } from 'react';
import { Send, ShieldCheck, Mail, Phone, ArrowUpRight } from 'lucide-react';
import { SupportMessage } from '../types';
import { useAppContext } from '../context/AppContext';

export default function SupportPanel() {
  const { t } = useAppContext();
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Hello! Welcome to Whaatachi Help Desk. 🇪🇹 How can we assist with profile updates, security verifications, or CBE/Telebirr transfers today?',
      timestamp: new Date()
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: SupportMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: inputVal,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setTyping(true);

    setTimeout(() => {
      let botText = "Thank you! A moderator has been assigned to your case and will respond within 10-15 minutes.";

      const text = inputVal.toLowerCase();
      if (text.includes('cbe') || text.includes('telebirr') || text.includes('payment') || text.includes('fee')) {
        botText = "Got you! If your approval is pending, check the Unlock History page. For any issues, contact our support team directly.";
      } else if (text.includes('unlock') || text.includes('contact')) {
        botText = "To unlock a match: (1) Find your match, (2) Hit 'Unlock Contact', (3) Submit your details. You'll see their contact info in 'Unlocked History' instantly.";
      } else if (text.includes('free') || text.includes('women') || text.includes('price')) {
        botText = "Whaatachi is 100% FREE for everyone. Just create your profile and start connecting with verified members.";
      }

      const botMsg: SupportMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: botText,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 1500);
  };

  return (
    <div className="bg-[#FFFCF8] dark:bg-[#120A0E] py-10 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold text-[#1A1118] dark:text-[#FFFCF8] tracking-tight flex items-center justify-center gap-2">
            {t('support.title')}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-light max-w-md mx-auto leading-relaxed">
            {t('support.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

          <div className="md:col-span-2 bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-3xl overflow-hidden flex flex-col h-[500px] shadow-sm transition-colors">

            <div className="bg-[#EB317A] px-5 py-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold">W</div>
                <div>
                  <h4 className="text-sm font-bold">{t('support.live')}</h4>
                  <p className="text-[10px] text-[#FAD0E8] font-medium">{t('support.response-time')}</p>
                </div>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-emerald-500/30">
                {t('support.online')}
              </span>
            </div>

            <div className="grow overflow-y-auto p-4 space-y-4 bg-[#F8F4ED]/50 dark:bg-[#120A0E]/40 scrollbar-thin">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in text-xs`}>
                    <div className={`max-w-[80%] rounded-2xl p-3.5 leading-relaxed tracking-wide ${
                      isUser
                        ? 'bg-[#EB317A] text-white rounded-br-none shadow-sm'
                        : 'bg-white dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 text-gray-800 dark:text-[#FFFCF8] rounded-bl-none shadow-sm'
                    }`}>
                      <p className="font-medium">{msg.text}</p>
                      <span className={`block text-[9px] mt-1.5 text-right font-light ${isUser ? 'text-[#FAD0E8]' : 'text-gray-400 dark:text-gray-500'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {typing && (
                <div className="flex justify-start animate-pulse text-xs">
                  <div className="bg-white dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 text-gray-500 dark:text-gray-400 rounded-2xl rounded-bl-none p-3 shadow-sm">
                    {t('support.typing')}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-[#EDE6D9] dark:border-[#C9A84C]/10 bg-white dark:bg-[#1A1118] shrink-0 flex gap-2">
              <input type="text" placeholder={t('support.input-placeholder')} value={inputVal} onChange={(e) => setInputVal(e.target.value)} className="grow border border-[#EDE6D9] dark:border-[#C9A84C]/15 bg-white dark:bg-[#120A0E] text-gray-800 dark:text-[#FFFCF8] rounded-xl px-4 py-2.5 text-xs outline-hidden focus:border-[#EB317A] dark:focus:border-[#C9A84C]" />
              <button type="submit" className="bg-[#EB317A] hover:bg-[#F04B8E] text-white rounded-xl p-2.5 cursor-pointer transition-all shrink-0">
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>

          <div className="col-span-1 space-y-6">
            <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl p-5 space-y-4 shadow-sm transition-colors">
              <h4 className="text-xs font-bold text-[#1A1118] dark:text-[#FFFCF8] uppercase tracking-wider border-b border-[#EDE6D9] dark:border-[#C9A84C]/10 pb-2.5">
                {t('support.direct-contact')}
              </h4>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{t('support.contact-desc')}</p>

              <div className="space-y-3.5 text-xs">
                <a href="tel:+251900123456" className="flex items-center gap-2.5 p-2 bg-[#F8F4ED] dark:bg-[#120A0E] rounded-xl hover:bg-[#EB317A]/5 dark:hover:bg-[#EB317A]/10 transition-colors">
                  <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase">{t('support.call')}</p>
                    <p className="font-extrabold text-gray-800 dark:text-[#FFFCF8]">+251 900 123 456</p>
                  </div>
                </a>

                <a href="https://t.me/whaatachi_support" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 p-2 bg-[#F8F4ED] dark:bg-[#120A0E] rounded-xl hover:bg-sky-50 dark:hover:bg-sky-900/10 transition-colors">
                  <ArrowUpRight className="h-4 w-4 text-sky-500" />
                  <div>
                    <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase">{t('support.telegram')}</p>
                    <p className="font-extrabold text-sky-600 dark:text-sky-400">@whaatachi_support</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-[#1A1118] text-white border border-[#C9A84C]/10 rounded-2xl p-5 space-y-3 shadow-md">
              <span className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                {t('support.anti-scam')}
              </span>
              <p className="text-[10px] text-[#EDE6D9]/70 leading-relaxed font-light">
                {t('support.anti-scam-desc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
