import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  AlertTriangle,
  PhoneCall,
  Scale,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { SAMPLE_BILLS, SampleBillScenario } from '../data/mockData';

export interface AuditFlag {
  chargeName: string;
  amount: string;
  numericAmount: number;
  verdict: string;
  explanation: string;
  statuteOrRule?: string;
}

interface AuditData {
  auditScore: number;
  totalEstimatedOvercharge: string;
  flags: AuditFlag[];
  negotiationStrategy: string;
  phoneScript: string;
  disputeReady: boolean;
}

export interface BillAuditorProps {
  onTransferToDispute?: (provider: string, amount: string, reason: string) => void;
  initialProvider?: string;
  initialCategory?: string;
  initialAmount?: number;
  initialBillText?: string;
  hideHero?: boolean;
  autoRun?: boolean;
}

interface FeeRule {
  pattern: RegExp;
  label: string;
  verdict: string;
  explanation: string;
  statuteOrRule: string;
  severity: number;
}

const CLIENT_SIDE_FEE_RULES: FeeRule[] = [
  {
    pattern: /broadcast\s*tv/i,
    label: 'Broadcast TV Surcharge',
    verdict: 'Company Surcharge (Review Recommended)',
    explanation:
      'Discretionary provider surcharge added on top of base TV pricing to recover retransmission costs. Not a government tax—eliminable by dropping video or offset via Retention credits.',
    statuteOrRule: 'FCC Truth-in-Billing (47 C.F.R. § 64.2401)',
    severity: 14,
  },
  {
    pattern: /regional\s*sports|rsn\s*fee/i,
    label: 'Regional Sports Network (RSN) Fee',
    verdict: 'Company Surcharge (Review Recommended)',
    explanation:
      'Non-governmental carrier fee applied automatically to expanded video packages even if you never watch sports channels.',
    statuteOrRule: 'Television Viewer Protection Act (47 U.S.C. § 562)',
    severity: 12,
  },
  {
    pattern: /modem|gateway|xfi\s*gateway|panoramic\s*wifi|router\s*(rental|fee|lease)|wifi\s*router/i,
    label: 'Modem / Router Equipment Rental Fee',
    verdict: 'Avoidable Equipment Rental',
    explanation:
      'Recurring hardware rental fee ($84–$180/year). Federal law protects your right to supply your own compatible DOCSIS 3.1 modem or Wi-Fi 6 router.',
    statuteOrRule: 'Television Viewer Protection Act (47 U.S.C. § 562)',
    severity: 15,
  },
  {
    pattern: /regulatory|cost\s*recovery|telco\s*recovery|admin(istrative)?\s*(&|and)?\s*(telco|regulatory)|infrastructure\s*surcharge/i,
    label: 'Carrier Regulatory / Administrative Recovery Charge',
    verdict: 'Discretionary Carrier Fee',
    explanation:
      'Internal company cost-recovery surcharge rather than a government-mandated tax. Request a loyalty or ACH AutoPay credit to offset it.',
    statuteOrRule: 'FCC Truth-in-Billing (47 C.F.R. § 64.2401)',
    severity: 8,
  },
  {
    pattern: /mobile\s*protect|protect\s*advantage|protection<360>|device\s*protection|complete\s*care|tech\s*pro|wifi\s*security|multi-device\s*security|surge\s*guard|wire\s*protection/i,
    label: 'Optional Insurance / Protection Add-On',
    verdict: 'Cancelable Optional Add-On',
    explanation:
      'Optional monthly insurance or warranty plan frequently bundled during activation. Compare against free credit-card phone protection or cancel anytime without penalty.',
    statuteOrRule: 'FTC Negative Option & Unsolicited Add-On Guidance',
    severity: 14,
  },
  {
    pattern: /next\s*up|apple\s*(music|one)|cloud\s*(bundle|perk)|auto-enrolled|trial/i,
    label: 'Auto-Enrolled Perk / Early-Upgrade Add-On',
    verdict: 'Cancelable Optional Add-On',
    explanation:
      'Optional subscription or upgrade perk that can be removed inside your carrier account portal without losing base promotional discounts.',
    statuteOrRule: 'FTC ROSCA & Clear Disclosure Guidance',
    severity: 12,
  },
  {
    pattern: /data\s*cap|unlimited\s*data|overage/i,
    label: 'Broadband Data Cap / Unlimited Add-On',
    verdict: 'Negotiable Surcharge',
    explanation:
      'Check your past 6 months of actual GB usage before paying $30–$50/month for Unlimited Data, or request a promotional waiver citing uncapped fiber/5G competition.',
    statuteOrRule: 'FCC Broadband Consumer Label Rules',
    severity: 15,
  },
  {
    pattern: /autopay|paper\s*(bill|statement)|credit\s*card.*penalty/i,
    label: 'Non-ACH AutoPay / Paper Bill Penalty',
    verdict: 'Avoidable Payment Fee',
    explanation:
      'Linking a bank checking account (ACH) and enabling paperless statements restores $5–$10/line/month in carrier discounts.',
    statuteOrRule: 'Carrier AutoPay Terms Disclosure',
    severity: 8,
  },
  {
    pattern: /late\s*(payment|fee)|adjustment\s*fee/i,
    label: 'Late Payment Assessment',
    verdict: 'Request One-Time Courtesy Waiver',
    explanation:
      'Providers routinely grant a one-time courtesy late-fee waiver per 12-month period for customers with otherwise solid payment history.',
    statuteOrRule: 'Customer Account Retention Policy',
    severity: 8,
  },
  {
    pattern: /0450|facility\s*fee|g0463|0510/i,
    label: 'Hospital Facility Fee (Revenue Code 0450 / G0463)',
    verdict: 'High-Impact Charge (Itemized Audit Needed)',
    explanation:
      'Hospital overhead facility fee billed separately from physician services. Request an itemized UB-04 ledger, verify ER acuity scoring criteria, and check No Surprises Act / IRC § 501(r) charity care eligibility.',
    statuteOrRule: 'No Surprises Act (42 U.S.C. § 300gg-111) & IRC § 501(r)',
    severity: 22,
  },
  {
    pattern: /out-of-network|99284|99285|anesthes|radiology|balance\s*bill/i,
    label: 'Out-of-Network / High-Acuity Emergency Charge',
    verdict: 'Protected Balance Bill / Coding Review',
    explanation:
      'Out-of-network emergency care and ancillary hospital clinicians (anesthesia, radiology, pathology) are federally barred from balance billing insured patients above in-network cost-sharing.',
    statuteOrRule: 'Federal No Surprises Act (42 U.S.C. § 300gg-111; 45 C.F.R. § 149)',
    severity: 24,
  },
  {
    pattern: /saline|iv\s*fluid|0250|0270|supply|supplies/i,
    label: 'Unbundled Routine Pharmacy / Medical Supply Charge',
    verdict: 'Possible Unbundled Charge',
    explanation:
      'Routine hydration and standard clinical supplies are often bundled inside hospital facility fees under CMS NCCI edits. Request an itemized coding audit.',
    statuteOrRule: 'CMS National Correct Coding Initiative (NCCI)',
    severity: 14,
  },
  {
    pattern: /record\s*prep|administrative\s*surcharge/i,
    label: 'Medical Administrative / Record Prep Surcharge',
    verdict: 'Ancillary Overhead (Verification Needed)',
    explanation:
      'Standard administrative overhead is typically encapsulated inside evaluation/facility codes and should be audited before payment.',
    statuteOrRule: 'CMS Billing Guidelines & HIPAA 45 C.F.R. § 164.524',
    severity: 12,
  },
  {
    pattern: /estimated\s*read|fuel\s*cost\s*recovery|storm\s*recovery|pcia|e-tou-c|tou\s*peak/i,
    label: 'Utility Tariff Rider / Estimated Meter / Peak TOU Charge',
    verdict: 'Verify Tariff & Actual Meter Read',
    explanation:
      'Confirm the utility used an actual (not estimated) meter read, check billing cycle length (28 vs. 35 days), and request a 12-month tariff comparison under State PUC rules.',
    statuteOrRule: 'State Public Utility Commission (PUC) Tariff & Meter Accuracy Rules',
    severity: 14,
  },
  {
    pattern: /promo(tion|tional)?\s*(expir|ended|removed|step|hike)|post-promo|post-hike/i,
    label: 'Expired Promotional Rate Cliff',
    verdict: 'Negotiable via Customer Retention',
    explanation:
      'Promotional discounts automatically roll off after 12–24 months. Cite competing FCC Broadband Consumer Labels in your ZIP code to reset promotional pricing.',
    statuteOrRule: 'FCC Broadband Consumer Label Comparison',
    severity: 14,
  },
];

