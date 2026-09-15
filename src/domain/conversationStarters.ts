import { ConversationStarter, VaultSession } from '../types';
import { getVaultSessionById } from './vault';

export const CONVERSATION_TEMPLATES: Record<string, { headline: string; promptText: string; suggestedQuestion: string }> = {
  'ice-cold-finisher': {
    headline: 'Composure in the Box',
    promptText: 'Alex practiced clinical, ice-cold finishing under defensive pressure today.',
    suggestedQuestion: 'Ask them: "When you had a chance in front of goal today, what cue helped you stay calm instead of rushing your shot?"'
  },
  'enjoyment': {
    headline: 'Reconnecting With Love of the Game',
    promptText: 'Alex rehearsed playing with pure intrinsic freedom and childhood joy.',
    suggestedQuestion: 'Ask them: "What was the most fun moment you had on the ball today, just for the love of playing?"'
  },
  'back-to-your-best': {
    headline: 'Erasing Recent Frustration',
    promptText: "Alex practiced the cognitive highlight reel to wipe away cautious, over-defensive hesitation.",
    suggestedQuestion: 'Ask them: "What was one decisive play you made today where you trusted your instincts without hesitating?"'
  },
  'empowered-thinking': {
    headline: 'The 3-Second Reset Rule',
    promptText: 'Alex trained how to turn turnovers and referee errors directly into fuel without dropping their head.',
    suggestedQuestion: 'Ask them: "When something did not go your way today, how quickly were you able to switch right back into the next play?"'
  },
  'nerves-performance': {
    headline: 'Fueling Up With Adrenaline',
    promptText: 'Alex reframed nervous pre-match butterflies as a sign of their body preparing for peak speed and alertness.',
    suggestedQuestion: 'Ask them: "How did your energy feel before kickoff today? Did you feel that extra sharpness kicking in?"'
  },
  'unshakable': {
    headline: 'Stadium Tunnel Vision',
    promptText: 'Alex practiced locking out aggressive opponents, crowd volume, and sideline chatter.',
    suggestedQuestion: 'Ask them: "What distraction or sideline noise did you notice yourself completely ignoring during the game?"'
  },
  'defending-with-aggression': {
    headline: 'Dominating Duels With Discipline',
    promptText: 'Alex rehearsed high-intensity defensive timing and spatial body positioning.',
    suggestedQuestion: 'Ask them: "How did your physical timing feel when stepping into 50/50 duels today?"'
  },
  'better-final-ball': {
    headline: 'Vision in the Final Third',
    promptText: 'Alex conditioned split-second peripheral vision to pick out key passes under tight marking.',
    suggestedQuestion: 'Ask them: "Did you spot any passing lanes today before your opponents even realized you were looking?"'
  },
  'flow-trigger': {
    headline: 'The Two-Word Performance Blueprint',
    promptText: 'Alex rehearsed their personal two-word trigger to instantly enter an instinctive flow state.',
    suggestedQuestion: 'Ask them: "Did you get into the zone during training? What two words were repeating in your mind?"'
  },
  'team-mate-6th-sense': {
    headline: 'Anticipating Team Movement',
    promptText: 'Alex trained third-man runs and pre-match synchronization with their teammates.',
    suggestedQuestion: 'Ask them: "Who was one teammate you felt completely in sync with today on blindside runs?"'
  },
  'play-your-next-game': {
    headline: 'Visualizing Tomorrow’s Match',
    promptText: 'Alex ran mental repetitions of decisive actions against upcoming match scenarios.',
    suggestedQuestion: 'Ask them: "What specific match scenario from your visualization came to life on the pitch today?"'
  }
};

export function createConversationStarter(
  athleteId: string,
  athleteName: string,
  session: VaultSession
): ConversationStarter {
  const template = CONVERSATION_TEMPLATES[session.id] || {
    headline: `${session.title} Focus`,
    promptText: `${athleteName} completed the mental rehearsal for ${session.title}.`,
    suggestedQuestion: `Ask them: "What was your biggest takeaway from today's mental training session?"`
  };

  return {
    id: `starter-${Date.now()}`,
    athleteId,
    sessionId: session.id,
    sessionTitle: session.title,
    headline: template.headline,
    promptText: template.promptText.replace(/Alex/g, athleteName),
    suggestedQuestion: template.suggestedQuestion,
    completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    category: session.category
  };
}

export function getDefaultConversationStarter(athleteName: string = 'Alex'): ConversationStarter {
  const session = getVaultSessionById('unshakable')!;
  return createConversationStarter('athlete-default', athleteName, session);
}
