import { lazy, type ComponentType } from "react";
import {
  DockAboutIcon,
  DockMailIcon,
  DockProjectsIcon,
  DockSkillsIcon,
  DockTerminalIcon,
  dockAppIcon,
} from "../lib/dock-app-icons";
import type { AppDef, AppId } from "./types";

function lazyNamed<T extends Record<string, ComponentType<any>>>(importer: () => Promise<T>, key: keyof T) {
  return lazy(() => importer().then((m) => ({ default: m[key] })));
}

export const APPS: AppDef[] = [
  {
    id: "finder",
    titleKey: "app.finder",
    icon: dockAppIcon(DockAboutIcon),
    component: lazyNamed(() => import("../apps/finder/AboutApp"), "AboutApp"),
    defaultSize: { width: 820, height: 600 },
    minSize: { width: 540, height: 400 },
  },
  {
    id: "projects",
    titleKey: "app.projects",
    icon: dockAppIcon(DockProjectsIcon),
    component: lazyNamed(() => import("../apps/projects/ProjectsApp"), "ProjectsApp"),
    defaultSize: { width: 860, height: 560 },
    minSize: { width: 560, height: 380 },
  },
  {
    id: "skills",
    titleKey: "app.skills",
    icon: dockAppIcon(DockSkillsIcon),
    component: lazyNamed(() => import("../apps/skills/SkillsApp"), "SkillsApp"),
    defaultSize: { width: 720, height: 540 },
    minSize: { width: 500, height: 360 },
  },
  {
    id: "mail",
    titleKey: "app.mail",
    icon: dockAppIcon(DockMailIcon),
    component: lazyNamed(() => import("../apps/mail/ContactApp"), "ContactApp"),
    defaultSize: { width: 680, height: 520 },
    minSize: { width: 480, height: 360 },
  },
  {
    id: "terminal",
    titleKey: "app.terminal",
    icon: dockAppIcon(DockTerminalIcon),
    component: lazyNamed(() => import("../apps/terminal/TerminalApp"), "TerminalApp"),
    defaultSize: { width: 640, height: 420 },
    minSize: { width: 420, height: 280 },
  },
];

export function getApp(id: AppId): AppDef | undefined {
  return APPS.find((a) => a.id === id);
}
