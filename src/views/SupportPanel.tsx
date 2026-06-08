import React, { useState, useRef, useEffect } from 'react';
import { Send, ThumbsUp, ShieldCheck, Mail, HelpCircle, Phone, ArrowUpRight } from 'lucide-react';
import { SupportMessage } from '../types';

export default function SupportPanel() {
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Hello! Welcome to the Whaatachi Ethiopian Connections Help Desk. 🇪🇹 How can we assist you with profile updates, security verifications, or CBE/Telebirr transfers today?',
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

    // Simulate smart bot response based on keywords
    setTimeout(() => {
      let botText = "Thank you for reaching out! A human moderator has been assigned to your case and will complete your ticket profile within 10-15 minutes.";
      
      const text = inputVal.toLowerCase();
      if (text.includes('cbe') || text.includes('telebirr') || text.includes('payment') || text.includes('fee')) {
        botText = "Got you! If your Telebirr or CBE receipt is pending approval, please paste the matching 'Reference TxID' directly on our payment unlock card or check the Admin Queue. Double-check that you entered exactly 200Birr so the automatic tracker validates and approves unlocks.";
      } else if (text.includes('how') || text.includes('unlock') || text.includes('contact')) {
        botText = "To unlock a match details: (1) Find your match on the Discovery dashboard, (2) Hit 'Unlock Contact', (3) Transfer 200Birr to the designated CBE/Telebirr merchant accounts shown, (4) Paste the Transaction ID in step 2. You will see direct Telegram IDs in your 'Unlocked Contacts History' instantly upon validation.";
      } else if (text.includes('free') || text.includes('women') || text.includes('price')) {
        botText = "Currently, Whaatachi is 100% FREE for women who verify active identity directories. Serious men cover a lifetime connection weight transfer fee of 200 Birr to maintain premium, spam-free spaces.";
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
    <div className="bg-gray-50 dark:bg-slate-950 py-10 transition-colors duration-200" id="support-chat-hub">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Intro */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight flex items-center justify-center gap-2">
            Regional Resolution Desk
          </h1>
          <p className="text-xs text-gray-550 dark:text-slate-400 font-light max-w-md mx-auto leading-relaxed">
            Our moderation agents are online 24/7. Chat below or use direct regional contact vectors for rapid resolving of payment approvals.
          </p>
        </div>

        {/* Layout Split: Chat on Left, Contact/Safety Tips on Right */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Chat Container */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col h-[500px] shadow-3xs transition-colors">
            
            {/* Header bar */}
            <div className="bg-gradient-to-r from-pink-600 to-rose-500 px-5 py-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold">
                  W
                </div>
                <div>
                  <h4 className="text-sm font-bold">Live Support Assistant</h4>
                  <p className="text-[10px] text-pink-100 font-medium">Standard Response: &lt; 5 mins</p>
                </div>
              </div>
              <span className="bg-emerald-500/20 text-[#A7FFEB] text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-emerald-500/30">
                Online ● Active
              </span>
            </div>

            {/* Conversation Messages area */}
            <div className="grow overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-slate-950/40 scrollbar-thin">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div 
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn text-xs`}
                  >
                    <div className={`max-w-[80%] rounded-2xl p-3.5 leading-relaxed tracking-wide ${
                      isUser 
                        ? 'bg-pink-600 text-white rounded-br-none shadow-sm' 
                        : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-750 text-gray-800 dark:text-slate-100 rounded-bl-none shadow-3xs'
                    }`}>
                      <p className="font-medium">{msg.text}</p>
                      <span className={`block text-[9px] mt-1.5 text-right font-light ${
                        isUser ? 'text-pink-100' : 'text-gray-400 dark:text-slate-500'
                      }`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {typing && (
                <div className="flex justify-start animate-pulse text-xs">
                  <div className="bg-white dark:bg-slate-800 border border-gray-255 dark:border-slate-750 text-gray-550 dark:text-slate-400 rounded-2xl rounded-bl-none p-3 shadow-3xs">
                    Support Agent typing advice...
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Send input controls bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex gap-2">
              <input
                type="text"
                placeholder="Type your resolution question (e.g. CBE delay)..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="grow border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-xs outline-hidden focus:border-pink-500"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 text-white rounded-xl p-2.5 cursor-pointer shadow-3xs hover:shadow-md transition-all shrink-0"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>

          </div>

          {/* Quick info columns */}
          <div className="col-span-1 space-y-6">
            
            {/* Direct escalation channels */}
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-3xs transition-colors">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-slate-800 pb-2.5">
                Support Escapes
              </h4>
              <p className="text-[10px] text-gray-400 dark:text-slate-400 font-medium">Have a direct transfer slip dispute? Contact our direct regional managers:</p>
              
              <div className="space-y-3.5 text-xs">
                <a 
                  href="tel:+251900123456"
                  className="flex items-center gap-2.5 p-2 bg-gray-50 dark:bg-slate-850 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-950/20 transition-colors"
                >
                  <Phone className="h-4 w-4 text-emerald-650 dark:text-emerald-400" />
                  <div>
                    <p className="text-[9px] text-gray-400 dark:text-slate-500 font-bold uppercase">Call Hotlines</p>
                    <p className="font-extrabold text-gray-800 dark:text-slate-100">+251 900 123 456</p>
                  </div>
                </a>

                <a 
                  href="https://t.me/whaatachi_support"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-2 bg-gray-50 dark:bg-slate-850 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-950/20 transition-colors"
                >
                  <ArrowUpRight className="h-4 w-4 text-sky-500" />
                  <div>
                    <p className="text-[9px] text-gray-400 dark:text-slate-500 font-bold uppercase">Telegram Desk</p>
                    <p className="font-extrabold text-sky-600 dark:text-sky-400">@whaatachi_support</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Safety policy warning */}
            <div className="bg-gradient-to-t from-gray-900 to-slate-900 text-white border border-gray-800 rounded-2xl p-5 space-y-3 shadow-md">
              <span className="text-[10px] text-pink-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Anti-Scam Alert
              </span>
              <p className="text-[10px] text-gray-405 leading-relaxed font-light">
                Authentic Whaatachi PLC administrative team members will <strong>NEVER</strong> call you asking for your bank account passwords, PIN codes, or Telebirr verification OTP numbers. Keep details strictly inside secure networks.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
