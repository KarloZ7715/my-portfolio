import { useState } from "react";
import { Wifi, Search, BatteryFull } from "lucide-react";
import { BrandMark, ControlCenterGlyph } from "../lib/icons";
import { useOS } from "../os/OSContext";
import { getApp } from "../os/apps.registry";
import { useT } from "../os/i18n";
import { MenuBarClock } from "../components/MenuBarClock";
import { LangToggle } from "../components/LangToggle";
import { ThemeToggle } from "../components/ThemeToggle";
import { WallpaperMenu } from "../components/WallpaperMenu";
import { ShortcutsCheatsheet } from "../components/ShortcutsCheatsheet";

interface Props {
  onOpenAboutMachine: () => void;
  onOpenSpotlight: () => void;
  onOpenControlCenter: () => void;
}

export function MenuBar({ onOpenAboutMachine, onOpenSpotlight, onOpenControlCenter }: Props) {
  const { activeId } = useOS();
  const { t, lang } = useT();
  const [helpOpen, setHelpOpen] = useState(false);
  const active = activeId ? getApp(activeId) : null;
  const title = active ? t(active.titleKey) : t("aboutMachine.title");

  const menus = [
    { key: "menubar.file", onClick: undefined },
    { key: "menubar.edit", onClick: undefined },
    { key: "menubar.view", onClick: undefined },
    { key: "menubar.window", onClick: undefined },
    { key: "menubar.help", onClick: () => setHelpOpen(true) },
  ];

  return (
    <div
      className="fixed top-0 inset-x-0 h-7 z-[9999] flex items-center px-3 gap-4 text-white/95"
      style={{
        background: "var(--macos-menubar-bg)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "0.5px solid rgba(255,255,255,0.08)",
      }}
    >
      <button
        className="flex items-center h-6 px-1.5 rounded hover:bg-white/15 transition-colors"
        aria-label={t("menubar.about")}
        onClick={onOpenAboutMachine}
      >
        <BrandMark className="size-[15px]" />
      </button>
      <span className="text-[13px] font-semibold hidden sm:inline">{title}</span>
      <nav className="hidden sm:flex items-center gap-0.5">
        {menus.map((m) => (
          <button
            key={m.key}
            onClick={m.onClick}
            className="h-6 px-2 rounded text-[13px] hover:bg-white/15 transition-colors"
          >
            {t(m.key)}
          </button>
        ))}
      </nav>
      <div className="flex-1" />
      <WallpaperMenu />
      <ThemeToggle />
      <LangToggle />
      <button className="p-1 rounded hover:bg-white/15 transition-colors hidden sm:inline-flex" aria-label="Wifi">
        <Wifi className="size-[14px]" />
      </button>
      <button className="p-1 rounded hover:bg-white/15 transition-colors hidden sm:inline-flex" aria-label="Battery">
        <BatteryFull className="size-[14px]" />
      </button>
      <button
        className="p-1 rounded hover:bg-white/15 transition-colors"
        aria-label={t("spotlight.title")}
        onClick={onOpenSpotlight}
      >
        <Search className="size-[14px]" />
      </button>
      <button
        onClick={onOpenControlCenter}
        className="p-1 rounded hover:bg-white/15 transition-colors"
        aria-label={t("controlCenter.title")}
      >
        <ControlCenterGlyph className="size-[14px]" />
      </button>
      <span className="px-1">
        <MenuBarClock lang={lang} />
      </span>

      <ShortcutsCheatsheet open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}
