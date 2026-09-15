import React, { useState, useEffect } from 'react';
import { useFearless } from '../services/store';
import {
  Headphones,
  Video,
  X,
  CheckCircle,
  AlertTriangle,
  Activity,
  Volume2,
  Maximize2,
  Crosshair,
  Compass
} from 'lucide-react';

export const AudioPlayerModal: React.FC = () => {
  const { activeAudioSession, setActiveAudioSession, completeRehearsalWithTelemetry } = useFearless();

  const [rehearsalMode, setRehearsalMode] = useState<'audio' | 'video'>('audio');
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [telemetryFeedback, setTelemetryFeedback] = useState<{
    success?: boolean;
    message: string;
  } | null>(null);

  const targetDuration = activeAudioSession?.durationSeconds || 300;

  // Real-time playback timer simulation
  useEffect(() => {
    let timer: any;
    if (isPlaying && activeAudioSession && currentSeconds < targetDuration) {
      timer = setInterval(() => {
        setCurrentSeconds(prev => {
          if (prev + 1 >= targetDuration) {
            clearInterval(timer);
            return targetDuration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeAudioSession, currentSeconds, targetDuration]);

  if (!activeAudioSession) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const progressPercent = Math.min(100, Math.round((currentSeconds / targetDuration) * 100));

  const handleTestFullCompletion = () => {
    // Simulate authentic 300-second session completion in either audio or video
    setCurrentSeconds(targetDuration);
    const result = completeRehearsalWithTelemetry(targetDuration, targetDuration);
    if (result.isValid) {
      setTelemetryFeedback({
        success: true,
        message: `Telemetry Verified: Full 5-Minute ${rehearsalMode === 'video' ? 'Video Tactical Walkthrough' : 'Audio Rehearsal'} logged! Composure streak ticked up.`
      });
      setTimeout(() => {
        setTelemetryFeedback(null);
        setActiveAudioSession(null);
      }, 2200);
    }
  };

  const handleTestSkipCheat = () => {
    // Attempt cheating by skipping early (e.g. 42 seconds)
    const cheatSeconds = 42;
    setCurrentSeconds(cheatSeconds);
    const result = completeRehearsalWithTelemetry(cheatSeconds, targetDuration);
    setTelemetryFeedback({
      success: false,
      message: `[AC 4.1 Telemetry Guard Triggered]: ${result.message}`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-brand-dark border border-brand-border rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-2xl shadow-brand-blue/30 max-h-[92vh] overflow-y-auto">
        {/* Background Atmosphere */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-40 bg-brand-blue/15 blur-3xl rounded-full pointer-events-none" />

        {/* Top Bar: Dual Mode Switcher (Audio <-> Video) */}
        <div className="flex items-center justify-between relative z-10 mb-4 pb-2 border-b border-brand-border/60">
          <div className="flex bg-brand-card p-1 rounded-xl border border-brand-border">
            <button
              onClick={() => setRehearsalMode('audio')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                rehearsalMode === 'audio'
                  ? 'bg-brand-blue text-black shadow-sm'
                  : 'text-brand-silver hover:text-white'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Audio (Headphones)</span>
            </button>
            <button
              onClick={() => setRehearsalMode('video')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                rehearsalMode === 'video'
                  ? 'bg-brand-cyan text-black shadow-sm'
                  : 'text-brand-silver hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Tactical Video</span>
            </button>
          </div>

          <button
            onClick={() => setActiveAudioSession(null)}
            className="w-8 h-8 rounded-full bg-brand-card hover:bg-brand-cardHover border border-brand-border flex items-center justify-center text-brand-silver hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Session Meta */}
        <div className="text-center relative z-10 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-cyan">
            {activeAudioSession.category} &bull; {rehearsalMode === 'video' ? 'Tactical Video Walkthrough' : 'Visual Rehearsal'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
            {activeAudioSession.title}
          </h2>
          <p className="text-xs text-brand-silver/90 mt-1 px-4 leading-relaxed">
            {activeAudioSession.productNarrative}
          </p>
        </div>

        {/* MODE 1: AUDIO REHEARSAL WITH BINAURAL VISUALIZER */}
        {rehearsalMode === 'audio' && (
          <div className="relative z-10 bg-brand-card/80 border border-brand-border rounded-2xl p-4 sm:p-5 mb-5">
            <div className="flex items-center justify-between text-[11px] text-brand-silver mb-3">
              <span className="flex items-center gap-1.5 font-semibold text-brand-cyan">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                {activeAudioSession.waveformType || 'binaural-alpha'} frequency
              </span>
              <span className="font-mono text-white font-bold">{progressPercent}%</span>
            </div>

            {/* Animated Waveform Bars */}
            <div className="flex items-center justify-between h-16 gap-1 px-1">
              {[45, 75, 30, 90, 60, 100, 70, 85, 40, 95, 80, 50, 65, 85, 55, 90, 70, 45, 95, 60, 40, 80].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-brand-blue to-brand-cyan rounded-full transition-all duration-300"
                  style={{
                    height: isPlaying ? `${Math.max(15, (h * (0.4 + (i % 3) * 0.3)))}%` : '15%',
                    opacity: (i / 22) * 100 <= progressPercent ? 1 : 0.35
                  }}
                />
              ))}
            </div>

            {/* Progress Scrubber */}
            <div className="mt-4">
              <div className="w-full bg-brand-dark/80 h-2 rounded-full overflow-hidden border border-brand-border">
                <div
                  className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan transition-all duration-300 shadow-[0_0_10px_#69E0FA]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono font-bold text-brand-silver mt-1.5">
                <span>{formatTime(currentSeconds)}</span>
                <span>{formatTime(targetDuration)} (5:00)</span>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: TACTICAL VIDEO REHEARSAL PLAYER */}
        {rehearsalMode === 'video' && (
          <div className="relative z-10 bg-black rounded-2xl border border-brand-border overflow-hidden mb-5 group">
            <div className="relative aspect-video w-full overflow-hidden bg-brand-dark">
              {/* Simulated Tactical Video Poster & Overlay */}
              <img
                src={activeAudioSession.videoPosterUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80'}
                alt={activeAudioSession.title}
                className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-all duration-500"
              />

              {/* Tactical Visual Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 flex flex-col justify-between p-3.5">
                {/* Top overlay tags */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[10px] font-extrabold bg-brand-blue/80 text-white px-2.5 py-1 rounded-full backdrop-blur-md">
                    <Crosshair className="w-3 h-3 text-brand-cyan" />
                    Tactical Visual Priming
                  </span>
                  <button className="p-1 rounded-lg bg-black/60 text-white hover:text-brand-cyan">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Tactical Decision Prompt Box */}
                <div className="bg-brand-dark/90 border border-brand-cyan/40 p-3 rounded-xl backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-cyan mb-0.5">
                    <Compass className="w-3 h-3" />
                    <span>Split-Second Focus Cue:</span>
                  </div>
                  <p className="text-[11px] font-semibold text-white">
                    Scan keeper weight on back foot $\rightarrow$ Lock decisive strike without hesitation.
                  </p>
                </div>
              </div>
            </div>

            {/* Video Progress Scrubber */}
            <div className="p-3 bg-brand-card">
              <div className="w-full bg-brand-dark h-2 rounded-full overflow-hidden border border-brand-border">
                <div
                  className="h-full bg-gradient-to-r from-brand-cyan to-brand-blue transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono font-bold text-brand-silver mt-1.5">
                <span className="text-brand-cyan">{formatTime(currentSeconds)}</span>
                <span>{formatTime(targetDuration)} (5:00)</span>
              </div>
            </div>
          </div>
        )}

        {/* Telemetry Guard Feedback Alert */}
        {telemetryFeedback && (
          <div
            className={`relative z-10 p-3 rounded-xl mb-4 text-xs font-semibold flex items-start gap-2.5 border ${
              telemetryFeedback.success
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
            }`}
          >
            {telemetryFeedback.success ? (
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            )}
            <p className="leading-snug">{telemetryFeedback.message}</p>
          </div>
        )}

        {/* Player Controls & AC 4.1 Telemetry Simulation */}
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex-1 py-3 px-4 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Volume2 className="w-4 h-4 text-brand-cyan" />
              <span>{isPlaying ? 'Pause Playback' : 'Resume Playback'}</span>
            </button>

            <button
              onClick={handleTestFullCompletion}
              className="flex-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-black font-extrabold text-xs flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-brand-blue/30 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete Rep (5:00)</span>
            </button>
          </div>

          {/* Test Guard Button (AC 4.1 Demonstration) */}
          <button
            onClick={handleTestSkipCheat}
            className="w-full py-2 px-3 rounded-lg bg-black/40 hover:bg-black/60 border border-brand-border/60 text-brand-silver hover:text-amber-400 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Test AC 4.1 Guard (Simulate Skip Cheat to 0:42)</span>
          </button>
        </div>

        {/* Target Hook Reminder */}
        <div className="mt-4 pt-3 border-t border-brand-border/60 text-center">
          <p className="text-[10px] text-brand-silver/80 italic">
            &ldquo;{activeAudioSession.targetHook}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};
