export type Role = 'athlete' | 'parent';

export type Archetype = 
  | 'The Calm Operator'
  | 'The Resilient Bounceback'
  | 'Sharp Decision-Maker'
  | 'Unshakable Competitor';

export type Barrier = 
  | 'Pre-Match Nerves'
  | 'The Error Spiral'
  | 'Form Slump'
  | 'Tactical Errors'
  | 'Sideline Distractions';

export type Position = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';

export type MatchTarget = 
  | 'Upcoming League Match'
  | 'Cup / Tournament Final'
  | 'Academy Showcase / Trials'
  | 'Personal Mental Mastery';

export type CompetitionLevel = 
  | 'Grassroots / Recreational'
  | 'Competitive Travel'
  | 'High School / Semi-Pro'
  | 'Elite Academy / Pro Youth';

export type TrainingFrequency = '3x / week' | '5x / week' | 'Daily (7x / week)';

export type VaultCategory = 
  | 'Sharpen Your Game'
  | 'Confidence & Joy'
  | 'Confidence'
  | 'Resilience'
  | 'Anxiety & Composure'
  | 'Match Day Prep'
  | 'Flow / The Zone';

export interface VaultSession {
  id: string;
  title: string;
  category: VaultCategory;
  productNarrative: string;
  targetHook: string;
  durationSeconds: number; // typically 300s (5 minutes)
  audioUrl?: string;
  videoUrl?: string;
  videoPosterUrl?: string;
  mediaType?: 'audio' | 'video' | 'both';
  tacticalVisualType?: 'pitch-tactics' | 'first-person-1v1' | 'stadium-ambience' | 'flow-animation';
  waveformType?: 'binaural-alpha' | 'binaural-theta' | 'stadium-ambience' | 'flow-frequency';
}

export interface DaySchedule {
  dayIndex: number; // 0 = Monday, 6 = Sunday
  dayName: string;
  dayShort: string;
  sessionId: string;
  sessionTitle: string;
  category: VaultCategory;
  durationMinutes: number;
  isCompleted: boolean;
  completedAt?: string;
  playedDurationSeconds?: number;
  actualDurationSeconds: number;
  isToday: boolean;
  isCustomSwap?: boolean;
}

export interface AthleteProfile {
  id: string;
  userId: string;
  name: string;
  position: Position;
  matchTarget: MatchTarget;
  mainBarrier: Barrier;
  level: CompetitionLevel;
  frequency: TrainingFrequency;
  archetype: Archetype;
  onboarding_completed: boolean;
  composureScore: number;
  currentStreak: number;
  longestStreak: number;
  jersey_reward_eligible: boolean;
  jersey_claimed?: boolean;
  activeSchedule: DaySchedule[];
  isCustomMode: boolean;
  linkedParentId?: string;
  pairingCode?: string;
}

export interface ParentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  subscriptionStatus: 'active' | 'trialing' | 'past_due' | 'canceled' | 'none';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  linkedAthleteIds: string[];
}

export interface PairingCodeRecord {
  code: string;
  parentId: string;
  parentEmail: string;
  athleteName: string;
  createdAt: string;
  isRedeemed: boolean;
  redeemedByAthleteId?: string;
}

export interface ConversationStarter {
  id: string;
  athleteId: string;
  sessionId: string;
  sessionTitle: string;
  headline: string;
  promptText: string;
  suggestedQuestion: string;
  completedAt: string;
  category: VaultCategory;
}

export interface MentorShortcut {
  id: string;
  title: string;
  mentorName: string;
  mentorTitle: string;
  academy: string;
  avatarUrl: string;
  quote: string;
  badge: string;
  targetArchetype?: Archetype;
  recommendedFor: string;
  scheduleIds: string[]; // 7 session IDs for the 7 days
}

export interface TelemetryVerificationResult {
  isValid: boolean;
  playedSeconds: number;
  requiredSeconds: number;
  completionPercentage: number;
  message: string;
}
