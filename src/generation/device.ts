export const DEVICE_COOKIE = "ohf_device";

export const DEVICE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 400,
};

const DEVICE_ID_RE = /^[A-Za-z0-9_-]{16,64}$/;

export function mintDeviceId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function parseDeviceId(raw: string | undefined): string | null {
  return raw && DEVICE_ID_RE.test(raw) ? raw : null;
}

export function resolveDeviceId(raw: string | undefined): { deviceId: string; minted: boolean } {
  const existing = parseDeviceId(raw);
  if (existing) return { deviceId: existing, minted: false };
  return { deviceId: mintDeviceId(), minted: true };
}

export function blobPathname(deviceId: string, filename: string): string {
  const id = parseDeviceId(deviceId);
  if (!id) throw new Error("Invalid device id");
  return `${id}/${sanitizeFilename(filename)}`;
}

function sanitizeFilename(filename: string): string {
  const base = filename.replaceAll("\\", "/").split("/").pop() ?? "";
  const cleaned = base.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^\.+/, "");
  return cleaned.slice(0, 180) || "file";
}
