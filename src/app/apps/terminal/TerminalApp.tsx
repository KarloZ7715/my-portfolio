import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useOS } from "../../os/OSContext";
import { useT } from "../../os/i18n";
import { useTheme, type ThemeMode } from "../../os/ThemeContext";
import { useMusic } from "../../notifications/MusicContext";
import { formatUptime } from "../../os/bootTime";
import { PROJECTS } from "../projects/projects.data";
import type { AppId } from "../../os/types";

interface Line {
  input?: string;
  output?: string;
  neofetch?: boolean;
}

/** Official neofetch Linux fallback Tux with segment colors (neofetch c1/c2/c3). */
const TUX_TONE_CLASS = {
  outline: "text-neutral-600",
  belly: "text-neutral-200",
  accent: "text-amber-600",
  eye: "text-white",
} as const;

type TuxSegment = { text: string; tone: keyof typeof TUX_TONE_CLASS };

const TUX_ART: TuxSegment[][] = [
  [{ text: "        #####", tone: "outline" }],
  [{ text: "       #######", tone: "outline" }],
  [
    { text: "       ##", tone: "outline" },
    { text: "O", tone: "eye" },
    { text: "#", tone: "outline" },
    { text: "O", tone: "eye" },
    { text: "##", tone: "outline" },
  ],
  [
    { text: "       #", tone: "outline" },
    { text: "#####", tone: "accent" },
    { text: "#", tone: "outline" },
  ],
  [
    { text: "     ##", tone: "outline" },
    { text: "##", tone: "belly" },
    { text: "###", tone: "accent" },
    { text: "##", tone: "belly" },
    { text: "##", tone: "outline" },
  ],
  [
    { text: "    #", tone: "outline" },
    { text: "##########", tone: "belly" },
    { text: "##", tone: "outline" },
  ],
  [
    { text: "   #", tone: "outline" },
    { text: "############", tone: "belly" },
    { text: "##", tone: "outline" },
  ],
  [
    { text: "   #", tone: "outline" },
    { text: "############", tone: "belly" },
    { text: "###", tone: "outline" },
  ],
  [
    { text: "  ##", tone: "accent" },
    { text: "#", tone: "outline" },
    { text: "###########", tone: "belly" },
    { text: "##", tone: "outline" },
    { text: "#", tone: "accent" },
  ],
  [
    { text: "######", tone: "accent" },
    { text: "#", tone: "outline" },
    { text: "#######", tone: "belly" },
    { text: "#", tone: "outline" },
    { text: "######", tone: "accent" },
  ],
  [
    { text: "#######", tone: "accent" },
    { text: "#", tone: "outline" },
    { text: "#####", tone: "belly" },
    { text: "#", tone: "outline" },
    { text: "#######", tone: "accent" },
  ],
  [
    { text: "  #####", tone: "accent" },
    { text: "#######", tone: "outline" },
    { text: "#####", tone: "accent" },
  ],
];

const COMMANDS = [
  "help",
  "whoami",
  "neofetch",
  "about",
  "projects",
  "skills",
  "contact",
  "open",
  "theme",
  "lang",
  "music",
  "history",
  "echo",
  "date",
  "pwd",
  "clear",
  "sudo",
];

const APP_IDS: AppId[] = ["finder", "projects", "skills", "mail", "terminal"];

function NeofetchOutput({ info }: { info: string[] }) {
  return (
    <div className="flex items-start gap-6">
      <pre className="m-0 leading-[1.15] whitespace-pre" style={{ fontFamily: "inherit" }}>
        {TUX_ART.map((line, i) => (
          <span key={i} className="block">
            {line.map((seg, j) => (
              <span key={j} className={TUX_TONE_CLASS[seg.tone]}>
                {seg.text}
              </span>
            ))}
          </span>
        ))}
      </pre>
      <pre className="m-0 leading-[1.15] text-neutral-300 whitespace-pre" style={{ fontFamily: "inherit" }}>
        {info.join("\n")}
      </pre>
    </div>
  );
}

