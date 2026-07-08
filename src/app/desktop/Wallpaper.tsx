import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useTheme, type WallpaperName } from "../os/ThemeContext";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

const WALLPAPER_TRANSITION = {
  duration: 1,
  ease: [0.22, 0.61, 0.36, 1],
};

const GRADIENTS: Record<WallpaperName, { light: string; dark: string; overlay: string }> = {
  aurora: {
    light:
      "radial-gradient(120% 90% at 20% 10%, #ff8fbf 0%, #b06cff 28%, #6d5cff 55%, #2a2178 82%, #0e0a3a 100%)",
    dark: "radial-gradient(120% 90% at 20% 10%, #7a3d67 0%, #5a3a8f 28%, #3a3480 55%, #1a1650 82%, #08061f 100%)",
    overlay:
      "radial-gradient(70% 60% at 80% 90%, rgba(255,220,120,0.55), transparent 60%), radial-gradient(50% 40% at 10% 80%, rgba(70,220,255,0.4), transparent 60%)",
  },
  glacier: {
    light:
      "radial-gradient(120% 90% at 25% 10%, #8ff5e0 0%, #4fd0d8 28%, #2f8fc0 55%, #1c4f7a 82%, #0a1f36 100%)",
    dark: "radial-gradient(120% 90% at 25% 10%, #2c6b64 0%, #235a68 28%, #1c3f5c 55%, #12283f 82%, #050e18 100%)",
    overlay:
      "radial-gradient(70% 60% at 80% 90%, rgba(160,255,230,0.4), transparent 60%), radial-gradient(50% 40% at 10% 80%, rgba(90,180,255,0.35), transparent 60%)",
  },
  sunset: {
    light:
      "radial-gradient(120% 90% at 25% 10%, #ffd27a 0%, #ff9a56 28%, #ec5f4f 55%, #7a2e4f 82%, #241030 100%)",
    dark: "radial-gradient(120% 90% at 25% 10%, #7a5327 0%, #7a4530 28%, #6b2f30 55%, #3a1a2e 82%, #0f0812 100%)",
    overlay:
      "radial-gradient(70% 60% at 80% 90%, rgba(255,200,140,0.5), transparent 60%), radial-gradient(50% 40% at 10% 80%, rgba(255,120,150,0.35), transparent 60%)",
  },
};

const NOISE_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence baseFrequency='0.9' /></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>\")";

export function Wallpaper() {
  const { wallpaper, resolved } = useTheme();
  const reduceMotion = usePrefersReducedMotion();
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        const el = parallaxRef.current;
        if (el) el.style.transform = `translate3d(${nx * 14}px, ${ny * 14}px, 0) scale(1.03)`;
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  const g = GRADIENTS[wallpaper];

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div ref={parallaxRef} className="absolute -inset-4">
        {reduceMotion ? (
          <div className="absolute inset-0">
            <div className="absolute inset-0" style={{ background: resolved === "dark" ? g.dark : g.light }} />
            <div className="absolute inset-0 mix-blend-overlay opacity-60" style={{ background: g.overlay }} />
          </div>
        ) : (
          <AnimatePresence initial={false}>
            <motion.div
              key={wallpaper}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={WALLPAPER_TRANSITION}
            >
              <div className="absolute inset-0" style={{ background: resolved === "dark" ? g.dark : g.light }} />
              <div className="absolute inset-0 mix-blend-overlay opacity-60" style={{ background: g.overlay }} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: NOISE_SVG }} />
    </div>
  );
}
