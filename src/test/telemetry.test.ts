import { describe, it, expect } from 'vitest';
import { verifyAudioPlaybackTelemetry } from '../domain/telemetry';

describe('Audio Playback Telemetry Guard (Blueprint AC 4.1)', () => {
  const FILE_LENGTH_SECONDS = 300; // 5 minutes standard rehearsal

  it('marks session complete when full audio duration is played', () => {
    const result = verifyAudioPlaybackTelemetry(300, FILE_LENGTH_SECONDS);
    expect(result.isValid).toBe(true);
    expect(result.completionPercentage).toBe(100);
    expect(result.message).toContain('verified');
  });

  it('allows small network latency / buffer tolerance (e.g. 298s)', () => {
    const result = verifyAudioPlaybackTelemetry(298, FILE_LENGTH_SECONDS, 3);
    expect(result.isValid).toBe(true);
    expect(result.completionPercentage).toBe(100);
  });

  it('strictly rejects early skip or scrubbing ahead (e.g. 45s out of 300s)', () => {
    const result = verifyAudioPlaybackTelemetry(45, FILE_LENGTH_SECONDS);
    expect(result.isValid).toBe(false);
    expect(result.completionPercentage).toBe(15);
    expect(result.message).toContain('Incomplete rehearsal');
  });

  it('strictly rejects zero or minimal playback (e.g. 5s)', () => {
    const result = verifyAudioPlaybackTelemetry(5, FILE_LENGTH_SECONDS);
    expect(result.isValid).toBe(false);
    expect(result.completionPercentage).toBe(2);
  });
});
