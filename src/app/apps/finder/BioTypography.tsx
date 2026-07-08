import { motion, type Variants } from "motion/react";
import type { BioDecoration, BioSegment } from "./bio-content";
import { BioCode, BioLang, BioPunchline, BioRole } from "./bio-annotations";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

const LANG_DELAY: Partial<Record<BioDecoration, number>> = {
  "mark-ts": 0.04,
  "mark-py": 0.08,
  "mark-rust": 0.12,
  "mark-java": 0.16,
};

function BioSegmentText({ segment, index }: { segment: BioSegment; index: number }) {
  const decoration = segment.decoration ?? "plain";
  const delay = (LANG_DELAY[decoration] ?? 0) + index * 0.01;

  if (decoration === "plain") {
    return <>{segment.text}</>;
  }

  switch (decoration) {
    case "role":
      return <BioRole>{segment.text}</BioRole>;
    case "mark-ts":
      return (
        <BioLang lang="ts" delay={delay}>
          {segment.text}
        </BioLang>
      );
    case "mark-py":
      return (
        <BioLang lang="py" delay={delay}>
          {segment.text}
        </BioLang>
      );
    case "mark-rust":
      return (
        <BioLang lang="rust" delay={delay}>
          {segment.text}
        </BioLang>
      );
    case "mark-java":
      return (
        <BioLang lang="java" delay={delay}>
          {segment.text}
        </BioLang>
      );
    case "code":
      return <BioCode delay={0.06}>{segment.text}</BioCode>;
    case "punchline":
      return <BioPunchline delay={0.1}>{segment.text}</BioPunchline>;
    default: {
      const _exhaustive: never = decoration;
      return _exhaustive;
    }
  }
}

export function BioParagraph({ segments }: { segments: BioSegment[] }) {
  return (
    <motion.p
      className="bio-paragraph text-[14px] leading-[1.68] text-[color:var(--macos-text-secondary)]"
      variants={itemVariants}
    >
      {segments.map((segment, i) => (
        <BioSegmentText key={i} segment={segment} index={i} />
      ))}
    </motion.p>
  );
}
