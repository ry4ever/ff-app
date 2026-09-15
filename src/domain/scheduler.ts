import { ArchetypeRule, mapBarrierToArchetype } from './archetypes';
import { getVaultSessionById } from './vault';
import { Barrier, DaySchedule, Position, TrainingFrequency } from '../types';

const DAY_NAMES = [
  { name: 'Monday', short: 'MON' },
  { name: 'Tuesday', short: 'TUE' },
  { name: 'Wednesday', short: 'WED' },
  { name: 'Thursday', short: 'THU' },
  { name: 'Friday', short: 'FRI' },
  { name: 'Saturday (Matchday)', short: 'SAT' },
  { name: 'Sunday (Recovery)', short: 'SUN' },
];

export function generate7DayBlueprint(
  barrier: Barrier,
  position: Position = 'Midfielder',
  frequency: TrainingFrequency = '5x / week'
): DaySchedule[] {
  const rule: ArchetypeRule = mapBarrierToArchetype(barrier, position);
  const coreSession = getVaultSessionById(rule.coreSessionId)!;
  const secondary1 = getVaultSessionById(rule.secondarySessionIds[0]) || coreSession;
  const secondary2 = getVaultSessionById(rule.secondarySessionIds[1]) || coreSession;
  const matchDayPrep = getVaultSessionById('unshakable') || coreSession;
  const enjoyment = getVaultSessionById('enjoyment') || coreSession;

  // 7-day plan structure tailored to match week
  // Mon: Core archetype training
  // Tue: Secondary 1 (Cognitive sharpening)
  // Wed: Secondary 2 (Flow trigger or positional)
  // Thu: Reinforce Core
  // Fri: Match Eve Walkthrough (Play your next game / match day prep)
  // Sat: Matchday Composure (Unshakable / Nerves = Performance)
  // Sun: Mental Recovery & Joy (Enjoyment / Back to your best)

  const scheduleTemplate = [
    coreSession,                                          // Monday
    secondary1,                                           // Tuesday
    secondary2,                                           // Wednesday
    coreSession,                                          // Thursday
    getVaultSessionById('play-your-next-game') || matchDayPrep, // Friday
    matchDayPrep,                                         // Saturday (Matchday)
    enjoyment                                             // Sunday
  ];

  // If frequency is 3x/week, set rest/optional days
  const activeDayIndices = frequency === '3x / week' 
    ? [0, 2, 5] 
    : frequency === '5x / week' 
      ? [0, 1, 2, 3, 5] 
      : [0, 1, 2, 3, 4, 5, 6];

  const todayDayOfWeek = new Date().getDay(); // 0 = Sun, 1 = Mon ...
  // Remap so Monday = index 0, Sunday = index 6
  const adjustedTodayIndex = todayDayOfWeek === 0 ? 6 : todayDayOfWeek - 1;

  return DAY_NAMES.map((d, index) => {
    const session = scheduleTemplate[index % scheduleTemplate.length];
    const isTargetDay = activeDayIndices.includes(index);

    return {
      dayIndex: index,
      dayName: d.name,
      dayShort: d.short,
      sessionId: session.id,
      sessionTitle: session.title,
      category: session.category,
      durationMinutes: 5,
      actualDurationSeconds: session.durationSeconds,
      isCompleted: index < adjustedTodayIndex && isTargetDay, // Past days mock completed for demonstration
      isToday: index === adjustedTodayIndex,
      isCustomSwap: false
    };
  });
}

export function swapDailySession(
  currentSchedule: DaySchedule[],
  targetDayIndex: number,
  newSessionId: string
): DaySchedule[] {
  const newSession = getVaultSessionById(newSessionId);
  if (!newSession) return currentSchedule;

  return currentSchedule.map(day => {
    if (day.dayIndex === targetDayIndex) {
      return {
        ...day,
        sessionId: newSession.id,
        sessionTitle: newSession.title,
        category: newSession.category,
        actualDurationSeconds: newSession.durationSeconds,
        isCustomSwap: true
      };
    }
    return day;
  });
}

export function importRoutineToSchedule(
  currentSchedule: DaySchedule[],
  importedSessionIds: string[]
): DaySchedule[] {
  return currentSchedule.map((day, index) => {
    const importedId = importedSessionIds[index % importedSessionIds.length];
    const session = getVaultSessionById(importedId);
    if (!session) return day;

    return {
      ...day,
      sessionId: session.id,
      sessionTitle: session.title,
      category: session.category,
      actualDurationSeconds: session.durationSeconds,
      isCustomSwap: true
    };
  });
}
