import type { Lang } from "../../os/types";

export type BioDecoration =
  | "plain"
  | "role"
  | "mark-ts"
  | "mark-py"
  | "mark-rust"
  | "mark-java"
  | "code"
  | "punchline";

export type BioSegment = {
  text: string;
  decoration?: BioDecoration;
};

const BIO: Record<Lang, BioSegment[][]> = {
  en: [
    [
      { text: "I'm a " },
      { text: "systems engineer", decoration: "role" },
      { text: ". I write " },
      { text: "TypeScript", decoration: "mark-ts" },
      { text: ", " },
      { text: "Python", decoration: "mark-py" },
      { text: ", " },
      { text: "Rust", decoration: "mark-rust" },
      { text: ", and " },
      { text: "Java", decoration: "mark-java" },
      { text: ". I've built software that works: terminals, AI systems, online stores, IoT devices." },
    ],
    [
      {
        text: "I live in Montería, Colombia. I run Linux, ride a motorcycle, and listen to more music than my disk can hold. I'd code even if nobody paid me, but the important thing is they pay me (sometimes...).",
      },
    ],
    [
      { text: "If an AI can read my " },
      { text: "code", decoration: "code" },
      { text: " without hallucinating, I did my job " },
      { text: "right", decoration: "punchline" },
      { text: "." },
    ],
  ],
  es: [
    [
      { text: "Soy " },
      { text: "ingeniero de sistemas", decoration: "role" },
      { text: ". Programo en " },
      { text: "TypeScript", decoration: "mark-ts" },
      { text: ", " },
      { text: "Python", decoration: "mark-py" },
      { text: ", " },
      { text: "Rust", decoration: "mark-rust" },
      { text: " y " },
      { text: "Java", decoration: "mark-java" },
      { text: ". He construido software que funciona: terminales, sistemas de IA, tiendas en línea, dispositivos IoT." },
    ],
    [
      {
        text: "Vivo en Montería, Colombia. Uso Linux, manejo moto, escucho más música de la que mi disco soporta. Programo porque me gusta. Si no me pagaran, lo haría igual, lo importante es que me pagan (a veces...).",
      },
    ],
    [
      { text: "Si una IA puede leer mi " },
      { text: "código", decoration: "code" },
      { text: " sin alucinar, hice bien mi " },
      { text: "trabajo", decoration: "punchline" },
      { text: "." },
    ],
  ],
};

export function getBioParagraphs(lang: Lang): BioSegment[][] {
  return BIO[lang];
}
