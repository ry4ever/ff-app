import React, { useState } from 'react';
import { useFearless } from '../../services/store';
import { getAllVaultSessions } from '../../domain/vault';
import { VaultCategory } from '../../types';
import { BookOpen, Play, Search, Headphones, Video } from 'lucide-react';

const CATEGORIES: ('All' | VaultCategory)[] = [
  'All',
  'Sharpen Your Game',
  'Confidence & Joy',
  'Confidence',
  'Resilience',
  'Anxiety & Composure',
  'Match Day Prep',
  'Flow / The Zone'
];

export const FearlessVaultScreen: React.FC = () => {
  const { setActiveAudioSession } = useFearless();
  const [selectedCategory, setSelectedCategory] = useState<'All' | VaultCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const sessions = getAllVaultSessions();

  const filteredSessions = sessions.filter(session => {
    const matchesCategory = selectedCategory === 'All' || session.category === selectedCategory;
    const matchesSearch =
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.productNarrative.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.targetHook.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24">
      {/* Catalog Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-cyan uppercase tracking-wider mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Section 9 &bull; Training Catalog</span>
        </div>
        <h2 className="text-2xl font-black text-white">
          The Fearless Vault
        </h2>
        <p className="text-xs text-brand-silver mt-1">
          11 structured 5-minute visual rehearsals mapped to high-pressure match scenarios and developmental goals.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-brand-silver absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by keyword, scenario, or barrier..."
          className="w-full bg-brand-card border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-brand-silver/60 focus:outline-none focus:border-brand-blue"
        />
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-brand-blue text-black border-brand-cyan shadow-sm shadow-brand-blue/20'
                : 'bg-brand-card text-brand-silver border-brand-border hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Catalog Cards Grid */}
      <div className="space-y-3">
        {filteredSessions.map(session => (
          <div
            key={session.id}
            className="bg-brand-card border border-brand-border hover:border-brand-border/90 rounded-2xl p-4 sm:p-5 transition-all shadow-md group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded-full border border-brand-cyan/20">
                    {session.category}
                  </span>
                  <span className="text-[10px] font-mono text-brand-silver">5:00</span>
                  <span className="text-[10px] font-bold text-brand-silver flex items-center gap-1 bg-brand-dark px-2 py-0.5 rounded-full border border-brand-border/60">
                    <Headphones className="w-3 h-3 text-brand-cyan" /> Audio
                    <span className="text-brand-border">&bull;</span>
                    <Video className="w-3 h-3 text-brand-cyan" /> Video
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white group-hover:text-brand-cyan transition-colors">
                  {session.title}
                </h3>

                <p className="text-xs text-brand-silver leading-relaxed">
                  {session.productNarrative}
                </p>

                <div className="pt-2">
                  <p className="text-[11px] text-brand-silver/90 italic bg-brand-dark/60 p-2.5 rounded-xl border border-brand-border/40">
                    &ldquo;{session.targetHook}&rdquo;
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveAudioSession(session)}
                className="p-3 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-cyan text-black hover:opacity-95 shadow-md shadow-brand-blue/25 transition-all shrink-0 active:scale-95"
                title="Start 5-Minute Audio Rehearsal"
              >
                <Play className="w-5 h-5 fill-black ml-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
