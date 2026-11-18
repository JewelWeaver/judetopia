# Judetopia handoff

Where the redesign stands, what's left, and how to pick it up.

## Status

All work is on branch `claude/review-judetopia-code-pEESo`. **`main` is untouched**; judetopia.com most likely deploys from `main`, so nothing is live until that branch is merged (open a PR when ready).

Private clickable preview (owner-only until shared): https://claude.ai/artifact/GfHTyrueL4XcmnULSPMu3S. It is a copy of the site, not the repo; it does not include the button-eye game yet.

## The site

Plain static HTML in `public/`, one shared stylesheet. No build step. Hosted on Cloudflare Workers static assets (`cloudflare.config.ts` + `wrangler.config.ts`); deploy with `npx cf deploy`.

| Page | What it is |
|---|---|
| `index.html` | Quiet homepage: one eye in the dark, "are you there?", three nav links. The Emergence figure is hidden around the eye and shows where a light follows the pointer (drifts on its own when idle). |
| `zines.html` | "Joodlebug Ink" in the nav. Alien Mode vol. 1 (7 pages, no back cover) and Emergence vol. 1 (8 pages) as page-flip readers, with jump links at the top. |
| `artifacts.html` | "Artifacts" in the nav: Third Eye Charms. Logo, copy, the market photo, a Shop on Etsy link and six product cards. |
| `tuba.html` | Tuba's Corner: silly hell (flames, embers, pitchfork wallpaper, flaming halo, dangling eyeball) + Job 38:4 thought bubble. |
| `bug.html` | Featured Bug (page heading still says "Bug of the Week"). Dogbane Beetle + archive scraps, incl. the Jade Faced Buffalo Beetle from Alien Mode. |
| `art.html` | Redirect to `zines.html` so old links work. |

- `public/assets/site.css`: palette (sampled from the zine paper colors), fonts (Courier Prime, Luckiest Guy, Josefin Sans), nav links, paper/sticker styles, footer, button-eye game styles.
- `public/assets/buttons.js`: the button-eye side quest (below).
- `public/assets/img/bugs/`: bug photos from insectimages.org (Bugwood), CC BY-NC 3.0 US. Each needs its credit line ("Photographer, Organization, Bugwood.org") shown next to it, and the site can't use them commercially. The credits are in `bug.html`.
- `public/assets/img/`: doodles, `tuba-photo.webp`, `tuba.svg` and `beetle.svg` (old drawings, no longer used), `brand-mark.png` (the hand-lettered "Joodlebug ink." logo), and `zines/<zine>/p1–p8.webp`.
- `src/` is an older, unused Eleventy/Alpine work-in-progress (no eleventy config, does not build). Not part of the live site.

## Open items

### Button-eye game (done)
The 42 photos from the Drive folder "Eyes" are in `public/assets/img/buttons/eye-01…42.webp` (trimmed, 160px, transparent). Eye 22 had a fake checkerboard background baked in and was cut out with an ellipse mask. Only the first 23 are in play (`COUNT = 23` in `public/assets/buttons.js`); eye-24…42 are spare art for swapping in. `cursor.png` (32px, from eye 07) is the prize cursor shown after collecting them all; the drawn SVG stays as a fallback. To add or swap a button, replace or add a webp and update `COUNT` in `public/assets/buttons.js` (there are 49 spots, so up to 49 buttons fit without adding spots).

How the game works:
- `SPOTS` lists where buttons sit on each page as `[selector, nth, x, y]`, with x and y as fractions of that element's box. Spots are dealt round-robin across pages, and button *i* gets the *i*-th spot.
- If page markup changes, check that those selectors still match.
- Progress is saved per visitor in `localStorage` (`judetopia.buttonEyes.v1`).
- A pentatonic "pop" plays per find and a fanfare plays at the end. Collecting everything turns the cursor into a button eye.
- The tin in the bottom-right corner shows the count, progress per page, a sound toggle, and a two-tap "start over".

### Tuba photo (done)
`public/assets/img/tuba-photo.webp` (900px, transparent) replaces the drawn `tuba.svg` in `tuba.html`. The halo sits over her ears and the eyeball hangs just past her raised paw. The photo sits low so the flames cover where it's cropped at the bottom. If the photo is swapped, retune `.halo` and `.lure`.

### Small questions for the owner for the owner
- Rename the page headings to match the nav: "Zines" → "Joodlebug Ink", "Bug of the Week" → "Featured Bug"?
- Merge to `main` / go live?

## Zine page sources (in case pages need re-cutting)
Both zines come from the owner's per-page PDFs in `~/Joodlebug Ink/zines/Zine_individual_pages/`:
- **Alien Mode**: `AlienMode_issue01_individual_pages/AlienMode_issue01_0N_*.pdf`. All 8 pages are the same size (1240×1500 at 300 dpi), saved as 640×774 webp.
- **Emergence**: `Emergence_vol1_individual_pages/Emergence_vol1_0N_*.pdf`. They're A6 (1240×1754 at 300 dpi), saved as 640×911 webp. These PDFs carry trim lines and thin slivers of neighbouring pages (up to ~22px on pages 2–5), so each page is cropped to 1214×1728 with its own offset (x,y): p1 6,13 · p2 23,24 · p3 4,20 · p4 4,19 · p5 5,19 · p6–8 13,13.
- Render with `gs -q -dSAFER -dBATCH -dNOPAUSE -sDEVICE=png16m -r300 -dTextAlphaBits=4 -dGraphicsAlphaBits=4 -sOutputFile=out.png in.pdf`, then `convert out.png [-shave 4x4 +repage] -resize 640x -strip -quality 76 pN.webp`.
- Every zine page `<img>` in `zines.html` has full alt text (the poem text for Emergence). Update it if a page changes.

## Checking changes
- Serve locally with `npx serve public -p 3000` (or `npx cf dev`).
- Screenshot at 1366×900 and 390×844 with Playwright. Chromium is preinstalled; launch with `chromium.launch()`.
- Things that have broken before:
  - horizontal overflow on phones (`main` uses `overflow-x: clip`);
  - forgetting `height: auto` on sized images;
  - `cqi` units inside a container's own padding.
- To refresh the preview, copy the site into a scratch folder, duplicate `index.html` as `home.html`, and point `href="index.html"` (and `'index.html'` in `public/assets/buttons.js`) at `home.html`. Republish to the same artifact URL.
