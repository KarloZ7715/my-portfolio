import { forwardRef, type CSSProperties, type ReactNode, type SVGProps } from "react";
import kzLogoSvg from "../assets/karlorzos-logo.svg?raw";
import controlCenterSvg from "../assets/menu-icons/switch.2.svg?raw";
import javaSvg from "../assets/tech-icons/java.svg?raw";
import motionSvg from "../assets/tech-icons/motion.svg?raw";
import openaiSvg from "../assets/tech-icons/openai.svg?raw";
import opencodeSvg from "../assets/tech-icons/opencode.svg?raw";
import playwrightSvg from "../assets/tech-icons/playwright.svg?raw";
import cachyosSvg from "../assets/tech-icons/cachyos.svg?raw";
import SiTypescript, { defaultColor as typescriptHex } from "@icons-pack/react-simple-icons/icons/SiTypescript";
import SiJavascript, { defaultColor as javascriptHex } from "@icons-pack/react-simple-icons/icons/SiJavascript";
import SiPython, { defaultColor as pythonHex } from "@icons-pack/react-simple-icons/icons/SiPython";
import SiRust, { defaultColor as rustHex } from "@icons-pack/react-simple-icons/icons/SiRust";
import SiReact, { defaultColor as reactHex } from "@icons-pack/react-simple-icons/icons/SiReact";
import SiNextdotjs, { defaultColor as nextHex } from "@icons-pack/react-simple-icons/icons/SiNextdotjs";
import SiVuedotjs, { defaultColor as vueHex } from "@icons-pack/react-simple-icons/icons/SiVuedotjs";
import SiNuxt, { defaultColor as nuxtHex } from "@icons-pack/react-simple-icons/icons/SiNuxt";
import SiTailwindcss, { defaultColor as tailwindHex } from "@icons-pack/react-simple-icons/icons/SiTailwindcss";
import SiVite, { defaultColor as viteHex } from "@icons-pack/react-simple-icons/icons/SiVite";
import SiNodedotjs, { defaultColor as nodeHex } from "@icons-pack/react-simple-icons/icons/SiNodedotjs";
import SiExpress, { defaultColor as expressHex } from "@icons-pack/react-simple-icons/icons/SiExpress";
import SiFastapi, { defaultColor as fastapiHex } from "@icons-pack/react-simple-icons/icons/SiFastapi";
import SiDjango, { defaultColor as djangoHex } from "@icons-pack/react-simple-icons/icons/SiDjango";
import SiJsonwebtokens, { defaultColor as jwtHex } from "@icons-pack/react-simple-icons/icons/SiJsonwebtokens";
import SiPostgresql, { defaultColor as postgresqlHex } from "@icons-pack/react-simple-icons/icons/SiPostgresql";
import SiMariadb, { defaultColor as mariadbHex } from "@icons-pack/react-simple-icons/icons/SiMariadb";
import SiMongodb, { defaultColor as mongodbHex } from "@icons-pack/react-simple-icons/icons/SiMongodb";
import SiRedis, { defaultColor as redisHex } from "@icons-pack/react-simple-icons/icons/SiRedis";
import SiPytorch, { defaultColor as pytorchHex } from "@icons-pack/react-simple-icons/icons/SiPytorch";
import SiTensorflow, { defaultColor as tensorflowHex } from "@icons-pack/react-simple-icons/icons/SiTensorflow";
import SiScikitlearn, { defaultColor as scikitHex } from "@icons-pack/react-simple-icons/icons/SiScikitlearn";
import SiOnnx, { defaultColor as onnxHex } from "@icons-pack/react-simple-icons/icons/SiOnnx";
import SiDocker, { defaultColor as dockerHex } from "@icons-pack/react-simple-icons/icons/SiDocker";
import SiSentry, { defaultColor as sentryHex } from "@icons-pack/react-simple-icons/icons/SiSentry";
import SiVercel, { defaultColor as vercelHex } from "@icons-pack/react-simple-icons/icons/SiVercel";
import SiCloudflare, { defaultColor as cloudflareHex } from "@icons-pack/react-simple-icons/icons/SiCloudflare";
import SiRender, { defaultColor as renderHex } from "@icons-pack/react-simple-icons/icons/SiRender";
import SiGit, { defaultColor as gitHex } from "@icons-pack/react-simple-icons/icons/SiGit";
import SiGithub, { defaultColor as githubHex } from "@icons-pack/react-simple-icons/icons/SiGithub";
import SiLinux, { defaultColor as linuxHex } from "@icons-pack/react-simple-icons/icons/SiLinux";
import SiArchlinux, { defaultColor as archHex } from "@icons-pack/react-simple-icons/icons/SiArchlinux";
import SiGnubash, { defaultColor as bashHex } from "@icons-pack/react-simple-icons/icons/SiGnubash";
import SiZsh, { defaultColor as zshHex } from "@icons-pack/react-simple-icons/icons/SiZsh";
import SiNeovim, { defaultColor as neovimHex } from "@icons-pack/react-simple-icons/icons/SiNeovim";
import SiCursor, { defaultColor as cursorHex } from "@icons-pack/react-simple-icons/icons/SiCursor";
import SiClaude, { defaultColor as claudeHex } from "@icons-pack/react-simple-icons/icons/SiClaude";
import SiLaravel, { defaultColor as laravelHex } from "@icons-pack/react-simple-icons/icons/SiLaravel";
import SiPhp, { defaultColor as phpHex } from "@icons-pack/react-simple-icons/icons/SiPhp";
import SiLivewire, { defaultColor as livewireHex } from "@icons-pack/react-simple-icons/icons/SiLivewire";
import SiAlpinedotjs, { defaultColor as alpineHex } from "@icons-pack/react-simple-icons/icons/SiAlpinedotjs";
import SiArduino, { defaultColor as arduinoHex } from "@icons-pack/react-simple-icons/icons/SiArduino";
import SiCplusplus, { defaultColor as cppHex } from "@icons-pack/react-simple-icons/icons/SiCplusplus";
import SiPinia, { defaultColor as piniaHex } from "@icons-pack/react-simple-icons/icons/SiPinia";
import SiShell, { defaultColor as shellHex } from "@icons-pack/react-simple-icons/icons/SiShell";
import SiVitest, { defaultColor as vitestHex } from "@icons-pack/react-simple-icons/icons/SiVitest";
import SiPytest, { defaultColor as pytestHex } from "@icons-pack/react-simple-icons/icons/SiPytest";
import SiEslint, { defaultColor as eslintHex } from "@icons-pack/react-simple-icons/icons/SiEslint";
import SiPrettier, { defaultColor as prettierHex } from "@icons-pack/react-simple-icons/icons/SiPrettier";
import SiHtml5, { defaultColor as htmlHex } from "@icons-pack/react-simple-icons/icons/SiHtml5";
import SiCss, { defaultColor as cssHex } from "@icons-pack/react-simple-icons/icons/SiCss";
import SiBootstrap, { defaultColor as bootstrapHex } from "@icons-pack/react-simple-icons/icons/SiBootstrap";

