import React, { useState } from 'react';
import { Heart, Sparkles, ThumbsUp, CheckSquare, Star } from 'lucide-react';
import { SuccessStory } from '../types';

interface SuccessStoriesProps {
  stories: SuccessStory[];
  onAddStory: (coupleNames: string, story: string, year: string, image: string) => void;
}

export default function SuccessStories({ stories, onAddStory }: SuccessStoriesProps) {
  const [coupleNames, setCoupleNames] = useState('');
  const [story, setStory] = useState('');
  const [year, setYear] = useState('2026');
  const [selectedPresetImage, setSelectedPresetImage] = useState('https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80');
  const [submitted, setSubmitted] = useState(false);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});

  const handleLike = (storyId: string) => {
    setLikesCount(prev => ({
      ...prev,
      [storyId]: (prev[storyId] || 0) + 1
    }));
  };

  const imagePresets = [
    { label: 'Couple 1', url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80' },
    { label: 'Couple 2', url: 'https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?w=600&auto=format&fit=crop&q=80' },
    { label: 'Couple 3', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80' }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupleNames.trim() || !story.trim()) return;

    onAddStory(coupleNames, story, year, selectedPresetImage);
    setCoupleNames('');
    setStory('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="bg-[#FFFCF8] dark:bg-[#120A0E] py-12 min-h-screen transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B0020]/5 dark:bg-[#8B0020]/15 border border-[#8B0020]/20 dark:border-[#C9A84C]/30 text-[#8B0020] dark:text-[#C9A84C] text-xs font-semibold">
            <Heart className="h-4 w-4 text-[#C9A84C] fill-[#C9A84C]" />
            <span>Success Stories</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1118] dark:text-[#FFFCF8] tracking-tight leading-none">
            Love Found Its Way
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-light leading-relaxed">
            Real couples who found each other through Whaatachi's secure network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map((storyItem) => (
            <div key={storyItem.id} className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-2/5 h-48 sm:h-auto shrink-0 bg-[#EDE6D9] dark:bg-[#1A1118]">
                <img src={storyItem.image} alt={storyItem.coupleNames} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                <span className="absolute top-3 left-3 bg-[#8B0020] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Joined {storyItem.year}
                </span>
              </div>

              <div className="p-6 flex flex-col justify-between grow">
                <div className="space-y-3">
                  <h3 className="font-extrabold text-[#1A1118] dark:text-[#FFFCF8] text-lg flex items-center gap-1.5">
                    {storyItem.coupleNames}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-light italic">
                    "{storyItem.story}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EDE6D9] dark:border-[#C9A84C]/10 mt-4 flex items-center justify-between">
                  <button onClick={() => handleLike(storyItem.id)} className="flex items-center gap-1.5 text-xs text-[#8B0020] dark:text-[#C9A84C] font-bold bg-[#8B0020]/5 dark:bg-[#8B0020]/15 border border-[#8B0020]/20 dark:border-[#C9A84C]/30 hover:bg-[#8B0020]/10 dark:hover:bg-[#8B0020]/25 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Like ({likesCount[storyItem.id] || 0})</span>
                  </button>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                    Verified Match
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto shadow-sm">
          <div className="text-center mb-8 space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#1A1118] dark:text-[#FFFCF8]">Share Your Story</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-light">Did you meet on Whaatachi? Share your journey!</p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-2xl p-6 text-center space-y-3 animate-fade-in">
              <CheckSquare className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h4 className="font-bold text-lg">Story Submitted!</h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed">Thank you for sharing! Your story is now live.</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase">Couple Names</label>
                  <input type="text" required placeholder="e.g. Selam & Dawit" value={coupleNames} onChange={(e) => setCoupleNames(e.target.value)} className="w-full border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl p-3 bg-[#F8F4ED]/50 dark:bg-[#120A0E] text-gray-800 dark:text-[#FFFCF8] text-xs" />
                </div>
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase">Year Met</label>
                  <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl p-3 bg-[#F8F4ED]/50 dark:bg-[#120A0E] text-gray-800 dark:text-[#FFFCF8] text-xs">
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase">Your Love Story</label>
                <textarea rows={4} required placeholder="How did you connect? Where was your first date?" value={story} onChange={(e) => setStory(e.target.value)} className="w-full border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl p-3 bg-[#F8F4ED]/50 dark:bg-[#120A0E] text-gray-800 dark:text-[#FFFCF8] text-xs leading-relaxed" />
              </div>

              <div className="space-y-2 text-xs">
                <label className="font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase">Select Photo</label>
                <div className="grid grid-cols-3 gap-3">
                  {imagePresets.map((preset, idx) => {
                    const isSelected = selectedPresetImage === preset.url;
                    return (
                      <button type="button" key={idx} onClick={() => setSelectedPresetImage(preset.url)} className={`relative rounded-xl overflow-hidden pt-[60%] border-2 cursor-pointer transition-all ${
                        isSelected ? 'border-[#8B0020] dark:border-[#C9A84C] scale-95 ring-2 ring-[#8B0020]/30 dark:ring-[#C9A84C]/30' : 'border-[#EDE6D9] dark:border-[#C9A84C]/10 opacity-60'
                      }`}>
                        <img src={preset.url} alt={preset.label} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <button type="submit" className="w-full py-3.5 bg-[#8B0020] hover:bg-[#B31B3A] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2">
                <Star className="h-4 w-4 text-[#C9A84C]" />
                Publish Story
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
