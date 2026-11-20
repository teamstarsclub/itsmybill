import React, { useState, useMemo, useEffect } from 'react';
import {
  Zap,
  Wifi,
  Droplet,
  Flame,
  TrendingUp,
  TrendingDown,
  Info,
  ArrowRight,
} from 'lucide-react';
import { STATE_BENCHMARKS, BENCHMARK_METADATA, getStateByCode } from '../data/pseoData';
import { EmbedCalculatorButton } from './EmbedModal';

export interface RateBenchmarkProps {
  onNavigateToAudit?: () => void;
  initialStateCode?: string;
  hideHero?: boolean;
  embedded?: boolean;
  onStateSlugSelect?: (slug: string) => void;
}

export const RateBenchmark: React.FC<RateBenchmarkProps> = ({
  onNavigateToAudit,
  initialStateCode = 'CA',
  hideHero = false,
  embedded = false,
  onStateSlugSelect,
}) => {
  const [selectedStateCode, setSelectedStateCode] = useState<string>(initialStateCode);

  const selectedState = useMemo(() => {
    return getStateByCode(selectedStateCode) || STATE_BENCHMARKS[4]; // CA fallback
  }, [selectedStateCode]);

  const [userElectric, setUserElectric] = useState<number>(Math.round(selectedState.avgMonthlyElectric * 1.15));
  const [userInternet, setUserInternet] = useState<number>(Math.round(selectedState.avgMonthlyInternet + 20));
  const [userWater, setUserWater] = useState<number>(Math.round(selectedState.avgMonthlyWater + 10));
  const [userGas, setUserGas] = useState<number>(Math.round(selectedState.avgMonthlyGas + 12));

  useEffect(() => {
    setSelectedStateCode(initialStateCode);
    const st = getStateByCode(initialStateCode);
    if (st) {
      setUserElectric(Math.round(st.avgMonthlyElectric * 1.15));
      setUserInternet(Math.round(st.avgMonthlyInternet + 20));
      setUserWater(Math.round(st.avgMonthlyWater + 10));
      setUserGas(Math.round(st.avgMonthlyGas + 12));
    }
  }, [initialStateCode]);

  const nationalAvg = BENCHMARK_METADATA.nationalBaseline;

  const electricDiff = userElectric - selectedState.avgMonthlyElectric;
  const internetDiff = userInternet - selectedState.avgMonthlyInternet;
  const waterDiff = userWater - selectedState.avgMonthlyWater;
  const gasDiff = userGas - selectedState.avgMonthlyGas;

  const totalUserBills = userElectric + userInternet + userWater + userGas;
  const totalStateAvg =
    selectedState.avgMonthlyElectric +
    selectedState.avgMonthlyInternet +
    selectedState.avgMonthlyWater +
    selectedState.avgMonthlyGas;
  const totalAnnualOverpay = Math.max(0, (totalUserBills - totalStateAvg) * 12);

  const handleStateChange = (newCode: string) => {
    setSelectedStateCode(newCode);
    const st = getStateByCode(newCode);
    if (st) {
      setUserElectric(Math.round(st.avgMonthlyElectric * 1.15));
      setUserInternet(Math.round(st.avgMonthlyInternet + 20));
      setUserWater(Math.round(st.avgMonthlyWater + 10));
      setUserGas(Math.round(st.avgMonthlyGas + 12));
      if (onStateSlugSelect) {
        onStateSlugSelect(st.slug);
      }
    }
  };

  return (
    <div className="space-y-6">
      {!hideHero && !embedded && (
        <div className="bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                50-State + DC Utility Benchmarks · U.S. EIA Table 5.6.A, FCC &amp; AWWA
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Compare Household Utility Costs by State
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Benchmark your electricity, natural gas, broadband, and water bills against official U.S. EIA residential tariffs, FCC Urban Rate Survey tiers, and AWWA municipal water medians.
              </p>
            </div>
            <EmbedCalculatorButton
              title="ItsMyBill 50-State Utility Benchmark Calculator"
              embedPath="/embed/state-utility-benchmark/"
              sourcePath="/utility-benchmarks/"
              sourceLabel="50-State Utility Benchmarks"
            />
          </div>
        </div>
      )}

      {/* State Selector Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label htmlFor="benchmark-state-select" className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Jurisdiction:
          </label>
          <select
            id="benchmark-state-select"
            value={selectedStateCode}
            onChange={(e) => handleStateChange(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-white font-bold text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            {STATE_BENCHMARKS.map((s) => (
              <option key={s.code} value={s.code}>
                {s.state} ({s.code})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs tabular-nums">
          <div className="text-slate-400">
            {selectedState.state} Electricity:{' '}
            <span className="font-bold text-amber-400">{selectedState.avgElectricityRateKwh}¢/kWh</span>
          </div>
          <div className="text-slate-400">
            U.S. National Avg:{' '}
            <span className="font-semibold text-slate-200">{nationalAvg.avgElectricityRateKwh}¢/kWh</span>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            id: 'electric',
            label: 'Electricity',
            icon: Zap,
            accent: 'text-amber-400',
            borderFocus: 'focus:border-amber-400',
            avg: selectedState.avgMonthlyElectric,
            value: userElectric,
            onChange: setUserElectric,
            diff: electricDiff,
          },
          {
            id: 'internet',
            label: 'Broadband Internet',
            icon: Wifi,
            accent: 'text-cyan-400',
            borderFocus: 'focus:border-cyan-400',
            avg: selectedState.avgMonthlyInternet,
            value: userInternet,
            onChange: setUserInternet,
            diff: internetDiff,
          },
          {
            id: 'water',
            label: 'Water & Sewer',
            icon: Droplet,
            accent: 'text-blue-400',
            borderFocus: 'focus:border-blue-400',
            avg: selectedState.avgMonthlyWater,
            value: userWater,
            onChange: setUserWater,
            diff: waterDiff,
          },
          {
            id: 'gas',
            label: 'Natural Gas',
            icon: Flame,
            accent: 'text-orange-400',
            borderFocus: 'focus:border-orange-400',
            avg: selectedState.avgMonthlyGas,
            value: userGas,
            onChange: setUserGas,
            diff: gasDiff,
          },
        ].map((card) => {
          const Icon = card.icon;
          const over = card.diff > 0;
          return (
            <div key={card.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <div className={`flex items-center gap-2 font-bold text-sm ${card.accent}`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{card.label}</span>
                </div>
                <span className="text-[11px] text-slate-400 tabular-nums">Avg ${card.avg}/mo</span>
              </div>

              <div>
                <label htmlFor={`user-${card.id}`} className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                  Your Monthly Bill
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-bold">$</span>
                  <input
                    id={`user-${card.id}`}
                    type="number"
                    value={card.value || ''}
                    onChange={(e) => card.onChange(parseFloat(e.target.value) || 0)}
                    className={`w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-base font-bold text-white tabular-nums focus:outline-none ${card.borderFocus}`}
                  />
                </div>
              </div>

              <div
                className={`p-2.5 rounded-xl text-xs font-semibold tabular-nums flex items-center justify-between ${
                  over
                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                }`}
              >
                <span>
                  {over
                    ? `+$${card.diff.toFixed(0)} over state avg`
                    : `$${Math.abs(card.diff).toFixed(0)} below state avg`}
                </span>
                {over ? (
                  <TrendingUp className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Aggregate Savings Summary */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wider font-bold text-slate-400">
            Annual Utility Variance in {selectedState.state}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
            {totalAnnualOverpay > 0 ? (
              <span>
                You are paying <span className="text-rose-400">${totalAnnualOverpay.toLocaleString()}/yr</span> above the{' '}
                {selectedState.state} baseline.
              </span>
            ) : (
              <span className="text-emerald-400">
                Your combined utility spend sits below the {selectedState.state} state baseline.
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 tabular-nums">
            Your combined monthly utilities: ${totalUserBills}/mo vs. {selectedState.state} average: ${totalStateAvg}/mo.
          </p>
        </div>

        {totalAnnualOverpay > 0 && onNavigateToAudit && !embedded && (
          <button
            type="button"
            onClick={onNavigateToAudit}
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors shrink-0 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Audit Statement for Hidden Fees</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sources & Methodology Card */}
      {!embedded && (
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5 space-y-2 text-xs text-slate-400">
          <div className="flex items-center gap-2 font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            <Info className="w-4 h-4 text-amber-400" />
            <span>Primary Data Sources &amp; Calculation Methodology</span>
          </div>
          <p className="leading-relaxed">
            <strong className="text-slate-200">Electricity:</strong> Official residential tariffs (¢/kWh) from the{' '}
            <em>U.S. Energy Information Administration (EIA) Electric Power Monthly, Table 5.6.A</em>.{' '}
            <strong className="text-slate-200">Natural Gas:</strong> EIA Natural Gas Monthly &amp; AGA residential heating medians.{' '}
            <strong className="text-slate-200">Broadband:</strong> FCC Urban Rate Survey standalone 100–300 Mbps terrestrial tiers.{' '}
            <strong className="text-slate-200">Water &amp; Sewer:</strong> AWWA / EPA residential rate survey medians (~6,000 gal/mo).
          </p>
        </div>
      )}
    </div>
  );
};
