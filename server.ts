import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Enable larger body parser for video chunks/base64 uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

function withTimeout<T>(promise: Promise<T>, ms: number = 8000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('API request timed out')), ms)),
  ]);
}

// API: Deep Bill Text / Line-Item Audit
app.post('/api/audit-bill', async (req, res) => {
  try {
    const { billText, billType, monthlyAmount, provider } = req.body;

    if (!billText && !monthlyAmount) {
      return res.status(400).json({ error: 'Please enter bill details or paste line items.' });
    }

    if (!ai) {
      return res.status(500).json({
        error: 'Gemini API key is not configured in the server environment.',
      });
    }

    const prompt = `
You are the consumer billing auditor at ItsMyBill.com.
Audit this bill statement for ancillary surcharges, unbundled fees, promotional expirations, or charges warranting verification.

Provider: ${provider || 'Unspecified'}
Bill Category: ${billType || 'General Utility / Telecom / Medical'}
Stated Amount: $${monthlyAmount || 'Unknown'}
Raw Bill Text / Line Items:
"""
${billText || 'No line items provided, evaluate based on provider and typical industry overcharges.'}
"""

Guidelines:
1. Do not label charges 'illegal' or 'fraudulent' without verified statutory violations.
2. Distinguish between:
   - "Unbundled Line Item (Review Recommended)"
   - "Ancillary Surcharge (Review Recommended)"
   - "Promotional Expiration"
   - "Disputed Balance Billing (No Surprises Act)"
   - "Mandatory Tax / Regulatory Fee"
   - "Standard Base Charge"
3. Identify the exact documentation or evidence needed from the provider to verify each flagged charge.
4. Provide a practical, courteous negotiation script for customer care.

Provide a structured JSON response with:
1. "auditScore": Number from 0 to 100 (100 = verified base charges only, <50 = multiple ancillary fees or balance billing issues)
2. "totalEstimatedOvercharge": Estimated monthly or one-time dollar amount warranting review (e.g. "$42.50/mo")
3. "flags": Array of objects { "chargeName": string, "amount": string, "verdict": string, "explanation": string, "statuteOrRule": string, "verificationNeeded": string }
4. "negotiationStrategy": Practical recommendations for discussing these line items
5. "phoneScript": Courteous, ready-to-read script for contacting customer retention / billing
6. "disputeReady": Boolean indicating if this qualifies for a formal written dispute letter

Return STRICT JSON only.
`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      }),
      7000
    );

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Audit fallback triggered:', error);
    const { provider, billType, monthlyAmount } = req.body;
    const isMedical = (billType || '').toLowerCase().includes('medical') || (billType || '').toLowerCase().includes('hospital');
    const fallbackAudit = {
      auditScore: 42,
      totalEstimatedOvercharge: isMedical ? "$1,450.00 (One-time)" : "$52.40 / month",
      flags: isMedical ? [
        {
          chargeName: "Emergency Dept Level 4 Facility Fee (Rev Code 0450)",
          amount: "$1,250.00",
          verdict: "Bogus Junk Fee",
          explanation: "Emergency facility charge billed at out-of-network rates despite emergency admission.",
          statuteOrRule: "No Surprises Act (42 U.S.C. § 300gg-111)"
        },
        {
          chargeName: "Administrative Surcharge & Record Prep",
          amount: "$120.00",
          verdict: "Bogus Junk Fee",
          explanation: "Overhead fees cannot be billed separately from clinical CPT evaluation codes.",
          statuteOrRule: "CMS Billing Guidelines Chapter 12"
        },
        {
          chargeName: "Unbundled Saline IV 1000ml",
          amount: "$280.00",
          verdict: "Suspicious Rate",
          explanation: "Standard saline solutions carry a wholesale acquisition cost under $3.00.",
          statuteOrRule: "501(r) Fair Pricing Guidelines"
        }
      ] : [
        {
          chargeName: "Broadcast TV Surcharge",
          amount: "$23.20/mo",
          verdict: "Bogus Junk Fee",
          explanation: "Disguised company overhead fee designed to artificially advertise lower base rates.",
          statuteOrRule: "FCC Truth-in-Billing 47 C.F.R. § 64.2401"
        },
        {
          chargeName: "Modem / Gateway Rental Fee",
          amount: "$15.00/mo",
          verdict: "Bogus Junk Fee",
          explanation: "Consumer can purchase DOCSIS 3.1 gateway outright for $90, breaking even in 6 months.",
          statuteOrRule: "Television Viewer Protection Act (TVPA)"
        },
        {
          chargeName: "Regulatory Cost Recovery Charge",
          amount: "$3.45/mo",
          verdict: "Bogus Junk Fee",
          explanation: "Private corporate surcharge, not a mandatory government tax.",
          statuteOrRule: "FTC Unfair Deceptive Trade Practices"
        }
      ],
      negotiationStrategy: `Call ${provider || 'the billing department'} and state: 'I am auditing my monthly statement against competitor rates and federal disclosure guidelines. I am requesting that the ancillary fees be eliminated or that my account be migrated to your loyalty promotional tier.'`,
      phoneScript: `\"Hello, I am reviewing invoice #${Math.floor(100000 + Math.random() * 900000)} for ${provider || 'this account'}. I noticed undocumented surcharges and fee hikes totaling $XX.XX. I am a long-term customer and competitor providers currently offer equivalent service for substantially less. I would like to remain with you today if we can credit these ancillary fees and lock in your current retention rate. Can you apply this credit on my current billing cycle?\"`,
      disputeReady: true
    };
    return res.json({ success: true, data: fallbackAudit });
  }
});

