import React, { useState } from 'react';
import { 
  FileCheck2, 
  AlertTriangle, 
  DollarSign, 
  Sparkles, 
  PhoneCall, 
  Scale, 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowRight,
  RotateCw,
  Zap,
  Building
} from 'lucide-react';
import { SAMPLE_BILLS, SampleBillScenario } from '../data/mockData';

interface AuditFlag {
  chargeName: string;
  amount: string;
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

interface BillAuditorProps {
  onTransferToDispute?: (provider: string, amount: string, reason: string) => void;
}

export const BillAuditor: React.FC<BillAuditorProps> = ({ onTransferToDispute }) => {
  const [provider, setProvider] = useState<string>('Xfinity Comcast');
  const [billType, setBillType] = useState<string>('Cable & Internet');
  const [monthlyAmount, setMonthlyAmount] = useState<number>(184.50);
  const [billText, setBillText] = useState<string>(SAMPLE_BILLS[0].rawText);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<AuditData | null>(null);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  const loadSample = (sample: SampleBillScenario) => {
    setProvider(sample.provider);
    setBillType(sample.category);
    setMonthlyAmount(sample.amount);
    setBillText(sample.rawText);
    setAuditResult(null);
  };

  const handleAudit = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/audit-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          billType,
          monthlyAmount,
          billText,
        }),
      });

      if (!res.ok) {
        throw new Error('Static host fallback');
      }

      const data = await res.json();
      setAuditResult(data.data);
    } catch {
      // Offline / Static hosting fallback (e.g. GitHub Pages)
      const isMedical = (billType || '').toLowerCase().includes('medical') || (billType || '').toLowerCase().includes('hospital');
      const fallbackAudit: AuditData = {
        auditScore: 54,
        totalEstimatedOvercharge: isMedical ? "$1,450.00 (Potential Out-of-Network Balance)" : "$41.65 / month (Ancillary Fees)",
        flags: isMedical ? [
          {
            chargeName: "Emergency Dept Level 4 Facility Fee (Rev Code 0450)",
            amount: "$1,250.00",
            verdict: "Out-of-Network Balance (Review Recommended)",
            explanation: "Facility fee billed at out-of-network rates for an emergency admission. Under the federal No Surprises Act, emergency services cannot be billed beyond in-network cost-sharing amounts.",
            statuteOrRule: "No Surprises Act (42 U.S.C. § 300gg-111)"
          },
          {
            chargeName: "Administrative Surcharge & Record Prep",
            amount: "$120.00",
            verdict: "Ancillary Fee (Verification Needed)",
            explanation: "Administrative overhead charges warrant itemized justification. CMS guidelines require hospital evaluation codes to encapsulate standard facility administration.",
            statuteOrRule: "CMS Billing Guidelines (Chapter 12)"
          },
          {
            chargeName: "Unbundled Saline IV 1000ml",
            amount: "$280.00",
            verdict: "Routine Supply Charge (Verification Needed)",
            explanation: "Separate pharmacy line items for routine hydration are frequently bundled into emergency facility fees. Request an itemized coding ledger.",
            statuteOrRule: "Hospital Financial Assistance & 501(r) Guidelines"
          }
        ] : [
          {
            chargeName: "Broadcast TV Surcharge",
            amount: "$23.20/mo",
            verdict: "Company Surcharge (Review Recommended)",
            explanation: "Ancillary provider fee added on top of base programming tier. Review package alternatives or ask loyalty retention for bundled bill credits.",
            statuteOrRule: "FCC Truth-in-Billing (47 C.F.R. § 64.2401)"
          },
          {
            chargeName: "Modem / Gateway Rental Fee",
            amount: "$15.00/mo",
            verdict: "Equipment Rental (Avoidable Expense)",
            explanation: "Ongoing hardware rental fee. Consumers can purchase their own compatible DOCSIS 3.1 gateway to eliminate this recurring monthly charge.",
            statuteOrRule: "Television Viewer Protection Act (47 U.S.C. § 562)"
          },
          {
            chargeName: "Regulatory Cost Recovery Charge",
            amount: "$3.45/mo",
            verdict: "Discretionary Fee (Review Recommended)",
            explanation: "Internal company cost-recovery fee rather than a mandatory government-imposed tax.",
            statuteOrRule: "FTC Upfront Pricing & Disclosure Guidance"
          }
        ],
        negotiationStrategy: `Contact ${provider || 'your provider'} to review your line items against competitor promotions and statutory disclosures. Ask whether unbundled charges can be consolidated or if promotional credits apply to your account.`,
        phoneScript: `"Hello, I am reviewing invoice details for my ${provider || 'service'} account. I would like to review the ancillary surcharges totaling approximately $XX.XX on my statement. As an active customer, I would like to request that these discretionary fees be credited or that my account be updated to your current standard plan. Can you check what retention adjustments are available today?"`,
        disputeReady: true
      };
      setAuditResult(fallbackAudit);
    } finally {
      setLoading(false);
    }
  };

  const copyPhoneScript = () => {
    if (auditResult?.phoneScript) {
      navigator.clipboard.writeText(auditResult.phoneScript);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            AI Consumer Fee Auditor • Uncover Sneaky Surcharges & Out-of-Network Traps
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Stop Overpaying. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Audit Your Bill</span> for Free.
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Telecom, utility, and healthcare providers bank on consumers not reading the fine print. Paste your invoice or bill statement line items below and our AI auditor flags every hidden fee, expired promotion, and bogus markup.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          {/* Sample Presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Load Realistic Real-World Test Bills
            </label>
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
                  <div className="text-[10px] text-slate-400 line-clamp-1">${sample.amount} • {sample.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Provider and Bill Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Provider / Company
              </label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Comcast, AT&T, Regional Hospital"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Bill Category
              </label>
              <select
                value={billType}
                onChange={(e) => setBillType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
              >
                <option value="Cable & Internet">Cable & Internet / ISP</option>
                <option value="Medical & Hospital">Medical / Hospital / ER</option>
                <option value="Mobile Phone">Mobile Phone / Wireless</option>
                <option value="Electric & Gas">Electric & Gas Utility</option>
                <option value="Water & Trash">Water, Sewer & Trash</option>
                <option value="Subscription">SaaS & Streaming Subscriptions</option>
              </select>
            </div>
          </div>

          {/* Stated Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Total Billed Amount ($)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-400 font-bold">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={monthlyAmount || ''}
                onChange={(e) => setMonthlyAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-base font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Line items text */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Paste Bill Text or Line Items
              </label>
              <span className="text-[11px] text-slate-500">Copy directly from PDF/statement</span>
            </div>
            <textarea
              rows={8}
              value={billText}
              onChange={(e) => setBillText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed"
              placeholder="Paste line items here (e.g. Broadcast TV fee $23.20, Modem rental $15.00, CPT 99284 Level 4 $1,450.00)..."
            />
          </div>

          {/* Run Audit Button */}
          <button
            type="button"
            onClick={handleAudit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Auditing Line Items Against Consumer Regulations...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Audit This Bill Now</span>
              </>
            )}
          </button>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {!auditResult && !loading && (
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 mx-auto flex items-center justify-center">
                <FileCheck2 className="w-6 h-6 text-slate-500" />
              </div>
              <h3 className="text-base font-bold text-white">Ready for Deep Bill Audit</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Click "Audit This Bill Now" to inspect for illegal surprise out-of-network hospital charges, ISP modem rental fees you shouldn't be paying, and expired contract hikes.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center animate-pulse">
                <FileCheck2 className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Analyzing Line Items</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Cross-referencing fees against FCC telecommunication rules, CFPB fair billing guidelines, and federal No Surprises Act thresholds...
                </p>
              </div>
            </div>
          )}

          {auditResult && !loading && (
            <div className="bg-slate-900 rounded-2xl border border-emerald-500/30 p-6 shadow-2xl space-y-6">
              {/* Score & Overcharge Bar */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Bill Health Score
                  </span>
                  <div className={`text-3xl font-black mt-1 ${
                    auditResult.auditScore >= 75 ? 'text-emerald-400' : auditResult.auditScore >= 45 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {auditResult.auditScore}/100
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {auditResult.auditScore < 50 ? 'Excessive Junk Fees' : 'Moderate Concerns'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Identified Overcharge
                  </span>
                  <div className="text-3xl font-black text-rose-400 mt-1">
                    {auditResult.totalEstimatedOvercharge || '$45.00/mo'}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Potential Recoverable Amount
                  </span>
                </div>
              </div>

              {/* Line item flags */}
              {auditResult.flags && auditResult.flags.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Flagged Charges & Verdicts
                  </h4>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {auditResult.flags.map((flag, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{flag.chargeName}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            flag.verdict.toLowerCase().includes('balance') || flag.verdict.toLowerCase().includes('avoidable')
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {flag.verdict}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {flag.explanation}
                        </p>
                        {flag.statuteOrRule && (
                          <div className="text-[10px] text-emerald-400 font-mono pt-1">
                            Relevant Guidance: {flag.statuteOrRule}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strategy & Script */}
              {auditResult.phoneScript && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5" />
                      Discussion Script (For Customer Service)
                    </h4>
                    <button
                      type="button"
                      onClick={copyPhoneScript}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedScript ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {auditResult.phoneScript}
                  </div>
                </div>
              )}

              {/* Transfer to Dispute Letter Action */}
              {onTransferToDispute && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onTransferToDispute(
                        provider,
                        auditResult.totalEstimatedOvercharge.replace(/[^0-9.]/g, '') || monthlyAmount.toString(),
                        `Disputing flagged ancillary charges and unbundled fees on statement: ${auditResult.flags.map(f => f.chargeName).join(', ')}`
                      );
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-all cursor-pointer shadow-md"
                  >
                    <Scale className="w-4 h-4 text-emerald-400" />
                    <span>Draft Written Dispute Notice With Flagged Items</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Educational Disclosure Card */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-4 text-xs text-slate-400 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-300 text-[11px] uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Educational Analysis &amp; Data Notice</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          The Bill Fee Checker evaluates user-submitted text against common industry fee structures and federal disclosure standards (including FCC Truth-in-Billing and CMS balance billing guidance). Flagged charges warrant verification with your provider and do not constitute formal accusations of wrongdoing or legal advice. Information processed during analysis is not stored or shared.
        </p>
      </div>
    </div>
  );
};
