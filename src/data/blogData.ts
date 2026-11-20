import rawPosts from './blogPosts.json';

export type BlogCategory =
  | 'Medical Bills'
  | 'Personal Finance'
  | 'Roommates & Splitting'
  | 'Cable & Telecom'
  | 'Utility & Energy'
  | 'Credit & Debt';

export interface BlogTable {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface BlogScriptBox {
  title: string;
  body: string;
}

export interface BlogStatuteCitation {
  code: string;
  note: string;
}

export interface BlogSectionItem {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  numberedSteps?: string[];
  table?: BlogTable;
  scriptBox?: BlogScriptBox;
  statuteCitation?: BlogStatuteCitation;
}

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  category: BlogCategory;
  keywords: string[];
  publishedAt: string;
  updatedAt: string;
  readTimeMinutes: number;
  author: {
    name: string;
    role: string;
    credentials: string;
  };
  coverImage: string;
  coverAlt: string;
  coverCaption: string;
  featured: boolean;
  directAnswer: string;
  keyTakeaways: string[];
  relatedTool: {
    tabId: string;
    label: string;
    path: string;
    ctaDescription: string;
  };
  sections: BlogSectionItem[];
  faqs: BlogFaq[];
  sources: string[];
  relatedSlugs: string[];
}

export const BLOG_POSTS: BlogPost[] = rawPosts as BlogPost[];

export const BLOG_CATEGORIES: BlogCategory[] = [
  'Medical Bills',
  'Personal Finance',
  'Utility & Energy',
  'Cable & Telecom',
  'Roommates & Splitting',
  'Credit & Debt',
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  const normalized = slug.replace(/^\/+|\/+$/g, '').toLowerCase();
  return BLOG_POSTS.find((post) => post.slug.toLowerCase() === normalized);
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  const mapped = post.relatedSlugs
    .map((slug) => BLOG_POSTS.find((item) => item.slug === slug))
    .filter((item): item is BlogPost => Boolean(item));
  if (mapped.length >= 3) return mapped.slice(0, 3);
  const fallback = BLOG_POSTS.filter(
    (item) => item.slug !== post.slug && !mapped.some((m) => m.slug === item.slug)
  );
  return [...mapped, ...fallback].slice(0, 3);
}

export function formatBlogDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return isoDate;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function estimateWordCount(post: BlogPost): number {
  const chunks: string[] = [
    post.title,
    post.directAnswer,
    ...post.keyTakeaways,
    ...post.sections.flatMap((s) => [
      s.heading,
      ...s.paragraphs,
      ...(s.bullets || []),
      ...(s.numberedSteps || []),
      ...(s.scriptBox ? [s.scriptBox.title, s.scriptBox.body] : []),
      ...(s.table ? [s.table.caption, ...s.table.headers, ...s.table.rows.flat()] : []),
    ]),
    ...post.faqs.flatMap((f) => [f.question, f.answer]),
  ];
  return chunks.join(' ').trim().split(/\s+/).length;
}

export function buildBlogIndexJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://www.itsmybill.com/blog/#webpage',
        url: 'https://www.itsmybill.com/blog/',
        name: 'Bills & Personal Finance Guides | ItsMyBill Blog',
        description:
          'Authoritative U.S. consumer guides on lowering monthly bills, disputing medical and credit charges under federal law, comparing state utility rates, and splitting shared expenses.',
        isPartOf: { '@id': 'https://www.itsmybill.com/#website' },
        breadcrumb: { '@id': 'https://www.itsmybill.com/blog/#breadcrumb' },
      },
      {
        '@type': 'Blog',
        '@id': 'https://www.itsmybill.com/blog/#blog',
        url: 'https://www.itsmybill.com/blog/',
        name: 'ItsMyBill Bills & Personal Finance Journal',
        description:
          'Research-backed consumer playbooks covering household bills, utility rate benchmarks, statutory dispute rights, and practical personal finance.',
        publisher: {
          '@type': 'Organization',
          '@id': 'https://www.itsmybill.com/#organization',
          name: 'ItsMyBill',
          url: 'https://www.itsmybill.com/',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.itsmybill.com/favicon-48x48.png',
          },
        },
        blogPost: BLOG_POSTS.map((post) => ({
          '@type': 'BlogPosting',
          headline: post.title,
          url: `https://www.itsmybill.com/blog/${post.slug}/`,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          articleSection: post.category,
          description: post.metaDescription,
          image: `https://www.itsmybill.com${post.coverImage}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.itsmybill.com/blog/#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.itsmybill.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Bills & Finance Blog',
            item: 'https://www.itsmybill.com/blog/',
          },
        ],
      },
    ],
  };
}

export function buildArticleJsonLd(post: BlogPost): Record<string, unknown> {
  const canonicalUrl = `https://www.itsmybill.com/blog/${post.slug}/`;
  const fullImageUrl = `https://www.itsmybill.com${post.coverImage}`;
  const stepSection = post.sections.find((s) => s.numberedSteps && s.numberedSteps.length > 0);

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'BlogPosting',
      '@id': `${canonicalUrl}#article`,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
      headline: post.title,
      description: post.metaDescription,
      abstract: post.directAnswer,
      image: [fullImageUrl],
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      articleSection: post.category,
      keywords: post.keywords.join(', '),
      wordCount: estimateWordCount(post),
      inLanguage: 'en-US',
      author: {
        '@type': 'Organization',
        name: post.author.name,
        url: 'https://www.itsmybill.com/blog/',
      },
      publisher: {
        '@type': 'Organization',
        '@id': 'https://www.itsmybill.com/#organization',
        name: 'ItsMyBill',
        url: 'https://www.itsmybill.com/',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.itsmybill.com/favicon-48x48.png',
        },
      },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', '[data-speakable="true"]'],
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.itsmybill.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Bills & Finance Blog',
          item: 'https://www.itsmybill.com/blog/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: canonicalUrl,
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faq`,
      mainEntity: post.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ];

  if (stepSection && stepSection.numberedSteps) {
    graph.push({
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

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
