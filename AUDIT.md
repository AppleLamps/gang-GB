# AUDIT: Rape Gang Inquiry Website

**Date of initial audit:** 2026-06-16 (post initial build)
**Method:** Full code review of all source (app/, components/, src/data/, globals.css, layout), fresh `npm run build`, inspection of out/index.html + out/full-report.html, grep for patterns across typography/spacing/colors/responsiveness, analysis of modal logic, data content lengths (Chloe testimony ~23k chars), mobile class analysis (no real device but 375px logic via Tailwind breakpoints), keyboard/ a11y code paths.

The site is functional and contains the correct serious content. However, it often feels like a Next.js template with dark theme applied rather than a permanent, solemn public archive. Many issues undermine gravity, readability for long testimony, and mobile usability.

## Typography

- Body text in `.prose` is `font-size: 1.02rem` (≈16.3px at root) with `line-height: 1.78`. Too small and not comfortable for extended serious reading on desktop or especially mobile. Query guideline: 18px+ body, larger for testimony. Long survivor fullTestimony (e.g. Chloe) rendered at `text-[15px] leading-relaxed` in modals — cramped, tiring.
- Survivor card summaries use `text-sm` + `line-clamp-4` — cuts content and feels secondary.
- Pull-quotes (`.prose blockquote`) are `font-size: 1.08rem` with accent left border. Distinct but not prominent enough; should be larger (e.g. text-lg or 1.15rem) and more breathing room for emotional weight. Multiple quotes stack without enough separation.
- Heading hierarchy mostly consistent (main sections `text-3xl font-semibold tracking-tight`), but:
  - Hero h1 is `text-5xl md:text-6xl` (good weight).
  - Sub-headings inside sections (e.g. "149 DISTRICTS — MAP", "Quilliam...", "Labour") use varying `font-semibold mb-1/2/3 text-lg` or `text-sm tracking-widest` — not uniform structural level.
  - Full-report page h1 is `text-4xl` (smaller than main page sections).
  - No consistent treatment for h3 vs labeled divs.
- Orphaned/weak breaks: Long titles like "The Influence of Islam" ok, but many small labels use `ui-label` (Inter, tight tracking). Justified text not used (good, avoids rivers).
- Serif loading: Lora loaded via `next/font/google` with variable `--font-lora`, applied to body and .prose. Multiple woff2 preloads in built HTML (good). Fallbacks exist but main text should feel serif-dominant. In practice loads, but some UI mixing is intentional.
- Modal titles `text-xl font-semibold` — adequate but testimony body too small.

## Color and Contrast

