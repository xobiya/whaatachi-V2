import React, { useState, useEffect } from 'react';
import { Search, HelpCircle, ChevronDown, ChevronUp, Mail, Phone, Sparkles } from 'lucide-react';
import { useUIContext } from '../context/UIContext';
import { fetchFaqs } from '../services/api';

export default function FAQSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<Record<string, { question: string; answer: string }[]>>({});
  const { t } = useUIContext();

  useEffect(() => {
    fetchFaqs().then(res => setFaqs(res.faqs)).catch(() => {});
  }, []);

  const toggleAccordion = (id: string) => {
    if (expandedIndex === id) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(id);
    }
  };

  const categories = ['all', ...Object.keys(faqs)];

  const processedFaqs = Object.entries(faqs).flatMap(([category, items]) => {
    return items
      .filter((item) => {
        const matchesCategory = activeCategory === 'all' || category === activeCategory;
        const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .map((item, idx) => ({
        category,
        ...item,
        id: `${category}-${idx}`,
      }));
  });

  return (
    <div className="bg-[#FFFCF8] dark:bg-[#120A0E] py-8 sm:py-12 min-h-screen transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EB317A]/5 dark:bg-[#EB317A]/15 border border-[#EB317A]/20 dark:border-[#C9A84C]/30 text-[#EB317A] dark:text-[#C9A84C] text-xs font-semibold tracking-wide uppercase">
            <HelpCircle className="h-4 w-4 text-[#C9A84C]" />
            <span>{t('faq.title')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1118] dark:text-[#FFFCF8] font-display">
            {t('faq.heading')}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            {t('faq.subtitle')}
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('faq.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A1118]/60 text-gray-800 dark:text-[#FFFCF8] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EB317A]/30 transition-all"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map(cat => {
            const isActive = cat === activeCategory;
            const label = cat === 'all' ? t('faq.all') : cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-[#EB317A] text-white shadow-md'
                    : 'bg-gray-100 dark:bg-[#1A1118]/40 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-[#2A1A22]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* FAQs accordion */}
        {processedFaqs.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">{t('faq.noResults')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {processedFaqs.map((faq) => {
              const isExpanded = expandedIndex === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A1118]/40 overflow-hidden transition-all duration-200 hover:shadow-sm"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left focus:outline-none"
                  >
                    <span className="text-sm font-semibold text-gray-800 dark:text-[#FFFCF8] pr-4">{faq.question}</span>
                    <span className={`shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-700/50 pt-3">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-[#FFF8F0] to-[#F8F4ED] dark:from-[#1A1118]/60 dark:to-[#120A0E] border border-[#C9A84C]/20 dark:border-[#C9A84C]/10 text-center space-y-4">
          <div className="flex justify-center gap-4">
            <div className="bg-[#EB317A]/10 p-3 rounded-full">
              <Mail className="h-5 w-5 text-[#EB317A]" />
            </div>
            <div className="bg-[#EB317A]/10 p-3 rounded-full">
              <Phone className="h-5 w-5 text-[#EB317A]" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {t('faq.contactDescription')}
          </p>
          <a
            href="mailto:support@whaatachi.com"
            className="inline-block px-6 py-2.5 bg-[#EB317A] text-white text-sm font-bold rounded-xl hover:bg-[#d6296b] transition-colors shadow-md"
          >
            {t('faq.contactButton')}
          </a>
        </div>

      </div>
    </div>
  );
}
