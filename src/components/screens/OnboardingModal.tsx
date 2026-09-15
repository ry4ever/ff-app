import React, { useState } from 'react';
import { useFearless } from '../../services/store';
import { Position, MatchTarget, Barrier, TrainingFrequency, CompetitionLevel } from '../../types';
import { mapBarrierToArchetype } from '../../domain/archetypes';
import { ArrowRight, Check, Compass, ShieldAlert, Target, Trophy, Clock } from 'lucide-react';

const POSITIONS: Position[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

const MATCH_TARGETS: MatchTarget[] = [
  'Upcoming League Match',
  'Cup / Tournament Final',
  'Academy Showcase / Trials',
  'Personal Mental Mastery'
];

const BARRIERS: Barrier[] = [
  'Pre-Match Nerves',
  'The Error Spiral',
  'Form Slump',
  'Tactical Errors',
  'Sideline Distractions'
];

const FREQUENCIES: TrainingFrequency[] = [
  '3x / week',
  '5x / week',
  'Daily (7x / week)'
];

const LEVELS: CompetitionLevel[] = [
  'Grassroots / Recreational',
  'Competitive Travel',
  'High School / Semi-Pro',
  'Elite Academy / Pro Youth'
];

export const OnboardingModal: React.FC = () => {
  const { athlete, completeOnboarding } = useFearless();

  const [step, setStep] = useState<number>(1);
  const [position, setPosition] = useState<Position>(athlete.position || 'Midfielder');
  const [matchTarget, setMatchTarget] = useState<MatchTarget>(athlete.matchTarget || 'Upcoming League Match');
  const [barrier, setBarrier] = useState<Barrier>(athlete.mainBarrier || 'Pre-Match Nerves');
  const [frequency, setFrequency] = useState<TrainingFrequency>(athlete.frequency || '5x / week');
  const [level, setLevel] = useState<CompetitionLevel>(athlete.level || 'Competitive Travel');

  if (athlete.onboarding_completed) return null;

  const predictedArchetype = mapBarrierToArchetype(barrier, position);

  const handleFinish = () => {
    completeOnboarding(position, matchTarget, barrier, frequency, level);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-brand-dark border border-brand-border rounded-3xl p-6 sm:p-8 relative shadow-2xl shadow-brand-blue/20 my-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map(s => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-brand-cyan shadow-[0_0_8px_#69E0FA]'
                    : s < step
                    ? 'w-4 bg-brand-blue'
                    : 'w-4 bg-brand-card border border-brand-border'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-bold text-brand-silver">
            Step {step} of 5
          </span>
        </div>

        {/* Welcome Header */}
        <div className="mb-6">
          <span className="text-xs font-bold text-brand-cyan uppercase tracking-widest flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            Hybrid Recommender System
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Welcome to Fearless Footballer, {athlete.name}!
          </h2>
          <p className="text-xs text-brand-silver mt-1">
            Let&apos;s build your customized weekly mental training schedule.
          </p>
        </div>

        {/* Question 1: Position */}
        {step === 1 && (
          <div className="space-y-4">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-cyan" />
              1. What is your primary on-pitch position?
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {POSITIONS.map(p => (
                <button
                  key={p}
                  onClick={() => setPosition(p)}
                  className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                    position === p
                      ? 'bg-brand-blue/20 border-brand-blue text-white shadow-md shadow-brand-blue/15'
                      : 'bg-brand-card border-brand-border text-brand-silver hover:text-white hover:border-brand-border/80'
                  }`}
                >
                  <span>{p}</span>
                  {position === p && <Check className="w-4 h-4 text-brand-cyan" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 2: Match Target */}
        {step === 2 && (
          <div className="space-y-4">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-brand-cyan" />
              2. What is your immediate competitive target?
            </label>
            <div className="space-y-2">
              {MATCH_TARGETS.map(t => (
                <button
                  key={t}
                  onClick={() => setMatchTarget(t)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                    matchTarget === t
                      ? 'bg-brand-blue/20 border-brand-blue text-white shadow-md shadow-brand-blue/15'
                      : 'bg-brand-card border-brand-border text-brand-silver hover:text-white'
                  }`}
                >
                  <span>{t}</span>
                  {matchTarget === t && <Check className="w-4 h-4 text-brand-cyan" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 3: Main Barrier (Maps to Archetype per Section 8) */}
        {step === 3 && (
          <div className="space-y-4">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-brand-cyan" />
              3. What is your biggest mental roadblock on matchday?
            </label>
            <div className="space-y-2">
              {BARRIERS.map(b => (
                <button
                  key={b}
                  onClick={() => setBarrier(b)}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                    barrier === b
                      ? 'bg-brand-blue/25 border-brand-cyan text-white shadow-md shadow-brand-cyan/20'
                      : 'bg-brand-card border-brand-border text-brand-silver hover:text-white'
                  }`}
                >
                  <div>
                    <span className="block text-white font-bold">{b}</span>
                    <span className="text-[10px] text-brand-silver/80 font-normal">
                      {b === 'Pre-Match Nerves' && 'Stomach butterflies, rapid breathing, hesitant early touches'}
                      {b === 'The Error Spiral' && 'One mistake leading into frustration and cautious play'}
                      {b === 'Form Slump' && 'Lacking self-belief after recent bad matches'}
                      {b === 'Tactical Errors' && 'Rushed passes in the final third and mistimed challenges'}
                      {b === 'Sideline Distractions' && 'Hostile crowds, loud parents, and bad referee calls'}
                    </span>
                  </div>
                  {barrier === b && <Check className="w-4 h-4 text-brand-cyan shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 4: Frequency */}
        {step === 4 && (
          <div className="space-y-4">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-cyan" />
              4. How many 5-minute visual rehearsals will you run weekly?
            </label>
            <div className="space-y-2.5">
              {FREQUENCIES.map(f => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                    frequency === f
                      ? 'bg-brand-blue/20 border-brand-blue text-white shadow-md'
                      : 'bg-brand-card border-brand-border text-brand-silver hover:text-white'
                  }`}
                >
                  <div>
                    <span className="block text-white">{f}</span>
                    <span className="text-[10px] text-brand-silver/80 font-normal">
                      {f === 'Daily (7x / week)' ? 'Elite protocol for maximum retention & fastest 45-day jersey status' : 'Standard competitive rhythm'}
                    </span>
                  </div>
                  {frequency === f && <Check className="w-4 h-4 text-brand-cyan" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 5: Competition Level */}
        {step === 5 && (
          <div className="space-y-4">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-brand-cyan" />
              5. Select your current playing level:
            </label>
            <div className="space-y-2">
              {LEVELS.map(l => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                    level === l
                      ? 'bg-brand-blue/20 border-brand-blue text-white'
                      : 'bg-brand-card border-brand-border text-brand-silver hover:text-white'
                  }`}
                >
                  <span>{l}</span>
                  {level === l && <Check className="w-4 h-4 text-brand-cyan" />}
                </button>
              ))}
            </div>

            {/* Live Archetype Prediction Preview */}
            <div className="p-3.5 rounded-xl bg-brand-card/90 border border-brand-cyan/40 mt-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-cyan block">
                Archetype Classification:
              </span>
              <h4 className="text-base font-extrabold text-white mt-0.5">
                {predictedArchetype.archetype}
              </h4>
              <p className="text-[11px] text-brand-silver mt-1">
                {predictedArchetype.description}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 mt-8 pt-4 border-t border-brand-border">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="py-3 px-4 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-xs font-bold text-brand-silver hover:text-white"
            >
              Back
            </button>
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex-1 py-3 px-4 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-blue/50 text-brand-cyan font-extrabold text-xs flex items-center justify-center gap-2 hover:border-brand-cyan transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-brand-blue/30 transition-all"
            >
              <span>Generate My Fearless Blueprint</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