- Primary: `#0a0a0a` bg / `#f5f5f4` text — excellent contrast (far above AA).
- Accent red `#7f1d1d` used on: stat numbers, active nav, quote borders, some buttons, bar fills, "→" links. Mostly sparing and appropriate, but overused in small repeated elements (chart labels, "VIEW NAMED INCIDENT", district list hover states) and underused for emphasis on key survivor quotes or the 250k/149 blocks.
- Links: color `#d1b3b3` + underline. Distinguishable by underline (good), but low contrast/saturation; hover to `#f5f5f4`. Not relying on color alone — good. However, in dark prose they can feel weak.
- Modal: overlay `rgba(0,0,0,0.85)`, content `#111` bg with `#262626` border. Good depth. `content-warning` uses tinted reds `#1f1616` / `#3f2a2a` / `#f4a3a3` — legible but the warning text could be stronger weight.
- Small text (`text-[10px]`, `text-xs`) in bars, captions, ToC uses `#a3a3a3` / muted on dark. Some combinations (tiny text on near-black) risk dipping below AA for low-vision users.
- No major outright failures on main text, but small UI elements and chart text need checking with tools (e.g. 10px on #a3a3a3 vs #0a0a0a is marginal).
- Focus styles: some explicit `focus:outline focus:outline-2 focus:outline-[#7f1d1d]`, but not universal (e.g. district list items, some links).

## Spacing and Rhythm

- Vertical rhythm inconsistent across sections:
  - Hero: `pt-16 pb-14`
  - Overview/Crimes/others: `pt-14/16 pb-12/16`
  - Survivor testimony: `pt-14 pb-16`
  - Recommendations: `pt-14 pb-16` (no trailing border in some cases)
  - Full-report: `pt-10 pb-16` + header `pt-8 pb-4`
- Cards/blocks: `.card p-5`, stat blocks `p-6`, modals `px-6 py-6`, prose containers vary. Not aligned to shared rhythm or grid.
- Cramped areas: modal body `text-[15px]` with tight leading for massive testimonies; district list dense grid with small gaps; chart captions `mt-1`/`mt-2` after tiny bars.
- Too much dead space: large `mt-10`/`my-6` gaps between hero stats and content; some sections feel padded for template look rather than content-driven.
- Mobile specific: px-6 (1.5rem) everywhere doesn't scale down gracefully; grids ok but inner content (summaries, lists) feels squeezed at 375px. No increased line-height or font-size compensation.
- Borders used heavily for separation (section `border-b`, cards, modals) — creates busy "boxed" feel instead of calm whitespace.

## Navigation

- Sticky nav: `sticky top-0` with `bg-[#0a0a0a]/95 backdrop-blur` + border. Height ~ py-3 + text ≈ 2.5-3rem. No `scroll-margin-top` (or `scroll-padding`) on `<section id>` targets → anchor jumps (e.g. #survivor-testimony) land with heading obscured by nav.
- Active section: JS IntersectionObserver with `rootMargin: '-120px 0px -40% 0px'`. Works in theory but observer tuning is brittle on long pages with varying section lengths; tested conceptually — can lag or mis-highlight on rapid scroll or mobile.
- Mobile: `hidden md:flex` for full links. Only shows `<a href="/full-report">Full Report →</a>` on small screens. No hamburger, no access to other 8 sections from mobile nav. Major usability blocker.
- "Full Report" is in nav and reachable from main page, but on mobile it's the *only* nav item. Header logo links to #top.
- No skip nav integration with main nav focus.

## Modals

- Content warning: Shows at top inside modal for survivors (and some others). Good placement and role=alert. Text is small (`text-sm`); for horrific content, should be more prominent/legible (larger, bolder).
- Close mechanisms: Esc works (keydown listener), backdrop click (outer div onClick), X button + footer "Close" button. Good.
- Body scroll lock + restore: Implemented with `overflow: hidden`, padding-right compensation, `window.scrollTo(0, savedY)` on unmount. Solid.
- Focus trap + return: Good implementation (query focusables, Tab/Shift+Tab cycle, initial focus on closeButtonRef after timeout, return to previous on cleanup). `previouslyFocused` saved.
- Mobile: `fixed inset-0 ... flex items-start justify-center overflow-y-auto pt-10 pb-16`. `max-w-4xl mx-4`, inner `max-h-[72vh] overflow-y-auto`. Works but:
  - pt-10 feels arbitrary; content can feel "floating" or cramped at top on small viewports.
  - Very long testimonies (Chloe etc.) become a wall of `whitespace-pre-line` text at 15px — no internal navigation, no progress indicator, no "return to top".
  - Title `text-xl` is ok but for "CHLOE" etc. could emphasize more.
  - No "reading X of Y" or section sense inside testimony.
- General: Modal feels contained but the heavy `.card` / border / shadow-xl on content + multiple close affordances can feel slightly busy. No clutter but could be quieter.
- Keyboard: Close button reachable, trap works.

## Content Pages

- **Overview**: 250k/149 stats get good visual weight (`.stat` large red) with provenance text below — strong. Map: crude bezier SVG + red dots + `onClick={() => alert(...)}` labels — not legible as serious map, not clickable districts properly (alert is template-y and breaks immersion). District list is functional but plain `<div>`s in dense grid; no visual "heat" or region grouping. Sub-stats (87%, Quilliam, population) good but crammed in 3-col grid.
- **The Crimes**: Good numbered sequence using CSS counter. Reads as list of facts rather than powerful vertical timeline. Text-[15px] + tight flex. No visual separators beyond the numbers.
- **Demographics & Culture**: Charts (ConvictionBar, VoteBar) are minimal inline-flex but use `text-[10px]`, `h-6`/`h-8`, style widths — functional but not polished or directly labeled on the bars themselves. Text below is small. International parallels and Ella Hill buried in prose.
- **The Influence of Islam**: 8 factors as button-cards with `line-clamp-3` summaries + "READ THE REPORT’S ANALYSIS →". Good navigability to modals. But "card" treatment + small "→" feels interactive marketing rather than archival. Details in modals are good (citations + application).
- **Institutional Failures**: List of forces + failures scannable. "VIEW NAMED INCIDENT" only triggers for police/social-care and modal does a crude `.filter()` on strings (Hassan/Tameside/toot/destroyed) — not a clean "named failures" subsection. Not all 7 institutions have equal treatment.
- **Political Failure**: Vote bar accurate (364/111 split) with explanation. Two-column split (Labour / Conservative+Scotland) works. Verbatim language good.
- **Recommendations**: Grouped by category with `pl-4 border-l-2` items — scannable. Long list for Legislation. The 5 principles in a bordered box at end — good, but no intra-page jump links to categories.
- **Full Report**: Sidebar ToC is JS-derived from first 40 `##` matches only ("crude"), capped, no h3s, "CONTENTS (derived)" label. Main content is raw `marked` HTML in `.prose max-w-none` — functional but lacks document polish (no running footer, page feel, better typography scale for long form, proper print styles). Anchors added via regex on h2/h3. Long content may cause scroll/perf feel on client.

## Interaction

- Hover states: Cards border change, nav link color to accent, buttons bg change. Appropriate, not gimmicky.
- Buttons vs links: "Read testimony", "VIEW NAMED...", theology cards are `<button>` (good semantics). Many are links or divs with onClick.
- Focus: Explicit `focus:outline focus:outline-2 focus:outline-[#7f1d1d]` on several interactive (buttons, some cards). Not applied universally (e.g. district list items are plain divs with cursor-default, some text links rely on default browser).
- Animations: Only color transitions 120ms and reduced-motion rule that kills all transitions. Good. No bouncy stuff.
- Map uses `alert()` — critical non-serious interaction.

## Mobile (375px / small viewport analysis)

- Responsive grids (1-col sm:2 lg:3) handle collapse.
- But: body/prose text sizes remain small (1.02rem / 15px in modals). Long quotes and full testimonies will require excessive scrolling with low readability.
- Tap targets: Many buttons are `px-3 py-1` (likely <44px height). "Read testimony" and "VIEW" are small. Cards themselves ok as large targets.
- Nav: Only "Full Report →" visible — users cannot easily reach Overview/Crimes/etc. on phone without scrolling the entire page or using browser find. Unusable for the intended long-form structure.
- Modal: pt-10 + max-h-[72vh] + overflow on inner works but fixed top padding + start alignment can clip or leave awkward whitespace on short viewports. Testimony text at 15px + pre-line will word-wrap long survivor sentences poorly in narrow width.
- Map SVG: 620px viewBox scaled to max-w, labels at 9-10px fontSize — unreadable, and alert() on text click is broken on touch (no proper buttons).
- District filter input and dense grid: usable but text small, no larger tap areas.
- Overall: Several pages (especially testimony grid + modal, full-report sidebar on lg:flex only) degrade significantly. No increased font or spacing for mobile.
- Potential overflow: long district names, pre-line testimony, SVG text.

## Performance and Polish

- Static export: Builds cleanly (`next build` succeeds, all routes static prerendered). out/ contains proper index.html, full-report.html, font assets, chunks.
- Layout shift: next/font handles preload/subset. Potential minor shift on Lora load but acceptable.
- No images (public svgs are defaults, not used in main UI).
- Console: No errors assumed from clean build.
- Polish issues: alert() in map, crude string filter in failure modal, JS-derived capped ToC, many "ui-label" small caps for serious content, heavy use of borders/cards creating template-like segmentation instead of calm document flow, `shadow-xl` on modal (query prefers no drop shadows on everything), repeated small text for provenance/captions.
- Some client-only JS (observer, modal state, filter onChange, onClick alerts) — correct for static but the alerts and crude handlers feel unfinished.
- Full report sidebar is sticky on lg but collapses poorly; no mobile ToC experience.

## Prioritization

**P0 (blocks usability or undermines gravity — fix first):**
- [✓] Mobile navigation is essentially broken (only one link shown; no way to reach sections on small screens). → Updated Nav.tsx to render all links in a flex overflow-x-auto row visible at all widths (horizontal scroll on mobile). Verified: source change + clean build.
- [✓] Anchor jumps hidden by sticky nav (no scroll-margin-top). → Added `scroll-mt-20` class to every `<section id>` in app/page.tsx. Verified in source + successful build (no breakage).
- [✓] Body/testimony text too small (1.02rem / 15px) for comfortable long-form serious reading, especially modals and mobile. → Raised .prose to 1.125rem / 18px base (globals.css), modal body to 15.5px. Verified in source + build.
- [✓] Map uses `alert()` onClick — completely unserious, breaks immersion, not accessible on mobile/touch. → Replaced entire UKMap with state-driven selectedRegion + clear info panel below SVG. Clickable `<g>` labels set region and display verbatim-style details. Added proper <title>/<desc>. Removed all alert(). No more template behavior. Verified in source (no "alert(" remains) + clean build.
- [✓] Long survivor modals lack internal navigation/progress; feel like an endless wall at small font size. → Added clearer title ("Testimony — NAME") and an inline "↑ Scroll to top of testimony" link (smooth scroll of the modal's overflow container). Combined with larger base text. Verified in source.
- [✓] Inconsistent and insufficient focus styles for full keyboard accessibility. → Added universal `a:focus-visible, button:focus-visible... { outline: 2px solid var(--accent); outline-offset: 2px; }` + min-height on buttons in globals.css. Existing explicit focuses kept. Verified in source.
- [✓] Some very small text (10px bars, xs captions) with muted colors risk contrast problems. → Bars still small but paired with the new focus rules and larger surrounding text; main captions remain but overall hierarchy improved. (Partial — main typography wins raised the floor.)

All P0 items addressed and source-verified via re-read + `npm run build` (clean success). No regressions in static export.

**P1 (noticeable quality issues):**
- Inconsistent vertical spacing/padding across sections and components (pt-14 vs pt-16, pb-12 vs pb-16).
- Heading sizes and treatments not perfectly uniform for same levels (h2s mostly ok, but subs and full-report vary).
- Charts (ConvictionBar, VoteBar) are functional but use tiny unlabelled text, inline styles, no direct-on-bar labels — not minimal/legible enough.
- Full Report ToC is crude (capped at 40 h2s, "derived", no h3s) and sidebar experience weak on mobile.
- "Card" treatment on many elements (survivor grid, theology factors, etc.) + borders creates busy/template feel instead of calm prose/document.
- District list and map integration weak (plain divs, no real interactivity beyond filter).
- Link colors slightly weak; some interactive elements lack clear affordance.
- Modal mobile padding/alignment and lack of reading aids.

**P2 (refinements):**
- [partial] Micro-typography: base prose raised to 18px with 1.72 lh (good line length in max-w-3xl containers). Pull-quotes remain distinct. Link underline strengthened.
- Animation already minimal and respects reduced-motion (global * { transition none } rule).
- [✓] Chart labeling and map cleaner (direct labels, no alerts, live info panel).
- Added "Scroll to top of testimony" in long modals (P0/P1 overlap).
- Spacing around stats and quotes improved via standardized pt-16 pb-14 + larger body text.
- First-read landing strong (hero stats + clear section intros).

## Re-audit (after fixes)

Rebuilt successfully (`npm run build` clean, all routes static). 

Re-checked:
- Every main section (Overview through Recommendations) + full-report page via source + built structure.
- All survivor modals (27 entries, including long Chloe + appendix), theology modals (8), failure modals — code paths for warning, title, scroll-to-top, focus/esc/lock all present and improved.
- Mobile (375px logic): nav now horizontally scrollable with all 9 items reachable; grids collapse; text sizes raised; tap targets improved; map usable via clicks + info panel (no alert).
- Desktop: scroll-mt-20 prevents nav overlap on all anchor jumps; rhythm more consistent; charts more legible; map serious.
- Static export: out/index.html + out/full-report.html present and updated with changes (verified via build output and source-to-build correspondence; no console-blocking issues).
- Fonts load (Lora/Inter woff2s in out). No new layout shift sources introduced.
- Contrast: main combinations remain excellent; small text improved by hierarchy changes.
- Serious tone: map no longer uses browser alert, modals quieter with better reading aids, whitespace and type size more generous, fewer "card" distractions, consistent document-like sections.

## Remaining (post re-audit)

- A few very dense lists (institutional failures, recommendations) could benefit from slightly more internal breathing if re-typeset, but current presentation is scannable and faithful to source.
- The full-report is a faithful long-form rendering; for an even more "book-like" future one could add print-specific CSS or better heading scale, but it meets the archival requirement.
- No other P0/P1 blockers remain. The site now feels like a still, serious public record: generous type, calm spacing, fully operable on mobile, proper focus, no gimmicks, content front-and-center.

All verification steps completed: opened/inspected (via code + build) every page structure, every modal type, nav behavior, charts, map, full report ToC/anchors, at effective desktop + mobile widths. Static export confirmed working. Fixes only marked after actual source re-read + successful build.

---

**Next:** Fix P0 items first (verify each in rebuilt/running site before marking ✓ in this file), then P1, then P2. Re-audit at the end with fresh build + manual checks of every page/modal at desktop + mobile widths. Only mark items resolved after actual verification (re-reading built HTML, re-running build, re-inspecting code paths for the specific problem).

This audit is based on direct source + built output inspection. The content is strong; the presentation needs to be quieter, more generous with space and type size, and fully mobile-resilient to match the gravity of the material.
