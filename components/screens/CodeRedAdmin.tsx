"use client";
import { useState } from "react";
import { Btn, Card } from "@/components/ui";
import { Demo } from "./CodeRed";
import type { CodeRedConfig, Level } from "@/lib/types";
const LEVELS: Level[] = ["Check on me", "Threat", "Emergency"];
export function CodeRedAdmin({ cfg, setCfg, names, adminCount, onDrill, log }: { cfg: CodeRedConfig; setCfg: (c: CodeRedConfig) => void; names: string[]; adminCount: number; onDrill: () => void; log: (s: string) => void }) {
  const [text, setText] = useState(cfg.instructions); const [msg, setMsg] = useState("");
  const done = (m: string) => { setMsg(m); log("Code Red settings changed (simulated)"); };
  const toggle = (n: string) => { setCfg({ ...cfg, onCall: cfg.onCall.includes(n) ? cfg.onCall.filter(x => x !== n) : [...cfg.onCall, n] }); done("Responders updated."); };
  const move = (i: number, d: number) => { const o = [...cfg.onCall]; [o[i], o[i + d]] = [o[i + d], o[i]]; setCfg({ ...cfg, onCall: o }); done("Escalation order updated."); };
  const lvl = (l: Level) => { const next = cfg.levels.includes(l) ? cfg.levels.filter(x => x !== l) : [...cfg.levels, l]; if (!next.length) return setMsg("Keep at least one alert type on."); setCfg({ ...cfg, levels: next }); done("Alert types updated."); };
  const ready: [string, boolean][] = [["Two admins", adminCount >= 2], ["Two people on call", cfg.onCall.length >= 2], ["Response instructions written", cfg.instructions.trim().length > 0]];
  const inp = "min-h-11 rounded-lg border border-line bg-white px-2";
  return <div className="space-y-3"><h2 className="text-2xl">Code Red settings</h2><Demo />
    <Card><h3>Ready to switch on</h3>{ready.map(([l, ok]) => <p key={l}>{l}: <b>{ok ? "yes" : "no, needs attention"}</b></p>)}</Card>
    <Card><h3>Responders and escalation order</h3><p className="mb-2 text-sm text-muted">Tick people who are on call. If nobody answers, the alert goes to the next person in order.</p>
      {names.map(n => <label key={n} className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={cfg.onCall.includes(n)} onChange={() => toggle(n)} />{n}</label>)}
      <ol className="mt-2 list-decimal pl-5">{cfg.onCall.map((n, i) => <li key={n} className="py-1"><span className="mr-2">{n}</span><button className="min-h-11 px-2 underline disabled:opacity-40" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${n} up`}>Up</button><button className="min-h-11 px-2 underline disabled:opacity-40" disabled={i === cfg.onCall.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${n} down`}>Down</button></li>)}</ol></Card>
    <Card><h3>Alert categories</h3>{LEVELS.map(l => <label key={l} className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={cfg.levels.includes(l)} onChange={() => lvl(l)} />{l}</label>)}</Card>
    <Card><h3>Time before escalation (minutes)</h3>{LEVELS.map(l => <label key={l} className="flex items-center justify-between py-1">{l}<input type="number" min={1} value={cfg.times[l]} onChange={e => setCfg({ ...cfg, times: { ...cfg.times, [l]: Math.max(1, +e.target.value || 1) } })} className={inp + " w-20"} /></label>)}</Card>
    <Card><h3>Notification channels</h3><label className="flex min-h-11 items-center gap-2"><input type="checkbox" checked disabled /> In-app (always on)</label>
      <label className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={cfg.channels.email} onChange={e => { setCfg({ ...cfg, channels: { ...cfg.channels, email: e.target.checked } }); done("Channels updated."); }} /> Email</label>
      <label className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={cfg.channels.sms} onChange={e => { setCfg({ ...cfg, channels: { ...cfg.channels, sms: e.target.checked } }); done("Channels updated."); }} /> SMS or WhatsApp where enabled</label><p className="text-sm text-muted">Simulated. No messages are sent.</p></Card>
    <Card><label className="block font-semibold">Response instructions (one step per line)<textarea className="mt-1 min-h-32 w-full rounded-xl border border-line px-3 py-2 font-normal" value={text} onChange={e => setText(e.target.value)} /></label>
      <Btn kind="navy" className="mt-2" onClick={() => text.trim() ? (setCfg({ ...cfg, instructions: text }), done("Instructions saved. Responders see them now.")) : setMsg("Write at least one step.")}>Save instructions</Btn></Card>
    {msg && <p role="status" className="rounded-lg bg-ok/10 p-3 text-ok">{msg}</p>}<Btn kind="primary" onClick={onDrill}>Start a drill</Btn></div>;
}
