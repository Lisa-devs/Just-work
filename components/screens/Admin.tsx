"use client";
import { useState } from "react";
import { Btn, Card, Pill } from "@/components/ui";
import { KINDS, kindOf } from "@/lib/utilities/audit";
import { isLive } from "./CodeRed";
import type { Alert, LogEntry, Member, Task } from "@/lib/types";
export function Overview({ a, go, members, tasks, entries }: { a: Alert | null; go: (s: string) => void; members: Member[]; tasks: Task[]; entries: LogEntry[] }) {
  const stats: [string, number][] = [["Active members", members.filter(m => m.status === "active").length], ["Pending approvals", members.filter(m => m.status === "pending").length], ["Active tasks", tasks.filter(t => t.status !== "done").length], ["Suspended", members.filter(m => m.status === "suspended").length]];
  const cr = entries.filter(e => kindOf(e.text) === "Code Red").slice(0, 2);
  return <div className="space-y-3"><h2 className="text-2xl">Overview</h2>
    {isLive(a) ? <Card className="border-2 !border-threat"><div className="flex justify-between"><h3>Active demo alert</h3><Pill tone="border-threat text-threat">{a!.level}</Pill></div><p className="my-2">Status: {a!.status}.</p><Btn kind="navy" onClick={() => go("responder")}>Open alert</Btn></Card> : <Card><h3>No active alerts</h3></Card>}
    <div className="grid grid-cols-2 gap-3">{stats.map(([l, n]) => <Card key={l}><p className="font-serif text-3xl font-bold">{n}</p><p className="text-muted">{l}</p></Card>)}</div>
    {members.some(m => m.status === "pending") && <Btn onClick={() => go("members")}>Review pending approvals</Btn>}
    <Card><h3>Recent activity</h3>{entries.slice(0, 3).map(e => <p key={e.id} className="mt-1">{e.text} <span className="text-muted">· {e.when}</span></p>)}<button className="mt-2 min-h-11 underline" onClick={() => go("activity")}>Open activity log</button></Card>
    <Card><h3>Recent Code Red demo activity</h3>{cr.length ? cr.map(e => <p key={e.id} className="mt-1">{e.text} <span className="text-muted">· {e.when}</span></p>) : <p className="text-muted">None yet.</p>}</Card></div>;
}
export function Activity({ entries }: { entries: LogEntry[] }) {
  const [q, setQ] = useState(""); const [k, setK] = useState("all"); const [open, setOpen] = useState<string | null>(null);
  const list = entries.filter(e => (k === "all" || kindOf(e.text) === k) && e.text.toLowerCase().includes(q.toLowerCase()));
  const inp = "min-h-12 w-full rounded-xl border border-line bg-white px-3";
  return <div className="space-y-3"><h2 className="text-2xl">Activity</h2>
    <p role="note" className="rounded-lg border border-accent bg-accent/20 p-2 text-sm font-semibold">Simulated audit data. A real log must be written and protected by the server so nobody can edit it.</p>
    <input aria-label="Search activity" placeholder="Search activity" value={q} onChange={e => setQ(e.target.value)} className={inp} />
    <select aria-label="Filter by event type" value={k} onChange={e => setK(e.target.value)} className={inp}><option value="all">All event types</option>{KINDS.map(x => <option key={x}>{x}</option>)}</select>
    {list.length === 0 && <Card><p className="text-muted">No events match.</p></Card>}
    <Card className="!p-0">{list.map(e => <div key={e.id} className="border-b border-line last:border-0"><button className="block min-h-14 w-full p-4 text-left" aria-expanded={open === e.id} onClick={() => setOpen(open === e.id ? null : e.id)}><b>{e.text}</b><p className="text-muted">{e.when} · {kindOf(e.text)}</p></button>
      {open === e.id && <dl className="space-y-1 bg-page p-4 text-sm"><div><dt className="inline font-semibold">Event type: </dt><dd className="inline">{kindOf(e.text)}</dd></div><div><dt className="inline font-semibold">Recorded: </dt><dd className="inline">{e.when}</dd></div><div><dt className="inline font-semibold">Actor: </dt><dd className="inline">Demo user (simulated)</dd></div><div><dt className="inline font-semibold">Content: </dt><dd className="inline">Message and file contents are never recorded.</dd></div></dl>}</div>)}</Card></div>;
}
