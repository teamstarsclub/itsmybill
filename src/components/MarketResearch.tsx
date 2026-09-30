import React from 'react';
import { 
  TrendingUp, 
  Search, 
  Target, 
  DollarSign, 
  Lightbulb, 
  Award, 
  CheckCircle2, 
  BarChart3, 
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Flame,
  Globe
} from 'lucide-react';
import { MARKET_RESEARCH_DOSSIER } from '../data/mockData';

export const MarketResearch: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            Market Research Dossier • itsmybill.com Strategic Roadmap
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            How to Rank #1 on Google & Build a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">$20k–$50k/Mo Utility</span>
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Deconstructing the YouTube case studies (DownDetector, WordUnscrambler, consumer finance arbitrage) and applying the playbook directly to your premium domain: <strong className="text-emerald-400">itsmybill.com</strong>.
          </p>
        </div>
      </div>

      {/* Brand Equity & Opportunity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Domain Brand Equity</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            "itsmybill.com" is a natural 3-word English phrase. It evokes personal ownership, emotion ("Wait, is this really my bill?!"), and immediate utility without tech jargon.
          </p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Total Addressable Searches</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Over <span className="text-cyan-300 font-bold">1,850,000+ monthly searches</span> for bill calculators, roommate splits, medical dispute letters, and cable negotiation scripts.
          </p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">High RPM Monetization</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Gaming/casual tools yield $2–$4 RPM. Financial & utility defense generates <span className="text-amber-300 font-bold">$45–$95 RPM</span> via financial affiliate partnerships (Billshark, Rocket Money, Experian).
          </p>
        </div>
      </div>

      {/* Target Keywords Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-400" />
              Target Keyword Arbitrage (High Search Volume, Weak Competitors)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              These are the exact queries itsmybill.com targets with zero friction, client-side speed, and Schema.org structured data.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Target Keyword Query</th>
                <th className="py-3 px-3">Monthly US Volume</th>
                <th className="py-3 px-3">Google CPC</th>
                <th className="py-3 px-3">SEO Difficulty</th>
                <th className="py-3 px-3">Why ItsMyBill Wins</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {MARKET_RESEARCH_DOSSIER.targetKeywords.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-950/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    "{item.keyword}"
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-400 font-bold">{item.volume}</td>
                  <td className="py-3 px-3 font-mono">{item.cpc}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      {item.competition}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    Zero login wall, instant calculation, copy-to-clipboard summary.
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* The 3 YouTube Video Blueprints Decoded */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-teal-400" />
          The Secret Playbook from the YouTube Videos (Applied to itsmybill.com)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">
              Principle 1: Zero Friction Utility
            </span>
            <h4 className="text-sm font-bold text-white">Instant Value Without Signup</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              In "This Boring Ugly Website Makes $20k/Month" (DownDetector), the entire site does ONE thing immediately. ItsMyBill gives users the calculation or audit result within 1 second. No email gating, no account required.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">
              Principle 2: High RPM Niche Selection
            </span>
            <h4 className="text-sm font-bold text-white">Finance & Bill Negotiation Arbitrage</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              In "This Boring Website Earns $6M/Year", RPM differences are highlighted. A word unscrambler has $3 RPM, but financial utilities have $50+ RPM because banks and bill negotiation tools pay $40–$100 CPA for customer acquisitions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">
              Principle 3: Peer-to-Peer Virality
            </span>
            <h4 className="text-sm font-bold text-white">Shareable URL Hashes</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              When one user splits a dinner or roommate utility bill on itsmybill.com, they text the link or summary to 3–6 other people. Every calculation brings 4 new organic visitors for $0 customer acquisition cost.
            </p>
          </div>
        </div>
      </div>

      {/* Wild Ideas for #1 Ranking */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">
            Wild Ideas That Differentiate itsmybill.com from Outdated Clones
          </h3>
        </div>

        <div className="space-y-3 pt-2">
          {MARKET_RESEARCH_DOSSIER.wildNicheStrategies.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {item.virality}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
