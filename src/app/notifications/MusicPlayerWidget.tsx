import { useMusic } from "./MusicContext";
import { useT } from "../os/i18n";
import { CCForwardIcon, CCPauseIcon, CCPlayIcon } from "../lib/control-center-icons";
import { MusicNoteGlyph } from "../lib/icons";

interface Props {
  variant?: "default" | "controlCenter";
}

export function MusicPlayerWidget({ variant = "default" }: Props) {
  const { currentTrack, meta, isPlaying, hasStarted, toggle, next } = useMusic();
  const { t } = useT();
  const info = meta[currentTrack.id];
  const compact = variant === "controlCenter";

  if (compact) {
    return (
      <div
        className="rounded-[18px] p-3"
        style={{ background: "var(--macos-cc-module-bg)", boxShadow: "inset 0 0 0 0.5px var(--macos-cc-module-border)" }}
      >
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-[8px] overflow-hidden shrink-0 bg-black/10 flex items-center justify-center">
            {info?.thumbnail ? (
              <img src={info.thumbnail} alt="" className="size-full object-cover" draggable={false} />
            ) : (
              <MusicNoteGlyph className="size-5 text-[color:var(--macos-text-muted)]" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold truncate text-[color:var(--macos-text-primary)] tracking-[-0.08px]">
              {info?.title ?? (hasStarted ? currentTrack.id : t("notifications.noTrack"))}
            </div>
            <div className="text-[11px] truncate text-[color:var(--macos-text-secondary)] mt-px">{info?.author ?? "\u00A0"}</div>
          </div>
          <div className="flex items-center gap-3 shrink-0 pr-0.5">
            <button
              aria-label={isPlaying ? "Pause" : "Play"}
              onClick={toggle}
              className="text-[color:var(--macos-text-primary)] hover:opacity-75 active:scale-[0.92] transition-all"
            >
              {isPlaying ? <CCPauseIcon className="size-[15px]" /> : <CCPlayIcon className="size-[15px]" />}
            </button>
            <button
              aria-label="Next"
              onClick={next}
              className="text-[color:var(--macos-text-primary)] hover:opacity-75 active:scale-[0.92] transition-all"
            >
              <CCForwardIcon className="size-[15px]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-[18px] p-3 flex flex-col gap-2.5"
      style={{ background: "var(--macos-cc-module-bg)", boxShadow: "inset 0 0 0 0.5px var(--macos-cc-module-border)" }}
    >
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[color:var(--macos-text-muted)]">
        <MusicNoteGlyph className="size-3" />
        {t("notifications.nowPlaying")}
      </div>

      <div className="flex items-center gap-3">
        <div className="size-14 rounded-lg overflow-hidden shrink-0 bg-black/10 shadow-sm flex items-center justify-center">
          {info?.thumbnail ? (
            <img src={info.thumbnail} alt="" className="size-full object-cover" draggable={false} />
          ) : (
            <MusicNoteGlyph className="size-6 text-[color:var(--macos-text-muted)]" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-medium truncate text-[color:var(--macos-text-primary)]">
            {info?.title ?? (hasStarted ? currentTrack.id : t("notifications.noTrack"))}
          </div>
          <div className="text-[12px] truncate text-[color:var(--macos-text-muted)]">{info?.author ?? "\u00A0"}</div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-5 pt-1">
        <button
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={toggle}
          className="size-9 rounded-full flex items-center justify-center bg-[color:var(--macos-accent)] text-white active:scale-[0.92] transition-transform"
        >
          {isPlaying ? <CCPauseIcon className="size-4 text-white" /> : <CCPlayIcon className="size-4 text-white" />}
        </button>
        <button
          aria-label="Next"
          onClick={next}
          className="text-[color:var(--macos-text-secondary)] hover:text-[color:var(--macos-text-primary)] active:scale-[0.9] transition-transform"
        >
          <CCForwardIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
