import React from 'react';
import { Receipt, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 pt-12 pb-16 text-xs text-slate-400 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-2" itemScope itemType="https://schema.org/Organization">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Receipt className="w-4 h-4 text-slate-950 font-bold" />
              </div>
              <span itemProp="name" className="text-lg font-black text-white">
                itsmy<span className="text-emerald-400">bill</span>.com
              </span>
            </div>
            <meta itemProp="url" content="https://itsmybill.com/" />
            <meta itemProp="logo" content="https://itsmybill.com/favicon.svg" />
            <p itemProp="description" className="text-xs text-slate-400 max-w-md leading-relaxed">
              The web's premier free consumer bill defense and utility suite. Split restaurant tabs, balance roommate expenses by proportional income, audit telecom & hospital statements for hidden fees, track monthly realized savings, and generate statutory dispute letters under federal consumer protection laws.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1 text-emerald-400/90 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Free Consumer Utility</span>
              </div>
              <span>•</span>
              <span>No Bank Logins Required</span>
              <span>•</span>
              <span>Client-Side Privacy</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Utilities</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => setActiveTab('split')} className="hover:text-emerald-400 transition-colors">
                  Fair Bill & Tip Splitter
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('audit')} className="hover:text-emerald-400 transition-colors">
                  Line-Item Fee Auditor
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dispute')} className="hover:text-emerald-400 transition-colors">
                  Dispute Letter Generator
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('tracker')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>Savings Tracker</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">NEW</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('benchmark')} className="hover:text-emerald-400 transition-colors">
                  50-State Utility Benchmarks
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Statutory Frameworks</h4>
            <ul className="space-y-1.5">
              <li>
                <a href="#faq" className="hover:text-emerald-400 transition-colors">
                  Fair Credit Billing Act (15 U.S.C. 1666)
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-emerald-400 transition-colors">
                  No Surprises Act (42 U.S.C. 300gg-111)
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy & Terms
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Consumer Trust */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <span>Consumer Defense</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">100% FREE</span>
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> No Account or Sign-Up Needed
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Zero Bank Logins or Passwords
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Calculations Run Client-Side
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Open Consumer Protection
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} itsmybill.com. All rights reserved. Free consumer advocacy platform.
          </div>
          <div className="flex items-center gap-1">
            <span>Built for consumers everywhere</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
