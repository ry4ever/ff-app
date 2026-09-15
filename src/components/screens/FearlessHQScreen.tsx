import React, { useState } from 'react';
import { useFearless } from '../../services/store';
import { getAllVaultSessions, getVaultSessionById } from '../../domain/vault';
import {
  Flame,
  Play,
  CheckCircle2,
  Sliders,
  ChevronDown,
  Sparkles,
  Trophy,
  Info,
  ArrowRight
} from 'lucide-react';

export const FearlessHQScreen: React.FC = () => {
  const {
    athlete,
    toggleCustomMode,
    swapSession,
    setActiveAudioSession,
    incrementStreakForTesting
  } = useFearless();

  const [activeBottomSheetDay, setActiveBottomSheetDay] = useState<number | null>(null);

  const vaultSessions = getAllVaultSessions();

  // Find today's session or first uncompleted
  const todayDay = athlete.activeSchedule.find(d => d.isToday) || athlete.activeSchedule[0];
  const todaySession = getVaultSessionById(todayDay.sessionId);

  const handleStartTodayRehearsal = () => {
    if (todaySession) {
      setActiveAudioSession(todaySession);
    }
  };

  const handleOpenSwapSheet = (dayIndex: number) => {
    setActiveBottomSheetDay(dayIndex);
  };

  const handleSelectSwap = (newSessionId: string) => {
    if (activeBottomSheetDay !== null) {
      swapSession(activeBottomSheetDay, newSessionId);
      setActiveBottomSheetDay(null);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Hero Command Center */}
      <div className="bg-gradient-to-b from-brand-card to-brand-dark border border-brand-border rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-blue/20 blur-3xl rounded-full pointer-events-none" />

        {/* Header & Mode Toggle */}
        <div className="flex items-center justify-between gap-2 mb-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-cyan tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Command Center</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Fearless HQ
            </h2>
          </div>

          {/* Screen 3 Sliding Toggle: Recommended Blueprint <-> Fearless Custom */}
          <div className="flex items-center gap-2 bg-brand-dark/90 p-1 rounded-2xl border border-brand-border">
            <button
              onClick={() => athlete.isCustomMode && toggleCustomMode()}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                !athlete.isCustomMode
                  ? 'bg-brand-blue text-black shadow-md'
                  : 'text-brand-silver hover:text-white'
              }`}
            >
              Recommended
            </button>
            <button
              onClick={() => !athlete.isCustomMode && toggleCustomMode()}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                athlete.isCustomMode
                  ? 'bg-brand-cyan text-black shadow-md'
                  : 'text-brand-silver hover:text-white'
              }`}
            >
              <Sliders className="w-3 h-3" />
              Custom
            </button>
          </div>
        </div>

        {/* Top Metric Strip: Blueprint Screen 2 "Composure Streak: 4/5 Days" + Flame Icon */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Streak Card */}
          <div className="bg-brand-dark/80 border border-brand-border/90 rounded-2xl p-3.5 relative overflow-hidden">
            <div className="flex items-center justify-between text-brand-silver text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Composure Streak</span>
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white flex items-baseline gap-1">
              <span>{athlete.currentStreak}</span>
              <span className="text-xs text-brand-silver font-semibold">/ 45 Days</span>
            </div>
            <div className="w-full bg-brand-card h-1.5 rounded-full overflow-hidden mt-2 border border-brand-border/40">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-200 rounded-full"
                style={{ width: `${Math.min(100, (athlete.currentStreak / 45) * 100)}%` }}
              />
            </div>
            <span className="text-[9px] text-brand-silver/90 mt-1 block">
              {45 - athlete.currentStreak > 0 
                ? `${45 - athlete.currentStreak} days to Fearless Jersey` 
                : '🏆 Official Jersey Unlocked!'}
            </span>
          </div>

          {/* Composure Score Card */}
          <div className="bg-brand-dark/80 border border-brand-border/90 rounded-2xl p-3.5 relative overflow-hidden">
            <div className="flex items-center justify-between text-brand-silver text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Composure Index</span>
              <Trophy className="w-3.5 h-3.5 text-brand-cyan" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white flex items-baseline gap-1">
              <span>{athlete.composureScore}</span>
              <span className="text-xs text-brand-cyan font-semibold">/ 100</span>
            </div>
            <div className="w-full bg-brand-card h-1.5 rounded-full overflow-hidden mt-2 border border-brand-border/40">
              <div
                className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan rounded-full shadow-[0_0_6px_#69E0FA]"
                style={{ width: `${athlete.composureScore}%` }}
              />
            </div>
            <span className="text-[9px] text-brand-cyan mt-1 block font-semibold truncate">
              {athlete.archetype}
            </span>
          </div>
        </div>

        {/* Primary CTA: [ Start Fearless Rehearsal ] */}
        <div className="bg-gradient-to-r from-brand-blue/20 via-brand-card to-brand-dark border border-brand-blue/40 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-cyan bg-brand-blue/20 px-2 py-0.5 rounded-full">
              Today&apos;s Highlighted Rep
            </span>
            <span className="text-[11px] font-bold text-brand-silver">5 Min &bull; 🎧 Audio &amp; 🎥 Video</span>
          </div>
          <h3 className="text-lg font-black text-white">
            {todayDay.sessionTitle}
          </h3>
          <p className="text-xs text-brand-silver/90 mt-1 mb-3">
            {todaySession?.productNarrative || 'Rehearse cognitive composure and explosive readiness.'}
          </p>
          <button
            onClick={handleStartTodayRehearsal}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-brand-blue/30 transition-all active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Start Rehearsal (Audio / Video)</span>
          </button>
        </div>
      </div>

      {/* Screen 2/3: Vertical 7-Day Stack Calendar */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              7-Day Mental Training Blueprint
            </h3>
            <p className="text-[11px] text-brand-silver">
              {athlete.isCustomMode
                ? 'Fearless Custom: Tap edit icon on any day to swap audio rep'
                : 'Auto-balanced weekly schedule tailored to your archetype'}
            </p>
          </div>

          {athlete.isCustomMode && (
            <span className="text-[10px] font-bold text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded-full">
              Editing Unlocked
            </span>
          )}
        </div>

        <div className="space-y-2.5">
          {athlete.activeSchedule.map((day) => {
            const isToday = day.isToday;
            const isCompleted = day.isCompleted;

            return (
              <div
                key={day.dayIndex}
                className={`p-4 rounded-2xl border transition-all ${
                  isToday
                    ? 'bg-brand-card/90 border-brand-cyan/80 shadow-lg shadow-brand-blue/15 ring-1 ring-brand-cyan/30'
                    : isCompleted
                    ? 'bg-brand-card/40 border-brand-border/60 opacity-80'
                    : 'bg-brand-card/70 border-brand-border hover:border-brand-border/90'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Day Pill */}
                    <div
                      className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-bold text-center shrink-0 border ${
                        isToday
                          ? 'bg-brand-blue text-black border-brand-cyan shadow-sm'
                          : isCompleted
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                          : 'bg-brand-dark text-brand-silver border-brand-border'
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-wider">{day.dayShort}</span>
                      <span className="text-xs font-black">D{day.dayIndex + 1}</span>
                    </div>

                    {/* Session Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-brand-silver uppercase tracking-wider">
                          {day.category}
                        </span>
                        {day.isCustomSwap && (
                          <span className="text-[9px] font-bold text-brand-cyan bg-brand-cyan/10 px-1.5 rounded">
                            Custom Rep
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-extrabold text-white leading-tight">
                        {day.sessionTitle}
                      </h4>
                      <p className="text-[10px] text-brand-silver/80 mt-0.5">
                        {day.durationMinutes} min visual rehearsal &bull; {day.dayName}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-950/40 border border-emerald-500/30 px-2 py-1 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Complete</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          const sess = getVaultSessionById(day.sessionId);
                          if (sess) setActiveAudioSession(sess);
                        }}
                        className="p-2 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-cyan hover:text-white transition-colors"
                        title="Play Rehearsal"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    )}

                    {/* Screen 3: Dropdown edit icon on all daily cards in Custom mode */}
                    {athlete.isCustomMode && (
                      <button
                        onClick={() => handleOpenSwapSheet(day.dayIndex)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-brand-blue/15 hover:bg-brand-blue/30 border border-brand-blue/40 text-brand-cyan text-xs font-bold transition-all"
                        title="Swap audio rep from Vault"
                      >
                        <span>Swap</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instant Demo Utilities Bar */}
      <div className="p-3.5 bg-brand-dark border border-brand-border/60 rounded-2xl">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-silver uppercase tracking-wider mb-2">
          <Info className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Milestone Test Controls</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => incrementStreakForTesting(43)}
            className="px-2.5 py-1 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-[10px] font-bold text-brand-silver hover:text-white transition-colors"
          >
            Set Streak to 43 (Trigger Behavioral Nudge)
          </button>
          <button
            onClick={() => incrementStreakForTesting(45)}
            className="px-2.5 py-1 rounded-lg bg-brand-blue/20 hover:bg-brand-blue/30 border border-brand-blue/50 text-[10px] font-bold text-brand-cyan transition-colors flex items-center gap-1"
          >
            <Trophy className="w-3 h-3" />
            <span>Set Streak to 45 (Trigger Jersey Unlock AC 4.2)</span>
          </button>
        </div>
      </div>

      {/* Screen 3 Bottom Sheet: Full Audio Vault Library for Swapping */}
      {activeBottomSheetDay !== null && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-brand-dark border border-brand-border rounded-t-3xl sm:rounded-3xl p-6 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-cyan">
                  Fearless Custom Mode
                </span>
                <h3 className="text-base font-extrabold text-white">
                  Swap Audio Rep for {athlete.activeSchedule[activeBottomSheetDay]?.dayName}
                </h3>
              </div>
              <button
                onClick={() => setActiveBottomSheetDay(null)}
                className="text-xs font-bold text-brand-silver hover:text-white px-2 py-1 bg-brand-card rounded-lg"
              >
                Done
              </button>
            </div>

            <p className="text-xs text-brand-silver mb-3">
              Select any audio rehearsal from the Fearless Vault. Swapping will instant-sync to the Parent Dashboard.
            </p>

            <div className="space-y-2">
              {vaultSessions.map(session => {
                const isSelected = athlete.activeSchedule[activeBottomSheetDay]?.sessionId === session.id;

                return (
                  <button
                    key={session.id}
                    onClick={() => handleSelectSwap(session.id)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-blue/25 border-brand-cyan text-white shadow-md'
                        : 'bg-brand-card border-brand-border text-brand-silver hover:text-white hover:border-brand-border/80'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-brand-cyan block">
                        {session.category}
                      </span>
                      <h4 className="text-xs font-extrabold text-white">{session.title}</h4>
                      <p className="text-[10px] text-brand-silver/80 mt-0.5 line-clamp-1">
                        {session.productNarrative}
                      </p>
                    </div>

                    <div className="shrink-0 ml-3">
                      {isSelected ? (
                        <span className="text-[10px] font-bold text-brand-cyan bg-brand-cyan/20 px-2 py-1 rounded">
                          Current
                        </span>
                      ) : (
                        <div className="p-2 rounded-lg bg-brand-cardHover border border-brand-border text-brand-silver">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
