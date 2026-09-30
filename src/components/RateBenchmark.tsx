import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Wifi, 
  Droplet, 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  AlertTriangle,
  Info,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { US_UTILITY_BENCHMARKS, StateUtilityData } from '../data/mockData';

export const RateBenchmark: React.FC = () => {
  const [selectedStateCode, setSelectedStateCode] = useState<string>('CA');
  const [userElectric, setUserElectric] = useState<number>(290);
  const [userInternet, setUserInternet] = useState<number>(85);
  const [userWater, setUserWater] = useState<number>(95);
  const [userGas, setUserGas] = useState<number>(80);

  const selectedState = useMemo(() => {
    return US_UTILITY_BENCHMARKS.find((s) => s.code === selectedStateCode) || US_UTILITY_BENCHMARKS[0];
  }, [selectedStateCode]);

  const nationalAvg = useMemo(() => {
    return US_UTILITY_BENCHMARKS.find((s) => s.code === 'US')!;
  }, []);

  const electricDiff = userElectric - selectedState.avgMonthlyElectric;
  const internetDiff = userInternet - selectedState.avgMonthlyInternet;
  const waterDiff = userWater - selectedState.avgMonthlyWater;
  const gasDiff = userGas - selectedState.avgMonthlyGas;

  const totalUserBills = userElectric + userInternet + userWater + userGas;
  const totalStateAvg = selectedState.avgMonthlyElectric + selectedState.avgMonthlyInternet + selectedState.avgMonthlyWater + selectedState.avgMonthlyGas;
  const totalAnnualOverpay = Math.max(0, (totalUserBills - totalStateAvg) * 12);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            50-State Utility Benchmarks • Live 2026 Rate Index
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Are You <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-300">Overpaying for Utilities</span>?
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Select your state and compare your electric, high-speed broadband, water, and gas bills against state and national benchmarks. Uncover if your utility provider is quietly charging above-market tariffs.
          </p>
        </div>
      </div>

      {/* State Selector Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Your State:</span>
          <select
            value={selectedStateCode}
            onChange={(e) => setSelectedStateCode(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-white font-bold text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-amber-400"
          >
            {US_UTILITY_BENCHMARKS.map((s) => (
              <option key={s.code} value={s.code}>
                {s.state} ({s.code})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-slate-400">
            Avg Electricity Rate:{' '}
            <span className="font-bold text-amber-400">{selectedState.avgElectricityRateKwh}¢ / kWh</span>
          </div>
          <div className="text-slate-400">
            US National Average: <span className="font-semibold text-slate-200">{nationalAvg.avgElectricityRateKwh}¢ / kWh</span>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Electric Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Zap className="w-4 h-4" />
              <span>Electricity</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              State Avg: ${selectedState.avgMonthlyElectric}/mo
            </span>
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Your Monthly Bill</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-bold">$</span>
              <input
                type="number"
                value={userElectric || ''}
                onChange={(e) => setUserElectric(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-base font-bold text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
          <div className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
            electricDiff > 0 ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
          }`}>
            <span>{electricDiff > 0 ? `+${electricDiff.toFixed(0)} over state avg` : `${Math.abs(electricDiff).toFixed(0)} below state avg`}</span>
            {electricDiff > 0 ? <TrendingUp className="w-4 h-4 text-rose-400" /> : <TrendingDown className="w-4 h-4 text-emerald-400" />}
          </div>
        </div>

        {/* Internet Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Wifi className="w-4 h-4" />
              <span>Broadband Internet</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              State Avg: ${selectedState.avgMonthlyInternet}/mo
            </span>
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Your Monthly Bill</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-bold">$</span>
              <input
                type="number"
                value={userInternet || ''}
                onChange={(e) => setUserInternet(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-base font-bold text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
          <div className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
            internetDiff > 0 ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
          }`}>
            <span>{internetDiff > 0 ? `+${internetDiff.toFixed(0)} over benchmark` : `${Math.abs(internetDiff).toFixed(0)} below benchmark`}</span>
            {internetDiff > 0 ? <TrendingUp className="w-4 h-4 text-rose-400" /> : <TrendingDown className="w-4 h-4 text-emerald-400" />}
          </div>
        </div>

        {/* Water Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Droplet className="w-4 h-4" />
              <span>Water & Sewer</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              State Avg: ${selectedState.avgMonthlyWater}/mo
            </span>
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Your Monthly Bill</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-bold">$</span>
              <input
                type="number"
                value={userWater || ''}
                onChange={(e) => setUserWater(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-base font-bold text-white focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
          <div className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
            waterDiff > 0 ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
          }`}>
            <span>{waterDiff > 0 ? `+${waterDiff.toFixed(0)} over benchmark` : `${Math.abs(waterDiff).toFixed(0)} below benchmark`}</span>
            {waterDiff > 0 ? <TrendingUp className="w-4 h-4 text-rose-400" /> : <TrendingDown className="w-4 h-4 text-emerald-400" />}
          </div>
        </div>

        {/* Natural Gas Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
              <Flame className="w-4 h-4" />
              <span>Natural Gas / Heat</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              State Avg: ${selectedState.avgMonthlyGas}/mo
            </span>
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Your Monthly Bill</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-bold">$</span>
              <input
                type="number"
                value={userGas || ''}
                onChange={(e) => setUserGas(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-base font-bold text-white focus:outline-none focus:border-orange-400"
              />
            </div>
          </div>
          <div className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
            gasDiff > 0 ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
          }`}>
            <span>{gasDiff > 0 ? `+${gasDiff.toFixed(0)} over benchmark` : `${Math.abs(gasDiff).toFixed(0)} below benchmark`}</span>
            {gasDiff > 0 ? <TrendingUp className="w-4 h-4 text-rose-400" /> : <TrendingDown className="w-4 h-4 text-emerald-400" />}
          </div>
        </div>
      </div>

      {/* Aggregate Savings Summary */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wider font-bold text-slate-400">
            Total Annual Utility Arbitrage in {selectedState.state}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {totalAnnualOverpay > 0 ? (
              <span>
                You are paying <span className="text-rose-400">${totalAnnualOverpay.toFixed(0)}/yr</span> more than your neighbors.
              </span>
            ) : (
              <span className="text-emerald-400">
                Great job! Your bills are currently below the state baseline.
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Your combined monthly utilities: ${totalUserBills}/mo vs {selectedState.state} average: ${totalStateAvg}/mo.
          </p>
        </div>

        {totalAnnualOverpay > 0 && (
          <a
            href="#audit"
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 shrink-0 inline-flex items-center gap-2"
          >
            <span>Run Free Bill Audit to Cut Rates</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};