function extractDollarAmount(line: string): number {
  const match = line.match(/\$([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?|[0-9]+(?:\.[0-9]{2})?)/);
  if (!match) return 0;
  return parseFloat(match[1].replace(/,/g, '')) || 0;
}

export function runClientSideBillAudit(
  provider: string,
  billType: string,
  monthlyAmount: number,
  billText: string
): AuditData {
  const lines = (billText || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const flags: AuditFlag[] = [];
  const matchedLabels = new Set<string>();
  let totalFlaggedDollars = 0;
  let scorePenalty = 0;

  for (const line of lines) {
    // Skip aggregate total lines
    if (/^(total|amount\s*due|balance\s*due|insurance\s*paid)/i.test(line)) {
      continue;
    }
    for (const rule of CLIENT_SIDE_FEE_RULES) {
      if (rule.pattern.test(line) && !matchedLabels.has(rule.label)) {
        const amt = extractDollarAmount(line);
        matchedLabels.add(rule.label);
        totalFlaggedDollars += amt;
        scorePenalty += rule.severity;
        flags.push({
          chargeName: rule.label,
          amount: amt > 0 ? `$${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Review Amount',
          numericAmount: amt,
          verdict: rule.verdict,
          explanation: `${rule.explanation} (Matched line: "${line.slice(0, 95)}${line.length > 95 ? '…' : ''}")`,
          statuteOrRule: rule.statuteOrRule,
        });
        break;
      }
    }
  }

  const isMedical = /medical|hospital|er|clinic/i.test(billType);
  const isUtility = /electric|gas|water|utility/i.test(billType);

  // If user entered minimal text without standard keywords, still provide structured category-specific guidance
  if (flags.length === 0) {
    if (isMedical) {
      flags.push({
        chargeName: 'Summary Medical Statement — Itemized UB-04/CPT Audit Recommended',
        amount: monthlyAmount > 0 ? `$${monthlyAmount.toFixed(2)}` : 'Verify Statement',
        numericAmount: monthlyAmount * 0.35,
        verdict: 'Itemized Audit Recommended',
        explanation:
          'No specific CPT or Revenue Codes were detected in the pasted text. Always request an itemized UB-04/CPT statement and check IRC § 501(r) nonprofit Financial Assistance before paying.',
        statuteOrRule: 'HIPAA 45 C.F.R. § 164.524 & IRC § 501(r)',
      });
      scorePenalty = 28;
    } else if (isUtility) {
      flags.push({
        chargeName: 'Utility Rate Schedule & Meter Verification Check',
        amount: monthlyAmount > 0 ? `$${monthlyAmount.toFixed(2)}` : 'Verify Statement',
        numericAmount: monthlyAmount * 0.15,
        verdict: 'Tariff & Cycle Verification',
        explanation:
          'Verify whether your statement used an Actual or Estimated meter read, check total billing days (28–35 days), and compare your per-kWh rate against your state EIA benchmark.',
        statuteOrRule: 'State Public Utility Commission (PUC) Tariff Rules',
      });
      scorePenalty = 18;
    } else {
      flags.push({
        chargeName: 'Promotional Rate & Ancillary Surcharge Review',
        amount: monthlyAmount > 0 ? `$${monthlyAmount.toFixed(2)}` : 'Verify Statement',
        numericAmount: Math.min(monthlyAmount * 0.2, 35),
        verdict: 'Rate Benchmark Review',
        explanation:
          'Paste individual line items from page 2 of your PDF statement (such as Broadcast TV, modem rental, admin recovery, or protection plans) for exact line-by-line dollar flagging.',
        statuteOrRule: 'FCC Truth-in-Billing (47 C.F.R. § 64.2401)',
      });
      scorePenalty = 15;
    }
  }

  const auditScore = Math.max(18, Math.min(96, 100 - scorePenalty));
  const formattedOvercharge =
    totalFlaggedDollars > 0
      ? isMedical
        ? `$${totalFlaggedDollars.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} flagged`
        : `$${totalFlaggedDollars.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mo`
      : isMedical
      ? 'Request Itemized Ledger'
      : 'Check Promo & Add-Ons';

  const cleanProvider = provider.trim() || 'your provider';
  const flaggedNames = flags.map((f) => f.chargeName).slice(0, 3).join(', ');

  const phoneScript = isMedical
    ? `"Hello, I am calling regarding my statement from ${cleanProvider} totaling $${monthlyAmount.toFixed(2)}. Before remitting payment, I am requesting a full itemized statement with all 5-digit CPT/HCPCS codes and 4-digit UB-04 Revenue Codes—specifically reviewing ${flaggedNames}. Please place a 30-day billing audit hold on this account and send me your IRC § 501(r) Financial Assistance Policy application."`
    : isUtility
    ? `"Hello, I am reviewing my ${cleanProvider} statement totaling $${monthlyAmount.toFixed(2)}. Please confirm whether this cycle used an actual or estimated meter read, verify the exact number of billing days, remove any optional third-party protection add-ons, and compare my usage against standard flat vs. Time-of-Use residential tariffs."`
    : `"Hello, I am auditing my ${cleanProvider} statement totaling $${monthlyAmount.toFixed(2)} and flagged ${flaggedNames}${totalFlaggedDollars > 0 ? ` (approx. $${totalFlaggedDollars.toFixed(2)}/mo)` : ''}. Competing plans in my ZIP code offer lower all-in pricing on their FCC Broadband Labels. Please connect me with Loyalty Retention to remove optional add-ons/equipment rentals and match a current promotional rate."`;

  return {
    auditScore,
    totalEstimatedOvercharge: formattedOvercharge,
    flags,
    negotiationStrategy: `Review each flagged item with ${cleanProvider} in writing or via Customer Retention, citing the specific federal or state guidance listed above.`,
    phoneScript,
    disputeReady: true,
  };
}

export const BillAuditor: React.FC<BillAuditorProps> = ({
  onTransferToDispute,
  initialProvider,
  initialCategory,
  initialAmount,
  initialBillText,
  hideHero = false,
  autoRun = false,
}) => {
  const [provider, setProvider] = useState<string>(initialProvider || 'Xfinity Comcast');
  const [billType, setBillType] = useState<string>(initialCategory || 'Cable & Internet');
  const [monthlyAmount, setMonthlyAmount] = useState<number>(initialAmount ?? 184.5);
  const [billText, setBillText] = useState<string>(initialBillText || SAMPLE_BILLS[0].rawText);
  const [auditResult, setAuditResult] = useState<AuditData | null>(() =>
    autoRun
      ? runClientSideBillAudit(
          initialProvider || 'Xfinity Comcast',
          initialCategory || 'Cable & Internet',
          initialAmount ?? 184.5,
          initialBillText || SAMPLE_BILLS[0].rawText
        )
      : null
  );
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  useEffect(() => {
    if (initialProvider) setProvider(initialProvider);
    if (initialCategory) setBillType(initialCategory);
    if (typeof initialAmount === 'number') setMonthlyAmount(initialAmount);
    if (initialBillText) setBillText(initialBillText);
    if (autoRun && (initialProvider || initialBillText)) {
      setAuditResult(
        runClientSideBillAudit(
          initialProvider || provider,
          initialCategory || billType,
          initialAmount ?? monthlyAmount,
          initialBillText || billText
        )
      );
    }
  }, [initialProvider, initialCategory, initialAmount, initialBillText, autoRun]);

  const loadSample = (sample: SampleBillScenario) => {
    setProvider(sample.provider);
    setBillType(sample.category);
    setMonthlyAmount(sample.amount);
    setBillText(sample.rawText);
    setAuditResult(runClientSideBillAudit(sample.provider, sample.category, sample.amount, sample.rawText));
  };

  const handleAudit = () => {
    // 100% client-side deterministic audit — zero network calls, zero PII transmission
    const result = runClientSideBillAudit(provider, billType, monthlyAmount, billText);
    setAuditResult(result);
  };

  const copyPhoneScript = () => {
    if (auditResult?.phoneScript) {
      navigator.clipboard.writeText(auditResult.phoneScript);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {!hideHero && (
        <div className="bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            100% Client-Side Line-Item Fee Checker · Zero Server Uploads
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Audit Your Bill for Hidden Fees &amp; Surcharges
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            Paste statement line items from telecom, internet, utility, or hospital invoices below. Everything runs deterministically in your browser—no bill text or personal financial data ever leaves your device.
          </p>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Inputs (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-5">
          {!initialBillText && (
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Load Realistic Sample Bills
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SAMPLE_BILLS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => loadSample(sample)}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs font-medium cursor-pointer ${
                      provider === sample.provider
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold line-clamp-1">{sample.provider}</div>
                    <div className="text-[11px] text-slate-400 tabular-nums line-clamp-1">
                      ${sample.amount.toFixed(2)} · {sample.category}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="auditor-provider" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Provider / Company
              </label>
              <input
                id="auditor-provider"
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Xfinity, Verizon, Regional Hospital"
              />
            </div>
            <div>
              <label htmlFor="auditor-category" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Bill Category
              </label>
              <select
                id="auditor-category"
                value={billType}
                onChange={(e) => setBillType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
              >
                <option value="Cable & Internet">Cable &amp; Internet / ISP</option>
                <option value="Medical & Hospital">Medical / Hospital / ER</option>
                <option value="Mobile Phone">Mobile Phone / Wireless</option>
                <option value="Electric & Gas">Electric &amp; Gas Utility</option>
                <option value="Water & Trash">Water, Sewer &amp; Trash</option>
                <option value="Subscription">SaaS &amp; Streaming Subscriptions</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="auditor-amount" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Total Billed Amount ($)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-400 font-bold">$</span>
              <input
                id="auditor-amount"
                type="number"
                step="0.01"
                min="0"
                value={monthlyAmount || ''}
                onChange={(e) => setMonthlyAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-base font-bold text-white tabular-nums focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="auditor-text" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Paste Bill Text or Line Items
              </label>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400/90">
                <Lock className="w-3 h-3" />
                Processed locally in browser
              </span>
            </div>
            <textarea
              id="auditor-text"
              rows={8}
              value={billText}
              onChange={(e) => setBillText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed"
              placeholder="Paste line items here (e.g. Broadcast TV fee $23.20, Modem rental $15.00, Rev Code 0450 $1,250.00)..."
            />
          </div>

          <button
            type="button"
            onClick={handleAudit}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4 text-slate-950" />
            <span>Audit Line Items Locally</span>
          </button>
        </div>

        {/* Results (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {!auditResult && (
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 mx-auto flex items-center justify-center">
                <FileCheck2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-base font-bold text-white">Ready for Client-Side Line-Item Audit</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Click &ldquo;Audit Line Items Locally&rdquo; to flag Broadcast TV fees, modem rentals, carrier recovery charges, Revenue Code 0450 hospital facility fees, and expired promotional cliffs—without sending any text to a server.
              </p>
            </div>
          )}

          {auditResult && (
            <div className="bg-slate-900 rounded-2xl border border-emerald-500/30 p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Bill Health Score
                  </span>
                  <div
                    className={`text-3xl font-black mt-1 tabular-nums ${
                      auditResult.auditScore >= 75
                        ? 'text-emerald-400'
                        : auditResult.auditScore >= 45
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {auditResult.auditScore}/100
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {auditResult.auditScore < 50 ? 'High Ancillary Fees' : auditResult.auditScore < 75 ? 'Items Warrant Review' : 'Mostly Base Charges'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Flagged For Review
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-1 tabular-nums">
                    {auditResult.totalEstimatedOvercharge}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {auditResult.flags.length} line {auditResult.flags.length === 1 ? 'item' : 'items'} identified
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Flagged Charges &amp; Regulatory Context
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {auditResult.flags.map((flag, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white">{flag.chargeName}</span>
                        <span className="text-xs font-bold text-amber-300 tabular-nums">
                          {flag.amount} · {flag.verdict}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{flag.explanation}</p>
                      {flag.statuteOrRule && (
                        <div className="text-[11px] text-emerald-400 font-mono">
                          Reference: {flag.statuteOrRule}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5" />
                    Customer Retention / Billing Script
                  </h3>
                  <button
                    type="button"
                    onClick={copyPhoneScript}
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Copied' : 'Copy Script'}</span>
                  </button>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {auditResult.phoneScript}
                </div>
              </div>

              {onTransferToDispute && (
                <button
                  type="button"
                  onClick={() => {
                    onTransferToDispute(
                      provider,
                      auditResult.totalEstimatedOvercharge.replace(/[^0-9.]/g, '') || monthlyAmount.toFixed(2),
                      `Disputing flagged ancillary charges and unbundled fees on statement: ${auditResult.flags
                        .map((f) => f.chargeName)
                        .join(', ')}`
                    );
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span>Draft Written Dispute Notice With Flagged Items</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Privacy & Educational Disclosure */}
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 text-xs text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-200 text-[11px] uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Client-Side Privacy &amp; Educational Notice</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          All pasted bill statements are inspected locally inside your web browser using deterministic rule matching against FCC Truth-in-Billing, CMS No Surprises Act, IRC § 501(r), and State PUC tariff standards. Zero bill text or account numbers are ever transmitted to ItsMyBill servers. Flagged items warrant verification with your provider and do not constitute legal advice.
        </p>
      </div>
    </div>
  );
};
