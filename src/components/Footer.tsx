import React, { useState } from 'react';
import { Receipt, ShieldCheck, X, Scale, Lock } from 'lucide-react';
import { ENTITY_CONFIG } from '../data/trustData';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

  const linkProps = (path: string) => ({
    href: path,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      onNavigate(path);
    },
  });

  return (
    <>
      <footer className="border-t border-slate-800 bg-slate-950 pt-12 pb-16 text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Col 1: Brand & Entity Transparency */}
            <div className="space-y-3 md:col-span-4">
              <a {...linkProps('/')} className="flex items-center gap-2 w-fit">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-slate-950 font-bold" />
                </div>
                <span className="text-lg font-black text-white">
                  itsmy<span className="text-emerald-400">bill</span>.com
                </span>
              </a>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                {ENTITY_CONFIG.legalName} — Free, 100% client-side consumer bill defense platform for auditing hidden fees, comparing 50-state EIA utility benchmarks, splitting shared expenses, and drafting statutory dispute letters.
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  100% Client-Side Privacy
                </span>
                <span>·</span>
                <span>Zero Server Uploads</span>
                <span>·</span>
                <a href={`mailto:${ENTITY_CONFIG.contactEmail}`} className="text-slate-300 hover:text-emerald-400 underline underline-offset-2">
                  {ENTITY_CONFIG.contactEmail}
                </a>
              </div>
            </div>

            {/* Col 2: Consumer Tools */}
            <div className="space-y-2 md:col-span-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Consumer Utilities</h3>
              <ul className="space-y-1.5">
                <li>
                  <a {...linkProps('/bill-auditor/')} className="hover:text-emerald-400 transition-colors">
                    Line-Item Bill Fee Auditor
                  </a>
                </li>
                <li>
                  <a {...linkProps('/dispute-letter-generator/')} className="hover:text-emerald-400 transition-colors">
                    Statutory Dispute Letter Builder
                  </a>
                </li>
                <li>
                  <a {...linkProps('/utility-benchmarks/')} className="hover:text-emerald-400 transition-colors">
                    50-State Utility Benchmarks
                  </a>
                </li>
                <li>
                  <a {...linkProps('/income-based-bill-splitter/')} className="hover:text-emerald-400 transition-colors">
                    Income-Based Bill Splitter
                  </a>
                </li>
                <li>
                  <a {...linkProps('/bill-splitter/')} className="hover:text-emerald-400 transition-colors">
                    Equal Dinner &amp; Tip Splitter
                  </a>
                </li>
                <li>
                  <a {...linkProps('/itemized-receipt-splitter/')} className="hover:text-emerald-400 transition-colors">
                    Itemized Receipt Splitter
                  </a>
                </li>
                <li>
                  <a {...linkProps('/savings-tracker/')} className="hover:text-emerald-400 transition-colors">
                    Realized Savings Tracker
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Research & Playbooks */}
            <div className="space-y-2 md:col-span-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Research &amp; Templates</h3>
              <ul className="space-y-1.5">
                <li>
                  <a {...linkProps('/reports/2026-us-utility-and-junk-fee-report/')} className="hover:text-emerald-400 font-semibold text-amber-300 transition-colors">
                    2026 U.S. Utility &amp; Junk-Fee Report
                  </a>
                </li>
                <li>
                  <a {...linkProps('/guides/')} className="hover:text-emerald-400 transition-colors">
                    Consumer Topic Hubs
                  </a>
                </li>
                <li>
                  <a {...linkProps('/blog/')} className="hover:text-emerald-400 transition-colors">
                    Bills &amp; Finance Blog
                  </a>
                </li>
                <li>
                  <a {...linkProps('/dispute-letter/no-surprises-act-er-bill/')} className="hover:text-emerald-400 transition-colors">
                    No Surprises Act ER Letter
                  </a>
                </li>
                <li>
                  <a {...linkProps('/dispute-letter/security-deposit-itemization-demand/')} className="hover:text-emerald-400 transition-colors">
                    50-State Security Deposit Letters
                  </a>
                </li>
                <li>
                  <a href="/sitemap.xml" className="hover:text-emerald-400 text-slate-500 transition-colors">
                    XML Sitemap Index
                  </a>
                  {' · '}
                  <a href="/rss.xml" className="hover:text-emerald-400 text-slate-500 transition-colors">
                    RSS Feed
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Trust & Governance */}
            <div className="space-y-2 md:col-span-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Trust &amp; Governance</h3>
              <ul className="space-y-1.5">
                <li>
                  <a {...linkProps('/about/')} className="hover:text-emerald-400 transition-colors">
                    About ItsMyBill
                  </a>
                </li>
                <li>
                  <a {...linkProps('/methodology/')} className="hover:text-emerald-400 transition-colors">
                    Data Sources &amp; Methodology
                  </a>
                </li>
                <li>
                  <a {...linkProps('/editorial-policy/')} className="hover:text-emerald-400 transition-colors">
                    Editorial &amp; Fact-Check Policy
                  </a>
                </li>
                <li>
                  <a {...linkProps('/authors/itsmybill-editorial-team/')} className="hover:text-emerald-400 transition-colors">
                    Editorial Team
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('privacy')}
                    className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                  >
                    Privacy Notice
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('terms')}
                    className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                  >
                    Legal Disclaimer
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} {ENTITY_CONFIG.legalName} ({ENTITY_CONFIG.domain}). All tools run locally in your browser.
            </div>
            <div>
              Informational consumer utility — not legal, tax, or individualized financial advice.
            </div>
          </div>
        </div>
      </footer>

      {activeModal === 'privacy' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
        >
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <Lock className="w-5 h-5" />
                <span>Zero-Upload Client-Side Privacy Notice</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                aria-label="Close privacy modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p><strong>Last Verified: November 2026</strong></p>
              <p>
                Every interactive utility on ItsMyBill—including the Bill Fee Auditor, Statutory Dispute Letter Generator, Income-Based Bill Splitter, 50-State Utility Benchmarks, and Savings Tracker—executes 100% locally inside your web browser.
              </p>
              <p>
                Zero pasted bill statements, names, account numbers, salaries, or financial figures are ever transmitted to ItsMyBill servers or third-party AI APIs. Savings Tracker entries persist solely in your device&rsquo;s local browser storage.
              </p>
              <p>
                We never request bank credentials, Plaid access, credit card numbers, or account sign-ups. Questions may be emailed to {ENTITY_CONFIG.contactEmail}.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'terms' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
        >
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
                <Scale className="w-5 h-5" />
                <span>Self-Advocacy &amp; Educational Legal Disclaimer</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                aria-label="Close legal disclaimer modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                ItsMyBill provides mathematical calculators, primary-source utility benchmarks, and self-advocacy letter templates for educational use. ItsMyBill is not a law firm, does not provide individualized legal representation, and cannot guarantee billing reductions, refunds, or dispute outcomes.
              </p>
              <p>
                Always verify all account numbers, dates, statutory citations, and dollar amounts against your original statements before sending any written dispute. For high-dollar disputes, lawsuits, or complex consumer claims, consult a licensed attorney or legal aid organization in your state.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
