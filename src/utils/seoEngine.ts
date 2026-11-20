import { ENTITY_CONFIG, AUTHORS } from '../data/trustData';
import type { PageFaqItem } from '../components/PageFAQ';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface SeoRouteMeta {
  title: string;
  description: string;
  path?: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  keywords?: string;
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  faqs?: PageFaqItem[];
  pageKind?: 'home' | 'tool' | 'state-dataset' | 'article' | 'trust' | 'collection' | 'report';
  datePublished?: string;
  dateModified?: string;
  authorSlug?: string;
  reviewerSlug?: string;
  webAppName?: string;
  webAppDescription?: string;
  toolFeatureList?: string[];
  dataset?: {
    name: string;
    description: string;
    spatialCoverage: string;
    temporalCoverage?: string;
    variableMeasured: string[];
  };
  datasetInfo?: {
    name: string;
    description: string;
    stateName: string;
    temporalCoverage?: string;
    variables: string[];
  };
}

function setMetaTag(attr: 'name' | 'property', key: string, value: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

export function buildStackedSchemaGraph(meta: SeoRouteMeta): Record<string, unknown> {
  const routePath = meta.canonicalPath || meta.path || '/';
  const canonicalUrl = `${ENTITY_CONFIG.domain}${routePath}`;
  const ogImage = meta.ogImage
    ? meta.ogImage.startsWith('http')
      ? meta.ogImage
      : `${ENTITY_CONFIG.domain}${meta.ogImage}`
    : `${ENTITY_CONFIG.domain}/og-card.png`;

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': `${ENTITY_CONFIG.domain}/#organization`,
      name: ENTITY_CONFIG.brandName,
      url: `${ENTITY_CONFIG.domain}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${ENTITY_CONFIG.domain}/favicon-48x48.png`,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'consumer support',
        email: ENTITY_CONFIG.contactEmail,
        availableLanguage: ['English'],
      },
      sameAs: [
        `${ENTITY_CONFIG.domain}/about/`,
        `${ENTITY_CONFIG.domain}/editorial-policy/`,
        `${ENTITY_CONFIG.domain}/methodology/`,
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${ENTITY_CONFIG.domain}/#website`,
      url: `${ENTITY_CONFIG.domain}/`,
      name: ENTITY_CONFIG.brandName,
      publisher: { '@id': `${ENTITY_CONFIG.domain}/#organization` },
    },
  ];

  if (meta.breadcrumbs && meta.breadcrumbs.length > 0) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: meta.breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: crumb.name,
        item: `${ENTITY_CONFIG.domain}${crumb.path}`,
      })),
    });
  }

  if (meta.webAppName || meta.pageKind === 'tool' || meta.pageKind === 'home') {
    graph.push({
      '@type': 'WebApplication',
      '@id': `${canonicalUrl}#webapp`,
      name: meta.webAppName || meta.title.replace(/\s*\|\s*ItsMyBill$/i, ''),
      url: canonicalUrl,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires HTML5 compatible browser',
      description: meta.webAppDescription || meta.description,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: meta.toolFeatureList || [
        '100% Client-Side Private Calculations',
        'Zero Account Registration or Bank Logins',
        'Primary .gov Data & Statutory References',
      ],
      publisher: { '@id': `${ENTITY_CONFIG.domain}/#organization` },
    });
  }

  if (meta.dataset || (meta.pageKind === 'state-dataset' && meta.datasetInfo)) {
    const dsName = meta.dataset?.name || meta.datasetInfo!.name;
    const dsDesc = meta.dataset?.description || meta.datasetInfo!.description;
    const dsSpatial = meta.dataset?.spatialCoverage || `${meta.datasetInfo!.stateName}, United States`;
    const dsTemp = meta.dataset?.temporalCoverage || meta.datasetInfo?.temporalCoverage || '2026';
    const dsVars = meta.dataset?.variableMeasured || meta.datasetInfo!.variables;

    graph.push({
      '@type': 'Dataset',
      '@id': `${canonicalUrl}#dataset`,
      name: dsName,
      description: dsDesc,
      url: canonicalUrl,
      spatialCoverage: {
        '@type': 'Place',
        name: dsSpatial,
      },
      temporalCoverage: dsTemp,
      variableMeasured: dsVars,
      isBasedOn: 'https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a',
      creator: { '@id': `${ENTITY_CONFIG.domain}/#organization` },
      license: 'https://creativecommons.org/licenses/by/4.0/',
    });
  }

  if (
    meta.ogType === 'article' ||
    meta.pageKind === 'article' ||
    meta.pageKind === 'trust' ||
    meta.pageKind === 'report'
  ) {
    const author = AUTHORS[meta.authorSlug || 'itsmybill-editorial-team'];
    const reviewer = AUTHORS[meta.reviewerSlug || 'consumer-rights-review-desk'];
    graph.push({
      '@type': meta.pageKind === 'trust' ? 'WebPage' : 'Article',
      '@id': `${canonicalUrl}#content`,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
      headline: meta.title.replace(/\s*\|\s*ItsMyBill$/i, ''),
      description: meta.description,
      image: [ogImage],
      datePublished: meta.datePublished || '2026-09-01',
      dateModified: meta.dateModified || ENTITY_CONFIG.lastSiteAuditDate,
      inLanguage: 'en-US',
      author: {
        '@type': 'Person',
        name: author.name,
        url: `${ENTITY_CONFIG.domain}/authors/${author.slug}/`,
        sameAs: author.sameAs,
      },
      reviewedBy: {
        '@type': 'Person',
        name: reviewer.name,
        jobTitle: reviewer.credentials,
        url: `${ENTITY_CONFIG.domain}/authors/${reviewer.slug}/`,
        sameAs: reviewer.sameAs,
      },
      publisher: { '@id': `${ENTITY_CONFIG.domain}/#organization` },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', '[data-speakable="true"]'],
      },
    });
  }

  if (meta.faqs && meta.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faq`,
      mainEntity: meta.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function applySeoMetadataToDocument(meta: SeoRouteMeta): void {
  const routePath = meta.canonicalPath || meta.path || '/';
  const canonicalUrl = `${ENTITY_CONFIG.domain}${routePath}`;
  const ogImage = meta.ogImage
    ? meta.ogImage.startsWith('http')
      ? meta.ogImage
      : `${ENTITY_CONFIG.domain}${meta.ogImage}`
    : `${ENTITY_CONFIG.domain}/og-card.png`;

  document.title = meta.title;
  setMetaTag('name', 'description', meta.description);
  setMetaTag(
    'name',
    'robots',
    meta.noindex
      ? 'noindex, follow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  );
  if (meta.keywords) {
    setMetaTag('name', 'keywords', meta.keywords);
  }
  setMetaTag('property', 'og:type', meta.ogType || 'website');
  setMetaTag('property', 'og:title', meta.title);
  setMetaTag('property', 'og:description', meta.description);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:image', ogImage);
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', meta.title);
  setMetaTag('name', 'twitter:description', meta.description);
  setMetaTag('name', 'twitter:url', canonicalUrl);
  setMetaTag('name', 'twitter:image', ogImage);

  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // Sync single validated @graph JSON-LD block
  const existingStaticScripts = document.querySelectorAll('script[type="application/ld+json"]');
  existingStaticScripts.forEach((s) => {
    if (s.id !== 'itsmybill-schema-graph') {
      s.remove();
    }
  });

  const schemaObj = buildStackedSchemaGraph(meta);
  let scriptEl = document.getElementById('itsmybill-schema-graph');
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'itsmybill-schema-graph';
    scriptEl.setAttribute('type', 'application/ld+json');
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify(schemaObj);
}
