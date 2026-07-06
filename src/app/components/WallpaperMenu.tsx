import { ImageIcon, CheckIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { useTheme, WALLPAPERS } from "../os/ThemeContext";
import { WALLPAPER_TOKENS } from "../os/wallpaper-tokens";
import { useT } from "../os/i18n";

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
            <span className="size-4 rounded-full shrink-0 ring-1 ring-black/10" style={{ background: WALLPAPER_TOKENS[name].swatch }} />
            <span className="flex-1">{t(`wallpaper.${name}`)}</span>
            {wallpaper === name && <CheckIcon className="size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
