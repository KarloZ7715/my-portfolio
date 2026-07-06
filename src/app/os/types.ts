import type { ComponentType, ReactNode } from "react";

export type AppId =
  | "finder"
  | "projects"
  | "skills"
  | "mail"
  | "terminal";

export type Lang = "es" | "en";

export interface WindowState {
  id: AppId;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  prev?: { x: number; y: number; width: number; height: number };
}

export interface AppDef {
  id: AppId;
  titleKey: string;
  icon: ReactNode;
  component: ComponentType;
  defaultSize: { width: number; height: number };
  defaultPos?: { x: number; y: number };
  minSize?: { width: number; height: number };
}
