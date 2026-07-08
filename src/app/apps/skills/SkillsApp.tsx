import { motion, type Variants } from "motion/react";
import type { CSSProperties } from "react";
import { useT } from "../../os/i18n";
import { TechIcon, getTechBrand, getTechLabel } from "../../lib/icons";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
};

const GROUPS: { key: string; items: string[] }[] = [
  { key: "skills.languages", items: ["python", "typescript", "javascript", "rust", "java", "sql"] },
  { key: "skills.frontend", items: ["react", "nextjs", "vue", "nuxt", "tailwind", "vite", "motion"] },
  { key: "skills.backend", items: ["nodejs", "express", "fastapi", "django", "restapi", "jwt"] },
  { key: "skills.databases", items: ["postgresql", "mariadb", "mongodb", "redis"] },
  { key: "skills.aiml", items: ["pytorch", "tensorflow", "scikitlearn", "onnx", "llm", "rag", "vercelai"] },
  {
    key: "skills.devops",
    items: [
      "git",
      "cicd",
      "docker",
      "sentry",
      "vercel",
      "cloudflare",
      "render",
      "bash",
      "wsl",
      "linux",
      "cursor",
      "claudecode",
      "codex",
      "opencode",
    ],
  },
  { key: "skills.testing", items: ["vitest", "pytest", "playwright", "eslint", "prettier"] },
  { key: "skills.extras", items: ["cachyos", "neovim", "zsh"] },
];

function SkillTile({ name, variants }: { name: string; variants?: Variants }) {
  const brand = getTechBrand(name);
  const label = getTechLabel(name);
  return (
    <motion.div
      variants={variants}
      style={{ ["--glow" as string]: brand } as CSSProperties}
      className="flex flex-col items-center gap-1.5 w-[74px] py-2.5 px-1 rounded-xl cursor-default transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_var(--glow)] hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
    >
      <div className="size-9 flex items-center justify-center">
        <TechIcon name={name} className="size-8" />
      </div>
      <span className="text-[11px] text-center leading-tight text-[color:var(--macos-text-secondary)]">{label}</span>
    </motion.div>
  );
}

export function SkillsApp() {
  const { t } = useT();
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      className="h-full overflow-auto macos-scroll p-6 text-[color:var(--macos-text-primary)]"
      variants={containerVariants}
      initial={reduced ? false : "hidden"}
      animate="visible"
    >
      <motion.h1
        style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.3 }}
        className="mb-5"
        variants={sectionVariants}
      >
        {t("app.skills")}
      </motion.h1>
      <div className="flex flex-col gap-6">
        {GROUPS.map((g) => (
          <motion.section key={g.key} variants={sectionVariants}>
            <div className="text-[11px] uppercase tracking-wider text-[color:var(--macos-text-muted)] mb-2 px-1">
              {t(g.key)}
            </div>
            <div className="flex flex-wrap gap-1">
              {g.items.map((s) => (
                <SkillTile key={s} name={s} variants={tileVariants} />
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </motion.div>
  );
}
