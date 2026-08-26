"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";

import type { MediaItem, MediaRole, ModelEntry } from "@/generation/catalog";

import { ROLE_KINDS, ROLE_LABELS, defaultRole, roleNoun, rolesOf, type AssetKind } from "./data";
import type { RunRecord } from "./history";
import {
  AssetsIcon,
  AudioIcon,
  CheckIcon,
  CloseIcon,
  PlayBadgeIcon,
  UploadIcon,
} from "./icons";
import type { UploadRecord } from "./uploads";

type Source = "uploads" | "generations";

const SOURCES: readonly Source[] = ["uploads", "generations"];

const SOURCE_LABELS: Record<Source, string> = {
  uploads: "Uploads",
  generations: "Generations",
};

interface Asset {
  url: string;
  kind: AssetKind;
  /** The tile's name — a file name, or the prompt the run was made from. It is
      the alt text and the pointer title: a grey plate has no other handle. */
  title: string;
  /** The run's layered-gradient art, so a tile whose media is slow to arrive or
      has aged off the platform's CDN is still a picture rather than a hole. */
  art?: string;
}

/** Everything a role can be filled from: files this browser sent to Blob, and
    the finished runs already in the history. Both are public URLs the plane can
    carry, so the picker treats them as one library cut along two tabs. */
