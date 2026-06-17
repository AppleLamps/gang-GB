import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import Link from 'next/link';

export const metadata = {
  title: 'Full Report — The Rape Gang Inquiry',
  description: 'The complete text of the Rape Gang Inquiry report as the canonical record.',
};

export default function FullReportPage() {
  const reportPath = path.join(process.cwd(), 'content', 'report.md');
  const md = fs.readFileSync(reportPath, 'utf8');

  const html = marked.parse(md, { gfm: true, breaks: false }) as string;

  const htmlWithIds = html.replace(/<(h2|h3)([^>]*)>(.*?)<\/\1>/gi, (_m, tag, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
  });

  const tocMatches = [...md.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());
  const toc = tocMatches;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-40 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border-subtle)]">
        <div className="max-w-[var(--page-max)] mx-auto px-5 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="ui-label text-sm text-[var(--text-muted)] hover:text-[var(--text)] no-underline flex items-center gap-1.5 transition-colors"
          >
            ← Back to main site
          </Link>
          <span className="text-xs ui-label text-[var(--text-faint)] hidden sm:inline">The Rape Gang Inquiry — Full Report</span>
        </div>
      </header>

      <div className="max-w-[var(--page-max)] mx-auto px-5 sm:px-6 py-10 sm:py-14 flex flex-col lg:flex-row gap-10 lg:gap-14">
        {/* Sidebar ToC */}
        <aside className="lg:w-56 xl:w-64 shrink-0">
          <div className="lg:sticky lg:top-20">
            <p className="section-eyebrow mb-4">Contents</p>
            <nav className="text-sm space-y-0.5 max-h-[60vh] lg:max-h-[75vh] overflow-y-auto pr-2 border-l border-[var(--border-subtle)] pl-3">
              {toc.map((h, i) => {
                const id = h.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
                return (
                  <a
                    key={i}
                    href={`#${id}`}
                    className="block py-1.5 text-[var(--text-muted)] hover:text-[var(--text)] no-underline transition-colors leading-snug"
                  >
                    {h}
                  </a>
                );
              })}
            </nav>
            <p className="mt-4 text-xs text-[var(--text-faint)] leading-relaxed hidden lg:block">
              All headings in the body are anchor-linked.
            </p>
          </div>
        </aside>

        {/* Report body */}
        <article className="flex-1 min-w-0 max-w-[var(--content-max)]">
          <p className="section-eyebrow mb-3">Canonical Record</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-10 leading-tight">The Rape Gang Inquiry Report</h1>
          <div
            className="prose prose-report"
            dangerouslySetInnerHTML={{ __html: htmlWithIds }}
          />
          <div className="mt-14 pt-8 border-t border-[var(--border-subtle)] text-sm text-[var(--text-faint)] leading-relaxed">
            End of the canonical report text. This page is a static rendering of the source markdown for archival fidelity.
          </div>
        </article>
      </div>
    </div>
  );
}