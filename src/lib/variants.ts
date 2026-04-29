import type { CSSProperties } from "react";

export type VariantId = "ember" | "chalk" | "phosphor" | "velvet" | "tundra";

export interface SiteVariant {
  id: VariantId;
  name: string;
  description: string;
  introTitle: string;
  introBody: string;
  fontClass: string;
  palette: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    foreground: string;
    radius: string;
  };
}

export const siteVariants: SiteVariant[] = [
  {
    id: "ember",
    name: "Ember Foundry",
    description: "Warm industrial dark mode with forge-like undertones and matte surfaces.",
    introTitle: "Work worth showing.",
    introBody: "A gallery built for substance. Upload your projects and let the work do the talking.",
    fontClass: "var(--font-dm-sans)",
    palette: {
      background: "#0f0f0f",
      surface: "#1a1a1a",
      primary: "#00d4aa",
      secondary: "#00a3cc",
      accent: "#ff6b9d",
      foreground: "#f5f5f5",
      radius: "6px"
    }
  },
  {
    id: "chalk",
    name: "Chalk Manuscript",
    description: "Warm cream paper aesthetic with handwritten character and textbook structure.",
    introTitle: "Every project tells a story.",
    introBody: "A portfolio that feels like opening a well-loved notebook. Browse, discover, contribute.",
    fontClass: "var(--font-crimson)",
    palette: {
      background: "#fef7f0",
      surface: "#fffbf5",
      primary: "#d97706",
      secondary: "#ea580c",
      accent: "#0284c7",
      foreground: "#292524",
      radius: "4px"
    }
  },
  {
    id: "phosphor",
    name: "Phosphor Grid",
    description: "Neon-on-void technical display with tight grids and monospaced precision.",
    introTitle: "Projects. Rendered.",
    introBody: "High-density project display. No filler, no decoration, just output.",
    fontClass: "var(--font-space-mono)",
    palette: {
      background: "#0e0e10",
      surface: "#1c1c21",
      primary: "#00ff9f",
      secondary: "#00e0ff",
      accent: "#ff0080",
      foreground: "#f0f0f0",
      radius: "0px"
    }
  },
  {
    id: "velvet",
    name: "Dusk Velvet",
    description: "Deep purple luxury with muted elegance and considered restraint.",
    introTitle: "Curated with intention.",
    introBody: "A space where creative work is presented with the gravity it deserves.",
    fontClass: "var(--font-playfair)",
    palette: {
      background: "#1a1625",
      surface: "#2d2438",
      primary: "#9d7cd8",
      secondary: "#7aa2f7",
      accent: "#ff9e64",
      foreground: "#dcd7e8",
      radius: "8px"
    }
  },
  {
    id: "tundra",
    name: "Tundra Slate",
    description: "Icy cold minimal with stark contrast and generous whitespace.",
    introTitle: "Clean slate. Fresh work.",
    introBody: "A stripped-back gallery that puts every project in sharp focus.",
    fontClass: "var(--font-manrope)",
    palette: {
      background: "#f1f5f9",
      surface: "#f8fafc",
      primary: "#0f766e",
      secondary: "#14b8a6",
      accent: "#e11d48",
      foreground: "#0f172a",
      radius: "6px"
    }
  }
];

const variantMap = new Map(siteVariants.map((variant) => [variant.id, variant]));

export function resolveVariant(value?: string | string[]) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const found = variantMap.get(rawValue as VariantId);
  return found ?? siteVariants[0];
}

export function getVariantStyle(variant: SiteVariant): CSSProperties {
  return {
    "--background": variant.palette.background,
    "--surface": variant.palette.surface,
    "--primary": variant.palette.primary,
    "--secondary": variant.palette.secondary,
    "--accent": variant.palette.accent,
    "--foreground": variant.palette.foreground,
    "--radius": variant.palette.radius,
    "--font-family": variant.fontClass
  } as CSSProperties;
}
