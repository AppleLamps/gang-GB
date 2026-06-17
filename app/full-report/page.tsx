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

  // Basic marked parse. For anchorable headings we do a light enhancement.
  const html = marked.parse(md, { gfm: true, breaks: false }) as string;

  // Very light post-process to give ids to top-level headings for ToC jumps (h2/h3)
  const htmlWithIds = html.replace(/<(h2|h3)([^>]*)>(.*?)<\/\1>/gi, (_m, tag, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
  });

  // ToC from h2s (more complete; long report is expected). Mobile sidebar collapses gracefully.
  const tocMatches = [...md.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());
  const toc = tocMatches; // full set — reader can scroll the aside

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f4]">
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between border-b border-[#262626]">
        <Link href="/" className="ui-label text-sm hover:text-[#f5f5f4]">← Back to the site</Link>
        <div className="text-sm ui-label text-[#a3a3a3]">Canonical full text — Rape Gang Inquiry Report</div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-10 pb-16 flex flex-col lg:flex-row gap-10">
        {/* Sidebar ToC */}
        <aside className="lg:w-64 shrink-0 lg:sticky lg:top-8 self-start">
          <div className="text-xs ui-label tracking-widest mb-3 text-[#a3a3a3]">CONTENTS (derived)</div>
          <nav className="text-sm space-y-1 max-h-[70vh] overflow-auto pr-3 border-l border-[#262626] pl-3">
            {toc.map((h, i) => {
              const id = h.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
              return (
                <a key={i} href={`#${id}`} className="block py-0.5 text-[#c9c9c9] hover:text-[#f5f5f4]">{h}</a>
              );
            })}
            <div className="pt-3 text-[10px] text-[#666]">The complete report follows. All headings in the body are anchor-linked.</div>
          </nav>
        </aside>

        {/* Report body */}
        <article className="flex-1 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight mb-8">The Rape Gang Inquiry Report</h1>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlWithIds }}
          />
          <div className="mt-12 pt-8 border-t border-[#262626] text-xs text-[#a3a3a3]">
            End of the canonical report text. This page is a static rendering of the source markdown for archival fidelity.
          </div>
        </article>
      </div>
    </div>
  );
}