type IconType = typeof SiReact;

export type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function Svg({ children, viewBox = "0 0 24 24", className, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox={viewBox} fill="currentColor" className={className} aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

function normalizeBrandSvg(raw: string): string {
  return raw
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<title>[\s\S]*?<\/title>/g, "")
    .replace(/\swidth="[^"]*"/, ' width="100%"')
    .replace(/\sheight="[^"]*"/, ' height="100%"');
}

/** KarloZOS system logo — dark KZ mark on a light app-icon tile for contrast in any theme */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[22%] bg-[linear-gradient(180deg,#ffffff_0%,#eef1f6_100%)] text-[#141414] shadow-[0_1px_3px_rgba(0,0,0,0.22),inset_0_0_0_0.5px_rgba(0,0,0,0.1)] ${className ?? "size-4"}`}
      aria-hidden
    >
      <span
        className="size-[68%] [&_svg]:size-full [&_svg]:block"
        dangerouslySetInnerHTML={{ __html: normalizeBrandSvg(kzLogoSvg) }}
      />
    </span>
  );
}

/* ---------------------------------------------------------------------- */
/* Hand-authored fallbacks for brands not present in simple-icons          */
/* ---------------------------------------------------------------------- */

function SqlGlyph(props: IconProps) {
  return (
    <Svg {...props}>
      <ellipse cx="12" cy="6.5" rx="8" ry="3" />
      <path d="M4 6.5v11c0 1.7 3.6 3 8 3s8-1.3 8-3v-11" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.5" />
    </Svg>
  );
}

function LinkedinGlyph(props: IconProps) {
  return (
    <Svg {...props}>
      <rect width="24" height="24" rx="4" fill="currentColor" />
      <path
        fill="#fff"
        d="M6.94 8.5H4.56v9.94h2.38V8.5zM5.75 4.06a1.38 1.38 0 100 2.76 1.38 1.38 0 000-2.76zM19.44 12.9c0-2.86-1.53-4.19-3.57-4.19a3.08 3.08 0 00-2.79 1.54V8.5H10.7c.03.68 0 9.94 0 9.94h2.38v-5.55c0-.3.02-.6.11-.81.24-.6.79-1.23 1.71-1.23 1.2 0 1.68.92 1.68 2.27v5.32h2.38v-5.54z"
      />
    </Svg>
  );
}

function AiChipGlyph(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2 2M17.1 17.1l2 2M19.1 4.9l-2 2M6.9 17.1l-2 2"
      />
      <circle cx="12" cy="12" r="2.2" fill="#fff" />
    </Svg>
  );
}

