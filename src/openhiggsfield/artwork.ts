import type { Surface } from "@/generation/catalog";

/* Deterministic pseudo-random from a string seed, so compositions stay stable
   across renders without storing coordinates. */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number): () => number {
  let s = seed || 1;
  return () => {
    s = Math.imul(s ^ (s >>> 15), s | 1);
    s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
  };
}

/** Layered-gradient artwork used for model swatches and as the ground behind
    loading/failed runs. Seeded, so no two subjects share the exact same light. */
export function artFor(surface: Surface, hue: number, seedKey: string): string {
  const r = rng(hash(seedKey));
  const h2 = (hue + 36 + Math.round(r() * 44)) % 360;
  const h3 = (hue + 14 + Math.round(r() * 22)) % 360;
  const hc = (hue + 165 + Math.round(r() * 40)) % 360;
  const x1 = 10 + Math.round(r() * 28);
  const y1 = 4 + Math.round(r() * 22);
  const x2 = 66 + Math.round(r() * 28);
  const y2 = 70 + Math.round(r() * 26);
  const xc = 15 + Math.round(r() * 70);
  const yc = 30 + Math.round(r() * 55);
  const angle = 138 + Math.round(r() * 44);

  const layers = [
    `radial-gradient(115% 88% at ${x1}% ${y1}%, oklch(0.76 0.16 ${hue} / 0.68), transparent 55%)`,
    `radial-gradient(88% 78% at ${x2}% ${y2}%, oklch(0.52 0.14 ${h2} / 0.62), transparent 60%)`,
    `radial-gradient(26% 24% at ${xc}% ${yc}%, oklch(0.5 0.15 ${hc} / 0.3), transparent 70%)`,
    `radial-gradient(150% 120% at 50% 125%, oklch(0.1 0.02 ${h3} / 0.9), transparent 68%)`,
    `linear-gradient(${angle}deg, oklch(0.38 0.09 ${hue}), oklch(0.17 0.04 ${h3}))`,
  ];
  if (surface === "video") {
    layers.unshift(
      `linear-gradient(180deg, transparent 46%, oklch(0.8 0.1 ${hue} / 0.07) 50%, transparent 54%)`,
    );
  }
  return layers.join(", ");
}

export function swatchFor(surface: Surface, seed: string): string {
  return artFor(surface, hash(seed) % 360, seed);
}

/* Film-grain overlay shared by every artwork, defined once as a CSS custom
   property so the data URI lives in one place. */
export const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";
