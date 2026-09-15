import React, { useState } from 'react';
import { useFearless } from '../services/store';
import { Award, Check, Sparkles, X, Shield } from 'lucide-react';

export const JerseyUnlockModal: React.FC = () => {
  const { jerseyModalOpen, setJerseyModalOpen, athlete, claimJersey } = useFearless();
  const [selectedSize, setSelectedSize] = useState<'Y-M' | 'Y-L' | 'Adult-S' | 'Adult-M'>('Y-L');
  const [shippingSubmitted, setShippingSubmitted] = useState(false);

  if (!jerseyModalOpen) return null;

  const handleClaim = () => {
    claimJersey();
    setShippingSubmitted(true);
    setTimeout(() => {
      setJerseyModalOpen(false);
      setShippingSubmitted(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200">
      <div className="w-full max-w-md bg-brand-dark border-2 border-brand-blue rounded-3xl p-6 relative overflow-hidden shadow-2xl shadow-brand-cyan/25">
        {/* Glow & Badge */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-brand-cyan/20 blur-3xl rounded-full pointer-events-none" />

        <button
          onClick={() => setJerseyModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-card hover:bg-brand-cardHover border border-brand-border flex items-center justify-center text-brand-silver hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-cyan text-black mb-3 shadow-lg shadow-brand-blue/40">
            <Award className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-brand-cyan uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AC 4.2 Milestone Fulfilled</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            45-Day Streak Jersey Unlocked!
          </h2>
          <p className="text-xs text-brand-silver mt-2 px-2">
            {athlete.name} has achieved 45 consecutive days of mental rehearsal. You've earned the official Saturday Sideline status symbol.
          </p>
        </div>

        {/* Jersey Mockup Card */}
        <div className="bg-gradient-to-b from-brand-card to-brand-dark border border-brand-border rounded-2xl p-5 mb-6 text-center relative">
          <div className="w-24 h-24 mx-auto rounded-full bg-black/80 border-2 border-brand-cyan/50 flex flex-col items-center justify-center shadow-inner mb-3">
            <Shield className="w-8 h-8 text-brand-cyan stroke-[2]" />
            <span className="text-[10px] font-black text-white tracking-widest mt-1">STREAK 45</span>
          </div>
          <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
            Official Fearless Match Jersey
          </h3>
          <p className="text-[11px] text-brand-silver mt-1">
            Premium moisture-wicking match kit featuring the custom Composure Crest.
          </p>

          {/* Size Picker */}
          <div className="mt-4 pt-3 border-t border-brand-border">
            <label className="text-[11px] font-bold text-brand-silver block mb-2">
              Select Size for Fulfillment:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Y-M', 'Y-L', 'Adult-S', 'Adult-M'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    selectedSize === size
                      ? 'bg-brand-cyan text-black border-brand-cyan shadow-sm'
                      : 'bg-brand-card text-brand-silver border-brand-border hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Claim Action */}
        {shippingSubmitted ? (
          <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-xl p-3 text-center text-xs font-bold text-emerald-300 flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Fulfillment Order Dispatched to Academy Warehouse!</span>
          </div>
        ) : (
          <button
            onClick={handleClaim}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-brand-blue/30 transition-all"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Claim My Fearless Streak Jersey</span>
          </button>
        )}
      </div>
    </div>
  );
};
