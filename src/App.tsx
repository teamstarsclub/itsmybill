/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeHub, HOME_FAQS } from './components/HomeHub';
import { PageFAQ } from './components/PageFAQ';
import { TrustByline } from './components/TrustByline';
import {
  STATE_BENCHMARKS,
  PROVIDER_AUDITS,
  CORE_DISPUTE_TEMPLATES,
  getStateBySlug,
  getProviderAuditBySlug,
  getDisputeTemplateBySlug,
  getEditorialHubBySlug,
  getEditorialSpokeBySlug,
  buildStateGeoSummary,
  buildStateFaqs,
  BENCHMARK_METADATA,
} from './data/pseoData';
import { getPostBySlug } from './data/blogData';
import { SPLITTER_VARIANT_CONFIGS } from './components/SplitterLandingPage';
import { applySeoMetadataToDocument, SeoRouteMeta } from './utils/seoEngine';
import { ENTITY_CONFIG } from './data/trustData';

// Lazy-loaded route views to protect initial LCP and bundle weight
const SplitterLandingPage = lazy(() =>
  import('./components/SplitterLandingPage').then((m) => ({ default: m.SplitterLandingPage }))
);
const BillAuditor = lazy(() =>
  import('./components/BillAuditor').then((m) => ({ default: m.BillAuditor }))
);
const ProviderAuditPage = lazy(() =>
  import('./components/ProviderAuditPage').then((m) => ({ default: m.ProviderAuditPage }))
);
const DisputeGenerator = lazy(() =>
  import('./components/DisputeGenerator').then((m) => ({ default: m.DisputeGenerator }))
);
const DisputeTemplatePage = lazy(() =>
  import('./components/DisputeTemplatePage').then((m) => ({ default: m.DisputeTemplatePage }))
);
const RateBenchmark = lazy(() =>
  import('./components/RateBenchmark').then((m) => ({ default: m.RateBenchmark }))
);
const StateBenchmarkPage = lazy(() =>
  import('./components/StateBenchmarkPage').then((m) => ({ default: m.StateBenchmarkPage }))
);
const SavingsTracker = lazy(() =>
  import('./components/SavingsTracker').then((m) => ({ default: m.SavingsTracker }))
);
const BlogSection = lazy(() =>
  import('./components/BlogSection').then((m) => ({ default: m.BlogSection }))
);
const GuidesHubSection = lazy(() =>
  import('./components/GuidesHubSection').then((m) => ({ default: m.GuidesHubSection }))
);
const TrustPages = lazy(() =>
  import('./components/TrustPages').then((m) => ({ default: m.TrustPages }))
);
const AnnualReportPage = lazy(() =>
  import('./components/AnnualReportPage').then((m) => ({ default: m.AnnualReportPage }))
);
const SplitCalculator = lazy(() =>
  import('./components/SplitCalculator').then((m) => ({ default: m.SplitCalculator }))
);

function normalizePathname(raw: string): string {
  const clean = (raw || '/').split('?')[0].split('#')[0].toLowerCase();
  if (clean === '/' || clean === '') return '/';
  return clean.endsWith('/') ? clean : `${clean}/`;
}

const AUDITOR_HUB_FAQS = [
  {
    question: 'Does the ItsMyBill Fee Auditor upload my pasted bill statement to a server?',
    answer:
      'No. All line-item pattern matching, dollar extraction, and script generation execute 100% locally inside your web browser. Zero bill text or account numbers leave your device.',
  },
  {
    question: 'Which hidden fees does the client-side Bill Auditor automatically flag?',
    answer:
      'It flags Broadcast TV surcharges, Regional Sports fees, $7–$15 modem/router rentals, Regulatory & Administrative Recovery charges, optional device protection/insurance add-ons, data-cap overages, Revenue Code 0450 hospital facility fees, out-of-network ER codes (CPT 99284/99285), and estimated utility meter reads.',
  },
  {
    question: 'What should I do after the auditor flags a charge on my bill?',
    answer:
      'Copy the generated Customer Retention script for phone/chat negotiations, or click "Draft Written Dispute Notice" to build a Certified Mail statutory dispute letter citing FCC, CMS, or State PUC rules.',
  },
];

