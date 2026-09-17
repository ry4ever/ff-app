import React from 'react';
import { useFearless } from '../services/store';
import { Flame, Shield, User, CreditCard, RotateCcw } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    athlete,
    parent,
    setStripeModalOpen,
    resetOnboarding
  } = useFearless();

  return (
    <header className="sticky top-0 z-30 bg-brand-dark/95 backdrop-blur-md border-b border-brand-border/60 px-4 py-2.5">
      <div className="w-full flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center shadow-md shadow-brand-blue/20">
            <Shield className="w-3.5 h-3.5 text-black stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-black text-xs tracking-wider uppercase text-white leading-none">
              Fearless
            </h1>
          </div>
        </div>

        {/* Right Section: Streak & Clean Role Switcher */}
        <div className="flex items-center gap-2">
          {/* Athlete Streak Badge */}
          {activeRole === 'athlete' && (
            <div className="flex items-center gap-1 bg-brand-card/80 border border-brand-border/80 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-white text-[11px] font-mono">{athlete.currentStreak}d</span>
            </div>
          )}

          {/* Parent Subscription Badge */}
          {activeRole === 'parent' && (
            <button
              onClick={() => setStripeModalOpen(true)}
              className="flex items-center gap-1 bg-brand-blue/15 border border-brand-blue/30 px-2.5 py-1 rounded-full text-[10px] font-bold text-brand-cyan hover:bg-brand-blue/25 transition-colors"
            >
              <CreditCard className="w-3 h-3" />
              <span className="capitalize">{parent.subscriptionStatus}</span>
            </button>
          )}

          {/* Clean Segmented Role Switcher */}
          <div className="flex bg-brand-card/80 p-0.5 rounded-xl border border-brand-border/80 text-[10px] font-bold">
            <button
              onClick={() => setActiveRole('athlete')}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeRole === 'athlete'
                  ? 'bg-brand-blue text-black shadow-sm font-black'
                  : 'text-brand-silver hover:text-white'
              }`}
            >
              <User className="w-2.5 h-2.5" />
              <span>Athlete</span>
            </button>
            <button
              onClick={() => setActiveRole('parent')}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeRole === 'parent'
                  ? 'bg-brand-cyan text-black shadow-sm font-black'
                  : 'text-brand-silver hover:text-white'
              }`}
            >
              <Shield className="w-2.5 h-2.5" />
              <span>Parent</span>
            </button>
          </div>

          {/* Subtle Reset Onboarding icon */}
          <button
            onClick={resetOnboarding}
            title="Reset Onboarding"
            className="p-1 rounded-lg text-brand-silver/50 hover:text-white hover:bg-brand-card transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};
