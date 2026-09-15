import { AthleteProfile } from '../types';

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  category: 'behavioral_nudge' | 'pre_match' | 'milestone' | 'parent_insight';
  timestamp: string;
  read: boolean;
}

export function generateBehavioralNudges(profile: AthleteProfile): PushNotification[] {
  const notifications: PushNotification[] = [];

  // Streak close to 45-day milestone
  if (profile.currentStreak >= 40 && profile.currentStreak < 45) {
    const repsLeft = 45 - profile.currentStreak;
    notifications.push({
      id: `nudge-${Date.now()}-1`,
      title: '👕 Fearless Streak Jersey In Sight',
      body: `${profile.name}, you're only ${repsLeft} daily ${repsLeft === 1 ? 'rep' : 'reps'} away from unlocking your official Saturday match jersey!`,
      category: 'milestone',
      timestamp: 'Just now',
      read: false
    });
  }

  // Pre-match intervention
  const hasSaturdayMatch = profile.activeSchedule.some(d => d.dayName.includes('Saturday') && d.isToday);
  if (hasSaturdayMatch) {
    notifications.push({
      id: `nudge-${Date.now()}-2`,
      title: '⚡ Matchday Protocol Active',
      body: `Lock in your stadium tunnel vision with 'UNSHAKABLE' before stepping on the bus.`,
      category: 'pre_match',
      timestamp: 'Today 8:00 AM',
      read: false
    });
  }

  // Archetype specific nudge
  notifications.push({
    id: `nudge-${Date.now()}-3`,
    title: `🔥 ${profile.archetype} Daily Rep`,
    body: `${profile.name}, your mental rehearsal is ready. Keep your ${profile.currentStreak}-day composure streak alive today!`,
    category: 'behavioral_nudge',
    timestamp: '2 hours ago',
    read: false
  });

  return notifications;
}
