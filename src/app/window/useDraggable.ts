import { useCallback, useRef } from "react";

export function useDraggable(
  onMove: (x: number, y: number) => void,
  getStart: () => { x: number; y: number }
) {
  const state = useRef<{ startX: number; startY: number; origX: number; origY: number; raf: number | null } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
      const orig = getStart();
      state.current = { startX: e.clientX, startY: e.clientY, origX: orig.x, origY: orig.y, raf: null };
    },
    [getStart]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const s = state.current;
      if (!s) return;
      const dx = e.clientX - s.startX;
      const dy = e.clientY - s.startY;
      if (s.raf) cancelAnimationFrame(s.raf);
      s.raf = requestAnimationFrame(() => {
        onMove(Math.max(0, s.origX + dx), Math.max(28, s.origY + dy));
      });
    },
    [onMove]
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    if (state.current?.raf) cancelAnimationFrame(state.current.raf);
    state.current = null;
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp };
}
