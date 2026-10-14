import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Check, 
  X, 
  CheckCircle2, 
  MessageSquare, 
  Star, 
  Calendar, 
  MapPin, 
  Clock, 
  Repeat,
  Sparkles,
  Award
} from 'lucide-react';
import { ExchangeRequest, ExchangeStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { useExchange } from '../context/ExchangeContext';

interface ExchangesViewProps {
  onOpenChat: (partnerId: string) => void;
}

export const ExchangesView: React.FC<ExchangesViewProps> = ({ onOpenChat }) => {
  const { currentUser } = useAuth();
  const { exchanges, updateExchangeStatus, submitReview } = useExchange();

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'incoming' | 'outgoing' | 'completed'>('all');
  
  // Review modal state
  const [reviewModalExchange, setReviewModalExchange] = useState<ExchangeRequest | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto my-12 shadow-xs">
        <ArrowLeftRight className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-stone-900 mb-2">Sign in to view your Skill Exchanges</h2>
        <p className="text-stone-600 text-sm mb-6">
          Connect with neighbors to track exchange proposals, coordinate session times, and rate swap partners.
        </p>
      </div>
    );
  }

  // Filter exchanges relevant to the current user
  const userExchanges = exchanges.filter(
    e => e.senderId === currentUser.id || e.receiverId === currentUser.id
  );

  const incomingRequests = userExchanges.filter(e => e.receiverId === currentUser.id);
  const outgoingRequests = userExchanges.filter(e => e.senderId === currentUser.id);
  const completedExchanges = userExchanges.filter(e => e.status === 'completed');

  const displayedExchanges = userExchanges.filter(e => {
    if (activeSubTab === 'incoming') return e.receiverId === currentUser.id;
    if (activeSubTab === 'outgoing') return e.senderId === currentUser.id;
    if (activeSubTab === 'completed') return e.status === 'completed';
    return true;
  });

  const handleCompleteAndReview = (exchange: ExchangeRequest) => {
    updateExchangeStatus(exchange.id, 'completed');
    setReviewModalExchange(exchange);
    setReviewComment(`Great skill exchange! Loved learning ${exchange.requestedSkillTitle} and sharing ${exchange.offeredSkillTitle}.`);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalExchange) return;

    const targetUserId = reviewModalExchange.senderId === currentUser.id 
      ? reviewModalExchange.receiverId 
      : reviewModalExchange.senderId;

    submitReview({
      targetUserId,
      skillExchanged: reviewModalExchange.requestedSkillTitle,
      rating: reviewRating,
      comment: reviewComment,
    });

    setReviewModalExchange(null);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 flex items-center gap-2.5">
            <Repeat className="w-7 h-7 text-emerald-600" />
            <span>My Skill Exchanges</span>
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Manage incoming proposals, coordinate session logistics, and track your swap history.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold border border-stone-200">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeSubTab === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All ({userExchanges.length})
          </button>
          <button
            onClick={() => setActiveSubTab('incoming')}
            className={`px-3 py-1.5 rounded-lg transition relative ${
              activeSubTab === 'incoming' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Incoming ({incomingRequests.length})
            {incomingRequests.filter(r => r.status === 'pending').length > 0 && (
              <span className="ml-1.5 bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {incomingRequests.filter(r => r.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('outgoing')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeSubTab === 'outgoing' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Outgoing ({outgoingRequests.length})
          </button>
          <button
            onClick={() => setActiveSubTab('completed')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeSubTab === 'completed' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Completed ({completedExchanges.length})
          </button>
        </div>
      </div>

      {/* Exchanges List */}
      {displayedExchanges.length > 0 ? (
        <div className="space-y-4">
          {displayedExchanges.map((exchange) => {
            const isReceiver = exchange.receiverId === currentUser.id;
            const partnerName = isReceiver ? exchange.senderName : exchange.receiverName;
            const partnerAvatar = isReceiver ? exchange.senderAvatar : exchange.receiverAvatar;
            const partnerId = isReceiver ? exchange.senderId : exchange.receiverId;

            return (
              <div
                key={exchange.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs transition hover:border-stone-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                  {/* Partner Info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={partnerAvatar}
                      alt={partnerName}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-stone-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-stone-900 text-base">{partnerName}</h3>
                        <span className="text-[10px] text-stone-400 font-medium">
                          {isReceiver ? '• Sent you a proposal' : '• You sent a proposal'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">{exchange.createdAt}</p>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <div>
                    {exchange.status === 'pending' && (
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending Decision</span>
                      </span>
                    )}
                    {exchange.status === 'accepted' && (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Active Exchange</span>
                      </span>
                    )}
                    {exchange.status === 'declined' && (
                      <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">
                        <X className="w-3.5 h-3.5" />
                        <span>Declined</span>
                      </span>
                    )}
                    {exchange.status === 'completed' && (
                      <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed Swap</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Exchange Skill Terms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs">
                    <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block mb-1">
                      {isReceiver ? `${partnerName} Offers to Teach` : 'You Offer to Teach'}
                    </span>
                    <p className="font-bold text-stone-900 text-sm">{exchange.offeredSkillTitle}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-xs">
                    <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider block mb-1">
                      {isReceiver ? 'In Exchange to Learn Your' : `In Exchange to Learn ${partnerName}'s`}
                    </span>
                    <p className="font-bold text-emerald-950 text-sm">{exchange.requestedSkillTitle}</p>
                  </div>
                </div>

                {/* Proposal Message */}
                {exchange.message && (
                  <p className="text-xs text-stone-600 bg-stone-50/60 p-3 rounded-xl border border-stone-100 italic mb-4">
                    "{exchange.message}"
                  </p>
                )}

                {/* Logistics */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 mb-4 pt-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Repeat className="w-3.5 h-3.5 text-stone-400" />
                    <span>Format: <strong>{exchange.proposedFormat}</strong></span>
                  </span>
                  {exchange.proposedLocation && (
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{exchange.proposedLocation}</span>
                    </span>
                  )}
                  {exchange.proposedSchedule && (
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>{exchange.proposedSchedule}</span>
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => onOpenChat(partnerId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-bold transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Chat with {partnerName.split(' ')[0]}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Receiver can Accept or Decline pending requests */}
                    {isReceiver && exchange.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateExchangeStatus(exchange.id, 'declined')}
                          className="px-3.5 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => updateExchangeStatus(exchange.id, 'accepted')}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Exchange</span>
                        </button>
                      </>
                    )}

                    {/* Sender can cancel pending requests */}
                    {!isReceiver && exchange.status === 'pending' && (
                      <button
                        onClick={() => updateExchangeStatus(exchange.id, 'cancelled')}
                        className="px-3.5 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-semibold transition"
                      >
                        Cancel Proposal
                      </button>
                    )}

                    {/* Active exchanges can be completed */}
                    {exchange.status === 'accepted' && (
                      <button
                        onClick={() => handleCompleteAndReview(exchange)}
                        className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Session Completed & Rate</span>
                      </button>
                    )}

                    {exchange.status === 'completed' && (
                      <button
                        onClick={() => {
                          setReviewModalExchange(exchange);
                          setReviewComment('Excellent exchange! Very helpful and friendly.');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>Leave Review</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto shadow-xs">
          <ArrowLeftRight className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-stone-900 mb-1">No Exchanges Found</h3>
          <p className="text-xs text-stone-500 mb-6">
            You don't have any {activeSubTab !== 'all' ? activeSubTab : ''} skill exchanges yet. 
            Browse neighbors down the street and propose your first swap!
          </p>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalExchange && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>Rate Your Skill Exchange</span>
              </h3>
              <button
                onClick={() => setReviewModalExchange(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-900 ml-2">
                    {reviewRating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">
                  Endorsement & Feedback
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share how the session went, what you learned, and why you recommend this neighbor..."
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalExchange(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
                >
                  Submit Endorsement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