export function AssetPicker({
  model,
  items,
  uploads,
  history,
  staged,
  uploading,
  onUpload,
  onApply,
  onClose,
}: {
  model: ModelEntry;
  /** The current surface's attachments. They are what the panel opens holding:
      a role's inputs are edited here, not only added to. */
  items: MediaItem[];
  uploads: UploadRecord[];
  history: RunRecord[];
  staged: string | null;
  uploading: boolean;
  onUpload: (role: MediaRole) => void;
  onApply: (role: MediaRole, urls: string[]) => void;
  onClose: () => void;
}) {
  const roles = rolesOf(model);
  const [role, setRole] = useState<MediaRole>(() => defaultRole(model));
  /* null until the visitor picks a shelf: the panel opens on whichever one
     actually holds something, so someone who has generated all day and
     uploaded nothing does not land on an empty tab. */
  const [source, setSource] = useState<Source | null>(null);
  /* The role's inputs as this panel would leave them — seeded with what is
     already on the plane, so an attached tile opens marked and can be pressed
     off again. An array, not a Set: the order picked is the order attached,
     and a start/end pair is not order-blind. */
  const [selected, setSelected] = useState<string[]>(() => urlsOf(items, defaultRole(model)));
  const tabsRef = useRef<HTMLDivElement>(null);

  const kind = ROLE_KINDS[role];
  const max = model.roles[role] ?? 0;
  const current = useMemo(() => urlsOf(items, role), [items, role]);
  const room = Math.max(0, max - selected.length);

  const uploadAssets = useMemo(
    () =>
      uploads
        .filter((record) => record.kind === kind)
        .map((record) => ({ url: record.url, kind: record.kind, title: record.name })),
    [uploads, kind],
  );

  /* One record can carry several media, and each is its own attachable frame. */
  const runAssets = useMemo(() => {
    const out: Asset[] = [];
    for (const record of history) {
      if (record.status !== "completed" || record.kind !== kind) continue;
      for (const url of record.urls) out.push({ url, kind, title: record.prompt, art: record.art });
    }
    return out;
  }, [history, kind]);

  const shelf: Source =
    source ?? (uploadAssets.length === 0 && runAssets.length > 0 ? "generations" : "uploads");
  const assets = shelf === "uploads" ? uploadAssets : runAssets;

  // The dialog takes focus on the control that scopes it, not on the grid.
  useEffect(() => {
    tabsRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus();
  }, []);

  /* A file uploaded from inside the panel joins the selection rather than the
     plane: one press still applies the whole set. The ref holds whatever was
     staged before this panel opened, so reopening does not re-select it. */
  const seen = useRef(staged);

  /* A new role is a new library and a new set — a start frame cannot follow the
     switch to audio — so the shelf and the selection are both re-seeded. */
  function pickRole(next: MediaRole) {
    setRole(next);
    setSource(null);
    setSelected(urlsOf(items, next));
  }

  /* Start and end are a pair: attaching the start should land on the empty end
     slot instead of closing, so the second frame is one more click, not a
     reopen plus a confirm. */
  function advanceOrClose(filled: MediaRole) {
    if (filled === "start" && (model.roles.end ?? 0) > 0) {
      const endUsed = items.filter((item) => item.role === "end").length;
      if (endUsed < (model.roles.end ?? 0)) {
        pickRole("end");
        return;
      }
    }
    onClose();
  }

  function commit(urls: string[]) {
    onApply(role, urls);
    if (max > 0 && urls.length >= max) {
      advanceOrClose(role);
      return;
    }
    onClose();
  }

  useEffect(() => {
    if (staged === null || staged === seen.current) return;
    seen.current = staged;
    if (max === 1) {
      setSelected([staged]);
      commit([staged]);
      return;
    }
    setSelected((prev) => (prev.includes(staged) ? prev : [...prev, staged]));
  }, [staged]);

  function toggle(url: string) {
    if (max === 1) {
      const next = selected.includes(url) ? [] : [url];
      setSelected(next);
      onApply(role, next);
      if (next.length === 1) advanceOrClose(role);
      return;
    }
    setSelected((prev) =>
      prev.includes(url) ? prev.filter((entry) => entry !== url) : [...prev, url],
    );
  }

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const from = SOURCES.indexOf(shelf);
    const to =
      event.key === "ArrowRight"
        ? (from + 1) % SOURCES.length
        : event.key === "ArrowLeft"
          ? (from - 1 + SOURCES.length) % SOURCES.length
          : -1;
    if (to < 0) return;
    event.preventDefault();
    setSource(SOURCES[to]!);
    tabsRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[to]?.focus();
  };

  const empty = emptyCopy(shelf, kind);
  const canUpload = room > 0 && !uploading;
  const uploadTip = uploading
    ? "Uploading…"
    : room > 0
      ? `Upload a ${roleNoun(role, 1)} from this device`
      : `Every ${roleNoun(role, 1)} slot is taken — press one off to free it`;

  /* The button states the difference it will make, so a set edited down reads
     as a removal rather than as an "Add" that removes. */
  const picked = new Set(selected);
  const added = selected.filter((url) => !current.includes(url)).length;
  const dropped = current.filter((url) => !picked.has(url)).length;
  const applyLabel =
    added && dropped
      ? `Replace ${roleNoun(role, Math.max(added, dropped))}`
      : added
        ? `Add ${added > 1 ? `${added} ` : ""}${roleNoun(role, added)}`
        : dropped
          ? `Remove ${dropped > 1 ? `${dropped} ` : ""}${roleNoun(role, dropped)}`
          : "Done";

  return (
    <div className="ohf-popover ohf-popover--assets" role="dialog" aria-label="Add input">
      <div className="ohf-assets-head">
        <div
          className="ohf-assets-tabs"
          role="tablist"
          aria-label="Asset source"
          ref={tabsRef}
          onKeyDown={onTabKeyDown}
        >
          {SOURCES.map((id) => {
            const active = id === shelf;
            const count = id === "uploads" ? uploadAssets.length : runAssets.length;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                tabIndex={active ? 0 : -1}
                className="ohf-assets-tab"
                onClick={() => setSource(id)}
              >
                {SOURCE_LABELS[id]}
                <span className="ohf-assets-tab-count">{count}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="ohf-icon-btn ohf-icon-btn--ghost ohf-picker-close"
          aria-label="Close"
          title="Close"
          onClick={onClose}
        >
          <CloseIcon size={13} />
        </button>
      </div>

      {/* Which slot this panel is editing. Models declaring one role need no
          switch — the footer already names what is being changed. */}
      {roles.length > 1 && (
        <div className="ohf-assets-roles" role="group" aria-label="Input slot">
          {roles.map((entry) => {
            const used =
              entry === role ? selected.length : items.filter((item) => item.role === entry).length;
            return (
              <button
                key={entry}
                type="button"
                className="ohf-chip ohf-chip--role"
                aria-pressed={entry === role}
                onClick={() => pickRole(entry)}
              >
                {ROLE_LABELS[entry]}
                <span className="ohf-chip-count">
                  {used}/{model.roles[entry] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="ohf-assets-body ohf-scroll">
        {assets.length === 0 ? (
          <div className="ohf-picker-empty">
            <span className="ohf-picker-empty-ic">
              {shelf === "uploads" ? <UploadIcon size={15} /> : <AssetsIcon size={15} />}
            </span>
            <span className="ohf-picker-empty-title">{empty.title}</span>
            <span className="ohf-picker-empty-hint">{empty.hint}</span>
            {shelf === "uploads" && (
              <button
                type="button"
                className="ohf-btn-solid"
                disabled={!canUpload}
                onClick={() => onUpload(role)}
              >
                <UploadIcon />
                Upload file
              </button>
            )}
          </div>
        ) : (
          <div className="ohf-assets-grid">
            {shelf === "uploads" && (
              <button
                type="button"
                className="ohf-asset ohf-asset--upload"
                disabled={!canUpload}
                title={uploadTip}
                aria-label={uploadTip}
                onClick={() => onUpload(role)}
              >
                {uploading ? <span className="ohf-spinner" aria-hidden /> : <UploadIcon size={17} />}
                <span className="ohf-asset-upload-label">Upload file</span>
              </button>
            )}

            {assets.map((asset) => {
              const on = picked.has(asset.url);
              return (
                <AssetTile
                  key={asset.url}
                  asset={asset}
                  picked={on}
                  blocked={!on && room === 0}
                  onToggle={toggle}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="ohf-assets-foot">
        <span className="ohf-assets-tally">
          {selected.length} of {max} {roleNoun(role, max)}
        </span>
        {/* Never disabled: with no change left to apply it is simply the way
            out, and the panel always offers one press that ends the task. */}
        <button
          type="button"
          className="ohf-btn-accent"
          data-quiet={added + dropped === 0}
          onClick={() => commit(selected)}
        >
          {applyLabel}
        </button>
      </div>
    </div>
  );
}

function urlsOf(items: MediaItem[], role: MediaRole): string[] {
  return items.filter((item) => item.role === role).map((item) => item.url);
}

function emptyCopy(source: Source, kind: AssetKind): { title: string; hint: string } {
  if (source === "uploads") {
    return {
      title: "Nothing uploaded yet",
      hint: "Files you send from this device stay on this shelf for the next run too.",
    };
  }
  if (kind === "audio") {
    return {
      title: "Runs never return audio",
      hint: "Attach an audio track from this device instead — it lands on the Uploads shelf.",
    };
  }
  return {
    title: `No finished ${kind} runs yet`,
    hint: `Every ${kind} you generate lands here, ready to feed the next run.`,
  };
}

/* Video assets preview on hover, the same reflex the gallery teaches, so the
   tile carries its own element and its own ref. */
const AssetTile = memo(function AssetTile({
  asset,
  picked,
  blocked,
  onToggle,
}: {
  asset: Asset;
  picked: boolean;
  blocked: boolean;
  onToggle: (url: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <button
      type="button"
      className="ohf-asset"
      data-picked={picked}
      disabled={blocked}
      title={asset.title}
      aria-pressed={picked}
      aria-label={asset.title}
      onClick={() => onToggle(asset.url)}
      onMouseEnter={() => void videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => {
        const video = videoRef.current;
        if (!video) return;
        video.pause();
        video.currentTime = 0;
      }}
    >
      <span className="ohf-asset-art" style={asset.art ? { background: asset.art } : undefined} />

      {asset.kind === "video" ? (
        <video
          ref={videoRef}
          className="ohf-asset-media"
          src={asset.url}
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : asset.kind === "audio" ? (
        <span className="ohf-asset-glyph">
          <AudioIcon size={20} />
        </span>
      ) : (
        /* Blob and platform CDN hosts both; next/image would need every
           provider domain allow-listed up front for a 112px thumb. */
        /* eslint-disable-next-line @next/next/no-img-element */
        <img className="ohf-asset-media" src={asset.url} alt="" loading="lazy" />
      )}

      {asset.kind === "video" && (
        <span className="ohf-asset-kind" aria-hidden>
          <PlayBadgeIcon size={8} />
        </span>
      )}

      <span className="ohf-asset-mark" aria-hidden>
        <CheckIcon size={12} />
      </span>
    </button>
  );
});
