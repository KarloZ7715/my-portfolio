import { ImageIcon, CheckIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { useTheme, WALLPAPERS, type WallpaperName } from "../os/ThemeContext";
import { useT } from "../os/i18n";

const SWATCH: Record<WallpaperName, string> = {
  aurora: "linear-gradient(135deg, #ff8fbf, #6d5cff, #2a2178)",
  glacier: "linear-gradient(135deg, #8ff5e0, #2f8fc0, #0a1f36)",
  sunset: "linear-gradient(135deg, #ffd27a, #ec5f4f, #241030)",
};

export function WallpaperMenu() {
  const { wallpaper, setWallpaper } = useTheme();
  const { t } = useT();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded hover:bg-white/15 transition-colors" aria-label={t("menubar.wallpaper")}>
          <ImageIcon className="size-[14px]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>{t("menubar.wallpaper")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {WALLPAPERS.map((name) => (
          <DropdownMenuItem
            key={name}
            onClick={() => setWallpaper(name)}
            className="flex items-center gap-2"
          >
            <span className="size-4 rounded-full shrink-0 ring-1 ring-black/10" style={{ background: SWATCH[name] }} />
            <span className="flex-1">{t(`wallpaper.${name}`)}</span>
            {wallpaper === name && <CheckIcon className="size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
