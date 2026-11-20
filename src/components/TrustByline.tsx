import React from 'react';
import { ShieldCheck, Scale, ExternalLink } from 'lucide-react';
import { AUTHORS, ENTITY_CONFIG, PrimarySource } from '../data/trustData';

interface TrustBylineProps {
  authorSlug?: string;
  reviewerSlug?: string;
  lastVerified?: string;
  sources?: PrimarySource[];
  showLegalDisclaimer?: boolean;
  onNavigate: (path: string) => void;
}

export const TrustByline: React.FC<TrustBylineProps> = ({
  authorSlug = 'itsmybill-editorial-team',
  reviewerSlug = 'consumer-rights-review-desk',
  lastVerified = ENTITY_CONFIG.lastVerified,
  sources = [],
  showLegalDisclaimer = false,
  onNavigate,
}) => {
  const author = AUTHORS[authorSlug] || AUTHORS['itsmybill-editorial-team'];
  const reviewer = AUTHORS[reviewerSlug] || AUTHORS['consumer-rights-review-desk'];

  return (
    <div className="space-y-3 no-print">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-3 px-4 rounded-xl border border-slate-800/90 bg-slate-900/50 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>100% Client-Side Privacy</span>
        </span>
        <span aria-hidden="true">·</span>
        <span>
          Author:{' '}
          <a
            href={`/authors/${author.slug}/`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/authors/${author.slug}/`);
            }}
            className="text-slate-200 hover:text-emerald-400 underline underline-offset-2 transition-colors"
          >
            {author.name}
          </a>
        </span>
        <span aria-hidden="true">·</span>
        <span>
          Review:{' '}
          <a
            href={`/authors/${reviewer.slug}/`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/authors/${reviewer.slug}/`);
            }}
            className="text-slate-300 hover:text-emerald-400 underline underline-offset-2 transition-colors"
          >
            {reviewer.credentials}
          </a>
        </span>
        <span aria-hidden="true">·</span>
        <time dateTime={lastVerified} className="text-slate-300 tabular-nums">
          Verified {lastVerified}
        </time>
        <span aria-hidden="true">·</span>
        <a
          href="/methodology/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/methodology/');
          }}
          className="text-slate-300 hover:text-emerald-400 underline underline-offset-2 transition-colors"
        >
          Methodology
        </a>
        {sources.length > 0 && (
          <>
            <span aria-hidden="true">·</span>
            <span className="inline-flex flex-wrap items-center gap-2">
              <span>Sources:</span>
              {sources.slice(0, 2).map((src, idx) => (
                <a
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-slate-300 hover:text-emerald-400 underline underline-offset-2 transition-colors"
                >
                  <span>{src.agency}</span>
                  <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
                </a>
              ))}
            </span>
          </>
        )}
      </div>

      {showLegalDisclaimer && (
        <div
          role="note"
          className="flex items-start gap-2.5 p-3.5 rounded-xl border border-slate-800 bg-slate-950/90 text-xs text-slate-400 leading-relaxed"
        >
          <Scale className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            <strong className="text-slate-200 font-semibold">Educational Consumer Notice:</strong>{' '}
            Templates, statutory summaries, and fee checklists on ItsMyBill provide general
            educational consumer-rights information—not formal legal representation or financial
            advice. Verify all account numbers, dates, and state rules before mailing formal
            disputes, and consult a licensed attorney for contested legal proceedings.
          </p>
        </div>
      )}
    </div>
  );
};
