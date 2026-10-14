import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  ExchangeRequest, 
  Review, 
  ChatMessage, 
  ExchangeStatus,
  SkillCategory 
} from '../types';
import { 
  DEMO_USER_SARAH, 
  DEMO_USER_MARCUS, 
  OTHER_NEIGHBORS, 
  INITIAL_EXCHANGES, 
  INITIAL_REVIEWS 
} from '../data/mockData';
import { useAuth } from './AuthContext';

interface ExchangeContextType {
  allNeighbors: UserProfile[];
  exchanges: ExchangeRequest[];
  reviews: Review[];
  chatMessages: ChatMessage[];
  selectedCategory: SkillCategory;
  setSelectedCategory: (cat: SkillCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  maxDistance: number;
  setMaxDistance: (km: number) => void;
  matchOnlyMyWishes: boolean;
  setMatchOnlyMyWishes: (enabled: boolean) => void;
  sendExchangeProposal: (proposal: {
    receiverId: string;
    offeredSkillTitle: string;
    requestedSkillTitle: string;
    message: string;
    proposedFormat: 'In-person' | 'Online' | 'Both';
    proposedLocation?: string;
    proposedSchedule?: string;
  }) => { success: boolean; message: string };
  updateExchangeStatus: (exchangeId: string, status: ExchangeStatus) => void;
  sendChatMessage: (recipientId: string, text: string, exchangeId?: string) => void;
  submitReview: (review: {
    targetUserId: string;
    skillExchanged: string;
    rating: number;
    comment: string;
  }) => void;
  getNeighborById: (id: string) => UserProfile | undefined;
  calculateMatchScore: (neighbor: UserProfile) => {
    isTwoWayMatch: boolean;
    weTeachWhatTheyWant: string[];
    theyTeachWhatWeWant: string[];
  };
}

const ExchangeContext = createContext<ExchangeContextType | undefined>(undefined);

const STORAGE_KEY_EXCHANGES = 'skillloop_exchanges_cbe_gnp_srp_v3';
const STORAGE_KEY_REVIEWS = 'skillloop_reviews_cbe_gnp_srp_v3';
const STORAGE_KEY_MESSAGES = 'skillloop_chat_messages_cbe_gnp_srp_v3';

export const ExchangeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [matchOnlyMyWishes, setMatchOnlyMyWishes] = useState<boolean>(false);

