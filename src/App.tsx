/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SplitCalculator } from './components/SplitCalculator';
import { BillAuditor } from './components/BillAuditor';
import { DisputeGenerator } from './components/DisputeGenerator';
import { RateBenchmark } from './components/RateBenchmark';
import { SavingsTracker } from './components/SavingsTracker';
import { MarketResearch } from './components/MarketResearch';
import { AdLeaderboard } from './components/AdPlacements';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('split');
  const [disputeTransfer, setDisputeTransfer] = useState<{
    provider: string;
    amount: string;
    reason: string;
  }>({
    provider: '',
    amount: '',
    reason: '',
  });

  // Sync with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').split('?')[0];
      const validTabs = ['split', 'audit', 'dispute', 'tracker', 'benchmark', 'playbook'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTransferToDispute = (provider: string, amount: string, reason: string) => {
    setDisputeTransfer({ provider, amount, reason });
    handleTabChange('dispute');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top AdSense Leaderboard Placement */}
        <div className="no-print">
          <AdLeaderboard onNavigateToAudit={() => handleTabChange('audit')} />
        </div>

        {/* Tab Views */}
        {activeTab === 'split' && <SplitCalculator />}
        {activeTab === 'audit' && (
          <BillAuditor onTransferToDispute={handleTransferToDispute} />
        )}
        {activeTab === 'dispute' && (
          <DisputeGenerator
            initialProvider={disputeTransfer.provider}
            initialAmount={disputeTransfer.amount}
            initialReason={disputeTransfer.reason}
          />
        )}
        {activeTab === 'tracker' && (
          <SavingsTracker
            onNavigateToAudit={() => handleTabChange('audit')}
            onNavigateToDispute={() => handleTabChange('dispute')}
          />
        )}
        {activeTab === 'benchmark' && <RateBenchmark />}
        {activeTab === 'playbook' && <MarketResearch />}

        {/* FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer setActiveTab={handleTabChange} />
    </div>
  );
}
