import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  FileText,
  Scale,
  Search,
  Share2,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  BLOG_CATEGORIES,
  BLOG_POSTS,
  BlogCategory,
  BlogPost,
  formatBlogDate,
  getRelatedPosts,
} from '../data/blogData';

interface BlogSectionProps {
  activeSlug: string | null;
  onSelectPost: (slug: string | null) => void;
  onNavigateToTool: (tabId: string) => void;
}

const EditorialImage: React.FC<{
  src: string;
  alt: string;
  title: string;
  className?: string;
}> = ({ src, alt, title, className = '' }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/50 text-slate-400 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <BookOpen className="w-8 h-8 text-emerald-400/70 mb-2" />
        <span className="text-xs font-medium text-slate-300 max-w-xs line-clamp-2">{title}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

const ArticleReader: React.FC<{
  post: BlogPost;
  onSelectPost: (slug: string | null) => void;
  onNavigateToTool: (tabId: string) => void;
}> = ({ post, onSelectPost, onNavigateToTool }) => {
  const [readProgress, setReadProgress] = useState(0);
  const [activeHeadingId, setActiveHeadingId] = useState<string>(post.sections[0]?.id || '');
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const relatedPosts = useMemo(() => getRelatedPosts(post), [post]);

  useEffect(() => {
    setOpenFaqIndex(0);
    setActiveHeadingId(post.sections[0]?.id || '');
  }, [post.slug]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setReadProgress(Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)));
      }

      const sectionIds = [...post.sections.map((s) => s.id), 'article-faq'];
      let current = sectionIds[0] || '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
            current = id;
          }
        }
      }
      setActiveHeadingId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post.sections]);

  const handleCopyScript = (id: string, body: string) => {
    navigator.clipboard.writeText(body);
    setCopiedScriptId(id);
    setTimeout(() => setCopiedScriptId(null), 2000);
  };

  const handleCopyArticleUrl = () => {
    const url = `${window.location.origin}/blog/${post.slug}/`;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Subtle 2px Reading Progress Bar */}
      <div
        className="fixed top-16 left-0 right-0 h-0.5 bg-slate-900 z-40 no-print"
        aria-hidden="true"
      >
        <div
          className="h-full bg-emerald-400 transition-transform duration-150 origin-left"
          style={{ transform: `scaleX(${readProgress / 100})` }}
        />
      </div>

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigateToTool('split');
          }}
          className="hover:text-emerald-400 transition-colors"
        >
          Home
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
        <a
          href="/blog/"
          onClick={(e) => {
            e.preventDefault();
            onSelectPost(null);
          }}
          className="hover:text-emerald-400 transition-colors"
        >
          Bills &amp; Finance Blog
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
        <span className="text-slate-300">{post.category}</span>
      </nav>

      {/* Main Asymmetric Editorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Primary Article Column (8 cols) */}
        <article className="lg:col-span-8 space-y-8">
          {/* Article Header */}
          <header className="space-y-4 pb-6 border-b border-slate-800">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-emerald-400">{post.category}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.updatedAt}>Updated {formatBlogDate(post.updatedAt)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readTimeMinutes} min read</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-white tracking-tight leading-[1.15]"
              style={{ textWrap: 'balance' }}
            >
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {post.metaDescription}
            </p>

            {/* E-E-A-T Byline & Fact-Check Attribution */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-400">
              <div className="space-y-0.5">
                <div className="text-slate-200 font-semibold">
                  By {post.author.name} <span className="font-normal text-slate-400">— {post.author.role}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{post.author.credentials}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyArticleUrl}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {copiedUrl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Share Guide</span>
                  </>
                )}
              </button>
            </div>
          </header>

          {/* Editorial Cover Figure */}
          <figure className="space-y-2.5">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              <EditorialImage
                src={post.coverImage}
                alt={post.coverAlt}
                title={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="text-xs text-slate-400 italic leading-relaxed">
              {post.coverCaption}
            </figcaption>
          </figure>

          {/* Answer-First Summary (Featured Snippet & AI Overview Block) */}
          <section
            aria-label="Quick Summary and Key Takeaways"
            data-speakable="true"
            className="rounded-xl border border-slate-800 bg-slate-900/75 p-6 space-y-4"
          >
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white tracking-tight">
                Direct Answer &amp; Key Takeaways
              </h2>
              <span className="text-xs text-slate-400">Quick Reference</span>
            </div>
            <p className="text-sm sm:text-[15px] text-slate-200 leading-relaxed font-medium">
              {post.directAnswer}
            </p>
            <ul className="space-y-2 pt-1 text-sm text-slate-300">
              {post.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="text-emerald-400 font-semibold tabular-nums shrink-0 mt-0.5">
                    0{idx + 1}.
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Body Sections */}
          <div className="space-y-10 max-w-none">
            {post.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 space-y-4">
                <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">
                  {section.heading}
                </h2>

                {section.paragraphs.map((para, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-[15px] sm:text-base text-slate-300 leading-[1.75] max-w-[68ch]"
                  >
                    {para}
                  </p>
                ))}

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="space-y-3 pt-1 max-w-[68ch]">
                    {section.bullets.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-3 text-[15px] text-slate-300 leading-relaxed"
                      >
                        <span className="text-emerald-400 font-bold mt-0.5" aria-hidden="true">
                          —
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.numberedSteps && section.numberedSteps.length > 0 && (
                  <ol className="space-y-3.5 pt-1 max-w-[68ch]">
                    {section.numberedSteps.map((step, sIdx) => (
                      <li
                        key={sIdx}
                        className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 text-sm sm:text-[15px] text-slate-200 leading-relaxed"
                      >
                        <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums shrink-0 mt-0.5">
                          {String(sIdx + 1).padStart(2, '0')}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                )}

                {section.table && (
                  <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 my-4">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <caption className="px-4 py-3 text-left text-xs font-semibold text-slate-300 border-b border-slate-800 bg-slate-900/90">
                        {section.table.caption}
                      </caption>
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                          {section.table.headers.map((header, hIdx) => (
                            <th key={hIdx} className="px-4 py-3 font-semibold whitespace-nowrap">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70">
                        {section.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-900/80 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`px-4 py-3 leading-relaxed tabular-nums ${
                                  cIdx === 0
                                    ? 'font-semibold text-white'
                                    : 'text-slate-300'
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {section.scriptBox && (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 my-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span>{section.scriptBox.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyScript(section.id, section.scriptBox!.body)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
                      >
                        {copiedScriptId === section.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied Script</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Copy Script</span>
                          </>
                        )}
                      </button>
                    </div>
                    <blockquote className="text-sm text-slate-200 leading-relaxed font-serif italic">
                      &ldquo;{section.scriptBox.body}&rdquo;
                    </blockquote>
                  </div>
                )}

                {section.statuteCitation && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                      <Scale className="w-3.5 h-3.5 shrink-0" />
                      <span>Statutory &amp; Regulatory Scope: {section.statuteCitation.code}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {section.statuteCitation.note}
                    </p>
                  </div>
                )}
              </section>
            ))}

            {/* Inline Contextual Tool CTA */}
            <section className="rounded-xl border border-emerald-500/25 bg-slate-900 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-xl">
                <div className="text-xs font-semibold text-emerald-400">
                  Free Companion Utility · No Login Required
                </div>
                <h3 className="text-lg font-bold text-white">
                  Put This Guide Into Action Right Now
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {post.relatedTool.ctaDescription}
                </p>
              </div>
              <a
                href={post.relatedTool.path}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToTool(post.relatedTool.tabId);
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold transition-colors whitespace-nowrap shrink-0"
              >
                <span>{post.relatedTool.label}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </section>

            {/* Article-Specific FAQ Section (Synced with FAQPage JSON-LD) */}
            <section id="article-faq" className="scroll-mt-24 pt-6 border-t border-slate-800 space-y-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs text-slate-400">
                  Direct answers on {post.category.toLowerCase()} rules and practical billing steps.
                </p>
              </div>
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-900/40 overflow-hidden">
                {post.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={idx}>
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-900/70 transition-colors cursor-pointer"
                      >
                        <span className="text-sm font-semibold text-white leading-snug">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-emerald-400' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 text-sm text-slate-300 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Primary Sources & Editorial Integrity Block */}
            <section className="pt-6 border-t border-slate-800 space-y-3">
              <h2 className="text-sm font-bold text-slate-200">
                Primary Government &amp; Regulatory Sources
              </h2>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {post.sources.map((src, idx) => (
                  <li key={idx} className="leading-relaxed">
                    [{idx + 1}] {src}
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-slate-500 leading-relaxed pt-2">
                Editorial Notice: This article is published for consumer financial education and
                self-advocacy. ItsMyBill is not a law firm or licensed financial advisory practice.
                Verify account figures and state-specific utility tariffs before submitting formal
                disputes.
              </p>
            </section>
          </div>
        </article>

        {/* Sticky Right Margin Sidebar (4 cols) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6 no-print">
          {/* Table of Contents */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 tracking-wide">
              In This Guide
            </h3>
            <nav aria-label="Table of contents" className="space-y-1.5">
              {post.sections.map((section, idx) => {
                const isActive = activeHeadingId === section.id;
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`flex items-start gap-2 py-1.5 px-2.5 rounded-lg text-xs leading-snug transition-colors ${
                      isActive
                        ? 'bg-slate-800 text-emerald-300 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="font-mono text-[11px] tabular-nums text-slate-500 shrink-0">
                      0{idx + 1}
                    </span>
                    <span>{section.heading}</span>
                  </a>
                );
              })}
              <a
                href="#article-faq"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('article-faq')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex items-start gap-2 py-1.5 px-2.5 rounded-lg text-xs leading-snug transition-colors ${
                  activeHeadingId === 'article-faq'
                    ? 'bg-slate-800 text-emerald-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span className="font-mono text-[11px] tabular-nums text-slate-500 shrink-0">
                  0{post.sections.length + 1}
                </span>
                <span>Frequently Asked Questions</span>
              </a>
            </nav>
          </div>

          {/* Companion Tool Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
            <div className="text-xs font-semibold text-emerald-400">Recommended Free Tool</div>
            <h3 className="text-base font-bold text-white leading-snug">
              {post.relatedTool.label}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {post.relatedTool.ctaDescription}
            </p>
            <a
              href={post.relatedTool.path}
              onClick={(e) => {
                e.preventDefault();
                onNavigateToTool(post.relatedTool.tabId);
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors"
            >
              <span>Launch Tool</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Back to Blog Index */}
          <a
            href="/blog/"
            onClick={(e) => {
              e.preventDefault();
              onSelectPost(null);
            }}
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-emerald-400 transition-colors px-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Bills &amp; Finance Guides</span>
          </a>
        </aside>
      </div>

      {/* Related Topic Cluster Guides */}
      <section className="pt-10 border-t border-slate-800 space-y-6 no-print">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Continue Reading in Bills &amp; Personal Finance
          </h2>
          <a
            href="/blog/"
            onClick={(e) => {
              e.preventDefault();
              onSelectPost(null);
            }}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap"
          >
            View All Guides →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map((rel) => (
            <a
              key={rel.slug}
              href={`/blog/${rel.slug}/`}
              onClick={(e) => {
                e.preventDefault();
                onSelectPost(rel.slug);
              }}
              className="group rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-colors overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-slate-950">
                <EditorialImage
                  src={rel.coverImage}
                  alt={rel.coverAlt}
                  title={rel.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-emerald-400 font-medium">{rel.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{rel.readTimeMinutes} min read</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {rel.metaDescription}
                  </p>
                </div>
                <div className="text-xs font-semibold text-emerald-400 inline-flex items-center gap-1 pt-1">
                  <span>Read guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export const BlogSection: React.FC<BlogSectionProps> = ({
  activeSlug,
  onSelectPost,
  onNavigateToTool,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const activePost = useMemo(
    () => (activeSlug ? BLOG_POSTS.find((p) => p.slug === activeSlug) || null : null),
    [activeSlug]
  );

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BLOG_POSTS.filter((post) => {
      const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.metaDescription.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.keywords.some((kw) => kw.toLowerCase().includes(q)) ||
        post.directAnswer.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  // Render full article if a valid slug is active
  if (activePost) {
    return (
      <ArticleReader
        post={activePost}
        onSelectPost={onSelectPost}
        onNavigateToTool={onNavigateToTool}
      />
    );
  }

  const isFiltering = selectedCategory !== 'All' || searchQuery.trim().length > 0;
  const leadPost = !isFiltering ? filteredPosts[0] : null;
  const secondaryPosts = !isFiltering ? filteredPosts.slice(1, 3) : [];
  const archivePosts = !isFiltering ? filteredPosts.slice(3) : filteredPosts;

  return (
    <div className="space-y-10">
      {/* Editorial Publication Header */}
      <header className="space-y-5 pb-8 border-b border-slate-800">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-emerald-400">ItsMyBill Editorial Journal</span>
          <span aria-hidden="true">·</span>
          <span>U.S. Bills, Consumer Rights &amp; Personal Finance</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{BLOG_POSTS.length} Research Guides</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.12]"
              style={{ textWrap: 'balance' }}
            >
              Bills &amp; Personal Finance Guides
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Practical, statute-backed playbooks on auditing medical and telecom statements,
              lowering monthly utility bills, disputing unlawful charges, and building resilient
              household cash flow.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search
              className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bills, laws, or topics..."
              aria-label="Search blog guides"
              className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-lg pl-10 pr-9 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Interactive Category Filter Controls */}
        <div
          className="flex flex-wrap items-center gap-1.5 pt-2"
          role="tablist"
          aria-label="Filter guides by topic"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === 'All'}
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            All Guides ({BLOG_POSTS.length})
          </button>
          {BLOG_CATEGORIES.map((category) => {
            const count = BLOG_POSTS.filter((p) => p.category === category).length;
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>
      </header>

      {/* Empty Search State */}
      {filteredPosts.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-12 text-center space-y-3">
          <p className="text-base font-semibold text-white">
            No guides match &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-sm text-slate-400">
            Try searching for &ldquo;No Surprises Act&rdquo;, &ldquo;electric bill&rdquo;,
            &ldquo;rent split&rdquo;, or &ldquo;credit card&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Tier 1: Lead Featured Story */}
      {leadPost && (
        <section aria-label="Featured Lead Guide">
          <a
            href={`/blog/${leadPost.slug}/`}
            onClick={(e) => {
              e.preventDefault();
              onSelectPost(leadPost.slug);
            }}
            className="group grid grid-cols-1 lg:grid-cols-12 items-stretch rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-slate-700 transition-colors overflow-hidden"
          >
            <div className="lg:col-span-6 relative min-h-[240px] bg-slate-950 overflow-hidden">
              <EditorialImage
                src={leadPost.coverImage}
                alt={leadPost.coverAlt}
                title={leadPost.title}
                className="w-full h-full lg:h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>

            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-emerald-400">Featured Pillar Guide</span>
                  <span aria-hidden="true">·</span>
                  <span>{leadPost.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Updated {formatBlogDate(leadPost.updatedAt)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{leadPost.readTimeMinutes} min read</span>
                </div>

                <h2
                  className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-emerald-300 transition-colors leading-tight"
                  style={{ textWrap: 'balance' }}
                >
                  {leadPost.title}
                </h2>

                <p className="text-sm sm:text-[15px] text-slate-300 leading-relaxed">
                  {leadPost.directAnswer}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400">{leadPost.author.name}</span>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Read Full Playbook</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </a>
        </section>
      )}

      {/* Tier 2: Secondary Featured Guides */}
      {secondaryPosts.length > 0 && (
        <section aria-label="Editor Picks" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {secondaryPosts.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}/`}
              onClick={(e) => {
                e.preventDefault();
                onSelectPost(post.slug);
              }}
              className="group rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-colors overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-slate-950">
                <EditorialImage
                  src={post.coverImage}
                  alt={post.coverAlt}
                  title={post.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-emerald-400">{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>Updated {formatBlogDate(post.updatedAt)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readTimeMinutes} min read</span>
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {post.metaDescription}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 pt-2">
                  <span>Read guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </a>
          ))}
        </section>
      )}

      {/* Tier 3: Structured Editorial Archive List */}
      {archivePosts.length > 0 && (
        <section aria-label="Complete Bills and Personal Finance Archive" className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white tracking-tight">
              {isFiltering
                ? `Matching Guides (${archivePosts.length})`
                : 'Complete Consumer Defense & Finance Library'}
            </h2>
            <span className="text-xs text-slate-400">
              Organized by topic cluster &amp; federal statute
            </span>
          </div>

          <div className="divide-y divide-slate-800/80 border-b border-slate-800/80">
            {archivePosts.map((post, idx) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}/`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectPost(post.slug);
                }}
                className="group py-6 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-slate-900/40 px-3 -mx-3 rounded-xl transition-colors"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono text-slate-500 tabular-nums">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span className="font-semibold text-emerald-400">{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>Updated {formatBlogDate(post.updatedAt)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readTimeMinutes} min read</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {post.metaDescription}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 whitespace-nowrap shrink-0">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
