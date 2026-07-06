import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { SHORTCUTS_CHEATSHEET } from "../os/useShortcuts";
import { useT } from "../os/i18n";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShortcutsCheatsheet({ open, onOpenChange }: Props) {
  const { t } = useT();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("shortcuts.cheatsheetTitle")}</DialogTitle>
          <p className="text-xs text-muted-foreground">{t("shortcuts.cheatsheetHint")}</p>
        </DialogHeader>
        <div className="flex flex-col gap-1">
          {SHORTCUTS_CHEATSHEET.map((s) => (
            <div key={s.key} className="flex items-center justify-between py-1.5 border-b border-border/60 last:border-0">
              <span className="text-sm text-foreground/80">{t(s.key)}</span>
              <kbd className="text-xs font-mono px-2 py-1 rounded bg-muted text-muted-foreground tabular-nums">
                {s.combo}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
