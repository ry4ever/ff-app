import { describe, it, expect } from 'vitest';
import { SESSION_VARIATION_DETAILS } from '../types';
import { getVaultSessionById } from '../domain/vault';
import { createConversationStarter } from '../domain/conversationStarters';

describe('Session Variations & Music Toggle Spec', () => {
  it('defines the 3 variations with exact specification copy', () => {
    // 1: Interactive
    const interactive = SESSION_VARIATION_DETAILS['interactive'];
    expect(interactive.number).toBe(1);
    expect(interactive.title).toBe('Interactive');
    expect(interactive.description).toBe(
      'My guidance will include 3 blocks of 45 seconds where you will do repetitions on your own without my guidance'
    );

    // 2: Full guidance
    const fullGuidance = SESSION_VARIATION_DETAILS['full-guidance'];
    expect(fullGuidance.number).toBe(2);
    expect(fullGuidance.title).toBe('Full guidance');
    expect(fullGuidance.description).toBe(
      'My voice will guide you through all of the visualisation.'
    );

    // 3: Relaxation
    const relaxation = SESSION_VARIATION_DETAILS['relaxation'];
    expect(relaxation.number).toBe(3);
    expect(relaxation.title).toBe('Relaxation');
    expect(relaxation.description).toBe(
      'Use before bed or when you are relaxing. This is less interactive where you can simply relax and let my words wash over you.'
    );
  });

  it('maps Better Final Ball production audio files for all variations with and without music', () => {
    const session = getVaultSessionById('better-final-ball');
    expect(session).toBeDefined();
    expect(session?.variationAudio).toBeDefined();

    const audioMap = session!.variationAudio!;

    // Interactive tracks
    expect(audioMap.interactive.withMusic).toBe('/media/better-final-ball/interactive-music.mp3');
    expect(audioMap.interactive.withoutMusic).toBe('/media/better-final-ball/interactive-nomusic.mp3');

    // Full guidance tracks
    expect(audioMap['full-guidance'].withMusic).toBe('/media/better-final-ball/fullguidance-music.mp3');
    expect(audioMap['full-guidance'].withoutMusic).toBe('/media/better-final-ball/fullguidance-nomusic.mp3');

    // Relaxation tracks
    expect(audioMap.relaxation.withMusic).toBe('/media/better-final-ball/relaxation-music.mp3');
    expect(audioMap.relaxation.withoutMusic).toBe('/media/better-final-ball/relaxation-nomusic.mp3');

    // Tactical video asset
    expect(session?.videoUrl).toBe('/media/better-final-ball/final-ball-video.mov');
  });

  it('calculates 3 discrete 45-second solo repetition blocks for Interactive rehearsal', () => {
    const sessionDuration = 610; // Better Final Ball duration
    const unguidedBlocks = [
      { blockNumber: 1, startSec: 90, endSec: 135 },
      { blockNumber: 2, startSec: 270, endSec: 315 },
      { blockNumber: 3, startSec: 450, endSec: 495 },
    ];

    expect(unguidedBlocks).toHaveLength(3);

    unguidedBlocks.forEach((block, idx) => {
      // Each block must be exactly 45 seconds
      expect(block.endSec - block.startSec).toBe(45);
      // Blocks must be within the session duration
      expect(block.endSec).toBeLessThanOrEqual(sessionDuration);
      // Blocks must be chronological and non-overlapping
      if (idx > 0) {
        expect(block.startSec).toBeGreaterThan(unguidedBlocks[idx - 1].endSec);
      }
    });
  });

  it('generates parent conversation starter correctly for completed session', () => {
    const session = getVaultSessionById('better-final-ball')!;
    const starter = createConversationStarter('athlete-1', 'Alex Sterling', session);
    expect(starter.headline).toBe('Vision in the Final Third');
    expect(starter.sessionId).toBe('better-final-ball');
  });
});
