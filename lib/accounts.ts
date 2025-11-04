// Dual-Account System: Sarah Chen & Marcus Johnson
// Foundation for multi-user demo capabilities

export type StudyStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading';
export type StudyTime = 'morning' | 'afternoon' | 'evening' | 'night';
export type LearningPace = 'fast' | 'moderate' | 'thorough';
export type AIPersonality = 'concise' | 'detailed' | 'socratic';
export type Theme = 'light' | 'dark' | 'auto';

export interface DemoAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  major: string;
  year: string;
  university: string;
  preferences: {
    studyStyle: StudyStyle;
    studyTime: StudyTime;
    learningPace: LearningPace;
    aiPersonality: AIPersonality;
  };
  theme: Theme;
}

export const DEMO_ACCOUNTS: Record<string, DemoAccount> = {
  'sarah-chen': {
    id: 'sarah-chen',
    name: 'Sarah Chen',
    email: 'sarah.chen@university.edu',
    avatar: '👩‍💻',
    major: 'Computer Science',
    year: 'Sophomore',
    university: 'State University',
    preferences: {
      studyStyle: 'visual',
      studyTime: 'night',
      learningPace: 'fast',
      aiPersonality: 'concise',
    },
    theme: 'dark',
  },
  'marcus-johnson': {
    id: 'marcus-johnson',
    name: 'Marcus Johnson',
    email: 'marcus.johnson@university.edu',
    avatar: '👨‍💼',
    major: 'Business & Psychology',
    year: 'Junior',
    university: 'State University',
    preferences: {
      studyStyle: 'auditory',
      studyTime: 'morning',
      learningPace: 'moderate',
      aiPersonality: 'socratic',
    },
    theme: 'light',
  },
};

export const DEFAULT_ACCOUNT_ID = 'sarah-chen';

// Get account by ID
export function getAccount(accountId: string): DemoAccount | undefined {
  return DEMO_ACCOUNTS[accountId];
}

// Get current account from localStorage
export function getCurrentAccountId(): string {
  if (typeof window === 'undefined') return DEFAULT_ACCOUNT_ID;
  
  try {
    const stored = localStorage.getItem('uniagent:currentAccount');
    if (stored && DEMO_ACCOUNTS[stored]) {
      return stored;
    }
  } catch (error) {
    console.error('Failed to get current account:', error);
  }
  
  return DEFAULT_ACCOUNT_ID;
}

// Set current account
export function setCurrentAccountId(accountId: string): void {
  if (typeof window === 'undefined') return;
  
  if (!DEMO_ACCOUNTS[accountId]) {
    console.error(`Invalid account ID: ${accountId}`);
    return;
  }
  
  try {
    localStorage.setItem('uniagent:currentAccount', accountId);
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Failed to set current account:', error);
  }
}

// Get all accounts
export function getAllAccounts(): DemoAccount[] {
  return Object.values(DEMO_ACCOUNTS);
}

// Get account display name
export function getAccountDisplayName(accountId: string): string {
  const account = getAccount(accountId);
  return account ? `${account.avatar} ${account.name}` : accountId;
}

// Get account storage key (for data isolation)
export function getAccountStorageKey(accountId: string): string {
  return `uniagent:${accountId}:v1`;
}

