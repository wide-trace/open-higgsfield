/* OpenHiggsfield icon set — 16-grid, 1.5px stroke, round caps, currentColor.
   One drawing system across the surface; fills mark active/media badges only. */

interface IconProps {
  size?: number;
}

function base(size: number) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  } as const;
}

export function ImageIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="1.75" y="1.75" width="12.5" height="12.5" rx="3" />
      <circle cx="5.9" cy="6" r="1.3" fill="currentColor" stroke="none" />
      <path d="M14 11.2 10.5 7.8 3.4 14" />
    </svg>
  );
}

export function VideoIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="1.75" y="2.9" width="12.5" height="10.2" rx="2.8" />
      <path d="M6.8 6 10.2 8 6.8 10 Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function AudioIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M2.75 6.6v2.8" />
      <path d="M6.25 3.8v8.4" />
      <path d="M9.75 5.6v4.8" />
      <path d="M13.25 7v2" />
    </svg>
  );
}

/* Assets holds every finished run, so the mark is a stack of frames seen
   edge-on — the same frame the Image and Video icons draw, with the ones
   behind it showing only their top edge. */
export function AssetsIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="1.9" y="6.35" width="12.2" height="7.75" rx="2.2" />
      <path d="M4.1 4.15h7.8" />
      <path d="M5.6 1.9h4.8" />
    </svg>
  );
}

export function KeyIcon({ size = 15 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="5.6" cy="10.2" r="3.1" />
      <path d="M7.9 7.9 13.2 2.6M10.8 5l1.7 1.7M8.9 6.9l1.7 1.7" />
    </svg>
  );
}

export function CaretDownIcon({ size = 10 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M4 6.2 8 10.2 12 6.2" />
    </svg>
  );
}

export function CloseIcon({ size = 14 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

export function CheckIcon({ size = 13 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.8}>
      <path d="M3 8.4 6.4 11.8 13 4.6" />
    </svg>
  );
}

export function SearchIcon({ size = 14 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="7" cy="7" r="4.4" />
      <path d="M10.4 10.4 13.6 13.6" />
    </svg>
  );
}

export function ShuffleIcon({ size = 14 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M13.4 8a5.4 5.4 0 1 1-1.6-3.85" />
      <path d="M13.6 1.9v2.5h-2.5" />
    </svg>
  );
}

export function RetryIcon({ size = 13 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M13.2 8a5.2 5.2 0 1 1-1.55-3.7" />
      <path d="M13.4 2.2v2.4H11" />
    </svg>
  );
}

export function WarningIcon({ size = 14 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M8 2.6 14.2 13H1.8Z" />
      <path d="M8 6.6v3" />
      <path d="M8 11.4h.01" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 13 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M2.9 8h9.5" />
      <path d="M8.9 4.5 12.4 8l-3.5 3.5" />
    </svg>
  );
}

export function PlusIcon({ size = 14 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M8 3.2v9.6M3.2 8h9.6" />
    </svg>
  );
}

export function MinusIcon({ size = 14 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M3.2 8h9.6" />
    </svg>
  );
}

/* Resolution is the one setting sold as a grade rather than a measurement, so
   it carries the gem — girdle line included, or it reads as a plain lozenge. */
export function GemIcon({ size = 14 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M4.3 2.6h7.4l2.4 3.6L8 13.4 1.9 6.2z" />
      <path d="M1.9 6.2h12.2" />
    </svg>
  );
}

export function ClockIcon({ size = 14 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="8" cy="8" r="5.9" />
      <path d="M8 4.6V8l2.5 1.6" />
    </svg>
  );
}

export function FormatIcon({ size = 14 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M9.2 1.9H5a2.1 2.1 0 0 0-2.1 2.1v8a2.1 2.1 0 0 0 2.1 2.1h6a2.1 2.1 0 0 0 2.1-2.1V5.8z" />
      <path d="M9.2 1.9v3.9h3.9" />
    </svg>
  );
}

export function PlayIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
      <path d="M4.9 3.2 12.4 8 4.9 12.8Z" fill="currentColor" />
    </svg>
  );
}

