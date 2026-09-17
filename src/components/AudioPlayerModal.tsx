import React, { useState, useEffect, useRef } from 'react';
import { useFearless } from '../services/store';
import { SESSION_VARIATION_DETAILS } from '../types';
import {
  Headphones,
  Video,
  X,
  CheckCircle,
  AlertTriangle,
  VolumeX,
  Music,
  Sliders,
  Crosshair,
  Compass,
  Repeat,
  Moon,
  Mic,
  Play,
  Pause
} from 'lucide-react';

interface UnguidedBlock {
  blockNumber: number;
  startSec: number;
  endSec: number;
  cue: string;
}

const getUnguidedBlocks = (duration: number): UnguidedBlock[] => {
  if (duration >= 500) {
    return [
      { blockNumber: 1, startSec: 90, endSec: 135, cue: "Solo Rep 1: Rehearse disguised pass to overlapping runner" },
      { blockNumber: 2, startSec: 270, endSec: 315, cue: "Solo Rep 2: Thread first-time through-ball past defender" },
      { blockNumber: 3, startSec: 450, endSec: 495, cue: "Solo Rep 3: Cutback cross with pinpoint accuracy" },
    ];
  }
  return [
    { blockNumber: 1, startSec: 45, endSec: 90, cue: "Solo Rep 1: Rehearse first touch & body position" },
    { blockNumber: 2, startSec: 135, endSec: 180, cue: "Solo Rep 2: Execute decisive action under pressure" },
    { blockNumber: 3, startSec: 225, endSec: 270, cue: "Solo Rep 3: Lock in peak composure and finish" },
  ];
};

