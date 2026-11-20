export interface AuthorProfile {
  slug: string;
  name: string;
  role: string;
  credentials: string;
  reviewStatus: string;
  bio: string;
  expertise: string[];
  focusAreas: string[];
  sameAs: string[];
  lastUpdated: string;
}

export interface PrimarySource {
  id: string;
  name: string;
  label: string;
  agency: string;
  url: string;
  citation: string;
  scope: string;
  cadence: string;
}

export const ENTITY_CONFIG = {
  brandName: 'ItsMyBill',
  legalName: 'ItsMyBill Consumer Utilities',
  domain: 'https://www.itsmybill.com',
  operatingEntity: 'ItsMyBill Consumer Research (Founder-Operated)',
  contactEmail: 'contact.team.starsclub@gmail.com',
  businessLocation: 'United States',
  jurisdiction: 'United States',
  monetizationDisclosure:
    '100% free consumer utility funded independently. No bank-login harvesting, no paid carrier placements, and no commission fees on bill reductions.',
  privacyGuarantee:
    'All calculators, bill fee reviews, receipt splits, savings logs, and dispute letter drafts execute 100% client-side in your browser. Zero PII or uploaded statement text is ever transmitted to a backend server.',
  privacyCommitment:
    'All calculators, bill fee reviews, receipt splits, savings logs, and dispute letter drafts execute 100% client-side in your browser. Zero PII or uploaded statement text is ever transmitted to a backend server.',
  lastSiteAuditDate: '2026-11-20',
  lastVerified: '2026-11-20',
};

export const PRIMARY_GOV_SOURCES: Record<string, PrimarySource> = {
  eiaElectricity: {
    id: 'eia-electricity',
    name: 'U.S. EIA Electric Power Monthly (Table 5.6.A)',
    label: 'U.S. EIA Electric Power Monthly (Table 5.6.A)',
    agency: 'U.S. Energy Information Administration',
    url: 'https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a',
    citation: 'Form EIA-861M residential average retail price of electricity by state (cents/kWh)',
    scope: '50-State + D.C. Residential Electricity Rates (¢/kWh)',
    cadence: 'Monthly / Semi-Annual Table Sync',
  },
  eiaNaturalGas: {
    id: 'eia-natural-gas',
    name: 'U.S. EIA Natural Gas Monthly Residential Prices',
    label: 'U.S. EIA Natural Gas Monthly Residential Prices',
    agency: 'U.S. Energy Information Administration',
    url: 'https://www.eia.gov/dnav/ng/ng_pri_sum_a_EPG0_PRS_DMcf_m.htm',
    citation: 'EIA residential natural gas supply and heating cost benchmarks',
    scope: 'State Residential Natural Gas Heating Benchmarks ($/mo)',
    cadence: 'Annual Heating Season Update',
  },
  fccTruthInBilling: {
    id: 'fcc-truth-in-billing',
    name: 'FCC Truth-in-Billing Rules (47 C.F.R. § 64.2401) & Urban Rate Survey',
    label: 'FCC Truth-in-Billing Rules (47 C.F.R. § 64.2401)',
    agency: 'Federal Communications Commission',
    url: 'https://www.fcc.gov/consumers/guides/understanding-your-telephone-bill',
    citation: 'FCC broadband consumer labels, urban rate survey, and billing disclosure standards',
    scope: 'Telecom Surcharge Disclosures & Standalone 100–300 Mbps Broadband Benchmarks',
    cadence: 'Annual Urban Rate Survey',
  },
  cmsNoSurprises: {
    id: 'cms-no-surprises',
    name: 'CMS No Surprises Act Consumer Protections (42 U.S.C. § 300gg-111)',
    label: 'CMS No Surprises Act Consumer Protections',
    agency: 'Centers for Medicare & Medicaid Services',
    url: 'https://www.cms.gov/medical-bill-rights',
    citation: '42 U.S.C. § 300gg-111 & 45 C.F.R. Part 149 emergency and facility balance billing protections',
    scope: 'Emergency Room, Out-of-Network Ancillary & Good Faith Estimate Disputes',
    cadence: 'Continuous Statutory Monitoring',
  },
  cfpbDebtBilling: {
    id: 'cfpb-debt-billing',
    name: 'CFPB Debt Collection (FDCPA Reg F) & Credit Billing Rights',
    label: 'CFPB Debt Collection & Credit Billing Rights',
    agency: 'Consumer Financial Protection Bureau',
    url: 'https://www.consumerfinance.gov/consumer-tools/debt-collection/',
    citation: 'Fair Credit Billing Act (15 U.S.C. § 1666) & FDCPA Regulation F (12 C.F.R. Part 1006)',
    scope: '30-Day Debt Validation & 60-Day Credit Billing Error Protections',
    cadence: 'Continuous Statutory Monitoring',
  },
  ftcBilling: {
    id: 'ftc-billing',
    name: 'FTC Disputing Credit Card Charges (FCBA 15 U.S.C. § 1666)',
    label: 'FTC Disputing Credit Card Charges',
    agency: 'Federal Trade Commission',
    url: 'https://consumer.ftc.gov/articles/using-credit-cards-and-disputing-charges',
    citation: 'Statutory 60-day written billing error notice procedures under 15 U.S.C. § 1666',
    scope: 'Revolving Credit Card Billing Errors & Written Notice Deadlines',
    cadence: 'Continuous Statutory Monitoring',
  },
  irs501r: {
    id: 'irs-501r',
    name: 'IRS Section 501(r) Nonprofit Hospital Financial Assistance',
    label: 'IRS Section 501(r) Hospital Financial Assistance',
    agency: 'Internal Revenue Service',
    url: 'https://www.irs.gov/charities-non-profits/financial-assistance-policy-and-emergency-medical-care-policy-section-501r4',
    citation: '26 U.S.C. § 501(r) requirements for tax-exempt charitable hospitals',
    scope: 'Nonprofit Hospital Charity Care & Amounts Generally Billed (AGB) Caps',
    cadence: 'Annual IRS Rule Check',
  },
  epaWater: {
    id: 'epa-water',
    name: 'EPA WaterSense & AWWA Municipal Water Rate Surveys',
    label: 'EPA WaterSense & AWWA Municipal Rate Surveys',
    agency: 'U.S. Environmental Protection Agency',
    url: 'https://www.epa.gov/watersense/statistics-and-facts',
    citation: 'Single-family residential water consumption and municipal utility rate medians',
    scope: 'Single-Family Water & Sewer Benchmarks (~6,000 gal/mo)',
    cadence: 'Biennial Rate Survey Sync',
  },
};