function RestApiGlyph(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="5" cy="7" r="2.4" />
      <circle cx="19" cy="7" r="2.4" />
      <circle cx="12" cy="17" r="2.4" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        d="M7 8.3L10.3 15M17 8.3L13.7 15M7.4 7h9.2"
      />
    </Svg>
  );
}

function CiCdGlyph(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        d="M4 12a8 8 0 0113.9-5.4M20 12a8 8 0 01-13.9 5.4"
      />
      <path d="M17 3l1.6 3.6L22 8l-3.4 1.4L17 13l-1.6-3.6L12 8l3.4-1.4L17 3z" opacity="0.5" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        d="M18 6.6L20 12M6 17.4L4 12"
      />
    </Svg>
  );
}

function normalizeDownloadedSvg(raw: string): string {
  return raw
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<title>[\s\S]*?<\/title>/g, "")
    .replace(/\swidth="[^"]*"/, ' width="100%"')
    .replace(/\sheight="[^"]*"/, ' height="100%"')
    .replace(/<svg/, '<svg fill="currentColor"');
}

const javaHex = "#ED8B00";
const motionHex = "#FFF312";
const openaiHex = "#000000";
const opencodeHex = "#000000";
const playwrightHex = "#2EAD33";
const cachyosHex = "#00AA88";

function makeDownloadedTechIcon(raw: string, defaultBrand: string): IconType {
  const TechSvgIcon = forwardRef<SVGSVGElement, IconProps & { color?: string; title?: string }>(function TechSvgIcon(
    { className, color, style, title, ...rest },
    ref,
  ) {
    return (
      <span
        ref={ref as never}
        className={`inline-flex shrink-0 items-center justify-center [&_svg]:size-full [&_svg]:block ${className ?? "size-4"}`}
        style={{ color: color ?? defaultBrand, ...style }}
        title={title}
        aria-label={title}
        aria-hidden={title ? undefined : true}
        dangerouslySetInnerHTML={{ __html: normalizeDownloadedSvg(raw) }}
        {...rest}
      />
    );
  });
  return TechSvgIcon as unknown as IconType;
}