const DISPUTE_HUB_FAQS = [
  {
    question: 'Why should I mail a formal written dispute letter instead of only calling support?',
    answer:
      'Key federal and state consumer statutes—including the Fair Credit Billing Act (15 U.S.C. § 1666) and Fair Debt Collection Practices Act (15 U.S.C. § 1692g)—strictly require written notice delivered within 30 or 60 days to freeze collections and preserve legal remedies.',
  },
  {
    question: 'Are my name, account number, and dispute details stored on ItsMyBill servers?',
    answer:
      'No. Every dispute letter is formatted 100% locally in your browser with zero network calls, zero database storage, and zero account login requirements.',
  },
  {
    question: 'How should I send my completed statutory dispute letter?',
    answer:
      'Print or save as PDF, attach copies (never originals) of statements or EOBs, and send via USPS Certified Mail with Return Receipt Requested (PS Form 3811) so you hold admissible proof of delivery date.',
  },
];

const BENCHMARK_HUB_FAQS = [
  {
    question: 'Which official sources back the 50-state utility benchmarks?',
    answer:
      'Electricity rates (¢/kWh) come from U.S. EIA Form EIA-861M (Electric Power Monthly, Table 5.6.A). Natural gas reflects EIA/AGA residential heating averages, broadband reflects FCC Urban Rate Survey 100–300 Mbps tiers, and water reflects AWWA/EPA residential rate surveys.',
  },
  {
    question: 'Why do electric bills vary so widely across U.S. states?',
    answer:
      'Regional generation mix (hydroelectric power in Washington vs. imported petroleum in Hawaii or pipeline-constrained New England gas), wildfire grid-hardening riders in California, and climate-driven cooling or heating consumption create wide state-to-state spreads.',
  },
  {
    question: 'Can I compare my specific state against neighboring states?',
    answer:
      'Yes. Click any state in the 51-jurisdiction directory below to open its dedicated benchmark page with regional utility providers, deregulation status, neighboring state links, and your official state PUC complaint portal.',
  },
];

const SAVINGS_HUB_FAQS = [
  {
    question: 'Where are my logged bill savings stored?',
    answer:
      'All savings entries are stored exclusively in your own browser’s localStorage on your device. Nothing is synced to external servers or tied to an email address.',
  },
  {
    question: 'How is the 5-year compounded wealth projection calculated?',
    answer:
      'Recurring monthly bill reductions are compounded monthly over 60 months using a standard 7% nominal annual return benchmark, added to one-time dispute wipes.',
  },
];