export const PRIMARY_GOV_SOURCES_LIST: PrimarySource[] = Object.values(PRIMARY_GOV_SOURCES);

export const AUTHORS: Record<string, AuthorProfile> = {
  'itsmybill-editorial-team': {
    slug: 'itsmybill-editorial-team',
    name: 'ItsMyBill Editorial & Research Team',
    role: 'Consumer Billing Data & Tools Desk',
    credentials: 'Primary-Source Statutory & Public Tariff Analysts',
    reviewStatus: 'Verified against primary .gov tables and U.S. Code citations',
    bio: 'The ItsMyBill Editorial & Research Team builds zero-login household finance calculators and audits public utility tariffs, federal billing statutes, and carrier fee schedules for U.S. consumers. Every benchmark dataset and template is checked directly against primary government records including EIA Form EIA-861M, FCC Truth-in-Billing regulations, CMS No Surprises Act guidance, and CFPB Regulation F.',
    expertise: [
      'U.S. residential utility tariff benchmarking (EIA, FCC, AWWA)',
      'Telecom & cable ancillary surcharge analysis',
      'Client-side proportional expense splitting mathematics',
      'Federal consumer billing & debt validation documentation',
    ],
    focusAreas: [
      'U.S. residential utility tariff benchmarking (EIA, FCC, AWWA)',
      'Telecom & cable ancillary surcharge analysis',
      'Client-side proportional expense splitting mathematics',
      'Federal consumer billing & debt validation documentation',
    ],
    sameAs: ['https://www.itsmybill.com/about/', 'https://www.itsmybill.com/editorial-policy/'],
    lastUpdated: '2026-11-20',
  },
  'consumer-rights-review-desk': {
    slug: 'consumer-rights-review-desk',
    name: 'Consumer Rights Statutory Review Desk',
    role: 'YMYL Compliance & Verification Reviewer',
    credentials: 'Pending Credentialed Review (CFP / Esq. Advisory Slot Ready)',
    reviewStatus: 'Pending Credentialed External Review — Primary .gov Citations Verified',
    bio: 'This dedicated review slot tracks independent verification of statutory citations, deadlines, and household financial formulas published across ItsMyBill. In accordance with our strict E-E-A-T Editorial Policy, we never fabricate external credentials; this reviewer profile is transparently marked as Pending Credentialed External Review while all statutory code references are cross-checked directly against U.S.C., C.F.R., CMS, CFPB, and state PUC publications.',
    expertise: [
      'No Surprises Act (42 U.S.C. § 300gg-111) scope verification',
      'Fair Credit Billing Act (15 U.S.C. § 1666) deadline compliance',
      'Fair Debt Collection Practices Act (15 U.S.C. § 1692g) validation standards',
      'State Public Utility Commission & landlord-tenant statutory checks',
    ],
    focusAreas: [
      'No Surprises Act (42 U.S.C. § 300gg-111) scope verification',
      'Fair Credit Billing Act (15 U.S.C. § 1666) deadline compliance',
      'Fair Debt Collection Practices Act (15 U.S.C. § 1692g) validation standards',
      'State Public Utility Commission & landlord-tenant statutory checks',
    ],
    sameAs: ['https://www.itsmybill.com/editorial-policy/', 'https://www.itsmybill.com/methodology/'],
    lastUpdated: '2026-11-20',
  },
};

export const AUTHORS_LIST: AuthorProfile[] = Object.values(AUTHORS);

export function getAuthorBySlug(slug: string): AuthorProfile | undefined {
  return AUTHORS[slug];
}
