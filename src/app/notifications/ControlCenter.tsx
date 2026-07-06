import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import {
  CCWifiIcon,
  CCBluetoothIcon,
  CCAirDropIcon,
  CCMoonIcon,
  CCKeyboardBrightnessIcon,
  CCAirPlayVideoIcon,
  CCSunMaxIcon,
  CCSpeakerIcon,
  CCAirPlayAudioIcon,
  CCChevronRightIcon,
  type CCIconProps,
} from "../lib/control-center-icons";
import { MusicPlayerWidget } from "./MusicPlayerWidget";
import { useMusic } from "./MusicContext";
import { useT } from "../os/i18n";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

interface Props {
  open: boolean;
  onClose: () => void;
}

const MACOS_BLUE = "#007AFF";
type CCIcon = ComponentType<CCIconProps>;

const moduleStyle: CSSProperties = {
  background: "var(--macos-cc-module-bg)",
  boxShadow: "inset 0 0 0 0.5px var(--macos-cc-module-border)",
};

function CcModule({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[18px] backdrop-blur-sm ${className}`} style={moduleStyle}>
      {children}
    </div>
  );
}

function IconBadge({
  icon: Icon,
  active,
  inactiveStyle,
}: {
  icon: CCIcon;
  active: boolean;
  inactiveStyle?: CSSProperties;
}) {
  return (
    <div
      className="size-[30px] shrink-0 rounded-full flex items-center justify-center"
      style={
        active
          ? { background: MACOS_BLUE, color: "#fff" }
          : { background: "var(--macos-cc-badge-inactive)", color: "var(--macos-text-primary)", ...inactiveStyle }
      }
    >
      <Icon className="size-[15px]" />
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  sublabel,
  active,
  onToggle,
  showChevron,
  hideSublabel,
}: {
  icon: CCIcon;
  label: string;
  sublabel?: string;
  active: boolean;
  onToggle: () => void;
  showChevron?: boolean;
  hideSublabel?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-2.5 w-full px-2.5 py-[7px] rounded-[12px] text-left transition-colors hover:bg-[color:var(--macos-cc-hover)]"
    >
      <IconBadge icon={Icon} active={active} />
      <div className="min-w-0 flex-1 leading-tight">
        <div className="text-[13px] font-semibold text-[color:var(--macos-text-primary)] tracking-[-0.08px]">{label}</div>
        {!hideSublabel && sublabel && (
          <div className="text-[11px] text-[color:var(--macos-text-secondary)] truncate mt-px">{sublabel}</div>
        )}
      </div>
      {showChevron && <CCChevronRightIcon className="size-3 shrink-0 opacity-45 text-[color:var(--macos-text-muted)]" />}
    </button>
  );
}

function UtilityTile({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: CCIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className="rounded-[18px] min-h-[76px] px-2 py-2.5 flex flex-col items-center justify-center gap-1.5 text-center transition-colors hover:brightness-[1.03]"
      style={{
        ...moduleStyle,
        background: active ? MACOS_BLUE : "var(--macos-cc-module-bg)",
        color: active ? "#fff" : "var(--macos-text-primary)",
      }}
    >
      <Icon className="size-[22px]" style={{ color: active ? "#fff" : "var(--macos-text-primary)" }} />
      <span className="text-[11px] font-medium leading-tight px-0.5" style={{ color: active ? "#fff" : "var(--macos-text-primary)" }}>
        {label}
      </span>
    </button>
  );
}

function MacSlider({
  icon: Icon,
  label,
  value,
  onChange,
}: {
  icon: CCIcon;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const fill = Math.max(8, Math.min(100, value));

  return (
    <div className="relative h-9 rounded-full overflow-hidden bg-[color:var(--macos-cc-slider-track)]">
      <div
        className="absolute inset-y-0 left-0 rounded-full flex items-center pl-2.5 pointer-events-none macos-cc-slider-glyph"
        style={{
          width: `${fill}%`,
          background: "var(--macos-cc-slider-fill)",
          color: "var(--macos-cc-slider-icon)",
          boxShadow: "inset 0 0 0 0.5px var(--macos-cc-module-border)",
        }}
      >
        <Icon className="size-4" />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label={label}
      />
    </div>
  );
}

function SliderModule({
  label,
  icon,
  value,
  onChange,
  trailing,
}: {
  label: string;
  icon: CCIcon;
  value: number;
  onChange: (v: number) => void;
  trailing?: ReactNode;
}) {
  return (
    <CcModule className="p-3">
      <div className="text-[13px] font-semibold text-[color:var(--macos-text-primary)] tracking-[-0.08px] mb-2">{label}</div>
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <MacSlider icon={icon} label={label} value={value} onChange={onChange} />
        </div>
        {trailing}
      </div>
    </CcModule>
  );
}

export function ControlCenter({ open, onClose }: Props) {
  const { t } = useT();
  const { volume, setVolume } = useMusic();
  const reduceMotion = usePrefersReducedMotion();
  const [wifiOn, setWifiOn] = useState(true);
  const [btOn, setBtOn] = useState(true);
  const [airdropOn, setAirdropOn] = useState(true);
  const [dndOn, setDndOn] = useState(false);
  const [keyboardBright, setKeyboardBright] = useState(false);
  const [airplayDisplay, setAirplayDisplay] = useState(false);
  const [brightness, setBrightness] = useState(72);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[9997]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-label={t("controlCenter.title")}
            initial={reduceMotion ? { opacity: 0 } : { x: 340, opacity: 0.6 }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { x: 340, opacity: 0.6 }}
            transition={{ type: "spring", stiffness: 420, damping: 38 }}
            className="fixed top-9 right-2 w-[340px] z-[9998] rounded-[20px] overflow-hidden"
            style={{
              background: "var(--macos-sidebar-bg)",
              backdropFilter: "blur(48px) saturate(190%)",
              WebkitBackdropFilter: "blur(48px) saturate(190%)",
              boxShadow: "0 0 0 0.5px var(--macos-cc-module-border), 0 24px 54px -14px rgba(0,0,0,0.45)",
            }}
          >
            <div className="p-3 flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <CcModule className="row-span-2 p-1">
                  <ToggleRow
                    icon={CCWifiIcon}
                    label={t("controlCenter.wifi")}
                    sublabel={wifiOn ? "KarloZOS-5G" : t("controlCenter.off")}
                    active={wifiOn}
                    onToggle={() => setWifiOn((v) => !v)}
                  />
                  <ToggleRow
                    icon={CCBluetoothIcon}
                    label={t("controlCenter.bluetooth")}
                    sublabel={btOn ? t("controlCenter.on") : t("controlCenter.off")}
                    active={btOn}
                    onToggle={() => setBtOn((v) => !v)}
                    hideSublabel={btOn}
                  />
                  <ToggleRow
                    icon={CCAirDropIcon}
                    label={t("controlCenter.airdrop")}
                    sublabel={airdropOn ? t("controlCenter.airdropSublabel") : t("controlCenter.off")}
                    active={airdropOn}
                    onToggle={() => setAirdropOn((v) => !v)}
                    showChevron
                  />
                </CcModule>

                <button
                  type="button"
                  onClick={() => setDndOn((v) => !v)}
                  className="rounded-[18px] flex items-center gap-2.5 px-3 py-2.5 min-h-[54px] text-left transition-colors"
                  style={{
                    background: dndOn ? MACOS_BLUE : "var(--macos-cc-module-bg)",
                    color: dndOn ? "#fff" : "var(--macos-text-primary)",
                    boxShadow: "inset 0 0 0 0.5px var(--macos-cc-module-border)",
                  }}
                >
                  <div
                    className="size-[30px] shrink-0 rounded-full flex items-center justify-center"
                    style={{
                      background: dndOn ? "rgba(255,255,255,0.22)" : "var(--macos-cc-badge-inactive)",
                      color: dndOn ? "#fff" : "var(--macos-text-secondary)",
                    }}
                  >
                    <CCMoonIcon className="size-[14px]" />
                  </div>
                  <span className="text-[13px] font-semibold leading-tight tracking-[-0.08px]">{t("controlCenter.dnd")}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <UtilityTile
                    icon={CCKeyboardBrightnessIcon}
                    label={t("controlCenter.keyboardBrightness")}
                    active={keyboardBright}
                    onClick={() => setKeyboardBright((v) => !v)}
                  />
                  <UtilityTile
                    icon={CCAirPlayVideoIcon}
                    label={t("controlCenter.airplayDisplay")}
                    active={airplayDisplay}
                    onClick={() => setAirplayDisplay((v) => !v)}
                  />
                </div>
              </div>

              <SliderModule
                label={t("controlCenter.brightness")}
                icon={CCSunMaxIcon}
                value={brightness}
                onChange={setBrightness}
              />

              <SliderModule
                label={t("controlCenter.sound")}
                icon={CCSpeakerIcon}
                value={volume}
                onChange={setVolume}
                trailing={
                  <button
                    type="button"
                    aria-label="AirPlay"
                    className="size-9 shrink-0 rounded-full flex items-center justify-center text-[color:var(--macos-text-primary)] transition-colors hover:brightness-110"
                    style={{ background: "var(--macos-cc-badge-inactive)" }}
                  >
                    <CCAirPlayAudioIcon className="size-[18px]" />
                  </button>
                }
              />

              <MusicPlayerWidget variant="controlCenter" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
