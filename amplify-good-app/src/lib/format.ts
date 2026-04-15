const TZ = "America/Chicago";

export function formatDate(dateTime: string): string {
  const d = new Date(dateTime);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    timeZone: TZ,
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(dateTime: string): string {
  const d = new Date(dateTime);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("en-US", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatMoney(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
