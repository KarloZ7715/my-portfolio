import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { useOS } from "../../os/OSContext";
import { useT } from "../../os/i18n";
import { useTheme } from "../../os/ThemeContext";
import { WALLPAPER_TOKENS } from "../../os/wallpaper-tokens";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring" as const, stiffness: 420, damping: 24 };

type AnnoProps = {
  children: ReactNode;
  delay?: number;
};

function useDraw(delay = 0) {
  const reduced = usePrefersReducedMotion();
  if (reduced) {
    return { initial: { pathLength: 1, opacity: 1 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 0 } };
  }
  return {
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, margin: "-8% 0px -8% 0px" },
    transition: { duration: 0.8, delay, ease: EASE },
  };
}

function useFade(delay = 0) {
  const reduced = usePrefersReducedMotion();
  if (reduced) {
    return { initial: { opacity: 1, scale: 1 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0 } };
  }
  return {
    initial: { opacity: 0, scale: 0.94 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: "-8% 0px -8% 0px" },
    transition: { duration: 0.45, delay, ease: EASE },
  };
}

function useHoverLift() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return undefined;
  return { y: -2, scale: 1.02 };
}

export function BioRole({ children }: AnnoProps) {
  const { wallpaper, resolved } = useTheme();
  const reduced = usePrefersReducedMotion();
  const gradient = WALLPAPER_TOKENS[wallpaper].textGradient[resolved];
  const key = `${wallpaper}-${resolved}`;

  return (
    <span className="bio-role">
      <span className="bio-role-spacer" aria-hidden>
        {children}
      </span>
      {reduced ? (
        <span className="bio-role-overlay" style={{ backgroundImage: gradient }}>
          {children}
        </span>
      ) : (
        <AnimatePresence mode="sync" initial={false}>
          <motion.span
            key={key}
            className="bio-role-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            style={{ backgroundImage: gradient }}
          >
            {children}
          </motion.span>
        </AnimatePresence>
      )}
    </span>
  );
}

const LANG_STYLES = {
  ts: { color: "#3178c6", tilt: "-1.4deg" },
  py: { color: "#3776ab", tilt: "1.1deg" },
  rust: { color: "#a65d2e", tilt: "-0.6deg" },
  java: { color: "#e76f00", tilt: "1.3deg" },
} as const;

export function BioLang({ children, lang, delay = 0 }: AnnoProps & { lang: keyof typeof LANG_STYLES }) {
  const { color, tilt } = LANG_STYLES[lang];
  const fade = useFade(delay);
  const hover = useHoverLift();
  return (
    <motion.span
      className="bio-lang"
      style={{ "--lang": color, "--lang-tilt": tilt } as CSSProperties}
      {...fade}
      whileHover={hover ? { ...hover, rotate: 0 } : undefined}
      transition={SPRING}
    >
      <span className="bio-lang__dot" aria-hidden />
      {children}
    </motion.span>
  );
}

export function BioCode({ children, delay = 0 }: AnnoProps) {
  const fade = useFade(delay);
  const reduced = usePrefersReducedMotion();
  const { openApp } = useOS();
  const { lang } = useT();

  return (
    <motion.button
      type="button"
      className="bio-code"
      onClick={() => openApp("projects")}
      aria-label={lang === "es" ? "Abrir Proyectos" : "Open Projects"}
      {...fade}
      whileHover={reduced ? undefined : { scale: 1.02 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={SPRING}
    >
      <span className="bio-code__text">{children}</span>
    </motion.button>
  );
}

export function BioPunchline({ children, delay = 0 }: AnnoProps) {
  const draw = useDraw(delay);
  const reduced = usePrefersReducedMotion();
  return (
    <motion.span
      className="bio-punchline"
      whileHover={reduced ? undefined : { scale: 1.02 }}
      transition={SPRING}
    >
      {children}
      <svg className="bio-punchline__ring" viewBox="0 0 80 32" preserveAspectRatio="none" aria-hidden>
        <motion.path
          className="bio-punchline__path"
          d="M6,18 C4,8 18,2 34,4 C52,2 72,10 74,20 C76,28 58,30 40,28 C22,30 8,26 6,18 Z"
          fill="none"
          stroke="var(--wallpaper-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity={0.85}
          {...draw}
        />
      </svg>
    </motion.span>
  );
}
