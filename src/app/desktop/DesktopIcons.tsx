import { useOS, APPS } from "../os/OSContext";
import { useT } from "../os/i18n";

export function DesktopIcons() {
  const { openApp } = useOS();
  const { t } = useT();
  return (
    <div className="absolute top-10 right-4 flex flex-col gap-4 z-10">
      {APPS.map((app) => (
        <button
          key={app.id}
          onDoubleClick={() => openApp(app.id)}
          onClick={(e) => e.detail === 1 && e.currentTarget.focus()}
          className="group flex flex-col items-center gap-1 w-20 p-1.5 rounded-md focus:bg-white/15 focus:ring-1 focus:ring-white/40 focus:outline-none transition-colors active:scale-[0.96] transition-transform"
        >
          <div className="size-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">{app.icon}</div>
          <span
            className="text-[11px] text-white text-center leading-tight"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
          >
            {t(app.titleKey)}
          </span>
        </button>
      ))}
    </div>
  );
}
