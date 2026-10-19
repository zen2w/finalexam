/**
 * Asia/Manila (UTC+8) Timezone Utilities
 */

export const MANILA_TIMEZONE = "Asia/Manila";

export function getManilaNow() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: MANILA_TIMEZONE }));
}

export function formatShowtime(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleTimeString("en-US", {
    timeZone: MANILA_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatShowDate(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleDateString("en-US", {
    timeZone: MANILA_TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function isPastShowtime(isoString) {
  if (!isoString) return false;
  return new Date(isoString) < new Date();
}

export function isCancellationAllowed(startTimeIsoString) {
  if (!startTimeIsoString) return false;
  const startTime = new Date(startTimeIsoString).getTime();
  const now = Date.now();
  const diffMinutes = (startTime - now) / (1000 * 60);
  return diffMinutes >= 30;
}
