import React, { useState } from 'react';
import { Search, HelpCircle, ChevronDown, ChevronUp, Mail, Phone, Sparkles } from 'lucide-react';
import { FAQS } from '../mockData';

export default function FAQSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    if (expandedIndex === id) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(id);
    }
  };

  // Filter Categories list
  const categories = ['all', ...FAQS.map(f => f.category)];

  // Accordion list matching filter & queries
  const processedFaqs = FAQS.flatMap((categoryObj) => {
    return categoryObj.items
      .filter((item) => {
        const matchesCategory = activeCategory === 'all' || categoryObj.category === activeCategory;
        const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .map((item, idx) => ({
        category: categoryObj.category,
        question: item.question,
        answer: item.answer,
        id: `${categoryObj.category}-${idx}`
      }));
  });

  return (
    <div className="bg-gray-50 dark:bg-slate-950 py-12 min-h-screen transition-colors duration-200" id="faq-view">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Intro */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/30 text-pink-700 dark:text-pink-300 text-xs font-semibold">
            <HelpCircle className="h-4 w-4 text-pink-500" />
            <span>Whaatachi Help Desk Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4.25xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">
            How Can We Assist You?
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 max-w-lg mx-auto font-light leading-relaxed">
            Search our user guide docs regarding standard safety verifications, CBE transfers, and private matching.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Type key terms (e.g. CBE, Telebirr, Refund, Verification)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 text-gray-800 dark:text-white pl-11 pr-4 py-3 rounded-2xl shadow-3xs outline-hidden focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm"
          />
        </div>

        {/* Categories selector slider */}
        <div className="flex justify-center items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-pink-600 to-rose-500 border-none text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300 hover:border-gray-305'
              }`}
            >
              {cat === 'all' ? 'All Documentation' : cat}
            </button>
          ))}
        </div>

        {/* Accordions Table list */}
        <div className="space-y-4">
          {processedFaqs.length > 0 ? (
            processedFaqs.map((faq) => {
              const isExpanded = expandedIndex === faq.id;
              return (
                <div 
                  key={faq.id}
                  className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl overflow-hidden shadow-3xs hover:border-gray-300 dark:hover:border-slate-700 transition-colors"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-gray-950 dark:text-slate-100 text-sm hover:bg-gray-50/50 dark:hover:bg-slate-850/50 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-[9px] uppercase font-extrabold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/30 rounded-sm px-1.5 py-0.5" id={`faq-${faq.id}-badge`}>
                        {faq.category.split(' ')[0]}
                      </span>
                      {faq.question}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4.5 w-4.5 text-pink-600 dark:text-pink-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4.5 w-4.5 text-gray-400 dark:text-slate-550 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs text-gray-605 dark:text-slate-350 leading-relaxed font-light border-t border-gray-50 dark:border-slate-850 bg-gray-50/30 dark:bg-slate-900/10 animate-fadeIn">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-805 rounded-2xl py-12 text-center text-gray-500 font-light text-xs">
              No matching questions found in category "{activeCategory}".
            </div>
          )}
        </div>

        {/* Support Card contact box */}
        <div className="bg-gradient-to-r from-pink-900 to-rose-900 rounded-3xl p-8 text-center text-white space-y-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#000000_25%,transparent_25%)] [background-size:10px_10px] opacity-10"></div>
          
          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-bold">Still Have Queries?</h3>
            <p className="text-xs text-pink-100 font-light leading-relaxed max-w-md mx-auto">
              Our regional Ethiopian moderation desks provide 24/7 resolution support for CBE/Telebirr transfers or profile verification tickets.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10 text-xs">
            <a
              href="mailto:support@whaatachi.com"
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-50 text-gray-950 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Mail className="h-4 w-4 text-pink-600" />
              Email Desk Team
            </a>
            <a
              href="tel:+251900123456"
              className="w-full sm:w-auto px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-pink-500/55 cursor-pointer"
            >
              <Phone className="h-4 w-4 text-emerald-300" />
              Call Support: +251 900 123 456
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
