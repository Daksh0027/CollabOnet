'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole =
  | 'CREATOR'
  | 'SALES_REPRESENTATIVE'
  | 'TALENT_MANAGER'
  | 'BRANCH_MANAGER'
  | 'COMPANY_HEAD_ADMIN'
  | 'PLATFORM_ADMIN';

export interface UserPersona {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  personaKey: 'CREATOR' | 'SALES_REP_A' | 'SALES_REP_B' | 'TALENT_MANAGER' | 'COMPANY_HEAD' | 'PLATFORM_ADMIN';
  verificationStatus: 'VERIFIED' | 'PENDING_PHASE_1' | 'PENDING_PHASE_2' | 'UNVERIFIED';
  organizationId?: string;
  organizationName?: string;
  branchId?: string;
  branchName?: string;
  avatarFallback: string;
  description: string;
}

export const PRESET_PERSONAS: Record<string, UserPersona> = {
  CREATOR: {
    id: 'user_creator_rohan',
    email: 'rohan@techstudio.io',
    name: 'Rohan Sharma (Tech Studio)',
    role: 'CREATOR',
    personaKey: 'CREATOR',
    verificationStatus: 'VERIFIED',
    avatarFallback: 'RS',
    description: 'Verified Tech & Fintech YouTube Creator (240k subs)',
  },
  SALES_REP_A: {
    id: 'user_rep_alice',
    email: 'alice.zhang@nike.com',
    name: 'Alice Zhang',
    role: 'SALES_REPRESENTATIVE',
    personaKey: 'SALES_REP_A',
    verificationStatus: 'VERIFIED',
    organizationId: 'org_nike_global',
    organizationName: 'Nike Global Enterprise',
    branchId: 'branch_nike_na',
    branchName: 'North America (NYC)',
    avatarFallback: 'AZ',
    description: 'Deal Lead for Creator Rohan (Strict Deal Owner)',
  },
  SALES_REP_B: {
    id: 'user_rep_bob',
    email: 'bob.miller@nike.com',
    name: 'Bob Miller',
    role: 'SALES_REPRESENTATIVE',
    personaKey: 'SALES_REP_B',
    verificationStatus: 'VERIFIED',
    organizationId: 'org_nike_global',
    organizationName: 'Nike Global Enterprise',
    branchId: 'branch_nike_na',
    branchName: 'North America (NYC)',
    avatarFallback: 'BM',
    description: 'Peer Sales Rep (Has 403 Forbidden to Alice’s Chat)',
  },
  TALENT_MANAGER: {
    id: 'user_manager_apex',
    email: 'deals@apextalent.agency',
    name: 'Apex Talent Management',
    role: 'TALENT_MANAGER',
    personaKey: 'TALENT_MANAGER',
    verificationStatus: 'VERIFIED',
    avatarFallback: 'AT',
    description: 'Rohan’s Agent (Sees Masked Brand Rep PII in AI Summaries)',
  },
  COMPANY_HEAD: {
    id: 'user_head_admin',
    email: 'marcus.vance@nike.com',
    name: 'Marcus Vance (Global CMO)',
    role: 'COMPANY_HEAD_ADMIN',
    personaKey: 'COMPANY_HEAD',
    verificationStatus: 'VERIFIED',
    organizationId: 'org_nike_global',
    organizationName: 'Nike Global Enterprise',
    avatarFallback: 'MV',
    description: 'Global CMO with Multi-Branch Budget Governance & Rival Intel',
  },
  PLATFORM_ADMIN: {
    id: 'user_platform_admin',
    email: 'safety@collabonet.io',
    name: 'CollaboNet Trust Tribunal',
    role: 'PLATFORM_ADMIN',
    personaKey: 'PLATFORM_ADMIN',
    verificationStatus: 'VERIFIED',
    avatarFallback: 'CT',
    description: 'Platform Auditor for Whisper Verification & Hall of Shame',
  },
};

interface AuthContextType {
  currentUser: UserPersona;
  setCurrentPersona: (key: keyof typeof PRESET_PERSONAS) => void;
  allPersonas: typeof PRESET_PERSONAS;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserPersona>(PRESET_PERSONAS.SALES_REP_A);

  useEffect(() => {
    const saved = localStorage.getItem('collabonet_persona');
    if (saved && PRESET_PERSONAS[saved]) {
      setCurrentUser(PRESET_PERSONAS[saved]);
    }
  }, []);

  const setCurrentPersona = (key: keyof typeof PRESET_PERSONAS) => {
    const persona = PRESET_PERSONAS[key];
    if (persona) {
      setCurrentUser(persona);
      localStorage.setItem('collabonet_persona', key);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentPersona, allPersonas: PRESET_PERSONAS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
