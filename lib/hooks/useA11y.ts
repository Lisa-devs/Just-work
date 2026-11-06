"use client";
import { useEffect, useState } from "react";
export interface A11y { largeText: boolean; highContrast: boolean; reduceMotion: boolean }
const K = "jw-a11y"; // display preferences only
const apply = (p: A11y) => { const r = document.documentElement; r.style.fontSize = p.largeText ? "118%" : ""; r.classList.toggle("hc", p.highContrast); r.classList.toggle("rm", p.reduceMotion); };
export function useA11y() {
  const [p, setP] = useState<A11y>({ largeText: false, highContrast: false, reduceMotion: false });
  useEffect(() => { try { const s = JSON.parse(localStorage.getItem(K) || "null"); if (s) { setP(s); apply(s); } } catch {} }, []);
  const set = (n: A11y) => { setP(n); apply(n); try { localStorage.setItem(K, JSON.stringify(n)); } catch {} };
  return [p, set] as const;
}
