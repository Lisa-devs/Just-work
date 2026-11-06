export const ago = (ms: number) => Date.now() - ms;
export const H = 3600e3, D = 24 * H;
export function fmt(at: number) {
  const d = new Date(at), t = new Date();
  return d.toDateString() === t.toDateString() ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : d.toLocaleDateString([], { day: "numeric", month: "short" });
}
