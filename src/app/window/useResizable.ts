import { useCallback, useRef } from "react";

export type ResizeEdge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

interface Snapshot {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useResizable(
  onResize: (w: number, h: number, x: number, y: number) => void,
  getSnapshot: () => Snapshot,
  minW = 320,
  minH = 220
) {
  const state = useRef<{ edge: ResizeEdge; startX: number; startY: number; snap: Snapshot; raf: number | null } | null>(null);

  const start = useCallback(
    (edge: ResizeEdge) => (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      e.stopPropagation();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      state.current = { edge, startX: e.clientX, startY: e.clientY, snap: getSnapshot(), raf: null };
    },
    [getSnapshot]
  );

  const move = useCallback(
    (e: React.PointerEvent) => {
      const s = state.current;
      if (!s) return;
      const dx = e.clientX - s.startX;
      const dy = e.clientY - s.startY;
      if (s.raf) cancelAnimationFrame(s.raf);
      s.raf = requestAnimationFrame(() => {
        let { x, y, width, height } = s.snap;
        if (s.edge.includes("e")) width = Math.max(minW, s.snap.width + dx);
        if (s.edge.includes("s")) height = Math.max(minH, s.snap.height + dy);
        if (s.edge.includes("w")) {
          const nw = Math.max(minW, s.snap.width - dx);
          x = s.snap.x + (s.snap.width - nw);
          width = nw;
        }
        if (s.edge.includes("n")) {
          const nh = Math.max(minH, s.snap.height - dy);
          y = Math.max(28, s.snap.y + (s.snap.height - nh));
          height = nh;
        }
        onResize(width, height, x, y);
      });
    },
    [onResize, minW, minH]
  );

  const end = useCallback((e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    if (state.current?.raf) cancelAnimationFrame(state.current.raf);
    state.current = null;
  }, []);

  return { start, move, end };
}
