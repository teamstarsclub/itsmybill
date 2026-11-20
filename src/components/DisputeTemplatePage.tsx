import React, { useState } from 'react';
import { Clock, Copy, Check, ExternalLink, Mail, Scale, MapPin } from 'lucide-react';
import {
  DisputeTemplateProfile,
  CORE_DISPUTE_TEMPLATES,
  STATE_BENCHMARKS,
} from '../data/pseoData';
import { DisputeGenerator } from './DisputeGenerator';
import { TrustByline } from './TrustByline';
import { PageFAQ } from './PageFAQ';

interface DisputeTemplatePageProps {
  template: DisputeTemplateProfile;
  onNavigate: (path: string) => void;
}

export const DisputeTemplatePage: React.FC<DisputeTemplatePageProps> = ({ template, onNavigate }) => {
  const [copiedSample, setCopiedSample] = useState(false);

  const handleCopySample = () => {
    navigator.clipboard.writeText(template.sampleLetter);
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2000);
  };

  const isDepositHub = template.slug === 'security-deposit-itemization-demand';
  const siblingTemplates = CORE_DISPUTE_TEMPLATES.filter((t) => t.slug !== template.slug);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex flex-wrap items-center gap-2 no-print">
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
          href="/dispute-letter-generator/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/dispute-letter-generator/');
          }}
          className="hover:text-emerald-400"
        >
          Dispute Letter Templates
        </a>
        {template.stateSlug && (
          <>
            <span>/</span>
            <a
              href="/dispute-letter/security-deposit-itemization-demand/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/dispute-letter/security-deposit-itemization-demand/');
              }}
              className="hover:text-emerald-400"
            >
              Security Deposit Laws
            </a>
          </>
        )}
        <span>/</span>
        <span className="text-slate-200">{template.stateName || template.statuteCode}</span>
      </nav>

      {/* Header + GEO Answer Block + YMYL Legal Disclaimer */}
      <header className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-4 no-print">
        <p className="text-xs font-mono font-semibold text-indigo-400">{template.statuteCode}</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {template.h1}
        </h1>
        <TrustByline onNavigate={onNavigate} showLegalDisclaimer />
        <p data-speakable="true" className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-4xl">
          {template.directAnswer}
        </p>

        {/* Highlighted Statutory Deadline Callout */}
        <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 flex items-start gap-3">
          <Clock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            <strong className="text-indigo-300 uppercase tracking-wider text-xs block mb-0.5">
              Key Statutory Deadline &amp; Scope
            </strong>
            <span>{template.deadlineHighlight}</span>
          </div>
        </div>
      </header>

      {/* Plain-English Rights + Read-Only Crawlable Sample Letter */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start no-print">
        <div className="lg:col-span-5 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400" />
            <span>Plain-English Statutory Rights</span>
          </h2>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {template.plainEnglishRights.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold mt-0.5">·</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Certified Mail Filing Checklist</span>
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed">
              {template.certifiedMailChecklist.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <a
              href={template.govSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
            >
              <span>Official Primary Reference: {template.govSourceName}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Crawlable Read-Only Sample Template */}
        <div className="lg:col-span-7 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-white">Read-Only Sample Dispute Letter Template</h2>
            <button
              type="button"
              onClick={handleCopySample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
            >
              {copiedSample ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSample ? 'Sample Copied' : 'Copy Blank Template'}</span>
            </button>
          </div>
          <pre className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {template.sampleLetter}
          </pre>
        </div>
      </section>

      {/* Pre-Loaded Interactive Client-Side Letter Builder */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-white no-print">
          Customize &amp; Print Your Personalized Letter (100% Local)
        </h2>
        <DisputeGenerator
          initialBillType={template.stateSlug || isDepositHub ? 'Security Deposit' : template.billType}
          initialProvider={template.defaultProvider}
          initialAmount={template.defaultAmount}
          initialReason={template.defaultReason}
          initialCodes={template.defaultCodes}
          hideHero
          autoGenerate
        />
      </section>

      {/* 51-State Security Deposit Directory (Shown on Security Deposit Hub & State Deposit Pages) */}
      {(isDepositHub || template.stateSlug) && (
        <section className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4 no-print">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <span>State-Specific Security Deposit Demand Letters (All 50 States + D.C.)</span>
            </h2>
            {template.stateSlug && (
              <a
                href={`/utility-benchmarks/${template.stateSlug}/`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/utility-benchmarks/${template.stateSlug}/`);
                }}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4"
              >
                View {template.stateName} Utility Benchmarks →
              </a>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {STATE_BENCHMARKS.map((st) => {
              const targetPath = `/dispute-letter/security-deposit-${st.slug}/`;
              const isCurrent = template.stateSlug === st.slug;
              return (
                <a
                  key={st.slug}
                  href={targetPath}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(targetPath);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-colors ${
                    isCurrent
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200 font-bold'
                      : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="truncate">{st.state}</span>
                  <span className="text-[11px] font-mono text-indigo-400 tabular-nums ml-1 shrink-0">
                    {st.depositReturnDays}d
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Sibling Statutory Templates */}
      <section className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-3 no-print">
        <h2 className="text-base font-bold text-white">Other Federal &amp; Consumer Dispute Letter Templates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {siblingTemplates.map((sib) => (
            <a
              key={sib.slug}
              href={`/dispute-letter/${sib.slug}/`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/dispute-letter/${sib.slug}/`);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-indigo-300 transition-colors"
            >
              {sib.h1} →
            </a>
          ))}
        </div>
      </section>

      <div className="no-print">
        <PageFAQ heading={`${template.h1} — Frequently Asked Questions`} items={template.faqs} />
      </div>
    </div>
  );
};
