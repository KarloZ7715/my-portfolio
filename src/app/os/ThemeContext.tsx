import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { wallpaperCssVars } from "./wallpaper-tokens";

export type ThemeMode = "light" | "dark" | "auto";
export type WallpaperName = "aurora" | "glacier" | "sunset";

export const WALLPAPERS: WallpaperName[] = ["aurora", "glacier", "sunset"];

interface ThemeCtx {
  theme: ThemeMode;
  resolved: "light" | "dark";
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  wallpaper: WallpaperName;
  setWallpaper: (name: WallpaperName) => void;
}

const STORAGE_KEY = "portfolio.theme";
const WALLPAPER_KEY = "portfolio.wallpaper";

const Ctx = createContext<ThemeCtx | null>(null);

function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "auto") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem(STORAGE_KEY) as ThemeMode) || "light";
  });

  const [resolved, setResolved] = useState<"light" | "dark">("light");
  const [wallpaper, setWallpaperState] = useState<WallpaperName>(() => {
    if (typeof window === "undefined") return "aurora";
    return (localStorage.getItem(WALLPAPER_KEY) as WallpaperName) || "aurora";
  });

  const setWallpaper = useCallback((name: WallpaperName) => {
    setWallpaperState(name);
    localStorage.setItem(WALLPAPER_KEY, name);
  }, []);

  useEffect(() => {
    const next = resolveTheme(theme);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const apply = () => {
      setResolved(next);
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem(STORAGE_KEY, theme);
      const vars = wallpaperCssVars(wallpaper, next);
      for (const [key, value] of Object.entries(vars)) {
        document.documentElement.style.setProperty(key, value);
      }
    };

    if (reduced || !("startViewTransition" in document)) {
      apply();
    } else {
      const transition = document.startViewTransition(() => {
        apply();
      });
      return () => {
        transition.skipTransition?.();
      };
    }

    if (theme !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  useEffect(() => {
    const vars = wallpaperCssVars(wallpaper, resolved);
    for (const [key, value] of Object.entries(vars)) {
      document.documentElement.style.setProperty(key, value);
    }
  }, [wallpaper, resolved]);

  const setTheme = useCallback((mode: ThemeMode) => setThemeState(mode), []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const current = resolveTheme(prev);
      return current === "dark" ? "light" : "dark";
    });
  }, []);

  const value = useMemo(
    () => ({ theme, resolved, setTheme, toggleTheme, wallpaper, setWallpaper }),
    [theme, resolved, setTheme, toggleTheme, wallpaper, setWallpaper]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
