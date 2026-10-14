import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Skill, SkillWish } from '../types';
import { DEMO_USER_SARAH, DEMO_USER_MARCUS } from '../data/mockData';

interface AuthContextType {
  currentUser: UserProfile | null;
  isDevMode: boolean;
  simulateProduction: boolean;
  setSimulateProduction: (value: boolean) => void;
  loginWithDemoPhone: (phone: string) => { success: boolean; message: string };
  loginWithCredentials: (email: string, password: string) => { success: boolean; message: string };
  switchDemoUser: (phone: '9990003331' | '8880002221') => void;
  setUserName: (name: string) => void;
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  addTeachingSkill: (skill: Omit<Skill, 'id'>) => void;
  removeTeachingSkill: (skillId: string) => void;
  addLearningWish: (wish: Omit<SkillWish, 'id'>) => void;
  removeLearningWish: (wishId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'skillloop_current_user_cbe_gnp_srp_v3';
const STORAGE_KEY_PROD_SIM = 'skillloop_sim_prod';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check development mode
  const actualDev = import.meta.env.DEV || 
    (typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' || 
      window.location.hostname.includes('ais-dev') || 
      window.location.hostname.includes('127.0.0.1')
    ));

  const [simulateProduction, setSimulateProductionState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_PROD_SIM) === 'true';
  });

  const effectiveDevMode = actualDev && !simulateProduction;

  // Initialize with Dharani (Ganapathy, Coimbatore) by default
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USER_SARAH;
      }
    }
    return DEMO_USER_SARAH;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  const setSimulateProduction = (value: boolean) => {
    setSimulateProductionState(value);
    localStorage.setItem(STORAGE_KEY_PROD_SIM, String(value));
  };

  const setUserName = (name: string) => {
    if (!currentUser || !name.trim()) return;
    setCurrentUser(prev => prev ? { ...prev, name: name.trim() } : null);
  };

  const loginWithDemoPhone = (phone: string): { success: boolean; message: string } => {
    const cleanPhone = phone.replace(/\D/g, '');

    // Strictly enforce production security constraint:
    if (!effectiveDevMode) {
      return {
        success: false,
        message: 'Security Notice: Demo phone-number login is strictly disabled in production. Production environments must use verified SMS OTP or OAuth.',
      };
    }

    if (cleanPhone === '9990003331') {
      setCurrentUser(DEMO_USER_SARAH);
      return {
        success: true,
        message: `Vanakkam ${DEMO_USER_SARAH.name}! Logged in to Ganapathy, Coimbatore account.`,
      };
    }

    if (cleanPhone === '8880002221') {
      setCurrentUser(DEMO_USER_MARCUS);
      return {
        success: true,
        message: `Vanakkam ${DEMO_USER_MARCUS.name}! Logged in to Saravanampatti, Coimbatore account.`,
      };
    }

    return {
      success: false,
      message: 'Unrecognized demo phone number. Authorized demo numbers for Coimbatore dev testing are 9990003331 and 8880002221.',
    };
  };

  const switchDemoUser = (phone: '9990003331' | '8880002221') => {
    if (phone === '9990003331') {
      setCurrentUser(DEMO_USER_SARAH);
    } else {
      setCurrentUser(DEMO_USER_MARCUS);
    }
  };

  const loginWithCredentials = (email: string, password: string): { success: boolean; message: string } => {
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }
    // Simulate credential verification
    if (email.toLowerCase().includes('sivaraj') || email.toLowerCase().includes('marcus')) {
      setCurrentUser(DEMO_USER_MARCUS);
      return { success: true, message: `Signed in as ${DEMO_USER_MARCUS.name} (Saravanampatti, Coimbatore).` };
    }
    if (email.toLowerCase().includes('dharani') || email.toLowerCase().includes('sarah')) {
      setCurrentUser(DEMO_USER_SARAH);
      return { success: true, message: `Signed in as ${DEMO_USER_SARAH.name} (Ganapathy, Coimbatore).` };
    }
    
    // Generic user creation for testing arbitrary accounts
    const nameFromEmail = email.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: formattedName || 'Coimbatore Neighbor',
      phone: '9840199999',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
      tagline: 'Passionate Skill Enthusiast',
      bio: 'Excited to learn new crafts and share what I know with Coimbatore neighbors!',
      neighborhood: 'RS Puram',
      city: 'Coimbatore, Tamil Nadu',
      distanceKm: 1.2,
      rating: 5.0,
      reviewCount: 0,
      badges: ['Verified Neighbor', 'New Explorer'],
      skillsTeaching: [],
      skillsLearning: [],
      memberSince: 'Just now',
      completedExchanges: 0,
      responseRate: '100%',
    };
    
    setCurrentUser(newUser);
    return { success: true, message: `Welcome to SkillLoop Coimbatore, ${newUser.name}!` };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      ...updatedData,
    });
  };

  const addTeachingSkill = (skill: Omit<Skill, 'id'>) => {
    if (!currentUser) return;
    const newSkill: Skill = {
      ...skill,
      id: `skill_${Date.now()}`,
    };
    setCurrentUser({
      ...currentUser,
      skillsTeaching: [...currentUser.skillsTeaching, newSkill],
    });
  };

  const removeTeachingSkill = (skillId: string) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      skillsTeaching: currentUser.skillsTeaching.filter(s => s.id !== skillId),
    });
  };

  const addLearningWish = (wish: Omit<SkillWish, 'id'>) => {
    if (!currentUser) return;
    const newWish: SkillWish = {
      ...wish,
      id: `wish_${Date.now()}`,
    };
    setCurrentUser({
      ...currentUser,
      skillsLearning: [...currentUser.skillsLearning, newWish],
    });
  };

  const removeLearningWish = (wishId: string) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      skillsLearning: currentUser.skillsLearning.filter(w => w.id !== wishId),
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isDevMode: effectiveDevMode,
        simulateProduction,
        setSimulateProduction,
        loginWithDemoPhone,
        loginWithCredentials,
        switchDemoUser,
        setUserName,
        logout,
        updateProfile,
        addTeachingSkill,
        removeTeachingSkill,
        addLearningWish,
        removeLearningWish,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
