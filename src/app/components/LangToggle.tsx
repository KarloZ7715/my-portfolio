import { Languages } from "lucide-react";
import { useT } from "../os/i18n";

export function LangToggle() {
  const { lang, setLang, t } = useT();
  return (
    <button
      onClick={() => setLang(lang === "es" ? "en" : "es")}
      className="flex items-center gap-1 px-2 h-6 rounded-md hover:bg-white/25 active:scale-[0.96] transition-[background-color,transform]"
      aria-label={t("spotlight.cmdToggleLang")}
    >
      <Languages className="size-[13px]" />
      <span className="text-[12px] uppercase tabular-nums">{lang}</span>
    </button>
  );
}
