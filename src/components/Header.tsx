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
    <header className="sticky top-0 z-30 bg-brand-dark/95 backdrop-blur-md border-b border-brand-border px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center shadow-lg shadow-brand-blue/20">
            <Shield className="w-4 h-4 text-black stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-wider uppercase text-white leading-none">
              Fearless Footballer
            </h1>
            <p className="text-[9px] font-semibold tracking-widest text-brand-cyan uppercase mt-0.5">
              See &bull; Rehearse &bull; Become
            </p>
          </div>
        </div>

        {/* Dual ICP Toggle & Status */}
        <div className="flex items-center gap-2">
          {/* Streak Badge for Athlete */}
          {activeRole === 'athlete' && (
            <div className="flex items-center gap-1 bg-brand-card border border-brand-border px-2.5 py-1 rounded-full text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <span className="text-white text-[11px]">{athlete.currentStreak} Days</span>
            </div>
          )}

          {/* Subscription Badge for Parent */}
          {activeRole === 'parent' && (
            <button
              onClick={() => setStripeModalOpen(true)}
              className="flex items-center gap-1 bg-brand-blue/15 border border-brand-blue/30 px-2 py-1 rounded-full text-[10px] font-bold text-brand-cyan hover:bg-brand-blue/25 transition-colors"
            >
              <CreditCard className="w-3 h-3" />
              <span>Stripe {parent.subscriptionStatus}</span>
            </button>
          )}

          {/* ICP Role Switcher */}
          <div className="flex bg-brand-card p-0.5 rounded-lg border border-brand-border text-[11px]">
            <button
              onClick={() => setActiveRole('athlete')}
              className={`px-2 py-1 rounded-md font-bold transition-all flex items-center gap-1 ${
                activeRole === 'athlete'
                  ? 'bg-brand-blue text-black shadow-sm'
                  : 'text-brand-silver hover:text-white'
              }`}
            >
              <User className="w-3 h-3" />
              Athlete
            </button>
            <button
              onClick={() => setActiveRole('parent')}
              className={`px-2 py-1 rounded-md font-bold transition-all flex items-center gap-1 ${
                activeRole === 'parent'
                  ? 'bg-brand-cyan text-black shadow-sm'
                  : 'text-brand-silver hover:text-white'
              }`}
            >
              <Shield className="w-3 h-3" />
              Parent
            </button>
          </div>

          {/* Reset Onboarding Shortcut */}
          <button
            onClick={resetOnboarding}
            title="Reset Onboarding Survey"
            className="p-1.5 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-silver hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
