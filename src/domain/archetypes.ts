import { Archetype, Barrier, Position } from '../types';

export interface ArchetypeRule {
  archetype: Archetype;
  coreSessionId: string;
  secondarySessionIds: string[];
  description: string;
  tagline: string;
}

export function resolvePositionalMatchSession(position: Position): string {
  switch (position) {
    case 'Forward':
      return 'ice-cold-finisher';
    case 'Midfielder':
      return 'better-final-ball';
    case 'Defender':
    case 'Goalkeeper':
      return 'defending-with-aggression';
    default:
      return 'better-final-ball';
  }
}

export function mapBarrierToArchetype(barrier: Barrier, position: Position = 'Midfielder'): ArchetypeRule {
  switch (barrier) {
    case 'Pre-Match Nerves':
      return {
        archetype: 'The Calm Operator',
        coreSessionId: 'nerves-performance',
        secondarySessionIds: ['flow-trigger', 'play-your-next-game'],
        description: 'Transforms pre-kickoff tension and nervous adrenaline into explosive focus and cold decision-making.',
        tagline: 'Composure under fire. Pressure turned to fuel.'
      };

    case 'The Error Spiral':
      return {
        archetype: 'The Resilient Bounceback',
        coreSessionId: 'back-to-your-best',
        secondarySessionIds: ['empowered-thinking', 'enjoyment'],
        description: 'Neutralizes post-mistake frustration instantly, establishing a 3-second cognitive reset after every turnover.',
        tagline: 'Zero lag between setback and standard.'
      };

    case 'Form Slump':
      return {
        archetype: 'The Resilient Bounceback',
        coreSessionId: 'back-to-your-best',
        secondarySessionIds: ['enjoyment', 'empowered-thinking'],
        description: 'Breaks the cautious, over-defensive hesitation cycle and reactivates peak instinctual confidence.',
        tagline: 'Instant mental reboot to peak highlight reel.'
      };

    case 'Tactical Errors': {
      const corePositional = resolvePositionalMatchSession(position);
      return {
        archetype: 'Sharp Decision-Maker',
        coreSessionId: corePositional,
        secondarySessionIds: ['better-final-ball', 'flow-trigger'],
        description: 'Sharpens spatial awareness, speed of thought, and decisive execution in high-leverage match moments.',
        tagline: 'See the game a second faster than opponents.'
      };
    }

    case 'Sideline Distractions':
      return {
        archetype: 'Unshakable Competitor',
        coreSessionId: 'unshakable',
        secondarySessionIds: ['team-mate-6th-sense', 'play-your-next-game'],
        description: 'Builds an impenetrable psychological wall against aggressive crowds, referee mistakes, and sideline noise.',
        tagline: 'Total immersion. Complete stadium tunnel vision.'
      };

    default:
      return {
        archetype: 'The Calm Operator',
        coreSessionId: 'nerves-performance',
        secondarySessionIds: ['flow-trigger', 'play-your-next-game'],
        description: 'Baseline composure and nervous system mastery.',
        tagline: 'Composure under fire.'
      };
  }
}