export const AudioPlayerModal: React.FC = () => {
  const {
    activeAudioSession,
    sessionModalStep,
    selectedVariation,
    isMusicEnabled,
    toggleMusic,
    backToVariationSelect,
    closeSession,
    completeRehearsalWithTelemetry
  } = useFearless();

  const [rehearsalMode, setRehearsalMode] = useState<'audio' | 'video'>('audio');
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [telemetryFeedback, setTelemetryFeedback] = useState<{
    success?: boolean;
    message: string;
  } | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isVisible = sessionModalStep === 'active-playback' && activeAudioSession !== null;

  const targetDuration = audioDuration || activeAudioSession?.durationSeconds || 300;
  const variationDetail = SESSION_VARIATION_DETAILS[selectedVariation];
  const unguidedBlocks = getUnguidedBlocks(targetDuration);

  const activeUnguidedBlock = selectedVariation === 'interactive'
    ? unguidedBlocks.find(b => currentSeconds >= b.startSec && currentSeconds < b.endSec)
    : undefined;

  const realAudioUrl = activeAudioSession?.variationAudio
    ? activeAudioSession.variationAudio[selectedVariation][isMusicEnabled ? 'withMusic' : 'withoutMusic']
    : undefined;

  useEffect(() => {
    if (audioRef.current && realAudioUrl) {
      const audio = audioRef.current;
      const prevSec = currentSeconds;

      const handleLoadedMetadata = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setAudioDuration(Math.round(audio.duration));
        }
      };

      const handleTimeUpdate = () => {
        setCurrentSeconds(Math.floor(audio.currentTime));
      };

      const handleEnded = () => {
        setIsPlaying(false);
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);

      if (prevSec > 0 && Math.abs(audio.currentTime - prevSec) > 1) {
        audio.currentTime = prevSec;
      }

      if (isPlaying) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [realAudioUrl, isPlaying]);

  useEffect(() => {
    let timer: any;
    if (!realAudioUrl && isPlaying && isVisible && currentSeconds < targetDuration) {
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
  }, [isPlaying, isVisible, currentSeconds, targetDuration, realAudioUrl]);

  if (!isVisible || !activeAudioSession) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const progressPercent = Math.min(100, Math.round((currentSeconds / targetDuration) * 100));

  const handleTogglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (audioRef.current) {
      if (nextState) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleTestFullCompletion = () => {
    setCurrentSeconds(targetDuration);
    if (audioRef.current) {
      audioRef.current.currentTime = targetDuration;
    }
    const result = completeRehearsalWithTelemetry(targetDuration, targetDuration);
    if (result.isValid) {
      setTelemetryFeedback({
        success: true,
        message: `Rehearsal Complete! Session logged to your streak.`
      });
      setTimeout(() => {
        setTelemetryFeedback(null);
        closeSession();
      }, 1800);
    }
  };

  const handleTestSkipCheat = () => {
    const cheatSeconds = 42;
    setCurrentSeconds(cheatSeconds);
    if (audioRef.current) {
      audioRef.current.currentTime = cheatSeconds;
    }
    const result = completeRehearsalWithTelemetry(cheatSeconds, targetDuration);
    setTelemetryFeedback({
      success: false,
      message: result.message
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      {realAudioUrl && (
        <audio
          ref={audioRef}
          src={realAudioUrl}
          preload="auto"
        />
      )}

      <div
        className={`w-full max-w-md border rounded-3xl p-5 relative overflow-hidden shadow-2xl transition-all duration-500 max-h-[92vh] overflow-y-auto ${
          selectedVariation === 'relaxation'
            ? 'bg-[#070913] border-indigo-950/80 shadow-indigo-950/30'
            : 'bg-brand-dark border-brand-border/80 shadow-brand-blue/20'
        }`}
      >
        {/* Atmosphere Glow */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-3xl rounded-full pointer-events-none ${
            selectedVariation === 'relaxation' ? 'bg-indigo-600/10' : 'bg-brand-blue/10'
          }`}
        />

        {/* Top Control Bar */}
        <div className="flex items-center justify-between relative z-10 mb-3 pb-2.5 border-b border-brand-border/40 gap-2">
          {/* Audio / Video Switcher */}
          <div className="flex bg-brand-card/70 p-0.5 rounded-xl border border-brand-border/60">
            <button
              onClick={() => setRehearsalMode('audio')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                rehearsalMode === 'audio'
                  ? selectedVariation === 'relaxation'
                    ? 'bg-indigo-500 text-white font-black'
                    : 'bg-brand-blue text-black font-black'
                  : 'text-brand-silver hover:text-white'
              }`}
            >
              <Headphones className="w-3 h-3" />
              <span>Audio</span>
            </button>
            <button
              onClick={() => setRehearsalMode('video')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                rehearsalMode === 'video'
                  ? 'bg-brand-cyan text-black font-black'
                  : 'text-brand-silver hover:text-white'
              }`}
            >
              <Video className="w-3 h-3" />
              <span>Video</span>
            </button>
          </div>

          {/* Controls: Music + Adjust + Close */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleMusic}
              className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all ${
                isMusicEnabled
                  ? 'bg-brand-card border-brand-cyan/40 text-brand-cyan'
                  : 'bg-brand-card/60 border-brand-border text-brand-silver hover:text-white'
              }`}
              title={isMusicEnabled ? 'Music: ON' : 'Music: OFF'}
            >
              {isMusicEnabled ? <Music className="w-3 h-3 animate-pulse" /> : <VolumeX className="w-3 h-3" />}
              <span>{isMusicEnabled ? 'Music ON' : 'Muted'}</span>
            </button>

            <button
              onClick={backToVariationSelect}
              className="p-1.5 rounded-lg text-brand-silver hover:text-brand-cyan transition-colors"
              title="Change Variation"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={closeSession}
              className="p-1.5 rounded-lg text-brand-silver hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Session Meta */}
        <div className="text-center relative z-10 mb-3">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded-full border border-brand-cyan/20">
              {activeAudioSession.category}
            </span>
            <span className="text-[9px] font-bold text-white/80 bg-brand-card px-2 py-0.5 rounded-full border border-brand-border">
              {variationDetail.title}
            </span>
          </div>

          <h2 className="text-lg font-black text-white tracking-tight">
            {activeAudioSession.title}
          </h2>
        </div>

        {/* VARIATION ACTIVE CUE BANNER */}
        <div className="relative z-10 mb-3">
          {selectedVariation === 'interactive' && (
            <div
              className={`p-2.5 rounded-xl border transition-all ${
                activeUnguidedBlock
                  ? 'bg-amber-950/40 border-amber-400 text-amber-200 shadow-md shadow-amber-500/10 animate-pulse'
                  : 'bg-brand-card/60 border-brand-border/60 text-brand-silver'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Repeat className={`w-3.5 h-3.5 ${activeUnguidedBlock ? 'text-amber-400' : 'text-brand-cyan'}`} />
                  {activeUnguidedBlock
                    ? `Solo Rep ${activeUnguidedBlock.blockNumber} of 3`
                    : 'Interactive (3 Solo Rep Blocks)'}
                </span>
                {activeUnguidedBlock && (
                  <span className="text-xs font-mono font-black text-amber-400">
                    {activeUnguidedBlock.endSec - currentSeconds}s left
                  </span>
                )}
              </div>
              <p className="text-[11px] text-brand-silver mt-0.5 leading-snug">
                {activeUnguidedBlock
                  ? activeUnguidedBlock.cue
                  : 'Coach guidance active. 3 blocks of 45s will cue your own repetitions.'}
              </p>
            </div>
          )}

          {selectedVariation === 'full-guidance' && (
            <div className="p-2.5 rounded-xl bg-brand-card/60 border border-brand-border/60 text-brand-silver flex items-center gap-2">
              <Mic className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
              <p className="text-[11px] leading-snug">
                Full vocal guidance &bull; Continuous imagery throughout the rehearsal.
              </p>
            </div>
          )}

          {selectedVariation === 'relaxation' && (
            <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-indigo-200/90 flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <p className="text-[11px] leading-snug">
                Relaxation mode &bull; Relax and let the words and frequencies wash over you.
              </p>
            </div>
          )}
        </div>

        {/* Audio Visualizer View */}
        {rehearsalMode === 'audio' && (
          <div className="relative z-10 bg-brand-card/50 border border-brand-border/60 rounded-2xl p-4 mb-3">
            {/* Waveform Bars */}
            <div className="flex items-center justify-between h-14 gap-1 px-1">
              {[40, 70, 30, 85, 55, 95, 65, 80, 35, 90, 75, 45, 60, 80, 50, 85, 65, 40, 90, 55, 35, 75].map((h, i) => {
                const isBarActive = (i / 22) * 100 <= progressPercent;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      activeUnguidedBlock
                        ? 'bg-gradient-to-t from-amber-500 to-amber-300'
                        : selectedVariation === 'relaxation'
                        ? 'bg-gradient-to-t from-indigo-500 to-purple-400'
                        : 'bg-gradient-to-t from-brand-blue to-brand-cyan'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(15, (h * (0.4 + (i % 3) * 0.3)))}%` : '15%',
                      opacity: isBarActive ? 1 : 0.25
                    }}
                  />
                );
              })}
            </div>

            {/* Scrubber */}
            <div className="mt-3">
              <div className="w-full bg-brand-dark/80 h-1.5 rounded-full overflow-hidden border border-brand-border/60 relative">
                {selectedVariation === 'interactive' &&
                  unguidedBlocks.map(block => (
                    <div
                      key={block.blockNumber}
                      className="absolute top-0 bottom-0 bg-amber-400/40 z-10 pointer-events-none"
                      style={{
                        left: `${(block.startSec / targetDuration) * 100}%`,
                        width: `${((block.endSec - block.startSec) / targetDuration) * 100}%`
                      }}
                    />
                  ))}

                <div
                  className={`h-full transition-all duration-300 ${
                    selectedVariation === 'relaxation'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-400'
                      : 'bg-gradient-to-r from-brand-blue to-brand-cyan'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono font-bold text-brand-silver mt-1">
                <span>{formatTime(currentSeconds)}</span>
                <span>{formatTime(targetDuration)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Video Mode View (Native 9:16 Portrait) */}
        {rehearsalMode === 'video' && (
          <div className="relative z-10 bg-black rounded-2xl border border-brand-border overflow-hidden mb-3 group">
            <div className="relative aspect-[9/16] max-h-[42vh] w-full overflow-hidden bg-brand-dark flex items-center justify-center mx-auto">
              {activeAudioSession.videoUrl ? (
                <video
                  src={activeAudioSession.videoUrl}
                  poster={activeAudioSession.videoPosterUrl}
                  playsInline
                  muted={!isMusicEnabled}
                  autoPlay={isPlaying}
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeAudioSession.videoPosterUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80'}
                  alt={activeAudioSession.title}
                  className="w-full h-full object-cover opacity-75"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/60 flex flex-col justify-between p-3 pointer-events-none">
                <span className="flex items-center gap-1 text-[9px] font-bold bg-brand-blue/80 text-white px-2 py-0.5 rounded-full w-fit backdrop-blur-md">
                  <Crosshair className="w-2.5 h-2.5 text-brand-cyan" />
                  Tactical Video
                </span>

                <div className="bg-brand-dark/95 border border-brand-cyan/40 p-2.5 rounded-xl backdrop-blur-md">
                  <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-brand-cyan mb-0.5">
                    <Compass className="w-2.5 h-2.5" />
                    <span>Focus Cue:</span>
                  </div>
                  <p className="text-[10px] font-medium text-white">
                    {activeUnguidedBlock ? activeUnguidedBlock.cue : 'Scan passing lanes & execute decisive ball.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-brand-card">
              <div className="w-full bg-brand-dark h-1.5 rounded-full overflow-hidden border border-brand-border">
                <div
                  className="h-full bg-gradient-to-r from-brand-cyan to-brand-blue"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-brand-silver mt-1">
                <span>{formatTime(currentSeconds)}</span>
                <span>{formatTime(targetDuration)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Telemetry Alert Message */}
        {telemetryFeedback && (
          <div
            className={`relative z-10 p-2.5 rounded-xl mb-3 text-xs font-medium flex items-center gap-2 border ${
              telemetryFeedback.success
                ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-950/50 border-amber-500/30 text-amber-300'
            }`}
          >
            {telemetryFeedback.success ? (
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            )}
            <span className="text-[11px] leading-tight">{telemetryFeedback.message}</span>
          </div>
        )}

        {/* Player Controls Bar */}
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className="py-3 px-4 rounded-2xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-brand-cyan" /> : <Play className="w-4 h-4 text-brand-cyan fill-brand-cyan" />}
              <span>{isPlaying ? 'Pause' : 'Resume'}</span>
            </button>

            <button
              onClick={handleTestFullCompletion}
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-blue to-brand-cyan text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-95 shadow-md shadow-brand-blue/20 transition-all active:scale-[0.98]"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete Session</span>
            </button>
          </div>

          {/* Discreet Verification Link (unobtrusive) */}
          <button
            onClick={handleTestSkipCheat}
            className="w-full text-center text-[10px] text-brand-silver/50 hover:text-amber-400 transition-colors pt-1"
          >
            Test telemetry skip guard (0:42)
          </button>
        </div>
      </div>
    </div>
  );
};
