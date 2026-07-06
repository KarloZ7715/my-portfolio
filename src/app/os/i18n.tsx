import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "./types";

type Dict = Record<string, { es: string; en: string }>;

const dict: Dict = {
  "app.finder": { es: "Sobre mí", en: "About Me" },
  "app.projects": { es: "Proyectos", en: "Projects" },
  "app.skills": { es: "Habilidades", en: "Skills" },
  "app.mail": { es: "Contacto", en: "Contact" },
  "app.terminal": { es: "Terminal", en: "Terminal" },

  "menubar.about": { es: "Acerca de KarloZOS", en: "About KarloZOS" },
  "menubar.file": { es: "Archivo", en: "File" },
  "menubar.edit": { es: "Edición", en: "Edit" },
  "menubar.view": { es: "Ver", en: "View" },
  "menubar.window": { es: "Ventana", en: "Window" },
  "menubar.help": { es: "Ayuda", en: "Help" },
  "menubar.wallpaper": { es: "Fondo de pantalla", en: "Wallpaper" },
  "menubar.systemPrefs": { es: "Preferencias del Sistema…", en: "System Preferences…" },

  "window.back": { es: "Atrás", en: "Back" },

  "about.hello": { es: "Hola, soy", en: "Hi, I'm" },
  "about.name": { es: "Carlos Alberto Canabal Cordero", en: "Carlos Alberto Canabal Cordero" },
  "about.role": { es: "Ingeniero de Sistemas", en: "Systems Engineer" },
  "about.bio": {
    es: "Soy ingeniero de sistemas. Programo en TypeScript, Python, Rust y Java. He construido software que funciona: terminales, sistemas de IA, tiendas en línea, dispositivos IoT.\n\nVivo en Montería, Colombia. Uso Linux, manejo moto, escucho más música de la que mi disco soporta. Programo porque me gusta. Si no me pagaran, lo haría igual.\n\nSi una IA puede leer mi código sin alucinar, hice bien mi trabajo.",
    en: "I'm a systems engineer. I write TypeScript, Python, Rust, and Java. I've built software that works: terminals, AI systems, online stores, IoT devices.\n\nI live in Montería, Colombia. I run Linux, ride a motorcycle, and listen to more music than my disk can hold. I'd code even if nobody paid me. Lucky for me, someone does.\n\nIf an AI can read my code without hallucinating, I did my job right.",
  },
  "about.location": { es: "Montería, Colombia", en: "Montería, Colombia" },
  "about.interests.title": { es: "Fuera del teclado", en: "Off the keyboard" },
  "about.interest.music": { es: "Música", en: "Music" },
  "about.interest.motorcycles": { es: "Motos", en: "Motorcycles" },
  "about.interest.games": { es: "Videojuegos", en: "Video games" },
  "about.interest.linux": { es: "Linux", en: "Linux" },
  "about.interest.ai": { es: "IA", en: "AI" },
  "about.links": { es: "Enlaces", en: "Links" },

  "projects.subtitle": { es: "Algunas cosas que he construido", en: "A few things I've built" },
  "projects.viewCode": { es: "Ver código", en: "View code" },
  "projects.viewLive": { es: "Abrir demo", en: "Open demo" },
  "projects.stack": { es: "Stack", en: "Stack" },

  "skills.languages": { es: "Lenguajes", en: "Languages" },
  "skills.frontend": { es: "Frontend", en: "Frontend" },
  "skills.backend": { es: "Backend", en: "Backend" },
  "skills.databases": { es: "Bases de datos", en: "Databases" },
  "skills.aiml": { es: "IA & Datos", en: "AI & Data" },
  "skills.devops": { es: "DevOps & Herramientas", en: "DevOps & Tools" },
  "skills.testing": { es: "Testing", en: "Testing" },
  "skills.extras": { es: "Extras", en: "Extras" },

  "mail.to": { es: "Para", en: "To" },
  "mail.from": { es: "De", en: "From" },
  "mail.subject": { es: "Asunto", en: "Subject" },
  "mail.body": { es: "Mensaje", en: "Message" },
  "mail.send": { es: "Enviar", en: "Send" },
  "mail.placeholder.name": { es: "Tu nombre", en: "Your name" },
  "mail.placeholder.email": { es: "tu@correo.com", en: "you@email.com" },
  "mail.placeholder.subject": { es: "Hablemos de…", en: "Let's talk about…" },
  "mail.placeholder.body": { es: "Cuéntame qué tienes en mente", en: "Tell me what's on your mind" },
  "mail.note": {
    es: "Al enviar se abrirá tu cliente de correo.",
    en: "Sending will open your mail client.",
  },
  "mail.sent": {
    es: "Mensaje listo. Se abrió tu cliente de correo.",
    en: "Message ready. Your mail client should have opened.",
  },
  "mail.folder.inbox": { es: "Recibidos", en: "Inbox" },
  "mail.folder.starred": { es: "Destacados", en: "Starred" },
  "mail.folder.archive": { es: "Archivo", en: "Archive" },
  "mail.folder.trash": { es: "Papelera", en: "Trash" },

  "terminal.welcome": {
    es: "Bienvenido a la terminal de KarloZOS. Escribe 'help' para empezar.",
    en: "Welcome to the KarloZOS terminal. Type 'help' to get started.",
  },
  "terminal.help": {
    es: "Comandos: help, whoami, neofetch, about, projects, skills, contact, open <app>, theme <light|dark|auto>, lang <es|en>, music <play|pause|next|prev>, history, echo, date, pwd, clear, sudo make coffee",
    en: "Commands: help, whoami, neofetch, about, projects, skills, contact, open <app>, theme <light|dark|auto>, lang <es|en>, music <play|pause|next|prev>, history, echo, date, pwd, clear, sudo make coffee",
  },
  "terminal.notFound": { es: "zsh: comando no encontrado:", en: "zsh: command not found:" },
  "terminal.unknownApp": { es: "app desconocida:", en: "unknown app:" },
  "terminal.opening": { es: "Abriendo", en: "Opening" },
  "terminal.whoami": {
    es: "carlos: ingeniero de sistemas, entusiasta de Linux, curioso de la IA",
    en: "carlos: systems engineer, linux enthusiast, ai-curious",
  },
  "terminal.themeSet": { es: "Tema cambiado a", en: "Theme set to" },
  "terminal.themeUsage": { es: "uso: theme <light|dark|auto>", en: "usage: theme <light|dark|auto>" },
  "terminal.langSet": { es: "Idioma cambiado a", en: "Language set to" },
  "terminal.langUsage": { es: "uso: lang <es|en>", en: "usage: lang <es|en>" },
  "terminal.coffee": {
    es: "Error: no se detectó cafetera (ENODEV). Prueba con té. ☕",
    en: "Error: coffee maker not found (ENODEV). Try tea instead. ☕",
  },
  "terminal.musicPlaying": { es: "Reproduciendo:", en: "Now playing:" },
  "terminal.musicPaused": { es: "Música en pausa.", en: "Music paused." },
  "terminal.musicUsage": { es: "uso: music <play|pause|next|prev>", en: "usage: music <play|pause|next|prev>" },
  "terminal.neofetch.os": { es: "SO:", en: "OS:" },
  "terminal.neofetch.shell": { es: "Shell:", en: "Shell:" },
  "terminal.neofetch.editor": { es: "Editor:", en: "Editor:" },
  "terminal.neofetch.wm": { es: "GV:", en: "WM:" },
  "terminal.neofetch.location": { es: "Ubicación:", en: "Location:" },
  "terminal.neofetch.uptime": { es: "Uptime:", en: "Uptime:" },
  "terminal.historyEmpty": { es: "(sin historial)", en: "(no history)" },
  "terminal.interrupted": { es: "^C", en: "^C" },
  "terminal.pwd": { es: "/home/carlos/portfolio", en: "/home/carlos/portfolio" },

  "spotlight.placeholder": { es: "Buscar apps, comandos o proyectos…", en: "Search apps, commands, or projects…" },
  "spotlight.title": { es: "Búsqueda rápida", en: "Quick Search" },
  "spotlight.apps": { es: "Aplicaciones", en: "Applications" },
  "spotlight.commands": { es: "Comandos", en: "Commands" },
  "spotlight.projects": { es: "Proyectos", en: "Projects" },
  "spotlight.empty": { es: "Sin resultados.", en: "No results found." },
  "spotlight.cmdToggleTheme": { es: "Cambiar tema", en: "Toggle theme" },
  "spotlight.cmdToggleLang": { es: "Cambiar idioma", en: "Toggle language" },
  "spotlight.cmdAboutMachine": { es: "Acerca de KarloZOS", en: "About KarloZOS" },
  "spotlight.cmdWallpaperAurora": { es: "Fondo: Aurora", en: "Wallpaper: Aurora" },
  "spotlight.cmdWallpaperGlacier": { es: "Fondo: Glaciar", en: "Wallpaper: Glacier" },
  "spotlight.cmdWallpaperSunset": { es: "Fondo: Atardecer", en: "Wallpaper: Sunset" },

  "aboutMachine.title": { es: "KarloZOS", en: "KarloZOS" },
  "aboutMachine.subtitle": { es: "Carlos Alberto Canabal Cordero", en: "Carlos Alberto Canabal Cordero" },
  "aboutMachine.cpu": { es: "Procesador", en: "Processor" },
  "aboutMachine.gpu": { es: "Gráficos", en: "Graphics" },
  "aboutMachine.memory": { es: "Memoria", en: "Memory" },
  "aboutMachine.storage": { es: "Almacenamiento", en: "Storage" },
  "aboutMachine.network": { es: "Red", en: "Network" },
  "aboutMachine.os": { es: "Sistema operativo", en: "Operating System" },
  "aboutMachine.location": { es: "Ubicación", en: "Location" },
  "aboutMachine.editor": { es: "Editor", en: "Editor" },
  "aboutMachine.shell": { es: "Shell", en: "Shell" },
  "aboutMachine.uptime": { es: "Actividad", en: "Uptime" },
  "aboutMachine.systemReport": { es: "Informe del sistema…", en: "System Report…" },
  "aboutMachine.softwareUpdate": { es: "Actualización de software…", en: "Software Update…" },

  "notifications.nowPlaying": { es: "Reproduciendo ahora", en: "Now Playing" },
  "notifications.noTrack": { es: "Elige una pista para empezar", en: "Pick a track to get started" },
  "notifications.openInYoutube": { es: "Abrir en YouTube", en: "Open in YouTube" },
  "notifications.trackChanged": { es: "Reproduciendo:", en: "Now playing:" },

  "controlCenter.title": { es: "Centro de Control", en: "Control Center" },
  "controlCenter.wifi": { es: "Wi-Fi", en: "Wi-Fi" },
  "controlCenter.bluetooth": { es: "Bluetooth", en: "Bluetooth" },
  "controlCenter.airdrop": { es: "AirDrop", en: "AirDrop" },
  "controlCenter.airdropSublabel": { es: "Solo contactos", en: "Contacts Only" },
  "controlCenter.dnd": { es: "No molestar", en: "Do Not Disturb" },
  "controlCenter.keyboardBrightness": { es: "Brillo del teclado", en: "Keyboard Brightness" },
  "controlCenter.airplayDisplay": { es: "AirPlay Display", en: "AirPlay Display" },
  "controlCenter.on": { es: "Activado", en: "On" },
  "controlCenter.off": { es: "Desactivado", en: "Off" },
  "controlCenter.brightness": { es: "Pantalla", en: "Display" },
  "controlCenter.sound": { es: "Sonido", en: "Sound" },

  "wallpaper.aurora": { es: "Aurora", en: "Aurora" },
  "wallpaper.glacier": { es: "Glaciar", en: "Glacier" },
  "wallpaper.sunset": { es: "Atardecer", en: "Sunset" },

  "shortcuts.spotlight": { es: "Búsqueda rápida", en: "Quick Search" },
  "shortcuts.close": { es: "Cerrar ventana", en: "Close window" },
  "shortcuts.minimize": { es: "Minimizar ventana", en: "Minimize window" },
  "shortcuts.hideAll": { es: "Ocultar todas", en: "Hide all" },
  "shortcuts.cycle": { es: "Cambiar entre ventanas", en: "Switch windows" },
  "shortcuts.aboutMe": { es: "Acerca de mí", en: "About Me" },
  "shortcuts.quit": { es: "Salir (simulado)", en: "Quit (not really)" },
  "shortcuts.quitToast": {
    es: "Esto es un portfolio, no una app de verdad.",
    en: "This is a portfolio, not really an app.",
  },
  "shortcuts.cheatsheetTitle": { es: "Atajos de teclado", en: "Keyboard shortcuts" },
  "shortcuts.cheatsheetHint": {
    es: "Usan ⌥⇧ (Alt+Shift) para no chocar con el navegador.",
    en: "Use ⌥⇧ (Alt+Shift) so they don't clash with the browser.",
  },

  "boot.tagline": { es: "cargando portfolio…", en: "loading portfolio…" },
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

const STORAGE_KEY = "portfolio.lang";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "es";
    return (localStorage.getItem(STORAGE_KEY) as Lang) || "es";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string) => dict[key]?.[lang] ?? key;
  return <Ctx.Provider value={{ lang, setLang: setLangState, t }}>{children}</Ctx.Provider>;
}

export function useT() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useT must be used within LangProvider");
  return ctx;
}
