"use client";
import { useState, useRef, useEffect } from "react";
import { Btn, Card, Field, Pill } from "@/components/ui";
import { fmt, D } from "@/lib/utilities/time";
import { 
  Plus, 
  Search, 
  Camera, 
  Mic, 
  Paperclip, 
  Image as ImageIcon, 
  MapPin, 
  FileText, 
  Users, 
  User, 
  ArrowLeft, 
  MoreVertical, 
  Check, 
  CheckCheck,
  Send
} from "lucide-react";
import type { Conversation, Message } from "@/lib/types";

export const NOTICE = "Prototype messaging is not end-to-end encrypted. Do not use this demo for confidential or sensitive communication.";

const NEXT = { sent: "delivered", delivered: "read", read: "read" } as const;
const LABEL = { sent: "Sent", delivered: "Delivered", read: "Read" } as const;

type Props = {
  convos: Conversation[];
  setConvos: (c: Conversation[]) => void;
  orgId: string;
  people: string[];
  log: (s: string) => void;
};

export function Messages({ convos, setConvos, orgId, people, log }: Props) {
  const [sel, setSel] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"" | "direct" | "group">("");
  const [info, setInfo] = useState(false);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [pick, setPick] = useState<string[]>([]);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const cur = convos.find(c => c.id === sel);
  const upd = (id: string, f: (c: Conversation) => Conversation) =>
    setConvos(convos.map(c => (c.id === id ? f(c) : c)));

  const last = (c: Conversation) => c.messages[c.messages.length - 1];

  // Filter conversations
  const list = convos.filter(c =>
    (c.name + (last(c)?.text || "")).toLowerCase().includes(q.toLowerCase())
  );

  // Recent contacts list derived from existing conversations or general people list
  const recentContacts = people.slice(0, 6);

  const open = (id: string) => {
    setSel(id);
    setMode("");
    setInfo(false);
    setNote("");
    setShowAttachMenu(false);
  };

  const send = () => {
    if (!cur || !text.trim()) return;
    const msg: Message = {
      id: "m" + Date.now(),
      from: "You",
      text: text.trim(),
      at: Date.now(),
      status: "sent"
    };
    upd(cur.id, c => ({ ...c, messages: [...c.messages, msg] }));
    setText("");
    setShowAttachMenu(false);
  };

  const mk = (c: Omit<Conversation, "id" | "orgId" | "retention" | "messages">) => {
    const id = "c" + Date.now();
    setConvos([...convos, { ...c, id, orgId, retention: "off", messages: [] }]);
    open(id);
  };

  const direct = (p: string) => {
    const ex = convos.find(c => c.kind === "direct" && c.members.includes(p));
    if (ex) return open(ex.id);
    mk({ kind: "direct", name: p, members: ["You", p] });
  };

  const group = () => {
    if (name.trim().length < 2) return setErr("Give the group a name.");
    if (!pick.length) return setErr("Choose at least one member.");
    mk({ kind: "group", name: name.trim(), members: ["You", ...pick] });
    log("Group conversation created (simulated)");
    setName("");
    setPick([]);
    setErr("");
  };

  const cleanup = () => {
    if (!cur) return;
    const cut = Date.now() - 7 * D;
    const n = cur.messages.filter(m => m.at < cut).length;
    upd(cur.id, c => ({ ...c, messages: c.messages.filter(m => m.at >= cut) }));
    setNote(n ? `Simulated cleanup removed ${n} message(s) older than 7 days.` : "Nothing older than 7 days.");
  };

  const advance = () => {
    if (!cur) return;
    upd(cur.id, c => ({
      ...c,
      messages: c.messages.map(m => (m.from === "You" ? { ...m, status: NEXT[m.status] } : m))
    }));
  };

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [cur?.messages]);

  return (
    <div className="space-y-4">
      <p role="note" className="rounded-xl border border-accent bg-accent/15 p-3 text-xs font-medium text-ink">
        {NOTICE}
      </p>

      {/* Main Container */}
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm md:grid md:grid-cols-[20rem_1fr]">
        
        {/* LEFT COLUMN: Chat List & WhatsApp-Style Header */}
        <div className={`flex flex-col border-r border-line bg-white ${sel || mode ? "hidden md:flex" : "flex"}`}>
          
          {/* Header with WhatsApp-style Plus Action Icon */}
          <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
            <h2 className="font-serif text-xl font-bold text-ink">Chats</h2>
            
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                aria-label="New chat or group"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-page text-ink transition hover:bg-line/70"
              >
                <Plus size={20} />
              </button>

              {/* WhatsApp-style Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 top-12 z-30 w-48 rounded-2xl border border-line bg-white py-2 shadow-xl">
                  <button
                    onClick={() => {
                      setMode("direct");
                      setSel(null);
                      setShowDropdown(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-ink hover:bg-page"
                  >
                    <User size={16} className="text-navy" /> New direct chat
                  </button>
                  <button
                    onClick={() => {
                      setMode("group");
                      setSel(null);
                      setErr("");
                      setShowDropdown(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-ink hover:bg-page"
                  >
                    <Users size={16} className="text-navy" /> New group chat
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Full Width Search Bar */}
          <div className="p-3 border-b border-line/60 bg-page/40">
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-3 text-muted" />
              <input
                aria-label="Search conversations"
                placeholder="Search conversations..."
                value={q}
                onChange={e => setQ(e.target.value)}
                className="min-h-11 w-full rounded-xl border border-line bg-white pl-9 pr-3 text-sm text-ink placeholder:text-muted/60 shadow-sm"
              />
            </div>
          </div>

          {/* Recent Contacts Carousel / Row */}
          {!q && (
            <div className="border-b border-line/60 px-3 py-3">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">Recent People</p>
              <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                {recentContacts.map(p => (
                  <button
                    key={p}
                    onClick={() => direct(p)}
                    className="flex flex-shrink-0 flex-col items-center gap-1 group"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-accent font-serif font-bold text-sm shadow-sm transition-transform group-hover:scale-105">
                      {p[0]}
                    </div>
                    <span className="text-[11px] font-medium text-ink truncate max-w-[48px]">{p}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-line/60">
            {list.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted">
                {convos.length ? "No conversations match your search." : "No chats yet. Tap the '+' icon above to start one."}
              </div>
            ) : (
              list.map(c => {
                const active = sel === c.id;
                const msgItem = last(c);
                return (
                  <button
                    key={c.id}
                    onClick={() => open(c.id)}
                    aria-current={active}
                    className={`flex w-full items-start gap-3 p-3.5 text-left transition-colors ${
                      active ? "bg-page font-medium" : "hover:bg-page/50"
                    }`}
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy font-serif font-bold">
                      {c.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink truncate">{c.name}</span>
                        <span className="text-[11px] text-muted flex-shrink-0">
                          {msgItem && fmt(msgItem.at)}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted">
                        {c.kind === "group" ? <span className="font-semibold text-navy">Group: </span> : ""}
                        {msgItem ? `${msgItem.from}: ${msgItem.text}` : "No messages yet"}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Chat View / Creation Modes */}
        <div className={`flex flex-col bg-page/30 ${!sel && !mode ? "hidden md:flex" : "flex"} h-[620px]`}>
          
          {/* New Direct Chat Mode */}
          {mode === "direct" && (
            <div className="flex flex-col h-full p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-serif font-bold text-ink">Start a Direct Chat</h3>
                <button onClick={() => setMode("")} className="text-sm font-semibold text-navy underline">Cancel</button>
              </div>
              <p className="mb-4 text-sm text-muted">Select a team member to begin a private conversation:</p>
              <div className="space-y-2 overflow-y-auto">
                {people.map(p => (
                  <button
                    key={p}
                    onClick={() => direct(p)}
                    className="flex w-full items-center gap-3 rounded-xl border border-line bg-white p-3.5 text-left font-semibold text-ink shadow-sm transition hover:border-navy"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-accent">
                      {p[0]}
                    </div>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* New Group Chat Mode */}
          {mode === "group" && (
            <div className="flex flex-col h-full p-6 overflow-y-auto">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-serif font-bold text-ink">Create New Group</h3>
                <button onClick={() => setMode("")} className="text-sm font-semibold text-navy underline">Cancel</button>
              </div>
              <div className="space-y-4">
                <Field
                  label="Group Name"
                  placeholder="e.g. Campaign Response Unit"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <div>
                  <label className="mb-2 block text-sm font-semibold text-ink">Select Group Members</label>
                  <div className="space-y-2 rounded-2xl border border-line bg-white p-3">
                    {people.map(p => (
                      <label key={p} className="flex min-h-10 cursor-pointer items-center gap-3 text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={pick.includes(p)}
                          onChange={() =>
                            setPick(pick.includes(p) ? pick.filter(x => x !== p) : [...pick, p])
                          }
                          className="h-4 w-4 rounded border-line text-navy"
                        />
                        {p}
                      </label>
                    ))}
                  </div>
                </div>
                {err && <p role="alert" className="text-sm text-red">{err}</p>}
                <Btn kind="navy" onClick={group}>Create Group</Btn>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!mode && !cur && (
            <div className="grid h-full place-items-center p-8 text-center">
              <div className="max-w-xs space-y-2">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy/10 text-navy">
                  <Users size={28} />
                </div>
                <h3 className="text-xl font-serif font-bold text-ink">Your Messages</h3>
                <p className="text-sm text-muted">Select a chat from the left sidebar or tap the '+' icon to start a new conversation.</p>
              </div>
            </div>
          )}

          {/* Active Conversation View */}
          {cur && !mode && (
            <div className="flex flex-col h-full">
              
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-line bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSel(null)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-page text-ink md:hidden"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-accent font-serif font-bold text-sm">
                    {cur.name[0]}
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-ink leading-tight">{cur.name}</h3>
                    <p className="text-xs text-muted">
                      {cur.kind === "group" ? `${cur.members.length} members` : "Active now"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInfo(!info)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-page text-ink transition hover:bg-line/70"
                    aria-label="Chat details"
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              {/* Details Drawer / Modal */}
              {info && (
                <div className="border-b border-line bg-page p-4 text-sm space-y-3 shadow-inner">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-ink">
                      {cur.kind === "group" ? "Group Information" : "Conversation Settings"}
                    </h4>
                    <button onClick={() => setInfo(false)} className="text-xs font-semibold text-navy underline">Close</button>
                  </div>
                  <div>
                    <span className="font-semibold text-muted">Participants: </span>
                    <span>{cur.members.join(", ")}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-muted">Retention Policy: </span>
                    <span className="capitalize">{cur.retention === "7d" ? "Auto-delete after 7 days" : "Keep messages"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {cur.kind === "group" && <Btn onClick={cleanup}>Run simulated cleanup</Btn>}
                    <Btn kind="navy" onClick={advance}>Simulate read receipts</Btn>
                  </div>
                  {note && <p role="status" className="text-xs text-ok font-medium">{note}</p>}
                </div>
              )}

              {/* Messages Body Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cur.messages.length === 0 ? (
                  <div className="grid h-full place-items-center text-center text-sm text-muted">
                    <p>No messages yet. Send a greeting below!</p>
                  </div>
                ) : (
                  cur.messages.map(m => {
                    const isMe = m.from === "You";
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col max-w-[80%] rounded-2xl p-3.5 shadow-sm ${
                          isMe
                            ? "ml-auto bg-navy text-white rounded-br-xs"
                            : "mr-auto bg-white text-ink border border-line rounded-bl-xs"
                        }`}
                      >
                        {!isMe && <span className="mb-1 text-[11px] font-bold text-accent">{m.from}</span>}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                        <div className={`mt-1 flex items-center gap-1.5 text-[10px] ${isMe ? "text-white/70 justify-end" : "text-muted justify-start"}`}>
                          <span>{fmt(m.at)}</span>
                          {isMe && (
                            <span className="flex items-center gap-0.5">
                              <span>{LABEL[m.status]}</span>
                              {m.status === "read" ? <CheckCheck size={12} className="text-accent" /> : <Check size={12} />}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Chat Bar with Camera, Voice Note, Plus Attachments */}
              <div className="relative border-t border-line bg-white p-3">
                
                {/* Popup Attachment Menu (+ icon) */}
                {showAttachMenu && (
                  <div className="absolute bottom-20 left-3 z-30 flex flex-col gap-2 rounded-2xl border border-line bg-white p-3 shadow-xl animate-tab">
                    <button
                      onClick={() => { log("Photo shared (simulated)"); setShowAttachMenu(false); }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-ink hover:bg-page"
                    >
                      <ImageIcon size={16} className="text-accent" /> Share Photo
                    </button>
                    <button
                      onClick={() => { log("Location shared (simulated)"); setShowAttachMenu(false); }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-ink hover:bg-page"
                    >
                      <MapPin size={16} className="text-threat" /> Share Mock Location
                    </button>
                    <button
                      onClick={() => { log("File attached (simulated)"); setShowAttachMenu(false); }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-ink hover:bg-page"
                    >
                      <FileText size={16} className="text-navy" /> Attach Document
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {/* Plus Attachment Button */}
                  <button
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                    aria-label="Attach file or media"
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-page text-ink transition hover:bg-line/70"
                  >
                    <Plus size={20} className={showAttachMenu ? "rotate-45 transition-transform" : "transition-transform"} />
                  </button>

                  {/* Input Text Box */}
                  <input
                    aria-label="Message text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && send()}
                    placeholder="Type a message..."
                    className="min-h-11 flex-1 rounded-xl border border-line bg-page/50 px-4 text-sm text-ink placeholder:text-muted/60 shadow-sm"
                  />

                  {/* Camera Button */}
                  <button
                    onClick={() => log("Camera opened (simulated)")}
                    aria-label="Take photo or video"
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-page text-ink transition hover:bg-line/70"
                  >
                    <Camera size={18} />
                  </button>

                  {/* Voice Note / Send Button */}
                  {text.trim() ? (
                    <button
                      onClick={send}
                      aria-label="Send message"
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-navy text-accent shadow-md transition hover:bg-ink"
                    >
                      <Send size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => log("Voice note recorded (simulated)")}
                      aria-label="Record voice note"
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-page text-ink transition hover:bg-line/70"
                    >
                      <Mic size={18} />
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}


// "use client";
// import { useState } from "react";
// import { Btn, Card, Pill } from "@/components/ui";
// import { fmt, D } from "@/lib/utilities/time";
// import type { Conversation, Message } from "@/lib/types";
// // MOCK MESSAGING held in memory only. Production: server-stored ciphertext with an independently reviewed E2EE design.
// export const NOTICE = "Prototype messaging is not end-to-end encrypted. Do not use this demo for confidential or sensitive communication.";
// const inp = "min-h-12 w-full rounded-xl border border-line bg-white px-3";
// const NEXT = { sent: "delivered", delivered: "read", read: "read" } as const;
// const LABEL = { sent: "Sent", delivered: "Delivered", read: "Read" } as const;
// type Props = { convos: Conversation[]; setConvos: (c: Conversation[]) => void; orgId: string; people: string[]; log: (s: string) => void };
// export function Messages({ convos, setConvos, orgId, people, log }: Props) {
//   const [sel, setSel] = useState<string | null>(null); const [q, setQ] = useState(""); const [mode, setMode] = useState<"" | "direct" | "group">("");
//   const [info, setInfo] = useState(false); const [text, setText] = useState(""); const [name, setName] = useState(""); const [pick, setPick] = useState<string[]>([]); const [err, setErr] = useState(""); const [note, setNote] = useState("");
//   const cur = convos.find(c => c.id === sel);
//   const upd = (id: string, f: (c: Conversation) => Conversation) => setConvos(convos.map(c => c.id === id ? f(c) : c));
//   const last = (c: Conversation) => c.messages[c.messages.length - 1];
//   const list = convos.filter(c => (c.name + (last(c)?.text || "")).toLowerCase().includes(q.toLowerCase()));
//   const open = (id: string) => { setSel(id); setMode(""); setInfo(false); setNote(""); };
//   const send = () => { if (!cur || !text.trim()) return; const msg: Message = { id: "m" + Date.now(), from: "You", text: text.trim(), at: Date.now(), status: "sent" }; upd(cur.id, c => ({ ...c, messages: [...c.messages, msg] })); setText(""); };
//   const mk = (c: Omit<Conversation, "id" | "orgId" | "retention" | "messages">) => { const id = "c" + Date.now(); setConvos([...convos, { ...c, id, orgId, retention: "off", messages: [] }]); open(id); };
//   const direct = (p: string) => { const ex = convos.find(c => c.kind === "direct" && c.members.includes(p)); if (ex) return open(ex.id); mk({ kind: "direct", name: p, members: ["You", p] }); };
//   const group = () => { if (name.trim().length < 2) return setErr("Give the group a name."); if (!pick.length) return setErr("Choose at least one member."); mk({ kind: "group", name: name.trim(), members: ["You", ...pick] }); log("Group conversation created (simulated)"); setName(""); setPick([]); setErr(""); };
//   const cleanup = () => { if (!cur) return; const cut = Date.now() - 7 * D; const n = cur.messages.filter(m => m.at < cut).length; upd(cur.id, c => ({ ...c, messages: c.messages.filter(m => m.at >= cut) })); setNote(n ? `Simulated cleanup removed ${n} message(s) older than 7 days.` : "Nothing older than 7 days."); };
//   const advance = () => { if (!cur) return; upd(cur.id, c => ({ ...c, messages: c.messages.map(m => m.from === "You" ? { ...m, status: NEXT[m.status] } : m) })); };
//   return <div className="space-y-3"><p role="note" className="rounded-lg border border-accent bg-accent/20 p-2 text-sm font-semibold">{NOTICE}</p>
//     <div className="md:grid md:grid-cols-[16rem_1fr] md:gap-4">
//       <div className={`space-y-2 ${sel || mode ? "hidden md:block" : ""}`}>
//         <div className="flex items-center justify-between"><h2 className="text-2xl">Messages</h2><div className="flex gap-1"><button className="min-h-11 rounded-lg border border-line bg-white px-2 text-sm" onClick={() => { setMode("direct"); setSel(null); }}>New chat</button><button className="min-h-11 rounded-lg border border-line bg-white px-2 text-sm" onClick={() => { setMode("group"); setSel(null); setErr(""); }}>New group</button></div></div>
//         <input aria-label="Search conversations" placeholder="Search conversations" value={q} onChange={e => setQ(e.target.value)} className={inp} />
//         {list.length === 0 && <p className="text-muted">{convos.length ? "No conversations match." : "No conversations yet. Start a new chat."}</p>}
//         {list.map(c => <button key={c.id} onClick={() => open(c.id)} aria-current={sel === c.id} className={`block min-h-14 w-full rounded-xl border p-3 text-left ${sel === c.id ? "border-navy bg-white" : "border-line bg-white"}`}><div className="flex justify-between"><b>{c.name}</b><span className="text-sm text-muted">{last(c) && fmt(last(c).at)}</span></div><p className="truncate text-sm text-muted">{c.kind === "group" ? "Group · " : ""}{last(c)?.text || "No messages yet"}</p></button>)}</div>
//       <div className={!sel && !mode ? "hidden md:block" : ""}>
//         {mode === "direct" && <Card className="space-y-2"><h3>Start a direct chat</h3>{people.map(p => <Btn key={p} onClick={() => direct(p)}>{p}</Btn>)}<Btn onClick={() => setMode("")}>Cancel</Btn></Card>}
//         {mode === "group" && <Card className="space-y-2"><h3>New group</h3><label className="block font-semibold">Group name<input className={inp + " font-normal"} value={name} onChange={e => setName(e.target.value)} /></label>
//           <fieldset><legend className="font-semibold">Members</legend>{people.map(p => <label key={p} className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={pick.includes(p)} onChange={() => setPick(pick.includes(p) ? pick.filter(x => x !== p) : [...pick, p])} />{p}</label>)}</fieldset>
//           {err && <p role="alert" className="text-red">{err}</p>}<Btn kind="navy" onClick={group}>Create group</Btn><Btn onClick={() => setMode("")}>Cancel</Btn></Card>}
//         {!mode && !cur && <Card><p className="text-muted">Select a conversation, or start a new one.</p></Card>}
//         {cur && !mode && <div className="space-y-3">
//           <div className="flex items-center justify-between gap-2"><button className="min-h-11 underline md:hidden" onClick={() => setSel(null)}>Back</button><h3 className="flex-1 text-xl">{cur.name}</h3><button className="min-h-11 rounded-lg border border-line bg-white px-3" onClick={() => setInfo(!info)}>{info ? "Close details" : "Details"}</button></div>
//           {info ? <Card className="space-y-3"><h3>{cur.kind === "group" ? "Group information" : "Conversation details"}</h3>
//             <div><b>Members</b>{cur.members.map(m => <div key={m} className="flex items-center justify-between py-1"><span>{m}</span>{cur.kind === "group" && m !== "You" && <button className="min-h-11 underline" onClick={() => { upd(cur.id, c => ({ ...c, members: c.members.filter(x => x !== m) })); log("Group membership changed (simulated)"); }}>Remove</button>}</div>)}</div>
//             {cur.kind === "group" && people.some(p => !cur.members.includes(p)) && <label className="block font-semibold">Add a member<select className={inp + " font-normal"} value="" onChange={e => { if (e.target.value) { upd(cur.id, c => ({ ...c, members: [...c.members, e.target.value] })); log("Group membership changed (simulated)"); } }}><option value="">Choose…</option>{people.filter(p => !cur.members.includes(p)).map(p => <option key={p}>{p}</option>)}</select></label>}
//             <label className="block font-semibold">Message retention (simulated)<select className={inp + " font-normal"} value={cur.retention} onChange={e => upd(cur.id, c => ({ ...c, retention: e.target.value as "off" | "7d" }))}><option value="off">Keep messages</option><option value="7d">Delete after 7 days</option></select></label>
//             {cur.retention === "7d" && <><Btn onClick={cleanup}>Run simulated cleanup</Btn><p className="text-sm text-muted">Nothing is deleted automatically in this prototype. The button shows what a server job would do.</p></>}
//             <Btn onClick={advance}>Simulate: delivery and read updates</Btn>{note && <p role="status" className="text-ok">{note}</p>}</Card>
//           : <>{cur.messages.length === 0 && <Card><p className="text-muted">No messages yet. Say hello.</p></Card>}
//             {cur.messages.map(m => <div key={m.id} className={`max-w-[85%] rounded-2xl p-3 ${m.from === "You" ? "ml-auto bg-navy text-white" : "border border-line bg-white"}`}><small className="opacity-70">{m.from} · {fmt(m.at)}</small><p>{m.text}</p>{m.from === "You" && <small className="opacity-80">{LABEL[m.status]} (simulated)</small>}</div>)}
//             <input aria-label="Message" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Write a message" className={inp} /><Btn kind="navy" disabled={!text.trim()} className="disabled:opacity-40" onClick={send}>Send message</Btn></>}</div>}</div></div></div>;
// }
