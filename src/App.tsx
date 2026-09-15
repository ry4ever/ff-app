import React, { useState } from 'react';
import { FearlessProvider, useFearless } from './services/store';
import { Header } from './components/Header';
import { NavigationBar } from './components/NavigationBar';
import { AudioPlayerModal } from './components/AudioPlayerModal';
import { JerseyUnlockModal } from './components/JerseyUnlockModal';
import { OnboardingModal } from './components/screens/OnboardingModal';
import { FearlessHQScreen } from './components/screens/FearlessHQScreen';
import { CommunityFeedScreen } from './components/screens/CommunityFeedScreen';
import { FearlessVaultScreen } from './components/screens/FearlessVaultScreen';
import { ParentDashboardScreen } from './components/screens/ParentDashboardScreen';
import { StripeCheckoutModal } from './components/screens/StripeCheckoutModal';
import { Smartphone, Monitor, Bell, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, notifications } = useFearless();
  const [activeNudge, setActiveNudge] = useState<number | null>(0);
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);

  const currentNudge = activeNudge !== null && notifications[activeNudge] ? notifications[activeNudge] : null;

  return (
    <div className="min-h-screen bg-brand-black text-white flex flex-col items-center justify-start sm:py-6">
      {/* Top Device & Viewport Switcher Bar for Pair Programming Review */}
      <div className="w-full max-w-md flex items-center justify-between px-4 py-2 text-xs text-brand-silver mb-2 hidden sm:flex">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-brand-cyan">
          <span>Fearless Footaballer v1.0</span>
          <span>&bull;</span>
          <span>Dual-ICP Mobile Platform</span>
        </div>
        <div className="flex items-center gap-1 bg-brand-card p-1 rounded-lg border border-brand-border text-[11px]">
          <button
            onClick={() => setDeviceFrameMode(true)}
            className={`px-2 py-0.5 rounded flex items-center gap-1 ${
              deviceFrameMode ? 'bg-brand-blue text-black font-bold' : 'hover:text-white'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>Mobile Frame</span>
          </button>
          <button
            onClick={() => setDeviceFrameMode(false)}
            className={`px-2 py-0.5 rounded flex items-center gap-1 ${
              !deviceFrameMode ? 'bg-brand-blue text-black font-bold' : 'hover:text-white'
            }`}
          >
            <Monitor className="w-3 h-3" />
            <span>Full View</span>
          </button>
        </div>
      </div>

      {/* Main Container / Mobile Device Simulator Frame */}
      <div
        className={`w-full transition-all duration-300 ${
          deviceFrameMode
            ? 'max-w-md sm:border sm:border-brand-border/80 sm:rounded-[36px] sm:shadow-2xl sm:shadow-brand-blue/15 overflow-hidden bg-brand-black min-h-[92vh] flex flex-col relative'
            : 'max-w-xl min-h-screen flex flex-col relative bg-brand-black'
        }`}
      >
        {/* Sticky App Header */}
        <Header />

        {/* Behavioral Nudge Banner (Section 5 Push Infrastructure) */}
        {currentNudge && (
          <div className="mx-4 mt-3 p-3 bg-brand-card/90 border border-brand-cyan/40 rounded-2xl flex items-start gap-2.5 shadow-lg shadow-brand-blue/10 animate-in slide-in-from-top-2 duration-300">
            <div className="p-1.5 rounded-xl bg-brand-cyan/15 text-brand-cyan mt-0.5 shrink-0">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-brand-cyan block">
                Behavioral Nudge &bull; Retention Moat
              </span>
              <h4 className="text-xs font-bold text-white leading-tight">
                {currentNudge.title}
              </h4>
              <p className="text-[11px] text-brand-silver leading-snug mt-0.5">
                {currentNudge.body}
              </p>
            </div>
            <button
              onClick={() => setActiveNudge(null)}
              className="text-brand-silver hover:text-white shrink-0 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scrollable Screen Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'hq' && <FearlessHQScreen />}
          {activeTab === 'feed' && <CommunityFeedScreen />}
          {activeTab === 'vault' && <FearlessVaultScreen />}
          {activeTab === 'parent' && <ParentDashboardScreen />}
        </main>

        {/* Bottom Tab Navigation Bar (Tab 4 Thumb-Strike Placement) */}
        <NavigationBar />

        {/* Modals & Flow Controllers */}
        <OnboardingModal />
        <AudioPlayerModal />
        <JerseyUnlockModal />
        <StripeCheckoutModal />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <FearlessProvider>
      <AppContent />
    </FearlessProvider>
  );
};

export default App;
