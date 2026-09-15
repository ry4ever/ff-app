import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AthleteProfile,
  ConversationStarter,
  ParentProfile,
  Position,
  MatchTarget,
  Barrier,
  TrainingFrequency,
  CompetitionLevel,
  VaultSession,
  Role,
  TelemetryVerificationResult,
} from '../types';
import { mapBarrierToArchetype } from '../domain/archetypes';
import { generate7DayBlueprint, swapDailySession, importRoutineToSchedule } from '../domain/scheduler';
import { verifyAudioPlaybackTelemetry, updateStreakAndCheckMilestone } from '../domain/telemetry';
import { createConversationStarter, getDefaultConversationStarter } from '../domain/conversationStarters';
import { simulateStripeCheckout, handleStripeWebhookPayload, StripeWebhookEvent } from './stripeService';
import { generateBehavioralNudges, PushNotification } from './pushService';

interface FearlessStore {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  activeTab: 'feed' | 'vault' | 'parent' | 'hq';
  setActiveTab: (tab: 'feed' | 'vault' | 'parent' | 'hq') => void;

  athlete: AthleteProfile;
  parent: ParentProfile;
  activePairingCode: string | null;

  activeAudioSession: VaultSession | null;
  setActiveAudioSession: (session: VaultSession | null) => void;

  conversationStarters: ConversationStarter[];
  notifications: PushNotification[];
  jerseyModalOpen: boolean;
  setJerseyModalOpen: (open: boolean) => void;
  stripeModalOpen: boolean;
  setStripeModalOpen: (open: boolean) => void;

  // Actions
  completeOnboarding: (
    position: Position,
    target: MatchTarget,
    barrier: Barrier,
    freq: TrainingFrequency,
    level: CompetitionLevel
  ) => void;
  toggleCustomMode: () => void;
  swapSession: (dayIndex: number, sessionId: string) => void;
  importMentorRoutine: (sessionIds: string[]) => void;
  completeRehearsalWithTelemetry: (
    playedSeconds: number,
    actualSeconds: number
  ) => TelemetryVerificationResult;
  handleStripeSubscription: (email: string, childName: string) => string;
  redeemPairingCode: (code: string) => boolean;
  triggerWebhookEvent: (event: StripeWebhookEvent) => void;
  claimJersey: () => void;
  resetOnboarding: () => void;
  incrementStreakForTesting: (targetDays: number) => void;
}

const FearlessContext = createContext<FearlessStore | null>(null);

const INITIAL_SCHEDULE = generate7DayBlueprint('Pre-Match Nerves', 'Midfielder', '5x / week');

const INITIAL_ATHLETE: AthleteProfile = {
  id: 'athlete-1',
  userId: 'user-athlete-1',
  name: 'Alex Sterling',
  position: 'Midfielder',
  matchTarget: 'Upcoming League Match',
  mainBarrier: 'Pre-Match Nerves',
  level: 'Competitive Travel',
  frequency: '5x / week',
  archetype: 'The Calm Operator',
  onboarding_completed: true, // Default completed for instant demo, user can toggle onboarding modal anytime
  composureScore: 84,
  currentStreak: 4, // "Composure Streak: 4/5 Days" matching Blueprint Screen 2
  longestStreak: 12,
  jersey_reward_eligible: false,
  activeSchedule: INITIAL_SCHEDULE,
  isCustomMode: false,
  linkedParentId: 'parent-1',
  pairingCode: 'FEAR-4892'
};

const INITIAL_PARENT: ParentProfile = {
  id: 'parent-1',
  userId: 'user-parent-1',
  name: 'David Sterling',
  email: 'david.sterling@example.com',
  subscriptionStatus: 'active',
  stripeCustomerId: 'cus_live_94829',
  linkedAthleteIds: ['athlete-1']
};

