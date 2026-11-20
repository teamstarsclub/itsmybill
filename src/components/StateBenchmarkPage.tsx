import React from 'react';
import { ExternalLink, Building2, Zap, Scale, MapPin } from 'lucide-react';
import {
  StateBenchmarkRecord,
  BENCHMARK_METADATA,
  buildStateGeoSummary,
  buildStateFaqs,
  getStateCombinedMonthly,
  getStateElectricRank,
  getStateTotalRank,
  getStateBySlug,
} from '../data/pseoData';
import { RateBenchmark } from './RateBenchmark';
import { TrustByline } from './TrustByline';
import { PageFAQ } from './PageFAQ';
import { EmbedCalculatorButton } from './EmbedModal';

interface StateBenchmarkPageProps {
  stateData: StateBenchmarkRecord;
  onNavigate: (path: string) => void;
}

export const StateBenchmarkPage: React.FC<StateBenchmarkPageProps> = ({ stateData, onNavigate }) => {
  const nat = BENCHMARK_METADATA.nationalBaseline;
  const combined = getStateCombinedMonthly(stateData);
  const electricRank = getStateElectricRank(stateData.slug);
  const totalRank = getStateTotalRank(stateData.slug);
  const geoSummary = buildStateGeoSummary(stateData);
  const faqs = buildStateFaqs(stateData);

  const neighborStates = stateData.neighbors
    .map((slug) => getStateBySlug(slug))
    .filter((s): s is StateBenchmarkRecord => Boolean(s));

  const formatDiff = (val: number, baseline: number, suffix = '/mo', prefix = '$') => {
    const diff = val - baseline;
    const sign = diff > 0 ? '+' : diff < 0 ? '-' : '';
    return `${sign}${prefix}${Math.abs(diff).toFixed(prefix === '' ? 1 : 0)}${suffix}`;
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
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
        <a
          href="/utility-benchmarks/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/utility-benchmarks/');
          }}
          className="hover:text-emerald-400"
        >
          50-State Utility Benchmarks
        </a>
        <span>/</span>
        <span className="text-slate-200">{stateData.state}</span>
      </nav>

      {/* Header + Answer-First GEO Summary */}
      <header className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 tabular-nums">
              {stateData.code} Utility Index · Rank #{electricRank} of 51 (Electricity ¢/kWh) · {stateData.marketType}
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Average Utility Bills in {stateData.state} (2026 Benchmarks)
            </h1>
          </div>
          <EmbedCalculatorButton
            title={`${stateData.state} Utility Benchmark Calculator`}
            embedPath={`/embed/state-utility-benchmark/?state=${stateData.code}`}
            sourcePath={`/utility-benchmarks/${stateData.slug}/`}
            sourceLabel={`${stateData.state} Utility Benchmarks`}
          />
        </div>

        <TrustByline onNavigate={onNavigate} />

        <p data-speakable="true" className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-4xl">
          {geoSummary}
        </p>

        {/* Key Stat Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 tabular-nums">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Electricity Rate</div>
            <div className="text-xl font-black text-amber-400 mt-0.5">{stateData.avgElectricityRateKwh}¢/kWh</div>
            <div className="text-[11px] text-slate-400">U.S. Avg: {nat.avgElectricityRateKwh}¢/kWh</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Combined Monthly</div>
            <div className="text-xl font-black text-white mt-0.5">${combined}/mo</div>
            <div className="text-[11px] text-slate-400">Rank #{totalRank} of 51 states</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Market Structure</div>
            <div className="text-sm font-bold text-emerald-400 mt-1">
              {stateData.deregulated ? 'Retail Choice Available' : 'Regulated Territory'}
            </div>
            <div className="text-[11px] text-slate-400 truncate">{stateData.marketType}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Annual Baseline</div>
            <div className="text-xl font-black text-white mt-0.5">${(combined * 12).toLocaleString()}/yr</div>
            <div className="text-[11px] text-slate-400">vs. ${(nat.avgCombinedMonthly * 12).toLocaleString()}/yr U.S.</div>
          </div>
        </div>
      </header>

      {/* Crawlable HTML 4-Utility Comparison Table (Above Interactive Tool for Instant GEO Extraction) */}
      <section className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="text-xl font-extrabold text-white">
          {stateData.state} vs. U.S. National Average Utility Costs
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
            <caption className="sr-only">
              Monthly residential utility benchmarks in {stateData.state} compared to the U.S. national average
            </caption>
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 pr-4 font-semibold">Utility Category</th>
                <th className="py-2.5 pr-4 font-semibold">{stateData.state} Benchmark</th>
                <th className="py-2.5 pr-4 font-semibold">U.S. National Avg</th>
                <th className="py-2.5 pr-4 font-semibold">Variance vs. U.S.</th>
                <th className="py-2.5 font-semibold">Primary Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-200">
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-white">Electricity Rate (¢/kWh)</td>
                <td className="py-2.5 pr-4 font-bold text-amber-400">{stateData.avgElectricityRateKwh}¢/kWh</td>
                <td className="py-2.5 pr-4">{nat.avgElectricityRateKwh}¢/kWh</td>
                <td className="py-2.5 pr-4">{formatDiff(stateData.avgElectricityRateKwh, nat.avgElectricityRateKwh, '¢', '')}</td>
                <td className="py-2.5 text-slate-400">U.S. EIA Table 5.6.A</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-white">Monthly Residential Electric</td>
                <td className="py-2.5 pr-4 font-bold">${stateData.avgMonthlyElectric}/mo</td>
                <td className="py-2.5 pr-4">${nat.avgMonthlyElectric}/mo</td>
                <td className="py-2.5 pr-4">{formatDiff(stateData.avgMonthlyElectric, nat.avgMonthlyElectric)}</td>
                <td className="py-2.5 text-slate-400">EIA Form EIA-861M</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-white">Monthly Natural Gas / Heating</td>
                <td className="py-2.5 pr-4 font-bold">${stateData.avgMonthlyGas}/mo</td>
                <td className="py-2.5 pr-4">${nat.avgMonthlyGas}/mo</td>
                <td className="py-2.5 pr-4">{formatDiff(stateData.avgMonthlyGas, nat.avgMonthlyGas)}</td>
                <td className="py-2.5 text-slate-400">EIA Natural Gas Monthly &amp; AGA</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-white">Monthly Water &amp; Sewer</td>
                <td className="py-2.5 pr-4 font-bold">${stateData.avgMonthlyWater}/mo</td>
                <td className="py-2.5 pr-4">${nat.avgMonthlyWater}/mo</td>
                <td className="py-2.5 pr-4">{formatDiff(stateData.avgMonthlyWater, nat.avgMonthlyWater)}</td>
                <td className="py-2.5 text-slate-400">AWWA / EPA Rate Survey</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-white">Monthly Broadband (100–300 Mbps)</td>
                <td className="py-2.5 pr-4 font-bold">${stateData.avgMonthlyInternet}/mo</td>
                <td className="py-2.5 pr-4">${nat.avgMonthlyInternet}/mo</td>
                <td className="py-2.5 pr-4">{formatDiff(stateData.avgMonthlyInternet, nat.avgMonthlyInternet)}</td>
                <td className="py-2.5 text-slate-400">FCC Urban Rate Survey</td>
              </tr>
              <tr className="font-bold text-emerald-300 bg-slate-950/60">
                <td className="py-3 pr-4">Combined 4-Utility Baseline</td>
                <td className="py-3 pr-4">${combined}/mo</td>
                <td className="py-3 pr-4">${nat.avgCombinedMonthly}/mo</td>
                <td className="py-3 pr-4">{formatDiff(combined, nat.avgCombinedMonthly)}</td>
                <td className="py-3 text-slate-400 font-normal">ItsMyBill Computed Sum</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Calculator Pre-Loaded to This State */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-white">
          Calculate Your {stateData.state} Utility Variance
        </h2>
        <RateBenchmark
          initialStateCode={stateData.code}
          hideHero
          onNavigateToAudit={() => onNavigate('/bill-auditor/')}
          onStateSlugSelect={(slug) => onNavigate(`/utility-benchmarks/${slug}/`)}
        />
      </section>

      {/* Unique State-Specific Utility Intelligence Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>Major {stateData.state} Utility &amp; Broadband Providers</span>
          </h2>
          <ul className="space-y-2 text-sm text-slate-300">
            {stateData.topProviders.map((prov) => (
              <li key={prov} className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">·</span>
                <span>{prov}</span>
              </li>
            ))}
          </ul>
          <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-white">Peak Seasonal &amp; Tariff Driver:</strong> {stateData.peakSeasonalDriver}
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Official {stateData.state} Utility Regulator &amp; Tenant Rights</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Unresolved meter-accuracy disputes, estimated billing spikes, or improper shutoff notices in {stateData.state} are regulated by the{' '}
            <strong className="text-white">{stateData.pucName}</strong>.
          </p>
          <a
            href={stateData.pucUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-bold text-xs transition-colors"
          >
            <span>File Official Complaint at {stateData.pucName}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-indigo-400" />
              <span>Renting in {stateData.state}? ({stateData.depositReturnDays}-Day Deposit Rule)</span>
            </div>
            <p className="text-xs text-slate-400">
              Under {stateData.depositStatute}, {stateData.state} landlords must return security deposits within{' '}
              {stateData.depositReturnDays} days.
            </p>
            <a
              href={`/dispute-letter/security-deposit-${stateData.slug}/`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/dispute-letter/security-deposit-${stateData.slug}/`);
              }}
              className="inline-block text-xs font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
            >
              Generate {stateData.state} Security Deposit Demand Letter →
            </a>
          </div>
        </div>
      </section>

      {/* Neighboring States Cross-Linking */}
      {neighborStates.length > 0 && (
        <section className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Compare Neighboring States</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {neighborStates.map((n) => (
              <a
                key={n.slug}
                href={`/utility-benchmarks/${n.slug}/`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/utility-benchmarks/${n.slug}/`);
                }}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                <div className="text-xs font-bold text-white">{n.state}</div>
                <div className="text-[11px] text-amber-400 tabular-nums mt-0.5">
                  {n.avgElectricityRateKwh}¢/kWh · ${getStateCombinedMonthly(n)}/mo
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Route-Specific State FAQ */}
      <PageFAQ
        heading={`${stateData.state} Utility Benchmarks — Frequently Asked Questions`}
        items={faqs}
      />
    </div>
  );
};
