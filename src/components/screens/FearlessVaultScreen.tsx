import React, { useState } from 'react';
import { useFearless } from '../../services/store';
import { getAllVaultSessions } from '../../domain/vault';
import { VaultCategory } from '../../types';
import { Play, Search, Clock } from 'lucide-react';

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
  const { openSession } = useFearless();
  const [selectedCategory, setSelectedCategory] = useState<'All' | VaultCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const sessions = getAllVaultSessions();

  const filteredSessions = sessions.filter(session => {
    const matchesCategory = selectedCategory === 'All' || session.category === selectedCategory;
    const matchesSearch =
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.productNarrative.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Catalog Header */}
      <div className="px-1">
        <h2 className="text-xl font-black text-white">
          The Vault
        </h2>
        <p className="text-xs text-brand-silver mt-0.5">
          Elite visual rehearsals for match situations and mental mastery.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-brand-silver absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search scenarios..."
          className="w-full bg-brand-card/60 border border-brand-border/70 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-brand-silver/50 focus:outline-none focus:border-brand-blue"
        />
      </div>

      {/* Category Horizontal Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-brand-blue text-black border-brand-cyan shadow-sm font-black'
                : 'bg-brand-card/60 text-brand-silver border-brand-border/60 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Modern Compact Session Cards List */}
      <div className="space-y-2">
        {filteredSessions.map(session => (
          <div
            key={session.id}
            onClick={() => openSession(session)}
            className="bg-brand-card/60 border border-brand-border/70 hover:border-brand-border hover:bg-brand-card rounded-2xl p-3.5 transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-sm"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded-full border border-brand-cyan/20">
                  {session.category}
                </span>
                <span className="text-[10px] font-mono text-brand-silver flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5 text-brand-silver/80" />
                  {formatDuration(session.durationSeconds)}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-brand-cyan transition-colors leading-tight">
                {session.title}
              </h3>

              <p className="text-[11px] text-brand-silver/80 line-clamp-1 leading-snug">
                {session.productNarrative}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openSession(session);
              }}
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan text-black flex items-center justify-center hover:opacity-95 shadow-md shadow-brand-blue/20 transition-all shrink-0 active:scale-95"
              title="Start Rehearsal"
            >
              <Play className="w-4 h-4 fill-black ml-0.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
