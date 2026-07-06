import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { useOS } from "../os/OSContext";
import type { AppId } from "../os/types";

interface Props {
  id: AppId;
  mouseX: MotionValue<number>;
  onClick: () => void;
  isOpen: boolean;
  isActive: boolean;
  label: string;
  children: ReactNode;
}

export function DockIcon({ id, mouseX, onClick, isOpen, isActive, label, children }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const { registerDockIcon } = useOS();

  useEffect(() => {
    registerDockIcon(id, ref.current);
    return () => registerDockIcon(id, null);
  }, [id, registerDockIcon]);

  const distance = useTransform(mouseX, (x) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return 9999;
    return x - rect.x - rect.width / 2;
  });

  const sizeRaw = useTransform(distance, [-120, 0, 120], [44, 66, 44]);
  const size = useSpring(sizeRaw, { mass: 0.1, stiffness: 220, damping: 20 });

  const hovered = useMotionValue(0);

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        style={{ y: hovered }}
        className="absolute -top-8 px-2 py-1 rounded-md bg-black/70 text-white text-[11px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <motion.button
        ref={ref}
        aria-label={label}
        title={label}
        onClick={onClick}
        style={{ width: size, height: size, willChange: "width, height" }}
        className="relative flex items-center justify-center overflow-visible active:scale-[0.96] transition-[transform]"
      >
        {children}
      </motion.button>
      <span
        className="absolute -bottom-2 size-1 rounded-full transition-opacity"
        style={{
          background: "rgba(255,255,255,0.85)",
          opacity: isOpen ? 1 : 0,
          boxShadow: isActive ? "0 0 4px rgba(255,255,255,0.6)" : "none",
        }}
      />
    </div>
  );
}
