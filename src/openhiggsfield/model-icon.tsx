import type { CSSProperties } from "react";

/** Brand file in /public/model-icons, or nothing if the pack has no match. */
export function modelIconFile(id: string): string | undefined {
  if (id.startsWith("kling")) return "kling";
  if (id.startsWith("wan")) return "wan";
  if (id.startsWith("flux")) return "flux";
  if (id.startsWith("grok")) return "grok";
  if (id.startsWith("happy-horse")) return "happy-horse";
  if (id.startsWith("minimax")) return "minimax";
  if (id.startsWith("recraft")) return "recraft";
  if (id.startsWith("soul") || id === "dop") return "higgsfield";
  if (id.startsWith("ideogram")) return "ideogram";
  if (id.startsWith("qwen")) return "qwen";
  if (id.startsWith("pixverse")) return "pixverse";
  if (id.startsWith("ltx")) return "ltx";
  if (id.startsWith("z-image")) return "z-image";
  return undefined;
}

export function modelIconSrc(id: string): string | undefined {
  const file = modelIconFile(id);
  return file ? `/model-icons/${file}.svg` : undefined;
}

export function ModelIcon({
  modelId,
  size = 16,
  className = "ohf-model-icon",
}: {
  modelId: string;
  size?: number;
  className?: string;
}) {
  const src = modelIconSrc(modelId);
  if (!src) return null;
  return (
    <span
      className={className}
      aria-hidden
      style={
        {
          width: size,
          height: size,
          "--ohf-model-icon": `url("${src}")`,
        } as CSSProperties
      }
    />
  );
}
