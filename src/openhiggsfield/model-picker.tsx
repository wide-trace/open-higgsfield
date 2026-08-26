"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { MODELS } from "@/generation/catalog";
import type { ModelEntry, Surface } from "@/generation/catalog";

import { swatchFor } from "./artwork";
import { SURFACE_LABELS, describeModel } from "./data";
import { CheckIcon, CloseIcon, SearchIcon } from "./icons";
import { ModelIcon, modelIconSrc } from "./model-icon";

export function ModelPicker({
  selectedId,
  surface,
  onPick,
  onClose,
}: {
  selectedId: string;
  surface: Surface;
  onPick: (model: ModelEntry) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const query = search.trim().toLowerCase();
  const catalog = MODELS.filter((model) => model.surface === surface);
  /* The description is searchable too: "references", "4K" and "audio" are how
     a visitor asks for a model whose name they do not remember. */
  const models = catalog.filter(
    (model) =>
      !query || `${model.label} ${model.id} ${describeModel(model)}`.toLowerCase().includes(query),
  );

  return (
    <div
      className="ohf-popover ohf-popover--picker"
      role="dialog"
      aria-label="Models"
      /* The panel sizes itself from the whole surface catalog, not the matches,
         so its height is the same before and after every keystroke. */
      style={{ "--ohf-picker-rows": catalog.length } as CSSProperties}
    >
      {/* Search leads: the catalog is long enough that typing beats scanning. */}
      <div className="ohf-picker-head">
        <span className="ohf-picker-search-ic" aria-hidden>
          <SearchIcon size={16} />
        </span>
        <input
          ref={inputRef}
          className="ohf-picker-input"
          value={search}
          placeholder="Search models"
          aria-label="Search models"
          onChange={(event) => {
            setSearch(event.target.value);
            /* A new query is a new list: it starts at its first match rather
               than wherever the previous one had been scrolled to. */
            if (listRef.current) listRef.current.scrollTop = 0;
          }}
        />
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

      <div className="ohf-picker-list ohf-scroll" ref={listRef}>
        {/* The section label carries the count while searching — the one piece
            of merchandising the catalog can actually back up. */}
        <div className="ohf-pop-head ohf-picker-group">
          {query
            ? `${models.length} of ${catalog.length} ${SURFACE_LABELS[surface].toLowerCase()} models`
            : `${SURFACE_LABELS[surface]} models`}
        </div>

        {models.length === 0 && (
          <div className="ohf-picker-empty">
            <span className="ohf-picker-empty-ic">
              <SearchIcon size={15} />
            </span>
            <span className="ohf-picker-empty-title">No model matches “{search.trim()}”</span>
            <span className="ohf-picker-empty-hint">
              The {SURFACE_LABELS[surface].toLowerCase()} catalog holds {catalog.length} models.
            </span>
            <button
              type="button"
              className="ohf-btn-solid"
              onClick={() => {
                setSearch("");
                inputRef.current?.focus();
              }}
            >
              Clear search
            </button>
          </div>
        )}

        {models.map((model) => {
          const selected = model.id === selectedId;
          return (
            <button
              key={model.id}
              type="button"
              className="ohf-model-row"
              aria-current={selected || undefined}
              onClick={() => onPick(model)}
            >
              {modelIconSrc(model.id) ? (
                <span className="ohf-model-row-swatch ohf-model-row-swatch--icon">
                  <ModelIcon modelId={model.id} size={18} />
                </span>
              ) : (
                <span
                  className="ohf-model-row-swatch"
                  style={{ background: swatchFor(model.surface, model.id) }}
                >
                  <span className="ohf-grain" style={{ opacity: 0.22 }} />
                </span>
              )}
              <span className="ohf-model-row-text">
                <span className="ohf-model-row-name">{model.label}</span>
                <span className="ohf-model-row-desc">{describeModel(model)}</span>
              </span>
              <span className="ohf-model-row-check" aria-hidden>
                {selected && <CheckIcon />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
