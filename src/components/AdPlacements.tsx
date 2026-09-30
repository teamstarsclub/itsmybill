import React, { useState } from 'react';
import { 
  ExternalLink, 
  ShieldCheck, 
  DollarSign, 
  Sparkles, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  TrendingDown,
  Building2,
  Clock
} from 'lucide-react';

interface AdLeaderboardProps {
  onNavigateToAudit?: () => void;
}

export const AdLeaderboard: React.FC<AdLeaderboardProps> = ({ onNavigateToAudit }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-slate-900/70 rounded-xl border border-slate-800 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Partner Offer
          </span>
          <div className="text-slate-300">
            <strong className="text-white">Cut your cable & phone bills automatically:</strong> Professional negotiators save you an average of $380/yr with zero phone calls.
          </div>
        </div>
        <button 
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02]"
        >
          <span>Lower My Bills</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive Savings Concierge Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-6 text-left overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            {/* Modal Header */}
            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold mb-2">
                  <Sparkles className="w-3 h-3" />
                  Bill Negotiation Partner Network
                </div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  Lower Your Bills by Up to $380/Year
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Choose between our 100% free DIY AI auditor or partner with professional negotiators who call your providers for you.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-3 gap-3 relative z-10">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Average Savings</span>
                <span className="text-lg font-black text-emerald-400 mt-0.5 block">$380 / yr</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Success Rate</span>
                <span className="text-lg font-black text-white mt-0.5 block">85%+</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Upfront Cost</span>
                <span className="text-lg font-black text-emerald-400 mt-0.5 block">$0 Free</span>
              </div>
            </div>

            {/* Negotiation Options */}
            <div className="space-y-3 relative z-10">
              {/* Option 1: Free Internal Tool */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-slate-950 border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">1. Free DIY AI Bill Auditor</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Audit your bill line-by-line right here on ItsMyBill and get the exact script to read to customer service yourself.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    if (onNavigateToAudit) onNavigateToAudit();
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Launch Free Auditor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Option 2: Professional Auto-Negotiators */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>2. Automatic Concierge (They Call Providers for You)</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    If you don't want to spend 45 minutes on the phone with Comcast, Spectrum, or AT&T, licensed negotiators will call retention departments on your behalf.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <a
                    href="https://www.billshark.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">Billshark</div>
                      <div className="text-[10px] text-slate-500">Cable, Internet & Phone Specialists</div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                  </a>

                  <a
                    href="https://www.rocketmoney.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">Rocket Money</div>
                      <div className="text-[10px] text-slate-500">Subscription Canceler & Bill Reducer</div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                  </a>
                </div>
              </div>
            </div>

            {/* Guarantee note */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 border-t border-slate-800/80 pt-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>No service contract changes without your prior written approval.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const AffiliateSidebarCard: React.FC<{ onNavigateToAudit?: () => void }> = ({ onNavigateToAudit }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3">
        <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-slate-400">
          <span>Recommended Consumer Tool</span>
          <span className="text-emerald-400">Verified</span>
        </div>

        <h4 className="text-sm font-bold text-white leading-snug">
          Stop Overpaying $400/yr on Auto & Home Insurance
        </h4>

        <p className="text-xs text-slate-400 leading-relaxed">
          Compare 40+ top-rated insurers in 2 minutes. Free quote comparison with zero spam calls.
        </p>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Check Better Rates</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Compare Insurance Rates</h3>
              <button 
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Insurance premiums increased by an average of 19% this year. Use independent rate checkers to compare quotes without giving away your phone number to aggregators:
            </p>
            <div className="space-y-2 pt-2">
              <a
                href="https://www.thezebra.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-white transition-colors"
              >
                🦓 <strong>The Zebra</strong> — Real-time quotes from 100+ carriers
              </a>
              <a
                href="https://www.policygenius.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-white transition-colors"
              >
                🛡️ <strong>Policygenius</strong> — Unbiased insurance comparison
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
