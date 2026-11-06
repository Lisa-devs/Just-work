"use client";
import { useState } from "react";
import { Btn, Card, Field, Pill } from "@/components/ui";
// All simulated. Production: Supabase Auth handles passwords, MFA/passkeys, sessions and recovery codes.
const Ok = ({ m }: { m: string }) => m ? <p role="status" className="rounded-lg bg-ok/10 p-3 text-ok">{m}</p> : null;
const Bad = ({ m }: { m: string }) => m ? <p role="alert" className="text-red">{m}</p> : null;
export function Password() {
  const [f, setF] = useState({ cur: "", n: "", c: "" }); const [err, setErr] = useState(""); const [ok, setOk] = useState("");
  const go = () => { setOk(""); if (!f.cur) return setErr("Enter your current password."); if (f.n.length < 12) return setErr("New password needs at least 12 characters."); if (f.n !== f.c) return setErr("New passwords do not match."); setErr(""); setF({ cur: "", n: "", c: "" }); setOk("Password change simulated. Nothing was saved."); };
  return <Card className="space-y-1"><h3>Password</h3><Field label="Current password" type="password" value={f.cur} onChange={e => setF({ ...f, cur: e.target.value })} /><Field label="New password (12+ characters)" type="password" value={f.n} onChange={e => setF({ ...f, n: e.target.value })} /><Field label="Confirm new password" type="password" value={f.c} onChange={e => setF({ ...f, c: e.target.value })} /><Bad m={err} /><Ok m={ok} /><Btn kind="navy" onClick={go}>Change password</Btn></Card>;
}
export function TwoFactor() {
  const [ask, setAsk] = useState(false); const [codes, setCodes] = useState<string[]>([]);
  const gen = () => { setCodes(Array.from({ length: 10 }, () => Math.random().toString(36).slice(2, 6) + "-" + Math.random().toString(36).slice(2, 6))); setAsk(false); };
  return <Card className="space-y-2"><div className="flex justify-between"><h3>Two-factor login</h3><Pill tone="border-ok text-ok">On</Pill></div><p className="text-muted">Authenticator app. Two-factor login is required for every member.</p>
    {!ask && !codes.length && <Btn onClick={() => setAsk(true)}>Generate new recovery codes</Btn>}
    {ask && <div role="alertdialog" className="rounded-xl border-2 border-red p-3"><p className="mb-2 font-semibold">This replaces your old recovery codes. Continue?</p><Btn kind="navy" onClick={gen}>Yes, generate</Btn><Btn className="mt-2" onClick={() => setAsk(false)}>Cancel</Btn></div>}
    {codes.length > 0 && <><ul className="grid grid-cols-2 gap-1 font-mono">{codes.map(c => <li key={c}>{c}</li>)}</ul><p className="text-sm text-muted">Demo codes. They work nowhere.</p></>}</Card>;
}
export function PinCard({ pin, setPin, log }: { pin: string; setPin: (p: string) => void; log: (s: string) => void }) {
  const [form, setForm] = useState(false); const [p, setP] = useState(""); const [p2, setP2] = useState(""); const [err, setErr] = useState(""); const [off, setOff] = useState(false); const [ok, setOk] = useState("");
  const save = () => { if (!/^\d{4,6}$/.test(p)) return setErr("Use 4 to 6 digits."); if (p !== p2) return setErr("PINs do not match."); setPin(p); setForm(false); setP(""); setP2(""); setErr(""); setOk("PIN saved (demo: stored in this browser only)."); log("PIN lock changed (simulated)"); };
  return <Card className="space-y-2"><div className="flex justify-between"><h3>PIN lock</h3><Pill>{pin ? "On" : "Off"}</Pill></div>
    {!form && !off && <div className="grid grid-cols-2 gap-2"><Btn onClick={() => setForm(true)}>{pin ? "Change PIN" : "Set a PIN"}</Btn>{pin && <Btn onClick={() => setOff(true)}>Turn off</Btn>}</div>}
    {form && <><Field label="New PIN (4 to 6 digits)" type="password" inputMode="numeric" value={p} onChange={e => setP(e.target.value)} /><Field label="Confirm PIN" type="password" inputMode="numeric" value={p2} onChange={e => setP2(e.target.value)} /><Bad m={err} /><Btn kind="navy" onClick={save}>Save PIN</Btn><Btn onClick={() => { setForm(false); setErr(""); }}>Cancel</Btn></>}
    {off && <div role="alertdialog" className="rounded-xl border-2 border-red p-3"><p className="mb-2 font-semibold">Turn off the PIN lock? Anyone holding your phone could open the app.</p><Btn kind="danger" onClick={() => { setPin(""); setOff(false); setOk("PIN lock turned off."); log("PIN lock changed (simulated)"); }}>Yes, turn off</Btn><Btn className="mt-2" onClick={() => setOff(false)}>Keep it on</Btn></div>}<Ok m={ok} /></Card>;
}
const SEED = [{ id: "s1", d: "Android phone (this device)", l: "Active now", cur: true }, { id: "s2", d: "Windows laptop, Chrome", l: "Yesterday, 18:02", cur: false }, { id: "s3", d: "iPad, Safari", l: "3 days ago", cur: false }];
export function Sessions({ log }: { log: (s: string) => void }) {
  const [list, setList] = useState(SEED); const [conf, setConf] = useState<string | null>(null);
  const others = list.filter(s => !s.cur).length;
  const revoke = (id: string) => { setList(list.filter(s => s.id !== id)); log("Session revoked (simulated)"); setConf(null); };
  return <Card className="space-y-2"><h3>Active sessions (demo)</h3>{list.map(s => <div key={s.id} className="border-b border-line pb-2 last:border-0"><b>{s.d}</b><p className="text-muted">Last active: {s.l}</p>
    {!s.cur && (conf === s.id ? <div role="alertdialog" className="mt-1 rounded-xl border-2 border-red p-3"><p className="mb-2">Sign this device out?</p><Btn kind="danger" onClick={() => revoke(s.id)}>Yes, revoke</Btn><Btn className="mt-2" onClick={() => setConf(null)}>Cancel</Btn></div> : <Btn className="mt-1" onClick={() => setConf(s.id)}>Revoke session</Btn>)}</div>)}
    {others === 0 && <p className="text-muted">No other sessions.</p>}
    {others > 0 && (conf === "all" ? <div role="alertdialog" className="rounded-xl border-2 border-red p-3"><p className="mb-2 font-semibold">Sign out all other devices?</p><Btn kind="danger" onClick={() => { setList(list.filter(s => s.cur)); log("Session revoked (simulated)"); setConf(null); }}>Yes, sign out others</Btn><Btn className="mt-2" onClick={() => setConf(null)}>Cancel</Btn></div> : <Btn kind="navy" onClick={() => setConf("all")}>Revoke all other sessions</Btn>)}</Card>;
}
