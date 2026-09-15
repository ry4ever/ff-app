import { AthleteProfile, TelemetryVerificationResult } from '../types';

export const TELEMETRY_TOLERANCE_SECONDS = 3; // Allow up to 3s buffer for network latency/render
export const JERSEY_STREAK_MILESTONE_DAYS = 45;

/**
 * AC 4.1: Session marked complete only if audio playback duration matches actual file length.
 * Rejects sessions where the athlete scrubbed or skipped ahead.
 */
export function verifyAudioPlaybackTelemetry(
  playedDurationSeconds: number,
  actualFileLengthSeconds: number,
  toleranceSeconds: number = TELEMETRY_TOLERANCE_SECONDS
): TelemetryVerificationResult {
  const roundedPlayed = Math.max(0, Math.floor(playedDurationSeconds));
  const roundedActual = Math.floor(actualFileLengthSeconds);
  const completionPercentage = Math.min(100, Math.round((roundedPlayed / roundedActual) * 100));

  if (roundedPlayed >= roundedActual - toleranceSeconds) {
    return {
      isValid: true,
      playedSeconds: roundedPlayed,
      requiredSeconds: roundedActual,
      completionPercentage: 100,
      message: 'Rehearsal verified. Mental rep fully executed.'
    };
  }

  return {
    isValid: false,
    playedSeconds: roundedPlayed,
    requiredSeconds: roundedActual,
    completionPercentage,
    message: `Incomplete rehearsal: ${roundedPlayed}s / ${roundedActual}s. Composure reps require complete 5-minute immersion.`
  };
}

/**
 * AC 4.2: Hitting a 45-day active streak sets jersey_reward_eligible = true and triggers fulfillment alert.
 */
export function updateStreakAndCheckMilestone(
  profile: AthleteProfile,
  sessionVerified: boolean
): {
  updatedProfile: AthleteProfile;
  milestoneTriggered: boolean;
  alertNotification?: { title: string; body: string };
} {
  if (!sessionVerified) {
    return { updatedProfile: profile, milestoneTriggered: false };
  }

  const newStreak = profile.currentStreak + 1;
  const newLongest = Math.max(newStreak, profile.longestStreak);
  const newComposureScore = Math.min(99, profile.composureScore + 1);

  const reachedJerseyMilestone = newStreak >= JERSEY_STREAK_MILESTONE_DAYS && !profile.jersey_reward_eligible;

  const updatedProfile: AthleteProfile = {
    ...profile,
    currentStreak: newStreak,
    longestStreak: newLongest,
    composureScore: newComposureScore,
    jersey_reward_eligible: profile.jersey_reward_eligible || reachedJerseyMilestone
  };

  let alertNotification;
  if (reachedJerseyMilestone) {
    alertNotification = {
      title: '🏆 FEARLESS STREAK JERSEY UNLOCKED!',
      body: `Alex has reached an incredible 45-Day Active Mental Training Streak! Official Fearless Footballer match jersey fulfillment is now active.`
    };
  } else if (newStreak === 43) {
    // Section 5 behavioral nudge
    alertNotification = {
      title: '🔥 Sideline Status Incoming',
      body: `${profile.name}, you are only 2 reps away from your 45-Day Streak Jersey!`
    };
  }

  return {
    updatedProfile,
    milestoneTriggered: reachedJerseyMilestone,
    alertNotification
  };
}
