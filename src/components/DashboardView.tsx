import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Star, 
  Award, 
  Repeat, 
  Plus, 
  Trash2, 
  GraduationCap, 
  BookOpen, 
  Clock, 
  ShieldCheck, 
  Smartphone,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useExchange } from '../context/ExchangeContext';
import { AddSkillModal } from './AddSkillModal';

interface DashboardViewProps {
  onOpenExchanges: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenExchanges }) => {
  const { 
    currentUser, 
    addTeachingSkill, 
    removeTeachingSkill, 
    addLearningWish, 
    removeLearningWish,
    switchDemoUser,
    isDevMode
  } = useAuth();
  
  const { reviews, exchanges } = useExchange();

  const [modalType, setModalType] = useState<'teaching' | 'learning' | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 text-center border border-stone-200">
        <User className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-stone-900 mb-2">No Active Session</h2>
        <p className="text-xs text-stone-500 mb-4">Please log in to manage your profile and skills.</p>
      </div>
    );
  }

  const myReviews = reviews.filter(r => r.targetUserId === currentUser.id);
  const activeExchangesCount = exchanges.filter(
    e => (e.senderId === currentUser.id || e.receiverId === currentUser.id) && e.status === 'accepted'
  ).length;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-stone-100">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-emerald-500/20 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-1 shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-stone-900">{currentUser.name}</h1>
                {currentUser.isDemoAccount && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    Demo Account
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-emerald-800">{currentUser.tagline}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{currentUser.neighborhood}, {currentUser.city}</span>
                </span>
                <span>•</span>
                <span className="font-mono text-stone-600 font-medium">
                  📞 {currentUser.phone}
                </span>
                <span>•</span>
                <span>Member since {currentUser.memberSince}</span>
              </div>
            </div>
          </div>

          {/* Dev Mode Demo Account Quick-Switch */}
          {isDevMode && (
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 flex flex-col gap-2 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Dev Account Switcher
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => switchDemoUser('9990003331')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    currentUser.phone === '9990003331'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  Sarah Chen
                </button>
                <button
                  onClick={() => switchDemoUser('8880002221')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    currentUser.phone === '8880002221'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  Marcus Vance
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reputation Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 text-center text-xs">
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
            <div className="flex items-center justify-center gap-1 font-black text-stone-900 text-xl">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{currentUser.rating.toFixed(1)}</span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5">Rating ({myReviews.length} Reviews)</p>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
            <p className="font-black text-stone-900 text-xl">{currentUser.completedExchanges}</p>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5">Completed Exchanges</p>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
            <p className="font-black text-emerald-700 text-xl">{activeExchangesCount}</p>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5">Active Exchanges</p>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
            <p className="font-black text-stone-900 text-xl">{currentUser.skillsTeaching.length}</p>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5">Skills Offered</p>
          </div>
        </div>
      </div>

      {/* Skills Management Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Skills I Am Teaching */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-black text-stone-900 text-lg">Skills I Can Teach</h2>
                <p className="text-xs text-stone-500">Talents you offer to swap with neighbors</p>
              </div>
            </div>
            <button
              onClick={() => setModalType('teaching')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="space-y-3">
            {currentUser.skillsTeaching.map((skill) => (
              <div
                key={skill.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-stone-300 transition group"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">{skill.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {skill.category}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                        {skill.format}
                      </span>
                      <span className="text-[10px] text-stone-500 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {skill.sessionDuration}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeTeachingSkill(skill.id)}
                    className="p-1.5 text-stone-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Remove Skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills I Want to Learn */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-black text-stone-900 text-lg">My Learning Wishlist</h2>
                <p className="text-xs text-stone-500">Skills you are looking to learn in return</p>
              </div>
            </div>
            <button
              onClick={() => setModalType('learning')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Wish</span>
            </button>
          </div>

          <div className="space-y-3">
            {currentUser.skillsLearning.map((wish) => (
              <div
                key={wish.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-stone-300 transition"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">{wish.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                        {wish.category}
                      </span>
                      {wish.targetLevel && (
                        <span className="text-[10px] font-medium text-stone-500">
                          Target: {wish.targetLevel}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeLearningWish(wish.id)}
                    className="p-1.5 text-stone-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Remove Wish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {wish.notes && (
                  <p className="text-xs text-stone-600 mt-2 italic">"{wish.notes}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Received Reviews Endorsements */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
        <h2 className="font-black text-stone-900 text-lg flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Neighbor Endorsements & Reviews ({myReviews.length})</span>
        </h2>

        {myReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={rev.authorAvatar}
                      alt={rev.authorName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="font-bold text-stone-900">{rev.authorName}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-stone-700 italic mb-2 leading-relaxed">"{rev.comment}"</p>
                <div className="flex items-center justify-between text-[10px] text-stone-400">
                  <span>Skill Exchanged: <strong>{rev.skillExchanged}</strong></span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-500 italic p-4 bg-stone-50 rounded-2xl text-center">
            You don't have any reviews yet. Complete an exchange session to earn neighbor badges!
          </p>
        )}
      </div>

      {/* Add Skill Modal */}
      {modalType && (
        <AddSkillModal
          type={modalType}
          onClose={() => setModalType(null)}
          onAddTeaching={addTeachingSkill}
          onAddLearning={addLearningWish}
        />
      )}
    </div>
  );
};
