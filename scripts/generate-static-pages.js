import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const docsDir = path.resolve(rootDir, 'docs');

const baseHtmlPath = path.resolve(distDir, 'index.html');
if (!fs.existsSync(baseHtmlPath)) {
  console.error('dist/index.html does not exist. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');

const routes = [
  {
    folder: 'bill-splitter',
    canonical: 'https://www.itsmybill.com/bill-splitter/',
    title: 'Free Bill Splitter & Fair Expense Calculator | ItsMyBill',
    description: 'Split shared bills, roommate rent, dinner tabs, taxes, and tips fairly by income or equal shares with ItsMyBill free calculator.',
    h1: 'Fair Expense & Bill Splitter',
    h2: 'Calculate Equal, Income-Fair, and Itemized Splits Without Account Sign-Ups',
    content: `
      <section style="background-color: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #34d399; margin-bottom: 12px;">Three Transparent Calculation Methods</h2>
        <ul style="list-style: none; padding: 0; display: grid; gap: 16px; color: #cbd5e1;">
          <li>
            <strong style="color: #f8fafc;">1. Equal Dinner &amp; Bill Split:</strong>
            Divides total charges evenly across all participants, accurately allocating sales taxes and custom gratuities (15%, 18%, 20%, 25%) with optional whole-dollar rounding.
          </li>
          <li>
            <strong style="color: #f8fafc;">2. Income-Proportional Roommate Split:</strong>
            Distributes shared rent and utility expenses proportionally based on each individual's take-home pay, preventing financial strain when incomes differ.
            <div style="background-color: #020617; padding: 12px; border-radius: 8px; border: 1px solid #334155; margin-top: 8px; font-family: monospace; font-size: 13px; color: #10b981;">
              Individual Share = Total Shared Expenses × (Individual Income ÷ Total Household Income)
            </div>
          </li>
          <li>
            <strong style="color: #f8fafc;">3. Itemized Receipt Split:</strong>
            Assigns individual dishes and shared appetizers to specific guests, multiplying individual subtotals by the overall tax and tip multiplier so no one overpays for another person's meal.
          </li>
        </ul>
      </section>
      <section style="background-color: #0f172a; padding: 20px; border-radius: 12px; border: 1px solid #1e293b;">
        <h3 style="font-size: 16px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">Explore Companion Utilities</h3>
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 12px;">ItsMyBill provides a complete suite of consumer defense and utility tools:</p>
        <div style="display: flex; flex-wrap: wrap; gap: 12px;">
          <a href="/bill-auditor/" style="color: #34d399; text-decoration: underline; font-size: 14px;">Line-Item Fee Checker</a>
          <a href="/dispute-letter-generator/" style="color: #34d399; text-decoration: underline; font-size: 14px;">Dispute Letter Generator</a>
          <a href="/utility-benchmarks/" style="color: #34d399; text-decoration: underline; font-size: 14px;">50-State Utility Benchmarks</a>
          <a href="/savings-tracker/" style="color: #34d399; text-decoration: underline; font-size: 14px;">Savings Tracker</a>
        </div>
      </section>
    `,
  },
  {
    folder: 'bill-auditor',
    canonical: 'https://www.itsmybill.com/bill-auditor/',
    title: 'Line-Item Fee Checker & Bill Review Tool | ItsMyBill',
    description: 'Review telecom, internet, cable, and medical statements for ancillary surcharges, unbundled fees, and expired promotional rates with ItsMyBill.',
    h1: 'Line-Item Fee Checker & Bill Review Tool',
    h2: 'Evaluate Telecom Surcharges, Ancillary Cable Fees, and Medical Balance Billing',
    content: `
      <section style="background-color: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #34d399; margin-bottom: 12px;">Common Ancillary Charges Warranting Review</h2>
        <ul style="list-style: none; padding: 0; display: grid; gap: 16px; color: #cbd5e1;">
          <li>
            <strong style="color: #f8fafc;">Broadcast TV Surcharge &amp; Regional Sports Fees:</strong>
            Discretionary carrier fees added to cable bills (frequently $20–$32/mo) that are not governmental taxes, often disguised in fine print.
          </li>
          <li>
            <strong style="color: #f8fafc;">Regulatory Cost Recovery Fees:</strong>
            Carrier-imposed surcharges used to offset federal and state compliance costs. While carriers are permitted to bill them, they are private company line items, not mandated statutory taxes.
          </li>
          <li>
            <strong style="color: #f8fafc;">Unbundled Hospital Facility Fees (Revenue Code 0450):</strong>
            Hospital outpatient clinic overhead charges added on top of physician fees, frequently eligible for formal dispute under the federal No Surprises Act (42 U.S.C. § 300gg-111).
          </li>
        </ul>
      </section>
      <section style="background-color: #0f172a; padding: 20px; border-radius: 12px; border: 1px solid #1e293b;">
        <h3 style="font-size: 16px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">Recommended Action Steps</h3>
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 12px;">Use our companion tools to draft written disputes or compare utility costs:</p>
        <div style="display: flex; flex-wrap: wrap; gap: 12px;">
          <a href="/dispute-letter-generator/" style="color: #34d399; text-decoration: underline; font-size: 14px;">Draft Formal Dispute Letter</a>
          <a href="/utility-benchmarks/" style="color: #34d399; text-decoration: underline; font-size: 14px;">Compare State Utility Costs</a>
          <a href="/bill-splitter/" style="color: #34d399; text-decoration: underline; font-size: 14px;">Split Shared Expenses</a>
        </div>
      </section>
    `,
  },
  {
    folder: 'dispute-letter-generator',
    canonical: 'https://www.itsmybill.com/dispute-letter-generator/',
    title: 'Consumer Bill Dispute Letter Drafting Tool | ItsMyBill',
    description: 'Draft formal written dispute notices tailored to applicable federal and state consumer standards, including the No Surprises Act, FCBA, FDCPA, and state PUC rules.',
    h1: 'Consumer Bill Dispute Letter Drafting Tool',
    h2: 'Draft Category-Specific Dispute Notices Under Applicable Consumer Protection Laws',
    content: `
      <section style="background-color: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #34d399; margin-bottom: 12px;">Category-Specific Consumer Protection Standards</h2>
        <p style="color: #94a3b8; font-size: 13px; margin-bottom: 16px;">Legal protections depend strictly on your bill category and dispute circumstances. Our generator drafts tailored notices citing only relevant authorities:</p>
        <ul style="list-style: none; padding: 0; display: grid; gap: 16px; color: #cbd5e1;">
          <li>
            <strong style="color: #f8fafc;">Medical & Hospital Bills (Federal No Surprises Act, 42 U.S.C. § 300gg-111 & IRC § 501(r)):</strong>
            Protects insured patients against out-of-network balance billing for emergency services and facility care at in-network hospitals. Governs charity care and financial assistance reviews at non-profit hospitals under IRC § 501(r).
          </li>
          <li>
            <strong style="color: #f8fafc;">Electric, Gas & Water Utilities (State Public Utility Commission Standards):</strong>
            Regulated by state PSCs/PUCs rather than federal telecom laws. Governs meter accuracy verification, billing adjustment requests, and tariff rate compliance.
          </li>
          <li>
            <strong style="color: #f8fafc;">Credit Card & Revolving Credit (Fair Credit Billing Act, 15 U.S.C. § 1666):</strong>
            Applies to unauthorized transactions, calculation errors, or uncredited payments on open-end credit cards disputed in writing within 60 days of the periodic statement.
          </li>
          <li>
            <strong style="color: #f8fafc;">Third-Party Debt Collectors (Fair Debt Collection Practices Act, 15 U.S.C. § 1692g):</strong>
            Mandates that collection agencies cease collection activities upon receiving a timely written dispute until original creditor debt verification is provided.
          </li>
          <li>
            <strong style="color: #f8fafc;">Cable, Internet & Phone (FCC Truth-in-Billing, 47 C.F.R. § 64.2401 & TVPA):</strong>
            Requires transparent line-item fee disclosure and prohibits unnotified fee increases on telecommunications statements.
          </li>
        </ul>
      </section>
      <section style="background-color: #0f172a; padding: 20px; border-radius: 12px; border: 1px solid #1e293b;">
        <h3 style="font-size: 16px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">USPS Certified Mail Guidance</h3>
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 12px;">Always transmit formal dispute letters via USPS Certified Mail with Return Receipt Requested to ensure verifiable legal delivery evidence.</p>
        <div style="display: flex; flex-wrap: wrap; gap: 12px;">
          <a href="/bill-auditor/" style="color: #34d399; text-decoration: underline; font-size: 14px;">Review Bill Fees First</a>
          <a href="/savings-tracker/" style="color: #34d399; text-decoration: underline; font-size: 14px;">Track Disputed Savings</a>
          <a href="/bill-splitter/" style="color: #34d399; text-decoration: underline; font-size: 14px;">Split Expenses Fairly</a>
        </div>
      </section>
    `,
  },
  {
    folder: 'utility-benchmarks',
    canonical: 'https://www.itsmybill.com/utility-benchmarks/',
    title: '50-State Utility Benchmarks & Comparison | ItsMyBill',
    description: 'Compare household electric and natural gas expenses against official benchmarks from the U.S. EIA, with FCC broadband benchmarks and municipal water survey data.',
    h1: '50-State Utility Cost Benchmarks & Comparison',
    h2: 'Official Energy Data from U.S. EIA, FCC Broadband Surveys, and Municipal Water Rates',
    content: `
      <section style="background-color: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #34d399; margin-bottom: 12px;">Authoritative Data Sources &amp; Units</h2>
        <ul style="list-style: none; padding: 0; display: grid; gap: 16px; color: #cbd5e1;">
          <li>
            <strong style="color: #f8fafc;">Electricity (U.S. Energy Information Administration - EIA):</strong>
            Official residential electricity prices in cents per kilowatt-hour (¢/kWh) from EIA Form EIA-861M (Electric Power Monthly, Table 5.6.A). Monthly electric bills are calculated assuming the EIA national median residential consumption of 890 kWh/month.
          </li>
          <li>
            <strong style="color: #f8fafc;">Natural Gas (U.S. EIA &amp; American Gas Association - AGA):</strong>
            State residential heating benchmarks published in the EIA Natural Gas Monthly combined with seasonal heating expenditure data from the AGA.
          </li>
          <li>
            <strong style="color: #f8fafc;">Broadband Internet (Federal Communications Commission - FCC):</strong>
            Standalone 100–300 Mbps fixed terrestrial internet tiers reported in the FCC Urban Rate Survey.
          </li>
          <li>
            <strong style="color: #f8fafc;">Water &amp; Wastewater (AWWA / EPA Rate Surveys):</strong>
            Median single-family residential utility charges from the American Water Works Association (AWWA) and EPA water &amp; wastewater rate surveys (~6,000 gallons/month).
          </li>
        </ul>
      </section>
      <section style="background-color: #0f172a; padding: 20px; border-radius: 12px; border: 1px solid #1e293b;">
        <h3 style="font-size: 16px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">Next Steps for High Utility Bills</h3>
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 12px;">If your bills exceed your state average, audit your statement for ancillary line items or track monthly reductions:</p>
        <div style="display: flex; flex-wrap: wrap; gap: 12px;">
          <a href="/bill-auditor/" style="color: #34d399; text-decoration: underline; font-size: 14px;">Audit Monthly Statement</a>
          <a href="/savings-tracker/" style="color: #34d399; text-decoration: underline; font-size: 14px;">Track Utility Savings</a>
          <a href="/bill-splitter/" style="color: #34d399; text-decoration: underline; font-size: 14px;">Split Utility Bills</a>
        </div>
      </section>
    `,
  },
  {
    folder: 'savings-tracker',
    canonical: 'https://www.itsmybill.com/savings-tracker/',
    title: 'Realized Bill Savings Tracker | ItsMyBill',
    description: 'Track and calculate your ongoing monthly and one-time realized savings from negotiated bills and disputed fees with ItsMyBill.',
    h1: 'Realized Bill Savings Tracker',
    h2: 'Calculate Ongoing Monthly Cashflow and 5-Year Compounded Wealth Growth',
    content: `
      <section style="background-color: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #34d399; margin-bottom: 12px;">Track Negotiated Reductions &amp; Fee Wipes</h2>
        <ul style="list-style: none; padding: 0; display: grid; gap: 16px; color: #cbd5e1;">
          <li>
            <strong style="color: #f8fafc;">Recurring Monthly Reductions:</strong>
            Log ongoing monthly savings from telecom retention negotiations, expired promotion extensions, or equipment return savings.
          </li>
          <li>
            <strong style="color: #f8fafc;">One-Time Dispute Wipes:</strong>
            Log single-event fee reductions from disputed hospital balance bills, removed late fees, or billing error credits.
          </li>
          <li>
            <strong style="color: #f8fafc;">5-Year Compounded Projection:</strong>
            Calculates the future value of your monthly savings if invested in a standard low-cost index fund (7% annual S&amp;P 500 baseline).
          </li>
          <li>
            <strong style="color: #f8fafc;">Private Client-Side Storage:</strong>
            All savings entries remain stored in your local browser storage. No account creation, passwords, or data tracking required.
          </li>
        </ul>
      </section>
      <section style="background-color: #0f172a; padding: 20px; border-radius: 12px; border: 1px solid #1e293b;">
        <h3 style="font-size: 16px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">Explore More Tools</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 12px;">
          <a href="/bill-auditor/" style="color: #34d399; text-decoration: underline; font-size: 14px;">Audit Your Next Statement</a>
          <a href="/dispute-letter-generator/" style="color: #34d399; text-decoration: underline; font-size: 14px;">Draft Dispute Letter</a>
          <a href="/bill-splitter/" style="color: #34d399; text-decoration: underline; font-size: 14px;">Fair Roommate Splitter</a>
        </div>
      </section>
    `,
  },
];

console.log('Generating pre-rendered static routes for search engines and direct URLs...');

for (const route of routes) {
  const targetDir = path.resolve(distDir, route.folder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Replace title
  let html = baseHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${route.title}</title>`);
  
  // Replace meta description
  html = html.replace(/<meta name="description" content="[\s\S]*?" \/>/i, `<meta name="description" content="${route.description}" />`);
  
  // Replace canonical
  html = html.replace(/<link rel="canonical" href="[\s\S]*?" \/>/i, `<link rel="canonical" href="${route.canonical}" />`);
  
  // Replace og:title & og:description & og:url
  html = html.replace(/<meta property="og:title" content="[\s\S]*?" \/>/i, `<meta property="og:title" content="${route.title}" />`);
  html = html.replace(/<meta property="og:description" content="[\s\S]*?" \/>/i, `<meta property="og:description" content="${route.description}" />`);
  html = html.replace(/<meta property="og:url" content="[\s\S]*?" \/>/i, `<meta property="og:url" content="${route.canonical}" />`);

  // Replace twitter tags
  html = html.replace(/<meta name="twitter:title" content="[\s\S]*?" \/>/i, `<meta name="twitter:title" content="${route.title}" />`);
  html = html.replace(/<meta name="twitter:description" content="[\s\S]*?" \/>/i, `<meta name="twitter:description" content="${route.description}" />`);
  html = html.replace(/<meta name="twitter:url" content="[\s\S]*?" \/>/i, `<meta name="twitter:url" content="${route.canonical}" />`);

  // Replace inner crawlable content inside <div id="root">
  const rootSemanticHtml = `
    <div id="root">
      <!-- Semantic crawlable pre-rendered content for ${route.folder} -->
      <div style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc; line-height: 1.6;">
        <header style="margin-bottom: 32px;">
          <h1 style="font-size: 32px; font-weight: 800; color: #10b981; margin-bottom: 12px;">${route.h1}</h1>
          <p style="font-size: 18px; color: #94a3b8;">${route.h2}</p>
        </header>
        <main>
          ${route.content}
        </main>
      </div>
    </div>`;

  html = html.replace(/<div id="root">[\s\S]*?<\/div>\s*<\/div>/i, rootSemanticHtml);

  fs.writeFileSync(path.resolve(targetDir, 'index.html'), html, 'utf8');
  console.log(`✓ Generated: dist/${route.folder}/index.html`);
}

// Copy dist to docs
console.log('Copying build artifacts from dist/ to docs/...');
if (fs.existsSync(docsDir)) {
  fs.rmSync(docsDir, { recursive: true, force: true });
}
fs.cpSync(distDir, docsDir, { recursive: true });
console.log('✓ Successfully populated docs/ directory with all routes and static assets.');