  const [exchanges, setExchanges] = useState<ExchangeRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EXCHANGES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_EXCHANGES;
      }
    }
    return INITIAL_EXCHANGES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_REVIEWS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_REVIEWS;
      }
    }
    return INITIAL_REVIEWS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [
          {
            id: 'msg_1',
            exchangeId: 'exch_demo_1',
            senderId: 'user_sivaraj_888',
            recipientId: 'user_dharani_999',
            text: "Vanakkam Dharani! Looking forward to our session this Saturday at your Ganapathy pottery workshop. Should I bring anything specific?",
            timestamp: 'Yesterday, 4:12 PM',
          },
          {
            id: 'msg_2',
            exchangeId: 'exch_demo_1',
            senderId: 'user_dharani_999',
            recipientId: 'user_sivaraj_888',
            text: "Vanakkam Sivaraj! Just wear comfortable clothes and trim your nails for centering clay. I have all the terracotta clay, wheel tools, and fresh filter coffee ready. See you at 10:30 AM!",
            timestamp: 'Yesterday, 5:30 PM',
          },
        ];
      }
    }
    return [
      {
        id: 'msg_1',
        exchangeId: 'exch_demo_1',
        senderId: 'user_sivaraj_888',
        recipientId: 'user_dharani_999',
        text: "Vanakkam Dharani! Looking forward to our session this Saturday at your Ganapathy pottery workshop. Should I bring anything specific?",
        timestamp: 'Yesterday, 4:12 PM',
      },
      {
        id: 'msg_2',
        exchangeId: 'exch_demo_1',
        senderId: 'user_dharani_999',
        recipientId: 'user_sivaraj_888',
        text: "Vanakkam Sivaraj! Just wear comfortable clothes and trim your nails for centering clay. I have all the terracotta clay, wheel tools, and fresh filter coffee ready. See you at 10:30 AM!",
        timestamp: 'Yesterday, 5:30 PM',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EXCHANGES, JSON.stringify(exchanges));
  }, [exchanges]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Combine demo users and other neighbors
  const allNeighbors: UserProfile[] = [
    DEMO_USER_SARAH,
    DEMO_USER_MARCUS,
    ...OTHER_NEIGHBORS,
  ];

  const getNeighborById = (id: string): UserProfile | undefined => {
    if (currentUser && currentUser.id === id) return currentUser;
    return allNeighbors.find(n => n.id === id);
  };

  const calculateMatchScore = (neighbor: UserProfile) => {
    if (!currentUser) {
      return {
        isTwoWayMatch: false,
        weTeachWhatTheyWant: [],
        theyTeachWhatWeWant: [],
      };
    }

    // Check what current user teaches that matches neighbor's learning wishlist
    const weTeachWhatTheyWant = currentUser.skillsTeaching
      .filter(ourSkill => 
        neighbor.skillsLearning.some(theirWish => 
          ourSkill.title.toLowerCase().includes(theirWish.title.toLowerCase()) ||
          theirWish.title.toLowerCase().includes(ourSkill.title.toLowerCase()) ||
          ourSkill.category === theirWish.category
        )
      )
      .map(s => s.title);

    // Check what neighbor teaches that matches current user's learning wishlist
    const theyTeachWhatWeWant = neighbor.skillsTeaching
      .filter(theirSkill => 
        currentUser.skillsLearning.some(ourWish => 
          theirSkill.title.toLowerCase().includes(ourWish.title.toLowerCase()) ||
          ourWish.title.toLowerCase().includes(theirSkill.title.toLowerCase()) ||
          theirSkill.category === ourWish.category
        )
      )
      .map(s => s.title);

    const isTwoWayMatch = weTeachWhatTheyWant.length > 0 && theyTeachWhatWeWant.length > 0;

    return {
      isTwoWayMatch,
      weTeachWhatTheyWant,
      theyTeachWhatWeWant,
    };
  };

  const sendExchangeProposal = (proposal: {
    receiverId: string;
    offeredSkillTitle: string;
    requestedSkillTitle: string;
    message: string;
    proposedFormat: 'In-person' | 'Online' | 'Both';
    proposedLocation?: string;
    proposedSchedule?: string;
  }): { success: boolean; message: string } => {
    if (!currentUser) {
      return { success: false, message: 'Please sign in to propose a skill exchange.' };
    }

    if (currentUser.id === proposal.receiverId) {
      return { success: false, message: 'You cannot propose an exchange with yourself.' };
    }

    const receiver = getNeighborById(proposal.receiverId);
    if (!receiver) {
      return { success: false, message: 'Neighbor not found.' };
    }

    const newRequest: ExchangeRequest = {
      id: `exch_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      receiverId: receiver.id,
      receiverName: receiver.name,
      receiverAvatar: receiver.avatar,
      offeredSkillTitle: proposal.offeredSkillTitle,
      requestedSkillTitle: proposal.requestedSkillTitle,
      status: 'pending',
      message: proposal.message,
      proposedFormat: proposal.proposedFormat,
      proposedLocation: proposal.proposedLocation || `${receiver.neighborhood} / Local Cafe`,
      proposedSchedule: proposal.proposedSchedule || 'Flexible / To be coordinated',
      createdAt: 'Just now',
    };

    setExchanges(prev => [newRequest, ...prev]);

    // Also add initial message to chat
    if (proposal.message) {
      const initialChat: ChatMessage = {
        id: `msg_${Date.now()}`,
        exchangeId: newRequest.id,
        senderId: currentUser.id,
        recipientId: receiver.id,
        text: `Exchange Proposal: ${proposal.message}`,
        timestamp: 'Just now',
      };
      setChatMessages(prev => [...prev, initialChat]);
    }

    return {
      success: true,
      message: `Exchange proposal sent to ${receiver.name}! They will be notified.`,
    };
  };

  const updateExchangeStatus = (exchangeId: string, status: ExchangeStatus) => {
    setExchanges(prev => 
      prev.map(ex => {
        if (ex.id === exchangeId) {
          return {
            ...ex,
            status,
            completedAt: status === 'completed' ? 'Just now' : ex.completedAt,
          };
        }
        return ex;
      })
    );
  };

  const sendChatMessage = (recipientId: string, text: string, exchangeId?: string) => {
    if (!currentUser || !text.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      exchangeId,
      senderId: currentUser.id,
      recipientId,
      text: text.trim(),
      timestamp: 'Just now',
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  const submitReview = (review: {
    targetUserId: string;
    skillExchanged: string;
    rating: number;
    comment: string;
  }) => {
    if (!currentUser) return;
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      targetUserId: review.targetUserId,
      skillExchanged: review.skillExchanged,
      rating: review.rating,
      comment: review.comment,
      date: 'Just now',
    };
    setReviews(prev => [newReview, ...prev]);
  };

  return (
    <ExchangeContext.Provider
      value={{
        allNeighbors,
        exchanges,
        reviews,
        chatMessages,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        maxDistance,
        setMaxDistance,
        matchOnlyMyWishes,
        setMatchOnlyMyWishes,
        sendExchangeProposal,
        updateExchangeStatus,
        sendChatMessage,
        submitReview,
        getNeighborById,
        calculateMatchScore,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};

export const useExchange = () => {
  const context = useContext(ExchangeContext);
  if (!context) {
    throw new Error('useExchange must be used within an ExchangeProvider');
  }
  return context;
};
