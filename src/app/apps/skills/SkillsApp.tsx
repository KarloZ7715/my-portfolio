import type { CSSProperties } from "react";
import { useT } from "../../os/i18n";
import { TechIcon, getTechBrand, getTechLabel } from "../../lib/icons";

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

function SkillTile({ name }: { name: string }) {
  const brand = getTechBrand(name);
  const label = getTechLabel(name);
  return (
    <div
      style={{ ["--glow" as string]: brand } as CSSProperties}
      className="flex flex-col items-center gap-1.5 w-[74px] py-2.5 px-1 rounded-xl cursor-default transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_var(--glow)] hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
    >
      <div className="size-9 flex items-center justify-center">
        <TechIcon name={name} className="size-8" />
      </div>
      <span className="text-[11px] text-center leading-tight text-[color:var(--macos-text-secondary)]">{label}</span>
    </div>
  );
}

export function SkillsApp() {
  const { t } = useT();
  return (
    <div className="h-full overflow-auto macos-scroll p-6 text-[color:var(--macos-text-primary)]">
      <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.3 }} className="mb-5">
        {t("app.skills")}
      </h1>
      <div className="flex flex-col gap-6">
        {GROUPS.map((g) => (
          <section key={g.key}>
            <div className="text-[11px] uppercase tracking-wider text-[color:var(--macos-text-muted)] mb-2 px-1">
              {t(g.key)}
            </div>
            <div className="flex flex-wrap gap-1">
              {g.items.map((s) => (
                <SkillTile key={s} name={s} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
