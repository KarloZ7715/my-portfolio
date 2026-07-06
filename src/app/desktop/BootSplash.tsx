import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { BrandMark } from "../lib/icons";
import { useT } from "../os/i18n";

export function BootSplash({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const { t } = useT();
  useEffect(() => {
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 200);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[10010] flex flex-col items-center justify-center bg-black text-white"
    >
      <BrandMark className="size-16 mb-8" />
      <div className="w-56 h-1 rounded-full bg-white/15 overflow-hidden">
        <div className="h-full bg-white/90 transition-[width] duration-100" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="mt-4 text-xs text-white/50 tabular-nums">{t("boot.tagline")}</div>
    </motion.div>
  );
}