export function ControlCenterGlyph(props: IconProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${props.className ?? "size-4"}`}
      style={props.style}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: normalizeDownloadedSvg(controlCenterSvg) }}
    />
  );
}

export function MusicNoteGlyph(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 17a3 3 0 11-2-2.8V6.4a1 1 0 011.3-.95l8 2.3A1 1 0 0117 8.7V15a3 3 0 11-2-2.8V9l-6-1.7V17z" />
    </Svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Registry                                                                */
/* ---------------------------------------------------------------------- */

export interface TechEntry {
  label: string;
  brand: string;
  Icon: IconType;
}

const REGISTRY: Record<string, TechEntry> = {
  typescript: { label: "TypeScript", brand: typescriptHex, Icon: SiTypescript },
  javascript: { label: "JavaScript", brand: javascriptHex, Icon: SiJavascript },
  python: { label: "Python", brand: pythonHex, Icon: SiPython },
  rust: { label: "Rust", brand: rustHex, Icon: SiRust },
  java: { label: "Java", brand: javaHex, Icon: makeDownloadedTechIcon(javaSvg, javaHex) },
  sql: { label: "SQL", brand: "#00758f", Icon: SqlGlyph as unknown as IconType },
  react: { label: "React", brand: reactHex, Icon: SiReact },
  nextjs: { label: "Next.js", brand: nextHex, Icon: SiNextdotjs },
  vue: { label: "Vue", brand: vueHex, Icon: SiVuedotjs },
  nuxt: { label: "Nuxt", brand: nuxtHex, Icon: SiNuxt },
  tailwind: { label: "Tailwind CSS", brand: tailwindHex, Icon: SiTailwindcss },
  vite: { label: "Vite", brand: viteHex, Icon: SiVite },
  motion: { label: "Motion", brand: motionHex, Icon: makeDownloadedTechIcon(motionSvg, motionHex) },
  nodejs: { label: "Node.js", brand: nodeHex, Icon: SiNodedotjs },
  express: { label: "Express.js", brand: expressHex, Icon: SiExpress },
  fastapi: { label: "FastAPI", brand: fastapiHex, Icon: SiFastapi },
  django: { label: "Django", brand: djangoHex, Icon: SiDjango },
  jwt: { label: "JWT", brand: jwtHex, Icon: SiJsonwebtokens },
  restapi: { label: "REST APIs", brand: "#6d5cff", Icon: RestApiGlyph as unknown as IconType },
  postgresql: { label: "PostgreSQL", brand: postgresqlHex, Icon: SiPostgresql },
  mariadb: { label: "MariaDB", brand: mariadbHex, Icon: SiMariadb },
  mongodb: { label: "MongoDB", brand: mongodbHex, Icon: SiMongodb },
  redis: { label: "Redis", brand: redisHex, Icon: SiRedis },
  pytorch: { label: "PyTorch", brand: pytorchHex, Icon: SiPytorch },
  tensorflow: { label: "TensorFlow", brand: tensorflowHex, Icon: SiTensorflow },
  scikitlearn: { label: "Scikit-learn", brand: scikitHex, Icon: SiScikitlearn },
  onnx: { label: "ONNX", brand: onnxHex, Icon: SiOnnx },
  llm: { label: "LLMs", brand: "#8a5cf6", Icon: AiChipGlyph as unknown as IconType },
  rag: { label: "RAG", brand: "#8a5cf6", Icon: AiChipGlyph as unknown as IconType },
  vercelai: { label: "Vercel AI SDK", brand: vercelHex, Icon: SiVercel },
  docker: { label: "Docker", brand: dockerHex, Icon: SiDocker },
  sentry: { label: "Sentry", brand: sentryHex, Icon: SiSentry },
  vercel: { label: "Vercel", brand: vercelHex, Icon: SiVercel },
  cloudflare: { label: "Cloudflare", brand: cloudflareHex, Icon: SiCloudflare },
  render: { label: "Render", brand: renderHex, Icon: SiRender },
  git: { label: "Git", brand: gitHex, Icon: SiGit },
  github: { label: "GitHub", brand: githubHex, Icon: SiGithub },
  linkedin: { label: "LinkedIn", brand: "#0a66c2", Icon: LinkedinGlyph as unknown as IconType },
  linux: { label: "Linux", brand: linuxHex, Icon: SiLinux },
  archlinux: { label: "Arch Linux", brand: archHex, Icon: SiArchlinux },
  cachyos: { label: "CachyOS", brand: cachyosHex, Icon: makeDownloadedTechIcon(cachyosSvg, cachyosHex) },
  bash: { label: "Bash", brand: bashHex, Icon: SiGnubash },
  wsl: { label: "WSL", brand: linuxHex, Icon: SiLinux },
  zsh: { label: "zsh", brand: zshHex, Icon: SiZsh },
  neovim: { label: "Neovim", brand: neovimHex, Icon: SiNeovim },
  cursor: { label: "Cursor", brand: cursorHex, Icon: SiCursor },
  claudecode: { label: "Claude Code", brand: claudeHex, Icon: SiClaude },
  codex: { label: "Codex", brand: "#10a37f", Icon: makeDownloadedTechIcon(openaiSvg, openaiHex) },
  opencode: { label: "Opencode", brand: opencodeHex, Icon: makeDownloadedTechIcon(opencodeSvg, opencodeHex) },
  cicd: { label: "CI/CD", brand: "#f97316", Icon: CiCdGlyph as unknown as IconType },
  laravel: { label: "Laravel", brand: laravelHex, Icon: SiLaravel },
  php: { label: "PHP", brand: phpHex, Icon: SiPhp },
  livewire: { label: "Livewire", brand: livewireHex, Icon: SiLivewire },
  alpinejs: { label: "Alpine.js", brand: alpineHex, Icon: SiAlpinedotjs },
  arduino: { label: "Arduino", brand: arduinoHex, Icon: SiArduino },
  cpp: { label: "C++", brand: cppHex, Icon: SiCplusplus },
  pinia: { label: "Pinia", brand: piniaHex, Icon: SiPinia },
  shell: { label: "Shell", brand: shellHex, Icon: SiShell },
  vitest: { label: "Vitest", brand: vitestHex, Icon: SiVitest },
  pytest: { label: "Pytest", brand: pytestHex, Icon: SiPytest },
  playwright: { label: "Playwright", brand: playwrightHex, Icon: makeDownloadedTechIcon(playwrightSvg, playwrightHex) },
  eslint: { label: "ESLint", brand: eslintHex, Icon: SiEslint },
  prettier: { label: "Prettier", brand: prettierHex, Icon: SiPrettier },
  html: { label: "HTML", brand: htmlHex, Icon: SiHtml5 },
  css: { label: "CSS", brand: cssHex, Icon: SiCss },
  bootstrap: { label: "Bootstrap", brand: bootstrapHex, Icon: SiBootstrap },
};

export type TechName = keyof typeof REGISTRY;

/** Map display names / aliases to registry keys */
const ALIASES: Record<string, TechName> = {
  ts: "typescript",
  js: "javascript",
  "node": "nodejs",
  "node.js": "nodejs",
  "express.js": "express",
  "next.js": "nextjs",
  next: "nextjs",
  tailwindcss: "tailwind",
  "tailwind css": "tailwind",
  "alpine.js": "alpinejs",
  "c++": "cpp",
  "c/c++": "cpp",
  "html5 canvas": "html",
  "html5": "html",
  "css3": "css",
  arch: "archlinux",
  "arch/cachy-os": "cachyos",
  "cachy-os": "cachyos",
  "cachy-os linux": "cachyos",
  "linux · arch/cachy-os": "cachyos",
  jwt: "jwt",
  "rest apis": "restapi",
  restapis: "restapi",
  "scikit-learn": "scikitlearn",
  "vercel ai sdk": "vercelai",
  "claude code": "claudecode",
  claude: "claudecode",
  opencode: "opencode",
  "ci/cd": "cicd",
  cicd: "cicd",
};

export function resolveTechName(input: string): TechName | null {
  const key = input.toLowerCase().trim();
  if (key in REGISTRY) return key as TechName;
  return ALIASES[key] ?? null;
}

export function TechIcon({ name, className, color, ...rest }: IconProps & { name: string; color?: string }) {
  const resolved = resolveTechName(name);
  if (!resolved) {
    return (
      <Svg className={className} {...rest}>
        <circle cx="12" cy="12" r="10" opacity="0.15" />
        <text x="12" y="15.5" textAnchor="middle" fontSize="8" fill="currentColor">
          {name.slice(0, 2).toUpperCase()}
        </text>
      </Svg>
    );
  }
  const { Icon, brand, label } = REGISTRY[resolved];
  return <Icon className={className} color={color ?? brand} title={label} {...rest} />;
}

export function getTechBrand(name: string): string {
  const resolved = resolveTechName(name);
  return resolved ? REGISTRY[resolved].brand : "#888888";
}

export function getTechLabel(name: string): string {
  const resolved = resolveTechName(name);
  return resolved ? REGISTRY[resolved].label : name;
}

export const TECH = REGISTRY;

export type { CSSProperties };