export const FearlessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<Role>('athlete');
  const [activeTab, setActiveTab] = useState<'feed' | 'vault' | 'parent' | 'hq'>('hq');

  const [athlete, setAthlete] = useState<AthleteProfile>(INITIAL_ATHLETE);
  const [parent, setParent] = useState<ParentProfile>(INITIAL_PARENT);
  const [activePairingCode, setActivePairingCode] = useState<string | null>('FEAR-4892');

  const [activeAudioSession, setActiveAudioSession] = useState<VaultSession | null>(null);
  const [conversationStarters, setConversationStarters] = useState<ConversationStarter[]>([
    getDefaultConversationStarter(INITIAL_ATHLETE.name)
  ]);
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [jerseyModalOpen, setJerseyModalOpen] = useState(false);
  const [stripeModalOpen, setStripeModalOpen] = useState(false);

  // Initialize push notifications
  useEffect(() => {
    setNotifications(generateBehavioralNudges(athlete));
  }, [athlete.currentStreak, athlete.archetype]);

  const completeOnboarding = (
    position: Position,
    target: MatchTarget,
    barrier: Barrier,
    freq: TrainingFrequency,
    level: CompetitionLevel
  ) => {
    const archetypeRule = mapBarrierToArchetype(barrier, position);
    const newSchedule = generate7DayBlueprint(barrier, position, freq);

    setAthlete(prev => ({
      ...prev,
      position,
      matchTarget: target,
      mainBarrier: barrier,
      frequency: freq,
      level,
      archetype: archetypeRule.archetype,
      onboarding_completed: true,
      activeSchedule: newSchedule,
      composureScore: 80,
      currentStreak: 0,
      jersey_reward_eligible: false
    }));

    setActiveTab('hq');
  };

  const toggleCustomMode = () => {
    setAthlete(prev => ({
      ...prev,
      isCustomMode: !prev.isCustomMode
    }));
  };

  const swapSession = (dayIndex: number, sessionId: string) => {
    setAthlete(prev => {
      const updated = swapDailySession(prev.activeSchedule, dayIndex, sessionId);
      return {
        ...prev,
        activeSchedule: updated
      };
    });
  };

  const importMentorRoutine = (sessionIds: string[]) => {
    setAthlete(prev => {
      const updated = importRoutineToSchedule(prev.activeSchedule, sessionIds);
      return {
        ...prev,
        activeSchedule: updated,
        isCustomMode: true
      };
    });
    setActiveTab('hq');
  };

  const completeRehearsalWithTelemetry = (
    playedSeconds: number,
    actualSeconds: number
  ): TelemetryVerificationResult => {
    const verification = verifyAudioPlaybackTelemetry(playedSeconds, actualSeconds);

    if (!verification.isValid) {
      return verification;
    }

    if (activeAudioSession) {
      // 1. Mark schedule card complete
      setAthlete(prev => {
        const updatedSchedule = prev.activeSchedule.map(day => {
          if (day.sessionId === activeAudioSession.id && (day.isToday || !day.isCompleted)) {
            return {
              ...day,
              isCompleted: true,
              completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              playedDurationSeconds: playedSeconds
            };
          }
          return day;
        });

        const streakResult = updateStreakAndCheckMilestone(
          { ...prev, activeSchedule: updatedSchedule },
          true
        );

        if (streakResult.milestoneTriggered) {
          setJerseyModalOpen(true);
        }

        return streakResult.updatedProfile;
      });

      // 2. Generate Conversation Starter card for Parent Dashboard
      const starter = createConversationStarter(athlete.id, athlete.name, activeAudioSession);
      setConversationStarters(prev => [starter, ...prev]);
    }

    return verification;
  };

  const handleStripeSubscription = (email: string, childName: string): string => {
    const result = simulateStripeCheckout(email, childName);
    setParent(prev => ({
      ...prev,
      email,
      subscriptionStatus: 'active',
      stripeCustomerId: result.customerId,
      stripeSubscriptionId: result.subscriptionId
    }));
    setActivePairingCode(result.pairingCode);
    return result.pairingCode;
  };

  const redeemPairingCode = (code: string): boolean => {
    if (code.trim().toUpperCase() === activePairingCode?.trim().toUpperCase()) {
      setAthlete(prev => ({
        ...prev,
        pairingCode: code.toUpperCase()
      }));
      return true;
    }
    return false;
  };

  const triggerWebhookEvent = (event: StripeWebhookEvent) => {
    const result = handleStripeWebhookPayload(event, parent.subscriptionStatus);
    setParent(prev => ({
      ...prev,
      subscriptionStatus: result.updatedStatus
    }));
  };

  const claimJersey = () => {
    setAthlete(prev => ({
      ...prev,
      jersey_claimed: true
    }));
    setJerseyModalOpen(false);
  };

  const resetOnboarding = () => {
    setAthlete(prev => ({
      ...prev,
      onboarding_completed: false
    }));
  };

  const incrementStreakForTesting = (targetDays: number) => {
    setAthlete(prev => ({
      ...prev,
      currentStreak: targetDays,
      jersey_reward_eligible: targetDays >= 45
    }));
    if (targetDays >= 45) {
      setJerseyModalOpen(true);
    }
  };

  return (
    <FearlessContext.Provider
      value={{
        activeRole,
        setActiveRole,
        activeTab,
        setActiveTab,
        athlete,
        parent,
        activePairingCode,
        activeAudioSession,
        setActiveAudioSession,
        conversationStarters,
        notifications,
        jerseyModalOpen,
        setJerseyModalOpen,
        stripeModalOpen,
        setStripeModalOpen,
        completeOnboarding,
        toggleCustomMode,
        swapSession,
        importMentorRoutine,
        completeRehearsalWithTelemetry,
        handleStripeSubscription,
        redeemPairingCode,
        triggerWebhookEvent,
        claimJersey,
        resetOnboarding,
        incrementStreakForTesting
      }}
    >
      {children}
    </FearlessContext.Provider>
  );
};

export const useFearless = () => {
  const ctx = useContext(FearlessContext);
  if (!ctx) throw new Error('useFearless must be used within FearlessProvider');
  return ctx;
};
