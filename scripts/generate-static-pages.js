import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const docsDir = path.resolve(rootDir, 'docs');
const publicDir = path.resolve(rootDir, 'public');

const DOMAIN = 'https://www.itsmybill.com';
const TODAY_ISO = '2026-11-20';
const CONTACT_EMAIL = 'contact.team.starsclub@gmail.com';

const baseHtmlPath = path.resolve(distDir, 'index.html');
if (!fs.existsSync(baseHtmlPath)) {
  console.error('dist/index.html does not exist. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');

// Load single-source-of-truth JSON datasets
const stateBenchmarksJson = JSON.parse(
  fs.readFileSync(path.resolve(rootDir, 'src', 'data', 'stateBenchmarks.json'), 'utf8')
);
const providerAudits = JSON.parse(
  fs.readFileSync(path.resolve(rootDir, 'src', 'data', 'providerAudits.json'), 'utf8')
);
const coreDisputeTemplates = JSON.parse(
  fs.readFileSync(path.resolve(rootDir, 'src', 'data', 'disputeTemplates.json'), 'utf8')
);
const editorialGuidesJson = JSON.parse(
  fs.readFileSync(path.resolve(rootDir, 'src', 'data', 'editorialGuides.json'), 'utf8')
);
const blogPosts = JSON.parse(
  fs.readFileSync(path.resolve(rootDir, 'src', 'data', 'blogPosts.json'), 'utf8')
);

const NAT_BASELINE = stateBenchmarksJson.metadata.nationalBaseline;
const STATE_BENCHMARKS = stateBenchmarksJson.states;
const EDITORIAL_HUBS = editorialGuidesJson.hubs;

const sortedByRateDesc = [...STATE_BENCHMARKS].sort(
  (a, b) => b.avgElectricityRateKwh - a.avgElectricityRateKwh
);
const sortedByTotalDesc = [...STATE_BENCHMARKS].sort(
  (a, b) => getStateCombined(b) - getStateCombined(a)
);

function getStateCombined(st) {
  return st.avgMonthlyElectric + st.avgMonthlyGas + st.avgMonthlyWater + st.avgMonthlyInternet;
}

function getStateRateRank(slug) {
  return sortedByRateDesc.findIndex((s) => s.slug === slug) + 1;
}

function getStateTotalRank(slug) {
  return sortedByTotalDesc.findIndex((s) => s.slug === slug) + 1;
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeXml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function estimateWordCount(post) {
  const chunks = [
    post.title,
    post.directAnswer,
    ...(post.keyTakeaways || []),
    ...(post.sections || []).flatMap((s) => [
      s.heading,
      ...(s.paragraphs || []),
      ...(s.bullets || []),
      ...(s.numberedSteps || []),
      ...(s.scriptBox ? [s.scriptBox.title, s.scriptBox.body] : []),
      ...(s.table ? [s.table.caption, ...s.table.headers, ...s.table.rows.flat()] : []),
    ]),
    ...(post.faqs || []).flatMap((f) => [f.question, f.answer]),
  ];
  return chunks.join(' ').trim().split(/\s+/).length;
}

const ORG_NODE = {
  '@type': 'Organization',
  '@id': `${DOMAIN}/#organization`,
  name: 'ItsMyBill Consumer Utilities',
  alternateName: 'ItsMyBill',
  url: `${DOMAIN}/`,
  logo: { '@type': 'ImageObject', url: `${DOMAIN}/favicon-48x48.png` },
  email: CONTACT_EMAIL,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'consumer support',
    email: CONTACT_EMAIL,
    availableLanguage: ['English'],
  },
  sameAs: [`${DOMAIN}/about/`, `${DOMAIN}/editorial-policy/`, `${DOMAIN}/methodology/`],
};

const WEBSITE_NODE = {
  '@type': 'WebSite',
  '@id': `${DOMAIN}/#website`,
  url: `${DOMAIN}/`,
  name: 'ItsMyBill',
  inLanguage: 'en-US',
  publisher: { '@id': `${DOMAIN}/#organization` },
};

const AUTHOR_TEAM_NODE = {
  '@type': 'Person',
  name: 'ItsMyBill Editorial & Research Team',
  url: `${DOMAIN}/authors/itsmybill-editorial-team/`,
  sameAs: [`${DOMAIN}/about/`, `${DOMAIN}/editorial-policy/`],
};

const REVIEWER_DESK_NODE = {
  '@type': 'Person',
  name: 'Consumer Rights Statutory Review Desk',
  jobTitle: 'Pending Credentialed Review (CFP / Esq. Advisory Slot Ready)',
  url: `${DOMAIN}/authors/consumer-rights-review-desk/`,
  sameAs: [`${DOMAIN}/editorial-policy/`, `${DOMAIN}/methodology/`],
};

function buildGraph({
  canonical,
  title,
  description,
  ogImage = `${DOMAIN}/og-card.png`,
  breadcrumbs = [],
  webApp = null,
  dataset = null,
  article = null,
  webPage = null,
  faqs = [],
  extraNodes = [],
}) {
  const graph = [ORG_NODE, WEBSITE_NODE];

  if (breadcrumbs.length > 0) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: `${DOMAIN}${b.path}`,
      })),
    });
  }

  if (webApp) {
    graph.push({
      '@type': 'WebApplication',
      '@id': `${canonical}#webapp`,
      name: webApp.name,
      url: canonical,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any',
      isAccessibleForFree: true,
      description: webApp.description || description,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: webApp.featureList || [
        '100% Client-Side Private Calculations',
        'Zero Account Registration or Bank Logins',
        'Primary .gov Data & Statutory Citations',
      ],
      publisher: { '@id': `${DOMAIN}/#organization` },
    });
  }

  if (dataset) {
    graph.push({
      '@type': 'Dataset',
      '@id': `${canonical}#dataset`,
      name: dataset.name,
      description: dataset.description,
      url: canonical,
      spatialCoverage: { '@type': 'Place', name: dataset.spatialCoverage },
      temporalCoverage: dataset.temporalCoverage || '2025/2026',
      variableMeasured: dataset.variableMeasured,
      isBasedOn:
        dataset.isBasedOn ||
        'https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a',
      creator: { '@id': `${DOMAIN}/#organization` },
      license: 'https://creativecommons.org/licenses/by/4.0/',
    });
  }

  if (article) {
    graph.push({
      '@type': article.type || 'Article',
      '@id': `${canonical}#article`,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      headline: article.headline || title.replace(/\s*\|\s*ItsMyBill$/i, ''),
      description: article.description || description,
      image: [ogImage],
      datePublished: article.datePublished || '2026-09-01',
      dateModified: article.dateModified || TODAY_ISO,
      inLanguage: 'en-US',
      author: AUTHOR_TEAM_NODE,
      reviewedBy: REVIEWER_DESK_NODE,
      publisher: { '@id': `${DOMAIN}/#organization` },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', '[data-speakable="true"]'],
      },
      ...(article.extra || {}),
    });
  } else if (webPage) {
    graph.push({
      '@type': webPage.type || 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: webPage.name || title,
      description: webPage.description || description,
      isPartOf: { '@id': `${DOMAIN}/#website` },
      dateModified: TODAY_ISO,
      author: AUTHOR_TEAM_NODE,
      reviewedBy: REVIEWER_DESK_NODE,
    });
  }

  if (faqs && faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${canonical}#faq`,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }

  for (const node of extraNodes) {
    graph.push(node);
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

function applyPageMeta(htmlTemplate, opts) {
  let html = htmlTemplate;
  const {
    title,
    description,
    canonical,
    ogType = 'website',
    ogImage = `${DOMAIN}/og-card.png`,
    ogImageAlt = title,
    keywords,
    noindex = false,
    extraHeadTags = '',
    jsonLd = null,
    rootHtml,
  } = opts;

  const robotsContent = noindex
    ? 'noindex, follow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[\s\S]*?" \/>/i,
    `<meta name="description" content="${escapeHtml(description)}" />`
  );
  html = html.replace(
    /<meta name="robots" content="[\s\S]*?" \/>/i,
    `<meta name="robots" content="${robotsContent}" />`
  );
  if (keywords) {
    html = html.replace(
      /<meta name="keywords" content="[\s\S]*?" \/>/i,
      `<meta name="keywords" content="${escapeHtml(keywords)}" />`
    );
  }
  html = html.replace(
    /<link rel="canonical" href="[\s\S]*?" \/>/i,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`
  );
  html = html.replace(
    /<meta property="og:type" content="[\s\S]*?" \/>/i,
    `<meta property="og:type" content="${escapeHtml(ogType)}" />`
  );
  html = html.replace(
    /<meta property="og:title" content="[\s\S]*?" \/>/i,
    `<meta property="og:title" content="${escapeHtml(title)}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[\s\S]*?" \/>/i,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[\s\S]*?" \/>/i,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`
  );
  html = html.replace(
    /<meta property="og:image" content="[\s\S]*?" \/>/i,
    `<meta property="og:image" content="${escapeHtml(ogImage)}" />`
  );
  html = html.replace(
    /<meta property="og:image:alt" content="[\s\S]*?" \/>/i,
    `<meta property="og:image:alt" content="${escapeHtml(ogImageAlt)}" />`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[\s\S]*?" \/>/i,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[\s\S]*?" \/>/i,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`
  );
  html = html.replace(
    /<meta name="twitter:url" content="[\s\S]*?" \/>/i,
    `<meta name="twitter:url" content="${escapeHtml(canonical)}" />`
  );
  html = html.replace(
    /<meta name="twitter:image" content="[\s\S]*?" \/>/i,
    `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`
  );

  if (jsonLd) {
    const ldBlock = `<script id="itsmybill-schema-graph" type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n    </script>`;
    const ldRegex = /<script\s+id="itsmybill-schema-graph"\s+type="application\/ld\+json">[\s\S]*?<\/script>/i;
    if (ldRegex.test(html)) {
      html = html.replace(ldRegex, ldBlock);
    } else {
      html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, ldBlock);
    }
  }

  if (extraHeadTags) {
    html = html.replace('</head>', `${extraHeadTags}\n  </head>`);
  }

  const rootRegex = /<div id="root">[\s\S]*<\/div>(?=\s*(?:<script|<\/body>))/i;
  if (!rootRegex.test(html)) {
    throw new Error(`Could not locate <div id="root">...</div> in template for ${canonical}`);
  }
  html = html.replace(rootRegex, rootHtml);
  return html;
}

function renderBreadcrumbNav(breadcrumbs) {
  return `<nav aria-label="Breadcrumb" style="font-size: 13px; color: #94a3b8; margin-bottom: 18px;">
    ${breadcrumbs
      .map((b, i) =>
        i === breadcrumbs.length - 1
          ? `<span style="color: #e2e8f0;">${escapeHtml(b.name)}</span>`
          : `<a href="${escapeHtml(b.path)}" style="color: #34d399; text-decoration: none;">${escapeHtml(b.name)}</a>`
      )
      .join(' / ')}
  </nav>`;
}

function renderTrustBarHtml(showLegal = false) {
  return `<div style="font-size: 12px; color: #94a3b8; padding: 10px 14px; border: 1px solid #1e293b; border-radius: 10px; background: #0f172a; margin-bottom: 18px;">
    <strong style="color: #34d399;">100% Client-Side Privacy</strong> ·
    Author: <a href="/authors/itsmybill-editorial-team/" style="color: #e2e8f0; text-decoration: underline;">ItsMyBill Editorial &amp; Research Team</a> ·
    Review: <a href="/authors/consumer-rights-review-desk/" style="color: #cbd5e1; text-decoration: underline;">Pending Credentialed Review</a> ·
    Verified <time datetime="${TODAY_ISO}">${TODAY_ISO}</time> ·
    <a href="/methodology/" style="color: #34d399; text-decoration: underline;">Data Methodology</a>
  </div>${
    showLegal
      ? `<p role="note" style="font-size: 12px; color: #94a3b8; padding: 10px 14px; border: 1px solid #1e293b; border-radius: 10px; background: #020617; margin-bottom: 18px;"><strong>Educational Consumer Notice:</strong> Templates and statutory citations provide general consumer-rights information—not formal legal advice. Verify account details and consult a licensed attorney for contested legal proceedings.</p>`
      : ''
  }`;
}

function renderFaqsHtml(heading, faqs) {
  if (!faqs || faqs.length === 0) return '';
  return `<section style="background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 24px; margin-top: 24px;">
    <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 14px;">${escapeHtml(heading)}</h2>
    ${faqs
      .map(
        (f) => `<div style="margin-bottom: 14px;">
      <h3 style="font-size: 16px; font-weight: 700; color: #f8fafc; margin-bottom: 4px;">${escapeHtml(f.question)}</h3>
      <p style="color: #cbd5e1; margin: 0;">${escapeHtml(f.answer)}</p>
    </div>`
      )
      .join('\n')}
  </section>`;
}

function wrapPageShell(innerHtml) {
  return `<div id="root">
    <div style="max-width: 1120px; margin: 0 auto; padding: 36px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc; line-height: 1.65;">
      ${innerHtml}
      <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #1e293b; font-size: 13px; color: #94a3b8;">
        <a href="/" style="color: #34d399;">Home</a> ·
        <a href="/bill-auditor/" style="color: #34d399;">Bill Auditor</a> ·
        <a href="/dispute-letter-generator/" style="color: #34d399;">Dispute Letters</a> ·
        <a href="/utility-benchmarks/" style="color: #34d399;">50-State Utility Benchmarks</a> ·
        <a href="/income-based-bill-splitter/" style="color: #34d399;">Income Splitter</a> ·
        <a href="/guides/" style="color: #34d399;">Consumer Hubs</a> ·
        <a href="/blog/" style="color: #34d399;">Blog</a> ·
        <a href="/reports/2026-us-utility-and-junk-fee-report/" style="color: #fbbf24;">2026 Report</a> ·
        <a href="/about/" style="color: #cbd5e1;">About</a> ·
        <a href="/editorial-policy/" style="color: #cbd5e1;">Editorial Policy</a> ·
        <a href="/methodology/" style="color: #cbd5e1;">Methodology</a>
      </footer>
    </div>
  </div>`;
}

function writeRoutePage(routePath, html) {
  const cleanRel = routePath.replace(/^\/+|\/+$/g, '');
  const targetDir = cleanRel ? path.resolve(distDir, cleanRel) : distDir;
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.resolve(targetDir, 'index.html'), html, 'utf8');
}

const sitemapCore = [];
const sitemapStates = [];
const sitemapProviders = [];
const sitemapDisputes = [];
const sitemapGuides = [];

let totalGeneratedPages = 0;

console.log('Generating static pre-rendered HTML for all 160+ ItsMyBill routes...');

// =========================================================================
// 0. ENRICH HOMEPAGE (/) with complete crawlable directory links
// =========================================================================
{
  const homeCanonical = `${DOMAIN}/`;
  const homeTitle = 'ItsMyBill — Free Bill Fee Auditor, State Utility Benchmarks & Dispute Letters';
  const homeDesc =
    'Audit hidden telecom and hospital fees, benchmark 50-state EIA utility rates, split bills by income, and draft statutory dispute letters 100% locally.';
  const homeFaqs = [
    {
      question: 'Does ItsMyBill upload my bills or personal financial inputs to a server?',
      answer:
        'No. Every calculator, line-item fee auditor, dispute letter generator, and savings tracker on ItsMyBill runs 100% locally inside your web browser. Zero bill text, account numbers, salaries, or names are ever sent to or stored on our servers.',
    },
    {
      question: 'Which federal and state consumer statutes do your dispute templates cover?',
      answer:
        'Our free drafting templates cover the federal No Surprises Act (42 U.S.C. § 300gg-111), nonprofit hospital charity care under IRC § 501(r), Fair Credit Billing Act (15 U.S.C. § 1666), Fair Debt Collection Practices Act (15 U.S.C. § 1692g), FCC Truth-in-Billing (47 C.F.R. § 64.2401), state Public Utility Commission tariff reviews, and all 50 states + D.C. residential security deposit return statutes.',
    },
    {
      question: 'Where do the 50-state utility rate benchmarks come from?',
      answer:
        'Electricity rates (¢/kWh) are sourced from U.S. Energy Information Administration (EIA) Form EIA-861M (Electric Power Monthly, Table 5.6.A). Natural gas reflects EIA/AGA residential heating averages, broadband reflects FCC Urban Rate Survey 100–300 Mbps benchmarks, and water reflects AWWA/EPA single-family utility medians.',
    },
    {
      question: 'How is ItsMyBill free without requiring bank logins or account sign-ups?',
      answer:
        'ItsMyBill is an independent, founder-funded consumer utility platform designed for zero-friction self-advocacy. We never ask for bank passwords, Plaid links, Social Security numbers, or credit cards.',
    },
  ];

  const homeInner = `
    ${renderTrustBarHtml(false)}
    <header style="margin-bottom: 28px;">
      <h1 style="font-size: 36px; font-weight: 800; color: #10b981; margin-bottom: 12px;">Audit Hidden Fees, Benchmark State Utility Rates &amp; Defend Your Consumer Rights</h1>
      <p data-speakable="true" style="font-size: 17px; color: #cbd5e1;">ItsMyBill is a free, privacy-first U.S. consumer bill defense hub. Audit telecom and hospital statements for avoidable surcharges, compare monthly utilities against official EIA Table 5.6.A benchmarks (U.S. average ${NAT_BASELINE.avgElectricityRateKwh}¢/kWh; $${NAT_BASELINE.avgCombinedMonthly}/month combined), split shared household expenses proportionally by income, and generate print-ready statutory dispute letters—entirely inside your browser with zero server uploads.</p>
    </header>
    <main style="display: grid; gap: 22px;">
      <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="font-size: 22px; font-weight: 700; color: #f8fafc; margin-bottom: 10px;">Core Client-Side Consumer Utilities</h2>
        <ul style="list-style: none; padding: 0; display: grid; gap: 8px;">
          <li><a href="/bill-auditor/" style="color: #34d399; font-weight: 700;">Line-Item Bill Fee Auditor</a> — Scan telecom, cable, utility, and hospital bills locally for junk fees.</li>
          <li><a href="/dispute-letter-generator/" style="color: #34d399; font-weight: 700;">Statutory Dispute Letter Generator</a> — Draft Certified Mail letters citing federal &amp; state statutes.</li>
          <li><a href="/utility-benchmarks/" style="color: #34d399; font-weight: 700;">50-State Utility Cost Benchmarks</a> — Compare electric, gas, water, and broadband against EIA, FCC &amp; AWWA data.</li>
          <li><a href="/income-based-bill-splitter/" style="color: #34d399; font-weight: 700;">Income-Based Bill Splitter</a> · <a href="/bill-splitter/" style="color: #34d399;">Group Bill &amp; Tip Splitter</a> · <a href="/itemized-receipt-splitter/" style="color: #34d399;">Itemized Receipt Splitter</a></li>
          <li><a href="/savings-tracker/" style="color: #34d399; font-weight: 700;">Realized Bill Savings Tracker</a> · <a href="/reports/2026-us-utility-and-junk-fee-report/" style="color: #fbbf24; font-weight: 700;">2026 U.S. Utility &amp; Junk-Fee Report</a></li>
        </ul>
      </section>
      <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 10px;">Carrier, Utility &amp; Hospital Junk-Fee Auditors (12 Profiles)</h2>
        <ul style="list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 10px;">
          ${providerAudits
            .map(
              (p) =>
                `<li><a href="/bill-auditor/${escapeHtml(p.slug)}/" style="color: #34d399; text-decoration: underline;">${escapeHtml(p.providerName)} Fees Auditor</a></li>`
            )
            .join('\n')}
        </ul>
      </section>
      <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 10px;">Federal Statutory Dispute Letter Templates</h2>
        <ul style="list-style: none; padding: 0; display: grid; gap: 6px;">
          ${coreDisputeTemplates
            .map(
              (d) =>
                `<li><a href="/dispute-letter/${escapeHtml(d.slug)}/" style="color: #818cf8; text-decoration: underline;">${escapeHtml(d.h1)} (${escapeHtml(d.statuteCode)})</a></li>`
            )
            .join('\n')}
        </ul>
      </section>
      <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 10px;">All 50 States + D.C. Utility Cost Benchmarks (EIA Table 5.6.A)</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; font-size: 13px;">
          ${STATE_BENCHMARKS.map(
            (st) =>
              `<a href="/utility-benchmarks/${escapeHtml(st.slug)}/" style="color: #fbbf24; text-decoration: underline;">${escapeHtml(st.state)} (${st.avgElectricityRateKwh}¢/kWh)</a>`
          ).join(' · ')}
        </div>
      </section>
      <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 10px;">Consumer Topic Hubs &amp; Editorial Library</h2>
        <ul style="list-style: none; padding: 0; display: grid; gap: 6px;">
          ${EDITORIAL_HUBS.map(
            (h) =>
              `<li><a href="/guides/${escapeHtml(h.clusterSlug)}/" style="color: #34d399; text-decoration: underline;">${escapeHtml(h.title)}</a></li>`
          ).join('\n')}
          <li><a href="/guides/" style="color: #34d399; text-decoration: underline;">All Consumer Defense Topic Hubs</a> · <a href="/blog/" style="color: #34d399; text-decoration: underline;">Bills &amp; Personal Finance Blog (${blogPosts.length} Guides)</a></li>
        </ul>
      </section>
    </main>
    ${renderFaqsHtml('ItsMyBill Consumer Defense Hub — Frequently Asked Questions', homeFaqs)}
  `;

  const homeHtml = applyPageMeta(baseHtml, {
    title: homeTitle,
    description: homeDesc,
    canonical: homeCanonical,
    jsonLd: buildGraph({
      canonical: homeCanonical,
      title: homeTitle,
      description: homeDesc,
      breadcrumbs: [{ name: 'Home', path: '/' }],
      webApp: { name: 'ItsMyBill Consumer Bill Defense Suite', description: homeDesc },
      faqs: homeFaqs,
    }),
    rootHtml: wrapPageShell(homeInner),
  });
  writeRoutePage('/', homeHtml);
  sitemapCore.push({ loc: homeCanonical, lastmod: TODAY_ISO, changefreq: 'daily', priority: '1.0' });
  totalGeneratedPages++;
}

// =========================================================================
// 1. INTENT-SEPARATED SPLITTERS (3 Pages)
// =========================================================================
const splitterPages = [
  {
    path: '/bill-splitter/',
    title: 'Free Group Bill & Tip Splitter Calculator | ItsMyBill',
    description:
      'Split restaurant checks, dinner tabs, sales tax, and custom gratuities (15%, 18%, 20%, 25%) evenly with optional whole-dollar rounding—100% locally.',
    h1: 'Restaurant & Group Bill Splitter',
    directAnswer:
      'Divide any group restaurant check, vacation tab, or shared purchase equally across guests while calculating exact pre-tax or post-tax tip percentages (15%, 18%, 20%, 25%) and optional whole-dollar rounding—100% client-side in your browser.',
    formula: 'Per-Person Share = (Bill Subtotal + Sales Tax + Tip) ÷ Number of Guests',
    tableCaption: 'Worked Example: $240 Dinner Check Split Equally Among 4 Guests (8% Tax + 20% Tip)',
    headers: ['Component', 'Formula', 'Total Group', 'Per Guest (4)'],
    rows: [
      ['Food & Drink Subtotal', 'Base Check', '$240.00', '$60.00'],
      ['Sales Tax (8%)', '$240.00 × 0.08', '$19.20', '$4.80'],
      ['Gratuity (20% Pre-Tax)', '$240.00 × 0.20', '$48.00', '$12.00'],
      ['Final Total Due', 'Subtotal + Tax + Tip', '$307.20', '$76.80'],
    ],
    faqs: [
      {
        question: 'Should restaurant tips be calculated before or after sales tax?',
        answer:
          'Standard U.S. hospitality etiquette calculates tips on the pre-tax subtotal. Our calculator lets you toggle pre-tax or post-tax tip calculations and shows exact per-person totals instantly.',
      },
      {
        question: 'How do I handle group checks when some people ordered expensive drinks?',
        answer:
          'Switch to our Itemized Receipt Splitter (/itemized-receipt-splitter/) to assign individual dishes and shared appetizers so tax and tip scale proportionally with each person’s actual order.',
      },
      {
        question: 'Does ItsMyBill store or share my dinner split amounts?',
        answer:
          'No. Every calculation executes exclusively inside your local browser with zero logins or server requests.',
      },
    ],
  },
  {
    path: '/income-based-bill-splitter/',
    title: 'Income-Based Proportional Bill Splitter for Couples & Roommates | ItsMyBill',
    description:
      'Split rent, utilities, and household bills proportionally by income so each partner or roommate pays the exact same percentage of take-home pay.',
    h1: 'Income-Based Proportional Bill Splitter',
    directAnswer:
      'An income-based bill split divides shared rent, electricity, water, and groceries proportionally by each person’s net take-home pay so every partner or roommate contributes the exact same percentage of their paycheck—reconciled to the exact cent.',
    formula: 'Individual Share = Total Shared Expenses × (Individual Take-Home Pay ÷ Combined Household Income)',
    tableCaption: 'Worked Example: $3,200 Shared Monthly Rent & Utilities ($75k vs. $45k Net Incomes)',
    headers: ['Household Member', 'Annual Net Income', 'Income Weight', 'Monthly Share ($3,200)', '% of Own Paycheck'],
    rows: [
      ['Partner A', '$75,000 ($6,250/mo)', '62.50%', '$2,000.00', '32.0%'],
      ['Partner B', '$45,000 ($3,750/mo)', '37.50%', '$1,200.00', '32.0%'],
      ['Combined Total', '$120,000 ($10,000/mo)', '100.00%', '$3,200.00', '32.0%'],
    ],
    faqs: [
      {
        question: 'Should couples use gross income or net take-home pay for proportional bill splitting?',
        answer:
          'Net take-home pay (after federal/state taxes, health insurance, and mandatory payroll deductions) is generally fairer because it reflects actual spendable cash available for rent and utilities.',
      },
      {
        question: 'How does the calculator prevent $0.01 rounding mismatches?',
        answer:
          'Shares are rounded to exact cents and any ±$0.01 remainder is reconciled automatically onto the highest-earning contributor so total shares equal the exact landlord or utility invoice.',
      },
      {
        question: 'Are salaries or roommate names uploaded anywhere?',
        answer:
          'Never. All income figures and rent amounts remain strictly inside your browser session with zero backend transmission.',
      },
    ],
  },
  {
    path: '/itemized-receipt-splitter/',
    title: 'Itemized Receipt Splitter with Proportional Tax & Tip | ItsMyBill',
    description:
      'Assign individual dishes and shared appetizers to each diner and automatically scale sales tax and gratuity proportionally to each person’s order.',
    h1: 'Itemized Receipt Tax & Tip Splitter',
    directAnswer:
      'Assign each entree, drink, and shared appetizer to the exact diners who ordered it. ItsMyBill calculates a proportional tax-and-tip multiplier so lightweight eaters never subsidize expensive cocktails or steaks.',
    formula: 'Tax & Tip Multiplier = (Receipt Subtotal + Sales Tax + Tip) ÷ Receipt Subtotal',
    tableCaption: 'Worked Example: $160 Receipt with Shared Appetizer, 8.5% Tax & 20% Tip (1.285x Multiplier)',
    headers: ['Diner', 'Assigned Items', 'Food Subtotal', 'Proportional Tax & Tip', 'Exact Total Owed'],
    rows: [
      ['Alex', 'Salad ($16) + ½ Nachos ($10)', '$26.00', '$7.41', '$33.41'],
      ['Jordan', 'Steak ($48) + 2 Cocktails ($32) + ½ Nachos ($10)', '$90.00', '$25.65', '$115.65'],
      ['Sam', 'Pasta ($28) + Iced Tea ($4) + Dessert ($12)', '$44.00', '$12.54', '$56.54'],
    ],
    faqs: [
      {
        question: 'How does proportional tax and tip splitting work on an itemized check?',
        answer:
          'We divide the final check total (subtotal + tax + tip) by the food-and-drink subtotal to get an exact multiplier, then multiply each diner’s individual food subtotal by that factor.',
      },
      {
        question: 'Can we split shared appetizers or pitchers across only 2 or 3 people at a large table?',
        answer:
          'Yes. Check the specific diners who shared each item; its price is divided evenly among only those selected participants before tax and tip are applied.',
      },
      {
        question: 'Can I copy a clean text summary for Venmo or Zelle?',
        answer:
          'Yes. Click Copy Breakdown to generate an itemized summary showing every guest’s exact cent-reconciled total.',
      },
    ],
  },
];

for (const sp of splitterPages) {
  const canonical = `${DOMAIN}${sp.path}`;
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: sp.h1, path: sp.path },
  ];
  const inner = `
    ${renderBreadcrumbNav(breadcrumbs)}
    ${renderTrustBarHtml(false)}
    <header style="margin-bottom: 24px;">
      <h1 style="font-size: 34px; font-weight: 800; color: #10b981; margin-bottom: 10px;">${escapeHtml(sp.h1)}</h1>
      <p data-speakable="true" style="font-size: 17px; color: #cbd5e1;">${escapeHtml(sp.directAnswer)}</p>
    </header>
    <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 22px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 10px;">Exact Calculation Formula</h2>
      <pre style="background: #020617; padding: 14px; border-radius: 8px; border: 1px solid #334155; color: #34d399; overflow-x: auto;">${escapeHtml(sp.formula)}</pre>
    </section>
    <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 22px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 10px;">${escapeHtml(sp.tableCaption)}</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #cbd5e1;">
        <thead><tr>${sp.headers.map((h) => `<th style="border: 1px solid #334155; padding: 8px; text-align: left; color: #f8fafc;">${escapeHtml(h)}</th>`).join('')}</tr></thead>
        <tbody>${sp.rows.map((r) => `<tr>${r.map((c) => `<td style="border: 1px solid #334155; padding: 8px;">${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
      <p style="margin-top: 14px; font-size: 14px; color: #94a3b8;">Compare splitter modes: <a href="/bill-splitter/" style="color: #34d399;">Group Bill &amp; Tip Splitter</a> · <a href="/income-based-bill-splitter/" style="color: #34d399;">Income-Based Splitter</a> · <a href="/itemized-receipt-splitter/" style="color: #34d399;">Itemized Receipt Splitter</a></p>
    </section>
    ${renderFaqsHtml(`${sp.h1} — Frequently Asked Questions`, sp.faqs)}
  `;
  const html = applyPageMeta(baseHtml, {
    title: sp.title,
    description: sp.description,
    canonical,
    jsonLd: buildGraph({
      canonical,
      title: sp.title,
      description: sp.description,
      breadcrumbs,
      webApp: { name: sp.h1, description: sp.description },
      faqs: sp.faqs,
    }),
    rootHtml: wrapPageShell(inner),
  });
  writeRoutePage(sp.path, html);
  sitemapCore.push({ loc: canonical, lastmod: TODAY_ISO, changefreq: 'weekly', priority: '0.9' });
  totalGeneratedPages++;
}

// =========================================================================
// 2. CORE TOOL HUBS (4 Pages: /bill-auditor/, /dispute-letter-generator/, /utility-benchmarks/, /savings-tracker/)
// =========================================================================
const coreToolHubs = [
  {
    path: '/bill-auditor/',
    title: 'Free Line-Item Bill Fee Auditor & Junk-Fee Checker | ItsMyBill',
    description:
      'Audit telecom, internet, utility, and hospital bills locally in your browser for hidden surcharges, modem rentals, and Revenue Code 0450 facility fees.',
    h1: 'Line-Item Bill Fee Auditor & Junk-Fee Checker',
    directAnswer:
      'Paste statement lines or select your carrier below to scan 100% locally in your browser for avoidable Broadcast TV fees, Regional Sports surcharges, $15/mo modem rentals, Regulatory Cost Recovery charges, and hospital Revenue Code 0450 facility fees.',
    bodyHtml: `
      <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 12px;">Pre-Configured Provider &amp; Hospital Fee Auditors</h2>
        <ul style="list-style: none; padding: 0; display: grid; gap: 8px;">
          ${providerAudits
            .map(
              (p) =>
                `<li><a href="/bill-auditor/${escapeHtml(p.slug)}/" style="color: #34d399; text-decoration: underline;">${escapeHtml(p.h1)}</a> (${escapeHtml(p.category)})</li>`
            )
            .join('\n')}
        </ul>
      </section>`,
    faqs: [
      {
        question: 'Does the ItsMyBill Fee Auditor upload my pasted bill statement to a server?',
        answer:
          'No. All line-item pattern matching, dollar extraction, and script generation execute 100% locally inside your web browser. Zero bill text or account numbers leave your device.',
      },
      {
        question: 'Which hidden fees does the client-side Bill Auditor automatically flag?',
        answer:
          'It flags Broadcast TV surcharges, Regional Sports fees, $7–$15 modem/router rentals, Regulatory & Administrative Recovery charges, optional device protection add-ons, data-cap overages, Revenue Code 0450 hospital facility fees, out-of-network ER codes, and estimated utility meter reads.',
      },
      {
        question: 'What should I do after the auditor flags a charge on my bill?',
        answer:
          'Copy the generated Customer Retention script for phone/chat negotiations, or click Draft Written Dispute Notice to build a Certified Mail statutory dispute letter citing FCC, CMS, or State PUC rules.',
      },
    ],
  },
  {
    path: '/dispute-letter-generator/',
    title: 'Free Statutory Bill Dispute Letter Generator | ItsMyBill',
    description:
      'Draft formal Certified Mail dispute notices citing the No Surprises Act, FDCPA, FCBA, FCC Truth-in-Billing, IRC § 501(r), and 51 state deposit statutes.',
    h1: 'Statutory Consumer Bill Dispute Letter Generator',
    directAnswer:
      'Generate print-ready, Certified Mail consumer dispute letters 100% locally in your browser—citing the exact federal or state statute that governs your medical bill, debt collection notice, credit card billing error, telecom surcharge, or unreturned security deposit.',
    showLegal: true,
    bodyHtml: `
      <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 12px;">Federal &amp; General Statutory Dispute Templates</h2>
        <ul style="list-style: none; padding: 0; display: grid; gap: 8px;">
          ${coreDisputeTemplates
            .map(
              (d) =>
                `<li><a href="/dispute-letter/${escapeHtml(d.slug)}/" style="color: #818cf8; text-decoration: underline;">${escapeHtml(d.h1)}</a> — ${escapeHtml(d.statuteCode)}</li>`
            )
            .join('\n')}
        </ul>
      </section>
      <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 12px;">All 50 States + D.C. Security Deposit Demand Letters</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; font-size: 13px;">
          ${STATE_BENCHMARKS.map(
            (st) =>
              `<a href="/dispute-letter/security-deposit-${escapeHtml(st.slug)}/" style="color: #34d399; text-decoration: underline;">${escapeHtml(st.state)} (${st.depositReturnDays}-Day Rule)</a>`
          ).join(' · ')}
        </div>
      </section>`,
    faqs: [
      {
        question: 'Why should I mail a formal written dispute letter instead of only calling support?',
        answer:
          'Key federal and state consumer statutes—including the Fair Credit Billing Act (15 U.S.C. § 1666) and Fair Debt Collection Practices Act (15 U.S.C. § 1692g)—strictly require written notice delivered within 30 or 60 days to freeze collections and preserve legal remedies.',
      },
      {
        question: 'Are my name, account number, and dispute details stored on ItsMyBill servers?',
        answer:
          'No. Every dispute letter is formatted 100% locally in your browser with zero network calls, zero database storage, and zero account login requirements.',
      },
      {
        question: 'How should I send my completed statutory dispute letter?',
        answer:
          'Print or save as PDF, attach copies (never originals) of statements or EOBs, and send via USPS Certified Mail with Return Receipt Requested (PS Form 3811) so you hold admissible proof of delivery date.',
      },
    ],
  },
  {
    path: '/utility-benchmarks/',
    title: '50-State Utility Cost Benchmarks (EIA, FCC & AWWA) | ItsMyBill',
    description:
      'Compare your electricity, gas, water, and broadband bills against official EIA Table 5.6.A, FCC Urban Rate Survey, and AWWA benchmarks across all 50 states.',
    h1: '50-State Utility Cost Benchmarks & Comparison',
    directAnswer:
      `Compare your monthly electric, natural gas, water, and broadband bills against official 51-jurisdiction baselines: U.S. residential electricity averages ${NAT_BASELINE.avgElectricityRateKwh}¢/kWh (EIA Table 5.6.A) and combined 4-utility household spending averages $${NAT_BASELINE.avgCombinedMonthly}/month.`,
    dataset: {
      name: '2026 U.S. 50-State + D.C. Residential Utility Rate Benchmarks',
      description:
        'State-by-state residential electricity rates (¢/kWh), monthly electricity, natural gas, broadband, and water utility medians compiled from EIA Table 5.6.A, FCC Urban Rate Survey, and AWWA.',
      spatialCoverage: 'United States (50 States + District of Columbia)',
      temporalCoverage: '2025/2026',
      variableMeasured: [
        'Residential Electricity Price (cents/kWh)',
        'Monthly Residential Electric Cost (USD)',
        'Monthly Natural Gas Heating Cost (USD)',
        'Monthly Water & Sewer Cost (USD)',
        'Monthly Standalone Broadband Cost (USD)',
      ],
    },
    bodyHtml: `
      <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 12px;">All 50 States + D.C. Utility Benchmark Directory</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #cbd5e1;">
          <thead><tr>
            <th style="border: 1px solid #334155; padding: 8px; text-align: left;">State</th>
            <th style="border: 1px solid #334155; padding: 8px; text-align: right;">EIA Rate</th>
            <th style="border: 1px solid #334155; padding: 8px; text-align: right;">Electric</th>
            <th style="border: 1px solid #334155; padding: 8px; text-align: right;">Gas</th>
            <th style="border: 1px solid #334155; padding: 8px; text-align: right;">Water</th>
            <th style="border: 1px solid #334155; padding: 8px; text-align: right;">Internet</th>
            <th style="border: 1px solid #334155; padding: 8px; text-align: right;">Combined/Mo</th>
          </tr></thead>
          <tbody>
            ${STATE_BENCHMARKS.map(
              (st) => `<tr>
              <td style="border: 1px solid #334155; padding: 7px;"><a href="/utility-benchmarks/${escapeHtml(st.slug)}/" style="color: #34d399; text-decoration: underline;">${escapeHtml(st.state)}</a></td>
              <td style="border: 1px solid #334155; padding: 7px; text-align: right;">${st.avgElectricityRateKwh}¢/kWh</td>
              <td style="border: 1px solid #334155; padding: 7px; text-align: right;">$${st.avgMonthlyElectric}</td>
              <td style="border: 1px solid #334155; padding: 7px; text-align: right;">$${st.avgMonthlyGas}</td>
              <td style="border: 1px solid #334155; padding: 7px; text-align: right;">$${st.avgMonthlyWater}</td>
              <td style="border: 1px solid #334155; padding: 7px; text-align: right;">$${st.avgMonthlyInternet}</td>
              <td style="border: 1px solid #334155; padding: 7px; text-align: right; font-weight: 700;">$${getStateCombined(st)}</td>
            </tr>`
            ).join('\n')}
          </tbody>
        </table>
      </section>`,
    faqs: [
      {
        question: 'Which official sources back the 50-state utility benchmarks?',
        answer:
          'Electricity rates (¢/kWh) come from U.S. EIA Form EIA-861M (Electric Power Monthly, Table 5.6.A). Natural gas reflects EIA/AGA residential heating averages, broadband reflects FCC Urban Rate Survey 100–300 Mbps tiers, and water reflects AWWA/EPA residential rate surveys.',
      },
      {
        question: 'Why do electric bills vary so widely across U.S. states?',
        answer:
          'Regional generation mix (hydroelectric power in Washington vs. imported petroleum in Hawaii or pipeline-constrained New England gas), wildfire grid-hardening riders in California, and climate-driven cooling or heating consumption create wide state-to-state spreads.',
      },
      {
        question: 'Can I compare my specific state against neighboring states?',
        answer:
          'Yes. Click any state in the 51-jurisdiction directory to open its dedicated benchmark page with regional utility providers, deregulation status, neighboring state links, and your official state PUC complaint portal.',
      },
    ],
  },
  {
    path: '/savings-tracker/',
    title: 'Realized Bill Savings Tracker & 5-Year Projection | ItsMyBill',
    description:
      'Track recurring monthly bill reductions and one-time medical dispute wins privately in local storage and project 5-year compounded wealth impact.',
    h1: 'Realized Bill Savings Tracker',
    directAnswer:
      'Log every recurring monthly cable, wireless, or utility negotiation win and every one-time hospital fee wipe privately in your browser localStorage to track annual cashflow recovered and 5-year compounded value at 7% nominal returns.',
    bodyHtml: `
      <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 10px;">How Your Savings Are Calculated Locally</h2>
        <ul style="color: #cbd5e1; padding-left: 20px;">
          <li><strong>Recurring Monthly Reductions:</strong> Ongoing savings from retention discounts, modem returns, or plan downgrades multiplied over 12 months and 60-month compounded projections.</li>
          <li><strong>One-Time Dispute Wipes:</strong> Single-event medical facility fee reversals, charity care adjustments, or wrongful late-fee refunds.</li>
          <li><strong>Zero Cloud Sync:</strong> Stored strictly inside your device’s browser localStorage.</li>
        </ul>
      </section>`,
    faqs: [
      {
        question: 'Where are my logged bill savings stored?',
        answer:
          'All savings entries are stored exclusively in your own browser’s localStorage on your device. Nothing is synced to external servers or tied to an email address.',
      },
      {
        question: 'How is the 5-year compounded wealth projection calculated?',
        answer:
          'Recurring monthly bill reductions are compounded monthly over 60 months using a standard 7% nominal annual return benchmark, added to one-time dispute wipes.',
      },
    ],
  },
];

for (const hub of coreToolHubs) {
  const canonical = `${DOMAIN}${hub.path}`;
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: hub.h1, path: hub.path },
  ];
  const inner = `
    ${renderBreadcrumbNav(breadcrumbs)}
    ${renderTrustBarHtml(Boolean(hub.showLegal))}
    <header style="margin-bottom: 24px;">
      <h1 style="font-size: 34px; font-weight: 800; color: #10b981; margin-bottom: 10px;">${escapeHtml(hub.h1)}</h1>
      <p data-speakable="true" style="font-size: 17px; color: #cbd5e1;">${escapeHtml(hub.directAnswer)}</p>
    </header>
    ${hub.bodyHtml}
    ${renderFaqsHtml(`${hub.h1} — Frequently Asked Questions`, hub.faqs)}
  `;
  const html = applyPageMeta(baseHtml, {
    title: hub.title,
    description: hub.description,
    canonical,
    jsonLd: buildGraph({
      canonical,
      title: hub.title,
      description: hub.description,
      breadcrumbs,
      webApp: { name: hub.h1, description: hub.description },
      dataset: hub.dataset || null,
      faqs: hub.faqs,
    }),
    rootHtml: wrapPageShell(inner),
  });
  writeRoutePage(hub.path, html);
  sitemapCore.push({ loc: canonical, lastmod: TODAY_ISO, changefreq: 'weekly', priority: '0.9' });
  totalGeneratedPages++;
}

// =========================================================================
// 3. 51 STATE UTILITY BENCHMARK PAGES (/utility-benchmarks/[state-slug]/)
// =========================================================================
for (const st of STATE_BENCHMARKS) {
  const routePath = `/utility-benchmarks/${st.slug}/`;
  const canonical = `${DOMAIN}${routePath}`;
  const combined = getStateCombined(st);
  const rank = getStateRateRank(st.slug);
  const totalRank = getStateTotalRank(st.slug);
  const diffPct = (
    ((st.avgElectricityRateKwh - NAT_BASELINE.avgElectricityRateKwh) /
      NAT_BASELINE.avgElectricityRateKwh) *
    100
  ).toFixed(1);
  const direction = st.avgElectricityRateKwh >= NAT_BASELINE.avgElectricityRateKwh ? 'above' : 'below';
  const absPct = Math.abs(parseFloat(diffPct)).toFixed(1);
  const diffTotal = combined - NAT_BASELINE.avgCombinedMonthly;
  const diffLabel =
    diffTotal >= 0
      ? `$${diffTotal}/month ($${diffTotal * 12}/year) above`
      : `$${Math.abs(diffTotal)}/month ($${Math.abs(diffTotal) * 12}/year) below`;

  const geoSummary = `Average residential electricity rates in ${st.state} are ${st.avgElectricityRateKwh}¢/kWh (EIA Table 5.6.A)—ranking #${rank} highest among 51 U.S. jurisdictions and ${absPct}% ${direction} the ${NAT_BASELINE.avgElectricityRateKwh}¢/kWh national average. Typical ${st.state} households spend $${combined}/month combined across electricity ($${st.avgMonthlyElectric}), natural gas ($${st.avgMonthlyGas}), water ($${st.avgMonthlyWater}), and broadband ($${st.avgMonthlyInternet}).`;

  const title = `${st.state} Utility Bills & Electric Rates (${st.avgElectricityRateKwh}¢/kWh) | ItsMyBill`;
  const description = `Compare ${st.state} utility bills vs. U.S. averages: ${st.avgElectricityRateKwh}¢/kWh electricity (EIA Table 5.6.A), $${st.avgMonthlyGas}/mo gas, $${st.avgMonthlyWater}/mo water & $${st.avgMonthlyInternet}/mo internet.`;

  const stateFaqs = [
    {
      question: `What is the average monthly utility bill in ${st.state}?`,
      answer: `Combined baseline household utilities in ${st.state} average $${combined}/month—including $${st.avgMonthlyElectric} for electricity (${st.avgElectricityRateKwh}¢/kWh), $${st.avgMonthlyGas} for natural gas, $${st.avgMonthlyWater} for municipal water and sewer, and $${st.avgMonthlyInternet} for standalone 100–300 Mbps broadband. That sits ${diffLabel} the $${NAT_BASELINE.avgCombinedMonthly}/month U.S. national baseline.`,
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

  const neighborStates = (st.neighbors || [])
    .map((nSlug) => STATE_BENCHMARKS.find((s) => s.slug === nSlug))
    .filter(Boolean);

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: '50-State Utility Benchmarks', path: '/utility-benchmarks/' },
    { name: st.state, path: routePath },
  ];

  const inner = `
    ${renderBreadcrumbNav(breadcrumbs)}
    ${renderTrustBarHtml(false)}
    <header style="margin-bottom: 24px;">
      <h1 style="font-size: 34px; font-weight: 800; color: #f8fafc; margin-bottom: 10px;">${escapeHtml(st.state)} Average Utility Bills &amp; Electric Rates (${st.avgElectricityRateKwh}¢/kWh)</h1>
      <p data-speakable="true" style="font-size: 17px; color: #e2e8f0; background: #0f172a; padding: 18px; border-radius: 12px; border: 1px solid #1e293b;">${escapeHtml(geoSummary)}</p>
    </header>
    <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #34d399; margin-bottom: 12px;">${escapeHtml(st.state)} vs. U.S. National Household Utility Benchmarks</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #cbd5e1;">
        <thead><tr>
          <th style="border: 1px solid #334155; padding: 8px; text-align: left;">Utility Category</th>
          <th style="border: 1px solid #334155; padding: 8px; text-align: right;">${escapeHtml(st.state)} Average</th>
          <th style="border: 1px solid #334155; padding: 8px; text-align: right;">U.S. Baseline</th>
          <th style="border: 1px solid #334155; padding: 8px; text-align: left;">Primary Authoritative Source</th>
        </tr></thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #334155; padding: 8px;">Electricity Rate (¢/kWh)</td>
            <td style="border: 1px solid #334155; padding: 8px; text-align: right; font-weight: 700;">${st.avgElectricityRateKwh}¢/kWh (#${rank}/51)</td>
            <td style="border: 1px solid #334155; padding: 8px; text-align: right;">${NAT_BASELINE.avgElectricityRateKwh}¢/kWh</td>
            <td style="border: 1px solid #334155; padding: 8px;">U.S. EIA Form EIA-861M (Table 5.6.A)</td>
          </tr>
          <tr>
            <td style="border: 1px solid #334155; padding: 8px;">Monthly Electricity Bill</td>
            <td style="border: 1px solid #334155; padding: 8px; text-align: right; font-weight: 700;">$${st.avgMonthlyElectric}/mo</td>
            <td style="border: 1px solid #334155; padding: 8px; text-align: right;">$${NAT_BASELINE.avgMonthlyElectric}/mo</td>
            <td style="border: 1px solid #334155; padding: 8px;">U.S. EIA Residential Sales Data</td>
          </tr>
          <tr>
            <td style="border: 1px solid #334155; padding: 8px;">Monthly Natural Gas</td>
            <td style="border: 1px solid #334155; padding: 8px; text-align: right; font-weight: 700;">$${st.avgMonthlyGas}/mo</td>
            <td style="border: 1px solid #334155; padding: 8px; text-align: right;">$${NAT_BASELINE.avgMonthlyGas}/mo</td>
            <td style="border: 1px solid #334155; padding: 8px;">EIA Natural Gas Monthly &amp; AGA</td>
          </tr>
          <tr>
            <td style="border: 1px solid #334155; padding: 8px;">Monthly Water &amp; Sewer</td>
            <td style="border: 1px solid #334155; padding: 8px; text-align: right; font-weight: 700;">$${st.avgMonthlyWater}/mo</td>
            <td style="border: 1px solid #334155; padding: 8px; text-align: right;">$${NAT_BASELINE.avgMonthlyWater}/mo</td>
            <td style="border: 1px solid #334155; padding: 8px;">AWWA / EPA Rate Surveys (~6,000 gal/mo)</td>
          </tr>
          <tr>
            <td style="border: 1px solid #334155; padding: 8px;">Monthly Broadband (100–300 Mbps)</td>
            <td style="border: 1px solid #334155; padding: 8px; text-align: right; font-weight: 700;">$${st.avgMonthlyInternet}/mo</td>
            <td style="border: 1px solid #334155; padding: 8px; text-align: right;">$${NAT_BASELINE.avgMonthlyInternet}/mo</td>
            <td style="border: 1px solid #334155; padding: 8px;">FCC Urban Rate Survey</td>
          </tr>
          <tr>
            <td style="border: 1px solid #334155; padding: 8px; font-weight: 700;">Combined 4-Utility Total</td>
            <td style="border: 1px solid #334155; padding: 8px; text-align: right; font-weight: 700; color: #34d399;">$${combined}/mo (#${totalRank}/51)</td>
            <td style="border: 1px solid #334155; padding: 8px; text-align: right;">$${NAT_BASELINE.avgCombinedMonthly}/mo</td>
            <td style="border: 1px solid #334155; padding: 8px;">Combined Baseline Estimate</td>
          </tr>
        </tbody>
      </table>
    </section>
    <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 10px;">${escapeHtml(st.state)} Energy Market, Top Providers &amp; Regulatory Oversight</h2>
      <ul style="color: #cbd5e1; padding-left: 20px;">
        <li><strong>Market Structure:</strong> ${escapeHtml(st.marketType)} (${st.deregulated ? 'Retail supplier choice available' : 'Regulated local utility monopoly'}).</li>
        <li><strong>Major Utility Providers:</strong> ${escapeHtml(st.topProviders.join(', '))}.</li>
        <li><strong>Peak Seasonal Cost Driver:</strong> ${escapeHtml(st.peakSeasonalDriver)}</li>
        <li><strong>Official Consumer Complaint Regulator:</strong> <a href="${escapeHtml(st.pucUrl)}" target="_blank" rel="noopener noreferrer" style="color: #34d399; text-decoration: underline;">${escapeHtml(st.pucName)}</a>.</li>
        <li><strong>${escapeHtml(st.state)} Renter Protection:</strong> Need a deposit refund? Use our <a href="/dispute-letter/security-deposit-${escapeHtml(st.slug)}/" style="color: #818cf8; text-decoration: underline;">${escapeHtml(st.state)} Security Deposit Demand Letter (${st.depositReturnDays}-Day Rule, ${escapeHtml(st.depositStatute)})</a>.</li>
      </ul>
      ${
        neighborStates.length > 0
          ? `<p style="margin-top: 14px; font-size: 14px; color: #94a3b8;">Compare neighboring states: ${neighborStates
              .map(
                (ns) =>
                  `<a href="/utility-benchmarks/${escapeHtml(ns.slug)}/" style="color: #fbbf24; text-decoration: underline;">${escapeHtml(ns.state)} (${ns.avgElectricityRateKwh}¢/kWh)</a>`
              )
              .join(' · ')}</p>`
          : ''
      }
    </section>
    ${renderFaqsHtml(`${st.state} Utility Cost FAQs`, stateFaqs)}
  `;

  const html = applyPageMeta(baseHtml, {
    title,
    description,
    canonical,
    ogType: 'article',
    keywords: `${st.state} utility bills, ${st.state} electric rate kwh, average monthly utility bill ${st.state}, ${st.pucName}, ${st.topProviders.join(', ')}`,
    jsonLd: buildGraph({
      canonical,
      title,
      description,
      breadcrumbs,
      webApp: { name: `${st.state} Utility Benchmark Calculator`, description: geoSummary },
      dataset: {
        name: `${st.state} (${st.code}) Residential Utility Cost Benchmarks (2026)`,
        description: geoSummary,
        spatialCoverage: `${st.state}, United States`,
        temporalCoverage: '2025/2026',
        variableMeasured: [
          `${st.state} Electricity Price (${st.avgElectricityRateKwh} cents/kWh)`,
          `${st.state} Monthly Electric ($${st.avgMonthlyElectric})`,
          `${st.state} Monthly Natural Gas ($${st.avgMonthlyGas})`,
          `${st.state} Monthly Water & Sewer ($${st.avgMonthlyWater})`,
          `${st.state} Monthly Broadband ($${st.avgMonthlyInternet})`,
        ],
      },
      article: { headline: `${st.state} Average Utility Bills & Electric Rates`, dateModified: TODAY_ISO },
      faqs: stateFaqs,
    }),
    rootHtml: wrapPageShell(inner),
  });
  writeRoutePage(routePath, html);
  sitemapStates.push({ loc: canonical, lastmod: TODAY_ISO, changefreq: 'monthly', priority: '0.85' });
  totalGeneratedPages++;
}

// =========================================================================
// 4. 12 PROVIDER & HOSPITAL JUNK-FEE AUDITOR PAGES (/bill-auditor/[slug]/)
// =========================================================================
for (const prov of providerAudits) {
  const routePath = `/bill-auditor/${prov.slug}/`;
  const canonical = `${DOMAIN}${routePath}`;
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Bill Fee Auditor', path: '/bill-auditor/' },
    { name: prov.providerName, path: routePath },
  ];

  const inner = `
    ${renderBreadcrumbNav(breadcrumbs)}
    ${renderTrustBarHtml(false)}
    <header style="margin-bottom: 24px;">
      <p style="font-size: 12px; color: #34d399; text-transform: uppercase; letter-spacing: 0.06em;">${escapeHtml(prov.category)} Fee Defense · 100% Client-Side</p>
      <h1 style="font-size: 34px; font-weight: 800; color: #f8fafc; margin-bottom: 10px;">${escapeHtml(prov.h1)}</h1>
      <p data-speakable="true" style="font-size: 17px; color: #e2e8f0; background: #0f172a; padding: 18px; border-radius: 12px; border: 1px solid #1e293b;">${escapeHtml(prov.directAnswer)}</p>
    </header>
    <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #34d399; margin-bottom: 12px;">Common ${escapeHtml(prov.providerName)} Junk Fees &amp; Surcharges</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #cbd5e1;">
        <thead><tr>
          <th style="border: 1px solid #334155; padding: 8px; text-align: left;">Line-Item Fee</th>
          <th style="border: 1px solid #334155; padding: 8px; text-align: left;">Typical Cost</th>
          <th style="border: 1px solid #334155; padding: 8px; text-align: left;">Negotiable?</th>
          <th style="border: 1px solid #334155; padding: 8px; text-align: left;">Governing Rule / Statute</th>
          <th style="border: 1px solid #334155; padding: 8px; text-align: left;">How to Challenge</th>
        </tr></thead>
        <tbody>
          ${prov.fees
            .map(
              (f) => `<tr>
            <td style="border: 1px solid #334155; padding: 8px; font-weight: 700; color: #f8fafc;">${escapeHtml(f.feeName)}</td>
            <td style="border: 1px solid #334155; padding: 8px;">${escapeHtml(f.typicalCost)}</td>
            <td style="border: 1px solid #334155; padding: 8px;">${escapeHtml(f.negotiable)}</td>
            <td style="border: 1px solid #334155; padding: 8px;">${escapeHtml(f.statuteOrRule)}</td>
            <td style="border: 1px solid #334155; padding: 8px;">${escapeHtml(f.howToChallenge)}</td>
          </tr>`
            )
            .join('\n')}
        </tbody>
      </table>
    </section>
    <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 10px;">Word-for-Word Retention &amp; Billing Negotiation Script</h2>
      <blockquote style="background: #020617; border-left: 3px solid #10b981; padding: 16px; border-radius: 8px; color: #e2e8f0; margin: 0 0 18px 0;">&ldquo;${escapeHtml(prov.retentionScript)}&rdquo;</blockquote>
      <h3 style="font-size: 17px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">Step-by-Step Escalation Checklist</h3>
      <ol style="color: #cbd5e1; padding-left: 20px;">
        ${prov.escalationChecklist.map((s) => `<li style="margin-bottom: 6px;">${escapeHtml(s)}</li>`).join('\n')}
      </ol>
      <p style="margin-top: 14px;">Need formal written escalation? Open our <a href="/dispute-letter/${escapeHtml(prov.disputeSlug)}/" style="color: #818cf8; font-weight: 700; text-decoration: underline;">matching Statutory Dispute Letter Template →</a></p>
    </section>
    ${renderFaqsHtml(`${prov.providerName} Billing &amp; Fee FAQs`, prov.faqs)}
  `;

  const html = applyPageMeta(baseHtml, {
    title: prov.seoTitle,
    description: prov.metaDescription,
    canonical,
    ogType: 'article',
    keywords: `${prov.providerName} hidden fees, ${prov.providerName} surcharges, audit ${prov.providerName} bill, lower ${prov.providerName} bill`,
    jsonLd: buildGraph({
      canonical,
      title: prov.seoTitle,
      description: prov.metaDescription,
      breadcrumbs,
      webApp: { name: `${prov.providerName} Bill Fee Auditor`, description: prov.metaDescription },
      article: { headline: prov.h1, dateModified: TODAY_ISO },
      faqs: prov.faqs,
    }),
    rootHtml: wrapPageShell(inner),
  });
  writeRoutePage(routePath, html);
  sitemapProviders.push({ loc: canonical, lastmod: TODAY_ISO, changefreq: 'monthly', priority: '0.85' });
  totalGeneratedPages++;
}

// =========================================================================
// 5. STATUTORY DISPUTE LETTER PAGES (6 Core Federal + 51 State Security Deposit = 57 Pages)
// =========================================================================
function buildStateDepositTemplate(st) {
  return {
    slug: `security-deposit-${st.slug}`,
    stateSlug: st.slug,
    stateName: st.state,
    seoTitle: `${st.state} Security Deposit Demand Letter (${st.depositReturnDays}-Day Rule) | ItsMyBill`,
    metaDescription: `Free ${st.state} security deposit demand letter citing ${st.depositStatute}. Enforce the ${st.depositReturnDays}-day return deadline and statutory penalty rules.`,
    h1: `${st.state} Security Deposit Return & Itemization Demand Letter`,
    statuteCode: st.depositStatute,
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

const allDisputeTemplates = [
  ...coreDisputeTemplates,
  ...STATE_BENCHMARKS.map(buildStateDepositTemplate),
];

for (const tpl of allDisputeTemplates) {
  const routePath = `/dispute-letter/${tpl.slug}/`;
  const canonical = `${DOMAIN}${routePath}`;
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Dispute Letter Generator', path: '/dispute-letter-generator/' },
    { name: tpl.h1, path: routePath },
  ];

  const inner = `
    ${renderBreadcrumbNav(breadcrumbs)}
    ${renderTrustBarHtml(true)}
    <header style="margin-bottom: 24px;">
      <p style="font-size: 13px; color: #818cf8; font-weight: 700;">${escapeHtml(tpl.statuteCode)} · ${escapeHtml(tpl.deadlineHighlight)}</p>
      <h1 style="font-size: 34px; font-weight: 800; color: #f8fafc; margin-bottom: 10px;">${escapeHtml(tpl.h1)}</h1>
      <p data-speakable="true" style="font-size: 17px; color: #e2e8f0; background: #0f172a; padding: 18px; border-radius: 12px; border: 1px solid #1e293b;">${escapeHtml(tpl.directAnswer)}</p>
    </header>
    <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #34d399; margin-bottom: 10px;">Plain-English Statutory Rights &amp; Deadlines</h2>
      <ul style="color: #cbd5e1; padding-left: 20px;">
        ${tpl.plainEnglishRights.map((r) => `<li style="margin-bottom: 8px;">${escapeHtml(r)}</li>`).join('\n')}
      </ul>
      <p style="margin-top: 12px; font-size: 13px;">Official Government Reference: <a href="${escapeHtml(tpl.govSourceUrl)}" target="_blank" rel="noopener noreferrer" style="color: #34d399; text-decoration: underline;">${escapeHtml(tpl.govSourceName)}</a></p>
    </section>
    <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 10px;">Read-Only Statutory Sample Dispute Letter</h2>
      <pre style="background: #020617; padding: 18px; border-radius: 10px; border: 1px solid #334155; color: #e2e8f0; white-space: pre-wrap; font-size: 13px; line-height: 1.6;">${escapeHtml(tpl.sampleLetter)}</pre>
    </section>
    <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 10px;">USPS Certified Mail &amp; Evidence Checklist</h2>
      <ol style="color: #cbd5e1; padding-left: 20px;">
        ${tpl.certifiedMailChecklist.map((s) => `<li style="margin-bottom: 8px;">${escapeHtml(s)}</li>`).join('\n')}
      </ol>
      ${
        tpl.stateSlug
          ? `<p style="margin-top: 14px; font-size: 14px;">Also compare <a href="/utility-benchmarks/${escapeHtml(tpl.stateSlug)}/" style="color: #fbbf24; text-decoration: underline;">${escapeHtml(tpl.stateName)} Utility Cost Benchmarks →</a></p>`
          : ''
      }
    </section>
    ${renderFaqsHtml(`${tpl.h1} — Frequently Asked Questions`, tpl.faqs)}
  `;

  const html = applyPageMeta(baseHtml, {
    title: tpl.seoTitle,
    description: tpl.metaDescription,
    canonical,
    ogType: 'article',
    keywords: `${tpl.statuteCode}, ${tpl.h1}, certified mail dispute letter template, consumer rights notice`,
    jsonLd: buildGraph({
      canonical,
      title: tpl.seoTitle,
      description: tpl.metaDescription,
      breadcrumbs,
      webApp: { name: tpl.h1, description: tpl.metaDescription },
      article: { headline: tpl.h1, dateModified: TODAY_ISO },
      faqs: tpl.faqs,
    }),
    rootHtml: wrapPageShell(inner),
  });
  writeRoutePage(routePath, html);
  sitemapDisputes.push({
    loc: canonical,
    lastmod: TODAY_ISO,
    changefreq: 'monthly',
    priority: tpl.stateSlug ? '0.8' : '0.9',
  });
  totalGeneratedPages++;
}

// =========================================================================
// 6. EDITORIAL HUB-AND-SPOKE CLUSTERS (/guides/, 3 Hubs, 9 Spokes = 13 Pages)
// =========================================================================
{
  const guidesCanonical = `${DOMAIN}/guides/`;
  const guidesTitle = 'Consumer Bill Defense & Personal Finance Hubs | ItsMyBill';
  const guidesDesc =
    'Statute-backed consumer topic hubs covering medical billing defense, cable/internet/wireless fee elimination, and fair shared household finance math.';
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Consumer Guides', path: '/guides/' },
  ];
  const inner = `
    ${renderBreadcrumbNav(breadcrumbs)}
    ${renderTrustBarHtml(false)}
    <header style="margin-bottom: 24px;">
      <h1 style="font-size: 34px; font-weight: 800; color: #f8fafc; margin-bottom: 10px;">Consumer Bill Defense Topic Hubs</h1>
      <p data-speakable="true" style="font-size: 17px; color: #cbd5e1;">Explore our three structured pillar hubs covering U.S. medical billing defense, cable/internet/wireless junk-fee elimination, and fair shared household expense math.</p>
    </header>
    <main style="display: grid; gap: 20px;">
      ${EDITORIAL_HUBS.map(
        (hub) => `<section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 8px;"><a href="/guides/${escapeHtml(hub.clusterSlug)}/" style="color: #34d399; text-decoration: none;">${escapeHtml(hub.title)}</a></h2>
        <p style="color: #cbd5e1; margin-bottom: 12px;">${escapeHtml(hub.directAnswer)}</p>
        <ul style="padding-left: 20px; color: #cbd5e1;">
          ${hub.spokes
            .map(
              (s) =>
                `<li style="margin-bottom: 6px;"><a href="/guides/${escapeHtml(hub.clusterSlug)}/${escapeHtml(s.slug)}/" style="color: #34d399; text-decoration: underline;">${escapeHtml(s.title)}</a></li>`
            )
            .join('\n')}
        </ul>
      </section>`
      ).join('\n')}
    </main>
  `;
  const html = applyPageMeta(baseHtml, {
    title: guidesTitle,
    description: guidesDesc,
    canonical: guidesCanonical,
    jsonLd: buildGraph({
      canonical: guidesCanonical,
      title: guidesTitle,
      description: guidesDesc,
      breadcrumbs,
      webPage: { type: 'CollectionPage', name: guidesTitle },
    }),
    rootHtml: wrapPageShell(inner),
  });
  writeRoutePage('/guides/', html);
  sitemapGuides.push({ loc: guidesCanonical, lastmod: TODAY_ISO, changefreq: 'weekly', priority: '0.9' });
  totalGeneratedPages++;
}

for (const hub of EDITORIAL_HUBS) {
  const hubPath = `/guides/${hub.clusterSlug}/`;
  const hubCanonical = `${DOMAIN}${hubPath}`;
  const hubBreadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Consumer Guides', path: '/guides/' },
    { name: hub.title, path: hubPath },
  ];

  const hubInner = `
    ${renderBreadcrumbNav(hubBreadcrumbs)}
    ${renderTrustBarHtml(false)}
    <header style="margin-bottom: 24px;">
      <h1 style="font-size: 34px; font-weight: 800; color: #f8fafc; margin-bottom: 10px;">${escapeHtml(hub.title)}</h1>
      <p data-speakable="true" style="font-size: 17px; color: #e2e8f0; background: #0f172a; padding: 18px; border-radius: 12px; border: 1px solid #1e293b;">${escapeHtml(hub.directAnswer)}</p>
      <p style="margin-top: 12px;"><a href="${escapeHtml(hub.companionToolPath)}" style="color: #34d399; font-weight: 700; text-decoration: underline;">Launch Companion Tool: ${escapeHtml(hub.companionToolLabel)} →</a></p>
    </header>
    <main style="display: grid; gap: 18px;">
      ${hub.spokes
        .map(
          (sp) => `<article style="background: #0f172a; padding: 22px; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 6px;"><a href="/guides/${escapeHtml(hub.clusterSlug)}/${escapeHtml(sp.slug)}/" style="color: #34d399; text-decoration: none;">${escapeHtml(sp.title)}</a></h2>
        <p style="color: #cbd5e1; margin-bottom: 8px;">${escapeHtml(sp.directAnswer)}</p>
        <a href="/guides/${escapeHtml(hub.clusterSlug)}/${escapeHtml(sp.slug)}/" style="color: #34d399; text-decoration: underline; font-size: 14px;">Read Full Spoke Guide (${sp.readTimeMinutes} min) →</a>
      </article>`
        )
        .join('\n')}
    </main>
  `;
  const hubHtml = applyPageMeta(baseHtml, {
    title: hub.seoTitle,
    description: hub.metaDescription,
    canonical: hubCanonical,
    ogType: 'article',
    jsonLd: buildGraph({
      canonical: hubCanonical,
      title: hub.seoTitle,
      description: hub.metaDescription,
      breadcrumbs: hubBreadcrumbs,
      article: { headline: hub.title, dateModified: hub.lastVerified },
    }),
    rootHtml: wrapPageShell(hubInner),
  });
  writeRoutePage(hubPath, hubHtml);
  sitemapGuides.push({ loc: hubCanonical, lastmod: hub.lastVerified || TODAY_ISO, changefreq: 'weekly', priority: '0.85' });
  totalGeneratedPages++;

  // Individual Spokes
  for (const sp of hub.spokes) {
    const spPath = `/guides/${hub.clusterSlug}/${sp.slug}/`;
    const spCanonical = `${DOMAIN}${spPath}`;
    const spBreadcrumbs = [
      { name: 'Home', path: '/' },
      { name: 'Consumer Guides', path: '/guides/' },
      { name: hub.title, path: hubPath },
      { name: sp.title, path: spPath },
    ];
    const siblingSpokes = hub.spokes.filter((s) => s.slug !== sp.slug);

    const spInner = `
      ${renderBreadcrumbNav(spBreadcrumbs)}
      ${renderTrustBarHtml(false)}
      <header style="margin-bottom: 24px;">
        <h1 style="font-size: 32px; font-weight: 800; color: #f8fafc; margin-bottom: 10px;">${escapeHtml(sp.title)}</h1>
        <p data-speakable="true" style="font-size: 17px; color: #e2e8f0; background: #0f172a; padding: 18px; border-radius: 12px; border: 1px solid #1e293b;">${escapeHtml(sp.directAnswer)}</p>
      </header>
      <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #34d399; margin-bottom: 10px;">Actionable Consumer Playbook</h2>
        <ul style="color: #cbd5e1; padding-left: 20px;">
          ${sp.keyPoints.map((kp) => `<li style="margin-bottom: 8px;">${escapeHtml(kp)}</li>`).join('\n')}
        </ul>
      </section>
      <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 10px;">${escapeHtml(sp.table.caption)}</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #cbd5e1;">
          <thead><tr>${sp.table.headers.map((h) => `<th style="border: 1px solid #334155; padding: 8px; text-align: left;">${escapeHtml(h)}</th>`).join('')}</tr></thead>
          <tbody>${sp.table.rows.map((r) => `<tr>${r.map((c) => `<td style="border: 1px solid #334155; padding: 8px;">${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
        <p style="margin-top: 14px;">
          <a href="${escapeHtml(sp.relatedToolPath)}" style="color: #34d399; font-weight: 700; text-decoration: underline;">${escapeHtml(sp.relatedToolLabel)} →</a> ·
          <a href="${escapeHtml(hubPath)}" style="color: #cbd5e1; text-decoration: underline;">Back to ${escapeHtml(hub.title)}</a>
        </p>
        <p style="margin-top: 10px; font-size: 13px; color: #94a3b8;">Related spokes in this cluster: ${siblingSpokes
          .map(
            (sib) =>
              `<a href="/guides/${escapeHtml(hub.clusterSlug)}/${escapeHtml(sib.slug)}/" style="color: #34d399; text-decoration: underline;">${escapeHtml(sib.title)}</a>`
          )
          .join(' · ')}</p>
      </section>
      ${renderFaqsHtml(`${sp.title} — FAQs`, sp.faqs)}
    `;
    const spHtml = applyPageMeta(baseHtml, {
      title: sp.seoTitle,
      description: sp.metaDescription,
      canonical: spCanonical,
      ogType: 'article',
      jsonLd: buildGraph({
        canonical: spCanonical,
        title: sp.seoTitle,
        description: sp.metaDescription,
        breadcrumbs: spBreadcrumbs,
        article: { headline: sp.title, dateModified: sp.lastVerified },
        faqs: sp.faqs,
      }),
      rootHtml: wrapPageShell(spInner),
    });
    writeRoutePage(spPath, spHtml);
    sitemapGuides.push({ loc: spCanonical, lastmod: sp.lastVerified || TODAY_ISO, changefreq: 'monthly', priority: '0.8' });
    totalGeneratedPages++;
  }
}

// =========================================================================
// 7. EXISTING BLOG LIBRARY (/blog/ + 10 /blog/[slug]/ = 11 Pages)
// =========================================================================
{
  const blogCanonical = `${DOMAIN}/blog/`;
  const blogTitle = 'Bills & Personal Finance Guides | ItsMyBill Blog';
  const blogDesc =
    'Authoritative U.S. consumer guides on lowering monthly bills, disputing medical and credit charges under federal law, comparing utility rates, and budgeting.';
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Bills & Finance Blog', path: '/blog/' },
  ];
  const inner = `
    ${renderBreadcrumbNav(breadcrumbs)}
    ${renderTrustBarHtml(false)}
    <header style="margin-bottom: 28px;">
      <h1 style="font-size: 36px; font-weight: 800; color: #f8fafc; margin-bottom: 10px;">Bills &amp; Personal Finance Guides</h1>
      <p data-speakable="true" style="font-size: 17px; color: #cbd5e1;">Statute-backed playbooks on auditing medical and telecom statements, lowering monthly utility bills, disputing unlawful charges, and building resilient household cash flow.</p>
    </header>
    <main style="display: grid; gap: 18px;">
      ${blogPosts
        .map(
          (post) => `<article style="background: #0f172a; padding: 22px; border-radius: 12px; border: 1px solid #1e293b;">
        <div style="font-size: 12px; color: #94a3b8; margin-bottom: 6px;">${escapeHtml(post.category)} · Updated ${escapeHtml(post.updatedAt)} · ${post.readTimeMinutes} min read</div>
        <h2 style="font-size: 21px; font-weight: 700; margin-bottom: 8px;"><a href="/blog/${escapeHtml(post.slug)}/" style="color: #34d399; text-decoration: none;">${escapeHtml(post.title)}</a></h2>
        <p style="color: #cbd5e1; margin-bottom: 8px;">${escapeHtml(post.directAnswer)}</p>
        <a href="/blog/${escapeHtml(post.slug)}/" style="color: #34d399; text-decoration: underline; font-size: 14px;">Read Full Playbook →</a>
      </article>`
        )
        .join('\n')}
    </main>
  `;
  const blogHtml = applyPageMeta(baseHtml, {
    title: blogTitle,
    description: blogDesc,
    canonical: blogCanonical,
    jsonLd: buildGraph({
      canonical: blogCanonical,
      title: blogTitle,
      description: blogDesc,
      breadcrumbs,
      webPage: { type: 'CollectionPage', name: blogTitle },
      extraNodes: [
        {
          '@type': 'Blog',
          '@id': `${blogCanonical}#blog`,
          url: blogCanonical,
          name: 'ItsMyBill Bills & Personal Finance Journal',
          publisher: { '@id': `${DOMAIN}/#organization` },
          blogPost: blogPosts.map((p) => ({
            '@type': 'BlogPosting',
            headline: p.title,
            url: `${DOMAIN}/blog/${p.slug}/`,
            datePublished: p.publishedAt,
            dateModified: p.updatedAt,
          })),
        },
      ],
    }),
    rootHtml: wrapPageShell(inner),
  });
  writeRoutePage('/blog/', blogHtml);
  sitemapGuides.push({ loc: blogCanonical, lastmod: TODAY_ISO, changefreq: 'daily', priority: '0.9' });
  totalGeneratedPages++;
}

for (const post of blogPosts) {
  const postPath = `/blog/${post.slug}/`;
  const canonicalUrl = `${DOMAIN}${postPath}`;
  const fullImageUrl = `${DOMAIN}${post.coverImage}`;
  const stepSection = (post.sections || []).find((s) => s.numberedSteps && s.numberedSteps.length > 0);
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Bills & Finance Blog', path: '/blog/' },
    { name: post.title, path: postPath },
  ];

  const extraNodes = [];
  if (stepSection) {
    extraNodes.push({
      '@type': 'HowTo',
      '@id': `${canonicalUrl}#howto`,
      name: stepSection.heading,
      description: post.directAnswer,
      image: fullImageUrl,
      step: stepSection.numberedSteps.map((stepText, idx) => ({
        '@type': 'HowToStep',
        position: idx + 1,
        name: `Step ${idx + 1}`,
        text: stepText,
      })),
    });
  }

  const extraHeadTags = [
    `    <meta property="article:published_time" content="${escapeHtml(post.publishedAt)}" />`,
    `    <meta property="article:modified_time" content="${escapeHtml(post.updatedAt)}" />`,
    `    <meta property="article:section" content="${escapeHtml(post.category)}" />`,
  ].join('\n');

  const sectionsHtml = (post.sections || [])
    .map((sec) => {
      const paras = (sec.paragraphs || []).map((p) => `<p style="color: #cbd5e1; margin-bottom: 12px;">${escapeHtml(p)}</p>`).join('\n');
      const bullets = sec.bullets
        ? `<ul style="color: #cbd5e1; padding-left: 20px; margin-bottom: 16px;">${sec.bullets.map((b) => `<li style="margin-bottom: 6px;">${escapeHtml(b)}</li>`).join('')}</ul>`
        : '';
      const steps = sec.numberedSteps
        ? `<ol style="color: #cbd5e1; padding-left: 20px; margin-bottom: 16px;">${sec.numberedSteps.map((s) => `<li style="margin-bottom: 8px;">${escapeHtml(s)}</li>`).join('')}</ol>`
        : '';
      const table = sec.table
        ? `<table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; color: #cbd5e1;">
            <caption style="text-align: left; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">${escapeHtml(sec.table.caption)}</caption>
            <thead><tr>${sec.table.headers.map((h) => `<th style="border: 1px solid #334155; padding: 8px; text-align: left; color: #f8fafc;">${escapeHtml(h)}</th>`).join('')}</tr></thead>
            <tbody>${sec.table.rows.map((row) => `<tr>${row.map((c) => `<td style="border: 1px solid #334155; padding: 8px;">${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>`
        : '';
      const script = sec.scriptBox
        ? `<blockquote style="background: #0f172a; border: 1px solid #1e293b; padding: 16px; border-radius: 10px; margin: 16px 0; color: #e2e8f0;"><strong>${escapeHtml(sec.scriptBox.title)}:</strong> &ldquo;${escapeHtml(sec.scriptBox.body)}&rdquo;</blockquote>`
        : '';
      const citation = sec.statuteCitation
        ? `<p style="font-size: 13px; color: #94a3b8;"><strong>Statutory Scope (${escapeHtml(sec.statuteCitation.code)}):</strong> ${escapeHtml(sec.statuteCitation.note)}</p>`
        : '';
      return `<section id="${escapeHtml(sec.id)}" style="margin-bottom: 24px;">
        <h2 style="font-size: 22px; font-weight: 700; color: #f8fafc; margin-bottom: 10px;">${escapeHtml(sec.heading)}</h2>
        ${paras}${bullets}${steps}${table}${script}${citation}
      </section>`;
    })
    .join('\n');

  const relatedLinksHtml = (post.relatedSlugs || [])
    .map((slug) => blogPosts.find((p) => p.slug === slug))
    .filter(Boolean)
    .map(
      (rel) =>
        `<li><a href="/blog/${escapeHtml(rel.slug)}/" style="color: #34d399; text-decoration: underline;">${escapeHtml(rel.title)}</a></li>`
    )
    .join('');

  const postInner = `
    ${renderBreadcrumbNav(breadcrumbs)}
    ${renderTrustBarHtml(false)}
    <header style="margin-bottom: 24px;">
      <div style="font-size: 13px; color: #94a3b8; margin-bottom: 8px;">${escapeHtml(post.category)} · Updated ${escapeHtml(post.updatedAt)} · ${post.readTimeMinutes} min read</div>
      <h1 style="font-size: 34px; font-weight: 800; color: #f8fafc; margin-bottom: 10px;">${escapeHtml(post.title)}</h1>
      <p style="font-size: 17px; color: #cbd5e1;">${escapeHtml(post.metaDescription)}</p>
    </header>
    <section data-speakable="true" style="background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <h2 style="font-size: 18px; font-weight: 700; color: #34d399; margin-bottom: 8px;">Direct Answer &amp; Key Takeaways</h2>
      <p style="color: #e2e8f0; margin-bottom: 12px;">${escapeHtml(post.directAnswer)}</p>
      <ul style="color: #cbd5e1; padding-left: 20px;">${(post.keyTakeaways || []).map((k) => `<li style="margin-bottom: 6px;">${escapeHtml(k)}</li>`).join('')}</ul>
    </section>
    ${sectionsHtml}
    <section style="background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <h2 style="font-size: 19px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">Companion Free Tool</h2>
      <p style="color: #cbd5e1; margin-bottom: 10px;">${escapeHtml(post.relatedTool.ctaDescription)}</p>
      <a href="${escapeHtml(post.relatedTool.path)}" style="color: #34d399; font-weight: 700; text-decoration: underline;">${escapeHtml(post.relatedTool.label)} →</a>
    </section>
    ${renderFaqsHtml('Frequently Asked Questions', post.faqs || [])}
    <section style="margin-top: 24px;">
      <h2 style="font-size: 18px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">Primary Government &amp; Regulatory Sources</h2>
      <ul style="color: #94a3b8; font-size: 13px; padding-left: 20px;">${(post.sources || []).map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
    </section>
    <nav aria-label="Related Guides" style="border-top: 1px solid #1e293b; padding-top: 18px; margin-top: 20px;">
      <h2 style="font-size: 18px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">Related Bills &amp; Finance Guides</h2>
      <ul style="list-style: none; padding: 0; display: grid; gap: 6px;">${relatedLinksHtml}</ul>
    </nav>
  `;

  const postHtml = applyPageMeta(baseHtml, {
    title: post.seoTitle,
    description: post.metaDescription,
    canonical: canonicalUrl,
    ogType: 'article',
    ogImage: fullImageUrl,
    ogImageAlt: post.coverAlt,
    keywords: (post.keywords || []).join(', '),
    extraHeadTags,
    jsonLd: buildGraph({
      canonical: canonicalUrl,
      title: post.seoTitle,
      description: post.metaDescription,
      ogImage: fullImageUrl,
      breadcrumbs,
      article: {
        type: 'BlogPosting',
        headline: post.title,
        description: post.metaDescription,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        extra: {
          abstract: post.directAnswer,
          articleSection: post.category,
          keywords: (post.keywords || []).join(', '),
          wordCount: estimateWordCount(post),
        },
      },
      faqs: post.faqs || [],
      extraNodes,
    }),
    rootHtml: wrapPageShell(postInner),
  });
  writeRoutePage(postPath, postHtml);
  sitemapGuides.push({
    loc: canonicalUrl,
    lastmod: post.updatedAt || TODAY_ISO,
    changefreq: 'weekly',
    priority: post.featured ? '0.9' : '0.85',
  });
  totalGeneratedPages++;
}

// =========================================================================
// 8. TRUST & GOVERNANCE PAGES (5 Pages: /about/, /editorial-policy/, /methodology/, 2 /authors/[slug]/)
// =========================================================================
const trustRoutes = [
  {
    path: '/about/',
    title: 'About ItsMyBill — Privacy-First Consumer Bill Defense Platform',
    description:
      'Learn about ItsMyBill Consumer Utilities, our zero-upload client-side privacy architecture, independent funding model, and editorial research desks.',
    h1: 'About ItsMyBill',
    directAnswer:
      'ItsMyBill Consumer Utilities operates https://www.itsmybill.com as an independent, 100% client-side U.S. consumer utility platform helping households audit hidden telecom and medical fees, compare official state utility rate benchmarks, calculate income-fair shared expenses, and draft statutory dispute letters—without accounts, bank logins, or server uploads of private financial data.',
    bodyHtml: `
      <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="font-size: 20px; font-weight: 700; color: #34d399; margin-bottom: 10px;">Entity Transparency &amp; Desks</h2>
        <ul style="color: #cbd5e1; padding-left: 20px;">
          <li><strong>Operating Entity:</strong> ItsMyBill Consumer Utilities (Founder-Operated, United States)</li>
          <li><strong>Privacy Guarantee:</strong> 100% client-side execution; zero PII or bill statements sent to servers.</li>
          <li><strong>Monetization Disclosure:</strong> Independently funded free consumer utility; zero paid carrier placements.</li>
          <li><strong>Editorial Profiles:</strong> <a href="/authors/itsmybill-editorial-team/" style="color: #34d399;">ItsMyBill Editorial &amp; Research Team</a> · <a href="/authors/consumer-rights-review-desk/" style="color: #34d399;">Consumer Rights Statutory Review Desk</a></li>
          <li><strong>Contact &amp; Corrections:</strong> <a href="mailto:${CONTACT_EMAIL}" style="color: #34d399;">${CONTACT_EMAIL}</a></li>
        </ul>
      </section>`,
  },
  {
    path: '/editorial-policy/',
    title: 'Editorial, Fact-Checking & Corrections Policy | ItsMyBill',
    description:
      'How ItsMyBill verifies U.S. statutes, EIA utility benchmarks, and carrier fees against primary government sources with transparent credential labeling.',
    h1: 'Editorial, Fact-Checking & Corrections Policy',
    directAnswer:
      'Because household billing disputes and personal finance calculators impact real consumer financial decisions (YMYL), ItsMyBill enforces strict primary-source verification against U.S. Code, C.F.R., EIA, CMS, FCC, CFPB, and state PUC publications.',
    bodyHtml: `
      <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="font-size: 20px; font-weight: 700; color: #34d399; margin-bottom: 10px;">Editorial Standards &amp; Transparent Review Status</h2>
        <ol style="color: #cbd5e1; padding-left: 20px;">
          <li><strong>Primary Source Hierarchy:</strong> Every statute and benchmark traces directly to U.S.C., C.F.R., EIA, CMS, FCC, CFPB, IRS, or state PUC records.</li>
          <li><strong>Zero Fabricated Credentials:</strong> Reviewer profiles are transparently labeled <em>Pending Credentialed Review</em> until independently signed off by a licensed attorney, CPA, or CFP.</li>
          <li><strong>72-Hour Corrections SLA:</strong> Verified corrections submitted to <a href="mailto:${CONTACT_EMAIL}" style="color: #34d399;">${CONTACT_EMAIL}</a> are updated within 72 hours.</li>
          <li><strong>Educational Scope:</strong> ItsMyBill is an educational consumer utility, not a law firm or fiduciary advisor.</li>
        </ol>
      </section>`,
  },
  {
    path: '/methodology/',
    title: 'Data Sources, Units & Calculation Methodology | ItsMyBill',
    description:
      'Reproducible bill-splitting formulas and live primary government citations (U.S. EIA Table 5.6.A, CMS, FCC, CFPB, IRS § 501(r), and AWWA).',
    h1: 'Data Sources, Units & Calculation Methodology',
    directAnswer:
      'Every benchmark figure, mathematical bill-splitting formula, and statutory notice on ItsMyBill distinguishes clearly between published primary U.S. government statistics and deterministic client-side calculations.',
    bodyHtml: `
      <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #34d399; margin-bottom: 10px;">Exact Client-Side Formulas</h2>
        <ul style="color: #cbd5e1; padding-left: 20px;">
          <li><strong>Income-Proportional Split:</strong> <code>Individual Share = round_cents(Total Shared Bill × (Individual Net Income ÷ Combined Net Income))</code></li>
          <li><strong>Itemized Receipt Multiplier:</strong> <code>Multiplier = (Food Subtotal + Sales Tax + Pre-Tax Tip) ÷ Food Subtotal</code></li>
          <li><strong>Annual State Utility Variance:</strong> <code>Annual Overpay = max(0, (User 4-Utility Total − State 4-Utility Baseline) × 12)</code></li>
        </ul>
      </section>
      <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 10px;">Live Primary Government Citations</h2>
        <ul style="color: #cbd5e1; padding-left: 20px;">
          <li><a href="https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a" target="_blank" rel="noopener noreferrer" style="color: #34d399;">U.S. EIA Electric Power Monthly — Table 5.6.A (¢/kWh)</a></li>
          <li><a href="https://www.eia.gov/dnav/ng/ng_pri_sum_a_EPG0_PRS_DMcf_m.htm" target="_blank" rel="noopener noreferrer" style="color: #34d399;">U.S. EIA Natural Gas Monthly Residential Prices</a></li>
          <li><a href="https://www.fcc.gov/consumers/guides/understanding-your-telephone-bill" target="_blank" rel="noopener noreferrer" style="color: #34d399;">FCC Truth-in-Billing Rules (47 C.F.R. § 64.2401) &amp; Urban Rate Survey</a></li>
          <li><a href="https://www.cms.gov/medical-bill-rights" target="_blank" rel="noopener noreferrer" style="color: #34d399;">CMS No Surprises Act Consumer Protections (42 U.S.C. § 300gg-111)</a></li>
          <li><a href="https://www.consumerfinance.gov/consumer-tools/debt-collection/" target="_blank" rel="noopener noreferrer" style="color: #34d399;">CFPB Debt Collection (FDCPA) &amp; Credit Billing Rights</a></li>
          <li><a href="https://consumer.ftc.gov/articles/using-credit-cards-and-disputing-charges" target="_blank" rel="noopener noreferrer" style="color: #34d399;">FTC Disputing Credit Card Charges (FCBA 15 U.S.C. § 1666)</a></li>
          <li><a href="https://www.irs.gov/charities-non-profits/financial-assistance-policy-and-emergency-medical-care-policy-section-501r4" target="_blank" rel="noopener noreferrer" style="color: #34d399;">IRS Section 501(r) Nonprofit Hospital Financial Assistance</a></li>
          <li><a href="https://www.epa.gov/watersense/statistics-and-facts" target="_blank" rel="noopener noreferrer" style="color: #34d399;">EPA WaterSense &amp; AWWA Municipal Water Rate Surveys</a></li>
        </ul>
      </section>`,
    faqs: [
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
    ],
  },
  {
    path: '/authors/itsmybill-editorial-team/',
    title: 'ItsMyBill Editorial & Research Team | Author Profile',
    description:
      'Consumer Billing Data & Tools Desk building zero-login calculators and verifying U.S. utility tariffs and statutory dispute references.',
    h1: 'ItsMyBill Editorial & Research Team',
    directAnswer:
      'The ItsMyBill Editorial & Research Team builds zero-login household finance calculators and audits public utility tariffs, federal billing statutes, and carrier fee schedules directly against primary .gov records.',
    bodyHtml: `
      <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="font-size: 20px; font-weight: 700; color: #34d399; margin-bottom: 10px;">Research Scope</h2>
        <ul style="color: #cbd5e1; padding-left: 20px;">
          <li>U.S. residential utility tariff benchmarking (EIA, FCC, AWWA)</li>
          <li>Telecom &amp; cable ancillary surcharge analysis</li>
          <li>Client-side proportional expense splitting mathematics</li>
          <li>Federal consumer billing &amp; debt validation documentation</li>
        </ul>
      </section>`,
  },
  {
    path: '/authors/consumer-rights-review-desk/',
    title: 'Consumer Rights Statutory Review Desk | YMYL Verification Profile',
    description:
      'YMYL Compliance & Verification Reviewer desk transparently marked Pending Credentialed Review while verifying primary U.S.C., C.F.R., and .gov citations.',
    h1: 'Consumer Rights Statutory Review Desk',
    directAnswer:
      'Status: Pending Credentialed External Review (CFP / Esq. Advisory Slot Ready). In strict compliance with our E-E-A-T Editorial Policy, we never fabricate external credentials; all statutory code citations are verified directly against U.S.C., C.F.R., CMS, CFPB, and state PUC records.',
    bodyHtml: `
      <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="font-size: 20px; font-weight: 700; color: #34d399; margin-bottom: 10px;">Verification Scope</h2>
        <ul style="color: #cbd5e1; padding-left: 20px;">
          <li>No Surprises Act (42 U.S.C. § 300gg-111) scope verification</li>
          <li>Fair Credit Billing Act (15 U.S.C. § 1666) deadline compliance</li>
          <li>Fair Debt Collection Practices Act (15 U.S.C. § 1692g) validation standards</li>
          <li>State Public Utility Commission &amp; landlord-tenant statutory checks</li>
        </ul>
      </section>`,
  },
];

for (const tr of trustRoutes) {
  const canonical = `${DOMAIN}${tr.path}`;
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: tr.h1, path: tr.path },
  ];
  const inner = `
    ${renderBreadcrumbNav(breadcrumbs)}
    <header style="margin-bottom: 24px;">
      <h1 style="font-size: 34px; font-weight: 800; color: #f8fafc; margin-bottom: 10px;">${escapeHtml(tr.h1)}</h1>
      <p data-speakable="true" style="font-size: 17px; color: #e2e8f0; background: #0f172a; padding: 18px; border-radius: 12px; border: 1px solid #1e293b;">${escapeHtml(tr.directAnswer)}</p>
    </header>
    ${tr.bodyHtml}
    ${tr.faqs ? renderFaqsHtml('Methodology FAQs', tr.faqs) : ''}
  `;
  const html = applyPageMeta(baseHtml, {
    title: tr.title,
    description: tr.description,
    canonical,
    jsonLd: buildGraph({
      canonical,
      title: tr.title,
      description: tr.description,
      breadcrumbs,
      webPage: { name: tr.h1, description: tr.description },
      faqs: tr.faqs || [],
    }),
    rootHtml: wrapPageShell(inner),
  });
  writeRoutePage(tr.path, html);
  sitemapCore.push({ loc: canonical, lastmod: TODAY_ISO, changefreq: 'monthly', priority: '0.7' });
  totalGeneratedPages++;
}

// =========================================================================
// 9. 2026 ANNUAL DATA STUDY REPORT (/reports/2026-us-utility-and-junk-fee-report/)
// =========================================================================
{
  const reportPath = '/reports/2026-us-utility-and-junk-fee-report/';
  const canonical = `${DOMAIN}${reportPath}`;
  const title = '2026 U.S. Household Utility Cost & Junk-Fee Report | ItsMyBill';
  const description =
    'Sortable 51-jurisdiction ranking of U.S. residential electricity rates (EIA Table 5.6.A), combined monthly utilities, deposit deadlines, and carrier fees.';
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: '2026 U.S. Utility & Junk-Fee Report', path: reportPath },
  ];
  const topState = sortedByRateDesc[0];
  const lowState = sortedByRateDesc[sortedByRateDesc.length - 1];

  const reportInner = `
    ${renderBreadcrumbNav(breadcrumbs)}
    ${renderTrustBarHtml(false)}
    <header style="margin-bottom: 24px;">
      <p style="font-size: 12px; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.06em;">Annual Linkable Research Study · Primary U.S. Government Datasets</p>
      <h1 style="font-size: 36px; font-weight: 800; color: #f8fafc; margin-bottom: 10px;">2026 U.S. Household Utility Cost &amp; Junk-Fee Report</h1>
      <p data-speakable="true" style="font-size: 17px; color: #e2e8f0; background: #0f172a; padding: 18px; border-radius: 12px; border: 1px solid #1e293b;">Across all 50 states and D.C., U.S. residential electricity averages ${NAT_BASELINE.avgElectricityRateKwh}¢/kWh (EIA Table 5.6.A) and combined 4-utility monthly spending averages $${NAT_BASELINE.avgCombinedMonthly}/month. ${escapeHtml(topState.state)} leads the nation at ${topState.avgElectricityRateKwh}¢/kWh while ${escapeHtml(lowState.state)} records the lowest rate at ${lowState.avgElectricityRateKwh}¢/kWh—a ${(topState.avgElectricityRateKwh / lowState.avgElectricityRateKwh).toFixed(1)}× regional spread.</p>
    </header>
    <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 22px;">
      <h2 style="font-size: 22px; font-weight: 700; color: #34d399; margin-bottom: 12px;">Complete 51-Jurisdiction Residential Utility Ranking (2026)</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #cbd5e1;">
        <thead><tr>
          <th style="border: 1px solid #334155; padding: 8px; text-align: left;">Rank</th>
          <th style="border: 1px solid #334155; padding: 8px; text-align: left;">State</th>
          <th style="border: 1px solid #334155; padding: 8px; text-align: right;">EIA ¢/kWh</th>
          <th style="border: 1px solid #334155; padding: 8px; text-align: right;">Electric</th>
          <th style="border: 1px solid #334155; padding: 8px; text-align: right;">Gas</th>
          <th style="border: 1px solid #334155; padding: 8px; text-align: right;">Water</th>
          <th style="border: 1px solid #334155; padding: 8px; text-align: right;">Broadband</th>
          <th style="border: 1px solid #334155; padding: 8px; text-align: right;">Combined/Mo</th>
          <th style="border: 1px solid #334155; padding: 8px; text-align: right;">Deposit Rule</th>
        </tr></thead>
        <tbody>
          ${sortedByRateDesc
            .map(
              (st, idx) => `<tr>
            <td style="border: 1px solid #334155; padding: 7px;">#${idx + 1}</td>
            <td style="border: 1px solid #334155; padding: 7px;"><a href="/utility-benchmarks/${escapeHtml(st.slug)}/" style="color: #34d399;">${escapeHtml(st.state)}</a></td>
            <td style="border: 1px solid #334155; padding: 7px; text-align: right; font-weight: 700;">${st.avgElectricityRateKwh}¢</td>
            <td style="border: 1px solid #334155; padding: 7px; text-align: right;">$${st.avgMonthlyElectric}</td>
            <td style="border: 1px solid #334155; padding: 7px; text-align: right;">$${st.avgMonthlyGas}</td>
            <td style="border: 1px solid #334155; padding: 7px; text-align: right;">$${st.avgMonthlyWater}</td>
            <td style="border: 1px solid #334155; padding: 7px; text-align: right;">$${st.avgMonthlyInternet}</td>
            <td style="border: 1px solid #334155; padding: 7px; text-align: right; font-weight: 700;">$${getStateCombined(st)}</td>
            <td style="border: 1px solid #334155; padding: 7px; text-align: right;"><a href="/dispute-letter/security-deposit-${escapeHtml(st.slug)}/" style="color: #818cf8;">${st.depositReturnDays}d</a></td>
          </tr>`
            )
            .join('\n')}
        </tbody>
      </table>
    </section>
    <section style="background: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 10px;">2026 Carrier &amp; Hospital Junk-Fee Index</h2>
      <ul style="color: #cbd5e1; padding-left: 20px;">
        ${providerAudits
          .map(
            (p) =>
              `<li style="margin-bottom: 6px;"><a href="/bill-auditor/${escapeHtml(p.slug)}/" style="color: #34d399;">${escapeHtml(p.providerName)}</a> — ${escapeHtml(p.fees.map((f) => `${f.feeName} (${f.typicalCost})`).slice(0, 2).join('; '))}</li>`
          )
          .join('\n')}
      </ul>
    </section>
  `;

  const reportHtml = applyPageMeta(baseHtml, {
    title,
    description,
    canonical,
    ogType: 'article',
    jsonLd: buildGraph({
      canonical,
      title,
      description,
      breadcrumbs,
      dataset: {
        name: '2026 U.S. Household Utility Cost & Junk-Fee Report Dataset',
        description,
        spatialCoverage: 'United States',
        temporalCoverage: '2026',
        variableMeasured: [
          'State Residential Electricity Price (¢/kWh)',
          'Combined 4-Utility Monthly Household Baseline (USD)',
          'State Tenant Security Deposit Return Deadline (Days)',
        ],
      },
      article: {
        headline: '2026 U.S. Household Utility Cost & Junk-Fee Report',
        datePublished: '2026-10-01',
        dateModified: TODAY_ISO,
      },
    }),
    rootHtml: wrapPageShell(reportInner),
  });
  writeRoutePage(reportPath, reportHtml);
  sitemapCore.push({ loc: canonical, lastmod: TODAY_ISO, changefreq: 'monthly', priority: '0.95' });
  totalGeneratedPages++;
}

// =========================================================================
// 10. CHROME-FREE EMBED ROUTES (2 Pages, strictly noindex, follow, NOT in sitemaps)
// =========================================================================
const embedRoutes = [
  {
    path: '/embed/income-bill-splitter/',
    title: 'Embeddable Income-Based Bill Splitter | ItsMyBill',
    description: 'Chrome-free client-side income-proportional bill splitter widget powered by ItsMyBill.com.',
    backLink: 'https://www.itsmybill.com/income-based-bill-splitter/',
  },
  {
    path: '/embed/state-utility-benchmark/',
    title: 'Embeddable 50-State Utility Benchmark Calculator | ItsMyBill',
    description: 'Chrome-free client-side U.S. state utility rate comparison widget powered by ItsMyBill.com.',
    backLink: 'https://www.itsmybill.com/utility-benchmarks/',
  },
];

for (const emb of embedRoutes) {
  const canonical = `${DOMAIN}${emb.path}`;
  const embRoot = `<div id="root">
    <div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f8fafc;">
      <p style="font-size: 14px; color: #cbd5e1;">${escapeHtml(emb.description)} <a href="${escapeHtml(emb.backLink)}" style="color: #34d399;">Powered by ItsMyBill.com</a></p>
    </div>
  </div>`;
  const embHtml = applyPageMeta(baseHtml, {
    title: emb.title,
    description: emb.description,
    canonical,
    noindex: true,
    jsonLd: buildGraph({
      canonical,
      title: emb.title,
      description: emb.description,
      webApp: { name: emb.title, description: emb.description },
    }),
    rootHtml: embRoot,
  });
  writeRoutePage(emb.path, embHtml);
  totalGeneratedPages++;
}

// =========================================================================
// 11. SEGMENTED XML SITEMAPS + SITEMAP INDEX (public/ & dist/)
// =========================================================================
function buildUrlsetXml(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
}

const segmentedSitemaps = [
  { filename: 'sitemap-core.xml', entries: sitemapCore },
  { filename: 'sitemap-states.xml', entries: sitemapStates },
  { filename: 'sitemap-providers.xml', entries: sitemapProviders },
  { filename: 'sitemap-disputes.xml', entries: sitemapDisputes },
  { filename: 'sitemap-guides.xml', entries: sitemapGuides },
];

fs.mkdirSync(path.resolve(publicDir, 'sitemaps'), { recursive: true });
fs.mkdirSync(path.resolve(distDir, 'sitemaps'), { recursive: true });

let totalSitemapUrls = 0;
for (const sm of segmentedSitemaps) {
  const xml = buildUrlsetXml(sm.entries);
  fs.writeFileSync(path.resolve(publicDir, 'sitemaps', sm.filename), xml, 'utf8');
  fs.writeFileSync(path.resolve(distDir, 'sitemaps', sm.filename), xml, 'utf8');
  totalSitemapUrls += sm.entries.length;
  console.log(`✓ Generated sitemaps/${sm.filename} (${sm.entries.length} canonical URLs)`);
}

const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${segmentedSitemaps
  .map(
    (sm) => `  <sitemap>
    <loc>${DOMAIN}/sitemaps/${sm.filename}</loc>
    <lastmod>${TODAY_ISO}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>
`;

fs.writeFileSync(path.resolve(publicDir, 'sitemap.xml'), sitemapIndexXml, 'utf8');
fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), sitemapIndexXml, 'utf8');
console.log(`✓ Generated sitemap.xml index referencing 5 segmented sitemaps (${totalSitemapUrls} total indexable URLs)`);

// =========================================================================
// 12. RSS 2.0 FEED (public/rss.xml + dist/rss.xml)
// =========================================================================
const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ItsMyBill — Consumer Bill Defense &amp; Personal Finance Guides</title>
    <link>${DOMAIN}/blog/</link>
    <description>Authoritative U.S. consumer guides on lowering monthly bills, disputing medical and credit charges under federal law, comparing state utility rates, and splitting expenses.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(`${TODAY_ISO}T12:00:00Z`).toUTCString()}</lastBuildDate>
    <atom:link href="${DOMAIN}/rss.xml" rel="self" type="application/rss+xml" />
