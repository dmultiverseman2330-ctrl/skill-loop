import React from 'react';
import { 
  Repeat, 
  Search, 
  ArrowLeftRight, 
  MessageSquare, 
  LayoutDashboard, 
  User, 
  LogOut, 
  Sparkles,
  ShieldAlert,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useExchange } from '../context/ExchangeContext';

interface NavbarProps {
  activeTab: 'explore' | 'exchanges' | 'messages' | 'dashboard';
  setActiveTab: (tab: 'explore' | 'exchanges' | 'messages' | 'dashboard') => void;
  onOpenAuth: () => void;
  onOpenDevGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenDevGuide,
}) => {
  const { currentUser, isDevMode, simulateProduction, switchDemoUser, logout } = useAuth();
  const { exchanges } = useExchange();

  // Count pending incoming requests for the current user
  const incomingPendingCount = currentUser 
    ? exchanges.filter(e => e.receiverId === currentUser.id && e.status === 'pending').length 
    : 0;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
      {/* Dev Mode Notification Top Bar */}
      {isDevMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Dev Demo Active: Quick login ready for</span>
              <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-950 font-bold">9990003331</span>
              <span>(Sarah) &</span>
              <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-950 font-bold">8880002221</span>
              <span>(Marcus)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => switchDemoUser('9990003331')}
                className={`px-2 py-0.5 rounded text-xs transition ${
                  currentUser?.phone === '9990003331' 
                    ? 'bg-amber-600 text-white font-bold shadow-xs' 
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-amber-200'
                }`}
              >
                Act as Sarah
              </button>
              <button
                onClick={() => switchDemoUser('8880002221')}
                className={`px-2 py-0.5 rounded text-xs transition ${
                  currentUser?.phone === '8880002221' 
                    ? 'bg-amber-600 text-white font-bold shadow-xs' 
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-amber-200'
                }`}
              >
                Act as Marcus
              </button>
              <button 
                onClick={onOpenDevGuide}
                className="underline hover:text-amber-950 ml-1 font-semibold"
              >
                Security & Vercel Info
              </button>
            </div>
          </div>
        </div>
      )}

      {simulateProduction && (
        <div className="bg-emerald-900 text-emerald-100 px-4 py-1 text-xs text-center font-medium flex items-center justify-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-300" />
          <span>Production Simulation Active: Demo phone bypass strictly disabled per security architecture.</span>
          <button 
            onClick={onOpenDevGuide}
            className="underline text-white font-bold ml-2"
          >
            Change Mode
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Repeat className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-stone-900 group-hover:text-emerald-700 transition">
                Skill<span className="text-emerald-600">Loop</span>
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400 -mt-1">
                Local Skill Exchange
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'explore'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-600" />
              <span>Explore Skills</span>
            </button>

            <button
              onClick={() => setActiveTab('exchanges')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition relative ${
                activeTab === 'exchanges'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4 text-emerald-600" />
              <span>Exchanges</span>
              {incomingPendingCount > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-bounce">
                  {incomingPendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'messages'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Messages</span>
            </button>

            {currentUser && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                <span>My Dashboard</span>
              </button>
            )}
          </nav>

          {/* User Profile / Action */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-stone-100 transition border border-transparent hover:border-stone-200 text-left"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-stone-900 leading-tight">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      {currentUser.neighborhood}
                    </p>
                  </div>
                </button>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 transition active:scale-95"
              >
                <Smartphone className="w-4 h-4" />
                <span>Sign In / Demo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden border-t border-stone-200 bg-stone-50 px-3 py-2 flex items-center justify-around text-xs font-semibold text-stone-600">
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'explore' ? 'text-emerald-600 font-bold' : ''}`}
        >
          <Search className="w-4 h-4" />
          <span>Explore</span>
        </button>
        <button
          onClick={() => setActiveTab('exchanges')}
          className={`flex flex-col items-center gap-1 relative ${activeTab === 'exchanges' ? 'text-emerald-600 font-bold' : ''}`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Exchanges</span>
          {incomingPendingCount > 0 && (
            <span className="absolute -top-1 right-2 bg-emerald-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {incomingPendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'messages' ? 'text-emerald-600 font-bold' : ''}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Messages</span>
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-emerald-600 font-bold' : ''}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
      </div>
    </header>
  );
};
