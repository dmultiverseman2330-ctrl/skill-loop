import React, { useState } from 'react';
import { 
  X, 
  Repeat, 
  Sparkles, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  GraduationCap, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { useExchange } from '../context/ExchangeContext';

interface ProposeExchangeModalProps {
  neighbor: UserProfile | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const ProposeExchangeModal: React.FC<ProposeExchangeModalProps> = ({
  neighbor,
  onClose,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const { sendExchangeProposal } = useExchange();

  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState<string>(
    currentUser?.skillsTeaching[0]?.title || ''
  );
  const [selectedRequestedSkill, setSelectedRequestedSkill] = useState<string>(
    neighbor?.skillsTeaching[0]?.title || ''
  );
  const [format, setFormat] = useState<'In-person' | 'Online' | 'Both'>('In-person');
  const [proposedLocation, setProposedLocation] = useState<string>(
    neighbor ? `${neighbor.neighborhood} Community Center / Cafe` : ''
  );
  const [proposedSchedule, setProposedSchedule] = useState<string>('This weekend (Saturday 10:00 AM)');
  const [message, setMessage] = useState<string>(
    neighbor 
      ? `Hi ${neighbor.name.split(' ')[0]}! I'd love to swap skills with you. Let me know if this works for you!` 
      : ''
  );
  const [submitting, setSubmitting] = useState(false);

  if (!neighbor || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfferedSkill || !selectedRequestedSkill) return;

    setSubmitting(true);
    const result = sendExchangeProposal({
      receiverId: neighbor.id,
      offeredSkillTitle: selectedOfferedSkill,
      requestedSkillTitle: selectedRequestedSkill,
      message,
      proposedFormat: format,
      proposedLocation,
      proposedSchedule,
    });

    setSubmitting(false);
    if (result.success) {
      onSuccess(result.message);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-900">Propose Skill Exchange</h2>
              <p className="text-xs text-stone-500">Initiate a reciprocal barter session with {neighbor.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Exchange Loop Visual Header */}
        <div className="bg-stone-50 p-4 border-b border-stone-100">
          <div className="flex items-center justify-between text-xs font-semibold">
            {/* You */}
            <div className="flex items-center gap-2 max-w-[42%]">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30"
              />
              <div className="truncate">
                <span className="block text-[10px] text-stone-400 uppercase font-bold">You Offer</span>
                <span className="text-stone-900 font-bold truncate block">{selectedOfferedSkill || 'Select skill'}</span>
              </div>
            </div>

            {/* Loop Arrow */}
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Repeat className="w-4 h-4 animate-spin-slow" />
            </div>

            {/* Neighbor */}
            <div className="flex items-center gap-2 max-w-[42%] text-right justify-end">
              <div className="truncate">
                <span className="block text-[10px] text-stone-400 uppercase font-bold">You Learn</span>
                <span className="text-stone-900 font-bold truncate block">{selectedRequestedSkill || 'Select skill'}</span>
              </div>
              <img
                src={neighbor.avatar}
                alt={neighbor.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/30"
              />
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Skill You Will Teach */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Skill You Will Teach in Return</span>
            </label>
            {currentUser.skillsTeaching.length > 0 ? (
              <select
                value={selectedOfferedSkill}
                onChange={(e) => setSelectedOfferedSkill(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                {currentUser.skillsTeaching.map((skill) => (
                  <option key={skill.id} value={skill.title}>
                    {skill.title} ({skill.sessionDuration})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                You haven't listed any teaching skills on your profile yet. Add a skill first to offer an exchange!
              </div>
            )}
          </div>

          {/* Skill You Want to Learn */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              <span>Skill You Want to Learn from {neighbor.name}</span>
            </label>
            <select
              value={selectedRequestedSkill}
              onChange={(e) => setSelectedRequestedSkill(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              {neighbor.skillsTeaching.map((skill) => (
                <option key={skill.id} value={skill.title}>
                  {skill.title} ({skill.sessionDuration} • {skill.level})
                </option>
              ))}
            </select>
          </div>

          {/* Format Radio */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Preferred Session Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['In-person', 'Online', 'Both'] as const).map((fmt) => (
                <button
                  type="button"
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    format === fmt
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Proposed Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>Proposed Meeting Location / Platform</span>
            </label>
            <input
              type="text"
              value={proposedLocation}
              onChange={(e) => setProposedLocation(e.target.value)}
              placeholder="e.g. Mission Playground, Ritual Coffee, or Google Meet"
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Proposed Schedule */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>Ideal Time / Schedule</span>
            </label>
            <input
              type="text"
              value={proposedSchedule}
              onChange={(e) => setProposedSchedule(e.target.value)}
              placeholder="e.g. Saturday afternoon, Tuesday after 6 PM"
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Personal Message */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Personal Note / Introduction
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce your experience level, goals, or what excited you about their profile..."
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || currentUser.skillsTeaching.length === 0}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-2 active:scale-95"
            >
              <Repeat className="w-4 h-4" />
              <span>Send Exchange Proposal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
