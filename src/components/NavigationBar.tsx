import React from 'react';
import { useFearless } from '../services/store';
import { Compass, BookOpen, Users, Zap } from 'lucide-react';

export const NavigationBar: React.FC = () => {
  const { activeTab, setActiveTab, activeRole } = useFearless();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-brand-dark/95 backdrop-blur-xl border-t border-brand-border">
      <div className="max-w-md mx-auto grid grid-cols-4 px-2 py-2">
        {/* Tab 1: Community Feed */}
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center justify-center py-1 transition-all rounded-lg ${
            activeTab === 'feed'
              ? 'text-brand-cyan font-bold scale-105'
              : 'text-brand-silver/70 hover:text-white font-medium'
          }`}
        >
          <Compass className="w-5 h-5 mb-1 stroke-[2]" />
          <span className="text-[10px] tracking-tight">Shortcuts</span>
        </button>

        {/* Tab 2: Fearless Vault */}
        <button
          onClick={() => setActiveTab('vault')}
          className={`flex flex-col items-center justify-center py-1 transition-all rounded-lg ${
            activeTab === 'vault'
              ? 'text-brand-cyan font-bold scale-105'
              : 'text-brand-silver/70 hover:text-white font-medium'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-1 stroke-[2]" />
          <span className="text-[10px] tracking-tight">The Vault</span>
        </button>

        {/* Tab 3: Parent Dashboard */}
        <button
          onClick={() => setActiveTab('parent')}
          className={`flex flex-col items-center justify-center py-1 transition-all rounded-lg relative ${
            activeTab === 'parent'
              ? 'text-brand-cyan font-bold scale-105'
              : 'text-brand-silver/70 hover:text-white font-medium'
          }`}
        >
          <Users className="w-5 h-5 mb-1 stroke-[2]" />
          <span className="text-[10px] tracking-tight">Parent</span>
          {activeRole === 'parent' && (
            <span className="absolute top-1 right-5 w-2 h-2 bg-brand-cyan rounded-full animate-ping" />
          )}
        </button>

        {/* Tab 4: FEARLESS HQ (Primary Thumb-Strike Zone) */}
        <button
          onClick={() => setActiveTab('hq')}
          className={`flex flex-col items-center justify-center py-1 transition-all rounded-xl relative ${
            activeTab === 'hq'
              ? 'text-white bg-gradient-to-t from-brand-blue/30 to-brand-card border border-brand-blue/50 shadow-lg shadow-brand-blue/25 scale-105 font-extrabold'
              : 'text-brand-silver hover:text-white font-semibold'
          }`}
        >
          <div className="relative">
            <Zap className={`w-5 h-5 mb-1 stroke-[2.5] ${activeTab === 'hq' ? 'text-brand-cyan fill-brand-cyan/30' : ''}`} />
            {activeTab === 'hq' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-cyan rounded-full shadow-[0_0_8px_#69E0FA]" />
            )}
          </div>
          <span className="text-[10px] tracking-wide uppercase">Fearless HQ</span>
        </button>
      </div>
    </nav>
  );
};
