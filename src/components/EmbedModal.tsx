import React, { useState } from 'react';
import { Code2, Copy, Check, X } from 'lucide-react';

interface EmbedModalProps {
  title: string;
  embedPath: string;
  sourcePath: string;
  sourceLabel: string;
  defaultHeight?: number;
}

export const EmbedCalculatorButton: React.FC<EmbedModalProps> = ({
  title,
  embedPath,
  sourcePath,
  sourceLabel,
  defaultHeight = 640,
}) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const normalizedEmbed = embedPath.endsWith('/') ? embedPath : `${embedPath}/`;
  const normalizedSource = sourcePath.endsWith('/') ? sourcePath : `${sourcePath}/`;

  const snippet = `<iframe src="https://www.itsmybill.com${normalizedEmbed}" title="${title}" width="100%" height="${defaultHeight}" style="border:1px solid #1e293b;border-radius:12px;background:#020617;" loading="lazy"></iframe>
<p style="font-family:system-ui,sans-serif;font-size:12px;color:#64748b;margin-top:6px;">
  Interactive calculator powered by <a href="https://www.itsmybill.com${normalizedSource}" target="_blank" rel="noopener">${sourceLabel} on ItsMyBill.com</a>
</p>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
      >
        <Code2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Embed This Calculator</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Code2 className="w-5 h-5 text-emerald-400" />
                <span>Embed: {title}</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close embed modal"
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Add this free, privacy-first, client-side calculator to your personal finance blog, newsroom article, or tenant resource page. Zero user data is sent to our servers, and the embed loads cleanly without site chrome.
            </p>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {snippet}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Includes clean attribution link back to ItsMyBill.com
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Embed Code Copied' : 'Copy HTML Embed Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