function PromptLine({ input }: { input?: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-emerald-500">➜</span>
      <span className="text-sky-400">~/portfolio</span>
      <span className="text-neutral-400">$</span>
      {input !== undefined ? <span className="text-neutral-100">{input}</span> : null}
    </div>
  );
}

export function TerminalApp() {
  const { openApp } = useOS();
  const { t, lang, setLang } = useT();
  const { setTheme } = useTheme();
  const music = useMusic();
  const [lines, setLines] = useState<Line[]>([{ output: t("terminal.welcome") }]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<string[]>([]);
  const historyNavRef = useRef(-1);
  const draftRef = useRef("");

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  const resetHistoryNav = () => {
    historyNavRef.current = -1;
    draftRef.current = "";
  };

  const pushHistory = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    const prev = historyRef.current;
    if (prev[prev.length - 1] === trimmed) return;
    historyRef.current = [...prev, trimmed].slice(-100);
  };

  const neofetchInfo = () => {
    const label = (key: string) => t(key).padEnd(11);
    return [
      "carlos@portfolio",
      "------------------",
      `${label("terminal.neofetch.os")}Cachy-OS Linux`,
      `${label("terminal.neofetch.shell")}zsh 5.9`,
      `${label("terminal.neofetch.editor")}Neovim + Cursor`,
      `${label("terminal.neofetch.wm")}Hyprland`,
      `${label("terminal.neofetch.location")}Montería, CO`,
      `${label("terminal.neofetch.uptime")}${formatUptime()}`,
    ];
  };

  const completeInput = (value: string) => {
    const parts = value.trimStart().split(/\s+/);
    if (parts.length === 1) {
      const prefix = parts[0].toLowerCase();
      const matches = COMMANDS.filter((c) => c.startsWith(prefix));
      if (matches.length === 1) return matches[0];
      if (matches.length > 1) {
        let common = matches[0];
        for (const m of matches.slice(1)) {
          while (!m.startsWith(common)) common = common.slice(0, -1);
        }
        if (common.length > prefix.length) return common;
      }
      return value;
    }
    if (parts[0] === "open" && parts.length >= 2) {
      const prefix = parts[parts.length - 1];
      const matches = APP_IDS.filter((id) => id.startsWith(prefix));
      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];
        return parts.join(" ");
      }
    }
    return value;
  };

  const run = (raw: string, { record = true }: { record?: boolean } = {}) => {
    let cmd = raw.trim();
    if (!cmd) {
      setLines((ls) => [...ls, { input: raw }]);
      return;
    }

    if (cmd === "!!") {
      const last = historyRef.current[historyRef.current.length - 1];
      if (!last) {
        setLines((ls) => [...ls, { input: raw, output: t("terminal.historyEmpty") }]);
        return;
      }
      cmd = last;
      raw = last;
    }

    if (record) pushHistory(cmd);

    const [name, ...args] = cmd.split(/\s+/);
    let output = "";
    let neofetch = false;

    switch (name) {
      case "help":
        output = t("terminal.help");
        break;
      case "whoami":
        output = t("terminal.whoami");
        break;
      case "neofetch":
        neofetch = true;
        break;
      case "about":
        openApp("finder");
        output = `${t("terminal.opening")} ${t("app.finder")}…`;
        break;
      case "projects":
        output = PROJECTS.map((p) => `• ${p.name.padEnd(14)} ${p.stack.join(", ")}`).join("\n");
        break;
      case "skills":
        openApp("skills");
        output = `${t("terminal.opening")} ${t("app.skills")}…`;
        break;
      case "contact":
        openApp("mail");
        output = `${t("terminal.opening")} ${t("app.mail")}…`;
        break;
      case "open": {
        const id = args[0] as AppId;
        if (APP_IDS.includes(id)) {
          openApp(id);
          output = `${t("terminal.opening")} ${id}…`;
        } else output = `${t("terminal.unknownApp")} ${args[0] ?? ""}`;
        break;
      }
      case "theme": {
        const mode = args[0] as ThemeMode;
        if (mode === "light" || mode === "dark" || mode === "auto") {
          setTheme(mode);
          output = `${t("terminal.themeSet")} ${mode}`;
        } else output = t("terminal.themeUsage");
        break;
      }
      case "lang": {
        const l = args[0];
        if (l === "es" || l === "en") {
          setLang(l);
          output = `${t("terminal.langSet")} ${l}`;
        } else output = t("terminal.langUsage");
        break;
      }
      case "music": {
        const sub = args[0];
        if (sub === "play") {
          music.play();
          output = `${t("terminal.musicPlaying")} ${music.meta[music.currentTrack.id]?.title ?? music.currentTrack.id}`;
        } else if (sub === "pause") {
          music.pause();
          output = t("terminal.musicPaused");
        } else if (sub === "next") {
          music.next();
          output = t("terminal.musicPlaying");
        } else if (sub === "prev") {
          music.prev();
          output = t("terminal.musicPlaying");
        } else output = t("terminal.musicUsage");
        break;
      }
      case "history": {
        const hist = historyRef.current;
        output = hist.length
          ? hist.map((h, i) => `${String(i + 1).padStart(4)}  ${h}`).join("\n")
          : t("terminal.historyEmpty");
        break;
      }
      case "echo":
        output = args.join(" ");
        break;
      case "date":
        output = new Date().toLocaleString(lang === "es" ? "es-CO" : "en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        break;
      case "pwd":
        output = t("terminal.pwd");
        break;
      case "sudo":
        if (args.join(" ") === "make coffee") {
          output = t("terminal.coffee");
        } else output = `${t("terminal.notFound")} ${name}`;
        break;
      case "clear":
        setLines([]);
        return;
      default:
        output = `${t("terminal.notFound")} ${name}`;
    }

    setLines((ls) => [
      ...ls,
      { input: raw },
      ...(neofetch ? [{ neofetch: true }] : output ? [{ output }] : []),
    ]);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const hist = historyRef.current;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!hist.length) return;
      if (historyNavRef.current === -1) draftRef.current = input;
      const next = Math.min(historyNavRef.current + 1, hist.length - 1);
      historyNavRef.current = next;
      setInput(hist[hist.length - 1 - next]);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyNavRef.current === -1) return;
      const next = historyNavRef.current - 1;
      historyNavRef.current = next;
      setInput(next === -1 ? draftRef.current : hist[hist.length - 1 - next]);
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      setInput((v) => completeInput(v));
      return;
    }

    if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      setLines([]);
      return;
    }

    if (e.ctrlKey && e.key === "c") {
      e.preventDefault();
      setInput("");
      resetHistoryNav();
      setLines((ls) => [...ls, { output: t("terminal.interrupted") }]);
      return;
    }

    if (e.ctrlKey && e.key === "u") {
      e.preventDefault();
      setInput("");
      resetHistoryNav();
      return;
    }

    if (e.key === "Home") {
      e.preventDefault();
      const el = inputRef.current;
      if (el) el.setSelectionRange(0, 0);
      return;
    }

    if (e.key === "End") {
      e.preventDefault();
      const el = inputRef.current;
      if (el) el.setSelectionRange(input.length, input.length);
    }
  };

  return (
    <div
      className="h-full w-full flex flex-col text-[13px] text-emerald-300"
      style={{ background: "#0a0a0a", fontFamily: "var(--font-mono)" }}
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-auto macos-scroll p-3">
        {lines.map((l, i) => (
          <div key={i}>
            {l.input !== undefined && <PromptLine input={l.input} />}
            {l.neofetch ? <NeofetchOutput info={neofetchInfo()} /> : null}
            {l.output !== undefined && (
              <pre className="whitespace-pre-wrap text-neutral-300" style={{ fontFamily: "inherit" }}>
                {l.output}
              </pre>
            )}
          </div>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(input);
            setInput("");
            resetHistoryNav();
          }}
          className="flex gap-2 mt-1"
        >
          <span className="text-emerald-500 shrink-0">➜</span>
          <span className="text-sky-400 shrink-0">~/portfolio</span>
          <span className="text-neutral-400 shrink-0">$</span>
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              resetHistoryNav();
            }}
            onKeyDown={onKeyDown}
            className="flex-1 min-w-0 bg-transparent outline-none text-neutral-100 caret-emerald-400"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
        </form>
      </div>
    </div>
  );
}
