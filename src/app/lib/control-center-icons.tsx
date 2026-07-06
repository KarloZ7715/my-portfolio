import type { CSSProperties } from "react";
import wifiSvg from "../assets/control-center-icons/wifi.svg?raw";
import bluetoothSvg from "../assets/control-center-icons/bluetooth.svg?raw";
import moonSvg from "../assets/control-center-icons/moon.fill.svg?raw";
import keyboardBrightnessSvg from "../assets/control-center-icons/keyboard.brightness.svg?raw";
import airplayVideoSvg from "../assets/control-center-icons/airplay.video.svg?raw";
import sunMaxSvg from "../assets/control-center-icons/sun.max.fill.svg?raw";
import speakerSvg from "../assets/control-center-icons/speaker.wave.2.fill.svg?raw";
import airplayAudioSvg from "../assets/control-center-icons/airplay.audio.svg?raw";
import chevronRightSvg from "../assets/control-center-icons/chevron.right.svg?raw";
import playSvg from "../assets/control-center-icons/play.fill.svg?raw";
import pauseSvg from "../assets/control-center-icons/pause.fill.svg?raw";
import forwardSvg from "../assets/control-center-icons/forward.fill.svg?raw";

export interface CCIconProps {
  className?: string;
  style?: CSSProperties;
}

function normalizeSvg(raw: string): string {
  return raw
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<title>[\s\S]*?<\/title>/g, "")
    .replace(/\swidth="[^"]*"/, ' width="100%"')
    .replace(/\sheight="[^"]*"/, ' height="100%"')
    .replace(/\sclass="[^"]*"/, "");
}

function SFSymbol({ svg, className, style }: { svg: string } & CCIconProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className ?? "size-4"}`}
      style={style}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: normalizeSvg(svg) }}
    />
  );
}

export function CCWifiIcon(props: CCIconProps) {
  return <SFSymbol svg={wifiSvg} {...props} />;
}

export function CCBluetoothIcon(props: CCIconProps) {
  return <SFSymbol svg={bluetoothSvg} {...props} />;
}

export function CCAirDropIcon(props: CCIconProps) {
  return <SFSymbol svg={airplayAudioSvg} {...props} />;
}

export function CCMoonIcon(props: CCIconProps) {
  return <SFSymbol svg={moonSvg} {...props} />;
}

export function CCKeyboardBrightnessIcon(props: CCIconProps) {
  return <SFSymbol svg={keyboardBrightnessSvg} {...props} />;
}

export function CCAirPlayVideoIcon(props: CCIconProps) {
  return <SFSymbol svg={airplayVideoSvg} {...props} />;
}

export function CCSunMaxIcon(props: CCIconProps) {
  return <SFSymbol svg={sunMaxSvg} {...props} />;
}

export function CCSpeakerIcon(props: CCIconProps) {
  return <SFSymbol svg={speakerSvg} {...props} />;
}

export function CCAirPlayAudioIcon(props: CCIconProps) {
  return <SFSymbol svg={airplayAudioSvg} {...props} />;
}

export function CCChevronRightIcon(props: CCIconProps) {
  return <SFSymbol svg={chevronRightSvg} {...props} />;
}

export function CCPlayIcon(props: CCIconProps) {
  return <SFSymbol svg={playSvg} {...props} />;
}

export function CCPauseIcon(props: CCIconProps) {
  return <SFSymbol svg={pauseSvg} {...props} />;
}

export function CCForwardIcon(props: CCIconProps) {
  return <SFSymbol svg={forwardSvg} {...props} />;
}