function resolveSeoMeta(pathname: string): SeoRouteMeta {
  const today = ENTITY_CONFIG.lastVerified;

  if (pathname === '/') {
    return {
      path: '/',
      title: 'ItsMyBill — Free Bill Fee Auditor, State Utility Benchmarks & Dispute Letters',
      description:
        'Audit hidden telecom and hospital fees, benchmark 50-state EIA utility rates, split bills by income, and draft statutory dispute letters 100% locally.',
      breadcrumbs: [{ name: 'Home', path: '/' }],
      webAppName: 'ItsMyBill Consumer Bill Defense Suite',
      webAppDescription:
        '100% client-side consumer utility hub for fee auditing, statutory dispute letter drafting, 50-state utility benchmarks, and fair expense splitting.',
      faqs: HOME_FAQS,
    };
  }

  if (pathname === '/bill-splitter/') {
    const cfg = SPLITTER_VARIANT_CONFIGS.equal;
    return {
      path: pathname,
      title: cfg.seoTitle,
      description: cfg.metaDescription,
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Bill & Tip Splitter', path: pathname },
      ],
      webAppName: cfg.h1,
      webAppDescription: cfg.metaDescription,
      faqs: cfg.faqs,
    };
  }

  if (pathname === '/income-based-bill-splitter/') {
    const cfg = SPLITTER_VARIANT_CONFIGS.income;
    return {
      path: pathname,
      title: cfg.seoTitle,
      description: cfg.metaDescription,
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Income-Based Bill Splitter', path: pathname },
      ],
      webAppName: cfg.h1,
      webAppDescription: cfg.metaDescription,
      faqs: cfg.faqs,
    };
  }

  if (pathname === '/itemized-receipt-splitter/') {
    const cfg = SPLITTER_VARIANT_CONFIGS.itemized;
    return {
      path: pathname,
      title: cfg.seoTitle,
      description: cfg.metaDescription,
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Itemized Receipt Splitter', path: pathname },
      ],
      webAppName: cfg.h1,
      webAppDescription: cfg.metaDescription,
      faqs: cfg.faqs,
    };
  }

  if (pathname === '/bill-auditor/') {
    return {
      path: pathname,
      title: 'Free Line-Item Bill Fee Auditor & Junk-Fee Checker | ItsMyBill',
      description:
        'Audit telecom, internet, utility, and hospital bills locally in your browser for hidden surcharges, modem rentals, and Revenue Code 0450 facility fees.',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Bill Fee Auditor', path: pathname },
      ],
      webAppName: 'ItsMyBill Line-Item Fee Auditor',
      webAppDescription:
        '100% client-side statement auditor flagging ancillary carrier surcharges and unbundled medical facility charges.',
      faqs: AUDITOR_HUB_FAQS,
    };
  }

  if (pathname.startsWith('/bill-auditor/')) {
    const slug = pathname.slice('/bill-auditor/'.length).replace(/\/$/, '');
    const profile = getProviderAuditBySlug(slug);
    if (profile) {
      return {
        path: pathname,
        title: profile.seoTitle,
        description: profile.metaDescription,
        ogType: 'article',
        dateModified: today,
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Bill Fee Auditor', path: '/bill-auditor/' },
          { name: profile.providerName, path: pathname },
        ],
        webAppName: `${profile.providerName} Bill Auditor`,
        webAppDescription: profile.metaDescription,
        faqs: profile.faqs,
      };
    }
  }

  if (pathname === '/dispute-letter-generator/') {
    return {
      path: pathname,
      title: 'Free Statutory Bill Dispute Letter Generator | ItsMyBill',
      description:
        'Draft formal Certified Mail dispute notices citing the No Surprises Act, FDCPA, FCBA, FCC Truth-in-Billing, IRC § 501(r), and 51 state deposit statutes.',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Dispute Letter Generator', path: pathname },
      ],
      webAppName: 'ItsMyBill Statutory Dispute Letter Generator',
      webAppDescription:
        '100% client-side consumer dispute letter builder with federal and state statutory templates.',
      faqs: DISPUTE_HUB_FAQS,
    };
  }

  if (pathname.startsWith('/dispute-letter/')) {
    const slug = pathname.slice('/dispute-letter/'.length).replace(/\/$/, '');
    const tpl = getDisputeTemplateBySlug(slug);
    if (tpl) {
      return {
        path: pathname,
        title: tpl.seoTitle,
        description: tpl.metaDescription,
        ogType: 'article',
        dateModified: today,
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Dispute Letter Generator', path: '/dispute-letter-generator/' },
          { name: tpl.h1, path: pathname },
        ],
        webAppName: tpl.h1,
        webAppDescription: tpl.metaDescription,
        faqs: tpl.faqs,
      };
    }
  }

  if (pathname === '/utility-benchmarks/') {
    return {
      path: pathname,
      title: '50-State Utility Cost Benchmarks (EIA, FCC & AWWA) | ItsMyBill',
      description:
        'Compare your electricity, gas, water, and broadband bills against official EIA Table 5.6.A, FCC Urban Rate Survey, and AWWA benchmarks across all 50 states.',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: '50-State Utility Benchmarks', path: pathname },
      ],
      webAppName: 'ItsMyBill 50-State Utility Benchmark Calculator',
      webAppDescription:
        'Interactive 51-jurisdiction residential utility rate comparison tool backed by U.S. EIA, FCC, and AWWA datasets.',
      dataset: {
        name: '2026 U.S. 50-State + D.C. Residential Utility Rate Benchmarks',
        description:
          'State-by-state residential electricity rates (¢/kWh), monthly electricity, natural gas, broadband, and water utility medians compiled from EIA Table 5.6.A, FCC Urban Rate Survey, and AWWA.',
        spatialCoverage: 'United States (50 States + District of Columbia)',
        temporalCoverage: '2025/2026',
        variableMeasured: [
          'Residential Electricity Price (cents/kWh)',
          'Monthly Residential Electric Cost (USD)',
          'Monthly Natural Gas Heating Cost (USD)',
          'Monthly Water & Sewer Cost (USD)',
          'Monthly Standalone Broadband Cost (USD)',
        ],
      },
      faqs: BENCHMARK_HUB_FAQS,
    };
  }

  if (pathname.startsWith('/utility-benchmarks/')) {
    const slug = pathname.slice('/utility-benchmarks/'.length).replace(/\/$/, '');
    const st = getStateBySlug(slug);
    if (st) {
      return {
        path: pathname,
        title: `${st.state} Utility Bills & Electric Rates (${st.avgElectricityRateKwh}¢/kWh) | ItsMyBill`,
        description: `Compare ${st.state} utility bills vs. U.S. averages: ${st.avgElectricityRateKwh}¢/kWh electricity (EIA Table 5.6.A), $${st.avgMonthlyGas}/mo gas, $${st.avgMonthlyWater}/mo water & $${st.avgMonthlyInternet}/mo internet.`,
        ogType: 'article',
        dateModified: today,
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: '50-State Utility Benchmarks', path: '/utility-benchmarks/' },
          { name: st.state, path: pathname },
        ],
        webAppName: `${st.state} Utility Cost Benchmark Calculator`,
        webAppDescription: buildStateGeoSummary(st),
        dataset: {
          name: `${st.state} (${st.code}) Residential Utility Cost Benchmarks (2026)`,
          description: buildStateGeoSummary(st),
          spatialCoverage: `${st.state}, United States`,
          temporalCoverage: '2025/2026',
          variableMeasured: [
            `${st.state} Electricity Price (${st.avgElectricityRateKwh} cents/kWh)`,
            `${st.state} Monthly Electric ($${st.avgMonthlyElectric})`,
            `${st.state} Monthly Natural Gas ($${st.avgMonthlyGas})`,
            `${st.state} Monthly Water & Sewer ($${st.avgMonthlyWater})`,
            `${st.state} Monthly Broadband ($${st.avgMonthlyInternet})`,
          ],
        },
        faqs: buildStateFaqs(st),
      };
    }
  }

  if (pathname === '/savings-tracker/') {
    return {
      path: pathname,
      title: 'Realized Bill Savings Tracker & 5-Year Projection | ItsMyBill',
      description:
        'Track recurring monthly bill reductions and one-time medical dispute wins privately in local storage and project 5-year compounded wealth impact.',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Savings Tracker', path: pathname },
      ],
      webAppName: 'ItsMyBill Realized Savings Tracker',
      webAppDescription: 'Private browser-local tracker for realized consumer bill negotiations and fee reductions.',
      faqs: SAVINGS_HUB_FAQS,
    };
  }

  if (pathname === '/guides/') {
    return {
      path: pathname,
      title: 'Consumer Bill Defense & Personal Finance Hubs | ItsMyBill',
      description:
        'Statute-backed consumer topic hubs covering medical billing defense, cable/internet/wireless fee elimination, and fair shared household finance math.',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Consumer Guides', path: pathname },
      ],
    };
  }

  if (pathname.startsWith('/guides/')) {
    const parts = pathname.slice('/guides/'.length).replace(/\/$/, '').split('/').filter(Boolean);
    if (parts.length === 1) {
      const hub = getEditorialHubBySlug(parts[0]);
      if (hub) {
        return {
          path: pathname,
          title: hub.seoTitle,
          description: hub.metaDescription,
          ogType: 'article',
          dateModified: hub.lastVerified,
          breadcrumbs: [
            { name: 'Home', path: '/' },
            { name: 'Consumer Guides', path: '/guides/' },
            { name: hub.title, path: pathname },
          ],
        };
      }
    } else if (parts.length >= 2) {
      const found = getEditorialSpokeBySlug(parts[0], parts[1]);
      if (found) {
        return {
          path: pathname,
          title: found.spoke.seoTitle,
          description: found.spoke.metaDescription,
          ogType: 'article',
          dateModified: found.spoke.lastVerified,
          breadcrumbs: [
            { name: 'Home', path: '/' },
            { name: 'Consumer Guides', path: '/guides/' },
            { name: found.hub.title, path: `/guides/${found.hub.clusterSlug}/` },
            { name: found.spoke.title, path: pathname },
          ],
          faqs: found.spoke.faqs,
        };
      }
    }
  }

  if (pathname === '/blog/') {
    return {
      path: pathname,
      title: 'Bills & Personal Finance Blog | ItsMyBill Playbooks',
      description:
        'Authoritative U.S. consumer guides on lowering monthly bills, disputing medical and credit charges under federal law, comparing utility rates, and budgeting.',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Bills & Finance Blog', path: pathname },
      ],
    };
  }

  if (pathname.startsWith('/blog/')) {
    const slug = pathname.slice('/blog/'.length).replace(/\/$/, '');
    const post = getPostBySlug(slug);
    if (post) {
      return {
        path: pathname,
        title: post.seoTitle,
        description: post.metaDescription,
        ogType: 'article',
        ogImage: `https://www.itsmybill.com${post.coverImage}`,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Bills & Finance Blog', path: '/blog/' },
          { name: post.title, path: pathname },
        ],
        faqs: post.faqs,
      };
    }
  }

  if (pathname === '/about/') {
    return {
      path: pathname,
      title: 'About ItsMyBill — Privacy-First Consumer Bill Defense Platform',
      description:
        'Learn about ItsMyBill Consumer Utilities, our zero-upload client-side privacy architecture, independent funding model, and editorial research desks.',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'About', path: pathname },
      ],
    };
  }

  if (pathname === '/editorial-policy/') {
    return {
      path: pathname,
      title: 'Editorial, Fact-Checking & Corrections Policy | ItsMyBill',
      description:
        'How ItsMyBill verifies U.S. statutes, EIA utility benchmarks, and carrier fees against primary government sources with transparent credential labeling.',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Editorial Policy', path: pathname },
      ],
    };
  }

  if (pathname === '/methodology/') {
    return {
      path: pathname,
      title: 'Data Sources, Units & Calculation Methodology | ItsMyBill',
      description:
        'Reproducible bill-splitting formulas and live primary government citations (U.S. EIA Table 5.6.A, CMS, FCC, CFPB, IRS § 501(r), and AWWA).',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Data Methodology', path: pathname },
      ],
    };
  }

  if (pathname.startsWith('/authors/')) {
    const slug = pathname.slice('/authors/'.length).replace(/\/$/, '');
    return {
      path: pathname,
      title: `Editorial Profile: ${slug.replace(/-/g, ' ')} | ItsMyBill`,
      description: 'Editorial mission, primary-source verification scope, and credential review disclosures for ItsMyBill.',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about/' },
        { name: 'Editorial Profile', path: pathname },
      ],
    };
  }

  if (pathname === '/reports/2026-us-utility-and-junk-fee-report/') {
    return {
      path: pathname,
      title: '2026 U.S. Household Utility Cost & Junk-Fee Report | ItsMyBill',
      description:
        'Sortable 51-jurisdiction ranking of U.S. residential electricity rates (EIA Table 5.6.A), combined monthly utilities, deposit deadlines, and carrier fees.',
      ogType: 'article',
      datePublished: '2026-10-01',
      dateModified: today,
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: '2026 U.S. Utility & Junk-Fee Report', path: pathname },
      ],
      dataset: {
        name: '2026 U.S. Household Utility Cost & Junk-Fee Report Dataset',
        description: `51-jurisdiction residential utility rate dataset (national baseline ${BENCHMARK_METADATA.nationalBaseline.avgElectricityRateKwh}¢/kWh, $${BENCHMARK_METADATA.nationalBaseline.avgCombinedMonthly}/mo combined) and major U.S. carrier surcharge index.`,
        spatialCoverage: 'United States',
        temporalCoverage: '2026',
        variableMeasured: [
          'State Residential Electricity Price (¢/kWh)',
          'Combined 4-Utility Monthly Household Baseline (USD)',
          'State Tenant Security Deposit Return Deadline (Days)',
        ],
      },
    };
  }

  if (pathname.startsWith('/embed/')) {
    return {
      path: pathname,
      title: 'Embedded Consumer Calculator | ItsMyBill',
      description: 'Privacy-first client-side embeddable calculator widget powered by ItsMyBill.com.',
      noindex: true,
    };
  }

  return {
    path: '/',
    title: 'ItsMyBill — Free Bill Fee Auditor, State Utility Benchmarks & Dispute Letters',
    description:
      'Audit hidden telecom and hospital fees, benchmark 50-state EIA utility rates, split bills by income, and draft statutory dispute letters 100% locally.',
  };
}

