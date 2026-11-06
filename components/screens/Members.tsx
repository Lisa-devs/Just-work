"use client";
import { useState } from "react";
import { Btn, Card, Pill } from "@/components/ui";
import type { Member } from "@/lib/types";
// Simulated role checks. Production: roles live in the database and RLS/server code enforces them.
export const ROLES = ["Organization admin", "Team manager", "Member"];
const MATRIX = [["See the member list", "Yes", "Yes", "No"], ["Invite, approve and remove members", "Yes", "No", "No"], ["Change roles, suspend members", "Yes", "No", "No"], ["Create and assign tasks", "Yes", "Yes", "Own tasks only"], ["Post announcements", "Yes", "Yes", "No"], ["Share files", "Yes", "Yes", "Own files only"], ["Trigger Code Red", "Yes", "Yes", "Yes"], ["Change Code Red settings", "Yes", "No", "No"], ["View audit log", "Yes", "No", "No"]];
const inp = "min-h-12 w-full rounded-xl border border-line bg-white px-3";
type P = { members: Member[]; setMembers: (m: Member[]) => void; orgId: string; canManage: boolean; log: (s: string) => void };
export function Members({ members, setMembers, orgId, canManage, log }: P) {
  const [tab, setTab] = useState<"people" | "roles">("people"); const [q, setQ] = useState(""); const [fr, setFr] = useState("all"); const [open, setOpen] = useState<string | null>(null);
  const [inv, setInv] = useState<{ email: string; role: string } | null>(null); const [err, setErr] = useState(""); const [conf, setConf] = useState<{ id: string; act: "suspend" | "remove" } | null>(null); const [note, setNote] = useState("");
  const mine = members.filter(m => m.orgId === orgId);
  const patch = (id: string, p: Partial<Member>) => setMembers(members.map(m => m.id === id ? { ...m, ...p } : m));
  const admins = mine.filter(m => m.status === "active" && m.role === ROLES[0]).length;
  const guard = (m: Member) => m.role === ROLES[0] && m.status === "active" && admins <= 1 ? (setNote("A workspace needs at least one active admin."), true) : false;
  const pending = mine.filter(m => m.status === "pending");
  const rest = mine.filter(m => m.status !== "pending" && (fr === "all" || m.role === fr) && m.name.toLowerCase().includes(q.toLowerCase()));
  const invite = () => { if (!inv) return; if (!/^\S+@\S+\.\S+$/.test(inv.email)) return setErr("Enter a valid email address."); const n = inv.email.split("@")[0]; const nm = n[0].toUpperCase() + n.slice(1);
    setMembers([...members, { orgId, id: "u" + Date.now(), name: nm, role: inv.role, status: "pending", lastActive: "Never" }]); log(`Member invited: ${nm}`); setNote(`Invite recorded for ${inv.email} (simulated, no email sent). Demo invite code: JUST-DEMO-2026`); setInv(null); setErr(""); };
  return <div className="space-y-3"><h2 className="text-2xl">Members</h2>
    <div className="flex gap-2">{(["people", "roles"] as const).map(t => <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)} className={`min-h-11 rounded-lg border px-3 ${tab === t ? "bg-navy text-white" : "bg-white"}`}>{t === "people" ? "People" : "Roles and permissions"}</button>)}</div>
    {tab === "roles" ? <><p role="note" className="rounded-lg border border-accent bg-accent/20 p-2 text-sm font-semibold">Prototype demonstration of roles. Real permissions must be enforced by the backend, not the screen.</p>
      <div className="overflow-x-auto rounded-2xl border border-line bg-white"><table className="w-full min-w-[34rem] text-left"><thead><tr className="border-b border-line"><th className="p-3">Function</th>{ROLES.map(r => <th key={r} className="p-3">{r}</th>)}</tr></thead><tbody>{MATRIX.map(r => <tr key={r[0]} className="border-b border-line last:border-0">{r.map((c, i) => <td key={i} className="p-3">{c}</td>)}</tr>)}</tbody></table></div></>
    : <>{!canManage && <p className="text-muted">View only. Your demo role cannot change members.</p>}
      {canManage && !inv && <Btn kind="navy" onClick={() => setInv({ email: "", role: ROLES[2] })}>Invite a member</Btn>}
      {inv && <Card className="space-y-2"><h3>Invite a member</h3><label className="block font-semibold">Email<input className={inp + " font-normal"} value={inv.email} onChange={e => setInv({ ...inv, email: e.target.value })} /></label>
        <label className="block font-semibold">Role<select className={inp + " font-normal"} value={inv.role} onChange={e => setInv({ ...inv, role: e.target.value })}>{ROLES.map(r => <option key={r}>{r}</option>)}</select></label>
        {err && <p role="alert" className="text-red">{err}</p>}<Btn kind="navy" onClick={invite}>Record invite (simulated)</Btn><Btn onClick={() => { setInv(null); setErr(""); }}>Cancel</Btn></Card>}
      {note && <p role="status" className="rounded-lg bg-ok/10 p-3 text-ok">{note}</p>}
      {pending.length > 0 && <><h3>Waiting for approval</h3>{pending.map(m => <Card key={m.id}><b>{m.name}</b> <Pill>{m.role}</Pill>
        {canManage && <div className="mt-2 grid grid-cols-2 gap-2"><Btn kind="navy" onClick={() => { patch(m.id, { status: "active", lastActive: "Today" }); log(`Admin approved ${m.name}`); }}>Approve</Btn><Btn onClick={() => { setMembers(members.filter(x => x.id !== m.id)); log(`Member rejected: ${m.name}`); }}>Reject</Btn></div>}</Card>)}</>}
      <input aria-label="Search members" placeholder="Search members" value={q} onChange={e => setQ(e.target.value)} className={inp} />
      <select aria-label="Filter by role" value={fr} onChange={e => setFr(e.target.value)} className={inp}><option value="all">All roles</option>{ROLES.map(r => <option key={r}>{r}</option>)}</select>
      {rest.length === 0 && <Card><p className="text-muted">No members match.</p></Card>}
      {rest.map(m => <Card key={m.id}><div className="flex items-start justify-between gap-2"><div><b>{m.name}</b><p className="text-muted">{m.role}</p></div><div className="flex gap-1">{m.onCall && <Pill>On call</Pill>}<Pill tone={m.status === "suspended" ? "border-red text-red" : ""}>{m.status === "suspended" ? "Suspended" : "Active"}</Pill></div></div>
        <div className="mt-2 grid grid-cols-2 gap-2"><Btn onClick={() => setOpen(open === m.id ? null : m.id)}>{open === m.id ? "Hide details" : "Details"}</Btn>
          {canManage && (m.status === "suspended" ? <Btn onClick={() => { patch(m.id, { status: "active" }); log(`Member reactivated: ${m.name}`); }}>Reactivate</Btn> : <Btn onClick={() => !guard(m) && setConf({ id: m.id, act: "suspend" })}>Suspend</Btn>)}</div>
        {open === m.id && <div className="mt-3 space-y-2 border-t border-line pt-3"><p>Last active: {m.lastActive}</p>
          {canManage ? <label className="block font-semibold">Role<select className={inp + " font-normal"} value={m.role} onChange={e => { if (guard(m)) return; patch(m.id, { role: e.target.value }); log(`Role changed: ${m.name} is now ${e.target.value}`); }}>{ROLES.map(r => <option key={r}>{r}</option>)}</select></label> : <p>Role: {m.role}</p>}
          {canManage && <Btn kind="danger" onClick={() => !guard(m) && setConf({ id: m.id, act: "remove" })}>Remove from workspace</Btn>}</div>}
        {conf?.id === m.id && <div role="alertdialog" className="mt-3 rounded-xl border-2 border-red p-3"><p className="mb-2 font-semibold">{conf.act === "suspend" ? `Suspend ${m.name}? Their devices are signed out (simulated).` : `Remove ${m.name}? All their devices are signed out straight away (simulated).`}</p>
          <Btn kind="danger" onClick={() => { if (conf.act === "suspend") { patch(m.id, { status: "suspended" }); log(`Member suspended: ${m.name}`); } else { setMembers(members.filter(x => x.id !== m.id)); log("A member was removed. All devices signed out"); } setConf(null); }}>Yes, {conf.act}</Btn><Btn className="mt-2" onClick={() => setConf(null)}>Cancel</Btn></div>}</Card>)}</>}</div>;
}
