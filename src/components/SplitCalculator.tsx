import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  DollarSign,
  Copy,
  Check,
  Share2,
  Plus,
  Trash2,
  Scale,
  Calculator,
} from 'lucide-react';
import { EmbedCalculatorButton } from './EmbedModal';

interface ItemEntry {
  id: string;
  name: string;
  price: number;
  assignedTo: string[];
}

interface RoommateEntry {
  id: string;
  name: string;
  monthlyIncome: number;
}

export interface SplitCalculatorProps {
  defaultMode?: 'equal' | 'income' | 'itemized';
  lockedMode?: boolean;
  hideHero?: boolean;
  embedded?: boolean;
  onModeLinkClick?: (path: string) => void;
}

export const SplitCalculator: React.FC<SplitCalculatorProps> = ({
  defaultMode = 'equal',
  lockedMode = false,
  hideHero = false,
  embedded = false,
  onModeLinkClick,
}) => {
  const [splitMode, setSplitMode] = useState<'equal' | 'income' | 'itemized'>(defaultMode);

  useEffect(() => {
    setSplitMode(defaultMode);
  }, [defaultMode]);

  // Equal Mode State
  const [billAmount, setBillAmount] = useState<number>(148.5);
  const [taxPercent, setTaxPercent] = useState<number>(8.5);
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [roundUp, setRoundUp] = useState<boolean>(false);

  // Income Mode State
  const [utilityTotal, setUtilityTotal] = useState<number>(3200);
  const [roommates, setRoommates] = useState<RoommateEntry[]>([
    { id: '1', name: 'Alex', monthlyIncome: 6500 },
    { id: '2', name: 'Jordan', monthlyIncome: 4200 },
    { id: '3', name: 'Taylor', monthlyIncome: 2800 },
  ]);

  // Itemized Mode State
  const [itemPeople, setItemPeople] = useState<string[]>(['Sarah', 'David', 'Maya']);
  const [newDinerName, setNewDinerName] = useState<string>('');
  const [items, setItems] = useState<ItemEntry[]>([
    { id: '1', name: 'Truffle Pasta', price: 28, assignedTo: ['Sarah'] },
    { id: '2', name: 'Ribeye Steak', price: 46, assignedTo: ['David'] },
    { id: '3', name: 'Grilled Salmon', price: 34, assignedTo: ['Maya'] },
    { id: '4', name: 'Shared Appetizer Platter', price: 24, assignedTo: ['Sarah', 'David', 'Maya'] },
    { id: '5', name: 'Bottle of Wine', price: 55, assignedTo: ['Sarah', 'David'] },
  ]);
  const [itemizedTaxPct, setItemizedTaxPct] = useState<number>(8.875);
  const [itemizedTipPct, setItemizedTipPct] = useState<number>(20);

  const [copiedSummary, setCopiedSummary] = useState(false);

  // Read clean URL params if shared
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has('total')) {
        const total = parseFloat(params.get('total') || '');
        const tip = parseFloat(params.get('tip') || '');
        const people = parseInt(params.get('people') || '', 10);
        if (!isNaN(total)) setBillAmount(total);
        if (!isNaN(tip)) setTipPercent(tip);
        if (!isNaN(people) && people > 0) setPeopleCount(people);
      }
    } catch {
      // ignore
    }
  }, []);

  // Equal Mode Calculations
  const equalCalc = useMemo(() => {
    const rawBill = Number(billAmount) || 0;
    const taxAmt = (rawBill * (Number(taxPercent) || 0)) / 100;
    const tipAmt = (rawBill * (Number(tipPercent) || 0)) / 100;
    const grandTotal = rawBill + taxAmt + tipAmt;
    const count = Math.max(1, peopleCount);
    let perPerson = grandTotal / count;

    if (roundUp) {
      perPerson = Math.ceil(perPerson);
    }

    return {
      rawBill,
      taxAmt,
      tipAmt,
      grandTotal,
      perPerson: Number(perPerson.toFixed(2)),
      effectiveTotal: perPerson * count,
    };
  }, [billAmount, taxPercent, tipPercent, peopleCount, roundUp]);

  // Income Mode Calculations with exact cent reconciliation
  const incomeCalc = useMemo(() => {
    const totalIncome = roommates.reduce((sum, r) => sum + (Number(r.monthlyIncome) || 0), 0);
    const totalBill = Number(utilityTotal) || 0;

    const rawShares = roommates.map((r) => {
      const inc = Number(r.monthlyIncome) || 0;
      const pct = totalIncome > 0 ? inc / totalIncome : roommates.length > 0 ? 1 / roommates.length : 0;
      const owedCents = Math.round(totalBill * pct * 100);
      return {
        ...r,
        pct: (pct * 100).toFixed(1),
        owedCents,
        owed: (owedCents / 100).toFixed(2),
      };
    });

    const totalAllocatedCents = rawShares.reduce((sum, r) => sum + r.owedCents, 0);
    const billCents = Math.round(totalBill * 100);
    const diffCents = billCents - totalAllocatedCents;

    if (diffCents !== 0 && rawShares.length > 0) {
      let maxIdx = 0;
      for (let i = 1; i < rawShares.length; i++) {
        if (rawShares[i].monthlyIncome > rawShares[maxIdx].monthlyIncome) {
          maxIdx = i;
        }
      }
      rawShares[maxIdx].owedCents += diffCents;
      rawShares[maxIdx].owed = (rawShares[maxIdx].owedCents / 100).toFixed(2);
    }

    return rawShares;
  }, [utilityTotal, roommates]);

  // Itemized Mode Calculations
  const itemizedCalc = useMemo(() => {
    const subtotal = items.reduce((acc, it) => acc + (Number(it.price) || 0), 0);
    const taxTotal = (subtotal * (Number(itemizedTaxPct) || 0)) / 100;
    const tipTotal = (subtotal * (Number(itemizedTipPct) || 0)) / 100;
    const multiplier = subtotal > 0 ? (subtotal + taxTotal + tipTotal) / subtotal : 1;

    const personTotals: Record<string, { foodSubtotal: number; grandTotal: number }> = {};
    itemPeople.forEach((p) => {
      personTotals[p] = { foodSubtotal: 0, grandTotal: 0 };
    });

    items.forEach((item) => {
      const assigned = item.assignedTo.filter((p) => itemPeople.includes(p));
      if (assigned.length > 0) {
        const splitCost = item.price / assigned.length;
        assigned.forEach((p) => {
          if (!personTotals[p]) personTotals[p] = { foodSubtotal: 0, grandTotal: 0 };
          personTotals[p].foodSubtotal += splitCost;
        });
      }
    });

    Object.keys(personTotals).forEach((p) => {
      personTotals[p].grandTotal = personTotals[p].foodSubtotal * multiplier;
    });

    return {
      subtotal,
      taxTotal,
      tipTotal,
      grandTotal: subtotal + taxTotal + tipTotal,
      personTotals,
    };
  }, [items, itemPeople, itemizedTaxPct, itemizedTipPct]);

  const handleAddDiner = () => {
    const trimmed = newDinerName.trim();
    if (trimmed && !itemPeople.includes(trimmed)) {
      setItemPeople([...itemPeople, trimmed]);
      setNewDinerName('');
    }
  };

  const copyBreakdown = () => {
    let text = `ItsMyBill.com — Bill Split Breakdown\n`;
    if (splitMode === 'equal') {
      text += `Total Bill: $${equalCalc.grandTotal.toFixed(2)} (inc. $${equalCalc.tipAmt.toFixed(2)} tip)\n`;
      text += `Split among ${peopleCount} people: $${equalCalc.perPerson.toFixed(2)} each\n`;
      text += `https://www.itsmybill.com/bill-splitter/`;
    } else if (splitMode === 'income') {
      text += `Total Shared Bill: $${Number(utilityTotal).toFixed(2)}\n`;
      text += `Income-Fair Proportional Split:\n`;
      incomeCalc.forEach((r) => {
        text += `- ${r.name}: $${r.owed} (${r.pct}% based on $${r.monthlyIncome}/mo)\n`;
      });
      text += `https://www.itsmybill.com/income-based-bill-splitter/`;
    } else {
      text += `Itemized Receipt Total: $${itemizedCalc.grandTotal.toFixed(2)}\n`;
      Object.entries(itemizedCalc.personTotals).forEach(([p, val]) => {
        text += `- ${p}: $${val.grandTotal.toFixed(2)} (Food: $${val.foodSubtotal.toFixed(2)})\n`;
      });
      text += `https://www.itsmybill.com/itemized-receipt-splitter/`;
    }

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const updateUrlShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?total=${billAmount}&tip=${tipPercent}&people=${peopleCount}`;
    navigator.clipboard.writeText(url);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const modeTabs: { id: 'equal' | 'income' | 'itemized'; label: string; href: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'equal', label: 'Equal Dinner Split', href: '/bill-splitter/', icon: Users },
    { id: 'income', label: 'Income-Fair Split', href: '/income-based-bill-splitter/', icon: Scale },
    { id: 'itemized', label: 'Itemized Receipt', href: '/itemized-receipt-splitter/', icon: Calculator },
  ];

  return (
    <div className="space-y-6">
      {!hideHero && !embedded && (
        <div className="bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                100% Free · Client-Side Cent-Exact Math · Zero Sign-Up
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Bill &amp; Tip Splitter Calculator
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Split restaurant checks, group tabs, and roommate household bills fairly with equal division, proportional income equity, or itemized dish breakdowns.
              </p>
            </div>
            <EmbedCalculatorButton
              title="ItsMyBill Income-Based Bill Splitter"
              embedPath="/embed/income-bill-splitter/"
              sourcePath="/income-based-bill-splitter/"
              sourceLabel="Income-Based Bill Splitter"
            />
          </div>

          {!lockedMode && (
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950/80 rounded-xl border border-slate-800 w-fit">
              {modeTabs.map((tab) => {
                const Icon = tab.icon;
                const active = splitMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      if (onModeLinkClick) {
                        onModeLinkClick(tab.href);
                      } else {
                        setSplitMode(tab.id);
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Input Section (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-5">
          {splitMode === 'equal' && (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  Equal Group Tab &amp; Tip Split
                </h2>
                <span className="text-xs text-slate-400">Pre-tax tip calculation</span>
              </div>

              <div>
                <label htmlFor="equal-bill-amount" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Bill Subtotal (Before Tip)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  <input
                    id="equal-bill-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={billAmount || ''}
                    onChange={(e) => setBillAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-2xl font-bold text-white tabular-nums focus:outline-none focus:border-emerald-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="equal-tip-range" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Tip Percentage
                  </label>
                  <span className="text-sm font-bold text-emerald-400 tabular-nums">
                    {tipPercent}% (${equalCalc.tipAmt.toFixed(2)})
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[10, 15, 18, 20, 25].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setTipPercent(pct)}
                      className={`py-2 rounded-lg text-sm font-bold tabular-nums transition-colors cursor-pointer ${
                        tipPercent === pct
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
                <div className="mt-2.5 flex items-center gap-3">
                  <input
                    id="equal-tip-range"
                    type="range"
                    min="0"
                    max="40"
                    step="1"
                    value={tipPercent}
                    onChange={(e) => setTipPercent(parseInt(e.target.value, 10) || 0)}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <span className="text-xs text-slate-400 w-12 text-right">Custom</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="equal-tax-pct" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Sales Tax (%)
                  </label>
                  <div className="relative">
                    <input
                      id="equal-tax-pct"
                      type="number"
                      step="0.1"
                      min="0"
                      value={taxPercent}
                      onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-semibold tabular-nums focus:outline-none focus:border-emerald-500"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-xs">
                      %
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="equal-people-count" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Number of People
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                      className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 font-bold text-lg flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      id="equal-people-count"
                      type="number"
                      min="1"
                      value={peopleCount}
                      onChange={(e) => setPeopleCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full text-center bg-slate-950 border border-slate-800 rounded-xl py-2 text-lg font-bold text-white tabular-nums focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setPeopleCount(peopleCount + 1)}
                      className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 font-bold text-lg flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={roundUp}
                  onChange={(e) => setRoundUp(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-800"
                />
                <span className="text-xs sm:text-sm text-slate-300 font-medium">
                  Round up each person&rsquo;s share to the next whole dollar
                </span>
              </label>
            </>
          )}

          {splitMode === 'income' && (
            <>
              <div className="pb-3 border-b border-slate-800">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  Income-Proportional Expense Splitter
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Allocates shared rent and utility bills proportionally by monthly take-home pay with cent-exact reconciliation.
                </p>
              </div>

              <div>
                <label htmlFor="income-bill-total" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Total Shared Monthly Expense ($)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  <input
                    id="income-bill-total"
                    type="number"
                    min="0"
                    value={utilityTotal || ''}
                    onChange={(e) => setUtilityTotal(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-2xl font-bold text-white tabular-nums focus:outline-none focus:border-emerald-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Household Members &amp; Monthly Take-Home Income
                </span>
                {roommates.map((r, idx) => (
                  <div key={r.id} className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-emerald-400 tabular-nums w-6">#{idx + 1}</span>
                    <input
                      type="text"
                      aria-label={`Member ${idx + 1} name`}
                      value={r.name}
                      onChange={(e) => {
                        const next = [...roommates];
                        next[idx] = { ...next[idx], name: e.target.value };
                        setRoommates(next);
                      }}
                      className="bg-transparent border-b border-slate-800 focus:border-emerald-400 text-white font-medium text-sm px-1 py-1 w-28 sm:w-36 focus:outline-none"
                      placeholder="Name"
                    />
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-500 text-xs">$</span>
                      <input
                        type="number"
                        min="0"
                        aria-label={`${r.name} monthly take-home income`}
                        value={r.monthlyIncome || ''}
                        onChange={(e) => {
                          const next = [...roommates];
                          next[idx] = { ...next[idx], monthlyIncome: parseFloat(e.target.value) || 0 };
                          setRoommates(next);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-6 pr-3 py-1.5 text-sm text-white font-semibold tabular-nums focus:outline-none focus:border-emerald-500"
                        placeholder="Monthly net income"
                      />
                    </div>
                    {roommates.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setRoommates(roommates.filter((_, i) => i !== idx))}
                        aria-label={`Remove ${r.name}`}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setRoommates([
                      ...roommates,
                      { id: Date.now().toString(), name: `Member ${roommates.length + 1}`, monthlyIncome: 3500 },
                    ])
                  }
                  className="w-full py-2.5 border border-dashed border-slate-700 hover:border-emerald-500 rounded-xl text-xs font-semibold text-slate-300 hover:text-emerald-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Household Member
                </button>
              </div>
            </>
          )}

          {splitMode === 'itemized' && (
            <>
              <div className="pb-3 border-b border-slate-800">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  Itemized Receipt &amp; Proportional Tax/Tip Split
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Assign individual and shared dishes below. Sales tax and tip scale strictly with each diner&rsquo;s subtotal.
                </p>
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Diners at the Table
                </span>
                <div className="flex flex-wrap gap-2 items-center">
                  {itemPeople.map((name, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200"
                    >
                      {name}
                      {itemPeople.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setItemPeople(itemPeople.filter((_, i) => i !== idx))}
                          aria-label={`Remove ${name}`}
                          className="text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 max-w-xs pt-1">
                  <input
                    type="text"
                    value={newDinerName}
                    onChange={(e) => setNewDinerName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDiner();
                      }
                    }}
                    placeholder="Add diner name..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddDiner}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Dishes &amp; Shared Items
                </span>
                {items.map((it, idx) => (
                  <div key={it.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        aria-label={`Item ${idx + 1} name`}
                        value={it.name}
                        onChange={(e) => {
                          const n = [...items];
                          n[idx] = { ...n[idx], name: e.target.value };
                          setItems(n);
                        }}
                        className="bg-transparent border-b border-slate-800 focus:border-emerald-400 text-white font-medium text-sm flex-1 focus:outline-none"
                      />
                      <div className="relative w-28">
                        <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-slate-500 text-xs">$</span>
                        <input
                          type="number"
                          step="0.01"
                          aria-label={`${it.name} price`}
                          value={it.price || ''}
                          onChange={(e) => {
                            const n = [...items];
                            n[idx] = { ...n[idx], price: parseFloat(e.target.value) || 0 };
                            setItems(n);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-6 pr-2 py-1 text-sm text-white font-semibold tabular-nums focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setItems(items.filter((_, i) => i !== idx))}
                        aria-label={`Remove ${it.name}`}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1 items-center">
                      <span className="text-[11px] text-slate-400 mr-1">Shared by:</span>
                      {itemPeople.map((person) => {
                        const isAssigned = it.assignedTo.includes(person);
                        return (
                          <button
                            key={person}
                            type="button"
                            onClick={() => {
                              const n = [...items];
                              n[idx] = {
                                ...n[idx],
                                assignedTo: isAssigned
                                  ? it.assignedTo.filter((p) => p !== person)
                                  : [...it.assignedTo, person],
                              };
                              setItems(n);
                            }}
                            className={`text-[11px] px-2.5 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                              isAssigned
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-900 text-slate-400 border border-slate-800'
                            }`}
                          >
                            {person}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setItems([
                      ...items,
                      { id: Date.now().toString(), name: 'New Item', price: 15, assignedTo: [itemPeople[0] || 'Guest'] },
                    ])
                  }
                  className="w-full py-2 border border-dashed border-slate-700 hover:border-emerald-500 rounded-xl text-xs font-semibold text-slate-300 hover:text-emerald-400 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Receipt Line Item
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <label htmlFor="itemized-tax" className="block text-xs font-semibold text-slate-400 mb-1">
                    Sales Tax (%)
                  </label>
                  <input
                    id="itemized-tax"
                    type="number"
                    step="0.1"
                    value={itemizedTaxPct}
                    onChange={(e) => setItemizedTaxPct(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="itemized-tip" className="block text-xs font-semibold text-slate-400 mb-1">
                    Pre-Tax Tip (%)
                  </label>
                  <input
                    id="itemized-tip"
                    type="number"
                    step="1"
                    value={itemizedTipPct}
                    onChange={(e) => setItemizedTipPct(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white tabular-nums"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Output Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-emerald-500/30 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Calculated Breakdown
              </span>
              <span className="text-xs text-slate-400">Client-Side Exact</span>
            </div>

            {splitMode === 'equal' && (
              <div className="py-5 text-center space-y-1.5 border-b border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Each Person Pays
                </span>
                <div className="text-5xl font-black text-emerald-400 tabular-nums">
                  ${equalCalc.perPerson.toFixed(2)}
                </div>
                <p className="text-xs text-slate-400">
                  Split among {peopleCount} {peopleCount === 1 ? 'person' : 'people'} {roundUp && '(rounded up)'}
                </p>
              </div>
            )}

            {splitMode === 'income' && (
              <div className="py-3 border-b border-slate-800 space-y-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block text-center">
                  Proportional Contributions
                </span>
                {incomeCalc.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800"
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{r.name}</div>
                      <div className="text-[11px] text-slate-400 tabular-nums">
                        {r.pct}% share · ${r.monthlyIncome.toLocaleString()}/mo
                      </div>
                    </div>
                    <div className="text-lg font-black text-emerald-400 tabular-nums">${r.owed}</div>
                  </div>
                ))}
              </div>
            )}

            {splitMode === 'itemized' && (
              <div className="py-3 border-b border-slate-800 space-y-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block text-center">
                  Individual Totals (Inc. Proportional Tax &amp; Tip)
                </span>
                {Object.entries(itemizedCalc.personTotals).map(([person, data]) => (
                  <div
                    key={person}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800"
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{person}</div>
                      <div className="text-[11px] text-slate-400 tabular-nums">
                        Food subtotal: ${data.foodSubtotal.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-lg font-black text-emerald-400 tabular-nums">
                      ${data.grandTotal.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-1.5 text-xs text-slate-300 tabular-nums">
              {splitMode === 'equal' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bill Subtotal:</span>
                    <span className="font-semibold text-white">${equalCalc.rawBill.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sales Tax ({taxPercent}%):</span>
                    <span className="font-semibold text-white">${equalCalc.taxAmt.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tip ({tipPercent}%):</span>
                    <span className="font-semibold text-emerald-400">+${equalCalc.tipAmt.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                    <span className="text-white">Grand Total:</span>
                    <span className="text-emerald-400">${equalCalc.grandTotal.toFixed(2)}</span>
                  </div>
                </>
              )}

              {splitMode === 'income' && (
                <div className="flex justify-between text-sm font-bold pt-1">
                  <span className="text-white">Total Shared Bill:</span>
                  <span className="text-emerald-400">${Number(utilityTotal).toFixed(2)}</span>
                </div>
              )}

              {splitMode === 'itemized' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Food Subtotal:</span>
                    <span className="font-semibold text-white">${itemizedCalc.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tax Total ({itemizedTaxPct}%):</span>
                    <span className="font-semibold text-white">${itemizedCalc.taxTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tip Total ({itemizedTipPct}%):</span>
                    <span className="font-semibold text-emerald-400">+${itemizedCalc.tipTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                    <span className="text-white">Grand Total:</span>
                    <span className="text-emerald-400">${itemizedCalc.grandTotal.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={copyBreakdown}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Summary Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Text Breakdown for Group Chat</span>
                  </>
                )}
              </button>

              {!embedded && splitMode === 'equal' && (
                <button
                  type="button"
                  onClick={updateUrlShare}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Shareable Split Link</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
