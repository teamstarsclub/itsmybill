import React, { useState, useEffect } from 'react';
import { 
  PiggyBank, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  Trash2, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  Zap, 
  Activity,
  Layers,
  Award,
  Copy,
  Check
} from 'lucide-react';

export interface TrackedBill {
  id: string;
  provider: string;
  category: 'telecom' | 'mobile' | 'medical' | 'utilities' | 'insurance' | 'subscription' | 'other';
  frequency: 'monthly' | 'one_time';
  beforeAmount: number;
  afterAmount: number;
  methodUsed: string;
  date: string;
  notes?: string;
}

const DEFAULT_BILLS: TrackedBill[] = [
  {
    id: 'demo-1',
    provider: 'Xfinity / Comcast Internet',
    category: 'telecom',
    frequency: 'monthly',
    beforeAmount: 145.00,
    afterAmount: 69.99,
    methodUsed: 'AI Line-Item Fee Auditor Script',
    date: '2026-09-15',
    notes: 'Removed modem rental fee ($15/mo) and locked 24-month retention rate.'
  },
  {
    id: 'demo-2',
    provider: 'Regional Medical Center ER',
    category: 'medical',
    frequency: 'one_time',
    beforeAmount: 2850.00,
    afterAmount: 950.00,
    methodUsed: 'No Surprises Act Statutory Dispute',
    date: '2026-08-20',
    notes: 'Disputed out-of-network emergency facility fees under 42 U.S.C. § 300gg-111.'
  },
  {
    id: 'demo-3',
    provider: 'Verizon Wireless (3 Lines)',
    category: 'mobile',
    frequency: 'monthly',
    beforeAmount: 215.00,
    afterAmount: 160.00,
    methodUsed: 'Benchmark Retention Call',
    date: '2026-09-02',
    notes: 'Switched to modern shared bucket and applied $10/line autopay discount.'
  }
];

