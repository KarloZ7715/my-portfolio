import sipacBanner from "../../assets/sipac-banner.webp";
import boolitazBanner from "../../assets/boolitaz-layout.webp";
import baudBanner from "../../assets/baud-banner.webp";

import sipacLogo from "../../assets/sipac-logo.svg";
import boolitazLogo from "../../assets/boolitaz-logo.webp";
import baudLogo from "../../assets/Baud-logo.webp";
import electrocodeLogo from "../../assets/electrocode-logo.webp";

export interface Project {
  slug: string;
  name: string;
  tagline: { es: string; en: string };
  description: { es: string; en: string };
  stack: string[];
  github?: string;
  live?: string;
  accent: string;
  /** Wide layout image for project cards. */
  banner?: string;
  /** Logo-based card banner (used when no layout image exists). */
  bannerLogo?: string;
  /** Background for logo-based card banners. */
  bannerBg?: string;
  /** Tailwind classes for the logo inside card banners. */
  bannerLogoClass?: string;
  /** CSS object-position for image card banners. */
  bannerObjectPosition?: string;
  /** Brand mark shown in the sidebar panel. */
  logo?: string;
  /** Sidebar logo panel background. */
  logoBg?: string;
  /** Extra Tailwind classes for the sidebar logo image. */
  logoClass?: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "sipac",
    name: "SIPAc",
    tagline: {
      es: "Sistema Inteligente de Productividad Académica",
      en: "Intelligent academic productivity system",
    },
    description: {
      es: "Creé SIPAc durante la Maestría en Innovación Educativa con Tecnología e IA de la Universidad de Córdoba. El problema: extraer y clasificar la producción académica de los docentes desde documentos, escaneos e imágenes.\n\nEl sistema encadena OCR multimodal, clasificación automática y extracción de entidades con varios modelos de lenguaje en cascada. Si uno falla o da baja confianza, el siguiente toma el relevo. Luego pasa por revisión humana y termina en un repositorio consultable con dashboard y chat con RAG.\n\nLo más complejo fue diseñar el flujo completo: el documento entra crudo, la IA lo procesa, un humano lo revisa y corrige, y al final queda indexado y listo para consultar.",
      en: "I built SIPAc during the Master's in Educational Innovation with Technology and AI at Universidad de Córdoba. The problem: extracting and classifying academic output from documents, scans, and images.\n\nThe system chains multimodal OCR, automatic classification, and entity extraction across several language models in a fallback cascade. If one fails or returns low confidence, the next one takes over. Then it passes through human review into a queryable repository with a dashboard and RAG-powered chat.\n\nThe most complex part was designing the full pipeline: a raw document goes in, AI processes it, a human reviews and corrects it, and it comes out indexed and searchable.",
    },
    stack: ["nuxt", "vue", "typescript", "pinia", "mongodb"],
    github: "https://github.com/KarloZ7715/SIPAc",
    accent: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    banner: sipacBanner,
    bannerObjectPosition: "center 42%",
    logo: sipacLogo,
    logoBg: "linear-gradient(145deg, #f5efe6 0%, #e8d5c4 100%)",
    logoClass: "!max-h-[56cqw] !max-w-[56cqw]",
  },
  {
    slug: "Boolitaz",
    name: "Boolitaz",
    tagline: {
      es: "Tienda virtual con delivery y gachapon de cartas coleccionables",
      en: "Online store with delivery and collectible card gacha game",
    },
    description: {
      es: "Boolitaz empezó como tienda virtual para un negocio local de bolitas, pero terminó siendo dos cosas: un e-commerce con delivery y un juego gachapon de cartas coleccionables. Corre en Render con Supabase.\n\nLa tienda tiene catálogo de productos, carrito persistente con sincronización entre pestañas, cálculo de delivery con Google Routes API y pedidos por WhatsApp. El sistema gachapon permite canjear códigos por cartas con rarezas probabilísticas, animación 3D de reveal y leaderboard por insignias. Todo se gestiona desde un panel de administración con estadísticas, productos, rarezas, tarjetas y configuración de delivery.\n\nLo más complejo fue la seguridad. El manejo de datos de clientes me llevó a implementar CSP en modo enforce, rate limiting por ruta y un pipeline de scripts de auditoría que revisan sinks XSS antes de cada release.",
      en: "Boolitaz started as an online store for a local snack business, but ended up being two things: an e-commerce site with delivery and a gacha-style collectible card game. Runs on Render with Supabase.\n\nThe store has a product catalog, cross-tab synced shopping cart, delivery calculation via Google Routes API, and WhatsApp ordering. The gacha system handles code redemption with probability-based rarities, a 3D flip animation, and a badge-tier leaderboard. A full admin panel ties everything together with stats, products, rarities, cards, and delivery configuration.\n\nThe hardest part was security. Handling customer data meant implementing CSP in enforce mode, route-scoped rate limiting, and custom audit scripts that scan for XSS sinks before every release.",
    },
    stack: ["express", "javascript", "html", "css", "postgresql"],
    live: "https://boolitaz-app.onrender.com/",
    accent: "linear-gradient(135deg, #f97316, #ef4444)",
    banner: boolitazBanner,
    bannerObjectPosition: "center 38%",
    logo: boolitazLogo,
    logoBg: "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)",
    logoClass: "!max-h-[54cqw] !max-w-[96cqw]",
  },
  {
    slug: "baud",
    name: "Baud",
    tagline: {
      es: "Emulador de terminal escrito en Rust desde cero",
      en: "Terminal emulator written in Rust from scratch",
    },
    description: {
      es: "Baud es un emulador de terminal escrito en Rust desde cero. Lo empecé para entender qué pasa entre que se aprieta una tecla y aparece un carácter en pantalla: parser ANSI, pseudo-terminales (PTY), renderizado por GPU y manejo de texto Unicode.\n\nLa decisión técnica más interesante fue el renderizado celda-determinista: cada glifo se posiciona en coordenadas exactas de cuadrícula, en vez de usar áreas de texto por fila como hacen la mayoría de terminales. Esto evita que las TUIs se desincronicen con la cuadrícula, un bug común que encontré en otros emuladores al investigar su arquitectura.",
      en: "Baud is a terminal emulator written in Rust from scratch. I started it to understand what happens between pressing a key and a character showing up on screen: ANSI parsing, pseudo-terminals (PTY), GPU rendering, and Unicode text handling.\n\nThe most interesting technical decision was the cell-deterministic renderer: each glyph is positioned at exact grid coordinates instead of using text areas per row like most terminals do. This prevents TUIs from falling out of sync with the grid, a common bug I found in other emulators while researching their architecture.",
    },
    stack: ["rust", "shell"],
    github: "https://github.com/KarloZ7715/Baud",
    accent: "linear-gradient(135deg, #0ea5e9, #0369a1)",
    banner: baudBanner,
    bannerObjectPosition: "center 45%",
    logo: baudLogo,
    logoBg: "linear-gradient(145deg, #0c1018 0%, #1a2535 100%)",
    logoClass: "!max-h-[52cqw] !max-w-[52cqw] rounded-[22%] object-cover ring-1 ring-white/10",
  },
  {
    slug: "electrocode",
    name: "ElectroCode",
    tagline: {
      es: "Asistencia y seguridad corporativa con huella dactilar",
      en: "Fingerprint-based corporate attendance and security",
    },
    description: {
      es: "ElectroCode conecta hardware con software: lectores de huella dactilar que hablan con una plataforma web de asistencia y seguridad corporativa. El backend en Laravel coordina la lógica de negocio mientras Livewire y Alpine.js mantienen la interfaz reactiva sin necesidad de una SPA completa.\n\nLo más complejo fue el modelo de comunicación con los microcontroladores ESP32. La web envía comandos asíncronos, los dispositivos los recogen por polling, y el estado tiene que mantenerse consistente en ambos lados sin conexión persistente.",
      en: "ElectroCode connects hardware with software: fingerprint readers talking to a corporate attendance and security web platform. The Laravel backend handles business logic while Livewire and Alpine.js keep the interface reactive without needing a full SPA.\n\nThe trickiest part was the communication model with the ESP32 microcontrollers. The web app sends async commands, the devices pick them up via polling, and state has to stay consistent on both ends without a persistent connection.",
    },
    stack: ["laravel", "php", "livewire", "alpinejs", "cpp", "arduino", "docker", "mysql"],
    github: "https://github.com/KarloZ7715/fingerprintweb",
    accent: "linear-gradient(135deg, #10b981, #059669)",
    bannerLogo: electrocodeLogo,
    bannerBg: "#000000",
    bannerLogoClass: "max-h-[68%] max-w-[82%]",
    logo: electrocodeLogo,
    logoBg: "#000000",
    logoClass: "!max-h-[50cqw] !max-w-[78cqw]",
  },
];
