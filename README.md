# Quick PD · Wewoka High School

Teacher-facing professional development site: strategy library with videos,
Oklahoma Academic Standards, weekly/unit/daily planners and PL-goal writer with
Word export, K–5 and 6–12 Foundations hubs, learner supports, student-voice tools,
and a My Work page for downloads and backups.

The site is fully static (`public/`). No build step.

## How it deploys
Cloudflare Pages watches this repo. Every push to `main` publishes `public/`
automatically within about a minute. Nothing else to run.

`wrangler.toml` is kept for the optional Workers route (`npm run deploy`).

## Layout
- `public/index.html`, `app.js`, `styles.css` — app shell and router
- `public/api-shim.js` — serves content from `data/` and keeps teacher saves in the browser
- `public/planner-core.js`, `planner-pages.js` — planners, standards picker, .docx builder
- `public/elementary.js` — K–5 Reading / Math / Writing pages
- `public/content-hubs.js` — K–5 Science / Social Studies, secondary Reading / Math / Writing, student voice, and learner supports
- `public/my-work.js` — downloads, portfolio, backup/restore
- `public/data/*.json` — strategies, techniques, rigor, seating, and OAS data (including 2026 Physical Education)
- `public/vendor/docx.umd.min.js` — Word library, bundled so no CDN is needed
