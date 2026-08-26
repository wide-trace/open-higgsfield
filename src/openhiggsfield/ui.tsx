"use client";

import { useLayoutEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

import { ratioBox } from "./data";
import { CheckIcon } from "./icons";

export function Field({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: ReactNode;
}) {
  return (
    <div className="ohf-field">
      {value === undefined ? (
        <div className="ohf-field-label">{label}</div>
      ) : (
        <div className="ohf-field-row">
          <div className="ohf-field-label">{label}</div>
          <div className="ohf-field-value">{value}</div>
        </div>
      )}
      {children}
    </div>
  );
}

/** One value of a catalog enum, on its own line: the frame the ratio is about
    to make on the left, the mark of the value in force on the right. */
function Option({
  value,
  label,
  active,
  onSelect,
  ratio,
}: {
  value: string;
  label: string;
  active: boolean;
  onSelect: () => void;
  ratio?: boolean;
}) {
  const box = ratio ? ratioBox(value) : null;
  return (
    <button type="button" className="ohf-opt" aria-pressed={active} onClick={onSelect}>
      {/* Every line of a ratio list reserves the glyph box, so the labels of
          "Auto" and "16:9" sit on the same rail. */}
      {ratio && (
        <span className="ohf-opt-ratio" aria-hidden>
          <span
            className={`ohf-opt-box${box ? "" : " ohf-opt-box--auto"}`}
            style={box ?? undefined}
          />
        </span>
      )}
      <span className="ohf-opt-label">{label}</span>
      {active && (
        <span className="ohf-opt-check" aria-hidden>
          <CheckIcon size={12} />
        </span>
      )}
    </button>
  );
}

/** The values of one enum, listed down a single column. A wrapped row of chips
    left each value at a different width on a ragged edge; read down, the labels
    and their marks share one rail however many values the model declares. */
export function OptionList({
  options,
  value,
  onChange,
  ratio,
}: {
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (next: string) => void;
  ratio?: boolean;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  /* A model can declare eleven ratios and the list opens scrolled to the top,
     so the value in force is carried into view before the panel is painted. */
  useLayoutEffect(() => {
    const list = listRef.current;
    const current = list?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!list || !current) return;
    list.scrollTop = Math.max(
      0,
      current.offsetTop - (list.clientHeight - current.offsetHeight) / 2,
    );
  }, []);

  return (
    <div className="ohf-opts ohf-scroll" role="group" ref={listRef}>
      {options.map((option) => (
        <Option
          key={option.value}
          value={option.value}
          label={option.label}
          active={option.value === value}
          ratio={ratio}
          onSelect={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}

export function Slider({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
}: {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (next: number) => void;
  label: string;
}) {
  const fill = `${(((value - min) / (max - min || 1)) * 100).toFixed(1)}%`;
  return (
    <input
      type="range"
      className="ohf-slider"
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={label}
      style={{ "--fill": fill } as CSSProperties}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
}
