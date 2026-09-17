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
  ArrowRight,
  Clock
} from 'lucide-react';

export const FearlessHQScreen: React.FC = () => {
  const {
    athlete,
    toggleCustomMode,
    swapSession,
    openSession,
    incrementStreakForTesting
  } = useFearless();

  const [activeBottomSheetDay, setActiveBottomSheetDay] = useState<number | null>(null);

  const vaultSessions = getAllVaultSessions();

  // Find today's session or first uncompleted
  const todayDay = athlete.activeSchedule.find(d => d.isToday) || athlete.activeSchedule[0];
  const todaySession = getVaultSessionById(todayDay.sessionId);

  const handleStartTodayRehearsal = () => {
    if (todaySession) {
      openSession(todaySession);
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
    <div className="space-y-4 pb-20">
      {/* Athlete Header & Mode Switch */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-cyan">
            {athlete.archetype}
          </span>
          <h2 className="text-xl font-black text-white">
            Today&apos;s Focus
          </h2>
        </div>

        {/* Schedule Mode Switcher */}
        <div className="flex bg-brand-card/80 p-0.5 rounded-xl border border-brand-border/70 text-[10px] font-bold">
          <button
            onClick={() => athlete.isCustomMode && toggleCustomMode()}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              !athlete.isCustomMode
                ? 'bg-brand-blue text-black font-black shadow-sm'
                : 'text-brand-silver hover:text-white'
            }`}
          >
            Recommended
          </button>
          <button
            onClick={() => !athlete.isCustomMode && toggleCustomMode()}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              athlete.isCustomMode
                ? 'bg-brand-cyan text-black font-black shadow-sm'
                : 'text-brand-silver hover:text-white'
            }`}
          >
            <Sliders className="w-2.5 h-2.5" />
            <span>Custom</span>
          </button>
        </div>
      </div>

      {/* Hero Card: Today's Highlighted Rehearsal */}
      <div className="bg-gradient-to-br from-brand-card via-brand-dark to-brand-card/80 border border-brand-border rounded-3xl p-5 relative overflow-hidden shadow-xl shadow-brand-blue/5">
        <div className="flex items-center justify-between text-[10px] font-bold text-brand-silver mb-2">
          <span className="text-brand-cyan uppercase tracking-wider bg-brand-cyan/10 px-2 py-0.5 rounded-full border border-brand-cyan/20">
            {todayDay.category}
          </span>
          <span className="flex items-center gap-1 text-white/80 font-mono">
            <Clock className="w-3 h-3 text-brand-cyan" />
            5 Min
          </span>
        </div>

        <h3 className="text-xl font-black text-white tracking-tight leading-tight">
          {todayDay.sessionTitle}
        </h3>

        <p className="text-xs text-brand-silver/90 mt-1.5 line-clamp-2 leading-relaxed">
          {todaySession?.productNarrative || 'Rehearse cognitive composure and explosive readiness.'}
        </p>

        <button
          onClick={handleStartTodayRehearsal}
          className="mt-4 w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-blue to-brand-cyan text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-brand-blue/20 transition-all active:scale-[0.98]"
        >
          <Play className="w-4 h-4 fill-black" />
          <span>Start Rehearsal</span>
        </button>
      </div>

      {/* Metrics Strip: Compact & Clean */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Streak Pill */}
        <div className="bg-brand-card/60 border border-brand-border/70 rounded-2xl p-3 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-brand-silver block">
              Streak
            </span>
            <div className="text-lg font-black text-white flex items-baseline gap-1 mt-0.5">
              <span>{athlete.currentStreak}</span>
              <span className="text-[10px] text-brand-silver font-semibold">/ 45d</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <Flame className="w-4 h-4 fill-amber-400" />
          </div>
        </div>

        {/* Composure Score Pill */}
        <div className="bg-brand-card/60 border border-brand-border/70 rounded-2xl p-3 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-brand-silver block">
              Composure
            </span>
            <div className="text-lg font-black text-white flex items-baseline gap-1 mt-0.5">
              <span>{athlete.composureScore}</span>
              <span className="text-[10px] text-brand-cyan font-semibold">/ 100</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
            <Trophy className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Weekly Schedule Timeline */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-brand-silver">
            This Week&apos;s Blueprint
          </h3>
          {athlete.isCustomMode && (
            <span className="text-[9px] font-bold text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded-full">
              Custom Enabled
            </span>
          )}
        </div>

        <div className="space-y-2">
          {athlete.activeSchedule.map((day) => {
            const isToday = day.isToday;
            const isCompleted = day.isCompleted;

            return (
              <div
                key={day.dayIndex}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isToday
                    ? 'bg-brand-card border-brand-cyan/70 shadow-md shadow-brand-blue/10 ring-1 ring-brand-cyan/30'
                    : isCompleted
                    ? 'bg-brand-card/40 border-brand-border/40 opacity-70'
                    : 'bg-brand-card/50 border-brand-border/60 hover:bg-brand-card/80'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Day Badge */}
                  <div
                    className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center font-bold text-center shrink-0 border ${
                      isToday
                        ? 'bg-brand-blue text-black border-brand-cyan'
                        : isCompleted
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                        : 'bg-brand-dark text-brand-silver border-brand-border'
                    }`}
                  >
                    <span className="text-[8px] uppercase tracking-wider">{day.dayShort}</span>
                    <span className="text-[11px] font-black leading-none">D{day.dayIndex + 1}</span>
                  </div>

                  {/* Title & Category */}
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate leading-tight">
                      {day.sessionTitle}
                    </h4>
                    <span className="text-[9px] text-brand-silver block uppercase tracking-wider mt-0.5">
                      {day.category}
                    </span>
                  </div>
                </div>

                {/* Right Action / Status */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {isCompleted ? (
                    <div className="w-7 h-7 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        const sess = getVaultSessionById(day.sessionId);
                        if (sess) openSession(sess);
                      }}
                      className="w-7 h-7 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border flex items-center justify-center text-brand-cyan hover:text-white transition-colors"
                      title="Play Rehearsal"
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  )}

                  {athlete.isCustomMode && (
                    <button
                      onClick={() => handleOpenSwapSheet(day.dayIndex)}
                      className="p-1.5 rounded-lg text-brand-silver hover:text-brand-cyan hover:bg-brand-card transition-colors"
                      title="Swap Session"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subtle Collapsed Demo Drawer (completely tucked away from main UI) */}
      <details className="mt-6 pt-4 border-t border-brand-border/40 text-[10px] text-brand-silver/60">
        <summary className="cursor-pointer hover:text-brand-cyan transition-colors flex items-center gap-1 font-semibold">
          <Sparkles className="w-3 h-3" />
          <span>Demo Controls</span>
        </summary>
        <div className="mt-2.5 flex flex-wrap gap-2 p-2.5 bg-brand-dark rounded-xl border border-brand-border/50">
          <button
            onClick={() => incrementStreakForTesting(43)}
            className="px-2.5 py-1 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-[9px] font-bold text-brand-silver hover:text-white"
          >
            Set Streak 43
          </button>
          <button
            onClick={() => incrementStreakForTesting(45)}
            className="px-2.5 py-1 rounded-lg bg-brand-blue/20 hover:bg-brand-blue/30 border border-brand-blue/40 text-[9px] font-bold text-brand-cyan"
          >
            Set Streak 45 (Jersey Unlock)
          </button>
        </div>
      </details>

      {/* Screen 3 Bottom Sheet: Vault Library for Swapping */}
      {activeBottomSheetDay !== null && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-brand-dark border border-brand-border rounded-t-3xl sm:rounded-3xl p-5 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border mb-3">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-brand-cyan">
                  Custom Mode
                </span>
                <h3 className="text-sm font-extrabold text-white">
                  Swap {athlete.activeSchedule[activeBottomSheetDay]?.dayName}
                </h3>
              </div>
              <button
                onClick={() => setActiveBottomSheetDay(null)}
                className="text-xs font-bold text-brand-silver hover:text-white px-2.5 py-1 bg-brand-card rounded-lg"
              >
                Done
              </button>
            </div>

            <div className="space-y-1.5">
              {vaultSessions.map(session => {
                const isSelected = athlete.activeSchedule[activeBottomSheetDay]?.sessionId === session.id;

                return (
                  <button
                    key={session.id}
                    onClick={() => handleSelectSwap(session.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-blue/20 border-brand-cyan text-white shadow-sm'
                        : 'bg-brand-card/60 border-brand-border/60 text-brand-silver hover:text-white hover:bg-brand-card'
                    }`}
                  >
                    <div>
                      <span className="text-[8px] font-bold uppercase tracking-wider text-brand-cyan block">
                        {session.category}
                      </span>
                      <h4 className="text-xs font-bold text-white">{session.title}</h4>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isSelected ? (
                        <span className="text-[9px] font-bold text-brand-cyan bg-brand-cyan/20 px-2 py-0.5 rounded">
                          Current
                        </span>
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-brand-silver" />
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
