import React, { useState } from 'react';
import { Search, HelpCircle, ChevronDown, ChevronUp, Mail, Phone, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { FAQS } from '../mockData';

export default function FAQSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);
  const { t } = useAppContext();

  const toggleAccordion = (id: string) => {
    if (expandedIndex === id) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(id);
    }
  };

  const categories = ['all', ...FAQS.map(f => f.category)];

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
    <div className="bg-[#FFFCF8] dark:bg-[#120A0E] py-12 min-h-screen transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EB317A]/5 dark:bg-[#EB317A]/15 border border-[#EB317A]/20 dark:border-[#C9A84C]/30 text-[#EB317A] dark:text-[#C9A84C] text-xs font-semibold">
            <HelpCircle className="h-4 w-4 text-[#C9A84C]" />
            <span>Whaatachi Help Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1118] dark:text-[#FFFCF8] tracking-tight leading-none">
            {t('faq.title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-light leading-relaxed">
            {t('faq.desc')}
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <input type="text" placeholder={t('faq.search-placeholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/15 text-gray-800 dark:text-[#FFFCF8] pl-11 pr-4 py-3 rounded-2xl shadow-sm outline-hidden focus:border-[#EB317A] dark:focus:border-[#C9A84C] focus:ring-1 focus:ring-[#EB317A]/20 dark:focus:ring-[#C9A84C]/20 text-sm" />
        </div>

        <div className="flex justify-center items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border ${
              activeCategory === cat
                ? 'bg-[#EB317A] border-[#EB317A] text-white shadow-sm'
                : 'bg-white dark:bg-[#1A1118] border-[#EDE6D9] dark:border-[#C9A84C]/15 text-gray-600 dark:text-gray-400 hover:border-gray-300'
            }`}>
              {cat === 'all' ? t('faq.all-topics') : cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {processedFaqs.length > 0 ? (
            processedFaqs.map((faq) => {
              const isExpanded = expandedIndex === faq.id;
              return (
                <div key={faq.id} className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl overflow-hidden shadow-sm hover:border-gray-300 dark:hover:border-[#C9A84C]/30 transition-colors">
                  <button onClick={() => toggleAccordion(faq.id)} className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-[#1A1118] dark:text-[#FFFCF8] text-sm hover:bg-[#F8F4ED]/50 dark:hover:bg-[#120A0E]/50 cursor-pointer transition-colors">
                    <span className="flex items-center gap-2.5">
                      <span className="text-[9px] uppercase font-extrabold text-[#EB317A] dark:text-[#C9A84C] bg-[#EB317A]/5 dark:bg-[#EB317A]/15 border border-[#EB317A]/20 dark:border-[#C9A84C]/30 rounded-sm px-1.5 py-0.5">
                        {faq.category.split(' ')[0]}
                      </span>
                      {faq.question}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4.5 w-4.5 text-[#EB317A] dark:text-[#C9A84C] shrink-0" />
                    ) : (
                      <ChevronDown className="h-4.5 w-4.5 text-gray-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-light border-t border-[#EDE6D9] dark:border-[#C9A84C]/10 bg-[#F8F4ED]/30 dark:bg-[#120A0E]/50">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-2xl py-12 text-center text-gray-500 dark:text-gray-400 font-light text-xs">
              {t('faq.no-results')}
            </div>
          )}
        </div>

        <div className="bg-[#1A1118] rounded-3xl p-8 text-center text-white space-y-6 shadow-md relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-bold">{t('faq.cta-title')}</h3>
            <p className="text-xs text-[#EDE6D9]/70 font-light leading-relaxed max-w-md mx-auto">
              {t('faq.cta-desc')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10 text-xs">
            <a href="mailto:support@whaatachi.com" className="w-full sm:w-auto px-6 py-3 bg-[#EB317A] hover:bg-[#F04B8E] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
              <Mail className="h-4 w-4 text-[#C9A84C]" />
              {t('faq.email-support')}
            </a>
            <a href="tel:+251900123456" className="w-full sm:w-auto px-6 py-3 bg-[#C9A84C] hover:bg-[#E0C878] text-[#1A1118] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
              <Phone className="h-4 w-4" />
              {t('faq.call').replace('{number}', '+251 900 123 456')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
