export type SkillCategory = 
  | 'All'
  | 'Crafts & Arts'
  | 'Tech & Coding'
  | 'Culinary & Baking'
  | 'Music & Audio'
  | 'Languages'
  | 'Fitness & Wellness'
  | 'Gardening & DIY'
  | 'Business & Writing';

export type ExperienceLevel = 'Beginner Friendly' | 'Intermediate' | 'Advanced / Expert';
export type ExchangeFormat = 'In-person' | 'Online' | 'Both';

export interface Skill {
  id: string;
  title: string;
  category: Exclude<SkillCategory, 'All'>;
  level: ExperienceLevel;
  format: ExchangeFormat;
  description: string;
  sessionDuration: string;
}

export interface SkillWish {
  id: string;
  title: string;
  category: Exclude<SkillCategory, 'All'>;
  targetLevel?: string;
  notes?: string;
}

export interface Review {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  targetUserId: string;
  skillExchanged: string;
  rating: number;
  comment: string;
  date: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  tagline: string;
  bio: string;
  neighborhood: string;
  city: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  badges: string[];
  skillsTeaching: Skill[];
  skillsLearning: SkillWish[];
  memberSince: string;
  completedExchanges: number;
  responseRate: string;
  isDemoAccount?: boolean;
}

export type ExchangeStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';

export interface ExchangeRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  offeredSkillTitle: string;
  requestedSkillTitle: string;
  status: ExchangeStatus;
  message: string;
  proposedFormat: ExchangeFormat;
  proposedLocation?: string;
  proposedSchedule?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ChatMessage {
  id: string;
  exchangeId?: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: string;
}
