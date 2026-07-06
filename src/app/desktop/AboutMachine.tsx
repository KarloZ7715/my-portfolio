import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { BrandMark } from "../lib/icons";
import { useOS } from "../os/OSContext";
import { useT } from "../os/i18n";
import { formatUptime } from "../os/bootTime";
import { Fragment, useEffect, useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SPECS: { key: string; value: string }[] = [
  { key: "aboutMachine.cpu", value: "AMD Ryzen 7 5700G" },
  { key: "aboutMachine.gpu", value: "AMD Radeon RX 6600" },
  { key: "aboutMachine.memory", value: "32 GB RAM" },
  { key: "aboutMachine.storage", value: "2 TB SSD" },
  { key: "aboutMachine.network", value: "1 Gbps" },
  { key: "aboutMachine.os", value: "CachyOS Linux" },
  { key: "aboutMachine.location", value: "Montería, Colombia" },
  { key: "aboutMachine.editor", value: "Neovim + Cursor" },
  { key: "aboutMachine.shell", value: "zsh" },
];

export function AboutMachine({ open, onOpenChange }: Props) {
  const { t } = useT();
  const { openApp } = useOS();
  const [uptime, setUptime] = useState(() => formatUptime());

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setUptime(formatUptime()), 1000);
    return () => clearInterval(id);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{t("aboutMachine.title")}</DialogTitle>
          <DialogDescription>{t("aboutMachine.subtitle")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-2 pt-8 pb-5 px-6 bg-[color:var(--macos-sidebar-bg)]">
          <BrandMark className="size-16" />
          <div className="text-[17px] font-semibold mt-1">{t("aboutMachine.title")}</div>
          <div className="text-[12px] text-[color:var(--macos-text-muted)]">{t("aboutMachine.subtitle")}</div>
        </div>

        <div className="px-6 py-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[13px]">
          {SPECS.map((s) => (
            <Fragment key={s.key}>
              <span className="text-[color:var(--macos-text-muted)] text-right">{t(s.key)}</span>
              <span className="text-[color:var(--macos-text-primary)] font-medium">{s.value}</span>
            </Fragment>
          ))}
          <span className="text-[color:var(--macos-text-muted)] text-right">{t("aboutMachine.uptime")}</span>
          <span className="text-[color:var(--macos-text-primary)] font-medium tabular-nums">{uptime}</span>
        </div>

        <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-[color:var(--macos-hairline)]">
          <button
            onClick={() => {
              openApp("terminal");
              onOpenChange(false);
            }}
            className="px-3 h-8 rounded-md text-[12px] bg-black/5 dark:bg-white/8 hover:brightness-95 dark:hover:brightness-110 active:scale-[0.96] transition-transform border border-[color:var(--macos-hairline)]"
          >
            {t("aboutMachine.systemReport")}
          </button>
          <a
            href="https://github.com/KarloZ7715"
            target="_blank"
            rel="noreferrer"
            className="px-3 h-8 inline-flex items-center rounded-md text-[12px] bg-[color:var(--macos-accent)] text-white active:scale-[0.96] transition-transform"
          >
            {t("aboutMachine.softwareUpdate")}
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
