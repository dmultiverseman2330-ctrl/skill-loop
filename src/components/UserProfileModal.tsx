import React from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Repeat, 
  GraduationCap, 
  BookOpen,
  Award
} from 'lucide-react';
import { UserProfile } from '../types';
import { useExchange } from '../context/ExchangeContext';
import { useAuth } from '../context/AuthContext';

interface UserProfileModalProps {
  neighbor: UserProfile | null;
  onClose: () => void;
  onProposeExchange: (neighbor: UserProfile) => void;
  onOpenMessages: (neighbor: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  neighbor,
  onClose,
  onProposeExchange,
  onOpenMessages,
}) => {
  const { reviews } = useExchange();
  const { currentUser } = useAuth();

  if (!neighbor) return null;

  const userReviews = reviews.filter(r => r.targetUserId === neighbor.id);
  const isSelf = currentUser?.id === neighbor.id;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Cover */}
        <div className="h-32 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 relative p-4 flex justify-end items-start">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar and Primary Info */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 mb-6">
            <div className="flex items-end gap-4">
              <div className="relative">
                <img
                  src={neighbor.avatar}
                  alt={neighbor.name}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-lg bg-stone-100"
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-1 shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-stone-900 leading-tight">
                    {neighbor.name}
                  </h2>
                  {neighbor.isDemoAccount && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Demo Account
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-emerald-800">{neighbor.tagline}</p>
                <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{neighbor.neighborhood}, {neighbor.city}</span>
                  </span>
                  <span>•</span>
                  <span>{neighbor.distanceKm} km away</span>
                </div>
              </div>
            </div>

            {/* Quick Action CTAs */}
            {!isSelf && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenMessages(neighbor);
                  }}
                  className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 transition"
                  title="Direct Message"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onProposeExchange(neighbor);
                  }}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 transition active:scale-95"
                >
                  <Repeat className="w-4 h-4" />
                  <span>Propose Exchange</span>
                </button>
              </div>
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/80 mb-6 text-center text-xs">
            <div>
              <div className="flex items-center justify-center gap-1 font-bold text-stone-900 text-base">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{neighbor.rating.toFixed(1)}</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">{neighbor.reviewCount} Reviews</p>
            </div>
            <div className="border-x border-stone-200">
              <p className="font-bold text-stone-900 text-base">{neighbor.completedExchanges}</p>
              <p className="text-[11px] text-stone-500 mt-0.5">Completed Exchanges</p>
            </div>
            <div>
              <p className="font-bold text-stone-900 text-base">{neighbor.responseRate.split(' ')[0]}</p>
              <p className="text-[11px] text-stone-500 mt-0.5">Response Rate</p>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">About Me</h4>
            <p className="text-sm text-stone-700 leading-relaxed bg-stone-50/50 p-3.5 rounded-xl border border-stone-100">
              {neighbor.bio}
            </p>
          </div>

          {/* Badges */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Community Endorsements</h4>
            <div className="flex flex-wrap gap-2">
              {neighbor.badges.map(badge => (
                <span
                  key={badge}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                >
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{badge}</span>
                </span>
              ))}
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100 text-stone-600 text-xs font-medium">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>Member since {neighbor.memberSince}</span>
              </span>
            </div>
          </div>

          {/* Skills They Teach */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>Skills {neighbor.name.split(' ')[0]} Can Teach ({neighbor.skillsTeaching.length})</span>
              </h4>
            </div>

            <div className="space-y-3">
              {neighbor.skillsTeaching.map(skill => (
                <div
                  key={skill.id}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 hover:border-emerald-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h5 className="font-bold text-stone-900 text-sm">{skill.title}</h5>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {skill.category}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                        {skill.format}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 mb-2 leading-relaxed">{skill.description}</p>
                  <div className="flex items-center gap-4 text-[11px] text-stone-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{skill.sessionDuration}</span>
                    </span>
                    <span>•</span>
                    <span>Level: <strong className="text-stone-700">{skill.level}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills They Want to Learn */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5 mb-3">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Skills {neighbor.name.split(' ')[0]} Wants to Learn</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {neighbor.skillsLearning.map(wish => (
                <div
                  key={wish.id}
                  className="p-3 rounded-xl bg-teal-50/60 border border-teal-200/70 text-xs"
                >
                  <p className="font-bold text-teal-950 mb-0.5">{wish.title}</p>
                  <p className="text-[11px] text-teal-800/80 mb-1">Category: {wish.category}</p>
                  {wish.notes && (
                    <p className="text-[11px] text-stone-600 italic">"{wish.notes}"</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Community Reviews */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5 mb-3">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Neighbor Reviews ({userReviews.length})</span>
            </h4>

            {userReviews.length > 0 ? (
              <div className="space-y-3">
                {userReviews.map(review => (
                  <div
                    key={review.id}
                    className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={review.authorAvatar}
                          alt={review.authorName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-bold text-stone-800">{review.authorName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-600 italic mb-1.5">"{review.comment}"</p>
                    <div className="flex items-center justify-between text-[10px] text-stone-400">
                      <span>Exchanged: {review.skillExchanged}</span>
                      <span>{review.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 italic bg-stone-50 p-3 rounded-xl text-center">
                No reviews yet. Be the first to complete an exchange with {neighbor.name}!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
