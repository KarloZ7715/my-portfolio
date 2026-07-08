import { Github, Linkedin, Mail, MapPin, Star, HardDrive, Cloud, Tag } from "lucide-react";
import { motion, type Variants } from "motion/react";
import type { CSSProperties } from "react";
import { useT } from "../../os/i18n";
import { getBioParagraphs } from "./bio-content";
import { BioParagraph } from "./BioTypography";
import { MusicNoteGlyph, TechIcon } from "../../lib/icons";
import {
  InterestGamepadIcon,
  InterestMotorcycleIcon,
  InterestSparklesIcon,
} from "../../lib/interest-icons";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

const sidebarItems = [
  { icon: Star, label: { es: "Favoritos", en: "Favorites" } },
  { icon: HardDrive, label: { es: "KarloZOS", en: "KarloZOS" } },
  { icon: Cloud, label: { es: "Nube", en: "Cloud" } },
  { icon: Tag, label: { es: "Etiquetas", en: "Tags" } },
];

const INTERESTS = [
  { key: "about.interest.music", icon: MusicNoteGlyph, brand: "#ff375f" },
  { key: "about.interest.motorcycles", icon: InterestMotorcycleIcon, brand: "#ff9f0a" },
  { key: "about.interest.games", icon: InterestGamepadIcon, brand: "#30d158" },
  { key: "about.interest.ai", icon: InterestSparklesIcon, brand: "#8a5cf6" },
  { key: "about.interest.linux", icon: null, brand: "#fcc624", tech: "linux" },
] as const;

export function AboutApp() {
  const { t, lang } = useT();
  const bioParagraphs = getBioParagraphs(lang);
  const reduced = usePrefersReducedMotion();

  return (
    <div className="flex h-full text-[color:var(--macos-text-primary)]">
      <aside className="w-44 shrink-0 h-full p-2 flex flex-col gap-0.5 bg-[color:var(--macos-sidebar-bg)] border-r border-[color:var(--macos-hairline)]">
        <div className="px-2 pt-2 pb-1 text-[11px] uppercase tracking-wider text-[color:var(--macos-text-muted)]">
          {lang === "es" ? "Favoritos" : "Favorites"}
        </div>
        {sidebarItems.map((it) => (
          <button
            key={it.label.en}
            className="flex items-center gap-2 px-2 h-6 rounded text-[13px] hover:bg-black/5 dark:hover:bg-white/8 transition-colors text-left"
          >
            <it.icon className="size-[13px] text-[color:var(--macos-accent)]" />
            <span>{it.label[lang]}</span>
          </button>
        ))}
      </aside>

      <motion.main
        className="flex-1 overflow-auto macos-scroll p-8"
        variants={containerVariants}
        initial={reduced ? false : "hidden"}
        animate="visible"
      >
        <motion.div className="flex items-start gap-6 mb-6" variants={itemVariants}>
          <div
            className="size-24 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center text-white shrink-0"
            style={{ boxShadow: "0 8px 20px -6px rgba(80,60,200,0.5)" }}
          >
            <span style={{ fontSize: 36, fontWeight: 600 }}>CC</span>
          </div>
          <div className="min-w-0">
            <div className="text-[color:var(--macos-text-muted)] text-[13px]">{t("about.hello")}</div>
            <h1
              className="text-[color:var(--macos-text-primary)]"
              style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.4, textWrap: "balance" as const }}
            >
              {t("about.name")}
            </h1>
            <div className="text-[13px] text-[color:var(--macos-accent)] mt-0.5">{t("about.role")}</div>
            <div className="flex items-center gap-1 mt-2 text-[12px] text-[color:var(--macos-text-secondary)]">
              <MapPin className="size-3" /> {t("about.location")}
            </div>
          </div>
        </motion.div>

        <motion.div className="flex flex-col gap-3.5 mb-6 max-w-xl" variants={itemVariants}>
          {bioParagraphs.map((segments, i) => (
            <BioParagraph key={i} segments={segments} />
          ))}
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="mb-2 text-[11px] uppercase tracking-wider text-[color:var(--macos-text-muted)]">
            {t("about.interests.title")}
          </div>
          <div className="flex flex-wrap gap-2.5 mb-6">
            {INTERESTS.map((it) => {
              const Icon = it.icon ?? ((props: { className?: string }) => <TechIcon name={it.tech!} className={props.className} />);
              return (
                <div
                  key={it.key}
                  className="flex items-center gap-2 px-3 h-9 rounded-full bg-[color:var(--macos-window-bg)] border border-[color:var(--macos-hairline)] text-[13px] transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/8"
                >
                  <Icon className="size-4" style={{ color: it.brand }} />
                  <span>{t(it.key)}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="mb-2 text-[11px] uppercase tracking-wider text-[color:var(--macos-text-muted)]">{t("about.links")}</div>
          <div className="flex flex-wrap gap-2.5">
            <BrandLink href="https://github.com/KarloZ7715" icon={Github} label="GitHub" from="#4a4a4d" to="#18181a" />
            <BrandLink href="https://www.linkedin.com/in/carlos-alberto-canabal-cordero-828508339/" icon={Linkedin} label="LinkedIn" from="#0a84ff" to="#004182" />
            <BrandLink href="mailto:carlos152924@gmail.com" icon={Mail} label="Email" from="#34aadc" to="#0a66c2" />
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}

function BrandLink({
  href,
  icon: Icon,
  label,
  from,
  to,
}: {
  href: string;
  icon: typeof Github;
  label: string;
  from: string;
  to: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{ ["--from" as string]: from, ["--to" as string]: to } as CSSProperties}
      className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-md bg-[color:var(--macos-window-bg)] text-[13px] text-[color:var(--macos-text-primary)] border border-[color:var(--macos-hairline)] active:scale-[0.96] transition-[background-color,background-image,color,border-color,transform] duration-200 hover:text-white hover:border-transparent hover:bg-[linear-gradient(135deg,var(--from),var(--to))]"
    >
      <Icon className="size-[14px]" />
      {label}
    </a>
  );
}
