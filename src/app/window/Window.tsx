import { motion } from "motion/react";
import { memo, Suspense, useCallback, useRef, useState } from "react";
import type { AppDef, WindowState } from "../os/types";
import { useOS } from "../os/OSContext";
import { useT } from "../os/i18n";
import { TrafficLights } from "../components/TrafficLights";
import { useDraggable } from "./useDraggable";
import { useResizable, type ResizeEdge } from "./useResizable";
import { useGenieEffect } from "./useGenieEffect";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";
import { useIsMobile } from "../lib/useMediaQuery";

interface Props {
  app: AppDef;
  state: WindowState;
}

const EDGES: { edge: ResizeEdge; className: string }[] = [
  { edge: "n", className: "absolute top-0 left-2 right-2 h-1 cursor-ns-resize" },
  { edge: "s", className: "absolute bottom-0 left-2 right-2 h-1 cursor-ns-resize" },
  { edge: "e", className: "absolute right-0 top-2 bottom-2 w-1 cursor-ew-resize" },
  { edge: "w", className: "absolute left-0 top-2 bottom-2 w-1 cursor-ew-resize" },
  { edge: "ne", className: "absolute right-0 top-0 size-2 cursor-nesw-resize" },
  { edge: "nw", className: "absolute left-0 top-0 size-2 cursor-nwse-resize" },
  { edge: "se", className: "absolute right-0 bottom-0 size-2 cursor-nwse-resize" },
  { edge: "sw", className: "absolute left-0 bottom-0 size-2 cursor-nesw-resize" },
];

const RECT_TRANSITION =
  "left 0.38s cubic-bezier(0.32,0.72,0,1), top 0.38s cubic-bezier(0.32,0.72,0,1), width 0.38s cubic-bezier(0.32,0.72,0,1), height 0.38s cubic-bezier(0.32,0.72,0,1)";

export const Window = memo(function Window({ app, state }: Props) {
  const { moveWindow, resizeWindow, focusApp, closeApp, minimizeApp, toggleMax, activeId } = useOS();
  const { t } = useT();
  const active = activeId === app.id;
  const [hovered, setHovered] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const boxRef = useRef<HTMLDivElement>(null);

  // Genie minimize/restore is driven entirely by a canvas overlay warping a
  // snapshot of `boxRef` toward the Dock icon — see useGenieEffect for why.
  const { visualHidden } = useGenieEffect({
    appId: app.id,
    minimized: state.minimized,
    snapshotRef: boxRef,
  });

  const drag = useDraggable(
    (x, y) => moveWindow(app.id, x, y),
    useCallback(() => ({ x: state.x, y: state.y }), [state.x, state.y])
  );

  const resize = useResizable(
    (w, h, x, y) => resizeWindow(app.id, w, h, x, y),
    useCallback(() => ({ x: state.x, y: state.y, width: state.width, height: state.height }), [state.x, state.y, state.width, state.height]),
    app.minSize?.width,
    app.minSize?.height
  );

  const onDragStart = (e: React.PointerEvent) => {
    setInteracting(true);
    drag.onPointerDown(e);
  };
  const onDragEnd = (e: React.PointerEvent) => {
    setInteracting(false);
    drag.onPointerUp(e);
  };
  const resizeStart = (edge: ResizeEdge) => (e: React.PointerEvent) => {
    setInteracting(true);
    resize.start(edge)(e);
  };
  const resizeEnd = (e: React.PointerEvent) => {
    setInteracting(false);
    resize.end(e);
  };

  const handleMaximize = ({ instant }: { instant: boolean }) => {
    if (instant) {
      setInteracting(true);
      toggleMax(app.id);
      requestAnimationFrame(() => requestAnimationFrame(() => setInteracting(false)));
    } else {
      toggleMax(app.id);
    }
  };

  const AppComponent = app.component;

  return (
    <motion.div
      ref={boxRef}
      role="dialog"
      aria-label={t(app.titleKey)}
      onPointerDownCapture={() => !active && focusApp(app.id)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85, filter: "blur(8px)" }}
      animate={{ opacity: visualHidden ? 0 : 1, scale: 1, filter: "blur(0px)" }}
      exit={
        reduceMotion
          ? { opacity: 0, transition: { duration: 0.12 } }
          : { opacity: 0, scale: 0.92, filter: "blur(6px)", transition: { duration: 0.18, ease: "easeIn" } }
      }
      transition={{
        scale: { type: "spring", stiffness: 380, damping: 26 },
        filter: { duration: 0.22 },
        opacity: { duration: 0.08 },
      }}
      className={isMobile ? "absolute overflow-hidden" : "absolute overflow-hidden rounded-[10px]"}
      style={{
        left: isMobile ? 0 : state.x,
        top: isMobile ? 28 : state.y,
        width: isMobile ? "100vw" : state.width,
        height: isMobile ? "calc(100dvh - 28px - 76px)" : state.height,
        zIndex: state.z,
        transition: interacting || isMobile ? "none" : RECT_TRANSITION,
        boxShadow: active
          ? "0 0 0 0.5px rgba(0,0,0,0.28), 0 24px 48px -12px rgba(0,0,0,0.42), 0 10px 20px -8px rgba(0,0,0,0.28)"
          : "0 0 0 0.5px rgba(0,0,0,0.18), 0 16px 32px -12px rgba(0,0,0,0.28), 0 6px 12px -6px rgba(0,0,0,0.18)",
        pointerEvents: state.minimized ? "none" : "auto",
        willChange: "transform, opacity",
      }}
    >
      {/* Focus pulse wrapper — replays whenever this window is brought to front */}
      <motion.div
        key={state.z}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.006, 1] }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className="w-full h-full flex flex-col"
      >
        {/* Titlebar */}
        <div
          onPointerDown={onDragStart}
          onPointerMove={drag.onPointerMove}
          onPointerUp={onDragEnd}
          onDoubleClick={() => toggleMax(app.id)}
          className="flex items-center h-[38px] shrink-0 select-none cursor-default bg-[color:var(--macos-titlebar-bg)] border-b border-[color:var(--macos-hairline)]"
        >
          {!isMobile && (
            <TrafficLights
              active={active}
              hovered={hovered}
              onClose={() => closeApp(app.id)}
              onMinimize={() => minimizeApp(app.id)}
              onMaximize={handleMaximize}
            />
          )}
          {isMobile && (
            <button
              aria-label={t("window.back")}
              onClick={() => closeApp(app.id)}
              onPointerDown={(e) => e.stopPropagation()}
              className="flex items-center gap-1 h-full pl-3 pr-2 text-[13px] text-[color:var(--macos-accent)] active:opacity-60"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              {t("window.back")}
            </button>
          )}
          <div className="flex-1 text-center text-[13px] text-[color:var(--macos-text-secondary)] pointer-events-none pr-[68px]">
            {t(app.titleKey)}
          </div>
        </div>

        {/* Content */}
          <div className="flex-1 overflow-hidden bg-[color:var(--macos-window-bg)] text-[color:var(--macos-text-primary)]">
            <Suspense fallback={<div className="flex items-center justify-center h-full" />}>
              <AppComponent />
            </Suspense>
          </div>
      </motion.div>

      {/* Resize handles */}
      {!state.maximized &&
        !isMobile &&
        EDGES.map((e) => (
          <div
            key={e.edge}
            className={e.className}
            onPointerDown={resizeStart(e.edge)}
            onPointerMove={resize.move}
            onPointerUp={resizeEnd}
          />
        ))}
    </motion.div>
  );
});
