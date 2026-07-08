import { Github, ExternalLink } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, type Variants } from "motion/react";
import { useRef, useState, type PointerEvent } from "react";
import { useT } from "../../os/i18n";
import { useOS } from "../../os/OSContext";
import { PROJECTS, type Project } from "./projects.data";
import { TechIcon, getTechLabel } from "../../lib/icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../components/ui/tooltip";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

const panelVariants: Variants = {
  hidden: { opacity: 0, x: 12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

function ProjectBanner({ project, className }: { project: Project; className?: string }) {
  const aspect = 16 / 9;

  if (project.bannerLogo) {
    return (
      <div
        className={`@container relative overflow-hidden flex items-center justify-center ${className ?? ""}`}
        style={{ aspectRatio: aspect, background: project.bannerBg ?? "#000" }}
      >
        <img
          src={project.bannerLogo}
          alt=""
          draggable={false}
          className={`object-contain drop-shadow-lg ${project.bannerLogoClass ?? "max-h-[58%] max-w-[72%]"}`}
        />
      </div>
    );
  }

  if (project.banner) {
    return (
      <div className={`relative overflow-hidden ${className ?? ""}`} style={{ aspectRatio: aspect }}>
        <img
          src={project.banner}
          alt=""
          draggable={false}
          className="absolute inset-0 size-full object-cover"
          style={{ objectPosition: project.bannerObjectPosition ?? "center" }}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center ${className ?? ""}`}
      style={{ aspectRatio: aspect, background: project.accent }}
    >
      {project.logo ? (
        <img src={project.logo} alt="" className="max-h-[56%] max-w-[72%] object-contain drop-shadow-lg" draggable={false} />
      ) : null}
    </div>
  );
}

function ProjectLogoPanel({ project, className }: { project: Project; className?: string }) {
  const background = project.logoBg ?? project.accent;

  return (
    <div
      className={`@container relative w-full overflow-hidden rounded-lg flex items-center justify-center ${className ?? ""}`}
      style={{ aspectRatio: 4 / 3, background }}
    >
      {project.logo ? (
        <img
          src={project.logo}
          alt=""
          draggable={false}
          className={`max-h-[52cqw] max-w-[90cqw] object-contain drop-shadow-lg ${project.logoClass ?? ""}`}
        />
      ) : null}
    </div>
  );
}

function ProjectCard({
  project,
  active,
  onClick,
  variants,
}: {
  project: Project;
  active: boolean;
  onClick: () => void;
  variants?: Variants;
}) {
  const { lang } = useT();
  const ref = useRef<HTMLButtonElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 300, damping: 22 });
  const rotateY = useSpring(ry, { stiffness: 300, damping: 22 });

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (reduceMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 10);
    rx.set(-py * 10);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={onClick}
      variants={variants}
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="text-left rounded-xl overflow-hidden bg-[color:var(--macos-window-bg)] border border-[color:var(--macos-hairline)]"
      style={{
        rotateX,
        rotateY,
        transformPerspective: 700,
        boxShadow: active
          ? "0 0 0 2px var(--macos-accent), 0 12px 28px -10px rgba(0,0,0,0.3)"
          : "0 2px 6px -3px rgba(0,0,0,0.1)",
      }}
    >
      <ProjectBanner project={project} className="w-full" />
      <div className="p-3">
        <div className="text-[13px] font-medium">{project.name}</div>
        <div className="text-[12px] text-[color:var(--macos-text-muted)] line-clamp-2 mt-0.5">{project.tagline[lang]}</div>
      </div>
    </motion.button>
  );
}

export function ProjectsApp() {
  const { t, lang } = useT();
  const { selectedProjectSlug, selectProject } = useOS();
  const [localSelected, setLocalSelected] = useState(PROJECTS[0].slug);
  const activeSlug = selectedProjectSlug ?? localSelected;
  const selected = PROJECTS.find((p) => p.slug === activeSlug) ?? PROJECTS[0];
  const reduced = usePrefersReducedMotion();

  const pick = (slug: string) => {
    setLocalSelected(slug);
    selectProject(slug);
  };

  return (
    <div className="flex h-full text-[color:var(--macos-text-primary)]">
      <motion.div
        className="flex-1 overflow-auto macos-scroll p-6"
        variants={containerVariants}
        initial={reduced ? false : "hidden"}
        animate="visible"
      >
        <motion.div className="mb-4" variants={itemVariants}>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.3 }}>{t("app.projects")}</h1>
          <p className="text-[color:var(--macos-text-muted)] text-[13px]">{t("projects.subtitle")}</p>
        </motion.div>
        <div className="grid grid-cols-2 gap-3" style={{ perspective: 800 }}>
          {PROJECTS.map((p) => (
            <ProjectCard key={p.slug} project={p} active={p.slug === selected.slug} onClick={() => pick(p.slug)} variants={itemVariants} />
          ))}
        </div>
      </motion.div>

      <motion.aside
        className="w-80 shrink-0 h-full overflow-auto macos-scroll p-5 bg-[color:var(--macos-sidebar-bg)] border-l border-[color:var(--macos-hairline)]"
        variants={panelVariants}
        initial={reduced ? false : "hidden"}
        animate="visible"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.slug}
            initial={reduced ? false : { opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? undefined : { opacity: 0, x: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProjectLogoPanel project={selected} className="mb-4" />
            <div style={{ fontSize: 17, fontWeight: 600 }}>{selected.name}</div>
            <div className="text-[12px] text-[color:var(--macos-text-muted)] mt-0.5">{selected.tagline[lang]}</div>

            <div className="flex flex-col gap-2.5 mt-3">
              {selected.description[lang].split("\n\n").map((p, i) => (
                <p key={i} className="text-[13px] text-[color:var(--macos-text-secondary)] leading-relaxed" style={{ textWrap: "pretty" as const }}>
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-4 mb-1.5 text-[11px] uppercase tracking-wider text-[color:var(--macos-text-muted)]">{t("projects.stack")}</div>
            <div className="flex flex-wrap gap-2">
              {selected.stack.map((s) => (
                <Tooltip key={s}>
                  <TooltipTrigger asChild>
                    <div className="size-9 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/8 border border-[color:var(--macos-hairline)] hover:-translate-y-0.5 transition-transform">
                      <TechIcon name={s} className="size-5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{getTechLabel(s)}</TooltipContent>
                </Tooltip>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-2">
              {selected.github && (
                <a
                  href={selected.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 h-8 rounded-md bg-neutral-900 text-white text-[13px] active:scale-[0.96] transition-transform"
                >
                  <Github className="size-[14px]" /> {t("projects.viewCode")}
                </a>
              )}
              {selected.live && (
                <a
                  href={selected.live}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 h-8 rounded-md bg-[color:var(--macos-accent)] text-white text-[13px] active:scale-[0.96] transition-transform"
                >
                  <ExternalLink className="size-[14px]" /> {t("projects.viewLive")}
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.aside>
    </div>
  );
}
