import React, { useState, useEffect } from 'react';
import { useFearless } from '../services/store';
import { Headphones, X, CheckCircle, AlertTriangle, Activity, Volume2 } from 'lucide-react';

export const AudioPlayerModal: React.FC = () => {
  const { activeAudioSession, setActiveAudioSession, completeRehearsalWithTelemetry } = useFearless();

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
    // Simulate authentic 300-second session completion
    setCurrentSeconds(targetDuration);
    const result = completeRehearsalWithTelemetry(targetDuration, targetDuration);
    if (result.isValid) {
      setTelemetryFeedback({
        success: true,
        message: 'Telemetry Verified: Full 5-Minute Audio Rehearsal logged! Composure streak ticked up.'
      });
      setTimeout(() => {
        setTelemetryFeedback(null);
        setActiveAudioSession(null);
      }, 2000);
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
      <div className="w-full max-w-md bg-brand-dark border border-brand-border rounded-3xl p-6 relative overflow-hidden shadow-2xl shadow-brand-blue/30">
        {/* Background Atmosphere */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-40 bg-brand-blue/15 blur-3xl rounded-full pointer-events-none" />

        {/* Top Controls */}
        <div className="flex items-center justify-between relative z-10 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 px-3 py-1 rounded-full">
            <Headphones className="w-3.5 h-3.5" />
            <span>Stereo Audio Rehearsal</span>
          </div>
          <button
            onClick={() => setActiveAudioSession(null)}
            className="w-8 h-8 rounded-full bg-brand-card hover:bg-brand-cardHover border border-brand-border flex items-center justify-center text-brand-silver hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Session Meta */}
        <div className="text-center relative z-10 mb-6">
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand-silver">
            {activeAudioSession.category}
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            {activeAudioSession.title}
          </h2>
          <p className="text-xs text-brand-silver/90 mt-2 px-4 leading-relaxed">
            {activeAudioSession.productNarrative}
          </p>
        </div>

        {/* Dynamic Binaural Waveform Visualizer */}
        <div className="relative z-10 bg-brand-card/80 border border-brand-border rounded-2xl p-5 mb-6">
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
              <span>{isPlaying ? 'Pause Audio' : 'Resume Audio'}</span>
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