export default function App() {
  const [pathname, setPathname] = useState<string>(() => normalizePathname(window.location.pathname));
  const [disputeTransfer, setDisputeTransfer] = useState<{
    provider: string;
    amount: string;
    reason: string;
  }>({
    provider: '',
    amount: '',
    reason: '',
  });

  useEffect(() => {
    const onPopState = () => {
      setPathname(normalizePathname(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Sync full SEO metadata & stacked @graph JSON-LD on every route change
  useEffect(() => {
    const meta = resolveSeoMeta(pathname);
    applySeoMetadataToDocument(meta);
  }, [pathname]);

  const handleNavigate = (targetPath: string) => {
    const normalized = normalizePathname(targetPath);
    if (normalized !== pathname) {
      window.history.pushState(null, '', normalized);
      setPathname(normalized);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLegacyTabNavigate = (tab: string) => {
    const map: Record<string, string> = {
      split: '/bill-splitter/',
      audit: '/bill-auditor/',
      dispute: '/dispute-letter-generator/',
      benchmark: '/utility-benchmarks/',
      tracker: '/savings-tracker/',
      blog: '/blog/',
    };
    handleNavigate(map[tab] || '/');
  };

  const handleTransferToDispute = (provider: string, amount: string, reason: string) => {
    setDisputeTransfer({ provider, amount, reason });
    handleNavigate('/dispute-letter-generator/');
  };

  // Chrome-free Embed Routes (/embed/income-bill-splitter/ and /embed/state-utility-benchmark/)
  if (pathname === '/embed/income-bill-splitter/' || pathname === '/embed/state-utility-benchmark/') {
    const stateParam = new URLSearchParams(window.location.search).get('state') || 'CA';
    const isIncomeEmbed = pathname === '/embed/income-bill-splitter/';

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans">
        <Suspense fallback={<div className="min-h-[540px]" />}>
          {isIncomeEmbed ? (
            <SplitCalculator defaultMode="income" lockedMode embedded hideHero />
          ) : (
            <RateBenchmark initialStateCode={stateParam} embedded hideHero />
          )}
        </Suspense>
        <footer className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>100% Client-Side Math · Zero Data Collected</span>
          <a
            href={
              isIncomeEmbed
                ? 'https://www.itsmybill.com/income-based-bill-splitter/'
                : 'https://www.itsmybill.com/utility-benchmarks/'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2"
          >
            Powered by ItsMyBill.com
          </a>
        </footer>
      </div>
    );
  }

  const renderPage = () => {
    // 1. Flagship Consumer Bill Defense Hub (/)
    if (pathname === '/') {
      return <HomeHub onNavigate={handleNavigate} />;
    }

    // 2. Dedicated Intent-Separated Splitters
    if (pathname === '/bill-splitter/') {
      return <SplitterLandingPage variant="equal" onNavigate={handleNavigate} />;
    }
    if (pathname === '/income-based-bill-splitter/') {
      return <SplitterLandingPage variant="income" onNavigate={handleNavigate} />;
    }
    if (pathname === '/itemized-receipt-splitter/') {
      return <SplitterLandingPage variant="itemized" onNavigate={handleNavigate} />;
    }

    // 3. Bill Auditor Hub & 12 Provider/Medical pSEO Auditor Pages
    if (pathname === '/bill-auditor/') {
      return (
        <div className="space-y-8">
          <TrustByline onNavigate={handleNavigate} />
          <BillAuditor onTransferToDispute={handleTransferToDispute} />
          <section className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-3">
            <h2 className="text-lg font-bold text-white">Pre-Configured Provider &amp; Hospital Fee Auditors</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {PROVIDER_AUDITS.map((prov) => (
                <a
                  key={prov.slug}
                  href={`/bill-auditor/${prov.slug}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate(`/bill-auditor/${prov.slug}/`);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-emerald-300 transition-colors"
                >
                  {prov.providerName} ({prov.category}) →
                </a>
              ))}
            </div>
          </section>
          <PageFAQ heading="Bill Fee Auditor — Frequently Asked Questions" items={AUDITOR_HUB_FAQS} />
        </div>
      );
    }
    if (pathname.startsWith('/bill-auditor/')) {
      const slug = pathname.slice('/bill-auditor/'.length).replace(/\/$/, '');
      const profile = getProviderAuditBySlug(slug);
      if (profile) {
        return (
          <ProviderAuditPage
            profile={profile}
            onNavigate={handleNavigate}
            onTransferToDispute={handleTransferToDispute}
          />
        );
      }
    }

    // 4. Dispute Generator Hub & 57 Statutory Dispute Letter Pages (6 core + 51 state deposits)
    if (pathname === '/dispute-letter-generator/') {
      return (
        <div className="space-y-8">
          <TrustByline onNavigate={handleNavigate} showLegalDisclaimer />
          <DisputeGenerator
            initialProvider={disputeTransfer.provider}
            initialAmount={disputeTransfer.amount}
            initialReason={disputeTransfer.reason}
          />
          <section className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-3 no-print">
            <h2 className="text-lg font-bold text-white">Statutory Dispute Letter Templates by Law</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {CORE_DISPUTE_TEMPLATES.map((tpl) => (
                <a
                  key={tpl.slug}
                  href={`/dispute-letter/${tpl.slug}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate(`/dispute-letter/${tpl.slug}/`);
                  }}
                  className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 space-y-1 transition-colors"
                >
                  <div className="text-[11px] font-mono text-indigo-400">{tpl.statuteCode}</div>
                  <div className="text-xs font-bold text-white">{tpl.h1} →</div>
                </a>
              ))}
            </div>
          </section>
          <div className="no-print">
            <PageFAQ heading="Dispute Letter Generator — Frequently Asked Questions" items={DISPUTE_HUB_FAQS} />
          </div>
        </div>
      );
    }
    if (pathname.startsWith('/dispute-letter/')) {
      const slug = pathname.slice('/dispute-letter/'.length).replace(/\/$/, '');
      const tpl = getDisputeTemplateBySlug(slug);
      if (tpl) {
        return <DisputeTemplatePage template={tpl} onNavigate={handleNavigate} />;
      }
    }

    // 5. Utility Benchmarks Hub & 51 State Benchmark Pages
    if (pathname === '/utility-benchmarks/') {
      return (
        <div className="space-y-8">
          <TrustByline onNavigate={handleNavigate} />
          <RateBenchmark
            onNavigateToAudit={() => handleNavigate('/bill-auditor/')}
            onStateSlugSelect={(slug) => handleNavigate(`/utility-benchmarks/${slug}/`)}
          />
          <section className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-3">
            <h2 className="text-lg font-bold text-white">All 50 States + D.C. Utility Cost Benchmarks</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {STATE_BENCHMARKS.map((st) => (
                <a
                  key={st.slug}
                  href={`/utility-benchmarks/${st.slug}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate(`/utility-benchmarks/${st.slug}/`);
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs"
                >
                  <span className="font-semibold text-slate-200 truncate">{st.state}</span>
                  <span className="text-[11px] font-mono text-amber-400 tabular-nums ml-1">{st.avgElectricityRateKwh}¢</span>
                </a>
              ))}
            </div>
          </section>
          <PageFAQ heading="50-State Utility Benchmarks — Frequently Asked Questions" items={BENCHMARK_HUB_FAQS} />
        </div>
      );
    }
    if (pathname.startsWith('/utility-benchmarks/')) {
      const slug = pathname.slice('/utility-benchmarks/'.length).replace(/\/$/, '');
      const st = getStateBySlug(slug);
      if (st) {
        return <StateBenchmarkPage stateData={st} onNavigate={handleNavigate} />;
      }
    }

    // 6. Savings Tracker
    if (pathname === '/savings-tracker/') {
      return (
        <div className="space-y-8">
          <TrustByline onNavigate={handleNavigate} />
          <SavingsTracker
            onNavigateToAudit={() => handleNavigate('/bill-auditor/')}
            onNavigateToDispute={() => handleNavigate('/dispute-letter-generator/')}
          />
          <PageFAQ heading="Savings Tracker — Frequently Asked Questions" items={SAVINGS_HUB_FAQS} />
        </div>
      );
    }

    // 7. Editorial Hub-and-Spoke Guides (/guides/, /guides/[cluster]/, /guides/[cluster]/[slug]/)
    if (pathname === '/guides/' || pathname.startsWith('/guides/')) {
      const parts = pathname.slice('/guides/'.length).replace(/\/$/, '').split('/').filter(Boolean);
      return (
        <GuidesHubSection
          clusterSlug={parts[0] || null}
          spokeSlug={parts[1] || null}
          onNavigate={handleNavigate}
        />
      );
    }

    // 8. Existing Blog Library (/blog/ & /blog/[slug]/)
    if (pathname === '/blog/' || pathname.startsWith('/blog/')) {
      const slug = pathname.startsWith('/blog/')
        ? pathname.slice('/blog/'.length).replace(/\/$/, '') || null
        : null;
      return (
        <BlogSection
          activeSlug={slug && getPostBySlug(slug) ? slug : null}
          onSelectPost={(nextSlug) => handleNavigate(nextSlug ? `/blog/${nextSlug}/` : '/blog/')}
          onNavigateToTool={handleLegacyTabNavigate}
        />
      );
    }

    // 9. Trust & Governance Pages (/about/, /editorial-policy/, /methodology/, /authors/[slug]/)
    if (pathname === '/about/') {
      return <TrustPages page="about" onNavigate={handleNavigate} />;
    }
    if (pathname === '/editorial-policy/') {
      return <TrustPages page="editorial-policy" onNavigate={handleNavigate} />;
    }
    if (pathname === '/methodology/') {
      return <TrustPages page="methodology" onNavigate={handleNavigate} />;
    }
    if (pathname.startsWith('/authors/')) {
      const slug = pathname.slice('/authors/'.length).replace(/\/$/, '');
      return <TrustPages page="author" authorSlug={slug} onNavigate={handleNavigate} />;
    }

    // 10. Linkable 2026 Annual Data Study Report
    if (pathname === '/reports/2026-us-utility-and-junk-fee-report/') {
      return <AnnualReportPage onNavigate={handleNavigate} />;
    }

    // Fallback -> HomeHub
    return <HomeHub onNavigate={handleNavigate} />;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar activePath={pathname} onNavigate={handleNavigate} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense
          fallback={
            <div className="min-h-[600px] flex items-center justify-center text-xs text-slate-400">
              Loading consumer utility...
            </div>
          }
        >
          {renderPage()}
        </Suspense>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
