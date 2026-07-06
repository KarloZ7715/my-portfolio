import { createContext, useCallback, useContext, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import type { AppId, WindowState } from "./types";
import { APPS, getApp } from "./apps.registry";

interface OSState {
  windows: Record<string, WindowState>;
  order: AppId[];
  activeId: AppId | null;
  nextZ: number;
}

type Action =
  | { type: "open"; id: AppId }
  | { type: "close"; id: AppId }
  | { type: "focus"; id: AppId }
  | { type: "minimize"; id: AppId }
  | { type: "toggleMax"; id: AppId; screen: { w: number; h: number } }
  | { type: "move"; id: AppId; x: number; y: number }
  | { type: "resize"; id: AppId; width: number; height: number; x?: number; y?: number };

const initial: OSState = { windows: {}, order: [], activeId: null, nextZ: 10 };

function reducer(state: OSState, a: Action): OSState {
  switch (a.type) {
    case "open": {
      const app = getApp(a.id);
      if (!app) return state;
      const existing = state.windows[a.id];
      if (existing) {
        return {
          ...state,
          windows: { ...state.windows, [a.id]: { ...existing, minimized: false, z: state.nextZ } },
          nextZ: state.nextZ + 1,
          activeId: a.id,
        };
      }
      const openCount = state.order.length;
      const w = app.defaultSize.width;
      const h = app.defaultSize.height;
      const x = app.defaultPos?.x ?? 120 + openCount * 32;
      const y = app.defaultPos?.y ?? 80 + openCount * 32;
      return {
        ...state,
        windows: {
          ...state.windows,
          [a.id]: { id: a.id, x, y, width: w, height: h, z: state.nextZ, minimized: false, maximized: false },
        },
        order: [...state.order, a.id],
        activeId: a.id,
        nextZ: state.nextZ + 1,
      };
    }
    case "close": {
      const { [a.id]: _, ...rest } = state.windows;
      const order = state.order.filter((x) => x !== a.id);
      return { ...state, windows: rest, order, activeId: state.activeId === a.id ? order.at(-1) ?? null : state.activeId };
    }
    case "focus": {
      const w = state.windows[a.id];
      if (!w) return state;
      return { ...state, windows: { ...state.windows, [a.id]: { ...w, z: state.nextZ, minimized: false } }, nextZ: state.nextZ + 1, activeId: a.id };
    }
    case "minimize": {
      const w = state.windows[a.id];
      if (!w) return state;
      return { ...state, windows: { ...state.windows, [a.id]: { ...w, minimized: true } }, activeId: state.activeId === a.id ? null : state.activeId };
    }
    case "toggleMax": {
      const w = state.windows[a.id];
      if (!w) return state;
      if (w.maximized && w.prev) {
        return { ...state, windows: { ...state.windows, [a.id]: { ...w, ...w.prev, maximized: false, prev: undefined } } };
      }
      return {
        ...state,
        windows: {
          ...state.windows,
          [a.id]: {
            ...w,
            prev: { x: w.x, y: w.y, width: w.width, height: w.height },
            x: 0,
            y: 28,
            width: a.screen.w,
            height: a.screen.h - 28 - 88,
            maximized: true,
          },
        },
      };
    }
    case "move": {
      const w = state.windows[a.id];
      if (!w) return state;
      return { ...state, windows: { ...state.windows, [a.id]: { ...w, x: a.x, y: a.y } } };
    }
    case "resize": {
      const w = state.windows[a.id];
      if (!w) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [a.id]: { ...w, width: a.width, height: a.height, x: a.x ?? w.x, y: a.y ?? w.y },
        },
      };
    }
    default: {
      const _exhaustive: never = a;
      return state;
    }
  }
}

interface OSCtx {
  windows: Record<string, WindowState>;
  order: AppId[];
  activeId: AppId | null;
  openApp: (id: AppId) => void;
  closeApp: (id: AppId) => void;
  focusApp: (id: AppId) => void;
  minimizeApp: (id: AppId) => void;
  toggleMax: (id: AppId) => void;
  moveWindow: (id: AppId, x: number, y: number) => void;
  resizeWindow: (id: AppId, w: number, h: number, x?: number, y?: number) => void;
  hideAll: () => void;
  cycleFocus: () => void;
  registerDockIcon: (id: AppId, el: HTMLButtonElement | null) => void;
  getDockIconRect: (id: AppId) => DOMRect | null;
  selectedProjectSlug: string | null;
  selectProject: (slug: string) => void;
}

const Ctx = createContext<OSCtx | null>(null);

export function OSProvider({ children }: { children: ReactNode }) {
  const [s, dispatch] = useReducer(reducer, initial);
  const dockIconRefs = useRef<Partial<Record<AppId, HTMLButtonElement>>>({});
  const [selectedProjectSlug, selectProject] = useState<string | null>(null);

  const openApp = useCallback((id: AppId) => dispatch({ type: "open", id }), []);
  const closeApp = useCallback((id: AppId) => dispatch({ type: "close", id }), []);
  const focusApp = useCallback((id: AppId) => dispatch({ type: "focus", id }), []);
  const minimizeApp = useCallback((id: AppId) => dispatch({ type: "minimize", id }), []);
  const toggleMax = useCallback((id: AppId) => {
    dispatch({ type: "toggleMax", id, screen: { w: window.innerWidth, h: window.innerHeight } });
  }, []);
  const moveWindow = useCallback((id: AppId, x: number, y: number) => dispatch({ type: "move", id, x, y }), []);
  const resizeWindow = useCallback(
    (id: AppId, width: number, height: number, x?: number, y?: number) =>
      dispatch({ type: "resize", id, width, height, x, y }),
    []
  );
  const hideAll = useCallback(() => {
    for (const id of Object.keys(s.windows) as AppId[]) dispatch({ type: "minimize", id });
  }, [s.windows]);
  const cycleFocus = useCallback(() => {
    const openIds = s.order.filter((id) => s.windows[id] && !s.windows[id].minimized);
    if (openIds.length < 2) return;
    const idx = s.activeId ? openIds.indexOf(s.activeId) : -1;
    const next = openIds[(idx + 1) % openIds.length];
    dispatch({ type: "focus", id: next });
  }, [s.order, s.windows, s.activeId]);
  const registerDockIcon = useCallback((id: AppId, el: HTMLButtonElement | null) => {
    if (el) dockIconRefs.current[id] = el;
    else delete dockIconRefs.current[id];
  }, []);
  const getDockIconRect = useCallback((id: AppId) => {
    const el = dockIconRefs.current[id];
    return el ? el.getBoundingClientRect() : null;
  }, []);
  const value = useMemo(
    () => ({
      windows: s.windows,
      order: s.order,
      activeId: s.activeId,
      openApp,
      closeApp,
      focusApp,
      minimizeApp,
      toggleMax,
      moveWindow,
      resizeWindow,
      hideAll,
      cycleFocus,
      registerDockIcon,
      getDockIconRect,
      selectedProjectSlug,
      selectProject,
    }),
    [
      s,
      openApp,
      closeApp,
      focusApp,
      minimizeApp,
      toggleMax,
      moveWindow,
      resizeWindow,
      hideAll,
      cycleFocus,
      registerDockIcon,
      getDockIconRect,
      selectedProjectSlug,
      selectProject,
    ]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOS() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useOS must be used within OSProvider");
  return c;
}

export { APPS };
