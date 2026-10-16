import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Sparkles, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  RotateCw,
  Send
} from 'lucide-react';

interface LetterData {
  subjectLine: string;
  letterBody: string;
  certifiedMailInstructions: string[];
  legalDeadlines: string;
}

interface DisputeGeneratorProps {
  initialProvider?: string;
  initialAmount?: string;
  initialReason?: string;
}

export const DisputeGenerator: React.FC<DisputeGeneratorProps> = ({
  initialProvider = '',
  initialAmount = '',
  initialReason = '',
}) => {
  const [consumerName, setConsumerName] = useState<string>('Jordan Miller');
  const [accountNumber, setAccountNumber] = useState<string>('INV-2024-88392');
  const [providerName, setProviderName] = useState<string>(initialProvider || 'Metro Regional Health System');
  const [billDate, setBillDate] = useState<string>('March 12, 2024');
  const [disputeAmount, setDisputeAmount] = useState<string>(initialAmount || '1,450.00');
  const [disputeReason, setDisputeReason] = useState<string>(
    initialReason || 'Surprise Out-of-Network Emergency Facility Fee in violation of the federal No Surprises Act (42 U.S.C. 300gg-111)'
  );
  const [cptCodes, setCptCodes] = useState<string>('CPT 99284, Revenue Code 0450');
  const [billType, setBillType] = useState<string>('Medical & Hospital');

  const [loading, setLoading] = useState<boolean>(false);
  const [letterData, setLetterData] = useState<LetterData | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (initialProvider) setProviderName(initialProvider);
    if (initialAmount) setDisputeAmount(initialAmount);
    if (initialReason) setDisputeReason(initialReason);
  }, [initialProvider, initialAmount, initialReason]);

  const presetReasons = [
    {
      label: 'Surprise Out-of-Network Emergency (No Surprises Act)',
      category: 'Medical & Hospital',
      reason: 'Out-of-network balance billing for emergency services at an in-network facility, prohibited under the federal No Surprises Act (42 U.S.C. § 300gg-111).',
      codes: 'CPT 99284 / Rev Code 0450',
    },
    {
      label: 'Undisclosed Telecom Surcharge (FCC Truth-in-Billing)',
      category: 'Cable & Internet',
      reason: 'Unnotified price escalation and undisclosed ancillary surcharges exceeding contractual terms without required notice (FCC 47 C.F.R. § 64.2401).',
      codes: 'Broadcast TV Surcharge & Modem Rental',
    },
    {
      label: 'Credit Card Billing Statement Error (FCBA 15 U.S.C. 1666)',
      category: 'Credit & Banking',
      reason: 'Billing statement error and unauthorized merchant charge disputed within statutory 60-day billing notice window pursuant to 15 U.S.C. § 1666.',
      codes: 'Disputed Merchant Charge ID',
    },
    {
      label: 'Debt Collector Validation Demand (FDCPA 15 U.S.C. 1692g)',
      category: 'Collections',
      reason: 'Formal request for debt validation and verification of original creditor documentation pursuant to the Fair Debt Collection Practices Act (15 U.S.C. § 1692g).',
      codes: 'Collection Agency Notice Ref #',
    },
    {
      label: 'Hospital Charity Care / Financial Assistance (ACA § 501(r))',
      category: 'Medical & Hospital',
      reason: 'Formal application and ledger review under hospital Financial Assistance Policy (FAP) pursuant to Internal Revenue Code § 501(r).',
      codes: 'Itemized Hospital Ledger Audit',
    },
  ];

  const handleGenerateLetter = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/generate-dispute-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consumerName,
          accountNumber,
          providerName,
          billDate,
          disputeAmount,
          disputeReason,
          cptCodes,
          billType,
        }),
      });

      if (!res.ok) throw new Error('API unavailable, triggering client fallback');

      const json = await res.json();
      setLetterData(json.data);
    } catch {
      // Offline / Static hosting fallback (e.g. GitHub Pages)
      const name = consumerName || 'Consumer Name';
      const acct = accountNumber || 'ACC-88392';
      const prov = providerName || 'Billing Department';
      const date = billDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const amt = disputeAmount || '1,450.00';
      const reason = disputeReason || 'Unsubstantiated line items and out-of-network balance billing in violation of statutory disclosure rules.';

      const isMedical = (billType || '').toLowerCase().includes('medical') || (billType || '').toLowerCase().includes('hospital');
      const isTelecom = (billType || '').toLowerCase().includes('cable') || (billType || '').toLowerCase().includes('internet') || (billType || '').toLowerCase().includes('phone');
      const isBanking = (billType || '').toLowerCase().includes('credit') || (billType || '').toLowerCase().includes('bank');
      const isCollections = (billType || '').toLowerCase().includes('collection');

      let statutoryBasis = "pursuant to applicable consumer billing disclosure standards";
      let legalDeadlines = "Creditors and service providers typically review and respond to written consumer billing inquiries within 30 days of receipt.";
      let requestedAction = "1. Furnish a complete line-item itemized statement detailing all billed charges.\n2. Review the contractual and statutory validity of the disputed charges.\n3. Pause automated collection activity while this inquiry is under review.";

      if (isMedical) {
        statutoryBasis = "pursuant to the federal No Surprises Act (42 U.S.C. § 300gg-111) and 45 C.F.R. § 149";
        legalDeadlines = "Under federal No Surprises Act regulations, providers cannot balance bill patients beyond in-network cost-sharing for covered emergency services and must provide itemized billing codes upon request.";
        requestedAction = "1. Furnish an itemized statement detailing all applicable CPT, HCPCS, and revenue codes.\n2. Recalculate patient financial liability in compliance with the federal No Surprises Act (42 U.S.C. § 300gg-111).\n3. Cease automated collection efforts and adverse credit reporting while this dispute is pending.";
      } else if (isTelecom) {
        statutoryBasis = "pursuant to Federal Communications Commission (FCC) Truth-in-Billing requirements (47 C.F.R. § 64.2401) and the Television Viewer Protection Act (47 U.S.C. § 562)";
        legalDeadlines = "FCC regulations require telecommunications providers to provide clear, organized fee descriptions and address customer billing inquiries promptly.";
        requestedAction = "1. Provide contractual justification and disclosure records for all ancillary surcharges.\n2. Apply appropriate billing credits for disputed line items.\n3. Verify that my account is maintained on the agreed rate tier.";
      } else if (isBanking) {
        statutoryBasis = "pursuant to the Fair Credit Billing Act (15 U.S.C. § 1666)";
        legalDeadlines = "Under 15 U.S.C. § 1666, creditors must acknowledge written billing error notices within 30 days and resolve the dispute within two billing cycles (not to exceed 90 days).";
        requestedAction = "1. Acknowledge receipt of this billing error notice in writing within 30 days.\n2. Conduct an investigation into the disputed charge.\n3. Refrain from taking collection action or reporting the disputed amount as delinquent pursuant to 15 U.S.C. § 1666(a).";
      } else if (isCollections) {
        statutoryBasis = "pursuant to the Fair Debt Collection Practices Act (15 U.S.C. § 1692g) and CFPB Regulation F (12 C.F.R. Part 1006)";
        legalDeadlines = "Under 15 U.S.C. § 1692g, debt collectors must cease collection activity until written verification of the disputed debt from the original creditor is provided.";
        requestedAction = "1. Cease all collection efforts until written verification of the debt from the original creditor is provided.\n2. Provide documentation establishing the contractual authority to collect this balance.\n3. Notify credit reporting agencies that this account is actively disputed by the consumer.";
      }

      const fallbackLetter: LetterData = {
        subjectLine: `FORMAL WRITTEN DISPUTE & AUDIT REQUEST – Account #${acct} – ${name}`,
        letterBody: `Date: ${date}\n\nTO:\nBilling Disputes & Consumer Compliance\n${prov}\n\nFROM:\n${name}\nAccount/Reference #: ${acct}\n\nRE: Formal Dispute of Billed Charges totaling $${amt}\n\nDear Billing Compliance Department,\n\nPlease accept this letter as my formal written dispute ${statutoryBasis}.\n\nI am disputing the charges in the amount of $${amt} appearing on the invoice dated ${date} regarding account number ${acct}. Specifically:\n\n${reason}\n\nBased on the above, I am formally requesting that you:\n${requestedAction}\n\nPlease provide your written determination within thirty (30) days as prescribed by law. If you have any questions or require additional documentation, please contact me in writing at the address on file.\n\nSincerely,\n\n___________________________________\n${name}\nEnclosures: Copy of Disputed Statement`,
        certifiedMailInstructions: [
          "Send via USPS Certified Mail with Return Receipt Requested (green card form 3811).",
          "Keep the certified mail tracking number and signed delivery receipt in your personal records.",
          "Maintain a signed copy of this dated letter along with the original disputed invoice."
        ],
        legalDeadlines
      };
      setLetterData(fallbackLetter);
    } finally {
      setLoading(false);
    }
  };

  const copyLetter = () => {
    if (!letterData) return;
    const fullText = `SUBJECT: ${letterData.subjectLine}\n\n${letterData.letterBody}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden no-print">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
            <Scale className="w-3.5 h-3.5 text-indigo-400" />
            Statutory Consumer Protection • Self-Advocacy Drafting Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Consumer <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-300">Bill Dispute Letter</span> Generator
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Draft formal written dispute notices and itemized audit requests tailored to your specific bill category (such as medical emergency balance billing under the No Surprises Act, telecommunications fee inquiries under FCC rules, or credit card billing errors).
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5 no-print">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Dispute Parameters
          </h3>

          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              Common Dispute Presets
            </label>
            <div className="space-y-1.5">
              {presetReasons.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setBillType(p.category);
                    setDisputeReason(p.reason);
                    setCptCodes(p.codes);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-[11px] font-medium text-slate-300 transition-colors cursor-pointer"
                >
                  ⚡ {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Your Full Name</label>
              <input
                type="text"
                value={consumerName}
                onChange={(e) => setConsumerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Account / Invoice #</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Company / Hospital</label>
              <input
                type="text"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Disputed Amount ($)</label>
              <input
                type="text"
                value={disputeAmount}
                onChange={(e) => setDisputeAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Dispute Legal Grounds</label>
            <textarea
              rows={3}
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">CPT / Item Codes (Optional)</label>
            <input
              type="text"
              value={cptCodes}
              onChange={(e) => setCptCodes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              placeholder="e.g. CPT 99284, Rev Code 0450"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerateLetter}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-400 hover:from-indigo-400 hover:to-emerald-300 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Drafting Statutory Dispute Notice...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Generate Official Legal Letter</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Document (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {!letterData && !loading && (
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-8 text-center space-y-3 no-print">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 mx-auto flex items-center justify-center">
                <Scale className="w-6 h-6 text-slate-500" />
              </div>
              <h3 className="text-base font-bold text-white">Generate Your Formal Dispute Notice</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Fill out the details on the left and click generate. Your letter will be instantly formatted with federal statutory citations ready to print or copy.
              </p>
            </div>
          )}

          {letterData && (
            <div className="bg-slate-900 rounded-2xl border border-indigo-500/30 p-6 shadow-2xl space-y-6">
              {/* Actions Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 no-print">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Formal Legal Notice
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyLetter}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save PDF</span>
                  </button>
                </div>
              </div>

              {/* Subject */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-indigo-300">
                SUBJECT: {letterData.subjectLine}
              </div>

              {/* Letter Sheet */}
              <div className="bg-white text-slate-900 p-8 rounded-xl font-serif text-sm leading-relaxed shadow-inner border border-slate-200 whitespace-pre-wrap select-text">
                {letterData.letterBody}
              </div>

              {/* Instructions and Deadlines */}
              <div className="space-y-4 pt-2 no-print">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Statutory Timelines: {letterData.legalDeadlines || '30 days to acknowledge written inquiry'}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Once a formal written dispute is delivered via certified mail, creditors and debt collectors are subject to statutory verification requirements before advancing collection actions or filing unverified credit reporting entries.
                  </p>
                </div>

                {letterData.certifiedMailInstructions && letterData.certifiedMailInstructions.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Recommended Certified Mail Procedure
                    </span>
                    {letterData.certifiedMailInstructions.map((ins, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <span>{ins}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Self-Advocacy & Legal Disclaimer */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-4 text-xs text-slate-400 space-y-1.5 no-print">
        <div className="flex items-center gap-1.5 font-bold text-slate-300 text-[11px] uppercase tracking-wider">
          <Scale className="w-3.5 h-3.5 text-indigo-400" />
          <span>Self-Advocacy Disclaimer &amp; Legal Notice</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          The Dispute Letter Generator creates automated drafts for personal review based solely on user-provided parameters. ItsMyBill is an informational consumer technology utility, not a law firm or licensed legal referral service, and does not provide individualized legal representation. Outcomes, refunds, or debt reductions cannot be guaranteed. Always verify facts, dates, and amounts against your original invoices and consider consulting an attorney or qualified legal aid provider for complex disputes.
        </p>
      </div>
    </div>
  );
};