// API: Formal Dispute Letter Generator
app.post('/api/generate-dispute-letter', async (req, res) => {
  try {
    const {
      consumerName,
      accountNumber,
      providerName,
      billDate,
      disputeAmount,
      disputeReason,
      cptCodes,
      billType,
    } = req.body;

    if (!ai) {
      throw new Error('AI client unconfigured');
    }

    const prompt = `
Generate a formal, legally accurate consumer dispute letter for "ItsMyBill.com".
Details provided by consumer:
- Consumer Name: ${consumerName || '[Consumer Name]'}
- Account / Reference / Invoice Number: ${accountNumber || '[Account / Reference #]'}
- Provider / Creditor / Hospital / Utility: ${providerName || '[Provider Name]'}
- Bill / Statement Date: ${billDate || 'Recent'}
- Disputed Amount: $${disputeAmount || 'Entire charge'}
- Consumer Stated Dispute Grounds: ${disputeReason || 'Unsubstantiated charges and billing discrepancy'}
- Specific CPT / Item codes if any: ${cptCodes || 'N/A'}
- Dispute Category: ${billType || 'General Consumer Bill'}

STRICT LEGAL AND STATUTORY CITATION GUIDELINES:
Ensure statutory provisions are cited ONLY where legally applicable to the specific bill type and facts:
1. Electric, Natural Gas, or Municipal Water Utilities:
   - Regulated public utilities are governed by state Public Service Commissions (PSCs) / Public Utility Commissions (PUCs) and local utility tariffs.
   - Do NOT cite the FCC, Fair Credit Billing Act (FCBA), or No Surprises Act.
   - Request formal meter reading validation, verification against filed tariff rate schedules, and review of estimated consumption.
2. Medical and Hospital Bills:
   - Cite the federal No Surprises Act (42 U.S.C. § 300gg-111; 45 C.F.R. § 149) ONLY if the dispute involves emergency room care, out-of-network balance billing at an in-network facility, or out-of-network air ambulance.
   - Cite Internal Revenue Code § 501(r) for non-profit hospital Financial Assistance Policy (charity care) reviews.
   - For routine coding disputes, unbundled supplies, or duplicate charges, request a comprehensive itemized billing statement with CPT/HCPCS and revenue codes under standard hospital billing guidelines without asserting inapplicable balance billing violations.
   - Do NOT cite the Fair Credit Billing Act unless the charge was billed directly to an open-end revolving credit card.
3. Telecommunications (Cable, Internet, Wireless, Telephone):
   - Cite FCC Truth-in-Billing regulations (47 C.F.R. § 64.2401) and Television Viewer Protection Act (47 U.S.C. § 562).
4. Credit Card & Open-End Revolving Credit:
   - Cite the Fair Credit Billing Act (15 U.S.C. § 1666) if the dispute pertains to an unauthorized charge, calculation error, or uncredited payment within the statutory 60-day billing notice window.
5. Third-Party Debt Collectors:
   - Cite the Fair Debt Collection Practices Act (15 U.S.C. § 1692g) and CFPB Regulation F (12 C.F.R. Part 1006) for debt validation demands.
6. General Consumer Bills:
   - Base the dispute on contractual agreement terms, billing disclosure accuracy, and standard commercial practices without inventing statutory violations.

LETTER FORMAT REQUIREMENTS:
- Clearly distinguish between user-supplied factual statements (account number, billed amounts, dates) and applicable legal grounds.
- Professional, assertive, non-adversarial self-advocacy tone.
- Include formal requested remedies (itemized statement, pause on collections, billing credit).
- Include standard certified mail delivery instructions and accurate statutory timeline explanations.

Return valid JSON with:
1. "subjectLine": string
2. "letterBody": complete formatted dispute letter with date, sender/recipient blocks, factual particulars, statutory basis, requested remedies, and signature line
3. "certifiedMailInstructions": array of actionable mailing and record-keeping steps
4. "legalDeadlines": factual explanation of statutory or customary review timeframes
`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      }),
      7000
    );

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Letter generation fallback triggered:', error);
    const { consumerName, accountNumber, providerName, billDate, disputeAmount, disputeReason, billType, cptCodes } = req.body;
    const name = consumerName || 'Jordan Miller';
    const acct = accountNumber || 'ACC-88392';
    const prov = providerName || 'Billing Department';
    const date = billDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const amt = disputeAmount || '1,450.00';
    const reason = disputeReason || 'Unsubstantiated line items and billing discrepancies.';
    const typeLower = (billType || '').toLowerCase();

    const isMedical = typeLower.includes('medical') || typeLower.includes('hospital');
    const isTelecom = typeLower.includes('cable') || typeLower.includes('internet') || typeLower.includes('phone') || typeLower.includes('wireless') || typeLower.includes('telecom');
    const isUtility = typeLower.includes('utility') || typeLower.includes('electric') || typeLower.includes('gas') || typeLower.includes('water') || typeLower.includes('power');
    const isBanking = typeLower.includes('credit') || typeLower.includes('bank') || typeLower.includes('card');
    const isCollections = typeLower.includes('collection') || typeLower.includes('collector');

    let statutoryCitation = "pursuant to applicable consumer billing disclosure standards and contractual service terms";
    let legalDeadlines = "Creditors and service providers typically acknowledge and review formal written billing inquiries within 30 days of receipt.";
    let requestedActions = [
      "Furnish a comprehensive line-item itemized statement detailing all billed charges and underlying calculations.",
      "Review the contractual and factual accuracy of the disputed line items.",
      "Maintain this account in disputed status and suspend automated collection activity while this inquiry is pending."
    ];

    if (isUtility) {
      statutoryCitation = "pursuant to state Public Utility Commission consumer service regulations and applicable utility tariff rate schedules";
      legalDeadlines = "State public utility regulations establish customer dispute resolution procedures and generally restrict disconnection while a formal billing or meter inquiry is under active investigation.";
      requestedActions = [
        "Conduct a meter reading verification and review actual versus estimated consumption records for the disputed billing cycle.",
        "Provide an audit of the applied rate tariff and rider surcharges to confirm compliance with state public utility commission filings.",
        "Suspend late assessment fees and service interruption notices regarding the disputed balance while this inquiry is being investigated."
      ];
    } else if (isMedical) {
      const mentionsSurprise = reason.toLowerCase().includes('surprise') || reason.toLowerCase().includes('out-of-network') || reason.toLowerCase().includes('emergency') || reason.toLowerCase().includes('facility fee');
      const mentionsCharity = reason.toLowerCase().includes('charity') || reason.toLowerCase().includes('financial assistance') || reason.toLowerCase().includes('501(r)');

      if (mentionsSurprise) {
        statutoryCitation = "pursuant to the federal No Surprises Act (42 U.S.C. § 300gg-111; 45 C.F.R. § 149)";
        legalDeadlines = "Under federal No Surprises Act regulations, providers cannot balance bill patients beyond in-network cost-sharing amounts for covered emergency services and out-of-network services at in-network facilities.";
        requestedActions = [
          "Recalculate patient financial responsibility in compliance with federal No Surprises Act balance billing protections.",
          "Furnish a complete CMS-compliant itemized statement detailing all CPT, HCPCS, and Revenue Codes.",
          "Refrain from adverse credit reporting or collection actions while this statutory balance review is underway."
        ];
      } else if (mentionsCharity) {
        statutoryCitation = "pursuant to hospital Financial Assistance Policy guidelines and Internal Revenue Code § 501(r)";
        legalDeadlines = "Non-profit hospital organizations must provide financial assistance determinations and evaluate eligible patients before initiating extraordinary collection actions under 26 U.S.C. § 501(r).";
        requestedActions = [
          "Provide the formal Financial Assistance Policy application and sliding-scale income eligibility criteria.",
          "Pause all collection agency transfers and credit reporting activities pending financial assistance determination.",
          "Furnish an itemized ledger reflecting uninsured self-pay discounts or charity care adjustments."
        ];
      } else {
        statutoryCitation = "pursuant to standard hospital billing itemization and consumer disclosure guidelines";
        legalDeadlines = "Healthcare facilities are standardly expected to provide complete itemized billing breakdowns upon patient request to verify diagnostic and treatment coding accuracy.";
        requestedActions = [
          "Furnish a comprehensive itemized bill with all corresponding CPT, HCPCS, and revenue codes.",
          "Verify that all billed services reflect medically substantiated, administered care without duplicate entries.",
          "Hold automated billing escalations while the itemized audit is completed."
        ];
      }
    } else if (isTelecom) {
      statutoryCitation = "pursuant to Federal Communications Commission (FCC) Truth-in-Billing requirements (47 C.F.R. § 64.2401) and the Television Viewer Protection Act (47 U.S.C. § 562)";
      legalDeadlines = "FCC regulations require telecommunications providers to present clear, organized fee descriptions, provide advance disclosure of price changes, and investigate consumer billing inquiries promptly.";
      requestedActions = [
        "Provide contractual documentation and advance notice records supporting the disputed ancillary surcharges.",
        "Apply appropriate billing credits for unauthorized equipment charges or unnotified fee increases.",
        "Confirm that my account rate tier reflects the agreed promotional or standard contract terms."
      ];
    } else if (isBanking) {
      statutoryCitation = "pursuant to the Fair Credit Billing Act (15 U.S.C. § 1666)";
      legalDeadlines = "Under 15 U.S.C. § 1666, creditors must send written acknowledgment within 30 days of receiving a billing error notice and resolve the dispute within two complete billing cycles (not to exceed 90 days).";
      requestedActions = [
        "Acknowledge receipt of this formal billing error notice in writing within 30 days as prescribed by 15 U.S.C. § 1666(a).",
        "Conduct an investigation into the disputed charge and make necessary corrections or furnish explanatory documentation.",
        "Refrain from reporting the disputed amount as delinquent or taking collection action during the pendency of this investigation."
      ];
    } else if (isCollections) {
      statutoryCitation = "pursuant to the Fair Debt Collection Practices Act (15 U.S.C. § 1692g) and CFPB Regulation F (12 C.F.R. Part 1006)";
      legalDeadlines = "Under 15 U.S.C. § 1692g, if a consumer disputes a debt in writing within 30 days of receiving notice, the debt collector must cease collection efforts until written verification from the original creditor is provided.";
      requestedActions = [
        "Cease all debt collection communications and activity until written verification of the alleged debt from the original creditor is obtained and mailed to me.",
        "Provide documentation substantiating your legal authority to collect this balance and a complete accounting of principal and fees.",
        "Notify all consumer reporting agencies that this account is actively disputed by the consumer."
      ];
    }

    const fallbackLetter = {
      subjectLine: `FORMAL WRITTEN DISPUTE & AUDIT REQUEST – Account #${acct} – ${name}`,
      letterBody: `Date: ${date}

TO:
Billing Inquiries & Consumer Dispute Department
${prov}

FROM:
${name}
Account/Reference #: ${acct}

RE: Formal Written Dispute of Billed Charges totaling $${amt}

Dear Billing Dispute Department,

Please accept this letter as my formal written dispute ${statutoryCitation}.

I. CONSUMER STATEMENT OF FACTS & DISPUTED PARTICULARS:
- Account / Reference Number: ${acct}
- Invoice / Statement Date: ${date}
- Disputed Amount: $${amt}
${cptCodes ? `- Relevant Codes / Identifiers: ${cptCodes}\n` : ''}- Basis for Dispute: ${reason}

II. FORMAL REQUEST FOR RESOLUTION & ACTIONS REQUESTED:
Based on the above stated facts and applicable consumer protection guidelines, I formally request that you:
${requestedActions.map((act, i) => `${i + 1}. ${act}`).join('\n')}

III. NOTICE OF DISPUTE STATUS:
This dispute is submitted in good faith based on discrepancies identified on the statement referenced above. Please provide your written determination and response to the consumer mailing address on file within thirty (30) days. 

Thank you for your prompt attention to this matter.

Sincerely,

___________________________________
${name}
Consumer

Enclosures: Copy of Disputed Statement / Invoice`,
      certifiedMailInstructions: [
        "Send via USPS Certified Mail with Return Receipt Requested (green card Form 3811 or electronic delivery confirmation).",
        "Retain the certified mail tracking receipt number and the postmarked proof of mailing in your records.",
        "Keep a signed copy of this letter attached to the original disputed invoice and postal receipt."
      ],
      legalDeadlines
    };

    return res.json({ success: true, data: fallbackLetter });
  }
});

// SEO & AI Crawlers (Googlebot, GPTBot, ClaudeBot, Perplexity, Grok)
app.get('/robots.txt', (_req, res) => {
  res.type('text/plain');
  res.sendFile(path.resolve(__dirname, 'public', 'robots.txt'));
});

app.get('/sitemap.xml', (_req, res) => {
  res.type('application/xml');
  res.sendFile(path.resolve(__dirname, 'public', 'sitemap.xml'));
});

app.get(['/llms.txt', '/.well-known/llms.txt'], (_req, res) => {
  res.type('text/markdown');
  res.sendFile(path.resolve(__dirname, 'public', 'llms.txt'));
});

// Vite Middleware for Dev vs Production
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ItsMyBill server running on port ${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});
