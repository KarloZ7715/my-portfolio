/**
 * Row-based "genie" warp, inspired by Harshil Shah's SpriteKit mesh-warp
 * writeup (https://harshil.net/blog/recreating-the-mac-genie-effect) and
 * Loris Sigrist's SVG-filter browser recreation
 * (https://github.com/LorisSigrist/genie-demo).
 *
 * Neither approach ports 1:1 to a plain `<canvas>`:
 * - A true mesh/warp-geometry primitive (SpriteKit's `SKWarpGeometryGrid`)
 *   doesn't exist on the web.
 * - `feDisplacementMap` gives a smooth per-pixel warp, but Loris' simple
 *   parabola only looks right when the animated element is much smaller
 *   than the distance it travels (true for his "add to cart" demo, not
 *   for a window that's a large fraction of the screen next to a Dock
 *   that's *close* to it) — with our proportions it overshoots badly.
 *
 * This keeps Harshil's clamped bezier/easing model (so the curve can't
 * blow up regardless of window-to-Dock proportions) but renders it as a
 * stack of plain, unclipped `drawImage` rectangles instead of clipped
 * quadrilaterals. Clipped paths anti-alias their own boundary, so two
 * bands whose edges are mathematically identical still leave a hairline
 * seam; plain abutting rectangles never do, at the cost of the row edges
 * being stepped rather than perfectly slanted (invisible at 60+ rows).
 */

export interface GenieRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Only the bottom fraction of the window actually feels the curve — the
 * top stays visually rigid, like the article's "top edge remains fixed",
 * extended a bit further down so the effect doesn't look exaggerated when
 * the window is tall relative to the gap between it and the Dock. */
const TOP_ANCHOR_FRACTION = 0.55;

function easeInQuad(t: number): number {
  return t * t;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

interface GenieModel {
  /** Draws the warped snapshot for a given overall progress (0 = full window, 1 = fully in the Dock). */
  draw: (ctx: CanvasRenderingContext2D, snapshot: CanvasImageSource, progress: number) => void;
}

/**
 * Builds the reusable per-frame draw function for a single genie animation
 * between `windowRect` (the real window's on-screen rect) and `dockRect`
 * (the target Dock icon rect). Coordinates are CSS px, viewport-relative.
 *
 * The funnel shape itself is static (always targets the Dock's final
 * edges) — only the vertical position of the window's top/bottom edges
 * animates with `progress`, so rows "flow through" the fixed funnel field
 * exactly like water through a tube, rather than the field itself
 * reshaping over time.
 */
export function createGenieModel(windowRect: GenieRect, dockRect: GenieRect, rows = 64): GenieModel {
  const topY0 = windowRect.y;
  const bottomY0 = windowRect.y + windowRect.height;
  const topY1 = dockRect.y;
  const bottomY1 = dockRect.y + dockRect.height;

  const leftX0 = windowRect.x;
  const rightX0 = windowRect.x + windowRect.width;
  const leftX1 = dockRect.x;
  const rightX1 = dockRect.x + dockRect.width;

  const bezierTop = windowRect.y + windowRect.height * TOP_ANCHOR_FRACTION;
  const bezierBottom = topY1;
  const bezierHeight = Math.max(1, bezierBottom - bezierTop);

  function sheared(y: number, x0: number, x1: number): number {
    if (y >= bezierBottom) return x1;
    if (y <= bezierTop) return x0;
    const t = easeInQuad((y - bezierTop) / bezierHeight);
    return x0 + t * (x1 - x0);
  }

  return {
    draw(ctx, snapshot, progress) {
      const translateProgress = clamp01(progress);
      const verticalTranslation = (topY1 - topY0) * translateProgress;
      const topEdgeY = topY0 + verticalTranslation;
      const bottomEdgeY = Math.min(bottomY0 + verticalTranslation, bottomY1);

      const snapW = (snapshot as HTMLCanvasElement).width;
      const snapH = (snapshot as HTMLCanvasElement).height;
      const fadeStart = 0.82;
      const alpha = progress <= fadeStart ? 1 : 1 - (progress - fadeStart) / (1 - fadeStart);
      ctx.globalAlpha = Math.max(0, alpha);

      for (let i = 0; i < rows; i++) {
        const fracTop = i / rows;
        const fracBottom = (i + 1) / rows;
        const yTop = topEdgeY + fracTop * (bottomEdgeY - topEdgeY);
        const yBottom = topEdgeY + fracBottom * (bottomEdgeY - topEdgeY);
        const destH = yBottom - yTop;
        if (destH < 0.05) continue;

        // Evaluate the curve once at the row's midpoint: every row is a
        // plain axis-aligned rectangle (no clip path), so neighbouring
        // rows always abut exactly along their shared Y edge with zero
        // gap — the curve reads as a "stepped" slant instead of a
        // perfectly smooth diagonal, invisible at this row count.
        const yMid = (yTop + yBottom) / 2;
        const xLeft = sheared(yMid, leftX0, leftX1);
        const xRight = sheared(yMid, rightX0, rightX1);
        const destW = xRight - xLeft;
        if (destW <= 0.1) continue;

        const srcY = fracTop * snapH;
        const srcH = Math.max(1, (fracBottom - fracTop) * snapH);

        ctx.drawImage(snapshot, 0, srcY, snapW, srcH, xLeft, yTop, destW, destH);
      }

      ctx.globalAlpha = 1;
    },
  };
}
