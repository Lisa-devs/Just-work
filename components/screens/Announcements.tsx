"use client";
import { useState } from "react";
import { Btn, Card, Pill } from "@/components/ui";
import type { Announcement } from "@/lib/types";
const CATS = ["General", "Training", "Safety", "Campaign"];
type Draft = { id?: string; title: string; body: string; category: string };
const inp = "mt-1 min-h-12 w-full rounded-xl border border-line bg-white px-3 font-normal";
const date = (at: number) => new Date(at).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
export function Announcements({ anns, setAnns, orgId, canPost, log }: { anns: Announcement[]; setAnns: (a: Announcement[]) => void; orgId: string; canPost: boolean; log: (s: string) => void }) {
  const [q, setQ] = useState(""); const [cat, setCat] = useState("all"); const [view, setView] = useState<string | null>(null); const [d, setD] = useState<Draft | null>(null); const [err, setErr] = useState(""); const [del, setDel] = useState(false);
  const list = [...anns].sort((a, b) => b.at - a.at).filter(a => (cat === "all" || a.category === cat) && (a.title + a.body + a.author).toLowerCase().includes(q.toLowerCase()));
  const save = () => { if (!d) return; if (d.title.trim().length < 3) return setErr("Add a title of at least 3 characters."); if (d.body.trim().length < 5) return setErr("Write the announcement (at least 5 characters)."); setErr("");
    if (d.id) { setAnns(anns.map(a => a.id === d.id ? { ...a, title: d.title, body: d.body, category: d.category } : a)); log("Announcement edited"); setView(d.id); }
    else { setAnns([...anns, { id: "n" + Date.now(), orgId, title: d.title, body: d.body, category: d.category, author: "You", at: Date.now(), read: true, mine: true }]); log("Announcement created"); }
    setD(null); };
  if (d) return <div className="space-y-3"><h2 className="text-2xl">{d.id ? "Edit announcement" : "New announcement"}</h2>
    <label className="block font-semibold">Title<input className={inp} value={d.title} onChange={e => setD({ ...d, title: e.target.value })} /></label>
    <label className="block font-semibold">Category<select className={inp} value={d.category} onChange={e => setD({ ...d, category: e.target.value })}>{CATS.map(c => <option key={c}>{c}</option>)}</select></label>
    <label className="block font-semibold">Message<textarea className={inp + " min-h-32 py-2"} value={d.body} onChange={e => setD({ ...d, body: e.target.value })} /></label>
    {err && <p role="alert" className="text-red">{err}</p>}<Btn kind="navy" onClick={save}>Publish</Btn><Btn onClick={() => { setD(null); setErr(""); }}>Cancel</Btn></div>;
  const a = anns.find(x => x.id === view);
  if (a) return <div className="space-y-3"><button className="min-h-11 underline" onClick={() => { setView(null); setDel(false); }}>Back to announcements</button>
    <Card><div className="flex items-start justify-between gap-2"><h2 className="text-2xl">{a.title}</h2><Pill>{a.category}</Pill></div><p className="my-1 text-muted">{a.author} · {date(a.at)}</p><p className="mt-3 whitespace-pre-wrap">{a.body}</p></Card>
    {!a.read && <Btn kind="primary" onClick={() => setAnns(anns.map(x => x.id === a.id ? { ...x, read: true } : x))}>Got it (confirm read)</Btn>}
    {a.read && <p className="text-ok">Read confirmed (simulated)</p>}
    {a.mine && canPost && !del && <div className="grid grid-cols-2 gap-2"><Btn onClick={() => setD({ id: a.id, title: a.title, body: a.body, category: a.category })}>Edit</Btn><Btn kind="danger" onClick={() => setDel(true)}>Delete</Btn></div>}
    {del && <Card className="border-2 !border-red"><p role="alertdialog" className="mb-2 font-semibold">Delete this announcement? This cannot be undone.</p><Btn kind="danger" onClick={() => { setAnns(anns.filter(x => x.id !== a.id)); log("Announcement deleted"); setView(null); setDel(false); }}>Yes, delete</Btn><Btn className="mt-2" onClick={() => setDel(false)}>Keep it</Btn></Card>}</div>;
  return <div className="space-y-3"><div className="flex items-center justify-between"><h2 className="text-2xl">Announcements</h2>{canPost && <button className="min-h-11 rounded-xl bg-navy px-4 font-bold text-white" onClick={() => setD({ title: "", body: "", category: "General" })}>New</button>}</div>
    <input aria-label="Search announcements" placeholder="Search announcements" value={q} onChange={e => setQ(e.target.value)} className={inp} />
    <div className="flex flex-wrap gap-2">{["all", ...CATS].map(c => <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={`min-h-11 rounded-lg border px-3 ${cat === c ? "bg-navy text-white" : "bg-white"}`}>{c === "all" ? "All" : c}</button>)}</div>
    {list.length === 0 && <Card><p className="text-muted">{anns.length ? "No announcements match." : "No announcements yet."}</p></Card>}
    {list.map(x => <button key={x.id} onClick={() => setView(x.id)} className="block w-full rounded-2xl border border-line bg-white p-4 text-left"><div className="flex items-start justify-between gap-2"><h3 className="font-sans">{x.title}</h3><span className="flex gap-1">{!x.read && <Pill tone="border-accent text-ink">New</Pill>}<Pill>{x.category}</Pill></span></div><p className="text-sm text-muted">{x.author} · {date(x.at)}</p><p className="mt-1 line-clamp-2">{x.body}</p></button>)}</div>;
}
