import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  Percent, 
  Copy, 
  Check, 
  ArrowRight, 
  Share2, 
  Plus, 
  Trash2, 
  Scale, 
  Sparkles,
  Calculator,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

interface ItemEntry {
  id: string;
  name: string;
  price: number;
  assignedTo: string[]; // names of people
}

interface RoommateEntry {
  id: string;
  name: string;
  monthlyIncome: number;
}

export const SplitCalculator: React.FC = () => {
  const [splitMode, setSplitMode] = useState<'equal' | 'income' | 'itemized'>('equal');

  // Equal Mode State
  const [billAmount, setBillAmount] = useState<number>(148.50);
  const [taxPercent, setTaxPercent] = useState<number>(8.5);
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [roundUp, setRoundUp] = useState<boolean>(false);

  // Income Mode State
  const [utilityTotal, setUtilityTotal] = useState<number>(380);
  const [roommates, setRoommates] = useState<RoommateEntry[]>([
    { id: '1', name: 'Alex', monthlyIncome: 6500 },
    { id: '2', name: 'Jordan', monthlyIncome: 4200 },
    { id: '3', name: 'Taylor', monthlyIncome: 2800 },
  ]);

  // Itemized Mode State
  const [itemPeople, setItemPeople] = useState<string[]>(['Sarah', 'David', 'Maya']);
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

  // Read URL params if any
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash.includes('total=')) {
        const params = new URLSearchParams(hash.replace('#', ''));
        const total = parseFloat(params.get('total') || '');
        const tip = parseFloat(params.get('tip') || '');
        const people = parseInt(params.get('people') || '', 10);
        if (!isNaN(total)) setBillAmount(total);
        if (!isNaN(tip)) setTipPercent(tip);
        if (!isNaN(people) && people > 0) setPeopleCount(people);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Equal Mode Calculations
  const equalCalc = useMemo(() => {
    const rawBill = Number(billAmount) || 0;
    const taxAmt = (rawBill * (Number(taxPercent) || 0)) / 100;
    const preTipTotal = rawBill + taxAmt;
    // Tip is typically calculated on the pre-tax base or total
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
      effectiveTotal: perPerson * count
    };
  }, [billAmount, taxPercent, tipPercent, peopleCount, roundUp]);

  // Income Mode Calculations
  const incomeCalc = useMemo(() => {
    const totalIncome = roommates.reduce((sum, r) => sum + (Number(r.monthlyIncome) || 0), 0);
    const totalBill = Number(utilityTotal) || 0;

    return roommates.map((r) => {
      const inc = Number(r.monthlyIncome) || 0;
      const pct = totalIncome > 0 ? inc / totalIncome : 1 / roommates.length;
      const owed = totalBill * pct;
      return {
        ...r,
        pct: (pct * 100).toFixed(1),
        owed: owed.toFixed(2),
      };
    });
  }, [utilityTotal, roommates]);

  // Itemized Mode Calculations
  const itemizedCalc = useMemo(() => {
    const subtotal = items.reduce((acc, it) => acc + (Number(it.price) || 0), 0);
    const taxTotal = (subtotal * (Number(itemizedTaxPct) || 0)) / 100;
    const tipTotal = (subtotal * (Number(itemizedTipPct) || 0)) / 100;
    const multiplier = subtotal > 0 ? (subtotal + taxTotal + tipTotal) / subtotal : 1;

    const personTotals: Record<string, { foodSubtotal: number; grandTotal: number }> = {};
    itemPeople.forEach(p => {
      personTotals[p] = { foodSubtotal: 0, grandTotal: 0 };
    });

    items.forEach((item) => {
      const assigned = item.assignedTo.filter(p => itemPeople.includes(p));
      if (assigned.length > 0) {
        const splitCost = item.price / assigned.length;
        assigned.forEach((p) => {
          if (!personTotals[p]) personTotals[p] = { foodSubtotal: 0, grandTotal: 0 };
          personTotals[p].foodSubtotal += splitCost;
        });
      }
    });

    Object.keys(personTotals).forEach(p => {
      personTotals[p].grandTotal = personTotals[p].foodSubtotal * multiplier;
    });

    return {
      subtotal,
      taxTotal,
      tipTotal,
      grandTotal: subtotal + taxTotal + tipTotal,
      personTotals
    };
  }, [items, itemPeople, itemizedTaxPct, itemizedTipPct]);

  const copyBreakdown = () => {
    let text = `🧾 ItsMyBill.com - Bill Split Breakdown\n`;
    if (splitMode === 'equal') {
      text += `Total Bill: $${equalCalc.grandTotal.toFixed(2)} (inc. $${equalCalc.tipAmt.toFixed(2)} tip)\n`;
      text += `Split among ${peopleCount} people:\n`;
      text += `👉 Each person pays: $${equalCalc.perPerson.toFixed(2)}\n`;
      text += `Calculate yours free at: https://itsmybill.com`;
    } else if (splitMode === 'income') {
      text += `Total Shared Bill: $${Number(utilityTotal).toFixed(2)}\n`;
      text += `Income-Fair Proportional Split:\n`;
      incomeCalc.forEach((r) => {
        text += `• ${r.name}: $${r.owed} (${r.pct}% based on $${r.monthlyIncome}/mo)\n`;
      });
      text += `Calculate yours free at: https://itsmybill.com`;
    } else {
      text += `Itemized Bill Total: $${itemizedCalc.grandTotal.toFixed(2)}\n`;
      Object.entries(itemizedCalc.personTotals).forEach(([p, val]) => {
        text += `• ${p}: $${val.grandTotal.toFixed(2)} (Food: $${val.foodSubtotal.toFixed(2)})\n`;
      });
      text += `Calculate yours free at: https://itsmybill.com`;
    }

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const updateUrlShare = () => {
    const url = `${window.location.origin}${window.location.pathname}#total=${billAmount}&tip=${tipPercent}&people=${peopleCount}`;
    navigator.clipboard.writeText(url);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Value Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            100% Free • No Sign-up Required • Instant Calculations
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            The Smartest <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Bill & Tip Splitter</span> on the Web
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Split restaurant checks, group trips, and roommate utility bills fairly. Choose equal math, proportional income-based equity, or itemized dish breakdowns.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="mt-6 flex flex-wrap gap-2 p-1.5 bg-slate-950/80 rounded-xl border border-slate-800 w-fit">
          <button
            onClick={() => setSplitMode('equal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              splitMode === 'equal'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Equal Dinner Split</span>
          </button>
          <button
            onClick={() => setSplitMode('income')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              splitMode === 'income'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Income-Fair Roommates</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400 border border-emerald-500/30">
              Viral
            </span>
          </button>
          <button
            onClick={() => setSplitMode('itemized')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              splitMode === 'itemized'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Itemized Receipt</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Section (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          {splitMode === 'equal' && (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-400" />
                  Equal Group Split
                </h3>
                <span className="text-xs text-slate-400">Standard Restaurant & Tab Split</span>
              </div>

              {/* Bill Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Bill Subtotal (Before Tip)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={billAmount || ''}
                    onChange={(e) => setBillAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-2xl font-bold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Tip Selection */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Tip Percentage
                  </label>
                  <span className="text-sm font-bold text-emerald-400">{tipPercent}% (${equalCalc.tipAmt.toFixed(2)})</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[10, 15, 18, 20, 25].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setTipPercent(pct)}
                      className={`py-2.5 rounded-lg text-sm font-bold transition-all ${
                        tipPercent === pct
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
                <div className="mt-2.5 flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="1"
                    value={tipPercent}
                    onChange={(e) => setTipPercent(parseInt(e.target.value) || 0)}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <span className="text-xs text-slate-400 w-12 text-right">Custom</span>
                </div>
              </div>

              {/* Tax & People Count Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Tax (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={taxPercent}
                      onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-semibold focus:outline-none focus:border-emerald-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-xs">
                      %
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Number of People
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                      className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 font-bold text-lg flex items-center justify-center"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={peopleCount}
                      onChange={(e) => setPeopleCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-center bg-slate-950 border border-slate-800 rounded-xl py-2 text-lg font-bold text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setPeopleCount(peopleCount + 1)}
                      className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 font-bold text-lg flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Round Up Option */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={roundUp}
                    onChange={(e) => setRoundUp(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-950 border-slate-800"
                  />
                  <span className="text-xs sm:text-sm text-slate-300 font-medium">
                    Round up each person's share to next whole dollar (avoids messy coins)
                  </span>
                </label>
              </div>
            </>
          )}

          {splitMode === 'income' && (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Scale className="w-5 h-5 text-emerald-400" />
                    Income-Fair Roommate Splitter
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Splitting rent or $300+ electricity 50/50 when salaries differ creates resentment. Proportional burden is the golden standard.
                  </p>
                </div>
              </div>

              {/* Total Shared Bill */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Total Shared Expense (Rent, Power, Wifi, Groceries)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={utilityTotal || ''}
                    onChange={(e) => setUtilityTotal(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-2xl font-bold text-white focus:outline-none focus:border-emerald-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Roommates List */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Roommates & Monthly Take-Home Income
                </label>
                {roommates.map((r, idx) => (
                  <div key={r.id} className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-xs">
                      #{idx + 1}
                    </div>
                    <input
                      type="text"
                      value={r.name}
                      onChange={(e) => {
                        const newR = [...roommates];
                        newR[idx].name = e.target.value;
                        setRoommates(newR);
                      }}
                      className="bg-transparent border-b border-slate-800 focus:border-emerald-400 text-white font-medium text-sm px-1 py-1 w-32 focus:outline-none"
                      placeholder="Name"
                    />
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-slate-500 text-xs">$</span>
                      <input
                        type="number"
                        min="0"
                        value={r.monthlyIncome || ''}
                        onChange={(e) => {
                          const newR = [...roommates];
                          newR[idx].monthlyIncome = parseFloat(e.target.value) || 0;
                          setRoommates(newR);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-6 pr-3 py-1.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
                        placeholder="Monthly income"
                      />
                    </div>
                    {roommates.length > 2 && (
                      <button
                        onClick={() => setRoommates(roommates.filter((_, i) => i !== idx))}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setRoommates([...roommates, { id: Date.now().toString(), name: `Person ${roommates.length + 1}`, monthlyIncome: 3500 }])}
                  className="w-full py-2 border border-dashed border-slate-700 hover:border-emerald-500 rounded-xl text-xs font-semibold text-slate-400 hover:text-emerald-400 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Another Roommate / Partner
                </button>
              </div>
            </>
          )}

          {splitMode === 'itemized' && (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-400" />
                    Itemized Receipt Split
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Assign dishes to who ate them. Tax and tip are distributed proportionately.
                  </p>
                </div>
              </div>

              {/* People Tag List */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  People at the Table
                </label>
                <div className="flex flex-wrap gap-2 items-center">
                  {itemPeople.map((name, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200"
                    >
                      {name}
                      {itemPeople.length > 2 && (
                        <button
                          onClick={() => {
                            const newP = itemPeople.filter((_, i) => i !== idx);
                            setItemPeople(newP);
                          }}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      const name = prompt('Enter person name:');
                      if (name && !itemPeople.includes(name)) {
                        setItemPeople([...itemPeople, name]);
                      }
                    }}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 px-2 py-1"
                  >
                    + Add Person
                  </button>
                </div>
              </div>

              {/* Dishes List */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Dishes & Orders
                </label>
                {items.map((it, idx) => (
                  <div key={it.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={it.name}
                        onChange={(e) => {
                          const n = [...items];
                          n[idx].name = e.target.value;
                          setItems(n);
                        }}
                        className="bg-transparent border-b border-slate-800 focus:border-emerald-400 text-white font-medium text-sm flex-1 focus:outline-none"
                      />
                      <div className="relative w-28">
                        <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-slate-500 text-xs">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={it.price || ''}
                          onChange={(e) => {
                            const n = [...items];
                            n[idx].price = parseFloat(e.target.value) || 0;
                            setItems(n);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-6 pr-2 py-1 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <button
                        onClick={() => setItems(items.filter((_, i) => i !== idx))}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Checkbox of who shared */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[11px] text-slate-500 mr-1 self-center">Shared by:</span>
                      {itemPeople.map((person) => {
                        const isAssigned = it.assignedTo.includes(person);
                        return (
                          <button
                            key={person}
                            type="button"
                            onClick={() => {
                              const n = [...items];
                              if (isAssigned) {
                                n[idx].assignedTo = it.assignedTo.filter((p) => p !== person);
                              } else {
                                n[idx].assignedTo = [...it.assignedTo, person];
                              }
                              setItems(n);
                            }}
                            className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-all ${
                              isAssigned
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-900 text-slate-500 border border-slate-800'
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
                  onClick={() => setItems([...items, { id: Date.now().toString(), name: 'New Item', price: 15, assignedTo: [itemPeople[0] || 'Everyone'] }])}
                  className="w-full py-2 border border-dashed border-slate-700 hover:border-emerald-500 rounded-xl text-xs font-semibold text-slate-400 hover:text-emerald-400 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Receipt Line Item
                </button>
              </div>

              {/* Tax & Tip for Itemized */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Tax %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={itemizedTaxPct}
                    onChange={(e) => setItemizedTaxPct(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Tip %</label>
                  <input
                    type="number"
                    step="1"
                    value={itemizedTipPct}
                    onChange={(e) => setItemizedTipPct(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Output / Receipt Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-emerald-500/30 p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Fair Split Results
                </span>
              </div>
              <span className="text-xs text-slate-400">itsmybill.com</span>
            </div>

            {splitMode === 'equal' && (
              <div className="py-6 text-center space-y-2 border-b border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Each Person Owes
                </span>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-white">
                  ${equalCalc.perPerson.toFixed(2)}
                </div>
                <p className="text-xs text-slate-400">
                  Split between {peopleCount} people {roundUp && '(rounded to nearest $)'}
                </p>
              </div>
            )}

            {splitMode === 'income' && (
              <div className="py-4 border-b border-slate-800 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block text-center">
                  Fair Proportional Contributions
                </span>
                <div className="space-y-2">
                  {incomeCalc.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div>
                        <div className="text-sm font-bold text-white">{r.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {r.pct}% burden • ${r.monthlyIncome}/mo
                        </div>
                      </div>
                      <div className="text-lg font-black text-emerald-400">
                        ${r.owed}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {splitMode === 'itemized' && (
              <div className="py-4 border-b border-slate-800 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block text-center">
                  Individual Itemized Totals (Inc. Tax & Tip)
                </span>
                <div className="space-y-2">
                  {Object.entries(itemizedCalc.personTotals).map(([person, data]) => (
                    <div key={person} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div>
                        <div className="text-sm font-bold text-white">{person}</div>
                        <div className="text-[11px] text-slate-400">
                          Food subtotal: ${data.foodSubtotal.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-lg font-black text-emerald-400">
                        ${data.grandTotal.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Breakdown summary */}
            <div className="py-4 space-y-2 text-xs text-slate-300">
              {splitMode === 'equal' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bill Subtotal:</span>
                    <span className="font-semibold text-white">${equalCalc.rawBill.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tax ({taxPercent}%):</span>
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
                    <span className="text-slate-400">Tax Total:</span>
                    <span className="font-semibold text-white">${itemizedCalc.taxTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tip Total:</span>
                    <span className="font-semibold text-emerald-400">+${itemizedCalc.tipTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                    <span className="text-white">Grand Total:</span>
                    <span className="text-emerald-400">${itemizedCalc.grandTotal.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={copyBreakdown}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Summary Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Text Summary for Group Chat</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={updateUrlShare}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy 1-Click Shareable Link</span>
              </button>
            </div>

            {/* Venmo Deep Link note */}
            {splitMode === 'equal' && (
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Request on Venmo:</span>
                <a
                  href={`https://venmo.com/?txn=charge&amount=${equalCalc.perPerson.toFixed(2)}&note=ItsMyBill%20Split`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 font-semibold"
                >
                  Open Venmo Charge
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Micro-benefit Callout */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300">Why itsmybill.com?</div>
            <p>
              Unlike bulky mobile apps that require everyone to install software and log in, ItsMyBill is 100% web-based. Send one link and everyone gets instant clarity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
