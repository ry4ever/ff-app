import { describe, it, expect } from 'vitest';
import { generate7DayBlueprint, swapDailySession, importRoutineToSchedule } from '../domain/scheduler';

describe('7-Day Scheduling & Fearless Custom Swapper (Blueprint User Story 3)', () => {
  it('generates a 7-day pre-populated schedule tailored to archetype', () => {
    const schedule = generate7DayBlueprint('Pre-Match Nerves', 'Midfielder', '5x / week');
    expect(schedule).toHaveLength(7);
    expect(schedule[0].sessionId).toBe('nerves-performance');
    expect(schedule[0].durationMinutes).toBe(5);
  });

  it('allows swapping a daily card in Fearless Custom mode (AC 3.1)', () => {
    const original = generate7DayBlueprint('Pre-Match Nerves', 'Midfielder');
    const dayIndexToSwap = 1;

    const modified = swapDailySession(original, dayIndexToSwap, 'ice-cold-finisher');
    expect(modified[dayIndexToSwap].sessionId).toBe('ice-cold-finisher');
    expect(modified[dayIndexToSwap].sessionTitle).toBe('Ice Cold Finisher');
    expect(modified[dayIndexToSwap].isCustomSwap).toBe(true);

    // Verify other days remain unchanged
    expect(modified[0].sessionId).toBe(original[0].sessionId);
  });

  it('imports mentor routines into 7-day HQ calendar', () => {
    const original = generate7DayBlueprint('Pre-Match Nerves', 'Midfielder');
    const mentorRoutineIds = [
      'ice-cold-finisher',
      'better-final-ball',
      'flow-trigger',
      'unshakable',
      'play-your-next-game',
      'enjoyment',
      'back-to-your-best'
    ];

    const imported = importRoutineToSchedule(original, mentorRoutineIds);
    expect(imported[0].sessionId).toBe('ice-cold-finisher');
    expect(imported[1].sessionId).toBe('better-final-ball');
    expect(imported[2].sessionId).toBe('flow-trigger');
  });
});
