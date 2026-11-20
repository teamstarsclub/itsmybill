import React, { useState, useEffect } from 'react';
import {
  Scale,
  Printer,
  Copy,
  Check,
  FileText,
  ShieldCheck,
  Clock,
  Lock,
} from 'lucide-react';

export interface LetterData {
  subjectLine: string;
  letterBody: string;
  certifiedMailInstructions: string[];
  legalDeadlines: string;
}

export interface DisputeGeneratorProps {
  initialProvider?: string;
  initialAmount?: string;
  initialReason?: string;
  initialBillType?: string;
  initialCodes?: string;
  hideHero?: boolean;
  autoGenerate?: boolean;
}

export function buildClientSideDisputeLetter(params: {
  consumerName: string;
  accountNumber: string;
  providerName: string;
  billDate: string;
  disputeAmount: string;
  disputeReason: string;
  cptCodes: string;
  billType: string;
}): LetterData {
  const name = params.consumerName.trim() || '[Your Full Name]';
  const acct = params.accountNumber.trim() || 'ACC-88392';
  const prov = params.providerName.trim() || 'Billing Department';
  const date =
    params.billDate.trim() ||
    new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const amt = params.disputeAmount.trim() || '1,450.00';
  const reason = params.disputeReason.trim() || 'Unsubstantiated line items and billing discrepancies.';
  const codes = params.cptCodes.trim();
  const typeLower = (params.billType || '').toLowerCase();
  const reasonLower = reason.toLowerCase();

  const isMedical = typeLower.includes('medical') || typeLower.includes('hospital');
  const isTelecom =
    typeLower.includes('cable') ||
    typeLower.includes('internet') ||
    typeLower.includes('phone') ||
    typeLower.includes('wireless') ||
    typeLower.includes('telecom');
  const isUtility =
    typeLower.includes('utility') ||
    typeLower.includes('electric') ||
    typeLower.includes('gas') ||
    typeLower.includes('water');
  const isBanking = typeLower.includes('credit') || typeLower.includes('bank') || typeLower.includes('card');
  const isCollections = typeLower.includes('collection') || typeLower.includes('collector');
  const isDeposit =
    typeLower.includes('deposit') ||
    reasonLower.includes('security deposit') ||
    codes.toLowerCase().includes('return deadline');

  let statutoryBasis = 'pursuant to applicable consumer billing disclosure standards and contractual service terms';
  let legalDeadlines =
    'Creditors and service providers generally acknowledge and review formal written billing inquiries within 30 days of receipt.';
  let requestedActions = [
    'Furnish a complete line-item itemized statement detailing all billed charges and underlying calculations.',
    'Review the contractual and factual accuracy of the disputed charges.',
    'Pause automated collection activity and late assessments while this written inquiry is under review.',
  ];

  if (isDeposit) {
    statutoryBasis = `pursuant to applicable state residential security deposit law (${codes || 'state landlord-tenant statutes'})`;
    legalDeadlines =
      'State landlord-tenant statutes enforce strict 14- to 60-day return deadlines and authorize double or treble bad-faith damages for wrongful withholding.';
    requestedActions = [
      `Remit my full security deposit refund of $${amt} to my forwarding address within ten (10) business days of receipt of this notice.`,
      'If any portion is claimed as a lawful deduction beyond normal wear and tear, furnish dated itemized invoices, receipts, and photographic evidence.',
      'Confirm written settlement promptly to avoid filing in local Small Claims Court for statutory bad-faith damages and court costs.',
    ];
  } else if (isUtility) {
    statutoryBasis =
      'pursuant to state Public Utility Commission consumer service regulations and applicable utility tariff rate schedules';
    legalDeadlines =
      'State public utility regulations establish formal customer dispute resolution procedures and generally restrict disconnection while a billing or meter inquiry is actively investigated.';
    requestedActions = [
      'Conduct a meter reading verification and review actual versus estimated consumption records for the disputed billing cycle.',
      'Provide an audit of the applied rate tariff and rider surcharges to confirm compliance with state Public Utility Commission filings.',
      'Suspend late assessment fees and service interruption notices regarding the disputed balance while this inquiry is investigated.',
    ];
  } else if (isMedical) {
    const mentionsSurprise =
      reasonLower.includes('surprise') ||
      reasonLower.includes('out-of-network') ||
      reasonLower.includes('emergency') ||
      reasonLower.includes('300gg-111');
    const mentionsCharity =
      reasonLower.includes('charity') ||
      reasonLower.includes('financial assistance') ||
      reasonLower.includes('501(r)');

    if (mentionsSurprise) {
      statutoryBasis = 'pursuant to the federal No Surprises Act (42 U.S.C. § 300gg-111; 45 C.F.R. Part 149)';
      legalDeadlines =
        'Under the federal No Surprises Act, providers cannot balance bill insured patients beyond in-network cost-sharing for covered emergency or in-network hospital ancillary services; self-pay GFE disputes carry a 120-day federal PPDR window.';
      requestedActions = [
        'Recalculate patient financial responsibility in compliance with federal No Surprises Act in-network cost-sharing rules.',
        'Furnish a complete CMS-compliant itemized statement detailing all 5-digit CPT/HCPCS codes and 4-digit UB-04 Revenue Codes.',
        'Place an immediate billing and collections hold while this statutory balance-billing review is completed.',
      ];
    } else if (mentionsCharity) {
      statutoryBasis =
        'pursuant to hospital Financial Assistance Policy requirements under Internal Revenue Code § 501(r) (26 U.S.C. § 501(r)) and HIPAA 45 C.F.R. § 164.524';
      legalDeadlines =
        'Nonprofit hospitals must wait at least 120 days from the first post-discharge statement before taking Extraordinary Collection Actions and accept Financial Assistance applications for 240 days.';
      requestedActions = [
        'Provide a complete itemized UB-04/CPT billing ledger listing every billed code and unit charge.',
        'Send the hospital Financial Assistance Policy (FAP) application and confirm Amounts Generally Billed (AGB) caps for eligible patients.',
        'Suspend all collection agency referrals and adverse credit reporting pending financial assistance determination.',
      ];
    } else {
      statutoryBasis =
        'pursuant to HIPAA patient billing access standards (45 C.F.R. § 164.524) and CMS National Correct Coding Initiative guidelines';
      legalDeadlines =
        'Healthcare facilities are required under HIPAA to furnish billing records within 30 calendar days of patient request.';
      requestedActions = [
        'Furnish a comprehensive itemized bill listing all CPT, HCPCS, and UB-04 Revenue Codes.',
        'Conduct a coding review to remove duplicate entries, unbundled routine supplies, or upcoded facility levels.',
        'Place an active audit hold on automated billing escalations until the itemized ledger is verified.',
      ];
    }
  } else if (isTelecom) {
    statutoryBasis =
      'pursuant to Federal Communications Commission (FCC) Truth-in-Billing requirements (47 C.F.R. § 64.2401) and the Television Viewer Protection Act (47 U.S.C. § 562)';
    legalDeadlines =
      'FCC Truth-in-Billing rules require clear, non-misleading fee descriptions; informal FCC complaints trigger a mandatory 30-day written executive response.';
    requestedActions = [
      'Provide contractual authorization and advance-notice records supporting all disputed ancillary surcharges or add-ons.',
      'Apply full billing credits for unauthorized add-on cramming, unreturned-equipment errors, or unnotified fee escalations.',
      'Confirm my account reflects the agreed promotional or transparent FCC Broadband Consumer Label rate tier.',
    ];
  } else if (isBanking) {
    statutoryBasis = 'pursuant to the Fair Credit Billing Act (15 U.S.C. § 1666) and Regulation Z (12 C.F.R. § 1026.13)';
    legalDeadlines =
      'Under 15 U.S.C. § 1666, creditors must receive written notice at their Billing Inquiries address within 60 days of the statement date, acknowledge within 30 days, and resolve within 90 days (2 billing cycles).';
    requestedActions = [
      'Acknowledge receipt of this written billing error notice within thirty (30) days pursuant to 15 U.S.C. § 1666(a).',
      'Investigate the disputed transaction and credit the disputed sum and related finance charges within two billing cycles (maximum 90 days).',
      'Refrain from reporting the disputed amount as delinquent or initiating collection action during the investigation.',
    ];
  } else if (isCollections) {
    statutoryBasis =
      'pursuant to the Fair Debt Collection Practices Act (15 U.S.C. § 1692g) and CFPB Regulation F (12 C.F.R. Part 1006)';
    legalDeadlines =
      'Under 15 U.S.C. § 1692g(b), disputing in writing within 30 days of the initial validation notice legally freezes all collection activity until written verification from the original creditor is mailed.';
    requestedActions = [
      'Cease all collection calls, letters, and enforcement efforts until written verification of the alleged debt from the original creditor is mailed to me.',
      'Provide an itemized accounting of original principal, interest, fees, and chain of assignment proving authority to collect.',
      'Report to all consumer reporting agencies that this alleged account is actively disputed by the consumer.',
    ];
  }

  return {
    subjectLine: `FORMAL WRITTEN DISPUTE & AUDIT NOTICE – Account #${acct} – ${name}`,
    letterBody: `Date: ${date}

TO:
Billing Inquiries & Consumer Dispute Department
${prov}

FROM:
${name}
Account / Reference #: ${acct}

RE: Formal Written Dispute of Billed Charges Totaling $${amt}

Dear Billing Dispute Department,

Please accept this letter as my formal written dispute ${statutoryBasis}.

I. STATEMENT OF FACTS & DISPUTED PARTICULARS
- Account / Reference Number: ${acct}
- Statement / Notice Date: ${date}
- Disputed Amount: $${amt}
${codes ? `- Relevant Codes / Statutory Identifiers: ${codes}\n` : ''}- Basis for Dispute: ${reason}

II. FORMAL REQUEST FOR RESOLUTION & REMEDIES
Based on the facts above and applicable consumer protection standards, I formally request that you:
${requestedActions.map((act, i) => `${i + 1}. ${act}`).join('\n')}

III. WRITTEN RESPONSE & RECORD PRESERVATION
This written notice is submitted in good faith based on discrepancies identified on the statement referenced above. Please send your written determination and supporting documentation to my mailing address on file within thirty (30) days (or within the shorter period prescribed by applicable statute).

Sincerely,

___________________________________
${name}
Consumer

Enclosures: Copy of Disputed Statement / Supporting Documentation`,
    certifiedMailInstructions: [
      'Send via USPS Certified Mail with Return Receipt Requested (PS Form 3811 or electronic return receipt).',
      'Retain the postmarked Certified Mail receipt and tracking number in your permanent records.',
      'Attach copies—never originals—of statements, EOBs, receipts, or photos.',
    ],
    legalDeadlines,
  };
}

