import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, Send, CheckCircle, Search, Sparkles } from 'lucide-react';
import { Article } from '../types';

interface BlogPageProps {
  articles: Article[];
}

export default function BlogPage({ articles }: BlogPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [subscriptionEmail, setSubscriptionEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriptionEmail.trim()) return;
    setSubscribed(true);
    setSubscriptionEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  const categories = ['All', 'Relationship Guide', 'Safety First', 'Dating Tips'];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    const matchesText = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesText;
  });

  return (
    <div className="bg-[#FFFCF8] dark:bg-[#120A0E] py-12 min-h-screen transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B0020]/5 dark:bg-[#8B0020]/15 border border-[#8B0020]/20 dark:border-[#C9A84C]/30 text-[#8B0020] dark:text-[#C9A84C] text-xs font-semibold">
            <BookOpen className="h-4 w-4 text-[#C9A84C]" />
            <span>Dating Advice & Safety Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1118] dark:text-[#FFFCF8] tracking-tight leading-none">
            The Digital Courtship Guide
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-light leading-relaxed">
            Safety tips, coffee date checklists, and insights for young professionals in Ethiopia.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 p-4 rounded-2xl shadow-sm transition-colors">

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-[#8B0020] border-[#8B0020] text-white'
                  : 'bg-white dark:bg-[#1A1118] border-[#EDE6D9] dark:border-[#C9A84C]/15 text-gray-600 dark:text-gray-400 hover:border-gray-300'
              }`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search articles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#F8F4ED]/50 dark:bg-[#120A0E] hover:bg-white dark:hover:bg-[#1A1118] text-gray-800 dark:text-[#FFFCF8] border border-[#EDE6D9] dark:border-[#C9A84C]/15 focus:border-[#8B0020] dark:focus:border-[#C9A84C] rounded-xl pl-9 pr-3 py-2 text-xs outline-hidden" />
          </div>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredArticles.map((article, idx) => {
              const isHeroIdx = idx === 0 && activeCategory === 'All' && searchQuery === '';

              return (
                <div key={article.id} className={`bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                  isHeroIdx ? 'md:col-span-3 md:flex-row' : ''
                }`}>
                  <div className={`relative bg-[#EDE6D9] dark:bg-[#1A1118] shrink-0 ${
                    isHeroIdx ? 'h-64 md:h-auto md:w-1/2' : 'pt-[60%]'
                  }`}>
                    <img src={article.image} alt={article.title} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <span className="absolute top-4 left-4 bg-[#1A1118]/70 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                      {article.category}
                    </span>
                  </div>

                  <div className="p-6 sm:p-8 flex flex-col justify-between grow">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {article.date}
                        </span>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {article.readTime}
                        </span>
                      </div>

                      <h3 className={`font-extrabold text-[#1A1118] dark:text-[#FFFCF8] tracking-tight leading-tight ${
                        isHeroIdx ? 'text-2xl sm:text-3xl' : 'text-base'
                      }`}>
                        {article.title}
                      </h3>

                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                        {article.excerpt}
                      </p>

                      {isHeroIdx && article.content && (
                        <div className="text-xs text-gray-600 dark:text-gray-300 space-y-3.5 pt-2 border-t border-[#EDE6D9] dark:border-[#C9A84C]/10 mt-4 leading-relaxed font-light max-w-2xl">
                          <p className="font-semibold text-gray-800 dark:text-[#FFFCF8]">Why Digital Verification Matters:</p>
                          <p>Dating in Ethiopia is shifting online. Young professionals in Addis Ababa are choosing secure platforms to verify intentions first, avoiding spam and protecting privacy.</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#EDE6D9] dark:border-[#C9A84C]/10 mt-6 flex justify-between items-center">
                      <span className="text-[10px] font-extrabold text-[#8B0020] dark:text-[#C9A84C] uppercase tracking-widest flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-[#C9A84C]" />
                        Editorial
                      </span>
                      <button className="text-[11px] font-bold text-gray-500 dark:text-gray-400 hover:text-[#8B0020] dark:hover:text-[#C9A84C] hover:underline cursor-pointer transition-colors">
                        Read Full Article
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl py-12 text-center text-gray-500 dark:text-gray-400 font-light text-xs max-w-md mx-auto">
            No articles match your filters. Try different categories.
          </div>
        )}

        <div className="bg-[#F8F4ED] dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-3xl p-6 sm:p-10 max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm transition-colors">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-extrabold text-[#1A1118] dark:text-[#FFFCF8] text-xl leading-none">Get Safety Alerts Monthly</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-light">
              Receive tips on avoiding spam, dating spot checks, and exclusive match alerts.
            </p>
          </div>

          {subscribed ? (
            <div className="bg-white dark:bg-[#120A0E] border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 px-6 py-4 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Subscribed!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto shrink-0 max-w-sm">
              <input type="email" required placeholder="e.g. sam@example.com" value={subscriptionEmail} onChange={(e) => setSubscriptionEmail(e.target.value)} className="grow border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-[#8B0020] dark:focus:border-[#C9A84C] bg-white dark:bg-[#120A0E] text-gray-800 dark:text-[#FFFCF8] min-w-0" />
              <button type="submit" className="px-4 py-2.5 bg-[#8B0020] hover:bg-[#B31B3A] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                <Send className="h-3.5 w-3.5" />
                <span>Subscribe</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
