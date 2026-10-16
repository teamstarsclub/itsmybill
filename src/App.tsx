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

  // Sync with clean URL query or clean state without hash
  useEffect(() => {
    const handleUrlSync = () => {
      // Check query param first (?tab=audit)
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const validTabs = ['split', 'audit', 'dispute', 'tracker', 'benchmark'];

      // If legacy hash exists, read it and clean it from URL
      const legacyHash = window.location.hash.replace('#', '').split('?')[0];
      if (validTabs.includes(legacyHash)) {
        setActiveTab(legacyHash);
        window.history.replaceState(null, '', window.location.pathname + (legacyHash !== 'split' ? `?tab=${legacyHash}` : ''));
        return;
      }

      if (tabParam && validTabs.includes(tabParam)) {
        setActiveTab(tabParam);
      } else if (window.location.hash) {
        // Strip any remaining hashes
        window.history.replaceState(null, '', window.location.pathname + (window.location.search || ''));
      }
    };

    handleUrlSync();
    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, []);

  const TAB_METADATA: Record<string, { title: string; desc: string }> = {
    split: {
      title: 'Free Bill Splitter & Bill Fee Checker | ItsMyBill',
      desc: 'Split shared bills fairly, review potential fees, draft dispute letters, and compare utility costs by state with free tools from ItsMyBill.',
    },
    audit: {
      title: 'Line-Item Fee Checker & Bill Review | ItsMyBill',
      desc: 'Review telecom, internet, cable, and medical statements for ancillary surcharges, unbundled fees, and expired promotional rates with ItsMyBill.',
    },
    dispute: {
      title: 'Consumer Bill Dispute Letter Drafting Tool | ItsMyBill',
      desc: 'Draft formal dispute notices tailored to relevant federal consumer protection statutes, including the No Surprises Act and Fair Credit Billing Act.',
    },
    tracker: {
      title: 'Realized Bill Savings Tracker | ItsMyBill',
      desc: 'Track and calculate your ongoing monthly and one-time realized savings from negotiated bills and disputed fees.',
    },
    benchmark: {
      title: '50-State Utility Benchmarks & Comparison | ItsMyBill',
      desc: 'Compare household electric, gas, water, and broadband costs against published state averages from the U.S. Energy Information Administration.',
    },
  };

  // Sync title and metadata with active tab
  useEffect(() => {
    const meta = TAB_METADATA[activeTab] || TAB_METADATA.split;
    document.title = meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', meta.desc);
    }
  }, [activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Use clean URLs without any '#' character
    const newUrl = tab === 'split' ? window.location.pathname : `${window.location.pathname}?tab=${tab}`;
    window.history.replaceState(null, '', newUrl);
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
        {activeTab === 'benchmark' && (
          <RateBenchmark onNavigateToAudit={() => handleTabChange('audit')} />
        )}

        {/* FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer setActiveTab={handleTabChange} />
    </div>
  );
}
