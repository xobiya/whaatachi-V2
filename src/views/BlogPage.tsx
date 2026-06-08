import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ThumbsUp, Send, CheckCircle, Search, Sparkles } from 'lucide-react';
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

  // Extract real categories
  const categories = ['All', 'Relationship Guide', 'Safety First', 'Dating Tips'];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    const matchesText = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesText;
  });

  return (
    <div className="bg-gray-50 dark:bg-slate-950 py-12 min-h-screen transition-colors duration-200" id="blog-resources-view">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 col-span-1">
        
        {/* Intro */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/30 text-pink-700 dark:text-pink-300 text-xs font-semibold">
            <BookOpen className="h-4 w-4 text-pink-505" />
            <span>Habesha Dating & Connection Advice</span>
          </div>
          <h1 className="text-3xl sm:text-4.25xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">
            The Digital Courtship Guide
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-405 max-w-lg mx-auto font-light leading-relaxed">
            Safety tips, low-pressure coffee date checklists, and insights tailored specifically for young single professionals in metropolitan Ethiopia.
          </p>
        </div>

        {/* Search & Categories line */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 p-4 rounded-2xl shadow-3xs transition-colors">
          
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  activeCategory === cat
                    ? 'bg-pink-600 dark:bg-pink-500 border-pink-600 dark:border-pink-500 text-white'
                    : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-655 dark:text-slate-355 hover:border-gray-305'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search resource articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50/50 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-800 text-gray-800 dark:text-white border border-gray-200 dark:border-slate-700 focus:border-pink-500 font-sans rounded-xl pl-9 pr-3 py-2 text-xs outline-hidden"
            />
          </div>

        </div>

        {/* Articles Feed */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredArticles.map((article, idx) => {
              const isHeroIdx = idx === 0 && activeCategory === 'All' && searchQuery === '';
              
              return (
                <div 
                  key={article.id}
                  className={`bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl overflow-hidden shadow-3xs hover:shadow-md transition-all flex flex-col justify-between ${
                    isHeroIdx ? 'md:col-span-3 md:flex-row' : ''
                  }`}
                  id={`article-card-${article.id}`}
                >
                  {/* Picture container */}
                  <div className={`relative bg-gray-150 dark:bg-slate-800 shrink-0 ${
                    isHeroIdx ? 'h-64 md:h-auto md:w-1/2' : 'pt-[60%]'
                  }`}>
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 left-4 bg-gray-900/60 dark:bg-slate-950/75 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                      {article.category}
                    </span>
                  </div>

                  {/* Body text columns */}
                  <div className="p-6 sm:p-8 flex flex-col justify-between grow">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 animate-pulse" />
                          {article.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {article.readTime}
                        </span>
                      </div>

                      <h3 className={`font-extrabold text-gray-955 dark:text-white tracking-tight leading-tight ${
                        isHeroIdx ? 'text-2xl sm:text-3xl' : 'text-base'
                      }`}>
                        {article.title}
                      </h3>

                      <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed font-light">
                        {article.excerpt}
                      </p>

                      {isHeroIdx && article.content && (
                        <div className="text-xs text-gray-600 dark:text-slate-300 space-y-3.5 pt-2 border-t border-gray-100 dark:border-slate-800 mt-4 leading-relaxed font-light max-w-2xl">
                          <p className="font-semibold text-gray-800 dark:text-slate-100">Why Digital Verification Wins:</p>
                          <p>Dating in Ethiopia is shifting towards digital spaces. Young professionals in Addis Ababa are opting for safe platforms to verify intentions first. By verifying handles, gentlemen avoid spam boundaries and women control contact disclose coordinates comfortably.</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-slate-800 mt-6 flex justify-between items-center">
                      <span className="text-[10px] font-extrabold text-pink-600 dark:text-pink-400 uppercase tracking-widest flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-pink-500 animate-bounce" />
                        Exclusive Editorial
                      </span>
                      <button className="text-[11px] font-bold text-gray-750 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 hover:underline cursor-pointer transition-colors">
                        Read Detailed Blog
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-805 rounded-2xl py-12 text-center text-gray-500 font-light text-xs max-w-md mx-auto">
            No safety guides match your filters. Try different categories.
          </div>
        )}

        {/* Newsletter submit form card */}
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-955/10 border border-pink-100 dark:border-pink-900/35 rounded-3xl p-6 sm:p-10 max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm transition-colors">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-extrabold text-gray-955 dark:text-white text-xl leading-none">Get Safety Alerts Monthly</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed font-light">
              Receive tips on avoiding spam accounts, dating spot checks, and exclusive match alerts directly.
            </p>
          </div>

          {subscribed ? (
            <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 px-6 py-4 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-2xs shrink-0 animate-fadeIn bg-emerald-50/50 dark:bg-emerald-950/20">
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Awesome! Subscribed securely.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto shrink-0 max-w-sm">
              <input
                type="email"
                required
                placeholder="e.g. sam@example.com"
                value={subscriptionEmail}
                onChange={(e) => setSubscriptionEmail(e.target.value)}
                className="grow border border-gray-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-pink-500 bg-white dark:bg-slate-850 text-gray-800 dark:text-white min-w-0"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-gray-900 hover:bg-black dark:bg-slate-750 dark:hover:bg-slate-650 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
              >
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
