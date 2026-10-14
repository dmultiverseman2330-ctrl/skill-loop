import React from 'react';
import { 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  MapPin, 
  X,
  Repeat
} from 'lucide-react';
import { SkillCategory } from '../types';
import { useExchange } from '../context/ExchangeContext';
import { useAuth } from '../context/AuthContext';

const CATEGORIES: SkillCategory[] = [
  'All',
  'Crafts & Arts',
  'Tech & Coding',
  'Culinary & Baking',
  'Music & Audio',
  'Languages',
  'Gardening & DIY',
  'Fitness & Wellness',
  'Business & Writing',
];

interface SkillSearchProps {
  totalResultsCount: number;
}

export const SkillSearch: React.FC<SkillSearchProps> = ({ totalResultsCount }) => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    maxDistance,
    setMaxDistance,
    matchOnlyMyWishes,
    setMatchOnlyMyWishes,
  } = useExchange();

  const { currentUser } = useAuth();

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs mb-8">
      {/* Top Search Input Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills (e.g. Pottery, React, Sourdough, Spanish, Guitar)..."
            className="w-full pl-11 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Distance Filter Selector */}
        <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Distance:</span>
          <select
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="bg-transparent font-bold text-stone-900 focus:outline-none cursor-pointer"
          >
            <option value={1}>Under 1 km (Walking)</option>
            <option value={3}>Under 3 km (Neighborhood)</option>
            <option value={5}>Under 5 km (District)</option>
            <option value={15}>Within 15 km (Citywide)</option>
          </select>
        </div>

        {/* 2-Way Match Filter Toggle (if signed in) */}
        {currentUser && (
          <button
            onClick={() => setMatchOnlyMyWishes(!matchOnlyMyWishes)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border ${
              matchOnlyMyWishes
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent shadow-xs'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
            }`}
          >
            <Repeat className={`w-3.5 h-3.5 ${matchOnlyMyWishes ? 'text-white' : 'text-emerald-600'}`} />
            <span>2-Way Loop Matches Only</span>
          </button>
        )}
      </div>

      {/* Category Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500 font-medium">
        <div>
          Showing <span className="font-bold text-stone-800">{totalResultsCount}</span> community members with exchangeable skills
          {selectedCategory !== 'All' && <span> in <span className="font-bold text-emerald-700">{selectedCategory}</span></span>}
          {matchOnlyMyWishes && <span> matching your profile reciprocity</span>}
        </div>
        {(searchQuery || selectedCategory !== 'All' || matchOnlyMyWishes) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setMatchOnlyMyWishes(false);
            }}
            className="text-emerald-700 hover:underline font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
