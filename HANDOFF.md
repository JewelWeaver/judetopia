# Judetopia handoff

Where the redesign stands, what's left, and how to pick it up.

## Status

All work is on branch `claude/review-judetopia-code-pEESo`. **`main` is untouched**; judetopia.com most likely deploys from `main`, so nothing is live until that branch is merged (open a PR when ready).

Private clickable preview (owner-only until shared): https://claude.ai/artifact/GfHTyrueL4XcmnULSPMu3S. It is a copy of the site, not the repo; it does not include the button-eye game yet.

## The site

Plain static HTML in the repo root, one shared stylesheet. No build step.

| Page | What it is |
|---|---|
| `index.html` | Quiet homepage: one eye in the dark, "are you there?", three nav tapes. The Emergence figure is hidden around the eye and shows where a light follows the pointer (drifts on its own when idle). |
| `zines.html` | "Joodlebug Ink" in the nav. Alien Mode vol. 1 and Emergence vol. 1 as page-flip readers (spreads on wide screens, single pages on phones, arrows/keys/swipe), each with a one-line blurb. Third Eye Charms below as hang tags. |
| `tuba.html` | Tuba's Corner: silly hell (flames, embers, pitchfork wallpaper, eye-sun, flaming halo, dangling eyeball) + Job 38:4 thought bubble. |
| `bug.html` | Featured Bug (page heading still says "Bug of the Week"). Dogbane Beetle + archive scraps, incl. the Jade Faced Buffalo Beetle from Alien Mode. |
| `art.html` | Redirect to `zines.html` so old links work. |

- `assets/site.css`: palette (sampled from the zine paper colors), fonts (Courier Prime, Luckiest Guy, Josefin Sans), nav tapes, paper/tape/sticker styles, footer, button-eye game styles.
- `assets/buttons.js`: the button-eye side quest (below).
- `assets/img/`: doodles, `tuba.svg`, `beetle.svg`, `brand-mark.png` (the hand-lettered "Joodlebug ink." logo), and `zines/<zine>/p1–p8.webp`.
- `src/` is an older, unused Eleventy/Alpine work-in-progress (no eleventy config, does not build). Not part of the live site.

## Open items

### 1. Button-eye images (game is built, art is not in yet)
The game runs today with drawn stand-in buttons. The real images are the **41 PNGs in the Google Drive folder "Eyes"** (0.6–2 MB each, private). They could not be pulled from Drive in this session: the Drive connector only returns file contents as text inside the chat. Get them by either:
- having the owner attach them (or a zip of the folder) to the chat, or upload them to the repo; or
- with the owner's OK, turn on view-only link sharing for that folder, then `curl -L "https://drive.usercontent.google.com/download?id=<FILE_ID>&export=download"`. Turning the link back off has to be done by the owner in Drive.

Then:
1. Trim and shrink each one to about 160px webp: `convert in.png -trim +repage -resize 160x160 -quality 85 assets/img/buttons/eye-01.webp` (keep transparency; if they have a white background, knock it out).
2. In `assets/buttons.js` set `COUNT` to the number of images and
   `const art = i => \`assets/img/buttons/eye-${String(i + 1).padStart(2, '0')}.webp\`;`

How the game works:
- `SPOTS` lists where buttons sit on each page as `[selector, nth, x, y]`, with x and y as fractions of that element's box. Spots are dealt round-robin across pages, and button *i* gets the *i*-th spot.
- If page markup changes, check that those selectors still match.
- Progress is saved per visitor in `localStorage` (`judetopia.buttonEyes.v1`).
- A pentatonic "pop" plays per find and a fanfare plays at the end. Collecting everything turns the cursor into a button eye.
- The tin in the bottom-right corner shows the count, progress per page, a sound toggle, and a two-tap "start over".

### 2. Tuba photo
The owner shared a cut-out photo of Tuba (black cat reaching up with one paw) but only inline in chat, so it was never saved as a file. Ask for it as an attachment, then:
- Save it as `assets/img/tuba-photo.webp` with a transparent background (remove the white).
- In `tuba.html`, point the `.tuba` img at it and update its width/height/alt.
- Retune `.halo` (left/top/width) to sit over her head and `.lure` (right/top) just past her raised paw. Let the bottom flames hide where the photo is cropped.

### 3. Small questions for the owner
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
