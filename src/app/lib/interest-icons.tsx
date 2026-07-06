import type { CSSProperties } from "react";
import gamepadSvg from "../assets/interest-icons/gamepad-2.svg?raw";
import sparklesSvg from "../assets/interest-icons/sparkles.svg?raw";
import motorcycleSvg from "../assets/interest-icons/motorcycle.svg?raw";

export interface InterestIconProps {
  className?: string;
  style?: CSSProperties;
}

function normalizeSvg(raw: string): string {
  return raw
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\swidth="[^"]*"/, ' width="100%"')
    .replace(/\sheight="[^"]*"/, ' height="100%"')
    .replace(/\sclass="[^"]*"/, "");
}

function DownloadedSvgIcon({ svg, className, style }: { svg: string } & InterestIconProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className ?? "size-4"}`}
      style={style}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: normalizeSvg(svg) }}
    />
  );
}

/** Lucide Static — gamepad-2.svg */
export function InterestGamepadIcon(props: InterestIconProps) {
  return <DownloadedSvgIcon svg={gamepadSvg} {...props} />;
}

/** Lucide Static — sparkles.svg */
export function InterestSparklesIcon(props: InterestIconProps) {
  return <DownloadedSvgIcon svg={sparklesSvg} {...props} />;
}

/** Phosphor Icons — motorcycle.svg */
export function InterestMotorcycleIcon(props: InterestIconProps) {
  return <DownloadedSvgIcon svg={motorcycleSvg} {...props} />;
}
