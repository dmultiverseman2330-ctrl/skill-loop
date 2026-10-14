import React from 'react';
import { Repeat, Heart, ShieldCheck, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenDevGuide: () => void;
  onExplore: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDevGuide, onExplore }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Repeat className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-white">
                Skill<span className="text-emerald-500">Loop</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              A hyperlocal barter network empowering neighbors to exchange craft, technology, cooking, and languages without money.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Explore Skills</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li><button onClick={onExplore} className="hover:text-emerald-400 transition">Pottery & Ceramics</button></li>
              <li><button onClick={onExplore} className="hover:text-emerald-400 transition">React & Web Development</button></li>
              <li><button onClick={onExplore} className="hover:text-emerald-400 transition">Sourdough & Culinary Arts</button></li>
              <li><button onClick={onExplore} className="hover:text-emerald-400 transition">Conversational French & Spanish</button></li>
              <li><button onClick={onExplore} className="hover:text-emerald-400 transition">Woodworking & Joinery</button></li>
            </ul>
          </div>

          {/* Neighborhood Hubs */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Coimbatore Loops</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>Ganapathy, Coimbatore</li>
              <li>Saravanampatti & Kalapatti, Coimbatore</li>
              <li>RS Puram, Coimbatore</li>
              <li>Peelamedu & TIDEL Park, Coimbatore</li>
              <li>Saibaba Colony & Gandhipuram, Coimbatore</li>
            </ul>
          </div>

          {/* Dev & Vercel Readiness */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Deployment & Dev</h4>
            <p className="text-stone-400 text-[11px]">
              Vercel single-page routing active via <code>vercel.json</code>. Mutual peer dependencies verified.
            </p>
            <button
              onClick={onOpenDevGuide}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-emerald-400 font-semibold text-xs border border-stone-700 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Build Diagnostics & Security</span>
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} SkillLoop Local Skill Exchange. Built with React, TypeScript & Vite.</p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Powered by neighborhood goodwill & zero transaction fees</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
