# The Rape Gang Inquiry — Static Site

A restrained, somber static website presenting the full Rape Gang Inquiry report.

- Next.js App Router, TypeScript, Tailwind
- `output: "export"` → fully static (`/out`)
- No server, no API routes, no dynamic features
- Deploy target: Vercel (static)

## Build

```bash
npm install
npm run build
```

The static export is produced in `./out`.

## Deploy

Push to a Git repository and import on Vercel. The framework detection will handle the static export automatically.

Or serve the `out/` directory with any static host.

## Source

The canonical report text lives at `report/The+Rape+Gang+Inquiry+Report.md` (and mirrored as `report.md` / `content/report.md` for the site and parser). All survivor testimony, statistics, theological analysis, institutional failures, political record, and recommendations are drawn directly from it and presented without editorial softening or omission.

## What this site is

An archival, evidentiary presentation of the report. Dark, serif-led, minimal chrome. Full survivor testimony behind content warnings. Verbatim quotes. The 149-district map (SVG + list). The eight theological factors. Named institutional failures. The 364–111 vote. The complete recommendations including the proposed Childhood Sexual Exploitation Act and Sammy’s Law.

No comments. No donations. No social buttons on testimony. No imagery of children or survivors.

## Verification

`npm run build` must complete cleanly and produce a working static export. All quoted material, statistics, and named cases match the source report.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
