import React from 'react';
import { ShieldCheck, ExternalLink, Lock, BookOpen, UserCheck, Calculator } from 'lucide-react';
import { ENTITY_CONFIG, PRIMARY_GOV_SOURCES_LIST, AUTHORS_LIST, getAuthorBySlug } from '../data/trustData';
import { PageFAQ } from './PageFAQ';

interface TrustPageProps {
  page: 'about' | 'editorial-policy' | 'methodology' | 'author';
  authorSlug?: string | null;
  onNavigate: (path: string) => void;
}

export const TrustPages: React.FC<TrustPageProps> = ({ page, authorSlug, onNavigate }) => {
  const linkProps = (path: string) => ({
    href: path,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      onNavigate(path);
    },
  });

  if (page === 'about') {
    return (
      <article className="space-y-8 max-w-4xl mx-auto">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex items-center gap-2">
          <a {...linkProps('/')} className="hover:text-emerald-400">Home</a>
          <span>/</span>
          <span className="text-slate-200">About ItsMyBill</span>
        </nav>

        <header className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Entity Transparency · Privacy-First Consumer Utility
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About {ENTITY_CONFIG.brandName}
          </h1>
          <p data-speakable="true" className="text-sm sm:text-base text-slate-200 leading-relaxed">
            {ENTITY_CONFIG.legalName} operates {ENTITY_CONFIG.domain} as an independent, 100% client-side U.S. consumer utility platform helping households audit hidden telecom and medical fees, compare official state utility rate benchmarks, calculate income-fair shared expenses, and draft statutory dispute letters—without ever requiring accounts, bank logins, or server uploads of private financial data.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span>Zero-Upload Privacy Guarantee</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {ENTITY_CONFIG.privacyCommitment} We never ask for Plaid credentials, Social Security numbers, credit card details, or online banking passwords.
            </p>
          </div>

          <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Funding &amp; Monetization Disclosure</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {ENTITY_CONFIG.monetizationDisclosure} Editorial benchmarks, utility rankings, and statutory dispute guides are never altered for advertisers or carriers.
            </p>
          </div>
        </section>

        <section className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Editorial &amp; Review Desks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AUTHORS_LIST.map((auth) => (
              <a
                key={auth.slug}
                {...linkProps(`/authors/${auth.slug}/`)}
                className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 space-y-1.5 transition-colors"
              >
                <div className="text-sm font-bold text-white">{auth.name}</div>
                <div className="text-xs text-emerald-400">{auth.role}</div>
                <div className="text-[11px] text-slate-400">{auth.credentials}</div>
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-800 text-xs text-slate-300">
            <strong>Direct Contact &amp; Corrections:</strong>{' '}
            <a href={`mailto:${ENTITY_CONFIG.contactEmail}`} className="text-emerald-400 underline underline-offset-4">
              {ENTITY_CONFIG.contactEmail}
            </a>{' '}
            · Operating Jurisdiction: {ENTITY_CONFIG.jurisdiction}
          </div>
        </section>
      </article>
    );
  }

  if (page === 'editorial-policy') {
    return (
      <article className="space-y-8 max-w-4xl mx-auto">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex items-center gap-2">
          <a {...linkProps('/')} className="hover:text-emerald-400">Home</a>
          <span>/</span>
          <span className="text-slate-200">Editorial &amp; Fact-Checking Policy</span>
        </nav>

        <header className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            YMYL Governance · Verification &amp; Corrections Standards
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Editorial, Fact-Checking &amp; Corrections Policy
          </h1>
          <p data-speakable="true" className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Because household billing disputes and personal finance tools impact real financial decisions (Your Money or Your Life), ItsMyBill enforces strict primary-source verification against official U.S. government statutes, federal agency rules, and published statistical tables.
          </p>
        </header>

        <section className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-5 text-sm text-slate-300 leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Primary Source Hierarchy</h2>
            <p>
              Every statutory citation and benchmark table on ItsMyBill must trace directly to primary authorities: the United States Code (U.S.C.), Code of Federal Regulations (C.F.R.), state statutory codes, U.S. Energy Information Administration (EIA) tables, CMS No Surprises Act portals, FCC Truth-in-Billing rules, CFPB regulations, and state Public Utility Commission filings. We never fabricate citations, rates, or legal outcomes.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Transparent Credential &amp; Review Labeling</h2>
            <p>
              We do not invent fake personas or unverified credentials. Every consumer rights guide and dispute letter page clearly discloses its authorship (ItsMyBill Editorial Research Team) and current review status—transparently labeled as <em>Pending Credentialed Review</em> until reviewed and signed off by a licensed consumer protection attorney, CPA, or Certified Financial Planner (CFP).
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Scheduled Re-Verification &amp; Corrections</h2>
            <p>
              Utility rate tables, state security deposit deadlines, and federal statutory rules are audited semi-annually against newly published EIA Electric Power Monthly releases and state legislative updates. If you spot a stale state tariff, updated carrier fee, or statutory amendment, email{' '}
              <a href={`mailto:${ENTITY_CONFIG.contactEmail}`} className="text-emerald-400 underline underline-offset-4">
                {ENTITY_CONFIG.contactEmail}
              </a>{' '}
              with the primary source link; verified corrections are logged and updated within 72 hours.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Non-Legal &amp; Non-Fiduciary Educational Scope</h2>
            <p>
              ItsMyBill is a consumer software utility and educational publisher—not a law firm, CPA firm, or licensed credit repair organization. Nothing published on this domain constitutes individualized legal representation or guaranteed dispute outcomes.
            </p>
          </div>
        </section>
      </article>
    );
  }

  if (page === 'methodology') {
    return (
      <article className="space-y-8 max-w-4xl mx-auto">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex items-center gap-2">
          <a {...linkProps('/')} className="hover:text-emerald-400">Home</a>
          <span>/</span>
          <span className="text-slate-200">Data Sources &amp; Methodology</span>
        </nav>

        <header className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Reproducible Formulas &amp; Live Primary .gov Citations
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Data Sources, Units &amp; Calculation Methodology
          </h1>
          <p data-speakable="true" className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Every benchmark figure, mathematical bill-splitting formula, and statutory notice on ItsMyBill distinguishes clearly between published primary U.S. government statistics and deterministic client-side application calculations.
          </p>
        </header>

        {/* Exact Mathematical Formulas */}
        <section className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <span>Exact Client-Side Mathematical Formulas</span>
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="font-bold text-white">1. Income-Proportional Household Split (Cent-Exact)</div>
              <code className="block font-mono text-emerald-400 text-xs">
                Individual Share = round_cents(Total Shared Bill × (Individual Net Income ÷ Combined Net Income))
              </code>
              <p className="text-xs text-slate-400">
                Any ±$0.01 rounding remainder is reconciled automatically onto the highest-earning member so allocated shares always equal the exact invoice total.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="font-bold text-white">2. Itemized Receipt Proportional Tax &amp; Tip Multiplier</div>
              <code className="block font-mono text-emerald-400 text-xs">
                Multiplier = (Food Subtotal + Sales Tax + Pre-Tax Tip) ÷ Food Subtotal
              </code>
              <p className="text-xs text-slate-400">
                Each diner&rsquo;s individual food subtotal (including exact fractions of shared appetizers/drinks) is multiplied by this factor so tax and tip scale strictly with consumption.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="font-bold text-white">3. Annual State Utility Cost Variance</div>
              <code className="block font-mono text-emerald-400 text-xs">
                Annual Overpay Estimate = max(0, (User Combined 4 Utilities − State 4-Utility Baseline) × 12)
              </code>
              <p className="text-xs text-slate-400">
                Combined baselines sum state electricity (EIA Form EIA-861M), natural gas (EIA/AGA), standalone 100–300 Mbps broadband (FCC Urban Rate Survey), and single-family water/sewer (~6,000 gal/mo, AWWA/EPA).
              </p>
            </div>
          </div>
        </section>

        {/* Live Outbound .gov Sources Table */}
        <section className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>Primary Government &amp; Regulatory Reference Directory</span>
          </h2>
          <div className="divide-y divide-slate-800">
            {PRIMARY_GOV_SOURCES_LIST.map((src) => (
              <div key={src.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-white">{src.name}</div>
                  <div className="text-xs text-slate-400">
                    {src.agency} · {src.scope} · Cadence: {src.cadence}
                  </div>
                </div>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 shrink-0 underline underline-offset-4"
                >
                  <span>Verify Official Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>

        <PageFAQ
          heading="Methodology & Data Transparency FAQs"
          items={[
            {
              question: 'Why does ItsMyBill separate EIA electricity data from broadband and water sources?',
              answer:
                'The U.S. Energy Information Administration (EIA) publishes authoritative residential electricity and natural gas statistics—it does not track broadband or municipal water rates. ItsMyBill strictly cites EIA for energy, the FCC Urban Rate Survey for broadband, and AWWA/EPA utility surveys for water.',
            },
            {
              question: 'Are ItsMyBill utility totals exact predictions of my individual home bill?',
              answer:
                'No. State averages establish realistic baseline medians. Actual household bills vary by home square footage, HVAC efficiency, local municipal taxes, and utility tariff tiers.',
            },
          ]}
        />
      </article>
    );
  }

  // Author / Desk Bio Profile (/authors/[slug]/)
  const author = getAuthorBySlug(authorSlug || '') || AUTHORS_LIST[0];
  const otherAuthors = AUTHORS_LIST.filter((a) => a.slug !== author.slug);

  return (
    <article className="space-y-8 max-w-4xl mx-auto">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex items-center gap-2">
        <a {...linkProps('/')} className="hover:text-emerald-400">Home</a>
        <span>/</span>
        <a {...linkProps('/about/')} className="hover:text-emerald-400">About</a>
        <span>/</span>
        <span className="text-slate-200">{author.name}</span>
      </nav>

      <header className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <UserCheck className="w-4 h-4" />
          <span>{author.reviewStatus}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{author.name}</h1>
        <p className="text-sm font-semibold text-slate-300">
          {author.role} · {author.credentials}
        </p>
        <p data-speakable="true" className="text-sm sm:text-base text-slate-200 leading-relaxed">
          {author.bio}
        </p>
      </header>

      <section className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Areas of Focus &amp; Verification Scope</h2>
        <ul className="space-y-2 text-sm text-slate-300">
          {author.focusAreas.map((area) => (
            <li key={area} className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">·</span>
              <span>{area}</span>
            </li>
          ))}
        </ul>
        <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-4 text-xs font-semibold">
          <a {...linkProps('/editorial-policy/')} className="text-emerald-400 underline underline-offset-4">
            Read Editorial Policy
          </a>
          <a {...linkProps('/methodology/')} className="text-emerald-400 underline underline-offset-4">
            Inspect Data Methodology
          </a>
          {otherAuthors.map((oa) => (
            <a key={oa.slug} {...linkProps(`/authors/${oa.slug}/`)} className="text-slate-300 hover:text-white underline underline-offset-4">
              View {oa.name}
            </a>
          ))}
        </div>
      </section>
    </article>
  );
};
