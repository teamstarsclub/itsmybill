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

  const ROUTE_TO_TAB: Record<string, string> = {
    '/': 'split',
    '/bill-splitter': 'split',
    '/bill-splitter/': 'split',
    '/bill-auditor': 'audit',
    '/bill-auditor/': 'audit',
    '/dispute-letter-generator': 'dispute',
    '/dispute-letter-generator/': 'dispute',
    '/utility-benchmarks': 'benchmark',
    '/utility-benchmarks/': 'benchmark',
    '/savings-tracker': 'tracker',
    '/savings-tracker/': 'tracker',
  };

  const TAB_TO_ROUTE: Record<string, string> = {
    split: '/bill-splitter/',
    audit: '/bill-auditor/',
    dispute: '/dispute-letter-generator/',
    benchmark: '/utility-benchmarks/',
    tracker: '/savings-tracker/',
  };

  // Sync with pathname and query params (?tab=audit)
  useEffect(() => {
    const handleUrlSync = () => {
      const pathname = window.location.pathname.toLowerCase();
      const tabFromPath = ROUTE_TO_TAB[pathname] || ROUTE_TO_TAB[pathname.replace(/\/$/, '')];

      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const validTabs = ['split', 'audit', 'dispute', 'tracker', 'benchmark'];

      // If legacy hash exists, read it
      const legacyHash = window.location.hash.replace('#', '').split('?')[0];
      if (validTabs.includes(legacyHash)) {
        setActiveTab(legacyHash);
        window.history.replaceState(null, '', TAB_TO_ROUTE[legacyHash] || '/');
        return;
      }

      if (tabParam && validTabs.includes(tabParam)) {
        setActiveTab(tabParam);
      } else if (tabFromPath) {
        setActiveTab(tabFromPath);
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
      desc: 'Compare household electric and natural gas expenses against official benchmarks from the U.S. EIA, with FCC broadband benchmarks and municipal water survey data.',
    },
  };

  // Sync title, description, and canonical tag with active tab
  useEffect(() => {
    const meta = TAB_METADATA[activeTab] || TAB_METADATA.split;
    document.title = meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', meta.desc);
    }
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      const canonicalHref = activeTab === 'split' && window.location.pathname === '/' 
        ? 'https://www.itsmybill.com/' 
        : `https://www.itsmybill.com${TAB_TO_ROUTE[activeTab] || '/'}`;
      canonicalLink.setAttribute('href', canonicalHref);
    }
  }, [activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const targetRoute = tab === 'split' ? '/' : (TAB_TO_ROUTE[tab] || `/?tab=${tab}`);
    window.history.pushState(null, '', targetRoute);
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
