import { Send, Inbox, Star, Archive, Trash2, Loader2 } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { useState } from "react";
import { useT } from "../../os/i18n";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

const formContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.04 },
  },
};

const formItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

const RECIPIENT = "carlos152924@gmail.com";
const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL as string | undefined;

type SendStatus = "idle" | "sending" | "success" | "error";

export function ContactApp() {
  const { t } = useT();
  const [form, setForm] = useState({ name: "", email: "", subject: "", body: "" });
  const [company, setCompany] = useState(""); // honeypot, must stay empty
  const [status, setStatus] = useState<SendStatus>("idle");
  const reduced = usePrefersReducedMotion();

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!CONTACT_API_URL || status === "sending") return;

    setStatus("sending");
    try {
      const res = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, company }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (!res.ok || !data?.ok) throw new Error("send_failed");

      setStatus("success");
      setForm({ name: "", email: "", subject: "", body: "" });
    } catch {
      setStatus("error");
    }
  };

  const folders = [
    { icon: Inbox, label: t("mail.folder.inbox"), n: 1 },
    { icon: Star, label: t("mail.folder.starred") },
    { icon: Archive, label: t("mail.folder.archive") },
    { icon: Trash2, label: t("mail.folder.trash") },
  ];

  return (
    <div className="flex h-full text-[color:var(--macos-text-primary)]">
      <aside className="w-40 shrink-0 h-full p-2 flex flex-col gap-0.5 bg-[color:var(--macos-sidebar-bg)] border-r border-[color:var(--macos-hairline)]">
        {folders.map((it) => (
          <button
            key={it.label}
            className="flex items-center gap-2 px-2 h-6 rounded text-[13px] hover:bg-black/5 dark:hover:bg-white/8 transition-colors"
          >
            <it.icon className="size-[13px] text-[color:var(--macos-accent)]" />
            <span className="flex-1 text-left">{it.label}</span>
            {"n" in it && it.n && <span className="text-[11px] text-[color:var(--macos-text-muted)] tabular-nums">{it.n}</span>}
          </button>
        ))}
      </aside>

      <form onSubmit={send} className="flex-1 flex flex-col">
        <motion.div
          className="flex-1 flex flex-col"
          variants={formContainerVariants}
          initial={reduced ? false : "hidden"}
          animate="visible"
        >
          <Row label={t("mail.to")} variants={formItemVariants}>
            <span className="text-[13px] select-text cursor-text selection:bg-[#0a84ff]/30 selection:text-[color:var(--macos-text-primary)]">
              {RECIPIENT}
            </span>
          </Row>
          <Row label={t("mail.from")} variants={formItemVariants}>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t("mail.placeholder.name")}
              className="flex-1 bg-transparent outline-none text-[13px] text-[color:var(--macos-text-primary)] placeholder:text-[color:var(--macos-text-muted)]"
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={t("mail.placeholder.email")}
              className="flex-1 bg-transparent outline-none text-[13px] text-[color:var(--macos-text-primary)] placeholder:text-[color:var(--macos-text-muted)]"
            />
          </Row>
          <Row label={t("mail.subject")} variants={formItemVariants}>
            <input
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder={t("mail.placeholder.subject")}
              className="flex-1 bg-transparent outline-none text-[13px] text-[color:var(--macos-text-primary)] placeholder:text-[color:var(--macos-text-muted)]"
            />
          </Row>
          <motion.textarea
            variants={formItemVariants}
            required
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder={t("mail.placeholder.body")}
            className="flex-1 w-full p-4 bg-transparent outline-none text-[13px] resize-none text-[color:var(--macos-text-primary)] placeholder:text-[color:var(--macos-text-muted)]"
          />
          <input
            type="text"
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="sr-only"
          />
          <motion.div
            variants={formItemVariants}
            className="flex items-center justify-between px-4 py-2 border-t border-[color:var(--macos-hairline)] bg-[color:var(--macos-sidebar-bg)]"
          >
            <span className="text-[11px] text-[color:var(--macos-text-muted)]">
              {status === "sending" && t("mail.sending")}
              {status === "success" && t("mail.sent")}
              {status === "error" && t("mail.error")}
              {status === "idle" && t("mail.note")}
            </span>
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-1.5 px-3 h-7 rounded-md bg-[color:var(--macos-accent)] text-white text-[12px] active:scale-[0.96] transition-transform disabled:opacity-60 disabled:active:scale-100"
            >
              {status === "sending" ? (
                <Loader2 className="size-[12px] animate-spin" />
              ) : (
                <Send className="size-[12px]" />
              )}
              {t("mail.send")}
            </button>
          </motion.div>
        </motion.div>
      </form>
    </div>
  );
}

function Row({ label, children, variants }: { label: string; children: React.ReactNode; variants?: Variants }) {
  return (
    <motion.div variants={variants} className="flex items-center gap-3 px-4 h-9 border-b border-[color:var(--macos-hairline)]">
      <span className="text-[11px] uppercase tracking-wider text-[color:var(--macos-text-muted)] w-14">{label}</span>
      <div className="flex-1 flex gap-3 items-center">{children}</div>
    </motion.div>
  );
}
