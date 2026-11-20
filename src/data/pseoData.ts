import stateBenchmarksRaw from './stateBenchmarks.json';
import providerAuditsRaw from './providerAudits.json';
import disputeTemplatesRaw from './disputeTemplates.json';
import editorialGuidesRaw from './editorialGuides.json';
import type { PageFaqItem } from '../components/PageFAQ';

export interface StateBenchmarkRecord {
  slug: string;
  state: string;
  code: string;
  avgElectricityRateKwh: number;
  avgMonthlyElectric: number;
  avgMonthlyGas: number;
  avgMonthlyWater: number;
  avgMonthlyInternet: number;
  deregulated: boolean;
  marketType: string;
  topProviders: string[];
  peakSeasonalDriver: string;
  pucName: string;
  pucUrl: string;
  neighbors: string[];
  depositReturnDays: number;
  depositStatute: string;
  depositCap: string;
  depositPenalty: string;
}

export interface ProviderFeeRow {
  feeName: string;
  typicalCost: string;
  negotiable: string;
  statuteOrRule: string;
  howToChallenge: string;
}

export interface ProviderAuditProfile {
  slug: string;
  providerName: string;
  category: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  directAnswer: string;
  sampleAmount: number;
  sampleBillText: string;
  fees: ProviderFeeRow[];
  retentionScript: string;
  escalationChecklist: string[];
  disputeSlug: string;
  faqs: PageFaqItem[];
}

export interface DisputeTemplateProfile {
  slug: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  statuteCode: string;
  billType: string;
  defaultProvider: string;
  defaultAmount: string;
  defaultCodes: string;
  defaultReason: string;
  deadlineHighlight: string;
  directAnswer: string;
  plainEnglishRights: string[];
  sampleLetter: string;
  certifiedMailChecklist: string[];
  govSourceName: string;
  govSourceUrl: string;
  faqs: PageFaqItem[];
  stateSlug?: string;
  stateName?: string;
}

export interface EditorialSpoke {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  readTimeMinutes: number;
  lastVerified: string;
  directAnswer: string;
  keyPoints: string[];
  table: {
    caption: string;
    headers: string[];
    rows: string[][];
  };
  relatedToolPath: string;
  relatedToolLabel: string;
  faqs: PageFaqItem[];
}

export interface EditorialHub {
  clusterSlug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  directAnswer: string;
  companionToolPath: string;
  companionToolLabel: string;
  lastVerified: string;
  spokes: EditorialSpoke[];
}

export const BENCHMARK_METADATA = stateBenchmarksRaw.metadata;
export const STATE_BENCHMARKS: StateBenchmarkRecord[] = stateBenchmarksRaw.states;
export const PROVIDER_AUDITS: ProviderAuditProfile[] = providerAuditsRaw as ProviderAuditProfile[];
export const CORE_DISPUTE_TEMPLATES: DisputeTemplateProfile[] = disputeTemplatesRaw as DisputeTemplateProfile[];
export const EDITORIAL_HUBS: EditorialHub[] = editorialGuidesRaw.hubs as EditorialHub[];

// Precompute electricity rate rank (1 = highest electricity rate in US)
const sortedByRateDesc = [...STATE_BENCHMARKS].sort((a, b) => b.avgElectricityRateKwh - a.avgElectricityRateKwh);
const sortedByTotalDesc = [...STATE_BENCHMARKS].sort(
  (a, b) =>
    b.avgMonthlyElectric + b.avgMonthlyGas + b.avgMonthlyWater + b.avgMonthlyInternet -
    (a.avgMonthlyElectric + a.avgMonthlyGas + a.avgMonthlyWater + a.avgMonthlyInternet)
);

export function getStateCombinedMonthly(st: StateBenchmarkRecord): number {
  return st.avgMonthlyElectric + st.avgMonthlyGas + st.avgMonthlyWater + st.avgMonthlyInternet;
}

export function getStateElectricRank(slug: string): number {
  const idx = sortedByRateDesc.findIndex((s) => s.slug === slug);
  return idx >= 0 ? idx + 1 : 0;
}

export function getStateTotalRank(slug: string): number {
  const idx = sortedByTotalDesc.findIndex((s) => s.slug === slug);
  return idx >= 0 ? idx + 1 : 0;
}

export function getStateBySlug(slug: string): StateBenchmarkRecord | undefined {
  return STATE_BENCHMARKS.find((s) => s.slug === slug);
}

export function getStateByCode(code: string): StateBenchmarkRecord | undefined {
  return STATE_BENCHMARKS.find((s) => s.code.toLowerCase() === code.toLowerCase());
}

export function getProviderAuditBySlug(slug: string): ProviderAuditProfile | undefined {
  return PROVIDER_AUDITS.find((p) => p.slug === slug);
}

