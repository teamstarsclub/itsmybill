import React from 'react';
import { SplitCalculator } from './SplitCalculator';
import { TrustByline } from './TrustByline';
import { PageFAQ, PageFaqItem } from './PageFAQ';
import { EmbedCalculatorButton } from './EmbedModal';

export type SplitterVariant = 'equal' | 'income' | 'itemized';

interface SplitterVariantConfig {
  mode: SplitterVariant;
  path: string;
  eyebrow: string;
  h1: string;
  seoTitle: string;
  metaDescription: string;
  directAnswer: string;
  formulaLabel: string;
  formulaExpression: string;
  workedExampleCaption: string;
  workedHeaders: string[];
  workedRows: string[][];
  faqs: PageFaqItem[];
}

export const SPLITTER_VARIANT_CONFIGS: Record<SplitterVariant, SplitterVariantConfig> = {
  equal: {
    mode: 'equal',
    path: '/bill-splitter/',
    eyebrow: 'Equal Group Tab & Restaurant Tip Calculator · 100% Client-Side',
    h1: 'Restaurant & Group Bill Splitter Calculator',
    seoTitle: 'Free Bill & Tip Splitter Calculator | ItsMyBill',
    metaDescription:
      'Split restaurant checks, group trips, sales tax, and custom pre-tax tips evenly in seconds. Free client-side calculator with whole-dollar rounding.',
    directAnswer:
      'To split a restaurant bill or group tab fairly, add local sales tax and pre-tax tip (typically 18%–20%) to the food subtotal, then divide the grand total by the number of diners. For example, a $148.50 pre-tax check with 8.5% tax ($12.62) and 18% pre-tax tip ($26.73) totals $187.85—or $46.96 per person across 4 diners.',
    formulaLabel: 'Equal Per-Person Tab & Pre-Tax Tip Formula',
    formulaExpression:
      'Per-Person Share = [Subtotal + (Subtotal × Tax%) + (Subtotal × Tip%)] ÷ Number of People',
    workedExampleCaption: 'Worked Example: 4-Person Group Dinner ($148.50 Subtotal, 8.5% Tax, 18% Tip)',
    workedHeaders: ['Line Item', 'Calculation', 'Dollar Amount'],
    workedRows: [
      ['Pre-Tax Food & Drink Subtotal', 'Base restaurant receipt subtotal', '$148.50'],
      ['Local Sales Tax (8.5%)', '$148.50 × 0.085', '$12.62'],
      ['Pre-Tax Gratuity (18%)', '$148.50 × 0.18', '$26.73'],
      ['Grand Total (4 Diners)', '$148.50 + $12.62 + $26.73', '$187.85'],
      ['Exact Equal Share (÷ 4)', '$187.85 ÷ 4', '$46.96 / person'],
    ],
    faqs: [
      {
        question: 'Should restaurant tip be calculated before or after sales tax?',
        answer:
          'Standard U.S. etiquette calculates tip percentage (15%, 18%, 20%, or 25%) on the pre-tax food and beverage subtotal, not on state and local sales tax.',
      },
      {
        question: 'How do I avoid double-tipping on large party auto-gratuity bills?',
        answer:
          'Check the bottom of your receipt for an automatic 18%–20% Service Charge or Large Party Gratuity (common for tables of 6+). If already included, set the tip slider to 0% unless you wish to leave an extra voluntary amount.',
      },
      {
        question: 'When should I use an itemized split instead of an equal split?',
        answer:
          'Use an equal split when everyone ordered similarly priced entrees and drinks. When one guest orders cocktails and steak while another orders salad and water, switch to our Itemized Receipt Splitter.',
      },
    ],
  },
  income: {
    mode: 'income',
    path: '/income-based-bill-splitter/',
    eyebrow: 'Proportional Household Equity Calculator · Couples & Roommates',
    h1: 'Income-Based Proportional Bill Splitter for Couples & Roommates',
    seoTitle: 'Income-Based Bill Splitter for Couples & Roommates | ItsMyBill',
    metaDescription:
      'Split rent, electricity, internet, and shared household bills proportionally by take-home pay with cent-exact reconciliation. Zero sign-ups.',
    directAnswer:
      'An income-based bill split divides shared rent and utilities according to each household member’s share of combined take-home pay rather than 50/50. If Partner A nets $6,500/month and Partner B nets $3,500/month ($10,000 combined), Partner A pays 65% and Partner B pays 35% of shared bills—keeping housing costs at the exact same percentage of each person’s paycheck.',
    formulaLabel: 'Proportional Income-Fair Contribution Formula',
    formulaExpression:
      'Individual Share = Total Shared Expenses × (Individual Monthly Net Income ÷ Combined Household Net Income)',
    workedExampleCaption: 'Worked Example: 3-Roommate Shared Monthly Rent & Utilities ($3,200 Total)',
    workedHeaders: ['Household Member', 'Monthly Net Income', 'Income Ratio', 'Equal 3-Way Split', 'Income-Fair Share'],
    workedRows: [
      ['Alex', '$6,500', '48.1%', '$1,066.67 (16.4% of pay)', '$1,540.74 (23.7% of pay)'],
      ['Jordan', '$4,200', '31.1%', '$1,066.67 (25.4% of pay)', '$995.56 (23.7% of pay)'],
      ['Taylor', '$2,800', '20.7%', '$1,066.67 (38.1% of pay)', '$663.70 (23.7% of pay)'],
      ['Household Total', '$13,500', '100.0%', '$3,200.00', '$3,200.00 (Exact)'],
    ],
    faqs: [
      {
        question: 'Should couples split bills by gross salary or net take-home pay?',
        answer:
          'Monthly net (after-tax) take-home pay reflects real spendable cash flow. If one partner contributes heavily to a pre-tax 401(k) or HSA while the other does not, add those voluntary savings back in to keep the comparison fair.',
      },
      {
        question: 'How does the calculator handle penny rounding differences?',
        answer:
          'ItsMyBill computes every contribution in integer cents and automatically reconciles any ±$0.01 rounding remainder onto the highest earner so all shares always sum to the exact invoice total.',
      },
      {
        question: 'Are my household income numbers stored anywhere?',
        answer:
          'No. Every calculation executes 100% client-side in your browser memory—no salary data or personal names ever touch a server.',
      },
    ],
  },
  itemized: {
    mode: 'itemized',
    path: '/itemized-receipt-splitter/',
    eyebrow: 'Dish-by-Dish Receipt & Proportional Tax/Tip Allocator',
    h1: 'Itemized Receipt Tax & Tip Splitter Calculator',
    seoTitle: 'Itemized Receipt Splitter (Proportional Tax & Tip) | ItsMyBill',
    metaDescription:
      'Assign dishes, drinks, and shared appetizers to each diner and distribute sales tax and tip proportionally by food subtotal. 100% free.',
    directAnswer:
      'An itemized receipt split assigns every entree, drink, and shared appetizer fraction to the specific diners who ordered them, then multiplies each person’s food subtotal by the table’s exact tax-and-tip multiplier: (Food Subtotal + Tax + Tip) ÷ Food Subtotal. Nobody subsidizes another guest’s cocktails or steak.',
    formulaLabel: 'Proportional Tax & Tip Multiplier Formula',
    formulaExpression:
      'Diner Final Total = Diner Food Subtotal × [(Receipt Subtotal + Total Tax + Total Tip) ÷ Receipt Subtotal]',
    workedExampleCaption: 'Worked Example: 3-Diner Receipt (8.875% Tax + 20% Tip = 1.28875× Multiplier)',
    workedHeaders: ['Diner', 'Assigned Items & Shared Fractions', 'Food Subtotal', 'Tax + Tip (28.875%)', 'Final Total'],
    workedRows: [
      ['Sarah', 'Pasta ($28) + 1/3 App ($8) + 1/2 Wine ($27.50)', '$63.50', '$18.34', '$81.84'],
      ['David', 'Ribeye ($46) + 1/3 App ($8) + 1/2 Wine ($27.50)', '$81.50', '$23.53', '$105.03'],
      ['Maya', 'Salmon ($34) + 1/3 App ($8)', '$42.00', '$12.13', '$54.13'],
      ['Receipt Total', 'All 5 Line Items Assigned', '$187.00', '$54.00', '$241.00'],
    ],
    faqs: [
      {
        question: 'Why should sales tax and tip be split proportionally instead of evenly?',
        answer:
          'Sales tax and gratuity are percentage-based charges on what was ordered. Splitting them evenly forces a guest who ordered a $20 meal to pay the same tax and tip as someone who ordered $90 in steaks and cocktails.',
      },
      {
        question: 'How do I split shared appetizers or bottles of wine?',
        answer:
          'Click the diner buttons beneath any shared item to toggle exactly who shared it. The calculator divides that item strictly among selected guests before applying the tax-and-tip multiplier.',
      },
      {
        question: 'Can I copy a clean breakdown to paste into a group text or Venmo request?',
        answer:
          'Yes. Click "Copy Text Breakdown for Group Chat" to copy every diner’s food subtotal and final tax-and-tip-inclusive amount in one click.',
      },
    ],
  },
};

