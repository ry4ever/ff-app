import React, { useState } from 'react';
import { useFearless } from '../../services/store';
import { COMMUNITY_MENTORS } from '../../domain/mentors';
import { getVaultSessionById } from '../../domain/vault';
import { Compass, Download, Check, ShieldCheck } from 'lucide-react';

export const CommunityFeedScreen: React.FC = () => {
  const { importMentorRoutine } = useFearless();
  const [importedId, setImportedId] = useState<string | null>(null);

  const handleImport = (mentorId: string, scheduleIds: string[]) => {
    importMentorRoutine(scheduleIds);
    setImportedId(mentorId);
    setTimeout(() => {
      setImportedId(null);
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Feed Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-cyan uppercase tracking-wider mb-1">
          <Compass className="w-3.5 h-3.5" />
          <span>Screen 4: Shortcuts Feed</span>
        </div>
        <h2 className="text-2xl font-black text-white">
          Academy Mentor Shortcuts
        </h2>
        <p className="text-xs text-brand-silver mt-1">
          1-tap instant synchronization of elite mental training schedules directly into your Fearless HQ calendar.
        </p>
      </div>

      {/* Routine Cards */}
      <div className="space-y-4">
        {COMMUNITY_MENTORS.map(mentor => {
          const isRecentlyImported = importedId === mentor.id;

          return (
            <div
              key={mentor.id}
              className="bg-brand-card border border-brand-border hover:border-brand-border/90 rounded-3xl p-5 sm:p-6 relative overflow-hidden transition-all shadow-xl"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={mentor.avatarUrl}
                    alt={mentor.mentorName}
                    className="w-12 h-12 rounded-2xl object-cover border border-brand-cyan/40 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-extrabold text-white">{mentor.mentorName}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
                    </div>
                    <p className="text-[11px] text-brand-silver font-medium">{mentor.mentorTitle}</p>
                    <span className="text-[10px] text-brand-cyan/90 font-semibold">{mentor.academy}</span>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold bg-brand-blue/15 text-brand-cyan border border-brand-blue/30 px-2.5 py-1 rounded-full whitespace-nowrap">
                  {mentor.badge}
                </span>
              </div>

              {/* Feed Card Title */}
              <h3 className="text-base font-extrabold text-white mb-2">
                {mentor.title}
              </h3>

              {/* Quote */}
              <div className="bg-brand-dark/90 border-l-2 border-brand-blue p-3 rounded-r-xl mb-4 text-[11px] italic text-brand-silver/90">
                &ldquo;{mentor.quote}&rdquo;
              </div>

              {/* 7-Day Session Pills Preview */}
              <div className="mb-5">
                <label className="text-[10px] font-bold text-brand-silver uppercase tracking-wider block mb-2">
                  7-Day Schedule Sequence:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {mentor.scheduleIds.map((sessionId, idx) => {
                    const session = getVaultSessionById(sessionId);
                    return (
                      <span
                        key={idx}
                        className="text-[10px] bg-brand-dark border border-brand-border/70 text-brand-silver px-2 py-0.5 rounded-md font-medium"
                      >
                        D{idx + 1}: {session?.title || sessionId}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Target Archetype & CTA */}
              <div className="pt-3 border-t border-brand-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-[11px] text-brand-silver">
                  <span className="text-white font-bold">Best for: </span>
                  {mentor.recommendedFor}
                </div>

                {/* Blueprint CTA: [ Import Routine to Fearless HQ ] */}
                <button
                  onClick={() => handleImport(mentor.id, mentor.scheduleIds)}
                  className={`py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shrink-0 ${
                    isRecentlyImported
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-brand-blue to-brand-cyan text-black hover:opacity-95 shadow-lg shadow-brand-blue/25'
                  }`}
                >
                  {isRecentlyImported ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Imported to Fearless HQ!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 stroke-[2.5]" />
                      <span>Import Routine to Fearless HQ</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
