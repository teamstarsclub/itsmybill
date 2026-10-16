import React, { useState } from 'react';
import { Receipt, ShieldCheck, Heart, X, Scale, FileText, Info, Lock } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'methodology' | null>(null);

  return (
    <>
      <footer className="border-t border-slate-800 bg-slate-950 pt-12 pb-16 text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand Info */}
            <div className="space-y-3 md:col-span-2" itemScope itemType="https://schema.org/Organization">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-slate-950 font-bold" />
                </div>
                <span itemProp="name" className="text-lg font-black text-white">
                  itsmy<span className="text-emerald-400">bill</span>.com
                </span>
              </div>
              <meta itemProp="url" content="https://www.itsmybill.com/" />
              <meta itemProp="logo" content="https://www.itsmybill.com/favicon-48x48.png" />
              <p itemProp="description" className="text-xs text-slate-400 max-w-md leading-relaxed">
                Free consumer utility platform for fair expense splitting, fee analysis, dispute letter drafting, and state utility cost comparisons. Built to give consumers clear calculations and self-advocacy tools with zero account requirements.
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-1 text-emerald-400/90 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Free Consumer Utility</span>
                </div>
                <span>•</span>
                <span>No Bank Logins Required</span>
                <span>•</span>
                <span>Client-Side Calculations</span>
              </div>
            </div>

            {/* Col 2: Core Utilities */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Tools &amp; Utilities</h4>
              <ul className="space-y-1.5">
                <li>
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('split');
                    }}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Fair Bill &amp; Tip Splitter
                  </a>
                </li>
                <li>
                  <a
                    href="/?tab=audit"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('audit');
                    }}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Line-Item Fee Checker
                  </a>
                </li>
                <li>
                  <a
                    href="/?tab=dispute"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('dispute');
                    }}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Dispute Letter Drafting Tool
                  </a>
                </li>
                <li>
                  <a
                    href="/?tab=tracker"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('tracker');
                    }}
                    className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Savings Tracker</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">Tool</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/?tab=benchmark"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('benchmark');
                    }}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    50-State Utility Benchmarks
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Disclosures & Methodologies */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Consumer Governance</h4>
              <ul className="space-y-1.5">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('privacy')}
                    className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                  >
                    Privacy Policy &amp; Security
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('terms')}
                    className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                  >
                    Terms of Use &amp; Legal Notice
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('methodology')}
                    className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                  >
                    Data Sources &amp; Methodology
                  </button>
                </li>
                <li>
                  <a
                    href="#faq"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 transition-colors text-left"
                  >
                    Frequently Asked Questions
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} itsmybill.com. All rights reserved. Free consumer utility platform.
            </div>
            <div className="flex items-center gap-1">
              <span>Dedicated to consumer transparency</span>
              <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            </div>
          </div>
        </div>
      </footer>

      {/* Modal: Privacy Policy */}
      {activeModal === 'privacy' && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
        >
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <Lock className="w-5 h-5" />
                <span>Privacy Policy &amp; Data Security Notice</span>
              </div>
              <button 
                onClick={() => setActiveModal(null)} 
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong>Last Updated: October 2026</strong>
              </p>
              <h5 className="font-bold text-white text-sm">1. Client-Side Processing</h5>
              <p>
                ItsMyBill is engineered to minimize personal data collection. Expense split calculations (equal splits, income-proportional roommate splits, and itemized receipt allocations) and savings tracking records run entirely client-side in your web browser. Local data is stored solely in your browser's private localStorage and is never uploaded to our servers.
              </p>
              <h5 className="font-bold text-white text-sm">2. AI-Assisted Document &amp; Fee Analysis</h5>
              <p>
                When you use the Bill Fee Checker or Dispute Letter Drafting Tool, the bill text and details you submit are transmitted over encrypted HTTPS to our server proxy to generate structured analysis via Google Gemini API. We do not store, catalog, log, or sell bill text, personal names, account numbers, or address data.
              </p>
              <h5 className="font-bold text-white text-sm">3. No Bank Logins or Credit Cards</h5>
              <p>
                ItsMyBill never requests online banking credentials, account passwords, Plaid integrations, credit card numbers, or Social Security numbers. All tools are 100% free to access without account registration.
              </p>
              <h5 className="font-bold text-white text-sm">4. Cookies &amp; Analytics</h5>
              <p>
                We use standard, non-invasive Google Analytics (gtag.js) for aggregate traffic measurement to understand which utility tools are most helpful. You may opt out at any time using standard browser privacy controls or content blockers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Terms of Use & Legal Disclaimer */}
      {activeModal === 'terms' && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
        >
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
                <Scale className="w-5 h-5" />
                <span>Terms of Use &amp; Self-Advocacy Disclaimer</span>
              </div>
              <button 
                onClick={() => setActiveModal(null)} 
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <h5 className="font-bold text-white text-sm">1. Self-Advocacy Educational Tools</h5>
              <p>
                ItsMyBill provides mathematical calculators, consumer education information, and draft letter templates intended for personal self-advocacy. ItsMyBill is not a law firm, does not employ attorneys to represent users, and does not provide formal legal advice, financial advisory services, or debt relief representation.
              </p>
              <h5 className="font-bold text-white text-sm">2. No Guarantee of Outcome or Refunds</h5>
              <p>
                Generated letters and analysis scripts are drafts provided for your review. Service providers, health systems, and creditors evaluate disputes based on individual contract agreements, insurance plan terms, and statutory evidence. ItsMyBill cannot and does not guarantee that a bill will be reduced, dismissed, or refunded.
              </p>
              <h5 className="font-bold text-white text-sm">3. User Responsibility for Accuracy</h5>
              <p>
                You are solely responsible for reviewing and verifying all factual assertions, account numbers, dates, and dollar amounts before sending any written dispute or communication to a creditor, medical provider, or collection agency.
              </p>
              <h5 className="font-bold text-white text-sm">4. Independent Legal Counsel</h5>
              <p>
                If you face formal legal action, credit impairment, or substantial contested debt, we strongly encourage consulting a licensed attorney, your state attorney general's consumer protection division, or a HUD-approved financial counselor.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Methodology & Sources */}
      {activeModal === 'methodology' && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
        >
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <Info className="w-5 h-5" />
                <span>Data Sources, Units &amp; Mathematical Formulas</span>
              </div>
              <button 
                onClick={() => setActiveModal(null)} 
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <h5 className="font-bold text-white text-sm">1. Mathematical Splitting Formulas</h5>
              <p>
                <strong>Income-Proportional Equity Split:</strong> Calculates each household member's burden as a direct proportion of total household income:
                <br />
                <code className="text-emerald-400 font-mono text-[11px]">Individual Share = Total Shared Expenses &times; (Individual Take-Home Income &divide; Total Household Take-Home Income)</code>
              </p>
              <p>
                <strong>Itemized Dish &amp; Tax/Tip Multiplier:</strong> Calculates personal food subtotals and applies a proportional multiplier so tax and tip are shared according to individual consumption rather than split evenly across unequal meals:
                <br />
                <code className="text-emerald-400 font-mono text-[11px]">Multiplier = (Food Subtotal + Total Tax + Total Tip) &divide; Food Subtotal</code>
              </p>
              <h5 className="font-bold text-white text-sm">2. Utility Benchmark Primary Sources</h5>
              <p>
                <strong>Electricity Rates:</strong> Sourced from the <em>U.S. Energy Information Administration (EIA)</em> Form EIA-861M (Electric Power Monthly, Table 5.6.A: Average Price of Electricity to Ultimate Customers by End-Use Sector). Monthly electric bill estimates assume average residential household consumption of 890 kWh/month.
              </p>
              <p>
                <strong>Broadband Tiers:</strong> Sourced from published surveys including the <em>Federal Communications Commission (FCC) Urban Rate Survey</em> for standalone 100–300 Mbps broadband tiers.
              </p>
              <p>
                <strong>Water &amp; Gas:</strong> Sourced from the <em>American Water Works Association (AWWA)</em> utility rate surveys and <em>American Gas Association (AGA)</em> residential heating averages.
              </p>
              <h5 className="font-bold text-white text-sm">3. Statutory Legal References</h5>
              <p>
                Our letter drafting templates cite official federal legislation:
                <br />
                • <strong>42 U.S.C. &sect; 300gg-111:</strong> The federal No Surprises Act protecting consumers from surprise out-of-network balance billing.
                <br />
                • <strong>15 U.S.C. &sect; 1666:</strong> The Fair Credit Billing Act governing billing statement error resolution.
                <br />
                • <strong>15 U.S.C. &sect; 1692g:</strong> The Fair Debt Collection Practices Act validation demand rights.
                <br />
                • <strong>47 C.F.R. &sect; 64.2401:</strong> FCC Truth-in-Billing requirements for clear telecommunications charges.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
