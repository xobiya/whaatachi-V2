import React, { useState } from 'react';
import { Heart, Sparkles, Image, ThumbsUp, CheckSquare, MessageCircle, Star } from 'lucide-react';
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
    { label: 'Happy Couple 1', url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80' },
    { label: 'Sunset Handhold 2', url: 'https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?w=600&auto=format&fit=crop&q=80' },
    { label: 'Lake Walk Couple 3', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80' }
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
    <div className="bg-gray-50 dark:bg-slate-950 py-12 min-h-screen transition-colors duration-200" id="success-stories-view">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title Heading */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/30 text-pink-700 dark:text-pink-300 text-xs font-semibold">
            <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
            <span>Success Stories</span>
          </div>
          <h1 className="text-3xl sm:text-4.25xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">
            Love Found Its Way
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 max-w-lg mx-auto font-light leading-relaxed">
            Read heartwarming stories of Habesha couples who discovered their destiny through Whaatachi’s secure verification network.
          </p>
        </div>

        {/* Stories list bento columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map((storyItem) => (
            <div 
              key={storyItem.id}
              className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row"
              id={`story-card-${storyItem.id}`}
            >
              <div className="relative w-full sm:w-2/5 h-48 sm:h-auto shrink-0 bg-gray-150 dark:bg-slate-800">
                <img 
                  src={storyItem.image} 
                  alt={storyItem.coupleNames}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Joined {storyItem.year}
                </span>
              </div>

              <div className="p-6 flex flex-col justify-between grow">
                <div className="space-y-3">
                  <h3 className="font-extrabold text-gray-955 dark:text-white text-lg flex items-center gap-1.5">
                    {storyItem.coupleNames}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed font-light italic">
                    "{storyItem.story}"
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-50 dark:border-slate-805 mt-4 flex items-center justify-between">
                  <button
                    onClick={() => handleLike(storyItem.id)}
                    className="flex items-center gap-1.5 text-xs text-pink-600 dark:text-pink-450 font-bold bg-pink-50 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/30 hover:bg-pink-100/50 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>Like ({likesCount[storyItem.id] || 0})</span>
                  </button>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                    Verified Match
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Story Input submission card */}
        <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto shadow-xs">
          <div className="text-center mb-8 space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-gray-955 dark:text-white">Add Your Story</h2>
            <p className="text-xs text-gray-500 dark:text-slate-405 font-light font-sans">Did you meet your special someone on Whaatachi? Share your journey with the community!</p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-2xl p-6 text-center space-y-3 animate-fadeIn">
              <CheckSquare className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h4 className="font-bold text-lg">Story Submitted Successfully!</h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed">
                Thank you for sharing your experience! Your story is now populated below and listed live on Whaatachi.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-5">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-gray-700 dark:text-slate-300 uppercase">Couple Names</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Selam & Dawit"
                    value={coupleNames}
                    onChange={(e) => setCoupleNames(e.target.value)}
                    className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-3 bg-gray-50/50 dark:bg-slate-850 text-gray-800 dark:text-white text-xs inline-block"
                  />
                </div>
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-gray-700 dark:text-slate-300 uppercase">Year Met</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-3 bg-gray-50/50 dark:bg-slate-850 text-gray-800 dark:text-white text-xs"
                  >
                    <option value="2026">2026 (This Year)</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>
              </div>

              {/* Story body */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-gray-700 dark:text-slate-300 uppercase">Describe Your Love Story</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How did you connect? Where was your first date? What made you realize they were the one?"
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="w-full border border-gray-200 dark:border-slate-700 rounded-xl p-3 bg-gray-50/50 dark:bg-slate-850 text-gray-800 dark:text-white text-xs leading-relaxed"
                />
              </div>

              {/* Image preset switcher */}
              <div className="space-y-2 text-xs">
                <label className="font-bold text-gray-700 dark:text-slate-300 uppercase">Select Backdrop representation image</label>
                <div className="grid grid-cols-3 gap-3">
                  {imagePresets.map((preset, idx) => {
                    const isSelected = selectedPresetImage === preset.url;
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedPresetImage(preset.url)}
                        className={`relative rounded-xl overflow-hidden pt-[60%] border-2 cursor-pointer transition-all ${
                          isSelected ? 'border-pink-500 scale-95 ring-3 ring-pink-105' : 'border-gray-200 dark:border-slate-800 opacity-60'
                        }`}
                      >
                        <img 
                          src={preset.url} 
                          alt={preset.label} 
                          className="absolute inset-0 w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Star className="h-4 w-4 text-pink-200 fill-pink-200" />
                Publish Story Live
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
