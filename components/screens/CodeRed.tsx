"use client";
import { useState } from "react";
import { Btn, Card } from "@/components/ui";
import type { Alert, Level } from "@/lib/types";
// SIMULATION ONLY. No timers, notifications, location reads or contact with anyone.
// Every step is advanced by a visible manual control. Production: server dispatch + escalation worker.
export const DEMO_NOTE = "Code Red is a demonstration only. It does not contact real responders or emergency services.";
export const Demo = () => <p role="note" className="mb-3 rounded-lg border border-accent bg-accent/20 p-2 text-sm font-semibold">{DEMO_NOTE}</p>;
export const isLive = (a: Alert | null) => !!a && ["sent", "acknowledged", "escalated"].includes(a.status);
const ev = (a: Alert, text: string, p: Partial<Alert> = {}): Alert => ({ ...a, ...p, events: [...a.events, { text, at: Date.now() }] });
const hm = (n: number) => new Date(n).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
export const newAlert = (level: Level, message: string, responders: string[], location: boolean): Alert => ({ level, message, audience: responders.join(", "), status: "sent", at: Date.now(), responders, location, delivered: false, seen: false, events: [{ text: "Alert created (simulated)", at: Date.now() }] });
const LV: [Level, string][] = [["Check on me", "I feel uneasy"], ["Threat", "I am being threatened or watched"], ["Emergency", "I am in danger now"]];

