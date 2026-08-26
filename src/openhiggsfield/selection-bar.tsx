"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";

import type { RunRecord } from "./history";
import { CloseIcon, DownloadIcon, HeartIcon, PlayBadgeIcon, TrashIcon } from "./icons";

/** How many runs the count stack shows before it stops drawing new sheets. */
const STACK = 3;

export interface SaveProgress {
  done: number;
  total: number;
}

/* The composer's replacement, not a second floating layer: while runs are
   picked the dock carries this instead, in the same slot and against the same
   bottom edge, so the swap reads as one control becoming another.

   It stays mounted once the studio has ever had a selection — the bar has to
   be present to animate away, and it needs the last non-empty selection to
   avoid flashing "0 selected" on its way out. */
export function SelectionBar({
  records,
  saving,
  onDownload,
  onFavorite,
  onDelete,
  onClose,
}: {
  records: RunRecord[];
  saving: SaveProgress | null;
  onDownload: () => void;
  onFavorite: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const on = records.length > 0;
  /* The exiting bar keeps saying what it was acting on. */
  const held = useRef(records);
  if (on) held.current = records;
  const shown = held.current;

  const count = shown.length;
  const saveable = shown.filter((record) => record.urls[0]).length;
  const allKept = shown.every((record) => record.favorite === true);
  const noun = count === 1 ? "run" : "runs";

  const downloadLabel = saving
    ? `Saving ${saving.done} of ${saving.total}`
    : saveable === 0
      ? "Nothing here to download"
      : saveable < count
        ? `Download ${saveable} of ${count}`
        : "Download";

  return (
    /* A labelled group rather than role="toolbar": the toolbar pattern promises
       arrow-key navigation between its controls, and four buttons the visitor
       can already tab through do not need a second set of keys to learn. */
    <div
      className="ohf-selbar"
      role="group"
      aria-label="Bulk actions"
      data-on={on}
      inert={!on}
    >
      {/* Picking is done in the grid and reported here, so the count says so
          out loud rather than leaving the change silent. */}
      <p className="ohf-selbar-count" role="status">
        <span className="ohf-selstack" aria-hidden>
          {shown.slice(-STACK).map((record, index, sheets) => (
            <span
              key={record.id}
              className="ohf-selchip"
              style={{ "--z": sheets.length - 1 - index, background: record.art } as CSSProperties}
            >
              {record.kind === "image" && record.urls[0] ? (
                /* Platform CDN host, same as the grid: next/image would need
                   every provider domain allow-listed up front. */
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={record.urls[0]} alt="" />
              ) : (
                record.kind === "video" && (
                  <span className="ohf-selchip-play">
                    <PlayBadgeIcon size={7} />
                  </span>
                )
              )}
            </span>
          ))}
        </span>
        {/* One phrase, one flex item — the stack's gap must not open between
            the number and the word it counts. */}
        <span className="ohf-selbar-text">
          <span className="ohf-selbar-n" key={count}>
            {count}
          </span>{" "}
          selected
        </span>
      </p>

      <span className="ohf-selbar-rule" aria-hidden />

      <span className="ohf-selbar-slot ohf-tip" data-tip={downloadLabel}>
        <button
          type="button"
          className="ohf-selact ohf-selact--wide"
          disabled={saveable === 0 || saving !== null}
          aria-label={downloadLabel}
          onClick={onDownload}
        >
          {saving ? <span className="ohf-spinner" aria-hidden /> : <DownloadIcon size={15} />}
          <span className="ohf-selact-label">
            {saving ? `${saving.done}/${saving.total}` : "Download"}
          </span>
        </button>
      </span>

      <button
        type="button"
        className="ohf-selact ohf-tip"
        data-tip={
          allKept ? `Remove ${count} ${noun} from favorites` : `Save ${count} ${noun} to favorites`
        }
        data-on={allKept}
        aria-pressed={allKept}
        aria-label={allKept ? "Remove from favorites" : "Save to favorites"}
        onClick={onFavorite}
      >
        <HeartIcon size={16} filled={allKept} />
      </button>

      <button
        type="button"
        className="ohf-selact ohf-selact--danger ohf-tip"
        data-tip={`Delete ${count} ${noun}`}
        aria-label={`Delete ${count} ${noun}`}
        onClick={onDelete}
      >
        <TrashIcon size={15} />
      </button>

      <span className="ohf-selbar-rule" aria-hidden />

      <button
        type="button"
        className="ohf-selact ohf-selact--quiet ohf-tip ohf-tip--end"
        data-tip="Clear selection · Esc"
        aria-label="Clear selection"
        onClick={onClose}
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
}
