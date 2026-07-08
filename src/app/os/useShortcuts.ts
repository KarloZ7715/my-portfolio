import { useEffect } from "react";
import { useOS } from "./OSContext";

interface Options {
  onSpotlight: () => void;
}

/**
 * Global desktop shortcuts using Alt+Shift to avoid browser conflicts
 * (⌘W closes tabs, ⌘Tab switches OS apps, ⌘K opens browser UI, etc.).
 */
export function useShortcuts({ onSpotlight }: Options) {
  const { activeId, closeApp, minimizeApp, hideAll, cycleFocus, openApp } = useOS();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.altKey || !e.shiftKey || e.metaKey || e.ctrlKey) return;

      const key = e.key.toLowerCase();

      if (key === "k") {
        e.preventDefault();
        onSpotlight();
        return;
      }
      if (key === "w" && activeId) {
        e.preventDefault();
        closeApp(activeId);
        return;
      }
      if (key === "m" && activeId) {
        e.preventDefault();
        minimizeApp(activeId);
        return;
      }
      if (key === "h") {
        e.preventDefault();
        hideAll();
        return;
      }
      if (key === "]") {
        e.preventDefault();
        cycleFocus();
        return;
      }
      if (key === "a") {
        e.preventDefault();
        openApp("finder");
        return;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeId, closeApp, minimizeApp, hideAll, cycleFocus, openApp, onSpotlight]);
}

/** Shown in the cheatsheet — ⌥⇧ is Alt+Shift on Linux/Windows. */
export const SHORTCUTS_CHEATSHEET: { combo: string; key: string }[] = [
  { combo: "⌥ ⇧ K", key: "shortcuts.spotlight" },
  { combo: "⌥ ⇧ W", key: "shortcuts.close" },
  { combo: "⌥ ⇧ M", key: "shortcuts.minimize" },
  { combo: "⌥ ⇧ H", key: "shortcuts.hideAll" },
  { combo: "⌥ ⇧ ]", key: "shortcuts.cycle" },
  { combo: "⌥ ⇧ A", key: "shortcuts.aboutMe" },
];
