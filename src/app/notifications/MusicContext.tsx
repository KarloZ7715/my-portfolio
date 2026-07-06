import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import YouTube, { type YouTubePlayer } from "react-youtube";
import { PLAYLIST, type PlaylistTrack } from "./playlist";

export interface TrackMeta {
  title: string;
  author: string;
  thumbnail: string;
}

interface MusicCtx {
  tracks: PlaylistTrack[];
  currentIndex: number;
  currentTrack: PlaylistTrack;
  meta: Record<string, TrackMeta>;
  isPlaying: boolean;
  hasStarted: boolean;
  progress: number;
  duration: number;
  volume: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  select: (index: number) => void;
  setVolume: (v: number) => void;
}

const Ctx = createContext<MusicCtx | null>(null);

interface ProviderProps {
  children: ReactNode;
  onTrackChange?: (track: PlaylistTrack, meta: TrackMeta | undefined) => void;
}

export function MusicProvider({ children, onTrackChange }: ProviderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [meta, setMeta] = useState<Record<string, TrackMeta>>({});
  const [volume, setVolumeState] = useState(80);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const isFirstMount = useRef(true);
  const isPlayingRef = useRef(false);
  const resumeOnReadyRef = useRef(false);

  const currentTrack = PLAYLIST[currentIndex];

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const track = currentTrack;
    if (meta[track.id]) return;
    let cancelled = false;
    fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(track.url)}&format=json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("oEmbed failed"))))
      .then((data: { title?: string; author_name?: string; thumbnail_url?: string }) => {
        if (cancelled) return;
        setMeta((m) => ({
          ...m,
          [track.id]: {
            title: data.title ?? track.id,
            author: data.author_name ?? "",
            thumbnail: data.thumbnail_url ?? "",
          },
        }));
      })
      .catch(() => {
        if (cancelled) return;
        setMeta((m) => ({ ...m, [track.id]: { title: track.id, author: "", thumbnail: "" } }));
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack.id]);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    onTrackChange?.(currentTrack, meta[currentTrack.id]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(async () => {
      const p = playerRef.current;
      if (!p) return;
      try {
        const t = await p.getCurrentTime();
        setProgress(t ?? 0);
      } catch {
        /* player not ready yet */
      }
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying]);

  const select = useCallback((index: number, autoPlay?: boolean) => {
    const normalized = ((index % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
    resumeOnReadyRef.current = autoPlay ?? isPlayingRef.current;
    setCurrentIndex(normalized);
    setHasStarted(true);
    setProgress(0);
    setDuration(0);
  }, []);

  const play = useCallback(() => {
    setHasStarted(true);
    resumeOnReadyRef.current = true;
    const player = playerRef.current;
    if (player) {
      player.playVideo();
      return;
    }
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo();
  }, []);

  const toggle = useCallback(() => {
    if (isPlayingRef.current) pause();
    else play();
  }, [play, pause]);

  const next = useCallback(() => {
    select((currentIndex + 1) % PLAYLIST.length);
  }, [currentIndex, select]);

  const prev = useCallback(() => {
    select((currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length);
  }, [currentIndex, select]);

  const handleEnd = useCallback(() => {
    resumeOnReadyRef.current = true;
    setHasStarted(true);
    setProgress(0);
    setDuration(0);
    setCurrentIndex((i) => (i + 1) % PLAYLIST.length);
  }, []);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(100, v));
    setVolumeState(clamped);
    playerRef.current?.setVolume(clamped);
  }, []);

  const value = useMemo(
    () => ({
      tracks: PLAYLIST,
      currentIndex,
      currentTrack,
      meta,
      isPlaying,
      hasStarted,
      progress,
      duration,
      volume,
      play,
      pause,
      toggle,
      next,
      prev,
      select: (index: number) => select(index),
      setVolume,
    }),
    [currentIndex, currentTrack, meta, isPlaying, hasStarted, progress, duration, volume, play, pause, toggle, next, prev, select, setVolume]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <div style={{ position: "fixed", width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }} aria-hidden="true">
        <YouTube
          key={currentTrack.id}
          videoId={currentTrack.id}
          opts={{ height: "0", width: "0", playerVars: { autoplay: 0, controls: 0 } }}
          onReady={(e) => {
            playerRef.current = e.target;
            e.target.setVolume(volume);
            if (resumeOnReadyRef.current) {
              resumeOnReadyRef.current = false;
              e.target.playVideo();
            }
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnd={handleEnd}
          onStateChange={async () => {
            const p = playerRef.current;
            if (!p) return;
            try {
              const d = await p.getDuration();
              setDuration(d ?? 0);
            } catch {
              /* ignore */
            }
          }}
        />
      </div>
    </Ctx.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
}