export function buildStateGeoSummary(st: StateBenchmarkRecord): string {
  const nat = BENCHMARK_METADATA.nationalBaseline;
  const combined = getStateCombinedMonthly(st);
  const diffPct = (((st.avgElectricityRateKwh - nat.avgElectricityRateKwh) / nat.avgElectricityRateKwh) * 100).toFixed(1);
  const direction = st.avgElectricityRateKwh >= nat.avgElectricityRateKwh ? 'above' : 'below';
  const absPct = Math.abs(parseFloat(diffPct)).toFixed(1);
  const rank = getStateElectricRank(st.slug);

  return `Average residential electricity rates in ${st.state} are ${st.avgElectricityRateKwh}¢/kWh (EIA Table 5.6.A)—ranking #${rank} highest among 51 U.S. jurisdictions and ${absPct}% ${direction} the ${nat.avgElectricityRateKwh}¢/kWh national average. Typical ${st.state} households spend $${combined}/month combined across electricity ($${st.avgMonthlyElectric}), natural gas ($${st.avgMonthlyGas}), water ($${st.avgMonthlyWater}), and broadband ($${st.avgMonthlyInternet}).`;
}

export function buildStateFaqs(st: StateBenchmarkRecord): PageFaqItem[] {
  const nat = BENCHMARK_METADATA.nationalBaseline;
  const combined = getStateCombinedMonthly(st);
  const diffTotal = combined - nat.avgCombinedMonthly;
  const diffLabel =
    diffTotal >= 0
      ? `$${diffTotal}/month ($${diffTotal * 12}/year) above`
      : `$${Math.abs(diffTotal)}/month ($${Math.abs(diffTotal) * 12}/year) below`;

  return [
    {
      question: `What is the average monthly utility bill in ${st.state}?`,
      answer: `Combined baseline household utilities in ${st.state} average $${combined}/month—including $${st.avgMonthlyElectric} for electricity (${st.avgElectricityRateKwh}¢/kWh), $${st.avgMonthlyGas} for natural gas, $${st.avgMonthlyWater} for municipal water and sewer, and $${st.avgMonthlyInternet} for standalone 100–300 Mbps broadband. That sits ${diffLabel} the $${nat.avgCombinedMonthly}/month U.S. national baseline.`,
    },
    {
      question: `Is electricity deregulated in ${st.state}?`,
      answer: st.deregulated
        ? `Yes. ${st.state} operates under ${st.marketType}, allowing eligible residents to compare third-party retail electricity suppliers against the default utility Price-to-Compare while local delivery utilities (${st.topProviders.slice(0, 2).join(', ')}) maintain the wires.`
        : `No. ${st.state} primarily operates as a ${st.marketType}. Residential customers are served by their assigned local utility (${st.topProviders.slice(0, 2).join(', ')}) under rate schedules regulated by the ${st.pucName}.`,
    },
    {
      question: `Why are ${st.state} utility bills higher during peak seasons?`,
      answer: `${st.peakSeasonalDriver} Reviewing your billing cycle length (28 vs. 34 days), checking for estimated meter reads, and verifying whether a Time-of-Use or standard flat residential tariff fits your usage helps prevent seasonal bill shocks.`,
    },
    {
      question: `Where do I file an official utility billing complaint in ${st.state}?`,
      answer: `If your utility provider (${st.topProviders[0]}) fails to resolve a meter accuracy dispute, tariff error, or improper disconnection notice, you can escalate an official consumer complaint directly to the ${st.pucName} at ${st.pucUrl}.`,
    },
  ];
}

