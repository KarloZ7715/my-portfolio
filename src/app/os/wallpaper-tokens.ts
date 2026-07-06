import type { WallpaperName } from "./ThemeContext";

export type WallpaperTokens = {
  swatch: string;
  textGradient: { light: string; dark: string };
  accent: { light: string; dark: string };
};

/** Shared palette tokens — wallpaper UI, desktop bg, and bio role gradient stay in sync. */
export const WALLPAPER_TOKENS: Record<WallpaperName, WallpaperTokens> = {
  aurora: {
    swatch: "linear-gradient(135deg, #ff8fbf, #6d5cff, #2a2178)",
    textGradient: {
      light: "linear-gradient(118deg, #ff8fbf 0%, #d07aff 38%, #6d5cff 72%, #4a3ab8 100%)",
      dark: "linear-gradient(118deg, #ffb3d4 0%, #d4a3ff 42%, #9b8aff 100%)",
    },
    accent: { light: "#8b5cf6", dark: "#c4a8ff" },
  },
  glacier: {
    swatch: "linear-gradient(135deg, #8ff5e0, #2f8fc0, #0a1f36)",
    textGradient: {
      light: "linear-gradient(118deg, #8ff5e0 0%, #4fd0d8 40%, #2f8fc0 75%, #1c5f8a 100%)",
      dark: "linear-gradient(118deg, #a8ffe8 0%, #6dd8e0 45%, #5aa8d8 100%)",
    },
    accent: { light: "#2f8fc0", dark: "#7ec8e8" },
  },
  sunset: {
    swatch: "linear-gradient(135deg, #ffd27a, #ec5f4f, #241030)",
    textGradient: {
      light: "linear-gradient(118deg, #ffd27a 0%, #ff9a56 42%, #ec5f4f 78%, #9a3a5a 100%)",
      dark: "linear-gradient(118deg, #ffe0a0 0%, #ffb080 45%, #f08070 100%)",
    },
    accent: { light: "#ec5f4f", dark: "#ffa090" },
  },
};

export function wallpaperCssVars(name: WallpaperName, resolved: "light" | "dark") {
  const tokens = WALLPAPER_TOKENS[name];
  return {
    "--wallpaper-text-gradient": tokens.textGradient[resolved],
    "--wallpaper-accent": tokens.accent[resolved],
  } as Record<string, string>;
}
