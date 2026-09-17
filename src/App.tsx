import React from 'react';
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
import { SessionVariationScreen } from './components/screens/SessionVariationScreen';

const AppContent: React.FC = () => {
  const { activeTab } = useFearless();

  return (
    <div className="min-h-screen bg-[#050608] text-white flex flex-col items-center justify-start sm:py-6 selection:bg-brand-cyan selection:text-black">
      {/* Mobile Device Simulator Frame */}
      <div className="w-full max-w-md sm:border sm:border-brand-border/60 sm:rounded-[36px] sm:shadow-2xl sm:shadow-brand-blue/10 overflow-hidden bg-brand-black min-h-[92vh] sm:min-h-[880px] flex flex-col relative">
        {/* Sleek App Header */}
        <Header />

        {/* Scrollable Screen Content */}
        <main className="flex-1 p-4 overflow-y-auto scrollbar-none">
          {activeTab === 'hq' && <FearlessHQScreen />}
          {activeTab === 'feed' && <CommunityFeedScreen />}
          {activeTab === 'vault' && <FearlessVaultScreen />}
          {activeTab === 'parent' && <ParentDashboardScreen />}
        </main>

        {/* Bottom Tab Navigation Bar */}
        <NavigationBar />

        {/* Modals & Flow Controllers */}
        <OnboardingModal />
        <SessionVariationScreen />
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