// Programmatic 51-state security deposit demand templates (/dispute-letter/security-deposit-[state-slug]/)
export function buildStateDepositDisputeTemplate(st: StateBenchmarkRecord): DisputeTemplateProfile {
  const slug = `security-deposit-${st.slug}`;
  return {
    slug,
    stateSlug: st.slug,
    stateName: st.state,
    seoTitle: `${st.state} Security Deposit Demand Letter (${st.depositReturnDays}-Day Rule) | ItsMyBill`,
    metaDescription: `Free ${st.state} security deposit demand letter citing ${st.depositStatute}. Enforce the ${st.depositReturnDays}-day return deadline and statutory penalty rules.`,
    h1: `${st.state} Security Deposit Return & Itemization Demand Letter`,
    statuteCode: st.depositStatute,
    billType: 'General Consumer Bill',
    defaultProvider: `${st.state} Property Management / Landlord`,
    defaultAmount: '1,650.00',
    defaultCodes: `${st.depositStatute} (${st.depositReturnDays}-Day Return Deadline)`,
    defaultReason: `Failure to return residential security deposit or furnish a lawful itemized deduction statement within ${st.depositReturnDays} days as required under ${st.depositStatute}.`,
    deadlineHighlight: `${st.depositReturnDays}-Day Statutory Return Deadline (${st.depositStatute}) · Cap: ${st.depositCap}`,
    directAnswer: `Under ${st.state} law (${st.depositStatute}), landlords must return your residential security deposit—or send a lawful itemized statement of deductions beyond ordinary wear and tear—within ${st.depositReturnDays} days after move-out. Security deposits in ${st.state} are governed by a statutory cap of ${st.depositCap}, and wrongful withholding exposes landlords to: ${st.depositPenalty}.`,
    plainEnglishRights: [
      `Statutory Return Deadline in ${st.state}: ${st.depositReturnDays} days following lease termination, key return, and delivery of your written forwarding address (${st.depositStatute}).`,
      `Statutory Deposit Limit: ${st.depositCap}.`,
      `Statutory Penalty for Wrongful Withholding: ${st.depositPenalty}.`,
      `Landlords in ${st.state} may only deduct for unpaid rent or documented property damage exceeding normal wear and tear—not routine maintenance or aged paint/carpet.`,
    ],
    sampleLetter: `Date: [Date]

TO:
[Landlord or Property Management Company]
[Landlord Mailing Address]

FROM:
[Your Full Name]
Forwarding Address: [Your New Mailing Address]
Former ${st.state} Rental Unit: [Former Rental Street Address, City, ${st.code} ZIP]

RE: Formal Demand for Return of Security Deposit ($[Amount]) Pursuant to ${st.depositStatute}

Dear [Landlord / Property Manager],

I vacated the residential premises located at [Former Address] in ${st.state} on [Move-Out Date], returned all keys, left the unit clean and undamaged beyond ordinary wear and tear, and furnished my written forwarding address.

I. STATUTORY NOTICE UNDER ${st.state.toUpperCase()} LAW (${st.depositStatute})
Pursuant to ${st.depositStatute}, a landlord must return a tenant's security deposit or mail an itemized written accounting of lawful deductions within ${st.depositReturnDays} days. More than ${st.depositReturnDays} days have now elapsed without receipt of my $[Amount] deposit or a compliant itemized statement.

II. FORMAL DEMAND FOR REMITTANCE
Please remit a check for my full security deposit of $[Amount] to my forwarding address listed above within ten (10) business days of your receipt of this notice. Under ${st.depositStatute}, wrongful or bad-faith retention of a security deposit subjects a landlord to statutory liability (${st.depositPenalty}).

If full payment or a compliant statutory accounting is not received within ten (10) business days, I am prepared to pursue full recovery and statutory damages in ${st.state} Small Claims Court without further notice.

Sincerely,

[Your Signature]
[Your Printed Name]`,
    certifiedMailChecklist: [
      `Verify that ${st.depositReturnDays} days have passed since you surrendered keys and provided your written forwarding address in ${st.state}.`,
      `Attach copies (never originals) of your lease's deposit clause, move-in/move-out dated photos, and forwarding-address email.`,
      `Mail via USPS Certified Mail with Return Receipt Requested (PS Form 3811) to preserve admissible proof for ${st.state} Small Claims Court.`,
      `Keep all correspondence written; if unresolved after 10 business days, file in the ${st.state} Small Claims Court covering the rental property's county.`,
    ],
    govSourceName: 'HUD State Tenant Rights & Legal Aid Directory',
    govSourceUrl: 'https://www.hud.gov/topics/rental_assistance/tenantrights',
    faqs: [
      {
        question: `How many days does a landlord have to return a security deposit in ${st.state}?`,
        answer: `Under ${st.depositStatute}, landlords in ${st.state} have ${st.depositReturnDays} days to return the security deposit or provide a compliant written itemized list of lawful deductions.`,
      },
      {
        question: `What is the maximum security deposit a landlord can charge in ${st.state}?`,
        answer: `Under ${st.state} law (${st.depositStatute}), the statutory security deposit limit is: ${st.depositCap}.`,
      },
      {
        question: `What is the penalty if a ${st.state} landlord wrongfully keeps my security deposit?`,
        answer: `Under ${st.depositStatute}, tenants who prevail in proving wrongful or bad-faith withholding may recover: ${st.depositPenalty}.`,
      },
      {
        question: `Can a ${st.state} landlord charge me for normal wear and tear?`,
        answer: `No. ${st.state} landlord-tenant law prohibits deducting ordinary wear and tear—such as minor nail holes, sunlight fading, or normal carpet traffic—from a residential security deposit.`,
      },
    ],
  };
}

export const STATE_DEPOSIT_TEMPLATES: DisputeTemplateProfile[] = STATE_BENCHMARKS.map(buildStateDepositDisputeTemplate);

export function getDisputeTemplateBySlug(slug: string): DisputeTemplateProfile | undefined {
  const core = CORE_DISPUTE_TEMPLATES.find((d) => d.slug === slug);
  if (core) return core;
  if (slug.startsWith('security-deposit-')) {
    const stateSlug = slug.slice('security-deposit-'.length);
    const st = getStateBySlug(stateSlug);
    if (st) return buildStateDepositDisputeTemplate(st);
  }
  return undefined;
}

export function getEditorialHubBySlug(clusterSlug: string): EditorialHub | undefined {
  return EDITORIAL_HUBS.find((h) => h.clusterSlug === clusterSlug);
}

export function getEditorialSpokeBySlug(
  clusterSlug: string,
  spokeSlug: string
): { hub: EditorialHub; spoke: EditorialSpoke } | undefined {
  const hub = getEditorialHubBySlug(clusterSlug);
  if (!hub) return undefined;
  const spoke = hub.spokes.find((s) => s.slug === spokeSlug);
  if (!spoke) return undefined;
  return { hub, spoke };
}
