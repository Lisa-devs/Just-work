"use client";
import { useState } from "react";
import { Btn, Card, Pill } from "@/components/ui";
import { contacts } from "@/lib/mock-data";
import type { FileItem, Task, Announcement } from "@/lib/types";
export function Home({ tasks, go, latest }: { tasks: Task[]; go: (s: string) => void; latest?: Announcement }) {
  const open = tasks.filter(t => t.assignee === "You" && t.status !== "done");
  return <div className="space-y-3"><h2 className="text-3xl">Good morning, Amina</h2>
    {latest && <Card><h3>{latest.title}</h3><p className="my-2">{latest.body}</p><Btn onClick={() => go("announcements")}>All announcements</Btn></Card>}
    <Card><div className="flex justify-between"><h3>Your tasks</h3><Pill>{open.length} open</Pill></div>
      {open.length === 0 ? <p className="mt-2 text-muted">Nothing open. Add a task in Tasks.</p> : open.map(t => <p key={t.id} className="mt-2 flex justify-between">{t.title}<span className="text-muted">{t.due}</span></p>)}</Card>
    <Card><h3>Need help now?</h3><p className="mb-2 text-muted">Find lawyers, legal aid and emergency support.</p><Btn kind="primary" onClick={() => go("safety")}>Find help</Btn></Card></div>;
}
export function Files({ files, setFiles, log }: { files: FileItem[]; setFiles: (f: FileItem[]) => void; log: (s: string) => void }) {
  const opts = ["Only me", "My team", "Whole organization"];
  return <div className="space-y-3"><h2 className="text-2xl">Files</h2><p className="text-muted">Files are private until you choose who can open them.</p>
    {files.length === 0 && <p>No files. Trash is empty.</p>}
    {files.map(f => <Card key={f.id}><div className="flex justify-between"><h3 className="font-sans">{f.name}</h3><Pill>{f.size}</Pill></div>
      <label className="mt-2 block font-semibold">Who can open this
        <select value={f.access} onChange={e => setFiles(files.map(x => x.id === f.id ? { ...x, access: e.target.value } : x))} className="mt-1 min-h-12 w-full rounded-xl border border-line bg-white px-3 font-normal">{opts.map(o => <option key={o}>{o}</option>)}</select></label>
      <div className="mt-2 grid grid-cols-2 gap-2"><Btn kind="navy" onClick={() => { setFiles(files.map(x => x.id === f.id ? { ...x, link: true } : x)); log("You created a share link (simulated)"); }}>Create link</Btn>
        <Btn onClick={() => setFiles(files.filter(x => x.id !== f.id))}>Trash</Btn></div>
      {f.link && <div className="mt-2 rounded-xl border-2 border-accent p-3"><b>Link created</b><p className="text-muted">Anyone with this link can open the file. It expires in 48 hours and allows 5 downloads.</p>
        <button className="underline" onClick={() => setFiles(files.map(x => x.id === f.id ? { ...x, link: false } : x))}>Revoke</button></div>}</Card>)}</div>;
}
export function Safety() {
  const [q, setQ] = useState(""); const [f, setF] = useState("All"); const [saved, setSaved] = useState<string[]>([]);
  const r = contacts.filter(c => (f === "All" || c.kind === f) && (c.name + c.country + c.kind).toLowerCase().includes(q.toLowerCase()));
  return <div className="space-y-3"><h2 className="text-2xl">Safety directory</h2>
    <label className="block font-semibold">Search by name, country or type<input value={q} onChange={e => setQ(e.target.value)} className="mt-1 min-h-12 w-full rounded-xl border border-line px-3 font-normal" /></label>
    <div className="flex gap-2">{["All", "Legal aid", "Support"].map(k => <button key={k} onClick={() => setF(k)} className={`min-h-11 rounded-lg border px-3 ${f === k ? "bg-navy text-white" : "bg-white"}`}>{k}</button>)}</div>
    {r.length === 0 && <p className="text-muted">No matches. Try a different word or filter.</p>}
    {r.map(c => <Card key={c.id}><div className="flex justify-between gap-2"><h3 className="font-sans">{c.name}</h3><Pill tone={c.stale ? "border-yellow-700 text-yellow-800" : "border-ok text-ok"}>{c.stale ? "May be out of date" : "Verified"}</Pill></div>
      <p className="text-muted">{c.kind}, {c.country}, checked {c.checked}</p>{c.note && <p>{c.note}</p>}
      <Btn className="mt-2" onClick={() => setSaved([...saved, c.id])}>{saved.includes(c.id) ? "Saved" : "Save to my contacts"}</Btn></Card>)}
    <p className="text-muted">Listing does not mean endorsement. Check before sharing sensitive information.</p></div>;
}
