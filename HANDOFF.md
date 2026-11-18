# Judetopia handoff

Where the redesign stands, what's left, and how to pick it up.

## Status

All work is on branch `claude/review-judetopia-code-pEESo`. **`main` is untouched**; judetopia.com most likely deploys from `main`, so nothing is live until that branch is merged (open a PR when ready).

Private clickable preview (owner-only until shared): https://claude.ai/artifact/GfHTyrueL4XcmnULSPMu3S. It is a copy of the site, not the repo; it does not include the button-eye game yet.

## The site

Plain static HTML in the repo root, one shared stylesheet. No build step.

| Page | What it is |
|---|---|
| `index.html` | Quiet homepage: one eye in the dark, "are you there?", three nav links. The Emergence figure is hidden around the eye and shows where a light follows the pointer (drifts on its own when idle). |
| `zines.html` | "Joodlebug Ink" in the nav. Alien Mode vol. 1 and Emergence vol. 1 as page-flip readers (spreads on wide screens, single pages on phones, arrows/keys/swipe), each with a one-line blurb. Third Eye Charms below as hang tags. |
| `tuba.html` | Tuba's Corner: silly hell (flames, embers, pitchfork wallpaper, eye-sun, flaming halo, dangling eyeball) + Job 38:4 thought bubble. |
| `bug.html` | Featured Bug (page heading still says "Bug of the Week"). Dogbane Beetle + archive scraps, incl. the Jade Faced Buffalo Beetle from Alien Mode. |
| `art.html` | Redirect to `zines.html` so old links work. |

- `assets/site.css`: palette (sampled from the zine paper colors), fonts (Courier Prime, Luckiest Guy, Josefin Sans), nav links, paper/sticker styles, footer, button-eye game styles.
- `assets/buttons.js`: the button-eye side quest (below).
- `assets/img/`: doodles, `tuba.svg`, `beetle.svg`, `brand-mark.png` (the hand-lettered "Joodlebug ink." logo), and `zines/<zine>/p1–p8.webp`.
- `src/` is an older, unused Eleventy/Alpine work-in-progress (no eleventy config, does not build). Not part of the live site.

## Open items

### Button-eye game (done)
The 42 photos from the Drive folder "Eyes" are in `assets/img/buttons/eye-01…42.webp` (trimmed, 160px, transparent). Eye 22 had a fake checkerboard background baked in and was cut out with an ellipse mask. `cursor.png` (32px, from eye 07) is the prize cursor shown after collecting all 42; the drawn SVG stays as a fallback. To add or swap a button, replace or add a webp and update `COUNT` in `assets/buttons.js` (there are 49 spots, so up to 49 buttons fit without adding spots).

How the game works:
- `SPOTS` lists where buttons sit on each page as `[selector, nth, x, y]`, with x and y as fractions of that element's box. Spots are dealt round-robin across pages, and button *i* gets the *i*-th spot.
- If page markup changes, check that those selectors still match.
- Progress is saved per visitor in `localStorage` (`judetopia.buttonEyes.v1`).
- A pentatonic "pop" plays per find and a fanfare plays at the end. Collecting everything turns the cursor into a button eye.
- The tin in the bottom-right corner shows the count, progress per page, a sound toggle, and a two-tap "start over".

### Tuba photo (done)
`assets/img/tuba-photo.webp` (900px, transparent) replaces the drawn `tuba.svg` in `tuba.html`. The halo sits over her ears and the eyeball hangs just past her raised paw. The photo sits low so the flames cover where it's cropped at the bottom. If the photo is swapped, retune `.halo` and `.lure`.

### Small questions for the owner for the owner
- Rename the page headings to match the nav: "Zines" → "Joodlebug Ink", "Bug of the Week" → "Featured Bug"?
- Merge to `main` / go live?

## Zine page sources (in case pages need re-cutting)
- **Alien Mode**: from `AlienMode_issue01_LETTER_print.pdf`, an 8-panel imposition (4×2, top row upside down).
  - Page order by tile (row-major, `r` = rotate 180): `0r 4 5 6 7 3r 2r 1r`.
  - `p1` (cover) is cropped from a 300dpi render to remove the empty band above the title, so it is shorter than the other pages.
- **Emergence**:
  - Pages 1–5 come from the owner's per-page PDFs (`Emergence_vol1_01…05`, A6).
  - Pages 6–8 come from `emergencevol1.psd` (same 4×2 imposition, tile order `7 3r 2r 1r 0r 4 5 6`).
  - If new PDFs for pages 6–8 turn up, swap them in the same way.
- Every zine page `<img>` in `zines.html` has full alt text (the poem text for Emergence). Update it if a page changes.

## Checking changes
- Serve locally with `npx serve . -p 3000`.
- Screenshot at 1366×900 and 390×844 with Playwright. Chromium is preinstalled; launch with `chromium.launch()`.
- Things that have broken before:
  - horizontal overflow on phones (`main` uses `overflow-x: clip`);
  - forgetting `height: auto` on sized images;
  - `cqi` units inside a container's own padding.
- To refresh the preview, copy the site into a scratch folder, duplicate `index.html` as `home.html`, and point `href="index.html"` (and `'index.html'` in `assets/buttons.js`) at `home.html`. Republish to the same artifact URL.
