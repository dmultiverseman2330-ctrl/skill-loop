import React from 'react';
import { 
  Repeat, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  Users, 
  ArrowRight,
  HeartHandshake
} from 'lucide-react';

interface LandingHeroProps {
  onExploreClick: () => void;
  onProposeClick: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onExploreClick,
  onProposeClick,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-stone-50 to-stone-50 border-b border-stone-200/80 pt-8 pb-12 sm:pt-14 sm:pb-16">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 rounded-full bg-teal-200/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hyperlocal Barter & Peer Learning Network</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-tight sm:leading-none mb-6">
            Trade Talents, Not Dollars. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
              Swap Skills With Neighbors.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-stone-600 font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            SkillLoop connects you with craftspeople, coders, cooks, and creatives down the street. 
            Teach what you love, learn what you have always wanted — completely free.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 transition active:scale-95 text-base"
            >
              <span>Find a Skill Near You</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onProposeClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-stone-100 text-stone-800 font-bold px-6 py-3.5 rounded-xl border border-stone-300 shadow-xs transition active:scale-95 text-base"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              <span>How SkillLoop Works</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-stone-200/80 text-left">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-stone-200/60 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase">Currency</p>
                <p className="text-sm font-bold text-stone-900">$0 / Pure Barter</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-stone-200/60 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <Repeat className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase">2-Way Match</p>
                <p className="text-sm font-bold text-stone-900">Direct Reciprocity</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-stone-200/60 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase">Vetting</p>
                <p className="text-sm font-bold text-stone-900">Verified Neighbors</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-stone-200/60 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase">Location</p>
                <p className="text-sm font-bold text-stone-900">Walking Distance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
