import { browserLegacy, defaultKv, type Kv, type LegacyStore } from "./idb";
import type { AssetKind } from "./data";

/** A file the visitor sent to Blob. The URL is public and permanent, so the
    library outlives the session that produced it — the same reason run history
    is kept, and the reason the asset picker can offer both. */
export interface UploadRecord {
  id: string;
  url: string;
  kind: AssetKind;
  /** The file's own name, shown under nothing — it is the tile's title and its
      alt text, the only handle a plain grey PNG has. */
  name: string;
  createdAt: number;
}

export const UPLOADS_KEY = "uploads.v1";
export const LEGACY_UPLOADS_KEY = "openhiggsfield.uploads.v1";
const MAX_RECORDS = 40;

export async function loadUploads(
  kv: Kv = defaultKv(),
  legacy: LegacyStore | undefined = browserLegacy(),
): Promise<UploadRecord[]> {
  const stored = await readIdb(kv);
  const fromLegacy = readLegacy(legacy);
  if (stored.length === 0) return fromLegacy;
  if (fromLegacy.length === 0) return stored;
  return mergeUploads(stored, fromLegacy);
}

export async function saveUploads(
  records: UploadRecord[],
  kv: Kv = defaultKv(),
  legacy: LegacyStore | undefined = browserLegacy(),
): Promise<void> {
  const next = records
    .map(coerceUpload)
    .filter((row): row is UploadRecord => row !== null)
    .slice(0, MAX_RECORDS);
  try {
    await kv.set(UPLOADS_KEY, next);
  } catch {
    /* private mode or a denied store */
  }
  try {
    legacy?.setItem(LEGACY_UPLOADS_KEY, JSON.stringify(next));
  } catch {
    /* quota or a denied store */
  }
}

export function mergeUploads(stored: UploadRecord[], live: UploadRecord[]): UploadRecord[] {
  const byId = new Map<string, UploadRecord>();
  for (const row of [...stored, ...live]) {
    const prev = byId.get(row.id);
    if (!prev || row.createdAt >= prev.createdAt) byId.set(row.id, row);
  }
  return [...byId.values()].sort((a, b) => b.createdAt - a.createdAt).slice(0, MAX_RECORDS);
}

async function readIdb(kv: Kv): Promise<UploadRecord[]> {
  try {
    const stored = await kv.get<unknown>(UPLOADS_KEY);
    if (!Array.isArray(stored)) return [];
    return stored
      .map(coerceUpload)
      .filter((row): row is UploadRecord => row !== null)
      .slice(0, MAX_RECORDS);
  } catch {
    return [];
  }
}

function readLegacy(legacy: LegacyStore | undefined): UploadRecord[] {
  if (!legacy) return [];
  try {
    const raw = legacy.getItem(LEGACY_UPLOADS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(coerceUpload)
      .filter((row): row is UploadRecord => row !== null)
      .slice(0, MAX_RECORDS);
  } catch {
    return [];
  }
}

/** Newest first, and one entry per URL: re-picking the same file from the OS
    dialog moves it back to the front rather than stacking a duplicate tile. */
export function rememberUpload(
  records: UploadRecord[],
  next: UploadRecord,
  max = MAX_RECORDS,
): UploadRecord[] {
  return [next, ...records.filter((record) => record.url !== next.url)].slice(0, max);
}

/** The browser reports a MIME type; the library sorts by the coarse kind the
    picker's tabs are cut along. Anything unrecognised is treated as an image —
    the upload allow-list admits nothing else that could reach here. */
export function kindOfFile(file: File): AssetKind {
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "image";
}

function coerceUpload(value: unknown): UploadRecord | null {
  if (value === null || typeof value !== "object") return null;
  const record = value as Partial<UploadRecord>;
  if (
    typeof record.id !== "string" ||
    typeof record.url !== "string" ||
    typeof record.name !== "string" ||
    typeof record.createdAt !== "number"
  ) {
    return null;
  }
  const kind =
    record.kind === "video" || record.kind === "audio" || record.kind === "image"
      ? record.kind
      : "image";
  return { id: record.id, url: record.url, kind, name: record.name, createdAt: record.createdAt };
}
