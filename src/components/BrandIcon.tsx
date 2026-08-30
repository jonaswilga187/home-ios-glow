import * as simpleIcons from "simple-icons";
import { Server } from "lucide-react";

type SimpleIcon = { path: string; title: string; hex: string };

const icons = simpleIcons as unknown as Record<string, SimpleIcon>;

export function useBrand(slug: string): SimpleIcon | null {
  return icons[slug] ?? null;
}

interface BrandIconProps {
  slug: string;
  className?: string;
  /** Größe des farbigen Wells */
  size?: "sm" | "md";
}

/**
 * Rendert das Produkt-Logo in einem iOS-artigen, in Markenfarbe getönten Well.
 */
export function BrandIcon({ slug, size = "md" }: BrandIconProps) {
  const brand = useBrand(slug);
  const box = size === "sm" ? "size-9 rounded-[11px]" : "size-11 rounded-[14px]";
  const glyph = size === "sm" ? "size-4.5" : "size-5.5";

  if (!brand) {
    return (
      <div
        className={`flex ${box} shrink-0 items-center justify-center bg-muted text-muted-foreground`}
      >
        <Server className={glyph} strokeWidth={2.2} />
      </div>
    );
  }

  const color = `#${brand.hex}`;

  return (
    <div
      className={`flex ${box} shrink-0 items-center justify-center`}
      style={{ backgroundColor: `color-mix(in oklab, ${color} 14%, transparent)` }}
    >
      <svg
        role="img"
        aria-label={brand.title}
        viewBox="0 0 24 24"
        className={glyph}
        fill={color}
      >
        <path d={brand.path} />
      </svg>
    </div>
  );
}
