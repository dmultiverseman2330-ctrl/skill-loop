import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  User, 
  Repeat, 
  MapPin, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useExchange } from '../context/ExchangeContext';
import { UserProfile } from '../types';

interface MessagesViewProps {
  initialPartnerId?: string | null;
}

export const MessagesView: React.FC<MessagesViewProps> = ({ initialPartnerId }) => {
  const { currentUser } = useAuth();
  const { allNeighbors, chatMessages, sendChatMessage, exchanges } = useExchange();

  // Pick partner: if initialPartnerId provided, or first neighbor with chat
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(() => {
    if (initialPartnerId) return initialPartnerId;
    if (currentUser?.phone === '9990003331') return 'user_sivaraj_888';
    if (currentUser?.phone === '8880002221') return 'user_dharani_999';
    return allNeighbors.find(n => n.id !== currentUser?.id)?.id || '';
  });

  const [messageInput, setMessageInput] = useState('');

  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto my-12 shadow-xs">
        <MessageSquare className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-stone-900 mb-2">Sign in to view messages</h2>
        <p className="text-stone-600 text-sm">
          Coordinate session details, share learning resources, and chat with exchange partners.
        </p>
      </div>
    );
  }

  // Filter neighbors that we have chat or exchanges with, plus others
  const relevantNeighbors = allNeighbors.filter(n => n.id !== currentUser.id);
  const activePartner = allNeighbors.find(n => n.id === selectedPartnerId);

  // Filter messages between currentUser and selectedPartner
  const conversation = chatMessages.filter(
    m => 
      (m.senderId === currentUser.id && m.recipientId === selectedPartnerId) ||
      (m.senderId === selectedPartnerId && m.recipientId === currentUser.id)
  );

  // Relevant exchange with this partner
  const partnerExchange = exchanges.find(
    e => 
      (e.senderId === currentUser.id && e.receiverId === selectedPartnerId) ||
      (e.senderId === selectedPartnerId && e.receiverId === currentUser.id)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedPartnerId) return;

    sendChatMessage(selectedPartnerId, messageInput.trim(), partnerExchange?.id);
    setMessageInput('');
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden flex flex-col md:flex-row h-[75vh]">
        {/* Left Sidebar: Conversations */}
        <div className="w-full md:w-80 border-r border-stone-200 flex flex-col bg-stone-50/50">
          <div className="p-4 border-b border-stone-200 bg-white">
            <h2 className="font-black text-stone-900 text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <span>Neighbor Messages</span>
            </h2>
          </div>

          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {relevantNeighbors.map((partner) => {
              const isSelected = partner.id === selectedPartnerId;
              const hasExchange = exchanges.some(
                e => (e.senderId === partner.id && e.receiverId === currentUser.id) ||
                     (e.senderId === currentUser.id && e.receiverId === partner.id)
              );

              return (
                <button
                  key={partner.id}
                  onClick={() => setSelectedPartnerId(partner.id)}
                  className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 transition ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <img
                    src={partner.avatar}
                    alt={partner.name}
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/50"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-bold text-sm truncate ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                        {partner.name}
                      </p>
                      {hasExchange && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          Loop
                        </span>
                      )}
                    </div>
                    <p className={`text-xs truncate ${isSelected ? 'text-emerald-100' : 'text-stone-500'}`}>
                      {partner.neighborhood}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Chat Panel */}
        <div className="flex-1 flex flex-col bg-white">
          {activePartner ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <img
                    src={activePartner.avatar}
                    alt={activePartner.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-stone-100"
                  />
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">{activePartner.name}</h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{activePartner.neighborhood} ({activePartner.distanceKm} km away)</span>
                    </p>
                  </div>
                </div>

                {partnerExchange && (
                  <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl text-xs text-emerald-900">
                    <Repeat className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Swap: <strong>{partnerExchange.offeredSkillTitle}</strong> ↔ <strong>{partnerExchange.requestedSkillTitle}</strong></span>
                  </div>
                )}
              </div>

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/40">
                {conversation.length > 0 ? (
                  conversation.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                            isMe
                              ? 'bg-emerald-600 text-white rounded-br-xs'
                              : 'bg-white text-stone-800 border border-stone-200/90 rounded-bl-xs'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          <span
                            className={`block text-[10px] mt-1 text-right ${
                              isMe ? 'text-emerald-100' : 'text-stone-400'
                            }`}
                          >
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                    <MessageSquare className="w-8 h-8 mb-2 text-stone-300" />
                    <p className="text-xs font-semibold text-stone-600">No messages yet with {activePartner.name}.</p>
                    <p className="text-[11px] text-stone-400">
                      Say hello, introduce what you'd like to learn, or suggest a coffee shop to meet up!
                    </p>
                  </div>
                )}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSend} className="p-3 border-t border-stone-200 bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Message ${activePartner.name.split(' ')[0]}...`}
                  className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-stone-400 text-sm">
              Select a conversation to start messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
