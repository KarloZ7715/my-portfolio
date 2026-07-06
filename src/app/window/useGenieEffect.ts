import { useEffect, useRef, useState, type RefObject } from "react";
import { toCanvas } from "html-to-image";
import { useOS } from "../os/OSContext";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";
import { createGenieModel, type GenieRect } from "./genieWarp";
import type { AppId } from "../os/types";

const DURATION_MS = 560;
const OVERLAY_Z = "9990";

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

interface Options {
  appId: AppId;
  minimized: boolean;
  /** Ref to the DOM node representing the full window box (titlebar + content). */
  snapshotRef: RefObject<HTMLElement | null>;
}

function mountOverlayCanvas(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.zIndex = OVERLAY_Z;
  canvas.style.pointerEvents = "none";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  return { canvas, ctx };
}

function playGenie(
  snapshot: HTMLCanvasElement,
  windowRect: GenieRect,
  dockRect: GenieRect,
  direction: "forward" | "reverse"
): { promise: Promise<void>; cancel: () => void } {
  const { canvas, ctx } = mountOverlayCanvas();
  const model = createGenieModel(windowRect, dockRect);
  const start = performance.now();
  let raf = 0;
  let cancelled = false;

  const cleanup = () => {
    if (raf) cancelAnimationFrame(raf);
    canvas.remove();
  };

  const promise = new Promise<void>((resolve) => {
    const frame = (now: number) => {
      if (cancelled) return;
      const t = Math.min(1, (now - start) / DURATION_MS);
      const eased = easeInOutCubic(t);
      const progress = direction === "forward" ? eased : 1 - eased;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      model.draw(ctx, snapshot, progress);
      if (t < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        cleanup();
        resolve();
      }
    };
    raf = requestAnimationFrame(frame);
  });

  return {
    promise,
    cancel: () => {
      cancelled = true;
      cleanup();
    },
  };
}

/**
 * Drives the macOS-style "genie" minimize/restore animation: snapshots the
 * window into a canvas, then warps that snapshot through a Dock-bound
 * funnel shape (see genieWarp.ts) instead of doing a simple scale/translate.
 * Returns whether the *real* window content should currently be hidden —
 * the canvas overlay stands in for it while the warp plays.
 */
export function useGenieEffect({ appId, minimized, snapshotRef }: Options) {
  const { getDockIconRect } = useOS();
  const reduceMotion = usePrefersReducedMotion();
  const [visualHidden, setVisualHidden] = useState(minimized);
  const wasMinimized = useRef(minimized);
  const cachedSnapshot = useRef<HTMLCanvasElement | null>(null);
  const cachedWindowRect = useRef<GenieRect | null>(null);
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (wasMinimized.current === minimized) return;
    wasMinimized.current = minimized;

    cancelRef.current?.();
    cancelRef.current = null;

    if (reduceMotion) {
      setVisualHidden(minimized);
      return;
    }

    let cancelled = false;

    // The overlay canvas is `position: fixed` (viewport-relative), while
    // `state.x/y` are relative to whatever positioned ancestor the window
    // sits in — those two spaces aren't guaranteed to line up exactly
    // (any offset on the desktop root, body margin, etc. would do it).
    // Measuring the real on-screen box sidesteps that entirely, so the
    // overlay always starts/ends exactly where the live window is.
    const liveRect = snapshotRef.current?.getBoundingClientRect();
    const windowRect: GenieRect = liveRect
      ? { x: liveRect.left, y: liveRect.top, width: liveRect.width, height: liveRect.height }
      : cachedWindowRect.current ?? { x: 0, y: 0, width: 0, height: 0 };
    if (minimized) cachedWindowRect.current = windowRect;

    const dockDom = getDockIconRect(appId);
    const dockRect: GenieRect = dockDom
      ? { x: dockDom.left, y: dockDom.top, width: dockDom.width, height: dockDom.height }
      : { x: windowRect.x + windowRect.width / 2 - 4, y: window.innerHeight - 6, width: 8, height: 8 };

    (async () => {
      if (minimized) {
        const node = snapshotRef.current;
        let snapshot: HTMLCanvasElement | null = null;
        if (node) {
          try {
            snapshot = await toCanvas(node, { pixelRatio: 1, skipFonts: true });
          } catch {
            snapshot = null;
          }
        }
        if (cancelled) return;
        cachedSnapshot.current = snapshot;
        setVisualHidden(true);
        if (!snapshot) return;
        const { promise, cancel } = playGenie(snapshot, windowRect, dockRect, "forward");
        cancelRef.current = cancel;
        await promise;
      } else {
        const snapshot = cachedSnapshot.current;
        // Restoring uses the *cached* rect from when we minimized, not a
        // fresh measurement — the real window is still opacity:0 but
        // otherwise laid out normally, so a fresh read would (correctly)
        // return the same box anyway; caching just avoids relying on that.
        const targetRect = cachedWindowRect.current ?? windowRect;
        if (!snapshot) {
          setVisualHidden(false);
          return;
        }
        const { promise, cancel } = playGenie(snapshot, targetRect, dockRect, "reverse");
        cancelRef.current = cancel;
        await promise;
        if (cancelled) return;
        setVisualHidden(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // appId only needs to be read at the moment the transition starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minimized]);

  useEffect(() => () => cancelRef.current?.(), []);

  return { visualHidden };
}