${blogPosts
  .map(
    (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${DOMAIN}/blog/${escapeXml(post.slug)}/</link>
      <guid isPermaLink="true">${DOMAIN}/blog/${escapeXml(post.slug)}/</guid>
      <pubDate>${new Date(`${post.publishedAt}T12:00:00Z`).toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <description>${escapeXml(post.directAnswer)}</description>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>
`;
fs.writeFileSync(path.resolve(publicDir, 'rss.xml'), rssXml, 'utf8');
fs.writeFileSync(path.resolve(distDir, 'rss.xml'), rssXml, 'utf8');

// =========================================================================
// 13. LLMS.TXT & LLMS-FULL.TXT (AI Search / GEO Grounding Files)
// =========================================================================
const llmsTxt = `# ItsMyBill — U.S. Consumer Bill Defense & Utility Benchmarks
Canonical Domain: ${DOMAIN}/
Last Updated: ${TODAY_ISO}
Privacy Architecture: 100% client-side browser execution (zero PII or bill statements transmitted to servers).

## Core Interactive Utilities
- Consumer Bill Defense Hub: ${DOMAIN}/
- Line-Item Bill Fee Auditor: ${DOMAIN}/bill-auditor/
- Statutory Dispute Letter Generator: ${DOMAIN}/dispute-letter-generator/
- 50-State Utility Benchmarks (EIA / FCC / AWWA): ${DOMAIN}/utility-benchmarks/
- Income-Based Proportional Bill Splitter: ${DOMAIN}/income-based-bill-splitter/
- Group Restaurant & Tip Splitter: ${DOMAIN}/bill-splitter/
- Itemized Receipt Tax & Tip Splitter: ${DOMAIN}/itemized-receipt-splitter/
- Realized Bill Savings Tracker: ${DOMAIN}/savings-tracker/
- 2026 U.S. Household Utility & Junk-Fee Report: ${DOMAIN}/reports/2026-us-utility-and-junk-fee-report/

## Programmatic Directories (${totalSitemapUrls} Indexable Pages)
- 51 State Utility Benchmark Pages: ${DOMAIN}/sitemaps/sitemap-states.xml
- 12 Carrier & Hospital Junk-Fee Auditors: ${DOMAIN}/sitemaps/sitemap-providers.xml
- 57 Statutory Dispute Letters (6 Federal + 51 State Security Deposit): ${DOMAIN}/sitemaps/sitemap-disputes.xml
- 13 Hub-and-Spoke Consumer Guides & 11 Blog Playbooks: ${DOMAIN}/sitemaps/sitemap-guides.xml

## Trust, Governance & Methodology
- About ItsMyBill: ${DOMAIN}/about/
- Editorial & Fact-Checking Policy: ${DOMAIN}/editorial-policy/
- Data Sources & Calculation Methodology: ${DOMAIN}/methodology/
`;

const llmsFullMarkdown = `${llmsTxt}
---

## 51-Jurisdiction Residential Utility Benchmarks (EIA Table 5.6.A / FCC / AWWA)
National Baseline: ${NAT_BASELINE.avgElectricityRateKwh}¢/kWh | Electric $${NAT_BASELINE.avgMonthlyElectric}/mo | Gas $${NAT_BASELINE.avgMonthlyGas}/mo | Water $${NAT_BASELINE.avgMonthlyWater}/mo | Broadband $${NAT_BASELINE.avgMonthlyInternet}/mo | Combined $${NAT_BASELINE.avgCombinedMonthly}/mo

${STATE_BENCHMARKS.map(
  (st) =>
    `- **${st.state} (${st.code})**: ${st.avgElectricityRateKwh}¢/kWh | Combined $${getStateCombined(st)}/mo | Deposit Return: ${st.depositReturnDays} days (${st.depositStatute}) | ${DOMAIN}/utility-benchmarks/${st.slug}/`
).join('\n')}

---

## 12 Provider & Hospital Junk-Fee Auditors
${providerAudits
  .map(
    (p) =>
      `- **${p.providerName}** (${p.category}): ${p.directAnswer} | ${DOMAIN}/bill-auditor/${p.slug}/`
  )
  .join('\n')}

---

## Core Federal Statutory Dispute Letter Templates
${coreDisputeTemplates
  .map((d) => `- **${d.h1}** (${d.statuteCode}): ${d.directAnswer} | ${DOMAIN}/dispute-letter/${d.slug}/`)
  .join('\n')}

---

## Published Bills & Personal Finance Guides
${blogPosts
  .map(
    (post) => `### ${post.title}
- URL: ${DOMAIN}/blog/${post.slug}/
- Updated: ${post.updatedAt}
- Direct Answer: ${post.directAnswer}
`
  )
  .join('\n')}
`;

fs.writeFileSync(path.resolve(publicDir, 'llms.txt'), llmsTxt, 'utf8');
fs.writeFileSync(path.resolve(distDir, 'llms.txt'), llmsTxt, 'utf8');
fs.writeFileSync(path.resolve(publicDir, 'llms-full.txt'), llmsFullMarkdown, 'utf8');
fs.writeFileSync(path.resolve(distDir, 'llms-full.txt'), llmsFullMarkdown, 'utf8');

// =========================================================================
// 14. COPY DIST -> DOCS
// =========================================================================
if (fs.existsSync(docsDir)) {
  fs.rmSync(docsDir, { recursive: true, force: true });
}
fs.cpSync(distDir, docsDir, { recursive: true });
console.log(
  `✓ Pre-rendered ${totalGeneratedPages} static pages (${totalSitemapUrls} indexable + ${embedRoutes.length} noindex embeds) and mirrored dist/ -> docs/.`
);
