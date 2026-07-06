import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { useIsMobile } from "../lib/useMediaQuery";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import { APPS } from "../os/apps.registry";
import { useOS } from "../os/OSContext";
import { useT } from "../os/i18n";
import { useTheme, WALLPAPERS } from "../os/ThemeContext";
import { PROJECTS } from "../apps/projects/projects.data";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenAboutMachine: () => void;
}

export function Spotlight({ open, onOpenChange, onOpenAboutMachine }: Props) {
  const { t, lang, setLang } = useT();
  const { openApp, selectProject } = useOS();
  const { toggleTheme, setWallpaper } = useTheme();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onOpenChange]);

  const run = (fn: () => void) => {
    fn();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader className="sr-only">
        <DialogTitle>{t("spotlight.title")}</DialogTitle>
        <DialogDescription>{t("spotlight.placeholder")}</DialogDescription>
      </DialogHeader>
      <DialogContent
        showCloseButton={false}
        className={
          isMobile
            ? "top-[10%] translate-y-0 w-[90vw] max-w-[90vw] p-0 overflow-hidden border-0 bg-transparent shadow-none"
            : "top-[18%] translate-y-0 max-w-xl p-0 overflow-hidden border-0 bg-transparent shadow-none sm:max-w-xl"
        }
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "var(--macos-window-bg)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            boxShadow: "0 0 0 0.5px rgba(0,0,0,0.2), 0 30px 60px -12px rgba(0,0,0,0.5)",
          }}
        >
          <Command className="bg-transparent" shouldFilter>
            <CommandInput placeholder={t("spotlight.placeholder")} className="text-[15px] h-14" />
            <CommandList className="max-h-[360px] p-2">
              <CommandEmpty className="py-8 text-sm text-[color:var(--macos-text-muted)]">
                {t("spotlight.empty")}
              </CommandEmpty>

              <CommandGroup heading={t("spotlight.apps")}>
                {APPS.map((app) => (
                  <CommandItem
                    key={app.id}
                    value={`${t(app.titleKey)} ${app.id}`}
                    onSelect={() => run(() => openApp(app.id))}
                    className="gap-2.5"
                  >
                    <span className="size-5 shrink-0">{app.icon}</span>
                    {t(app.titleKey)}
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandGroup heading={t("spotlight.commands")}>
                <CommandItem value="toggle theme cambiar tema" onSelect={() => run(toggleTheme)}>
                  {t("spotlight.cmdToggleTheme")}
                </CommandItem>
                <CommandItem
                  value="toggle language cambiar idioma"
                  onSelect={() => run(() => setLang(lang === "es" ? "en" : "es"))}
                >
                  {t("spotlight.cmdToggleLang")}
                </CommandItem>
                <CommandItem value="about karlorzos acerca de" onSelect={() => run(onOpenAboutMachine)}>
                  {t("spotlight.cmdAboutMachine")}
                </CommandItem>
                {WALLPAPERS.map((name) => (
                  <CommandItem
                    key={name}
                    value={`wallpaper fondo ${name} ${t(`wallpaper.${name}`)}`}
                    onSelect={() => run(() => setWallpaper(name))}
                  >
                    {t(`spotlight.cmdWallpaper${name[0].toUpperCase()}${name.slice(1)}`)}
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandGroup heading={t("spotlight.projects")}>
                {PROJECTS.map((p) => (
                  <CommandItem
                    key={p.slug}
                    value={`${p.name} ${p.stack.join(" ")}`}
                    onSelect={() =>
                      run(() => {
                        selectProject(p.slug);
                        openApp("projects");
                      })
                    }
                  >
                    {p.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  );
}
