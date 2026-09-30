export interface StateUtilityData {
  state: string;
  code: string;
  avgElectricityRateKwh: number; // in cents
  avgMonthlyElectric: number;
  avgMonthlyInternet: number;
  avgMonthlyWater: number;
  avgMonthlyGas: number;
}

export const US_UTILITY_BENCHMARKS: StateUtilityData[] = [
  { state: "California", code: "CA", avgElectricityRateKwh: 32.4, avgMonthlyElectric: 245, avgMonthlyInternet: 65, avgMonthlyWater: 85, avgMonthlyGas: 75 },
  { state: "Texas", code: "TX", avgElectricityRateKwh: 14.8, avgMonthlyElectric: 165, avgMonthlyInternet: 60, avgMonthlyWater: 65, avgMonthlyGas: 50 },
  { state: "Florida", code: "FL", avgElectricityRateKwh: 15.2, avgMonthlyElectric: 175, avgMonthlyInternet: 65, avgMonthlyWater: 60, avgMonthlyGas: 40 },
  { state: "New York", code: "NY", avgElectricityRateKwh: 24.1, avgMonthlyElectric: 210, avgMonthlyInternet: 70, avgMonthlyWater: 80, avgMonthlyGas: 90 },
  { state: "Illinois", code: "IL", avgElectricityRateKwh: 16.5, avgMonthlyElectric: 135, avgMonthlyInternet: 60, avgMonthlyWater: 60, avgMonthlyGas: 85 },
  { state: "Pennsylvania", code: "PA", avgElectricityRateKwh: 17.8, avgMonthlyElectric: 145, avgMonthlyInternet: 65, avgMonthlyWater: 65, avgMonthlyGas: 75 },
  { state: "Ohio", code: "OH", avgElectricityRateKwh: 15.6, avgMonthlyElectric: 130, avgMonthlyInternet: 55, avgMonthlyWater: 55, avgMonthlyGas: 70 },
  { state: "Georgia", code: "GA", avgElectricityRateKwh: 13.9, avgMonthlyElectric: 155, avgMonthlyInternet: 60, avgMonthlyWater: 55, avgMonthlyGas: 55 },
  { state: "North Carolina", code: "NC", avgElectricityRateKwh: 13.1, avgMonthlyElectric: 145, avgMonthlyInternet: 60, avgMonthlyWater: 50, avgMonthlyGas: 50 },
  { state: "Washington", code: "WA", avgElectricityRateKwh: 11.2, avgMonthlyElectric: 115, avgMonthlyInternet: 65, avgMonthlyWater: 75, avgMonthlyGas: 60 },
  { state: "Massachusetts", code: "MA", avgElectricityRateKwh: 28.5, avgMonthlyElectric: 220, avgMonthlyInternet: 70, avgMonthlyWater: 70, avgMonthlyGas: 95 },
  { state: "National Average", code: "US", avgElectricityRateKwh: 16.8, avgMonthlyElectric: 152, avgMonthlyInternet: 64, avgMonthlyWater: 65, avgMonthlyGas: 68 },
];

export interface SampleBillScenario {
  id: string;
  name: string;
  provider: string;
  category: string;
  amount: number;
  rawText: string;
}

export const SAMPLE_BILLS: SampleBillScenario[] = [
  {
    id: "comcast-cable",
    name: "Xfinity / Comcast Triple Play (Expired Promo + Hidden Fees)",
    provider: "Xfinity Comcast",
    category: "Cable & Internet",
    amount: 184.50,
    rawText: `Xfinity Monthly Statement
Account: #8495-201-92384
Billing Period: March 1 - March 31
- Performance Pro+ Internet (up to 300 Mbps): $75.00
- Digital Preferred TV: $60.00
- Broadcast TV Fee: $23.20
- Regional Sports Fee: $15.85
- Modem Rental Fee (xFi Gateway): $15.00
- Regulatory Cost Recovery Fee: $3.45
- Franchise Fee: $4.50
- County / State Communications Tax: $7.50
Total Amount Due: $184.50 (Previous month was $115.00 before promotion expiration)`
  },
  {
    id: "medical-er",
    name: "Hospital Emergency Room (Surprise Out-of-Network Facility Fee)",
    provider: "Metro General Hospital",
    category: "Medical & Hospital",
    amount: 3420.00,
    rawText: `Itemized Statement - Patient Account #MG-99214-B
Date of Service: Feb 14
Diagnosis: Acute abdominal pain (resolved, viral gastroenteritis)
- CPT 99284: Emergency Dept Visit Level 4 (Out-of-Network Phys): $1,450.00
- Revenue Code 0450: Emergency Room Facility Fee: $1,250.00
- CPT 80053: Comprehensive Metabolic Panel (Lab): $320.00
- Pharmacy / IV Saline 1000ml (Administered): $280.00
- Administrative Surcharge & Record Prep: $120.00
Total Billed to Patient: $3,420.00
Insurance Paid: $0.00 (Out-of-network facility determination)`
  },
  {
    id: "phone-carrier",
    name: "Verizon Wireless (Device Protection & Mystery Surcharges)",
    provider: "Verizon",
    category: "Mobile Phone",
    amount: 142.15,
    rawText: `Verizon Wireless Bill
Account #VZW-774-883-12
- Unlimited Plus Plan (1 line): $80.00
- Verizon Mobile Protect Insurance: $17.00
- Carrier Administrative & Telco Recovery Charge: $3.30
- Federal Universal Service Fund Surcharge: $5.40
- State 911 / E911 Equalization Surcharge: $2.45
- Late Payment Adjustment Fee: $10.00
- Apple Music & Cloud Bundle (Auto-enrolled trial): $14.00
- Estimated Sales Taxes: $10.00
Total Due: $142.15`
  }
];

