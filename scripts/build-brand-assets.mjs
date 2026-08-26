/* Builds every raster brand asset from the one mark geometry.

   The mark is authored once as SVG (src/app/icon.svg for the favicon,
   src/components/OpenHiggsfieldMark.tsx for the interface). Apple, the web app
   manifest and Open Graph all need rasters, so this script draws the same
   32-unit field in a headless Chromium and screenshots it at each size.

     node scripts/build-brand-assets.mjs

   Chromium comes from a local Playwright install; point CHROME_BIN at any
   Chrome build to use a different one. Outputs are committed — this runs when
   the mark changes, not on every build. */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join, resolve } from "node:path";

/* ---------- the mark ---------- */

const PLATE = "#0e1011";
const ACCENT = "#6fe3c0";
const INK = "#c2c9c8";

/** The two brackets on a 32-unit field. Keep in step with src/app/icon.svg. */
function brackets({ stroke = 2.5, accent = ACCENT, ink = INK } = {}) {
  return `<g fill="none" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19.5 6.5H8.9A2.4 2.4 0 0 0 6.5 8.9V17" stroke="${accent}"/>
    <path d="M12.5 25.5H23.1a2.4 2.4 0 0 0 2.4-2.4V15" stroke="${ink}"/>
  </g>`;
}

const markSvg = (size, opts) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}">${brackets(opts)}</svg>`;

/* The plate edge is one unit — a true hairline — at favicon size. In the large
   rasters it has to stay a hairline, so there it scales as a fraction of a unit. */
const roundedPlate = (size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}">
  <rect width="32" height="32" rx="7.5" fill="${PLATE}"/>
  <rect x=".06" y=".06" width="31.88" height="31.88" rx="7.44" fill="none" stroke="rgba(255,255,255,0.11)" stroke-width=".12"/>
  ${brackets()}
</svg>`;

/** Full-bleed square: Apple and the maskable spec apply their own mask. */
const bleedPlate = (size, scale) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}">
  <rect width="32" height="32" fill="${PLATE}"/>
  <g transform="translate(16 16) scale(${scale}) translate(-16 -16)">${brackets()}</g>
</svg>`;

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/* ---------- renderer ---------- */

function findChrome() {
  const candidates = [
    process.env.CHROME_BIN,
    ...["1237", "1228"].map((build) =>
      join(
        homedir(),
        "Library/Caches/ms-playwright",
        `chromium-${build}/chrome-mac-arm64`,
        "Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
      ),
    ),
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ].filter(Boolean);

  const found = candidates.find((path) => existsSync(path));
  if (found) return found;
  throw new Error(
    "No Chrome found. Install one, or set CHROME_BIN to a Chrome/Chromium binary.",
  );
}

const CHROME = findChrome();
const ROOT = resolve(import.meta.dirname, "..");
const WORK = mkdtempSync(join(tmpdir(), "openhiggsfield-brand-"));

function shoot(out, html, width, height, { transparent = false } = {}) {
  const page = join(WORK, `${width}x${height}-${Math.abs(hash(out))}.html`);
  writeFileSync(page, html);
  mkdirSync(resolve(out, ".."), { recursive: true });
  execFileSync(
    CHROME,
    [
      "--headless",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--virtual-time-budget=6000",
      ...(transparent ? ["--default-background-color=00000000"] : []),
      `--window-size=${width},${height}`,
      `--screenshot=${out}`,
      `file://${page}`,
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  console.log(`  ${out.replace(`${ROOT}/`, "")}  ${width}×${height}`);
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(h, 31) + str.charCodeAt(i)) | 0;
  return h;
}

const shell = (body, bg = "transparent") =>
  `<!doctype html><meta charset="utf-8"><style>
   *{margin:0;padding:0;box-sizing:border-box}
   html,body{width:100%;height:100%;background:${bg};overflow:hidden}
   body{display:flex}
   </style>${body}`;

/* ---------- app icons ---------- */

console.log("app icons");
shoot(join(ROOT, "public/icon-512.png"), shell(roundedPlate(512)), 512, 512, {
  transparent: true,
});
shoot(join(ROOT, "public/icon-192.png"), shell(roundedPlate(192)), 192, 192, {
  transparent: true,
});
// Maskable keeps the mark inside the 80%-diameter safe circle.
shoot(join(ROOT, "public/icon-maskable-512.png"), shell(bleedPlate(512, 0.82)), 512, 512);
shoot(join(ROOT, "src/app/apple-icon.png"), shell(bleedPlate(180, 1)), 180, 180);

/* ---------- open graph card ----------
   No stand-in tiles standing in for generated work we do not have. The only
   device besides the type is the mark itself, drawn large and hairline-thin:
   the card sits inside the field the mark names. */

const og = `<!doctype html><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=Inter:wght@400;500;600&display=block" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1200px;height:630px;overflow:hidden}
  body{
    position:relative;
    background:
      radial-gradient(110% 85% at 4% -8%, rgba(111,227,192,0.06), transparent 56%),
      radial-gradient(95% 115% at 104% 108%, rgba(255,255,255,0.032), transparent 60%),
      #0a0a0b;
    color:#edefef;
    font-family:Inter, ui-sans-serif, system-ui, sans-serif;
    -webkit-font-smoothing:antialiased;
    padding:74px 88px;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
  }
  .field{position:absolute;top:88px;right:78px;line-height:0}
  .grain{position:absolute;inset:0;background-image:${GRAIN};background-size:180px;opacity:.06}
  .band{position:relative}
  /* The footer band is gone, so the text block centers in what is left of the
     plate instead of sinking to the bottom edge. */
  .mid{position:relative;flex:1;display:flex;align-items:center}
  .mark{display:flex}
  h1{font-size:106px;font-weight:600;letter-spacing:-.05em;line-height:.92;color:#f2f4f4}
  .descriptor{margin-top:20px;font-family:"Geist Mono",ui-monospace,monospace;font-size:15px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;color:#7d8486}
  .rule{margin:34px 0 28px;width:455px;height:1px;background:rgba(255,255,255,.09)}
  p{font-size:24px;line-height:1.45;color:#a8aeaf;max-width:530px;letter-spacing:-.011em}
</style>
<div class="field">${markSvg(454, { stroke: 1.15, accent: "rgba(111,227,192,0.17)", ink: "rgba(255,255,255,0.085)" })}</div>
<div class="band mark">${markSvg(58, { stroke: 2.5 })}</div>
<div class="mid"><div class="band">
  <h1>OpenHiggsfield AI</h1>
  <div class="descriptor">Open source AI studio</div>
  <div class="rule"></div>
  <p>One prompt bar for image and video. Each model&rsquo;s own settings, and every finished run in one gallery.</p>
</div></div>
<div class="grain"></div>`;

console.log("open graph");
// public/, not app/opengraph-image.png — see the OG_IMAGE note in src/site.ts.
shoot(join(ROOT, "public/og.png"), og, 1200, 630);

rmSync(WORK, { recursive: true, force: true });
