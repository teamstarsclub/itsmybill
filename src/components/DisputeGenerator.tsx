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
      reason: 'Out-of-network balance billing for emergency services at an in-network facility, strictly prohibited under the federal No Surprises Act (42 U.S.C. § 300gg-111).',
      codes: 'CPT 99284 / Rev Code 0450',
    },
    {
      label: 'Expired Promotional Rate Hike (No Prior Notice)',
      category: 'Cable & Internet',
      reason: 'Unnotified price escalation exceeding contractual promotional agreement without the required 30-day billing notice.',
      codes: 'Broadcast TV Fee & Modem Rental',
    },
    {
      label: 'Unbundled Hospital Lab & Pharmacy Charges',
      category: 'Medical & Hospital',
      reason: 'Improper unbundling of routine emergency supplies (IV fluids/saline) and diagnostic panels that are already incorporated into the primary treatment code.',
      codes: 'CPT 80053, CPT 99283',
    },
    {
      label: 'Unauthorized Phone Carrier Insurance/Add-on',
      category: 'Mobile Phone',
      reason: 'Unauthorized cramming of third-party device protection and value-added subscriptions without explicit opt-in consent (FCC Cramming Rules).',
      codes: 'Carrier Device Protection Surcharge',
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

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to generate letter');

      setLetterData(json.data);
    } catch (e: any) {
      console.error(e);
      alert('Failed to generate letter: ' + e.message);
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
            Statutory Consumer Protection • Fair Credit Billing Act & No Surprises Act
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Official <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-300">Bill Dispute Letter</span> Generator
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Billing departments routinely dismiss phone complaints, but federal law (FCBA 15 U.S.C. § 1666 and No Surprises Act 42 U.S.C. § 300gg-111) forces them to pause collections and conduct an itemized audit once you submit a written dispute. Generate yours in 10 seconds.
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
                    Statutory Timelines: {letterData.legalDeadlines || '30 Days to acknowledge, 90 days to resolve'}
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Under 15 U.S.C. § 1666, creditors cannot report you to credit bureaus or take collection action while this dispute is formally pending.
                  </p>
                </div>

                {letterData.certifiedMailInstructions && letterData.certifiedMailInstructions.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Certified Mail Instructions
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
    </div>
  );
};
