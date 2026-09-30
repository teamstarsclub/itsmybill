import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react';

export interface FaqItem {
  id: string;
  q: string;
  a: string;
  statute?: string;
  tags?: string[];
}

export const FAQS: FaqItem[] = [
  {
    id: 'faq-split',
    q: "How does the ItsMyBill income-fair proportional split work?",
    a: "Instead of dividing shared expenses 50/50 when roommates or partners earn unequal incomes (e.g., $110,000 vs. $45,000), ItsMyBill calculates each person's exact percentage of household income and allocates rent, electricity, and internet accordingly using the formula: Individual Share = Total Shared Expenses × (Individual Income ÷ Total Household Income). This equitable distribution eliminates financial stress and resentment.",
    tags: ["Roommates", "Fair Split", "Equity Formula"]
  },
  {
    id: 'faq-medical',
    q: "Can I dispute surprise emergency hospital bills under the federal No Surprises Act?",
    a: "Yes. Under federal law (42 U.S.C. § 300gg-111, effective January 1, 2022), patients are legally protected from surprise balance billing for out-of-network emergency services, air ambulance transport, and certain non-emergency services provided by out-of-network clinicians at in-network hospitals. ItsMyBill automatically generates statutory dispute notices invoking this federal protection and requiring providers to pause collections and provide an itemized ledger audit.",
    statute: "42 U.S.C. § 300gg-111 & 45 C.F.R. § 149.410",
    tags: ["Healthcare", "No Surprises Act", "Dispute Rights"]
  },
  {
    id: 'faq-auditor',
    q: "How does the AI Line-Item Auditor detect hidden junk fees?",
    a: "Our AI auditor cross-references your line items against regulatory tariff databases, federal disclosure rules, and industry benchmarks. It flags phantom surcharges (such as Broadcast TV Surcharges, Regulatory Cost Recovery Fees, and Emergency Dept Facility Code 0450), estimates potential refunds, and provides a word-for-word retention script to read to customer service representatives.",
    tags: ["AI Fee Auditor", "Hidden Surcharges", "Retention Scripts"]
  },
  {
    id: 'faq-telecom',
    q: "How do cable, broadband, and wireless companies get away with hidden surcharges?",
    a: "Providers frequently advertise attractive teaser promotional tariffs (e.g., $49.99/month) while burying non-governmental fees like Broadcast TV Surcharges ($20–$28/mo), Regional Sports Fees ($12–$16/mo), and modem rental fees ($15/mo) in fine print. When the promotional term expires, rates often escalate by 40% to 70%. Our auditor identifies these ancillary line items so you can negotiate them down or eliminate unreturned equipment fees.",
    tags: ["Comcast / Spectrum", "Broadband", "Telecom Fees"]
  },
  {
    id: 'faq-laws',
    q: "What federal consumer protection laws govern billing disputes?",
    a: "Consumers are protected under multiple federal statutes: (1) The Fair Credit Billing Act (15 U.S.C. § 1666), giving consumers 60 days to dispute billing errors in writing; (2) The Fair Debt Collection Practices Act (15 U.S.C. § 1692g), requiring debt collectors to validate disputed debts within 30 days and cease collection until verified; (3) FCC Truth-in-Billing regulations (47 C.F.R. § 64.2401), requiring clear descriptions of billed charges; and (4) The Television Viewer Protection Act (47 U.S.C. § 562), mandating upfront price transparency.",
    statute: "15 U.S.C. § 1666, 15 U.S.C. § 1692g, 47 C.F.R. § 64.2401",
    tags: ["Consumer Law", "Statutory Protections", "FCBA"]
  },
  {
    id: 'faq-collections',
    q: "What should I do if a provider or collection agency refuses to honor a dispute?",
    a: "Under 15 U.S.C. § 1692g and CFPB Regulation F (12 C.F.R. Part 1006), sending a formal written dispute triggers mandatory statutory verification. Once received via certified mail, the creditor or collection agency cannot report delinquent trade lines to credit bureaus (Equifax, Experian, TransUnion) without marking the account as 'Disputed by Consumer.' If they fail to comply, you can file a formal complaint with the Consumer Financial Protection Bureau (CFPB) or your state Attorney General.",
    statute: "CFPB Regulation F, 12 C.F.R. Part 1006",
    tags: ["Collections", "Credit Protection", "CFPB"]
  },
  {
    id: 'faq-privacy',
    q: "Is ItsMyBill completely free and is my financial data private?",
    a: "ItsMyBill is 100% free with no account creation, passwords, credit cards, or bank credentials required. Basic calculations (equal splits, income equity math, itemized tab splits, and savings tracking) run client-side in your browser for total privacy. Document and fee audits are processed securely via encrypted AI endpoints without storing personal banking data.",
    tags: ["Privacy", "Zero Account", "Client-Side Processing"]
  }
];

export const FaqSection: React.FC = () => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-split': true,
    'faq-medical': true
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allOpen = FAQS.reduce((acc, item) => ({ ...acc, [item.id]: true }), {});
    setOpenItems(allOpen);
  };

  const collapseAll = () => {
    setOpenItems({});
  };

  return (
    <section 
      id="faq" 
      aria-label="Frequently Asked Questions and Consumer Defense Rights"
      className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Frequently Asked Questions & Consumer Defense Rights
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Authoritative statutory guides, mathematical formulas, and rights under federal consumer protection laws.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={expandAll}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Semantic and Crawlable Accordion List */}
      <div className="divide-y divide-slate-800">
        {FAQS.map((item) => {
          const isOpen = !!openItems[item.id];
          return (
            <article 
              key={item.id} 
              className="py-4"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${item.id}`}
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-center justify-between text-left gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg py-1 cursor-pointer group"
              >
                <span 
                  itemProp="name"
                  className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors"
                >
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>

              {/* Crawlable Container: Always in DOM for SEO bots, height animated */}
              <div
                id={`faq-answer-${item.id}`}
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
                className={`pt-2.5 space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed pr-4 transition-all duration-200 ${
                  isOpen ? 'block opacity-100' : 'hidden opacity-0'
                }`}
              >
                <div itemProp="text">
                  {item.a}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                  {item.statute && (
                    <div className="inline-flex items-center gap-1 text-emerald-400/90 font-mono">
                      <Scale className="w-3 h-3 text-emerald-400" />
                      <span>Statutory Authority: {item.statute}</span>
                    </div>
                  )}
                  {item.tags && item.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
