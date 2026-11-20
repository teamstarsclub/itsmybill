import React, { useState } from 'react';
import { PhoneCall, Copy, Check, Scale, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ProviderAuditProfile, PROVIDER_AUDITS } from '../data/pseoData';
import { BillAuditor } from './BillAuditor';
import { TrustByline } from './TrustByline';
import { PageFAQ } from './PageFAQ';

interface ProviderAuditPageProps {
  profile: ProviderAuditProfile;
  onNavigate: (path: string) => void;
  onTransferToDispute: (provider: string, amount: string, reason: string) => void;
}

export const ProviderAuditPage: React.FC<ProviderAuditPageProps> = ({
  profile,
  onNavigate,
  onTransferToDispute,
}) => {
  const [copiedScript, setCopiedScript] = useState(false);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(profile.retentionScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const relatedProviders = PROVIDER_AUDITS.filter((p) => p.slug !== profile.slug).slice(0, 6);

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
          href="/bill-auditor/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/bill-auditor/');
          }}
          className="hover:text-emerald-400"
        >
          Bill Fee Auditor
        </a>
        <span>/</span>
        <span className="text-slate-200">{profile.providerName}</span>
      </nav>

      {/* Hero + Answer-First GEO Summary */}
      <header className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
          {profile.category} · Client-Side Statement Audit · Zero Server Uploads
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {profile.h1}
        </h1>
        <TrustByline onNavigate={onNavigate} />
        <p data-speakable="true" className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-4xl">
          {profile.directAnswer}
        </p>
      </header>

      {/* Crawlable HTML Junk-Fee Breakdown Table */}
      <section className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="text-xl font-extrabold text-white">
          Common {profile.providerName} Fees &amp; How to Challenge Them
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <caption className="sr-only">
              Line-item surcharges and challenge guidance for {profile.providerName}
            </caption>
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 pr-4 font-semibold">Fee / Line Item</th>
                <th className="py-2.5 pr-4 font-semibold">Typical Cost</th>
                <th className="py-2.5 pr-4 font-semibold">Negotiability</th>
                <th className="py-2.5 pr-4 font-semibold">Governing Rule / Statute</th>
                <th className="py-2.5 font-semibold">Actionable Remedy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-200">
              {profile.fees.map((fee) => (
                <tr key={fee.feeName}>
                  <td className="py-3 pr-4 font-bold text-white">{fee.feeName}</td>
                  <td className="py-3 pr-4 font-mono text-rose-300 tabular-nums whitespace-nowrap">
                    {fee.typicalCost}
                  </td>
                  <td className="py-3 pr-4 text-emerald-300 font-medium">{fee.negotiable}</td>
                  <td className="py-3 pr-4 text-xs font-mono text-slate-300">{fee.statuteOrRule}</td>
                  <td className="py-3 text-slate-300 leading-relaxed">{fee.howToChallenge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Pre-Configured Client-Side Bill Auditor */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-white">
          Run a Free {profile.providerName} Line-Item Audit Locally
        </h2>
        <BillAuditor
          initialProvider={profile.providerName}
          initialCategory={profile.category}
          initialAmount={profile.sampleAmount}
          initialBillText={profile.sampleBillText}
          hideHero
          autoRun
          onTransferToDispute={onTransferToDispute}
        />
      </section>

      {/* Copy-Paste Retention Script + Escalation Checklist */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-emerald-400" />
              <span>Copy-Paste Retention &amp; Billing Script</span>
            </h2>
            <button
              type="button"
              onClick={handleCopyScript}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
            >
              {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedScript ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <blockquote className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-mono text-slate-200 leading-relaxed">
            &ldquo;{profile.retentionScript}&rdquo;
          </blockquote>
          <a
            href={`/dispute-letter/${profile.disputeSlug}/`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/dispute-letter/${profile.disputeSlug}/`);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/40 text-indigo-300 font-bold text-xs transition-colors"
          >
            <Scale className="w-4 h-4" />
            <span>Open Matching Statutory Dispute Letter Template</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>4-Step Escalation Checklist</span>
          </h2>
          <ol className="space-y-3 text-xs sm:text-sm text-slate-300 list-decimal list-inside leading-relaxed">
            {profile.escalationChecklist.map((step, idx) => (
              <li key={idx} className="pl-1">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Related Provider Auditors */}
      <section className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-3">
        <h2 className="text-base font-bold text-white">Audit Other Major Carriers &amp; Hospital Charges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {relatedProviders.map((rel) => (
            <a
              key={rel.slug}
              href={`/bill-auditor/${rel.slug}/`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/bill-auditor/${rel.slug}/`);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-emerald-300 transition-colors"
            >
              {rel.providerName} ({rel.category}) →
            </a>
          ))}
        </div>
      </section>

      <PageFAQ heading={`${profile.providerName} Billing — Frequently Asked Questions`} items={profile.faqs} />
    </div>
  );
};
