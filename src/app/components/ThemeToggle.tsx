import { Moon, Sun } from "lucide-react";
import { useTheme } from "../os/ThemeContext";

export function ThemeToggle() {
  const { resolved, toggleTheme } = useTheme();
  const isDark = resolved === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-1 rounded hover:bg-white/15 transition-colors"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="size-[14px]" /> : <Moon className="size-[14px]" />}
    </button>
  );
}
