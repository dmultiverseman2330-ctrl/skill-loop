import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExchangeProvider, useExchange } from './context/ExchangeContext';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { SkillSearch } from './components/SkillSearch';
import { NeighborCard } from './components/NeighborCard';
import { UserProfileModal } from './components/UserProfileModal';
import { ProposeExchangeModal } from './components/ProposeExchangeModal';
import { ExchangesView } from './components/ExchangesView';
import { MessagesView } from './components/MessagesView';
import { DashboardView } from './components/DashboardView';
import { AuthModal } from './components/AuthModal';
import { DevGuideModal } from './components/DevGuideModal';
import { Footer } from './components/Footer';
import { UserProfile } from './types';
import { 
  Repeat, 
  Sparkles, 
  HeartHandshake, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  GraduationCap,
  BookOpen,
  Coffee
} from 'lucide-react';

function SkillLoopMain() {
  const { currentUser } = useAuth();
  const { 
    allNeighbors, 
    selectedCategory, 
    searchQuery, 
    maxDistance, 
    matchOnlyMyWishes,
    calculateMatchScore 
  } = useExchange();

  const [activeTab, setActiveTab] = useState<'explore' | 'exchanges' | 'messages' | 'dashboard'>('explore');
  const [selectedNeighbor, setSelectedNeighbor] = useState<UserProfile | null>(null);
  const [exchangeNeighbor, setExchangeNeighbor] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDevGuideOpen, setIsDevGuideOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeChatPartnerId, setActiveChatPartnerId] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Filter neighbors based on search, category, distance, and 2-way match
  const filteredNeighbors = allNeighbors.filter((neighbor) => {
    // Distance filter
    if (neighbor.distanceKm > maxDistance) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'All') {
      const teachesCategory = neighbor.skillsTeaching.some(s => s.category === selectedCategory);
      const learnsCategory = neighbor.skillsLearning.some(w => w.category === selectedCategory);
      if (!teachesCategory && !learnsCategory) {
        return false;
      }
    }

    // 2-Way Match Filter
    if (matchOnlyMyWishes) {
      const match = calculateMatchScore(neighbor);
      if (!match.isTwoWayMatch) {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const nameMatch = neighbor.name.toLowerCase().includes(query);
      const neighborhoodMatch = neighbor.neighborhood.toLowerCase().includes(query);
      const teachingMatch = neighbor.skillsTeaching.some(
        s => s.title.toLowerCase().includes(query) || s.description.toLowerCase().includes(query)
      );
      const learningMatch = neighbor.skillsLearning.some(
        w => w.title.toLowerCase().includes(query) || (w.notes && w.notes.toLowerCase().includes(query))
      );
      if (!nameMatch && !neighborhoodMatch && !teachingMatch && !learningMatch) {
        return false;
      }
    }

    return true;
  });

  const handleOpenChatWithPartner = (partnerId: string) => {
    setActiveChatPartnerId(partnerId);
    setActiveTab('messages');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-stone-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200 border border-stone-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDevGuide={() => setIsDevGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'explore' && (
          <div>
            {/* Hero Section */}
            <LandingHero
              onExploreClick={() => {
                const searchEl = document.getElementById('search-section');
                searchEl?.scrollIntoView({ behavior: 'smooth' });
              }}
              onProposeClick={() => {
                const howItWorks = document.getElementById('how-it-works-section');
                howItWorks?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Search & Discovery Section */}
            <div id="search-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  Discover Neighbors & Skills
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                  Connect with makers, developers, linguists, and culinary artists in your neighborhood.
                </p>
              </div>

              {/* Search Bar & Filters */}
              <SkillSearch totalResultsCount={filteredNeighbors.length} />

              {/* Neighbors Grid */}
              {filteredNeighbors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNeighbors.map((neighbor) => (
                    <NeighborCard
                      key={neighbor.id}
                      neighbor={neighbor}
                      onViewProfile={(n) => setSelectedNeighbor(n)}
                      onProposeExchange={(n) => {
                        if (!currentUser) {
                          setIsAuthOpen(true);
                        } else {
                          setExchangeNeighbor(n);
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs max-w-md mx-auto my-6">
                  <Repeat className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-stone-900 mb-1">No matches found</h3>
                  <p className="text-xs text-stone-500 mb-4">
                    Try loosening your distance radius or clearing your search term to see more neighbors.
                  </p>
                </div>
              )}
            </div>

            {/* How SkillLoop Works Section */}
            <div id="how-it-works-section" className="bg-stone-100/70 border-y border-stone-200 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>The SkillLoop Barter Economy</span>
                  </div>
                  <h2 className="text-3xl font-black text-stone-900 tracking-tight">
                    How Skill Exchanging Works
                  </h2>
                  <p className="text-stone-600 text-sm mt-2">
                    Three simple steps to unlock reciprocity in your local neighborhood.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl mb-4">
                      1
                    </div>
                    <h3 className="font-bold text-stone-900 text-base mb-2 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-600" />
                      <span>Post What You Love</span>
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      List crafts, coding skills, cooking techniques, or languages you can teach. Even 1-hour sessions can unlock new passions.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs">
                    <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-black text-xl mb-4">
                      2
                    </div>
                    <h3 className="font-bold text-stone-900 text-base mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-teal-600" />
                      <span>Match 2-Way Reciprocity</span>
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Our algorithm detects perfect 2-way loops: when Sarah wants React and teaches Pottery, and Marcus wants Pottery and teaches React!
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xl mb-4">
                      3
                    </div>
                    <h3 className="font-bold text-stone-900 text-base mb-2 flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-purple-600" />
                      <span>Meet Up & Swap</span>
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Coordinate at a local studio, cafe, or online. Complete the swap, leave peer endorsements, and expand your community loop.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exchanges' && (
          <ExchangesView onOpenChat={handleOpenChatWithPartner} />
        )}

        {activeTab === 'messages' && (
          <MessagesView initialPartnerId={activeChatPartnerId} />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView onOpenExchanges={() => setActiveTab('exchanges')} />
        )}
      </main>

      {/* Footer */}
      <Footer 
        onOpenDevGuide={() => setIsDevGuideOpen(true)}
        onExplore={() => {
          setActiveTab('explore');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Profile Detail Modal */}
      <UserProfileModal
        neighbor={selectedNeighbor}
        onClose={() => setSelectedNeighbor(null)}
        onProposeExchange={(neighbor) => {
          if (!currentUser) {
            setIsAuthOpen(true);
          } else {
            setExchangeNeighbor(neighbor);
          }
        }}
        onOpenMessages={(neighbor) => {
          handleOpenChatWithPartner(neighbor.id);
        }}
      />

      {/* Propose Exchange Modal */}
      <ProposeExchangeModal
        neighbor={exchangeNeighbor}
        onClose={() => setExchangeNeighbor(null)}
        onSuccess={(msg) => {
          showToast(msg);
          setActiveTab('exchanges');
        }}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Dev & Vercel Diagnostics Modal */}
      <DevGuideModal
        isOpen={isDevGuideOpen}
        onClose={() => setIsDevGuideOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ExchangeProvider>
        <SkillLoopMain />
      </ExchangeProvider>
    </AuthProvider>
  );
}
