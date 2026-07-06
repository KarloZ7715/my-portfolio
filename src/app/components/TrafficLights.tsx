import { X, Minus, Plus } from "lucide-react";
import { useTheme } from "../os/ThemeContext";

interface Props {
  onClose: () => void;
  onMinimize: () => void;
  /** Alt/Option-click triggers instant fullscreen (no animation), matching macOS. */
  onMaximize: (opts: { instant: boolean }) => void;
  /** Window has keyboard focus */
  active: boolean;
  /** Cursor is over this window's title bar area */
  hovered: boolean;
}

// The invisible `::before` hit-area must stay smaller than half the gap
// between buttons (8px gap, 12px wide dots => 20px center-to-center), or
// neighbouring buttons' hit zones overlap and steal each other's clicks.
const base =
  "relative size-[12px] rounded-full flex items-center justify-center transition-colors duration-150 active:scale-[0.96] before:absolute before:-inset-1 before:content-['']";

export function TrafficLights({ onClose, onMinimize, onMaximize, hovered }: Props) {
  const { resolved } = useTheme();
  const colored = hovered;
  const idleGray = resolved === "dark" ? "bg-[#5a5a5e]" : "bg-[#c9c9cf]";

  return (
    <div
      className="group flex items-center gap-2 pl-3 pr-2 select-none"
      onPointerDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className={`${base} ${colored ? "bg-[#ff5f57]" : idleGray}`}
        style={{ boxShadow: colored ? "inset 0 0 0 0.5px rgba(0,0,0,0.15)" : undefined }}
      >
        <X className="size-[8px] text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
      </button>
      <button
        aria-label="Minimize"
        onClick={onMinimize}
        className={`${base} ${colored ? "bg-[#febc2e]" : idleGray}`}
      >
        <Minus className="size-[8px] text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
      </button>
      <button
        aria-label="Maximize"
        onClick={(e) => onMaximize({ instant: e.altKey })}
        className={`${base} ${colored ? "bg-[#28c840]" : idleGray}`}
      >
        <Plus className="size-[8px] text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
      </button>
    </div>
  );
}
