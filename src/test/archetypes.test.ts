import { describe, it, expect } from 'vitest';
import { mapBarrierToArchetype } from '../domain/archetypes';

describe('Archetype Allocation Mapping Engine (Blueprint Section 8)', () => {
  it('maps "Pre-Match Nerves" to The Calm Operator', () => {
    const result = mapBarrierToArchetype('Pre-Match Nerves', 'Midfielder');
    expect(result.archetype).toBe('The Calm Operator');
    expect(result.coreSessionId).toBe('nerves-performance');
    expect(result.secondarySessionIds).toEqual(['flow-trigger', 'play-your-next-game']);
  });

  it('maps "The Error Spiral" to The Resilient Bounceback', () => {
    const result = mapBarrierToArchetype('The Error Spiral', 'Defender');
    expect(result.archetype).toBe('The Resilient Bounceback');
    expect(result.coreSessionId).toBe('back-to-your-best');
    expect(result.secondarySessionIds).toEqual(['empowered-thinking', 'enjoyment']);
  });

  it('maps "Form Slump" to The Resilient Bounceback', () => {
    const result = mapBarrierToArchetype('Form Slump', 'Forward');
    expect(result.archetype).toBe('The Resilient Bounceback');
    expect(result.coreSessionId).toBe('back-to-your-best');
    expect(result.secondarySessionIds).toEqual(['enjoyment', 'empowered-thinking']);
  });

  it('maps "Tactical Errors" to Sharp Decision-Maker with positional match session', () => {
    const forwardResult = mapBarrierToArchetype('Tactical Errors', 'Forward');
    expect(forwardResult.archetype).toBe('Sharp Decision-Maker');
    expect(forwardResult.coreSessionId).toBe('ice-cold-finisher');

    const midResult = mapBarrierToArchetype('Tactical Errors', 'Midfielder');
    expect(midResult.archetype).toBe('Sharp Decision-Maker');
    expect(midResult.coreSessionId).toBe('better-final-ball');

    const defResult = mapBarrierToArchetype('Tactical Errors', 'Defender');
    expect(defResult.archetype).toBe('Sharp Decision-Maker');
    expect(defResult.coreSessionId).toBe('defending-with-aggression');
  });

  it('maps "Sideline Distractions" to Unshakable Competitor', () => {
    const result = mapBarrierToArchetype('Sideline Distractions', 'Goalkeeper');
    expect(result.archetype).toBe('Unshakable Competitor');
    expect(result.coreSessionId).toBe('unshakable');
    expect(result.secondarySessionIds).toEqual(['team-mate-6th-sense', 'play-your-next-game']);
  });
});
