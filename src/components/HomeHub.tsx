import React from 'react';
import {
  FileCheck2,
  Scale,
  Zap,
  Calculator,
  PiggyBank,
  ArrowRight,
  BarChart3,
  BookOpen,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { TrustByline } from './TrustByline';
import { PageFAQ, PageFaqItem } from './PageFAQ';
import {
  STATE_BENCHMARKS,
  PROVIDER_AUDITS,
  CORE_DISPUTE_TEMPLATES,
  EDITORIAL_HUBS,
  BENCHMARK_METADATA,
} from '../data/pseoData';

interface HomeHubProps {
  onNavigate: (path: string) => void;
}

export const HOME_FAQS: PageFaqItem[] = [
  {
    question: 'Does ItsMyBill upload my uploaded bills or personal financial inputs to a server?',
    answer:
      'No. Every calculator, line-item fee auditor, dispute letter generator, and savings tracker on ItsMyBill runs 100% locally inside your web browser. Zero bill text, account numbers, salaries, or names are ever sent to or stored on our servers.',
  },
  {
    question: 'Which federal and state consumer statutes do your dispute templates cover?',
    answer:
      'Our free drafting templates cover the federal No Surprises Act (42 U.S.C. § 300gg-111), nonprofit hospital charity care under IRC § 501(r), Fair Credit Billing Act (15 U.S.C. § 1666), Fair Debt Collection Practices Act (15 U.S.C. § 1692g), FCC Truth-in-Billing (47 C.F.R. § 64.2401), state Public Utility Commission tariff reviews, and all 50 states + D.C. residential security deposit return statutes.',
  },
  {
    question: 'Where do the 50-state utility rate benchmarks come from?',
    answer:
      'Electricity rates (¢/kWh) are sourced from U.S. Energy Information Administration (EIA) Form EIA-861M (Electric Power Monthly, Table 5.6.A). Natural gas reflects EIA/AGA residential heating averages, broadband reflects FCC Urban Rate Survey 100–300 Mbps benchmarks, and water reflects AWWA/EPA single-family utility medians.',
  },
  {
    question: 'How is ItsMyBill free without requiring bank logins or account sign-ups?',
    answer:
      'ItsMyBill is an independent, founder-funded consumer utility platform designed for zero-friction self-advocacy. We never ask for bank passwords, Plaid links, Social Security numbers, or credit cards.',
  },
];

export const HomeHub: React.FC<HomeHubProps> = ({ onNavigate }) => {
  const linkProps = (path: string) => ({
    href: path,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      onNavigate(path);
    },
  });

  const coreTools = [
    {
      title: 'Line-Item Bill Fee Auditor',
      path: '/bill-auditor/',
      icon: FileCheck2,
      accent: 'text-emerald-400',
      summary:
        'Flag Broadcast TV surcharges, $15 modem rentals, carrier recovery fees, and hospital Revenue Code 0450 facility charges locally in your browser.',
      cta: 'Audit a Statement',
    },
    {
      title: 'Statutory Dispute Letter Generator',
      path: '/dispute-letter-generator/',
      icon: Scale,
      accent: 'text-indigo-400',
      summary:
        'Draft Certified Mail dispute notices citing the No Surprises Act, FDCPA, FCBA, FCC Truth-in-Billing, IRC § 501(r), and 51 state deposit statutes.',
      cta: 'Draft Dispute Notice',
    },
    {
      title: '50-State Utility Benchmarks',
      path: '/utility-benchmarks/',
      icon: Zap,
      accent: 'text-amber-400',
      summary:
        'Compare your electricity, gas, water, and internet bills against EIA Table 5.6.A, FCC, and AWWA benchmarks across all 50 states + D.C.',
      cta: 'Compare State Rates',
    },
    {
      title: 'Income-Based & Group Splitters',
      path: '/income-based-bill-splitter/',
      icon: Calculator,
      accent: 'text-cyan-400',
      summary:
        'Split shared rent and utilities proportionally by take-home pay, divide group dining checks evenly, or calculate itemized receipt tax & tip multipliers.',
      cta: 'Open Fair Splitters',
    },
    {
      title: 'Realized Bill Savings Tracker',
      path: '/savings-tracker/',
      icon: PiggyBank,
      accent: 'text-emerald-300',
      summary:
        'Log recurring retention discounts and one-time hospital dispute reductions in private local storage to project 5-year compounded wealth impact.',
      cta: 'Track Realized Savings',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero / Flagship Consumer Bill Defense Positioning */}
      <section className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-10 space-y-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
          Consumer Bill Defense · 50-State Utility Intelligence · 100% Client-Side Privacy
        </p>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
          Audit Hidden Fees, Benchmark State Utility Rates &amp; Defend Your Consumer Rights
        </h1>

        <p data-speakable="true" className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-4xl">
          ItsMyBill is a free, privacy-first U.S. consumer bill defense hub. Audit telecom and hospital statements for avoidable surcharges, compare monthly utilities against official EIA Table 5.6.A benchmarks (U.S. average {BENCHMARK_METADATA.nationalBaseline.avgElectricityRateKwh}¢/kWh), split shared household expenses proportionally by income, and generate print-ready statutory dispute letters—entirely inside your browser with zero server uploads.
        </p>

        <TrustByline onNavigate={onNavigate} />

        {/* Quick-Action Primary CTAs */}
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            {...linkProps('/bill-auditor/')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Audit a Bill Free</span>
          </a>
          <a
            {...linkProps('/utility-benchmarks/')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Check Your State Utility Rates</span>
          </a>
          <a
            {...linkProps('/dispute-letter-generator/')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm transition-colors"
          >
            <Scale className="w-4 h-4 text-indigo-400" />
            <span>Generate Dispute Letter</span>
          </a>
        </div>
      </section>

      {/* Core 5-Pillar Consumer Tool Suite */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Five Free Client-Side Consumer Utilities
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Purpose-built tools for auditing overcharges, asserting statutory dispute timelines, and calculating equitable splits.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-semibold">
            <a {...linkProps('/bill-splitter/')} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4">
              Equal Dinner Splitter
            </a>
            <a {...linkProps('/income-based-bill-splitter/')} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4">
              Income-Fair Splitter
            </a>
            <a {...linkProps('/itemized-receipt-splitter/')} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4">
              Itemized Receipt Splitter
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <a
                key={tool.path}
                {...linkProps(tool.path)}
                className="group bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-5 h-5 ${tool.accent} shrink-0`} />
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {tool.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{tool.summary}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <span>{tool.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </a>
            );
          })}

          {/* 6th Card: 2026 Annual Data Study */}
          <a
            {...linkProps('/reports/2026-us-utility-and-junk-fee-report/')}
            className="group bg-slate-900/90 hover:bg-slate-900 border border-amber-500/30 hover:border-amber-400/60 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-colors"
          >
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-5 h-5 text-amber-400 shrink-0" />
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  2026 U.S. Utility &amp; Junk-Fee Report
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Explore our live sortable 51-jurisdiction ranking table comparing EIA electricity tariffs, combined monthly utility spend, and major carrier hidden surcharges.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <span>View 2026 National Rankings</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </a>
        </div>
      </section>

      {/* Crawlable Provider & Junk-Fee Auditor Directory */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Top Carrier, Utility &amp; Hospital Fee Auditors
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Pre-configured client-side auditors with exact fee tables, customer retention scripts, and FCC/CMS escalation checklists.
            </p>
          </div>
          <a {...linkProps('/bill-auditor/')} className="text-xs font-bold text-emerald-400 hover:text-emerald-300">
            Open Custom Bill Auditor →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PROVIDER_AUDITS.map((prov) => (
            <a
              key={prov.slug}
              {...linkProps(`/bill-auditor/${prov.slug}/`)}
              className="p-4 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-1.5"
            >
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {prov.category}
              </div>
              <h3 className="text-sm font-bold text-white">{prov.providerName}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{prov.directAnswer}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Crawlable Statutory Consumer Rights Templates */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Statutory Consumer Rights &amp; Dispute Letter Templates
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Print-ready Certified Mail templates citing federal law and all 51 state security deposit return statutes.
            </p>
          </div>
          <a {...linkProps('/dispute-letter-generator/')} className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
            Open Custom Letter Builder →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {CORE_DISPUTE_TEMPLATES.map((tpl) => (
            <a
              key={tpl.slug}
              {...linkProps(`/dispute-letter/${tpl.slug}/`)}
              className="p-4 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-colors space-y-1.5"
            >
              <div className="text-[11px] font-mono text-indigo-300">{tpl.statuteCode}</div>
              <h3 className="text-sm font-bold text-white">{tpl.h1}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{tpl.deadlineHighlight}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Crawlable 51-State Utility Benchmarks Directory */}
      <section className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              <span>Explore Utility Rate Benchmarks by State (All 50 States + D.C.)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Every state page includes EIA Table 5.6.A electricity rates, 4-utility comparison tables, regional utility providers, deregulation status, and official state PUC complaint links.
            </p>
          </div>
          <a {...linkProps('/methodology/')} className="text-xs font-semibold text-amber-400 hover:text-amber-300">
            View Data Sources &amp; Methodology →
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {STATE_BENCHMARKS.map((st) => (
            <a
              key={st.slug}
              {...linkProps(`/utility-benchmarks/${st.slug}/`)}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-950/90 hover:bg-slate-800 border border-slate-800 text-xs transition-colors"
            >
              <span className="font-semibold text-slate-200 truncate">{st.state}</span>
              <span className="text-[11px] text-amber-400 font-mono tabular-nums ml-1.5 shrink-0">
                {st.avgElectricityRateKwh}¢
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Editorial Research Hubs */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>Consumer Finance Playbook Hubs</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Deep-dive editorial hubs verified against primary U.S. government regulations.
            </p>
          </div>
          <div className="flex gap-4 text-xs font-semibold">
            <a {...linkProps('/guides/')} className="text-emerald-400 hover:text-emerald-300">
              All Topic Hubs →
            </a>
            <a {...linkProps('/blog/')} className="text-slate-300 hover:text-white">
              Full Blog Library →
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EDITORIAL_HUBS.map((hub) => (
            <div key={hub.clusterSlug} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <a
                {...linkProps(`/guides/${hub.clusterSlug}/`)}
                className="text-base font-bold text-white hover:text-emerald-400 transition-colors block"
              >
                {hub.title}
              </a>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{hub.directAnswer}</p>
              <ul className="space-y-1.5 pt-2 border-t border-slate-800">
                {hub.spokes.map((spoke) => (
                  <li key={spoke.slug}>
                    <a
                      {...linkProps(`/guides/${hub.clusterSlug}/${spoke.slug}/`)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                    >
                      {spoke.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Verification Callout */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Editorial Integrity &amp; Zero-Data Architecture</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Every benchmark cites official U.S. government tables (EIA, CMS, FCC, CFPB, IRS) and every calculation executes locally inside your browser. Read our open methodology and editorial standards.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-semibold shrink-0">
          <a {...linkProps('/methodology/')} className="px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 hover:border-emerald-500/40">
            Data Methodology
          </a>
          <a {...linkProps('/editorial-policy/')} className="px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 hover:border-emerald-500/40">
            Editorial Policy
          </a>
          <a {...linkProps('/about/')} className="px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 hover:border-emerald-500/40">
            About ItsMyBill
          </a>
        </div>
      </section>

      {/* Homepage-Specific FAQ */}
      <PageFAQ
        heading="Frequently Asked Questions About ItsMyBill"
        subtitle="Privacy guarantees, primary data sources, and how our client-side consumer utilities work."
        items={HOME_FAQS}
      />
    </div>
  );
};
