import React, { useState } from 'react';
import { useFearless } from '../../services/store';
import { COMMUNITY_MENTORS } from '../../domain/mentors';
import { Download, Check, ShieldCheck } from 'lucide-react';

export const CommunityFeedScreen: React.FC = () => {
  const { importMentorRoutine } = useFearless();
  const [importedId, setImportedId] = useState<string | null>(null);

  const handleImport = (mentorId: string, scheduleIds: string[]) => {
    importMentorRoutine(scheduleIds);
    setImportedId(mentorId);
    setTimeout(() => {
      setImportedId(null);
    }, 2500);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Feed Header */}
      <div className="px-1">
        <h2 className="text-xl font-black text-white">
          Mentor Routines
        </h2>
        <p className="text-xs text-brand-silver mt-0.5">
          1-tap sync proven weekly mental training routines into your schedule.
        </p>
      </div>

      {/* Routine Cards */}
      <div className="space-y-3">
        {COMMUNITY_MENTORS.map(mentor => {
          const isRecentlyImported = importedId === mentor.id;

          return (
            <div
              key={mentor.id}
              className="bg-brand-card/60 border border-brand-border/70 rounded-2xl p-4 relative overflow-hidden transition-all shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <img
                    src={mentor.avatarUrl}
                    alt={mentor.mentorName}
                    className="w-10 h-10 rounded-xl object-cover border border-brand-cyan/30"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white">{mentor.mentorName}</span>
                      <ShieldCheck className="w-3 h-3 text-brand-cyan" />
                    </div>
                    <p className="text-[10px] text-brand-silver">{mentor.academy}</p>
                  </div>
                </div>

                <span className="text-[9px] font-bold bg-brand-blue/15 text-brand-cyan px-2 py-0.5 rounded-full border border-brand-blue/30">
                  {mentor.badge}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-1">
                {mentor.title}
              </h3>

              <p className="text-[11px] text-brand-silver italic mb-3">
                &ldquo;{mentor.quote}&rdquo;
              </p>

              <button
                onClick={() => handleImport(mentor.id, mentor.scheduleIds)}
                className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  isRecentlyImported
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-brand-blue to-brand-cyan text-black hover:opacity-95 shadow-md shadow-brand-blue/20'
                }`}
              >
                {isRecentlyImported ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Imported to Blueprint</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Import 7-Day Routine</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
