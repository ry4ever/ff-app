import React from 'react';
import { useFearless } from '../../services/store';
import {
  MessageSquare,
  CreditCard,
  Flame,
  CheckCircle2
} from 'lucide-react';

export const ParentDashboardScreen: React.FC = () => {
  const {
    athlete,
    conversationStarters,
    activePairingCode,
    setStripeModalOpen
  } = useFearless();

  const completedReps = athlete.activeSchedule.filter(d => d.isCompleted).length;
  const completionRate = Math.round((completedReps / 7) * 100);

  const latestStarter = conversationStarters[0];

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="px-1">
        <h2 className="text-xl font-black text-white">
          Parent Companion
        </h2>
        <p className="text-xs text-brand-silver mt-0.5">
          Support {athlete.name}&apos;s composure and mental growth.
        </p>
      </div>

      {/* Hero: Highlighted Car-Ride Question */}
      {latestStarter && (
        <div className="bg-gradient-to-br from-brand-card via-brand-dark to-brand-card border border-brand-cyan/40 rounded-3xl p-5 relative overflow-hidden shadow-xl shadow-brand-blue/5">
          <div className="flex items-center justify-between gap-2 mb-2 text-brand-silver text-[10px]">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-brand-cyan">
              <MessageSquare className="w-3.5 h-3.5" />
              Car-Ride Conversation
            </span>
            <span className="font-mono">{latestStarter.completedAt}</span>
          </div>

          <h3 className="text-sm font-bold text-white mb-2">
            {latestStarter.headline}
          </h3>

          {/* Golden Question Box */}
          <div className="bg-brand-dark/90 border-l-2 border-brand-cyan p-3.5 rounded-r-2xl my-2">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-brand-cyan block mb-1">
              Ask them after training:
            </span>
            <p className="text-xs sm:text-sm font-semibold text-white italic leading-relaxed">
              {latestStarter.suggestedQuestion}
            </p>
          </div>

          <span className="text-[10px] text-brand-silver block mt-2">
            Based on: <strong className="text-white">{latestStarter.sessionTitle}</strong>
          </span>
        </div>
      )}

      {/* Progress & Streak Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Weekly Completion */}
        <div className="bg-brand-card/60 border border-brand-border/70 rounded-2xl p-3.5">
          <div className="flex items-center justify-between text-brand-silver text-[9px] font-bold uppercase tracking-wider mb-1">
            <span>This Week</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan" />
          </div>
          <div className="text-lg font-black text-white flex items-baseline gap-1">
            <span>{completedReps}</span>
            <span className="text-[10px] text-brand-silver font-semibold">/ 7 Reps</span>
          </div>
          <div className="w-full bg-brand-dark h-1.5 rounded-full overflow-hidden mt-2 border border-brand-border/40">
            <div
              className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Streak */}
        <div className="bg-brand-card/60 border border-brand-border/70 rounded-2xl p-3.5">
          <div className="flex items-center justify-between text-brand-silver text-[9px] font-bold uppercase tracking-wider mb-1">
            <span>Active Streak</span>
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-lg font-black text-white flex items-baseline gap-1">
            <span>{athlete.currentStreak}</span>
            <span className="text-[10px] text-brand-silver font-semibold">/ 45 Days</span>
          </div>
          <span className="text-[9px] text-brand-silver mt-1.5 block">
            {45 - athlete.currentStreak > 0 ? `${45 - athlete.currentStreak}d to Jersey` : 'Jersey Unlocked'}
          </span>
        </div>
      </div>

      {/* Family Pairing & Subscription Bar */}
      <div className="bg-brand-card/50 border border-brand-border/60 rounded-2xl p-3.5 flex items-center justify-between gap-3">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-brand-silver block">
            Family Pairing Code
          </span>
          <span className="font-mono text-sm font-black text-brand-cyan tracking-wider">
            {activePairingCode || 'FEAR-4892'}
          </span>
        </div>

        <button
          onClick={() => setStripeModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
        >
          <CreditCard className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Membership</span>
        </button>
      </div>
    </div>
  );
};
