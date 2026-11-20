import React from 'react';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import { EDITORIAL_HUBS, EditorialHub, EditorialSpoke } from '../data/pseoData';
import { TrustByline } from './TrustByline';
import { PageFAQ } from './PageFAQ';

interface GuidesHubSectionProps {
  clusterSlug?: string | null;
  spokeSlug?: string | null;
  onNavigate: (path: string) => void;
}

export const GuidesHubSection: React.FC<GuidesHubSectionProps> = ({
  clusterSlug,
  spokeSlug,
  onNavigate,
}) => {
  const linkProps = (path: string) => ({
    href: path,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      onNavigate(path);
    },
  });

  // 1. Spoke Article View (/guides/[cluster]/[slug]/)
  if (clusterSlug && spokeSlug) {
    const hub = EDITORIAL_HUBS.find((h) => h.clusterSlug === clusterSlug);
    const spoke = hub?.spokes.find((s) => s.slug === spokeSlug);

    if (hub && spoke) {
      const siblingSpokes = hub.spokes.filter((s) => s.slug !== spoke.slug);

      return (
        <article className="space-y-8 max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
            <a {...linkProps('/')} className="hover:text-emerald-400">
              Home
            </a>
            <span>/</span>
            <a {...linkProps('/guides/')} className="hover:text-emerald-400">
              Consumer Guides
            </a>
            <span>/</span>
            <a {...linkProps(`/guides/${hub.clusterSlug}/`)} className="hover:text-emerald-400">
              {hub.title}
            </a>
            <span>/</span>
            <span className="text-slate-200">{spoke.title}</span>
          </nav>

          <header className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-400 font-semibold">
              <span>{hub.title}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 text-slate-300">
                <Clock className="w-3.5 h-3.5" />
                {spoke.readTimeMinutes} min read
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {spoke.title}
            </h1>

            <TrustByline onNavigate={onNavigate} lastVerified={spoke.lastVerified} />

            <p data-speakable="true" className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {spoke.directAnswer}
            </p>
          </header>

          {/* Key Actionable Playbook Steps */}
          <section className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h2 className="text-xl font-extrabold text-white">Key Action Steps &amp; Verification Rules</h2>
            <ol className="list-decimal list-inside space-y-3 text-sm text-slate-200 leading-relaxed">
              {spoke.keyPoints.map((kp, i) => (
                <li key={i}>{kp}</li>
              ))}
            </ol>
          </section>

          {/* Structured Comparison / Reference Table */}
          <section className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h2 className="text-xl font-extrabold text-white">{spoke.table.caption}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    {spoke.table.headers.map((h) => (
                      <th key={h} className="py-2.5 pr-4 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-slate-200">
                  {spoke.table.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className={`py-2.5 pr-4 ${cIdx === 0 ? 'font-bold text-white' : ''}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Contextual Companion Tool CTA */}
          <section className="bg-slate-900 rounded-2xl border border-emerald-500/30 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Apply This Playbook Locally
              </div>
              <p className="text-sm text-slate-200">
                Put these rules to work with our free, 100% client-side consumer utility tool.
              </p>
            </div>
            <a
              {...linkProps(spoke.relatedToolPath)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 transition-colors"
            >
              <span>{spoke.relatedToolLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </section>

          {/* Spoke-to-Pillar & Sibling Navigation */}
          <nav
            aria-label="Topic Cluster Navigation"
            className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-3"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Part of the{' '}
              <a {...linkProps(`/guides/${hub.clusterSlug}/`)} className="text-emerald-400 underline underline-offset-4">
                {hub.title}
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {siblingSpokes.map((sib: EditorialSpoke) => (
                <a
                  key={sib.slug}
                  {...linkProps(`/guides/${hub.clusterSlug}/${sib.slug}/`)}
                  className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 hover:text-emerald-300 transition-colors"
                >
                  {sib.title} →
                </a>
              ))}
            </div>
          </nav>

          <PageFAQ heading="Frequently Asked Questions" items={spoke.faqs} />
        </article>
      );
    }
  }

  // 2. Cluster Pillar Hub View (/guides/[cluster]/)
  if (clusterSlug) {
    const hub = EDITORIAL_HUBS.find((h) => h.clusterSlug === clusterSlug);
    if (hub) {
      const otherHubs = EDITORIAL_HUBS.filter((h) => h.clusterSlug !== hub.clusterSlug);

      return (
        <div className="space-y-8">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex items-center gap-2">
            <a {...linkProps('/')} className="hover:text-emerald-400">
              Home
            </a>
            <span>/</span>
            <a {...linkProps('/guides/')} className="hover:text-emerald-400">
              Consumer Guides
            </a>
            <span>/</span>
            <span className="text-slate-200">{hub.title}</span>
          </nav>

          <header className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Topic Pillar Hub · {hub.spokes.length} Verified Guides
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {hub.title}
            </h1>
            <TrustByline onNavigate={onNavigate} lastVerified={hub.lastVerified} />
            <p data-speakable="true" className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-4xl">
              {hub.directAnswer}
            </p>
            <div className="pt-2">
              <a
                {...linkProps(hub.companionToolPath)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
              >
                <span>{hub.companionToolLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </header>

          <section className="space-y-4">
            <h2 className="text-xl font-extrabold text-white">In-Depth Spoke Playbooks in This Hub</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {hub.spokes.map((spoke) => (
                <a
                  key={spoke.slug}
                  {...linkProps(`/guides/${hub.clusterSlug}/${spoke.slug}/`)}
                  className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-colors"
                >
                  <div className="space-y-2.5">
                    <div className="text-[11px] text-slate-400 font-semibold">
                      {spoke.readTimeMinutes} min read · Verified {spoke.lastVerified}
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {spoke.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{spoke.directAnswer}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </a>
              ))}
            </div>
          </section>

          <section className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-3">
            <h2 className="text-base font-bold text-white">Explore Other Consumer Finance Pillars</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {otherHubs.map((oh: EditorialHub) => (
                <a
                  key={oh.clusterSlug}
                  {...linkProps(`/guides/${oh.clusterSlug}/`)}
                  className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-sm font-bold text-slate-200 hover:text-emerald-300 transition-colors"
                >
                  {oh.title} →
                </a>
              ))}
            </div>
          </section>
        </div>
      );
    }
  }

  // 3. All Hubs Index (/guides/)
  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex items-center gap-2">
        <a {...linkProps('/')} className="hover:text-emerald-400">
          Home
        </a>
        <span>/</span>
        <span className="text-slate-200">Consumer Guides &amp; Topic Hubs</span>
      </nav>

      <header className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
          Hub-and-Spoke Consumer Research Library
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Consumer Bill Defense &amp; Household Finance Topic Hubs
        </h1>
        <TrustByline onNavigate={onNavigate} />
        <p data-speakable="true" className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
          Structured, statute-verified topic clusters covering hospital billing defense, cable/internet/wireless fee elimination, and fair shared household finance math.
        </p>
      </header>

      <div className="space-y-6">
        {EDITORIAL_HUBS.map((hub) => (
          <section key={hub.clusterSlug} className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <a
                  {...linkProps(`/guides/${hub.clusterSlug}/`)}
                  className="text-2xl font-extrabold text-white hover:text-emerald-400 transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{hub.title}</span>
                </a>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{hub.directAnswer}</p>
              </div>
              <a
                {...linkProps(hub.companionToolPath)}
                className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 text-xs font-bold shrink-0"
              >
                {hub.companionToolLabel} →
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
              {hub.spokes.map((spoke) => (
                <a
                  key={spoke.slug}
                  {...linkProps(`/guides/${hub.clusterSlug}/${spoke.slug}/`)}
                  className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 space-y-2 transition-colors"
                >
                  <div className="text-[11px] text-slate-400">{spoke.readTimeMinutes} min read</div>
                  <h3 className="text-sm font-bold text-white">{spoke.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{spoke.directAnswer}</p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
