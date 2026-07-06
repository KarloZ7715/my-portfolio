import { useEffect, useState } from "react";
import type { Lang } from "../os/types";

export function MenuBarClock({ lang }: { lang: Lang }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);
  const locale = lang === "es" ? "es-ES" : "en-US";
  const day = now.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });
  const time = now.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
  return (
    <span className="tabular-nums text-[13px]">
      {day} {time}
    </span>
  );
}