export function CodeRedSheet({ people, levels, defaults, onSend, onClose }: { people: string[]; levels: Level[]; defaults: string[]; onSend: (a: Alert) => void; onClose: () => void }) {
  const [lvl, setLvl] = useState<Level>(levels.includes("Threat") ? "Threat" : levels[0]); const [msg, setMsg] = useState(""); const [sel, setSel] = useState(defaults);
  const [loc, setLoc] = useState(false); const [review, setReview] = useState(false); const [err, setErr] = useState("");
  const tog = (n: string) => setSel(s => s.includes(n) ? s.filter(x => x !== n) : [...s, n]);
  return <div role="dialog" aria-modal="true" aria-label="Ask for help" className="fixed inset-0 z-40 overflow-auto bg-navy/90 pt-12"><div className="mx-auto min-h-full max-w-md rounded-t-3xl bg-white p-4">
    <div className="mb-3 flex justify-between"><h2 className="text-2xl">{review ? "Review your alert" : "Ask for help"}</h2><button className="min-h-11 rounded-lg border border-line px-3" onClick={onClose}>Close</button></div><Demo />
    {!review ? <>
      <fieldset><legend className="mb-1 font-semibold">Alert type</legend><div className="space-y-2">{LV.filter(([k]) => levels.includes(k)).map(([k, d]) => <label key={k} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border-2 p-3 ${lvl === k ? "border-threat bg-threat/5" : "border-line"}`}><input type="radio" name="lvl" checked={lvl === k} onChange={() => setLvl(k)} /><span><b>{k}</b>{lvl === k && " (selected)"}<br /><span className="text-muted">{d}</span></span></label>)}</div></fieldset>
      <label className="mt-3 block font-semibold">Short message (optional)<input value={msg} maxLength={140} onChange={e => setMsg(e.target.value)} className="mt-1 min-h-12 w-full rounded-xl border border-line px-3 font-normal" /></label>
      <fieldset className="mt-3"><legend className="font-semibold">Who should be told?</legend>{people.map(n => <label key={n} className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={sel.includes(n)} onChange={() => tog(n)} />{n}</label>)}</fieldset>
      <label className="my-3 flex gap-2"><input type="checkbox" checked={loc} onChange={e => setLoc(e.target.checked)} /><span>Include a mock location. <span className="text-muted">Nothing real is read from your device.</span></span></label>
      {err && <p role="alert" className="mb-2 text-red">{err}</p>}
      <Btn kind="navy" onClick={() => sel.length ? (setErr(""), setReview(true)) : setErr("Choose at least one responder.")}>Review alert</Btn></>
    : <><Card className="mb-3"><p><b>Type:</b> {lvl}</p><p><b>Message:</b> {msg || "None"}</p><p><b>Responders:</b> {sel.join(", ")}</p><p><b>Mock location:</b> {loc ? "Included" : "Not included"}</p></Card>
      <div className="space-y-2"><Btn kind="primary" onClick={() => onSend(newAlert(lvl, msg, sel, loc))}>Send demo alert</Btn><Btn onClick={() => setReview(false)}>Back and edit</Btn></div></>}
    <p className="mt-3 text-muted">A real alert would need internet or phone signal and would not replace the police, a lawyer or your own safety plan.</p></div></div>;
}

export function AlertStatus({ a, setA, onClose }: { a: Alert; setA: (a: Alert) => void; onClose: () => void }) {
  const [confirm, setConfirm] = useState(false); const live = isLive(a);
  return <div className="mx-auto max-w-md"><div className="bg-threat p-6 text-white"><small>Your alert</small><h2 className="text-4xl">{a.level}</h2><p>Status: <b>{a.status}</b> · created {hm(a.at)}</p></div>
    <div className="space-y-3 p-4"><Demo />
      <Card><h3>Timeline</h3><p className="text-sm text-muted">To: {a.responders.join(", ")}{a.location && " · mock location included"}</p>
        <ol className="mt-2 space-y-1">{a.events.map((e, i) => <li key={i}><span className="text-muted">{hm(e.at)}</span> {e.text}</li>)}</ol></Card>
      {live && <Card><h3>Simulation controls</h3><p className="mb-2 text-sm text-muted">Advance the demo by hand. Nothing happens automatically.</p><div className="space-y-2">
        {!a.delivered && <Btn onClick={() => setA(ev(a, `Delivered to ${a.responders.length} responders (simulated)`, { delivered: true }))}>Simulate: delivered</Btn>}
        {a.delivered && !a.seen && <Btn onClick={() => setA(ev(a, "Seen by responders (simulated)", { seen: true }))}>Simulate: seen</Btn>}
        {a.status === "sent" && <Btn onClick={() => setA(ev(a, `${a.responders[0]} acknowledged: I'm on it`, { status: "acknowledged" }))}>Simulate: responder acknowledges</Btn>}
        {a.status !== "escalated" && <Btn onClick={() => setA(ev(a, "Responder unable to assist. Escalated to next on-call (simulated)", { status: "escalated" }))}>Simulate: responder can&apos;t help</Btn>}
        {a.status === "escalated" && <Btn onClick={() => setA(ev(a, "Next on-call acknowledged", { status: "acknowledged" }))}>Simulate: next on-call acknowledges</Btn>}</div></Card>}
      {live && !confirm && <><Btn kind="primary" onClick={() => setA(ev(a, "Resolved: sender is safe", { status: "resolved" }))}>I&apos;m safe now (resolve)</Btn><Btn onClick={() => setConfirm(true)}>Cancel alert</Btn></>}
      {confirm && <Card className="border-2 !border-red"><p role="alertdialog" className="mb-2 font-semibold">Cancel this alert? Responders will be told it was cancelled.</p><Btn kind="danger" onClick={() => { setA(ev(a, "Cancelled by sender", { status: "cancelled" })); setConfirm(false); }}>Yes, cancel alert</Btn><Btn className="mt-2" onClick={() => setConfirm(false)}>Keep alert</Btn></Card>}
      {!live && <Btn kind="navy" onClick={onClose}>Back to home</Btn>}</div></div>;
}

export function Responder({ a, setA, go, instructions }: { a: Alert | null; setA: (a: Alert) => void; go: (s: string) => void; instructions: string }) {
  const [note, setNote] = useState("");
  if (!a) return <div className="space-y-3"><Demo /><Card><h3>No incoming alerts</h3><p className="text-muted">When someone raises a demo alert it appears here. Try the red Code Red button as a member.</p></Card></div>;
  const live = isLive(a);
  return <div className="space-y-3"><Demo /><div className="rounded-2xl bg-threat p-5 text-white"><p>Code Red (demo)</p><h2 className="text-4xl">{a.level}</h2><p className="mt-2 text-lg">Amina asked for help · {hm(a.at)}</p>
      <p>“{a.message || "No message"}”</p><p className="text-sm">Status: <b>{a.status}</b></p></div>
    <Card><h3>Location</h3><p>{a.location ? "Mock pin: Example Street, Demo City (not a real place)." : "Location not shared."}</p></Card>
    <Card><h3>Response instructions</h3><ol className="list-decimal pl-5">{instructions.split("\n").filter(Boolean).map((l, k) => <li key={k}>{l}</li>)}</ol></Card>
    {live ? <div className="space-y-2">
      <Btn kind="navy" disabled={a.status === "acknowledged"} className="disabled:opacity-60" onClick={() => setA(ev(a, "You acknowledged: I'm on it", { status: "acknowledged" }))}>{a.status === "acknowledged" ? "You are on it" : "I’m on it"}</Btn>
      <Btn onClick={() => setNote("Demo: no call was placed. A real app would open your phone dialler.")}>Call Amina (demo)</Btn>
      <Btn onClick={() => go("safety")}>Open safety directory</Btn>
      <Btn onClick={() => setA(ev(a, "Responder unable to assist. Escalated (simulated)", { status: "escalated" }))}>I can’t help</Btn></div>
      : <p className="text-muted">This alert is {a.status}. No further action needed.</p>}
    {note && <p role="status" className="rounded-lg bg-ok/10 p-3 text-ok">{note}</p>}
    <Card><h3>Alert history</h3>{a.events.map((e, i) => <p key={i}><span className="text-muted">{hm(e.at)}</span> {e.text}</p>)}</Card></div>;
}