export interface VideoPreset {
  id: string;
  title: string;
  source: string;
  duration: string;
  url: string;
  summary: string;
  highlightTrap: string;
}

export const SAMPLE_VIDEOS: VideoPreset[] = [
  {
    id: "user-video-1",
    title: "How Boring Utility Sites Make $20k/Mo (No Coding Blueprint)",
    source: "YouTube (Reference: nvP2VenJ5ws / 1Bvz8oItqGY)",
    duration: "14:22",
    url: "https://www.youtube.com/watch?v=nvP2VenJ5ws",
    summary: "Reveals how single-purpose utility sites (IsItDown, Word Unscrambler, Bill Splitters) capture high-intent Google search queries and convert them into $20k-$50k monthly passive income via AdSense, affiliate tools, and zero friction UI.",
    highlightTrap: "Utility arbitrage: High search volume, zero registration barrier, high engagement."
  },
  {
    id: "user-video-2",
    title: "How a Boring Utility Site Earns $6M/Year (Scaling Niche Arbitrage)",
    source: "YouTube (Reference: nQOGK72IHx8)",
    duration: "18:05",
    url: "https://www.youtube.com/watch?v=nQOGK72IHx8",
    summary: "Breaks down the unit economics of web utilities: ranking for long-tail search terms on Google, leveraging high RPM financial/utility affiliate banners, and driving viral peer-to-peer sharing.",
    highlightTrap: "Affiliate monetization, high RPM niches ($50+ vs gaming $2), programmatic landing pages."
  },
  {
    id: "medical-dispute-hack",
    title: "Disputing Hospital Emergency Bills to $0 Under No Surprises Act",
    source: "Consumer Rights Viral Breakdown",
    duration: "08:45",
    url: "https://www.youtube.com/watch?v=1Bvz8oItqGY&t=687s",
    summary: "Step-by-step breakdown of how hospitals bill unbundled CPT codes and out-of-network emergency facility fees, and the exact federal statutes (42 U.S.C. 300gg-111) to quote when requesting itemized ledger audits.",
    highlightTrap: "Unbundled charges, 501(r) financial assistance charity care threshold."
  }
];

export const MARKET_RESEARCH_DOSSIER = {
  domain: "itsmybill.com",
  brandEquity: "Ultra-memorable, authoritative 3-word consumer domain. Represents ownership, consumer frustration ('Wait, that's MY bill?'), and clarity.",
  totalMonthlySearchDemand: "1,850,000+ searches across high-intent bill utility queries",
  targetKeywords: [
    { keyword: "bill splitter", volume: "450,000/mo", cpc: "$1.40", competition: "Medium", intent: "Commercial / Utility" },
    { keyword: "medical bill dispute letter", volume: "90,000/mo", cpc: "$6.80", competition: "Low-Medium", intent: "High Transactional" },
    { keyword: "no surprises act dispute", volume: "45,000/mo", cpc: "$5.20", competition: "Low", intent: "Legal / Actionable" },
    { keyword: "lower my cable bill script", volume: "60,000/mo", cpc: "$4.10", competition: "Low", intent: "High Intent" },
    { keyword: "roommate bill calculator", volume: "120,000/mo", cpc: "$2.10", competition: "Medium", intent: "Social Utility" },
    { keyword: "electricity bill calculator by state", volume: "210,000/mo", cpc: "$3.50", competition: "Low-Medium", intent: "Informational / Utility" },
  ],
  monetizationRPM: {
    generalAdSense: "$8 - $18 RPM",
    financialAffiliates: "$45 - $95 RPM (Rocket Money, Experian, Credit Karma, Billshark, High-Yield Savings)",
    legalConsumerReferral: "$120 - $250 CPA per resolved debt/dispute consultation",
  },
  wildNicheStrategies: [
    {
      title: "1. The Income-Weighted Roommate Equity Splitter",
      description: "Standard splitters divide by 2 or 3. Real roommates have income inequality ($120k vs $45k). ItsMyBill calculates fair proportional burden, eliminating household tension and going viral on TikTok/Reddit.",
      virality: "10/10 - Shared across college campuses, Reddit r/personalfinance, and apartment communities."
    },
    {
      title: "2. The AI Line-Item Fee Auditor & Whistleblower",
      description: "Users paste their statements or line items; our AI auditor immediately uncovers hidden fees, expired promotional rate cliffs, and generates the exact phone negotiation script to tell customer retention.",
      virality: "9.5/10 - Web utility combining instant fee detection with legal dispute letter generation."
    },
    {
      title: "3. The Federal 'No Surprises Act' 1-Click Dispute Generator",
      description: "Medical debt is the #1 cause of personal bankruptcy in the US. By providing a 100% free legal letter generator citing 42 U.S.C. 300gg-111, ItsMyBill earns #1 Google rank for high-intent medical debt searches.",
      virality: "9.8/10 - High PR potential, backlinked by consumer advocacy blogs and patient groups."
    }
  ]
};
