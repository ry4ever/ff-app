import { describe, it, expect } from 'vitest';
import { updateStreakAndCheckMilestone } from '../domain/telemetry';
import { AthleteProfile } from '../types';

const MOCK_PROFILE: AthleteProfile = {
  id: 'test-athlete',
  userId: 'user-1',
  name: 'Alex',
  position: 'Midfielder',
  matchTarget: 'Upcoming League Match',
  mainBarrier: 'Pre-Match Nerves',
  level: 'Competitive Travel',
  frequency: '5x / week',
  archetype: 'The Calm Operator',
  onboarding_completed: true,
  composureScore: 85,
  currentStreak: 44, // 1 day away from milestone
  longestStreak: 44,
  jersey_reward_eligible: false,
  activeSchedule: [],
  isCustomMode: false
};

describe('Streak Telemetry & Jersey Milestone (Blueprint AC 4.2)', () => {
  it('does not trigger milestone when session is rejected', () => {
    const result = updateStreakAndCheckMilestone(MOCK_PROFILE, false);
    expect(result.milestoneTriggered).toBe(false);
    expect(result.updatedProfile.currentStreak).toBe(44);
    expect(result.updatedProfile.jersey_reward_eligible).toBe(false);
  });

  it('triggers jersey_reward_eligible = true on day 45 completion', () => {
    const result = updateStreakAndCheckMilestone(MOCK_PROFILE, true);
    expect(result.updatedProfile.currentStreak).toBe(45);
    expect(result.milestoneTriggered).toBe(true);
    expect(result.updatedProfile.jersey_reward_eligible).toBe(true);
    expect(result.alertNotification?.title).toContain('JERSEY UNLOCKED');
  });

  it('fires behavioral nudge alert when approaching streak milestone (day 43)', () => {
    const profileAt42: AthleteProfile = {
      ...MOCK_PROFILE,
      currentStreak: 42
    };
    const result = updateStreakAndCheckMilestone(profileAt42, true);
    expect(result.updatedProfile.currentStreak).toBe(43);
    expect(result.milestoneTriggered).toBe(false);
    expect(result.alertNotification?.body).toContain('2 reps away');
  });
});
