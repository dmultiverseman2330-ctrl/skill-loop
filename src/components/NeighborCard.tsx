import React from 'react';
import { 
  Star, 
  MapPin, 
  Repeat, 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { useExchange } from '../context/ExchangeContext';

interface NeighborCardProps {
  neighbor: UserProfile;
  onViewProfile: (neighbor: UserProfile) => void;
  onProposeExchange: (neighbor: UserProfile) => void;
}

export const NeighborCard: React.FC<NeighborCardProps> = ({
  neighbor,
  onViewProfile,
  onProposeExchange,
}) => {
  const { currentUser } = useAuth();
  const { calculateMatchScore } = useExchange();

  const isSelf = currentUser?.id === neighbor.id;
  const match = calculateMatchScore(neighbor);

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
      match.isTwoWayMatch 
        ? 'border-emerald-300 ring-2 ring-emerald-500/10' 
        : 'border-stone-200/90 hover:border-stone-300'
    }`}>
      {/* 2-Way Match Alert Banner */}
      {match.isTwoWayMatch && !isSelf && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-1.5 text-white text-[11px] font-bold flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Repeat className="w-3.5 h-3.5" />
            <span>Perfect 2-Way Loop Match!</span>
          </div>
          <span className="text-emerald-100 font-normal">Direct Reciprocity</span>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={neighbor.avatar}
                alt={neighbor.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-stone-100 shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-stone-900 text-base leading-tight hover:text-emerald-700 transition cursor-pointer" onClick={() => onViewProfile(neighbor)}>
                  {neighbor.name}
                </h3>
                {neighbor.isDemoAccount && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                    Demo
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 font-medium">{neighbor.tagline}</p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  <span>{neighbor.neighborhood}</span>
                </span>
                <span>•</span>
                <span className="text-stone-600 font-semibold">{neighbor.distanceKm} km away</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-lg text-xs font-bold text-amber-900">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{neighbor.rating.toFixed(1)}</span>
            </div>
            <p className="text-[10px] text-stone-400 mt-0.5">{neighbor.completedExchanges} swaps</p>
          </div>
        </div>

        {/* Short Bio */}
        <p className="text-xs text-stone-600 line-clamp-2 mb-4 leading-relaxed">
          {neighbor.bio}
        </p>

        {/* Match Breakdown Note */}
        {match.isTwoWayMatch && !isSelf && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/70 text-xs text-emerald-950">
            <p className="font-bold flex items-center gap-1 text-[11px] text-emerald-800 mb-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Mutual Exchange Opportunities:</span>
            </p>
            <p className="text-[11px] leading-tight">
              • They teach <span className="font-semibold text-emerald-900">{match.theyTeachWhatWeWant[0]}</span>
            </p>
            <p className="text-[11px] leading-tight mt-0.5">
              • You teach <span className="font-semibold text-emerald-900">{match.weTeachWhatTheyWant[0]}</span>
            </p>
          </div>
        )}

        {/* Skills Section */}
        <div className="space-y-3 flex-1">
          {/* Teaching */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Can Teach:</span>
              </span>
              <span className="text-stone-400 font-normal">{neighbor.skillsTeaching.length} skills</span>
            </div>
            <div className="space-y-1.5">
              {neighbor.skillsTeaching.slice(0, 2).map((skill) => (
                <div 
                  key={skill.id}
                  className="p-2 rounded-xl bg-stone-50 border border-stone-200/70 text-xs"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-stone-900 line-clamp-1">{skill.title}</span>
                    <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-white text-stone-600 border border-stone-200 shrink-0">
                      {skill.format}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{skill.description}</p>
                </div>
              ))}
              {neighbor.skillsTeaching.length > 2 && (
                <button 
                  onClick={() => onViewProfile(neighbor)}
                  className="text-[11px] text-emerald-700 font-semibold hover:underline"
                >
                  +{neighbor.skillsTeaching.length - 2} more teaching skills
                </button>
              )}
            </div>
          </div>

          {/* Wants to Learn */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                <span>Wants to Learn:</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {neighbor.skillsLearning.map((wish) => (
                <span
                  key={wish.id}
                  className="text-[11px] font-medium bg-teal-50 text-teal-800 border border-teal-200/60 px-2 py-0.5 rounded-lg"
                >
                  {wish.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center gap-2">
        <button
          onClick={() => onViewProfile(neighbor)}
          className="flex-1 py-2 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold transition text-center"
        >
          View Profile
        </button>

        {!isSelf ? (
          <button
            onClick={() => onProposeExchange(neighbor)}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1 active:scale-95"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Propose Loop</span>
          </button>
        ) : (
          <span className="flex-1 py-2 px-3 rounded-xl bg-stone-100 text-stone-400 text-xs font-semibold text-center">
            Your Profile
          </span>
        )}
      </div>
    </div>
  );
};
