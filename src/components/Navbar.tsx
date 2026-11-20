import React, { useState } from 'react';
import {
  Receipt,
  FileCheck2,
  Scale,
  Share2,
  Menu,
  X,
  Zap,
  Check,
  Calculator,
  BookOpen,
  BarChart3,
} from 'lucide-react';

interface NavbarProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  matchPrefix: string[];
  icon: React.ComponentType<{ className?: string }>;
}

export const Navbar: React.FC<NavbarProps> = ({ activePath, onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleShare = () => {
    const cleanUrl = `https://www.itsmybill.com${activePath}`;
    navigator.clipboard.writeText(cleanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems: NavItem[] = [
    {
      id: 'auditor',
      label: 'Fee Auditor',
      href: '/bill-auditor/',
      matchPrefix: ['/bill-auditor'],
      icon: FileCheck2,
    },
    {
      id: 'disputes',
      label: 'Disputes',
      href: '/dispute-letter-generator/',
      matchPrefix: ['/dispute-letter'],
      icon: Scale,
    },
    {
      id: 'benchmarks',
      label: 'State Rates',
      href: '/utility-benchmarks/',
      matchPrefix: ['/utility-benchmarks'],
      icon: Zap,
    },
    {
      id: 'splitters',
      label: 'Splitters',
      href: '/income-based-bill-splitter/',
      matchPrefix: ['/bill-splitter', '/income-based-bill-splitter', '/itemized-receipt-splitter'],
      icon: Calculator,
    },
    {
      id: 'guides',
      label: 'Guides',
      href: '/guides/',
      matchPrefix: ['/guides', '/blog'],
      icon: BookOpen,
    },
    {
      id: 'report',
      label: '2026 Report',
      href: '/reports/2026-us-utility-and-junk-fee-report/',
      matchPrefix: ['/reports'],
      icon: BarChart3,
    },
  ];

  const isNavItemActive = (item: NavItem) =>
    item.matchPrefix.some((prefix) => activePath.startsWith(prefix));

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Logo -> Flagship Consumer Bill Defense Hub (/) */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            aria-label="ItsMyBill Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Receipt className="w-4 h-4 text-slate-950 font-bold" />
            </div>
            <span className="text-lg font-black tracking-tight text-white whitespace-nowrap shrink-0">
              itsmy<span className="text-emerald-400">bill</span>.com
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isNavItemActive(item);
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.href);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Copy canonical page URL"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share page link"
              className="p-2 text-slate-400 hover:text-white cursor-pointer"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isNavItemActive(item);
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.href);
                  setMobileMenuOpen(false);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};
