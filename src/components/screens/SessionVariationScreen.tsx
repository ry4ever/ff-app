import React from 'react';
import { useFearless } from '../../services/store';
import { SESSION_VARIATION_DETAILS, SessionVariation } from '../../types';
import {
  X,
  Play,
  VolumeX,
  Music,
  Activity,
  Mic,
  Moon,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const SessionVariationScreen: React.FC = () => {
  const {
    sessionModalStep,
    selectedSessionForSetup,
    selectedVariation,
    setSelectedVariation,
    isMusicEnabled,
    toggleMusic,
    startSessionPlayback,
    closeSession
  } = useFearless();

  if (sessionModalStep !== 'select-variation' || !selectedSessionForSetup) return null;

  const session = selectedSessionForSetup;
  const variationList: SessionVariation[] = ['interactive', 'full-guidance', 'relaxation'];

  const getVariationIcon = (id: SessionVariation) => {
    switch (id) {
      case 'interactive':
        return <Activity className="w-4 h-4 text-brand-cyan" />;
      case 'full-guidance':
        return <Mic className="w-4 h-4 text-brand-blue" />;
      case 'relaxation':
        return <Moon className="w-4 h-4 text-indigo-300" />;
    }
  };

  const getBadgeText = (id: SessionVariation) => {
    switch (id) {
      case 'interactive':
        return '3 × 45s Reps';
      case 'full-guidance':
        return 'Continuous Voice';
      case 'relaxation':
        return 'Bedtime & Recovery';
    }
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-brand-dark border border-brand-border/80 rounded-3xl p-5 relative overflow-hidden shadow-2xl shadow-brand-blue/15 max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Atmosphere Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-brand-blue/10 blur-3xl rounded-full pointer-events-none" />

        {/* Top Header & Close */}
        <div className="flex items-center justify-between relative z-10 pb-3 border-b border-brand-border/40 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded-full border border-brand-cyan/20">
              {session.category}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-brand-silver">
              <Clock className="w-3 h-3 text-brand-cyan" />
              {formatDuration(session.durationSeconds)}
            </span>
          </div>

          <button
            onClick={closeSession}
            className="w-7 h-7 rounded-full bg-brand-card hover:bg-brand-cardHover border border-brand-border/60 flex items-center justify-center text-brand-silver hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Session Title */}
        <div className="relative z-10 mb-4">
          <h2 className="text-xl font-black text-white tracking-tight">
            {session.title}
          </h2>
          <p className="text-xs text-brand-silver/90 mt-1 line-clamp-2 leading-relaxed">
            {session.productNarrative}
          </p>
        </div>

        {/* Variations Section */}
        <div className="relative z-10 space-y-2 mb-4">
          <label className="text-[10px] font-black uppercase tracking-wider text-brand-silver block px-1">
            Choose Variation
          </label>

          <div className="space-y-2">
            {variationList.map(vKey => {
              const detail = SESSION_VARIATION_DETAILS[vKey];
              const isSelected = selectedVariation === vKey;

              return (
                <div
                  key={vKey}
                  onClick={() => setSelectedVariation(vKey)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-brand-card border-brand-cyan/90 shadow-md shadow-brand-blue/10 ring-1 ring-brand-cyan/30'
                      : 'bg-brand-card/40 border-brand-border/60 hover:bg-brand-card/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      {/* Icon */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                          isSelected
                            ? 'bg-brand-cyan/15 border-brand-cyan/40 shadow-sm'
                            : 'bg-brand-dark border-brand-border/50 text-brand-silver'
                        }`}
                      >
                        {getVariationIcon(vKey)}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-black text-white">
                            {detail.number}: {detail.title}
                          </h3>
                          <span className="text-[9px] font-bold text-brand-cyan/90 bg-brand-cyan/10 px-1.5 py-0.2 rounded">
                            {getBadgeText(vKey)}
                          </span>
                        </div>

                        <p className="text-[11px] text-brand-silver leading-relaxed font-normal">
                          {detail.description}
                        </p>
                      </div>
                    </div>

                    {/* Radio Indicator */}
                    <div className="shrink-0 mt-1">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-brand-cyan bg-brand-cyan text-black'
                            : 'border-brand-border/80 bg-brand-dark'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Music Toggle Bar: Clean & Minimal */}
        <div className="relative z-10 bg-brand-card/50 border border-brand-border/60 rounded-2xl p-3 flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all ${
              isMusicEnabled
                ? 'bg-brand-cyan/15 border-brand-cyan/40 text-brand-cyan'
                : 'bg-brand-dark border-brand-border text-brand-silver'
            }`}>
              {isMusicEnabled ? <Music className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-xs font-bold text-white block leading-tight">
                Background Music
              </span>
              <span className="text-[10px] text-brand-silver">
                {isMusicEnabled ? 'Atmospheric soundscape on' : 'Voice guidance only'}
              </span>
            </div>
          </div>

          <button
            onClick={toggleMusic}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isMusicEnabled
                ? 'bg-brand-blue text-black border-brand-cyan shadow-sm font-black'
                : 'bg-brand-dark text-brand-silver border-brand-border hover:text-white'
            }`}
          >
            {isMusicEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Start Button */}
        <div className="relative z-10 mt-auto">
          <button
            onClick={startSessionPlayback}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-blue to-brand-cyan text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 shadow-xl shadow-brand-blue/20 transition-all active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Begin Visualisation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
