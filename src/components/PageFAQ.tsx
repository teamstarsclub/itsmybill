import React, { useState } from 'react';
import { ChevronDown, Scale } from 'lucide-react';

export interface PageFaqItem {
  question: string;
  answer: string;
  statute?: string;
}

interface PageFAQProps {
  heading?: string;
  subtitle?: string;
  items: PageFaqItem[];
}

export const PageFAQ: React.FC<PageFAQProps> = ({
  heading = 'Frequently Asked Questions',
  subtitle = 'Route-specific answers grounded in verifiable formulas and primary consumer protection standards.',
  items,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items || items.length === 0) return null;

  return (
    <section
      id="page-faq"
      aria-labelledby="page-faq-heading"
      className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-5"
    >
      <div className="space-y-1 pb-4 border-b border-slate-800">
        <h2 id="page-faq-heading" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {heading}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">{subtitle}</p>
      </div>

      <div className="divide-y divide-slate-800">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-4 first:pt-1 last:pb-1">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between gap-4 text-left py-1 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
              >
                <span className="text-sm sm:text-base font-semibold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-emerald-400' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              <div
                className={`pt-2.5 space-y-2 text-sm text-slate-300 leading-relaxed pr-4 ${
                  isOpen ? 'block' : 'hidden'
                }`}
              >
                <p>{item.answer}</p>
                {item.statute && (
                  <p className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400/90 pt-1">
                    <Scale className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Reference: {item.statute}</span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
