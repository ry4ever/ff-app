import { describe, it, expect } from 'vitest';
import { createConversationStarter } from '../domain/conversationStarters';
import { getVaultSessionById } from '../domain/vault';

describe('Dynamic Conversation Starter Generator (Blueprint Scenario A)', () => {
  it('generates context-aware discussion prompt derived from "UNSHAKABLE"', () => {
    const session = getVaultSessionById('unshakable')!;
    const starter = createConversationStarter('athlete-1', 'Alex', session);

    expect(starter.headline).toBe('Stadium Tunnel Vision');
    expect(starter.promptText).toContain('Alex practiced locking out aggressive opponents');
    expect(starter.suggestedQuestion).toContain('What distraction or sideline noise did you notice yourself completely ignoring');
  });

  it('generates context-aware prompt for "Nerves = Performance"', () => {
    const session = getVaultSessionById('nerves-performance')!;
    const starter = createConversationStarter('athlete-2', 'Jordan', session);

    expect(starter.headline).toBe('Fueling Up With Adrenaline');
    expect(starter.promptText).toContain('Jordan reframed nervous pre-match butterflies');
    expect(starter.suggestedQuestion).toContain('How did your energy feel before kickoff today?');
  });

  it('generates 3-second reset prompt for "Empowered Thinking"', () => {
    const session = getVaultSessionById('empowered-thinking')!;
    const starter = createConversationStarter('athlete-1', 'Alex', session);

    expect(starter.headline).toBe('The 3-Second Reset Rule');
    expect(starter.suggestedQuestion).toContain('how quickly were you able to switch right back into the next play?');
  });
});
