import React, { useState, useMemo } from 'react';
import { BarChart3, ArrowUpDown, Copy, Check } from 'lucide-react';
import {
  STATE_BENCHMARKS,
  PROVIDER_AUDITS,
  BENCHMARK_METADATA,
  getStateCombinedMonthly,
} from '../data/pseoData';
import { TrustByline } from './TrustByline';
import { PageFAQ } from './PageFAQ';

interface AnnualReportPageProps {
  onNavigate: (path: string) => void;
}

type SortKey =
  | 'state'
  | 'avgElectricityRateKwh'
  | 'avgMonthlyElectric'
  | 'avgMonthlyGas'
  | 'avgMonthlyWater'
  | 'avgMonthlyInternet'
  | 'combined';

export const AnnualReportPage: React.FC<AnnualReportPageProps> = ({ onNavigate }) => {
  const [sortKey, setSortKey] = useState<SortKey>('avgElectricityRateKwh');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [copiedCite, setCopiedCite] = useState(false);

  const nat = BENCHMARK_METADATA.nationalBaseline;

  const sortedStates = useMemo(() => {
    const list = STATE_BENCHMARKS.map((st) => ({
      ...st,
      combined: getStateCombinedMonthly(st),
    }));
    list.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === 'asc' ? Number(av) - Number(bv) : Number(bv) - Number(av);
    });
    return list;
  }, [sortKey, sortDir]);

  const top5Highest = useMemo(
    () => [...STATE_BENCHMARKS].sort((a, b) => b.avgElectricityRateKwh - a.avgElectricityRateKwh).slice(0, 5),
    []
  );
  const top5Lowest = useMemo(
    () => [...STATE_BENCHMARKS].sort((a, b) => a.avgElectricityRateKwh - b.avgElectricityRateKwh).slice(0, 5),
    []
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDir(key === 'state' ? 'asc' : 'desc');
    }
  };

  const citationText = `ItsMyBill.com (2026). "2026 U.S. Household Utility Cost & Junk-Fee Report: 51-Jurisdiction EIA, FCC & AWWA Index." Retrieved from https://www.itsmybill.com/reports/2026-us-utility-and-junk-fee-report/`;

  const copyCitation = () => {
    navigator.clipboard.writeText(citationText);
    setCopiedCite(true);
    setTimeout(() => setCopiedCite(false), 2000);
  };

  return (
    <article className="space-y-8">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex items-center gap-2">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="hover:text-emerald-400"
        >
          Home
        </a>
        <span>/</span>
        <span className="text-slate-200">2026 U.S. Utility &amp; Junk-Fee Report</span>
      </nav>

      <header className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
          Annual Consumer Research Study · 51 U.S. Jurisdictions · Open Dataset
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          2026 U.S. Household Utility Cost &amp; Consumer Junk-Fee Report
        </h1>
        <TrustByline onNavigate={onNavigate} />
        <p data-speakable="true" className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-4xl">
          Across all 50 states and Washington, D.C., U.S. residential electricity tariffs average {nat.avgElectricityRateKwh}¢/kWh (EIA Table 5.6.A), spanning nearly a 4× spread from {top5Lowest[0].state} ({top5Lowest[0].avgElectricityRateKwh}¢/kWh) to {top5Highest[0].state} ({top5Highest[0].avgElectricityRateKwh}¢/kWh). Combined baseline utilities average ${nat.avgCombinedMonthly}/month (${(nat.avgCombinedMonthly * 12).toLocaleString()}/year) before non-government cable, wireless, and hospital surcharges.
        </p>
      </header>

      {/* Highest vs Lowest Electricity Rate Callouts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-3">
          <h2 className="text-base font-bold text-rose-300">5 Highest Residential Electricity States (¢/kWh)</h2>
          <ol className="space-y-2 text-sm tabular-nums">
            {top5Highest.map((st, idx) => (
              <li key={st.slug} className="flex items-center justify-between py-1.5 border-b border-slate-800/70">
                <a
                  href={`/utility-benchmarks/${st.slug}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/utility-benchmarks/${st.slug}/`);
                  }}
                  className="text-white hover:text-emerald-400 font-semibold"
                >
                  {idx + 1}. {st.state}
                </a>
                <span className="font-mono font-bold text-rose-400">
                  {st.avgElectricityRateKwh}¢/kWh · ${getStateCombinedMonthly(st)}/mo total
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-3">
          <h2 className="text-base font-bold text-emerald-300">5 Lowest Residential Electricity States (¢/kWh)</h2>
          <ol className="space-y-2 text-sm tabular-nums">
            {top5Lowest.map((st, idx) => (
              <li key={st.slug} className="flex items-center justify-between py-1.5 border-b border-slate-800/70">
                <a
                  href={`/utility-benchmarks/${st.slug}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/utility-benchmarks/${st.slug}/`);
                  }}
                  className="text-white hover:text-emerald-400 font-semibold"
                >
                  {idx + 1}. {st.state}
                </a>
                <span className="font-mono font-bold text-emerald-400">
                  {st.avgElectricityRateKwh}¢/kWh · ${getStateCombinedMonthly(st)}/mo total
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Live Sortable 51-Jurisdiction HTML Table */}
      <section className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span>Complete 51-Jurisdiction Utility Benchmark Table (Sortable)</span>
          </h2>
          <span className="text-xs text-slate-400">Click any column header to sort</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
            <thead>
              <tr className="border-b border-slate-800 text-slate-300">
                {[
                  { key: 'state' as SortKey, label: 'State' },
                  { key: 'avgElectricityRateKwh' as SortKey, label: 'Electric (¢/kWh)' },
                  { key: 'avgMonthlyElectric' as SortKey, label: 'Electric/mo' },
                  { key: 'avgMonthlyGas' as SortKey, label: 'Gas/mo' },
                  { key: 'avgMonthlyWater' as SortKey, label: 'Water/mo' },
                  { key: 'avgMonthlyInternet' as SortKey, label: 'Internet/mo' },
                  { key: 'combined' as SortKey, label: 'Combined/mo' },
                ].map((col) => (
                  <th key={col.key} className="py-2.5 pr-3 font-semibold whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="inline-flex items-center gap-1 hover:text-emerald-400 cursor-pointer"
                    >
                      <span>{col.label}</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </button>
                  </th>
                ))}
                <th className="py-2.5 font-semibold whitespace-nowrap">Deposit Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-200">
              {sortedStates.map((st) => (
                <tr key={st.slug} className="hover:bg-slate-950/60">
                  <td className="py-2.5 pr-3 font-bold">
                    <a
                      href={`/utility-benchmarks/${st.slug}/`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(`/utility-benchmarks/${st.slug}/`);
                      }}
                      className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                    >
                      {st.state}
                    </a>
                  </td>
                  <td className="py-2.5 pr-3 font-mono text-amber-400">{st.avgElectricityRateKwh}¢</td>
                  <td className="py-2.5 pr-3">${st.avgMonthlyElectric}</td>
                  <td className="py-2.5 pr-3">${st.avgMonthlyGas}</td>
                  <td className="py-2.5 pr-3">${st.avgMonthlyWater}</td>
                  <td className="py-2.5 pr-3">${st.avgMonthlyInternet}</td>
                  <td className="py-2.5 pr-3 font-bold text-white">${st.combined}/mo</td>
                  <td className="py-2.5 text-xs text-indigo-300">
                    <a
                      href={`/dispute-letter/security-deposit-${st.slug}/`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(`/dispute-letter/security-deposit-${st.slug}/`);
                      }}
                      className="hover:underline"
                    >
                      {st.depositReturnDays} days
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Major Carrier & Hospital Junk-Fee Summary Table */}
      <section className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="text-xl font-extrabold text-white">
          2026 Recurring Carrier &amp; Hospital Junk-Fee Index
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 pr-4 font-semibold">Provider / Sector</th>
                <th className="py-2.5 pr-4 font-semibold">Top Flagged Charge</th>
                <th className="py-2.5 pr-4 font-semibold">Typical Cost</th>
                <th className="py-2.5 font-semibold">Primary Governing Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-200">
              {PROVIDER_AUDITS.map((prov) => (
                <tr key={prov.slug}>
                  <td className="py-2.5 pr-4 font-bold">
                    <a
                      href={`/bill-auditor/${prov.slug}/`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(`/bill-auditor/${prov.slug}/`);
                      }}
                      className="text-emerald-400 hover:underline"
                    >
                      {prov.providerName}
                    </a>
                  </td>
                  <td className="py-2.5 pr-4">{prov.fees[0]?.feeName}</td>
                  <td className="py-2.5 pr-4 font-mono text-rose-300 tabular-nums">{prov.fees[0]?.typicalCost}</td>
                  <td className="py-2.5 text-xs font-mono text-slate-400">{prov.fees[0]?.statuteOrRule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Press / Journalist Citation Box */}
      <section className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-white">Cite This 2026 Dataset (Journalists &amp; Researchers)</h2>
          <button
            type="button"
            onClick={copyCitation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
          >
            {copiedCite ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCite ? 'Citation Copied' : 'Copy Citation'}</span>
          </button>
        </div>
        <p className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
          {citationText}
        </p>
      </section>

      <PageFAQ
        heading="2026 Utility & Junk-Fee Report FAQs"
        items={[
          {
            question: 'Which state has the highest average residential electricity rate in 2026?',
            answer: `${top5Highest[0].state} leads the U.S. at ${top5Highest[0].avgElectricityRateKwh}¢/kWh, followed by ${top5Highest[1].state} (${top5Highest[1].avgElectricityRateKwh}¢/kWh) and ${top5Highest[2].state} (${top5Highest[2].avgElectricityRateKwh}¢/kWh) based on EIA Table 5.6.A residential benchmarks.`,
          },
          {
            question: 'Which state has the lowest average residential electricity rate in 2026?',
            answer: `${top5Lowest[0].state} maintains the lowest average residential electricity rate at ${top5Lowest[0].avgElectricityRateKwh}¢/kWh, followed by ${top5Lowest[1].state} (${top5Lowest[1].avgElectricityRateKwh}¢/kWh) and ${top5Lowest[2].state} (${top5Lowest[2].avgElectricityRateKwh}¢/kWh).`,
          },
          {
            question: 'Can journalists or bloggers embed the interactive state utility calculator?',
            answer:
              'Yes. Visit any state benchmark page or our main Utility Benchmarks page and click "Embed This Calculator" to grab a free, zero-tracking iframe snippet.',
          },
        ]}
      />
    </article>
  );
};