interface SplitterLandingPageProps {
  variant: SplitterVariant;
  onNavigate: (path: string) => void;
}

export const SplitterLandingPage: React.FC<SplitterLandingPageProps> = ({ variant, onNavigate }) => {
  const cfg = SPLITTER_VARIANT_CONFIGS[variant];

  const siblingLinks = (Object.values(SPLITTER_VARIANT_CONFIGS) as SplitterVariantConfig[]).filter(
    (c) => c.mode !== variant
  );

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex items-center gap-2">
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
        <span className="text-slate-200">{cfg.h1}</span>
      </nav>

      {/* Header + GEO Answer Block */}
      <header className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">{cfg.eyebrow}</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {cfg.h1}
            </h1>
          </div>
          {variant === 'income' && (
            <EmbedCalculatorButton
              title="ItsMyBill Income-Based Bill Splitter"
              embedPath="/embed/income-bill-splitter/"
              sourcePath="/income-based-bill-splitter/"
              sourceLabel="Income-Based Bill Splitter"
            />
          )}
        </div>

        <TrustByline onNavigate={onNavigate} />

        <p data-speakable="true" className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-4xl">
          {cfg.directAnswer}
        </p>

        {/* Cross-Navigation Between the 3 Distinct Splitter Intents */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-400 font-semibold">Switch splitting method:</span>
          {siblingLinks.map((sib) => (
            <a
              key={sib.path}
              href={sib.path}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(sib.path);
              }}
              className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4"
            >
              {sib.h1}
            </a>
          ))}
        </div>
      </header>

      {/* Interactive Calculator (Locked to this dedicated landing page intent) */}
      <SplitCalculator defaultMode={cfg.mode} lockedMode hideHero />

      {/* Formula & Worked Dollar Example Table (Crawlable HTML + GEO Reference) */}
      <section className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-5">
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-white">{cfg.formulaLabel}</h2>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-emerald-300">
            {cfg.formulaExpression}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
            <caption className="text-left text-sm font-bold text-slate-200 mb-3">
              {cfg.workedExampleCaption}
            </caption>
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                {cfg.workedHeaders.map((h) => (
                  <th key={h} className="py-2.5 pr-4 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-200">
              {cfg.workedRows.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx === cfg.workedRows.length - 1 ? 'font-bold text-emerald-300' : ''}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="py-2.5 pr-4">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <PageFAQ
        heading={`${cfg.h1} — Frequently Asked Questions`}
        items={cfg.faqs}
      />
    </div>
  );
};