const CATEGORY_LABELS: Record<TrackedBill['category'], { label: string; color: string }> = {
  telecom: { label: 'Cable & Internet', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  mobile: { label: 'Mobile Wireless', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  medical: { label: 'Medical & Hospital', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  utilities: { label: 'Electric, Gas & Water', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  insurance: { label: 'Auto & Home Insurance', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  subscription: { label: 'Digital Subscriptions', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  other: { label: 'Other Billed Service', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' }
};

interface SavingsTrackerProps {
  onNavigateToAudit?: () => void;
  onNavigateToDispute?: () => void;
}

export const SavingsTracker: React.FC<SavingsTrackerProps> = ({
  onNavigateToAudit,
  onNavigateToDispute
}) => {
  // Load from localStorage or defaults
  const [bills, setBills] = useState<TrackedBill[]>(() => {
    try {
      const saved = localStorage.getItem('itsmybill_savings_tracker');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved bills:', e);
    }
    return DEFAULT_BILLS;
  });

  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [provider, setProvider] = useState('');
  const [category, setCategory] = useState<TrackedBill['category']>('telecom');
  const [frequency, setFrequency] = useState<TrackedBill['frequency']>('monthly');
  const [beforeAmount, setBeforeAmount] = useState('');
  const [afterAmount, setAfterAmount] = useState('');
  const [methodUsed, setMethodUsed] = useState('AI Line-Item Fee Auditor Script');
  const [notes, setNotes] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('itsmybill_savings_tracker', JSON.stringify(bills));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [bills]);

  // Handle Form Submission
  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    const bAmt = parseFloat(beforeAmount);
    const aAmt = parseFloat(afterAmount);

    if (!provider.trim() || isNaN(bAmt) || isNaN(aAmt) || bAmt <= 0) {
      return;
    }

    const newBill: TrackedBill = {
      id: 'bill-' + Date.now(),
      provider: provider.trim(),
      category,
      frequency,
      beforeAmount: bAmt,
      afterAmount: Math.max(0, aAmt),
      methodUsed,
      date: new Date().toISOString().split('T')[0],
      notes: notes.trim() || undefined
    };

    setBills([newBill, ...bills]);
    // Reset form
    setProvider('');
    setBeforeAmount('');
    setAfterAmount('');
    setNotes('');
    setIsAdding(false);
  };

  const handleDeleteBill = (id: string) => {
    setBills(bills.filter(b => b.id !== id));
  };

  const handleResetDefaults = () => {
    setBills(DEFAULT_BILLS);
  };

  // Calculations
  const monthlyRecurringBills = bills.filter(b => b.frequency === 'monthly');
  const oneTimeBills = bills.filter(b => b.frequency === 'one_time');

  const monthlyBefore = monthlyRecurringBills.reduce((acc, b) => acc + b.beforeAmount, 0);
  const monthlyAfter = monthlyRecurringBills.reduce((acc, b) => acc + b.afterAmount, 0);
  const monthlySaved = Math.max(0, monthlyBefore - monthlyAfter);

  const oneTimeBefore = oneTimeBills.reduce((acc, b) => acc + b.beforeAmount, 0);
  const oneTimeAfter = oneTimeBills.reduce((acc, b) => acc + b.afterAmount, 0);
  const oneTimeSaved = Math.max(0, oneTimeBefore - oneTimeAfter);

  // First Year Realized Total Savings
  const firstYearTotalSaved = (monthlySaved * 12) + oneTimeSaved;

  // Total Lifetime Before vs After in first year
  const firstYearGrossBefore = (monthlyBefore * 12) + oneTimeBefore;
  const averagePercentageCut = firstYearGrossBefore > 0 
    ? Math.round((firstYearTotalSaved / firstYearGrossBefore) * 100) 
    : 0;

  // 5-Year Compounded Wealth Growth (Assuming monthly cashflow invested at standard 7% annual index return)
  // Future value of monthly annuity: PMT * (((1 + r/n)^(n*t) - 1) / (r/n)) + LumpSum * (1 + r)^t
  const r = 0.07;
  const n = 12;
  const t = 5;
  const ratePerMonth = r / n;
  const months = n * t;
  const compoundedMonthlySavings = ratePerMonth > 0 
    ? monthlySaved * ((Math.pow(1 + ratePerMonth, months) - 1) / ratePerMonth) 
    : monthlySaved * 60;
  const compoundedOneTimeSavings = oneTimeSaved * Math.pow(1 + r, t);
  const total5YearCompoundedWealth = Math.round(compoundedMonthlySavings + compoundedOneTimeSavings);

  // Copy Victory Share Summary
  const handleCopySummary = () => {
    const text = `🎉 My ItsMyBill Savings Victory Report:
💰 First-Year Savings: $${firstYearTotalSaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
📉 Ongoing Monthly Relief: $${monthlySaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/month
⚡ Average Bill Reduction: ${averagePercentageCut}%

Bills renegotiated:
${bills.map(b => `• ${b.provider}: $${b.beforeAmount} ➔ $${b.afterAmount} (${b.frequency === 'monthly' ? '/mo' : 'one-time'}) via ${b.methodUsed}`).join('\n')}

Audited 100% free with no bank login at https://itsmybill.com`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <PiggyBank className="w-3.5 h-3.5" />
              <span>Realized ROI & Bill Reduction Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Track Your Before & After Savings
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every dollar saved from eliminated junk fees, reduced cable rates, or disputed hospital charges adds directly to your wealth. Log your victories below to calculate your ongoing cashflow boost.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>{isAdding ? 'Cancel Entry' : 'Log Won Savings'}</span>
            </button>
            <button
              onClick={handleCopySummary}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Share Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: 1st-Year Realized Savings */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">1st-Year Total Saved</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            ${firstYearTotalSaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 pt-1 font-medium">
            <TrendingDown className="w-3 h-3" />
            <span>Recurring monthly + one-time wipes</span>
          </p>
        </div>

        {/* KPI 2: Ongoing Monthly Boost */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Monthly Cashflow Boost</span>
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-teal-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal-400">
            +${monthlySaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-xs font-semibold text-slate-400">/mo</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Permanent monthly recurring budget relief
          </p>
        </div>

        {/* KPI 3: Average Reduction % */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Avg Bill Slashed</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-400">
            {averagePercentageCut}%
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Percentage removed across {bills.length} bills
          </p>
        </div>

        {/* KPI 4: 5-Year Compounded Wealth */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">5-Yr Compounded Value</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Award className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-300">
            ${total5YearCompoundedWealth.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            If monthly savings invested @ 7% S&P 500
          </p>
        </div>
      </div>

      {/* Add New Bill Form (Toggleable) */}
      {isAdding && (
        <form onSubmit={handleAddBill} className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Log a Won Renegotiation or Disputed Charge</h3>
            </div>
            <span className="text-xs text-slate-400">Takes 30 seconds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Provider / Biller Name *
              </label>
              <input
                type="text"
                required
                value={provider}
                onChange={e => setProvider(e.target.value)}
                placeholder="e.g. Spectrum, Verizon, Baptist Health"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bill Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TrackedBill['category'])}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="telecom">Cable & Internet</option>
                <option value="mobile">Mobile Wireless</option>
                <option value="medical">Medical & Hospital</option>
                <option value="utilities">Electric, Gas & Water</option>
                <option value="insurance">Auto & Home Insurance</option>
                <option value="subscription">Digital Subscriptions</option>
                <option value="other">Other Service</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Billing Frequency
              </label>
              <select
                value={frequency}
                onChange={e => setFrequency(e.target.value as TrackedBill['frequency'])}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="monthly">Monthly Recurring (e.g. Cable / Mobile)</option>
                <option value="one_time">One-Time Lump Sum (e.g. Medical ER Bill)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Original Bill (Before) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={beforeAmount}
                  onChange={e => setBeforeAmount(e.target.value)}
                  placeholder="145.00"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                New Bill (After Reduction) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={afterAmount}
                  onChange={e => setAfterAmount(e.target.value)}
                  placeholder="69.99"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Method / Strategy Used
              </label>
              <select
                value={methodUsed}
                onChange={e => setMethodUsed(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="AI Line-Item Fee Auditor Script">AI Line-Item Fee Auditor Script</option>
                <option value="No Surprises Act Statutory Dispute">No Surprises Act Statutory Dispute</option>
                <option value="Fair Credit Billing Act Letter">Fair Credit Billing Act Letter</option>
                <option value="State Benchmark Retention Call">State Benchmark Retention Call</option>
                <option value="Equipment Rental Removal">Equipment Rental Removal</option>
                <option value="Loyalty Promotion Retention">Loyalty Promotion Retention</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Resolution Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Agent waived broadcast fee and gave $20 loyalty credit"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-md"
            >
              Save Victory
            </button>
          </div>
        </form>
      )}

      {/* Main Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Bill Cards List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Tracked Reductions ({bills.length})</span>
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetDefaults}
                className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset to default examples"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Demo Bills</span>
              </button>
            </div>
          </div>

          {bills.length === 0 ? (
            <div className="bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 p-8 text-center space-y-3">
              <PiggyBank className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-semibold text-white">No Savings Logged Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Use our AI Bill Auditor or Dispute Letter generator, then log your before and after totals to track your monthly cashflow wins.
              </p>
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Your First Bill</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {bills.map(b => {
                const diff = Math.max(0, b.beforeAmount - b.afterAmount);
                const percentCut = b.beforeAmount > 0 
                  ? Math.round((diff / b.beforeAmount) * 100) 
                  : 0;
                const isMonthly = b.frequency === 'monthly';

                return (
                  <div
                    key={b.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 space-y-4 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-white">{b.provider}</h3>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${CATEGORY_LABELS[b.category].color}`}>
                            {CATEGORY_LABELS[b.category].label}
                          </span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {isMonthly ? 'Monthly Recurring' : 'One-Time Dispute'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2">
                          <span>Via {b.methodUsed}</span>
                          <span>•</span>
                          <span>{b.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Total Saved</div>
                          <div className="text-base font-black text-emerald-400">
                            -${diff.toFixed(2)}
                            <span className="text-xs font-semibold text-slate-400">
                              {isMonthly ? '/mo' : ''}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteBill(b.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Before vs After Visual Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <span>Before:</span>
                          <span className="line-through text-slate-500 font-mono">${b.beforeAmount.toFixed(2)}</span>
                          <ArrowRight className="w-3 h-3 text-slate-600" />
                          <span className="text-white font-bold font-mono">After: ${b.afterAmount.toFixed(2)}</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          -{percentCut}% Cut
                        </span>
                      </div>

                      {/* Progress Bar comparison */}
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
                        <div 
                          className="h-full bg-slate-600 rounded-full transition-all"
                          style={{ width: `${b.beforeAmount > 0 ? Math.min(100, Math.max(0, (b.afterAmount / b.beforeAmount) * 100)) : 0}%` }}
                          title={`Remaining: $${b.afterAmount}`}
                        />
                        <div 
                          className="h-full bg-emerald-400 rounded-full transition-all ml-0.5"
                          style={{ width: `${b.beforeAmount > 0 ? Math.min(100, Math.max(0, (diff / b.beforeAmount) * 100)) : 0}%` }}
                          title={`Saved: $${diff}`}
                        />
                      </div>
                    </div>

                    {b.notes && (
                      <div className="text-xs text-slate-400 bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80">
                        <strong className="text-slate-300">Notes:</strong> {b.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Smart Action Cards & Projections */}
        <div className="space-y-6">
          {/* Quick Action Navigator */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Need More Reductions?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use our automated AI tools to audit your bills and draft legal dispute notices before adding your savings here.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={onNavigateToAudit}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-white flex items-center justify-between transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Run AI Bill Fee Auditor</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </button>

              <button
                onClick={onNavigateToDispute}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-white flex items-center justify-between transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>Draft Legal Dispute Letter</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </button>
            </div>
          </div>

          {/* S&P 500 Compounding Infobox */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <TrendingDown className="w-4 h-4 text-purple-400 rotate-180" />
              <span>The Compounding Power of Bill Cuts</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Cutting <strong>${monthlySaved.toFixed(0)}/mo</strong> from utility companies doesn't just save cash today—if redirected into a passive broad-market index fund (7% historical average), it turns into:
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1 text-center font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-sans">3 Years</span>
                <span className="text-sm font-bold text-white">
                  ${Math.round(monthlySaved * ((Math.pow(1 + ratePerMonth, 36) - 1) / ratePerMonth) + oneTimeSaved * Math.pow(1 + r, 3)).toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-sans">5 Years</span>
                <span className="text-sm font-bold text-purple-300">
                  ${total5YearCompoundedWealth.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 italic">
              Calculation assumes monthly dollar-cost averaging at standard 7% annual inflation-adjusted equity return.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