export const DisputeGenerator: React.FC<DisputeGeneratorProps> = ({
  initialProvider = '',
  initialAmount = '',
  initialReason = '',
  initialBillType = '',
  initialCodes = '',
  hideHero = false,
  autoGenerate = false,
}) => {
  const [consumerName, setConsumerName] = useState<string>('Jordan Miller');
  const [accountNumber, setAccountNumber] = useState<string>('INV-2026-88392');
  const [providerName, setProviderName] = useState<string>(initialProvider || 'Metro Regional Health System');
  const [billDate, setBillDate] = useState<string>('November 15, 2026');
  const [disputeAmount, setDisputeAmount] = useState<string>(initialAmount || '1,450.00');
  const [disputeReason, setDisputeReason] = useState<string>(
    initialReason ||
      'Surprise Out-of-Network Emergency Facility Fee prohibited under the federal No Surprises Act (42 U.S.C. § 300gg-111)'
  );
  const [cptCodes, setCptCodes] = useState<string>(initialCodes || 'CPT 99284, Revenue Code 0450');
  const [billType, setBillType] = useState<string>(initialBillType || 'Medical & Hospital');

  const [letterData, setLetterData] = useState<LetterData | null>(() =>
    autoGenerate
      ? buildClientSideDisputeLetter({
          consumerName: 'Jordan Miller',
          accountNumber: 'INV-2026-88392',
          providerName: initialProvider || 'Metro Regional Health System',
          billDate: 'November 15, 2026',
          disputeAmount: initialAmount || '1,450.00',
          disputeReason:
            initialReason ||
            'Surprise Out-of-Network Emergency Facility Fee prohibited under the federal No Surprises Act (42 U.S.C. § 300gg-111)',
          cptCodes: initialCodes || 'CPT 99284, Revenue Code 0450',
          billType: initialBillType || 'Medical & Hospital',
        })
      : null
  );
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (initialProvider) setProviderName(initialProvider);
    if (initialAmount) setDisputeAmount(initialAmount);
    if (initialReason) setDisputeReason(initialReason);
    if (initialBillType) setBillType(initialBillType);
    if (initialCodes) setCptCodes(initialCodes);
    if (autoGenerate) {
      setLetterData(
        buildClientSideDisputeLetter({
          consumerName,
          accountNumber,
          providerName: initialProvider || providerName,
          billDate,
          disputeAmount: initialAmount || disputeAmount,
          disputeReason: initialReason || disputeReason,
          cptCodes: initialCodes || cptCodes,
          billType: initialBillType || billType,
        })
      );
    }
  }, [initialProvider, initialAmount, initialReason, initialBillType, initialCodes, autoGenerate]);

  const presetReasons = [
    {
      label: 'Surprise ER Balance Bill (No Surprises Act — 42 U.S.C. § 300gg-111)',
      category: 'Medical & Hospital',
      reason:
        'Out-of-network balance billing for emergency services at an in-network facility, prohibited under the federal No Surprises Act (42 U.S.C. § 300gg-111).',
      codes: 'CPT 99284 / Rev Code 0450',
    },
    {
      label: 'Itemized Hospital Ledger & Charity Care (IRC § 501(r))',
      category: 'Medical & Hospital',
      reason:
        'Formal request for itemized UB-04/CPT statement and nonprofit hospital Financial Assistance Policy application under IRC § 501(r).',
      codes: 'Itemized UB-04 / CPT Ledger',
    },
    {
      label: 'Debt Collector Validation Demand (FDCPA — 15 U.S.C. § 1692g)',
      category: 'Collections',
      reason:
        'Formal written demand for debt validation and original creditor verification within 30 days pursuant to 15 U.S.C. § 1692g.',
      codes: 'Collection Notice Ref #',
    },
    {
      label: 'Credit Card Billing Statement Error (FCBA — 15 U.S.C. § 1666)',
      category: 'Credit & Banking',
      reason:
        'Billing statement error and unauthorized/undelivered charge disputed in writing within 60 days pursuant to 15 U.S.C. § 1666.',
      codes: 'Disputed Merchant Transaction ID',
    },
    {
      label: 'Undisclosed Telecom Surcharge (FCC — 47 C.F.R. § 64.2401)',
      category: 'Cable & Internet',
      reason:
        'Unnotified price escalation, unreturned-modem error, or unauthorized add-on surcharges pursuant to FCC Truth-in-Billing (47 C.F.R. § 64.2401).',
      codes: 'Broadcast TV Surcharge & Modem Rental',
    },
    {
      label: 'Public Utility Meter & Tariff Audit (State PUC Rules)',
      category: 'Electric, Gas & Water Utility',
      reason:
        'Discrepancy between actual meter consumption and estimated billing charges; requesting tariff rate audit under State PUC standards.',
      codes: 'Meter # / Tariff Schedule ID',
    },
    {
      label: 'Tenant Security Deposit Return & Itemization Demand',
      category: 'Security Deposit',
      reason:
        'Failure to return residential security deposit or provide lawful itemized receipts within the state statutory return deadline.',
      codes: 'State Security Deposit Statute',
    },
  ];

  const handleGenerateLetter = () => {
    // 100% client-side — zero network requests, zero PII ever leaves the browser
    const generated = buildClientSideDisputeLetter({
      consumerName,
      accountNumber,
      providerName,
      billDate,
      disputeAmount,
      disputeReason,
      cptCodes,
      billType,
    });
    setLetterData(generated);
  };

  const copyLetter = () => {
    if (!letterData) return;
    const fullText = `SUBJECT: ${letterData.subjectLine}\n\n${letterData.letterBody}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {!hideHero && (
        <div className="bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-3 no-print">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            100% Client-Side Self-Advocacy Drafting Tool · Zero Server Uploads
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Consumer Bill Dispute Letter Generator
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            Draft print-ready written dispute notices citing the exact federal or state statute that governs your bill category—including the No Surprises Act, FDCPA, FCBA, FCC Truth-in-Billing, IRC § 501(r), State PUC tariffs, and tenant security deposit statutes.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4 no-print">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Dispute Parameters
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
              <Lock className="w-3 h-3" />
              Local only
            </span>
          </div>

          {!initialReason && (
            <div>
              <span className="block text-xs font-semibold text-slate-400 mb-2">
                Quick Statutory Presets
              </span>
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
                    className="w-full text-left px-3 py-2 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-[11px] font-medium text-slate-300 transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="dispute-bill-type" className="block text-xs font-semibold text-slate-300 mb-1">
              Dispute Category / Bill Type
            </label>
            <select
              id="dispute-bill-type"
              value={billType}
              onChange={(e) => setBillType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Medical & Hospital">Medical &amp; Hospital (No Surprises Act / IRC § 501(r))</option>
              <option value="Cable & Internet">Cable, Internet &amp; Phone (FCC Truth-in-Billing)</option>
              <option value="Electric, Gas & Water Utility">Public Utility (Electric, Gas, Water — State PUC)</option>
              <option value="Credit & Banking">Credit Card &amp; Banking (Fair Credit Billing Act)</option>
              <option value="Collections">Debt Collection Agency (FDCPA Validation)</option>
              <option value="Security Deposit">Tenant Security Deposit Demand (State Statute)</option>
              <option value="General Consumer Bill">General Consumer Invoice / Contractual Dispute</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="dispute-name" className="block text-xs font-semibold text-slate-400 mb-1">
                Your Full Name
              </label>
              <input
                id="dispute-name"
                type="text"
                value={consumerName}
                onChange={(e) => setConsumerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label htmlFor="dispute-account" className="block text-xs font-semibold text-slate-400 mb-1">
                Account / Invoice #
              </label>
              <input
                id="dispute-account"
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="dispute-provider" className="block text-xs font-semibold text-slate-400 mb-1">
                Company / Hospital / Landlord
              </label>
              <input
                id="dispute-provider"
                type="text"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label htmlFor="dispute-amount" className="block text-xs font-semibold text-slate-400 mb-1">
                Disputed Amount ($)
              </label>
              <input
                id="dispute-amount"
                type="text"
                value={disputeAmount}
                onChange={(e) => setDisputeAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="dispute-date" className="block text-xs font-semibold text-slate-400 mb-1">
                Statement / Move-Out Date
              </label>
              <input
                id="dispute-date"
                type="text"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label htmlFor="dispute-codes" className="block text-xs font-semibold text-slate-400 mb-1">
                CPT / Statute / Ref Codes
              </label>
              <input
                id="dispute-codes"
                type="text"
                value={cptCodes}
                onChange={(e) => setCptCodes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="dispute-reason" className="block text-xs font-semibold text-slate-400 mb-1">
              Dispute Factual &amp; Statutory Grounds
            </label>
            <textarea
              id="dispute-reason"
              rows={3}
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerateLetter}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
          >
            <Scale className="w-4 h-4 text-slate-950" />
            <span>Generate Printable Dispute Letter</span>
          </button>
        </div>

        {/* Right Output Document (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {!letterData && (
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-8 text-center space-y-3 no-print">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 mx-auto flex items-center justify-center">
                <Scale className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-base font-bold text-white">Generate Your Formal Dispute Notice</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Enter your factual details on the left and click generate. Your formal letter is assembled 100% locally in your browser—ready to copy or print for USPS Certified Mail.
              </p>
            </div>
          )}

          {letterData && (
            <div className="bg-slate-900 rounded-2xl border border-indigo-500/30 p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 no-print">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Formatted Statutory Dispute Notice
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyLetter}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save PDF</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-indigo-300">
                SUBJECT: {letterData.subjectLine}
              </div>

              <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-xl font-serif text-sm leading-relaxed border border-slate-200 whitespace-pre-wrap select-text">
                {letterData.letterBody}
              </div>

              <div className="space-y-3 pt-1 no-print">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Statutory Timeline &amp; Deadlines</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{letterData.legalDeadlines}</p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Recommended Certified Mail Procedure
                  </span>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300">
                    {letterData.certifiedMailInstructions.map((ins, idx) => (
                      <li key={idx}>{ins}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 text-xs text-slate-400 space-y-1 no-print">
        <div className="flex items-center gap-1.5 font-bold text-slate-200 text-[11px] uppercase tracking-wider">
          <Scale className="w-3.5 h-3.5 text-indigo-400" />
          <span>Informational Self-Advocacy Notice</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          All dispute notices are drafted 100% locally in your web browser—no names, account numbers, or dollar figures are sent to any server. ItsMyBill is an informational consumer utility, not a law firm, and does not provide legal advice or guarantee outcomes. Verify all dates, statutes, and amounts before mailing.
        </p>
      </div>
    </div>
  );
};
