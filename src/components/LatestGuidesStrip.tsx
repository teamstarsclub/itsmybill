import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BLOG_POSTS, formatBlogDate } from '../data/blogData';

interface LatestGuidesStripProps {
  onSelectPost: (slug: string | null) => void;
}

export const LatestGuidesStrip: React.FC<LatestGuidesStripProps> = ({ onSelectPost }) => {
  const topGuides = BLOG_POSTS.slice(0, 3);

  return (
    <section
      aria-labelledby="featured-guides-heading"
      className="pt-8 border-t border-slate-800/80 space-y-5 no-print"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-emerald-400">
            ItsMyBill Editorial Research
          </div>
          <h2
            id="featured-guides-heading"
            className="text-xl sm:text-2xl font-bold text-white tracking-tight"
          >
            Bills &amp; Personal Finance Playbooks
          </h2>
        </div>
        <a
          href="/blog/"
          onClick={(e) => {
            e.preventDefault();
            onSelectPost(null);
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0"
        >
          <span>Browse All {BLOG_POSTS.length} Guides</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {topGuides.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}/`}
            onClick={(e) => {
              e.preventDefault();
              onSelectPost(post.slug);
            }}
            className="group rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700 p-5 flex flex-col justify-between gap-4 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-emerald-400">{post.category}</span>
                <span aria-hidden="true">·</span>
                <span>{formatBlogDate(post.updatedAt)}</span>
                <span aria-hidden="true">·</span>
                <span>{post.readTimeMinutes} min</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {post.metaDescription}
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <span>Read playbook</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
