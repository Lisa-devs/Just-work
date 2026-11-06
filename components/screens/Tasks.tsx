"use client";
import { useState } from "react";
import { Btn, Card, Pill } from "@/components/ui";
import type { Task } from "@/lib/types";
const ST = { todo: "To do", progress: "In progress", done: "Done" } as const;
const PR = { low: "Low", medium: "Medium", high: "High" } as const;
type Draft = Omit<Task, "id" | "orgId"> & { id?: string };
const blank: Draft = { title: "", description: "", assignee: "You", due: "", priority: "medium", status: "todo" };
const inp = "mt-1 min-h-12 w-full rounded-xl border border-line bg-white px-3 font-normal";
export function Tasks({ tasks, setTasks, orgId, people, log }: { tasks: Task[]; setTasks: (t: Task[]) => void; orgId: string; people: string[]; log: (s: string) => void }) {
  const [q, setQ] = useState(""); const [fs, setFs] = useState("all"); const [fp, setFp] = useState("all");
  const [d, setD] = useState<Draft | null>(null); const [open, setOpen] = useState<string | null>(null); const [err, setErr] = useState("");
  const list = tasks.filter(t => (fs === "all" || t.status === fs) && (fp === "all" || t.priority === fp) && (t.title + t.description + t.assignee).toLowerCase().includes(q.toLowerCase()));
  const save = () => { if (!d) return; if (d.title.trim().length < 3) return setErr("Give the task a title of at least 3 characters."); setErr("");
    if (d.id) { setTasks(tasks.map(t => t.id === d.id ? { ...t, ...d } as Task : t)); log(`Task updated: ${d.title}`); } else { setTasks([...tasks, { ...d, id: "t" + Date.now(), orgId } as Task]); log(`Task created: ${d.title}`); } setD(null); };
  const done = (t: Task) => { setTasks(tasks.map(x => x.id === t.id ? { ...x, status: "done" } : x)); log(`Task completed: ${t.title}`); };
  const set = (p: Partial<Draft>) => setD({ ...d!, ...p });
  if (d) return <div className="space-y-3"><h2 className="text-2xl">{d.id ? "Edit task" : "New task"}</h2>
    <label className="block font-semibold">Title<input className={inp} value={d.title} onChange={e => set({ title: e.target.value })} /></label>
    <label className="block font-semibold">Description<textarea className={inp + " min-h-24 py-2"} value={d.description} onChange={e => set({ description: e.target.value })} /></label>
    <label className="block font-semibold">Assign to<select className={inp} value={d.assignee} onChange={e => set({ assignee: e.target.value })}>{people.map(p => <option key={p}>{p}</option>)}</select></label>
    <label className="block font-semibold">Due date<input type="date" className={inp} value={/^\d{4}-/.test(d.due) ? d.due : ""} onChange={e => set({ due: e.target.value })} /></label>
    <label className="block font-semibold">Priority<select className={inp} value={d.priority} onChange={e => set({ priority: e.target.value as Task["priority"] })}>{Object.entries(PR).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
    <label className="block font-semibold">Status<select className={inp} value={d.status} onChange={e => set({ status: e.target.value as Task["status"] })}>{Object.entries(ST).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
    {err && <p role="alert" className="text-red">{err}</p>}<Btn kind="navy" onClick={save}>Save task</Btn><Btn onClick={() => { setD(null); setErr(""); }}>Cancel</Btn></div>;
  return <div className="space-y-3"><div className="flex items-center justify-between"><h2 className="text-2xl">Tasks</h2><button className="min-h-11 rounded-xl bg-navy px-4 font-bold text-white" onClick={() => setD(blank)}>New task</button></div>
    <input aria-label="Search tasks" placeholder="Search tasks" value={q} onChange={e => setQ(e.target.value)} className={inp} />
    <div className="grid grid-cols-2 gap-2"><select aria-label="Filter by status" className={inp} value={fs} onChange={e => setFs(e.target.value)}><option value="all">All statuses</option>{Object.entries(ST).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      <select aria-label="Filter by priority" className={inp} value={fp} onChange={e => setFp(e.target.value)}><option value="all">All priorities</option>{Object.entries(PR).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
    {list.length === 0 && <Card><p className="text-muted">{tasks.length ? "No tasks match. Clear the search or filters." : "No tasks yet. Create the first one."}</p></Card>}
    {list.map(t => <Card key={t.id}><div className="flex items-start justify-between gap-2"><h3 className={`font-sans ${t.status === "done" ? "line-through" : ""}`}>{t.title}</h3><Pill tone={t.priority === "high" ? "border-red text-red" : ""}>{PR[t.priority]} priority</Pill></div>
      <p className="text-muted">{t.assignee}{t.due && `, due ${t.due}`} · {ST[t.status]}</p>
      {open === t.id && <p className="mt-2">{t.description || "No description."}</p>}
      <div className="mt-2 grid grid-cols-3 gap-2"><Btn onClick={() => setOpen(open === t.id ? null : t.id)}>{open === t.id ? "Hide" : "Details"}</Btn><Btn onClick={() => setD({ ...t })}>Edit</Btn>
        <Btn kind="navy" disabled={t.status === "done"} className="disabled:opacity-40" onClick={() => done(t)}>{t.status === "done" ? "Done" : "Complete"}</Btn></div></Card>)}</div>;
}
