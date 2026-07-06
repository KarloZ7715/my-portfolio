import { useMotionValue } from "motion/react";
import { useOS, APPS } from "../os/OSContext";
import { useT } from "../os/i18n";
import { DockIcon } from "../components/DockIcon";

export function Dock() {
  const { openApp, focusApp, windows, activeId } = useOS();
  const { t } = useT();
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[9998]"
      onPointerMove={(e) => mouseX.set(e.clientX)}
      onPointerLeave={() => mouseX.set(Infinity)}
    >
      <div
        className="flex items-end gap-2 px-3 py-2 rounded-2xl"
        style={{
          background: "var(--macos-dock-bg)",
          backdropFilter: "blur(30px) saturate(180%)",
          WebkitBackdropFilter: "blur(30px) saturate(180%)",
          boxShadow: "0 0 0 0.5px rgba(255,255,255,0.25) inset, 0 0 0 0.5px rgba(0,0,0,0.35), 0 20px 40px -12px rgba(0,0,0,0.5)",
        }}
      >
        {APPS.map((app) => {
          const state = windows[app.id];
          const isOpen = Boolean(state);
          return (
            <DockIcon
              key={app.id}
              id={app.id}
              mouseX={mouseX}
              label={t(app.titleKey)}
              isOpen={isOpen}
              isActive={activeId === app.id}
              onClick={() => (state && !state.minimized ? focusApp(app.id) : openApp(app.id))}
            >
              {app.icon}
            </DockIcon>
          );
        })}
      </div>
    </div>
  );
}
