/** Timestamp captured the moment the OS module loads — powers the "uptime" shown in Terminal/About. */
export const BOOT_TIME = Date.now();

export function formatUptime(now: number = Date.now()): string {
  const seconds = Math.max(0, Math.floor((now - BOOT_TIME) / 1000));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
