import type { ImgHTMLAttributes, ReactNode } from "react";
import finderIcon from "../assets/dock-icons/finder.webp";
import mailIcon from "../assets/dock-icons/mail.webp";
import terminalIcon from "../assets/dock-icons/terminal.webp";
import xcodeIcon from "../assets/dock-icons/xcode.webp";
import launchpadIcon from "../assets/dock-icons/launchpad.webp";

/**
 * macOS-style dock icons (downloaded assets, not hand-drawn):
 * - finder, mail, terminal @ 1024px — macOS Icon Gallery (Jim Nielsen), cdn.jim-nielsen.com
 * - xcode, launchpad @ 100px — Symbl default macOS app icons, symbl.revend.group/macos.html
 */
export type DockIconProps = ImgHTMLAttributes<HTMLImageElement>;

function DockPng({ src, className, ...rest }: DockIconProps & { src: string }) {
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      className={`size-full object-contain select-none ${className ?? ""}`}
      {...rest}
    />
  );
}

export function DockAboutIcon(props: DockIconProps) {
  return <DockPng src={finderIcon} {...props} />;
}

export function DockProjectsIcon(props: DockIconProps) {
  return <DockPng src={xcodeIcon} {...props} />;
}

export function DockSkillsIcon(props: DockIconProps) {
  return <DockPng src={launchpadIcon} {...props} />;
}

export function DockMailIcon(props: DockIconProps) {
  return <DockPng src={mailIcon} {...props} />;
}

export function DockTerminalIcon(props: DockIconProps) {
  return <DockPng src={terminalIcon} {...props} />;
}

export function dockAppIcon(Icon: (props: DockIconProps) => ReactNode) {
  return <Icon className="size-full" />;
}
