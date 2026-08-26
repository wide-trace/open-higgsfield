/* One source of truth for the site's identity and its canonical origin.
   Server-only by intent: VERCEL_PROJECT_PRODUCTION_URL is not exposed to the
   browser, so importing SITE_URL into a client component would resolve
   differently on each side. Keep this module out of "use client" files. */

function resolveOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveOrigin();

export const SITE_NAME = "OpenHiggsfield AI";
export const SITE_DESCRIPTOR = "Open source AI studio";
export const SITE_TITLE = `${SITE_NAME} — ${SITE_DESCRIPTOR}`;

export const SITE_DESCRIPTION =
  "A studio for image and video generation — one prompt bar, each model’s own settings, and every finished run in one gallery.";

/** Near-black studio ground; also the installed-app and browser-chrome color. */
export const STUDIO_BG = "#0a0a0b";

/* The card built by scripts/build-brand-assets.mjs. It lives in public/ rather
   than as an app/opengraph-image file on purpose: the file convention outranks
   an explicit declaration in its own segment, so the two would disagree about
   the alt text — the root would take it from an opengraph-image.alt.txt while
   every route that overrides `openGraph` took it from here. One asset, one
   declaration, one alt. */
export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "The OpenHiggsfield AI open-frame mark on a near-black field, above the OpenHiggsfield AI wordmark, the words Open source AI studio, and a line describing one prompt bar for image and video with every finished run in one gallery.",
};

/* Next replaces the whole `openGraph` (and `twitter`) object when a route
   defines one, so a route that only wants its own url would silently drop
   og:type, og:site_name, og:locale and the card. Overrides go through here. */
export function openGraphFor({
  path,
  title = SITE_TITLE,
  description = SITE_DESCRIPTION,
}: {
  path: string;
  title?: string;
  description?: string;
}) {
  return {
    type: "website" as const,
    siteName: SITE_NAME,
    locale: "en_US",
    url: path,
    title,
    description,
    images: [OG_IMAGE],
  };
}

export function twitterFor({
  title = SITE_TITLE,
  description = SITE_DESCRIPTION,
}: { title?: string; description?: string } = {}) {
  return {
    card: "summary_large_image" as const,
    title,
    description,
    images: [OG_IMAGE],
  };
}