export function PlayBadgeIcon({ size = 9 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
      <path d="M3.6 2.2 13.4 8 3.6 13.8Z" fill="currentColor" />
    </svg>
  );
}

export function DownloadIcon({ size = 13 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M8 2.6v7.2M4.9 7 8 10.2 11.1 7" />
      <path d="M2.8 13.2h10.4" />
    </svg>
  );
}

/* The shelf's escape hatch: the same 13px frame, opened at one corner with the
   arrow leaving through it. Stands where a save was refused and the file has to
   be handed to a tab instead — a download arrow there would say the wrong
   thing twice. */
export function OpenOutIcon({ size = 13 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M13.2 9.4v3.1a1.7 1.7 0 0 1-1.7 1.7H3.5a1.7 1.7 0 0 1-1.7-1.7V4.5a1.7 1.7 0 0 1 1.7-1.7h3.1" />
      <path d="M9.7 2.2h4.1v4.1M7.3 8.7l6.3-6.3" />
    </svg>
  );
}

/* The mirror of DownloadIcon, on the same shelf line — the pair reads as one
   opposition rather than two unrelated arrows. */
export function UploadIcon({ size = 13 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M8 10.6V3.4M4.9 6.5 8 3.4l3.1 3.1" />
      <path d="M2.8 13.2h10.4" />
    </svg>
  );
}

/* Two offset sheets, the front one open at the corner the back sheet fills —
   reads as "duplicate" at 13px where a plain double rectangle reads as a box. */
export function CopyIcon({ size = 13 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="5.6" y="5.6" width="8.6" height="8.6" rx="2.2" />
      <path d="M10.4 5.6V4A2.2 2.2 0 0 0 8.2 1.8H4A2.2 2.2 0 0 0 1.8 4v4.2A2.2 2.2 0 0 0 4 10.4h1.6" />
    </svg>
  );
}

export function SlidersIcon({ size = 14 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M2.2 4.6h3.1M8.3 4.6h5.5" />
      <circle cx="6.8" cy="4.6" r="1.5" />
      <path d="M2.2 11.4h5.5M10.7 11.4h3.1" />
      <circle cx="9.2" cy="11.4" r="1.5" />
    </svg>
  );
}

export function ArrowUpIcon({ size = 15 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.8}>
      <path d="M8 13V3.4" />
      <path d="M3.8 7.6 8 3.4l4.2 4.2" />
    </svg>
  );
}

/* Keeping a run is one mark in two states: the outline is the offer, the
   solid is the kept run. Same path, so the fill lands exactly on the stroke. */
const HEART =
  "M8 13.2C8 13.2 2.4 9.75 2.4 6.05C2.4 4.28 3.78 3.05 5.4 3.05C6.5 3.05 7.5 3.65 8 4.55C8.5 3.65 9.5 3.05 10.6 3.05C12.22 3.05 13.6 4.28 13.6 6.05C13.6 9.75 8 13.2 8 13.2Z";

export function HeartIcon({ size = 14, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(size)} fill={filled ? "currentColor" : "none"}>
      <path d={HEART} />
    </svg>
  );
}

/* Lid, handle, tapered body — no inner ribs, which silt up at 13px over a
   photograph. The body clears the lid line so the two do not fuse into a box. */
export function TrashIcon({ size = 13 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M2.9 4.25h10.2" />
      <path d="M6.15 4.25V3.05a1 1 0 0 1 1-1h1.7a1 1 0 0 1 1 1v1.2" />
      <path d="M4.55 6.1h6.9l-.45 6.4a1.5 1.5 0 0 1-1.5 1.4H6.5a1.5 1.5 0 0 1-1.5-1.4Z" />
    </svg>
  );
}

export function UndoIcon({ size = 13 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M2.8 8a5.2 5.2 0 1 0 1.55-3.7" />
      <path d="M2.6 2.2v2.4H5" />
    </svg>
  );
}

export function WaveBadgeIcon({ size = 12 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M2.75 6.6v2.8M6.25 4.4v7.2M9.75 6v4M13.25 7v2" />
    </svg>
  );
}
