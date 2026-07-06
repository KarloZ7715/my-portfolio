import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useOS } from "../os/OSContext";
import { getApp } from "../os/apps.registry";
import { useShortcuts } from "../os/useShortcuts";
import { useIsMobile } from "../lib/useMediaQuery";
import { DESKTOP_CURSOR } from "../lib/cursor";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { Wallpaper } from "./Wallpaper";
import { DesktopIcons } from "./DesktopIcons";
import { BootSplash } from "./BootSplash";
import { AboutMachine } from "./AboutMachine";
import { Spotlight } from "../spotlight/Spotlight";
import { ControlCenter } from "../notifications/ControlCenter";
import { Window } from "../window/Window";
import type { AppId } from "../os/types";

export function Desktop() {
  const [booting, setBooting] = useState(true);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [aboutMachineOpen, setAboutMachineOpen] = useState(false);
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const { windows, openApp, activeId } = useOS();
  const params = useParams();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (booting) return;
    const id = params.appId as AppId | undefined;
    if (id && getApp(id)) openApp(id);
  }, [booting, params.appId, openApp]);

  const openSpotlight = useCallback(() => setSpotlightOpen(true), []);
  useShortcuts({ onSpotlight: openSpotlight });

  const openWindows = Object.values(windows);
  const visibleWindows = isMobile
    ? openWindows.filter((w) => w.id === activeId && !w.minimized)
    : openWindows;

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{
        fontFamily: "var(--font-sans)",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        cursor: isMobile ? "auto" : DESKTOP_CURSOR,
      }}
    >
      <Wallpaper />
      <MenuBar
        onOpenAboutMachine={() => setAboutMachineOpen(true)}
        onOpenSpotlight={openSpotlight}
        onOpenControlCenter={() => setControlCenterOpen((v) => !v)}
      />
      {!isMobile && <DesktopIcons />}

      <AnimatePresence initial={false}>
        {visibleWindows.map((w) => {
          const app = getApp(w.id);
          if (!app) return null;
          return <Window key={w.id} app={app} state={w} />;
        })}
      </AnimatePresence>

      <Dock />

      <AboutMachine open={aboutMachineOpen} onOpenChange={setAboutMachineOpen} />
      <Spotlight open={spotlightOpen} onOpenChange={setSpotlightOpen} onOpenAboutMachine={() => setAboutMachineOpen(true)} />
      <ControlCenter open={controlCenterOpen} onClose={() => setControlCenterOpen(false)} />

      <AnimatePresence>
        {booting && <BootSplash onDone={() => setBooting(false)} />}
      </AnimatePresence>
    </div>
  );
}
