import React from 'react';
import { useFearless } from '../../services/store';
import {
  Users,
  MessageSquare,
  CreditCard,
  Flame,
  CheckCircle2,
  Heart,
  Share2,
  ExternalLink,
  Smile
} from 'lucide-react';

export const ParentDashboardScreen: React.FC = () => {
  const {
    athlete,
    parent,
    conversationStarters,
    activePairingCode,
    setStripeModalOpen
  } = useFearless();

  const completedReps = athlete.activeSchedule.filter(d => d.isCompleted).length;
  const completionRate = Math.round((completedReps / 7) * 100);

  const latestStarter = conversationStarters[0];

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-cyan uppercase tracking-wider mb-1">
          <Users className="w-3.5 h-3.5" />
          <span>Parent Support Experience</span>
        </div>
        <h2 className="text-2xl font-black text-white">
          Parent Dashboard
        </h2>
        <p className="text-xs text-brand-silver mt-1">
          Real-time visibility, developmental oversight, and post-match conversation starters to eliminate Drive-Home Anxiety.
        </p>
      </div>

      {/* Drive-Home Anxiety Shield Card */}
      <div className="bg-gradient-to-r from-brand-card via-brand-dark to-brand-card border border-brand-cyan/40 rounded-3xl p-5 relative overflow-hidden shadow-xl">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-cyan">
                Drive-Home Anxiety Neutralizer
              </span>
              <h3 className="text-sm font-black text-white">
                Player Mindset & Progress Visibility
              </h3>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            Real-Time Sync Active
          </span>
        </div>

        <p className="text-xs text-brand-silver leading-relaxed">
          Instead of asking &ldquo;Why did you lose?&rdquo; or &ldquo;Did you play well?&rdquo;, use the dynamic mental cues below. Alex is developing elite emotional regulation under competitive pressure.
        </p>
      </div>

      {/* Dynamic Conversation Starter Card (Scenario A) */}
      {latestStarter && (
        <div className="bg-gradient-to-b from-brand-card to-brand-dark border-2 border-brand-blue rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-2xl shadow-brand-blue/20">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-cyan">
              <MessageSquare className="w-4 h-4" />
              Dynamic Conversation Starter
            </span>
            <span className="text-[10px] font-mono text-brand-silver">
              Completed {latestStarter.completedAt}
            </span>
          </div>

          <h3 className="text-lg font-black text-white mb-1.5">
            {latestStarter.headline}
          </h3>

          <p className="text-xs text-brand-silver/90 mb-4 leading-relaxed">
            {latestStarter.promptText}
          </p>

          {/* Golden Prompt Box */}
          <div className="bg-brand-dark/95 border-l-4 border-brand-cyan p-4 rounded-r-2xl shadow-inner">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-cyan block mb-1">
              Recommended Car-Ride Question:
            </span>
            <p className="text-xs sm:text-sm font-semibold text-white italic leading-relaxed">
              {latestStarter.suggestedQuestion}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-[11px] text-brand-silver">
            <span>Derived from: <strong className="text-white">{latestStarter.sessionTitle}</strong></span>
            <span className="text-brand-cyan font-bold flex items-center gap-1">
              <Smile className="w-3.5 h-3.5" />
              Builds Psychological Safety
            </span>
          </div>
        </div>
      )}

      {/* 7-Day Completion Velocity & Sentiment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Weekly Completion Rate */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-brand-silver uppercase tracking-wider">
              7-Day Completion Velocity
            </span>
            <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
          </div>
          <div className="text-2xl font-black text-white flex items-baseline gap-1.5">
            <span>{completedReps}</span>
            <span className="text-xs text-brand-silver">/ 7 Reps ({completionRate}%)</span>
          </div>
          <div className="w-full bg-brand-dark h-2 rounded-full overflow-hidden mt-2 border border-brand-border/40">
            <div
              className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <span className="text-[10px] text-brand-silver/80 mt-1.5 block">
            Alex is staying consistent with the {athlete.frequency} commitment.
          </span>
        </div>

        {/* 45-Day Streak Jersey Progression */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-brand-silver uppercase tracking-wider">
              Saturday Sideline Status
            </span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-black text-white flex items-baseline gap-1.5">
            <span>{athlete.currentStreak}</span>
            <span className="text-xs text-brand-silver">/ 45 Days Streak</span>
          </div>
          <div className="w-full bg-brand-dark h-2 rounded-full overflow-hidden mt-2 border border-brand-border/40">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300"
              style={{ width: `${Math.min(100, (athlete.currentStreak / 45) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-brand-silver/80 mt-1.5 block">
            {athlete.jersey_reward_eligible
              ? 'Jersey Unlocked! Physical reward ready for Saturday games.'
              : `${45 - athlete.currentStreak} days to official Fearless Streak Jersey.`}
          </span>
        </div>
      </div>

      {/* Stripe Membership & Family Pairing Hub */}
      <div className="bg-brand-card border border-brand-border rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-brand-cyan" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Stripe Membership & Family Sync
            </h3>
          </div>
          <span className="text-[10px] font-extrabold bg-brand-blue/20 text-brand-cyan border border-brand-blue/30 px-2 py-0.5 rounded-full capitalize">
            Status: {parent.subscriptionStatus}
          </span>
        </div>

        {/* Family Pairing Code */}
        <div className="p-3.5 rounded-2xl bg-brand-dark/90 border border-brand-border flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-brand-silver uppercase tracking-wider block">
              Athlete 6-Digit Pairing Code:
            </span>
            <span className="text-lg font-mono font-black text-brand-cyan tracking-widest">
              {activePairingCode || 'FEAR-4892'}
            </span>
            <span className="text-[10px] text-brand-silver block mt-0.5">
              Enter on athlete&apos;s device to unlock Fearless HQ instantly.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(activePairingCode || 'FEAR-4892');
                }
              }}
              className="p-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-silver hover:text-white transition-colors"
              title="Copy Pairing Code"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stripe Portal Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            onClick={() => setStripeModalOpen(true)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-brand-blue/20 hover:bg-brand-blue/30 border border-brand-blue/50 text-brand-cyan text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            <span>Manage Stripe Subscription</span>
          </button>
          <a
            href="#stripe-portal"
            onClick={(e) => {
              e.preventDefault();
              setStripeModalOpen(true);
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-silver hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Stripe Customer Portal</span>
          </a>
        </div>
      </div>
    </div>
  );
};
