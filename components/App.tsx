"use client";
import { useEffect, useState } from "react";
import {
  Bell,
  FileText,
  Home as HomeI,
  ListChecks,
  MessageSquare,
  Settings as SetI,
  ShieldAlert,
  Users,
  LayoutDashboard,
  Activity as ActI,
  LifeBuoy,
  Siren,
  Megaphone,
  Lock,
  LogOut,
  ShieldCheck
} from "lucide-react";
import { SignIn, Invite, Register, Setup, PinSetup, Recover, PinLock, Waiting } from "./screens/Auth";
import { Tasks } from "./screens/Tasks";
import { Home, Files, Safety } from "./screens/Member";
import { Messages } from "./screens/Messages";
import { Announcements } from "./screens/Announcements";
import { CodeRedSheet, AlertStatus, Responder, isLive, newAlert } from "./screens/CodeRed";
import { Overview, Activity } from "./screens/Admin";
import { Members } from "./screens/Members";
import { CodeRedAdmin } from "./screens/CodeRedAdmin";
import { useA11y } from "@/lib/hooks/useA11y";
import { Settings } from "./screens/Settings";
import {
  tasks as t0,
  files as f0,
  members,
  auditSeed,
  orgs,
  seedConvos,
  seedAnns,
  defaultCodeRed
} from "@/lib/mock-data";
import type {
  Alert,
  Announcement,
  CodeRedConfig,
  Member,
  Conversation,
  FileItem,
  LogEntry,
  Task
} from "@/lib/types";

type Phase = "signin" | "invite" | "register" | "setup" | "pin" | "recover" | "waiting" | "app";
type Role = "admin" | "manager" | "member" | "responder";

const ROLES: Record<Role, string> = {
  admin: "Organization admin",
  manager: "Team manager",
  member: "Regular member",
  responder: "Responder"
};

const MEMBER = [
  ["home", "Home", HomeI],
  ["tasks", "Tasks", ListChecks],
  ["files", "Files", FileText],
  ["messages", "Messages", MessageSquare],
  ["announcements", "News", Megaphone],
  ["safety", "Safety", LifeBuoy]
] as const;

const ADMIN = [
  ["overview", "Overview", LayoutDashboard],
  ["members", "Members", Users],
  ["announcements", "News", Megaphone],
  ["alerts", "Alerts", ShieldAlert],
  ["activity", "Activity", ActI],
  ["settings", "Settings", SetI]
] as const;

const KEY = "jw-demo-v1"; // demo preferences only. Never store real data here.

export default function App() {
  const [phase, setPhase] = useState<Phase>("signin");
  const [role, setRole] = useState<Role>("member");
  const [orgId, setOrgId] = useState(orgs[0].id);
  const [screen, setScreen] = useState("home");
  const [tasks, setTasks] = useState<Task[]>(t0);
  const [files, setFiles] = useState<FileItem[]>(f0);
  const [entries, setEntries] = useState<LogEntry[]>(auditSeed);
  const [convos, setConvos] = useState<Conversation[]>(seedConvos);
  const [anns, setAnns] = useState<Announcement[]>(seedAnns);
  const [roster, setRoster] = useState<Member[]>(members);
  const [crCfg, setCrCfg] = useState<Record<string, CodeRedConfig>>(defaultCodeRed);
  useA11y();
  const [alert, setAlert] = useState<Alert | null>(null);
  const [sheet, setSheet] = useState(false);
  const [ready, setReady] = useState(false);
  const [pin, setPin] = useState("");
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "null");
      if (s) {
        setPhase(s.phase);
        setRole(s.role);
        setOrgId(s.orgId);
        setAlert(s.alert);
        setScreen(s.screen || "home");
        setPin(s.pin || "");
        setLocked(!!s.pin && s.phase === "app");
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(KEY, JSON.stringify({ phase, role, orgId, alert, screen, pin }));
      } catch {}
    }
  }, [ready, phase, role, orgId, alert, screen, pin]);

  const isAdmin = role === "admin" || role === "manager";
  const nav = isAdmin
    ? ADMIN.filter(n => role === "admin" || !["alerts", "activity"].includes(n[0]))
    : role === "responder"
    ? [...MEMBER, ["responder", "Respond", Siren] as const]
    : MEMBER;

  const org = orgs.find(o => o.id === orgId);

  if (!org) {
    return (
      <div className="grid min-h-screen place-items-center bg-page text-ink">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy border-t-accent" />
          <p className="text-sm font-semibold text-muted">Organization not found.</p>
        </div>
      </div>
    );
  }

  const people = roster.filter(m => m.orgId === orgId && m.status === "active").map(m => m.name);

  const go = (s: string) => {
    setScreen(s);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const log = (text: string) =>
    setEntries(e => [{ id: "e" + Date.now(), text, when: "Just now (simulated)" }, ...e]);

  const pickRole = (r: Role) => {
    setRole(r);
    go(r === "admin" || r === "manager" ? "overview" : "home");
  };

  const mine = <T extends { orgId: string }>(all: T[]) => all.filter(x => x.orgId === orgId);
  const merge = <T extends { orgId: string }>(all: T[], set: (x: T[]) => void) => (next: T[]) =>
    set([...all.filter(x => x.orgId !== orgId), ...next]);

  const cfg = crCfg[orgId];
  const reset = () => {
    try {
      localStorage.removeItem(KEY);
    } catch {}
    setPhase("signin");
    setAlert(null);
    setPin("");
    setLocked(false);
    go("home");
  };

  // Dynamic nav badge counts for richer UX feedback
  const badgeFor = (id: string): number => {
    if (id === "tasks") return mine(tasks).filter(t => t.assignee === "You" && t.status !== "done").length;
    if (id === "announcements") return mine(anns).filter(a => !a.read).length;
    if (id === "members") return roster.filter(m => m.orgId === orgId && m.status === "pending").length;
    if (id === "responder" && isLive(alert)) return 1;
    return 0;
  };

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-page text-ink">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy border-t-accent" />
          <p className="text-sm font-semibold text-muted">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (phase !== "app") {
    return (
      <main className="min-h-screen bg-page">
        <div className="bg-accent px-3 py-1.5 text-center text-xs font-semibold tracking-wide text-black shadow-sm">
          Prototype: mock data, no real security
        </div>
        <div key={phase} className="animate-tab py-6">
          {phase === "signin" && (
            <SignIn
              onDone={() => setPhase("app")}
              onDemo={r => {
                pickRole(r as Role);
                setPhase("app");
              }}
              onInvite={() => setPhase("invite")}
              onRecover={() => setPhase("recover")}
            />
          )}
          {phase === "invite" && (
            <Invite onDone={() => setPhase("register")} onBack={() => setPhase("signin")} />
          )}
          {phase === "register" && <Register onDone={() => setPhase("setup")} />}
          {phase === "setup" && <Setup onDone={() => setPhase("pin")} />}
          {phase === "pin" && (
            <PinSetup
              onDone={p => {
                setPin(p);
                setPhase("waiting");
              }}
            />
          )}
          {phase === "recover" && <Recover onBack={() => setPhase("signin")} />}
          {phase === "waiting" && (
            <Waiting onDone={() => setPhase("app")} onOut={() => setPhase("signin")} />
          )}
        </div>
      </main>
    );
  }

  if (locked) return <PinLock pin={pin} onUnlock={() => setLocked(false)} onOut={reset} />;

  const body = () => {
    switch (screen) {
      case "alertstatus":
        return alert ? (
          <AlertStatus a={alert} setA={setAlert} onClose={() => go("home")} />
        ) : (
          <p>No alert.</p>
        );
      case "responder":
        return <Responder a={alert} setA={setAlert} go={go} instructions={cfg.instructions} />;
      case "home":
        return (
          <Home
            tasks={mine(tasks)}
            go={go}
            latest={[...mine(anns)].sort((a, b) => b.at - a.at)[0]}
          />
        );
      case "tasks":
        return (
          <Tasks
            tasks={mine(tasks)}
            setTasks={merge(tasks, setTasks)}
            orgId={orgId}
            people={["You", ...people.filter(n => n !== "Amina")]}
            log={log}
          />
        );
      case "files":
        return <Files files={mine(files)} setFiles={merge(files, setFiles)} log={log} />;
      case "messages":
        return (
          <Messages
            convos={mine(convos)}
            setConvos={merge(convos, setConvos)}
            orgId={orgId}
            people={people.filter(n => n !== "Amina")}
            log={log}
          />
        );
      case "announcements":
        return (
          <Announcements
            anns={mine(anns)}
            setAnns={merge(anns, setAnns)}
            orgId={orgId}
            canPost={isAdmin}
            log={log}
          />
        );
      case "safety":
        return <Safety />;
      case "settings":
        return <Settings pin={pin} setPin={setPin} onLogout={reset} log={log} />;
      case "overview":
        return (
          <Overview
            a={alert}
            go={go}
            members={roster.filter(m => m.orgId === orgId)}
            tasks={mine(tasks)}
            entries={entries}
          />
        );
      case "members":
        return (
          <Members
            members={roster}
            setMembers={setRoster}
            orgId={orgId}
            canManage={role === "admin"}
            log={log}
          />
        );
      case "alerts":
        return (
          <CodeRedAdmin
            cfg={cfg}
            setCfg={c => setCrCfg({ ...crCfg, [orgId]: c })}
            names={people}
            adminCount={
              roster.filter(
                m =>
                  m.orgId === orgId &&
                  m.status === "active" &&
                  m.role === "Organization admin"
              ).length
            }
            log={log}
            onDrill={() => {
              setAlert(
                newAlert(
                  "Check on me",
                  "DRILL",
                  (cfg.onCall.length ? cfg.onCall : people).slice(0, 2),
                  false
                )
              );
              log("A Code Red drill started (simulated)");
              go("responder");
            }}
          />
        );
      case "activity":
        return <Activity entries={entries} />;
    }
  };

  const sel =
    "min-h-10 rounded-xl border border-line bg-page/70 px-3 text-sm font-medium text-ink shadow-sm transition hover:bg-white";

  return (
    <div className="min-h-screen bg-page md:flex">
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between bg-navy p-4 text-white shadow-xl md:sticky md:top-0 md:flex md:h-screen">
        <div>
          <div className="mb-6 flex items-center gap-2.5 px-2 pt-1">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent font-serif text-lg font-bold text-black shadow-sm">
              JW
            </div>
            <div>
              <h1 className="text-xl leading-tight text-white">Just Work</h1>
              <p className="text-xs text-white/65">{ROLES[role]}</p>
            </div>
          </div>

          <nav aria-label="Sidebar" className="space-y-1">
            {nav.map(([id, l, I]) => {
              const active = screen === id;
              const count = badgeFor(id);
              return (
                <button
                  key={id}
                  onClick={() => go(id)}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex min-h-11 w-full items-center justify-between rounded-xl px-3.5 text-sm transition-all duration-150 ${
                    active
                      ? "bg-white/15 font-semibold text-white shadow-inner"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {active && (
                      <span className="absolute left-0 h-6 w-1 rounded-r-full bg-accent" />
                    )}
                    <I
                      size={18}
                      className={
                        active
                          ? "text-accent"
                          : "text-white/70 transition-transform group-hover:scale-105 group-hover:text-white"
                      }
                    />
                    {l}
                  </span>
                  {count > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        active ? "bg-accent text-black" : "bg-white/15 text-white"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-1 border-t border-white/15 pt-3">
          {!isAdmin && (
            <button
              onClick={() => go("settings")}
              aria-current={screen === "settings" ? "page" : undefined}
              className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 text-sm transition-all duration-150 ${
                screen === "settings"
                  ? "bg-white/15 font-semibold text-white"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              <SetI size={18} className={screen === "settings" ? "text-accent" : ""} />
              My settings
            </button>
          )}
          <button
            onClick={reset}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 text-sm text-white/70 transition-colors hover:bg-red/20 hover:text-white"
          >
            <LogOut size={18} />
            Quick logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-20 border-b border-line/80 bg-white/90 px-4 py-3 backdrop-blur-md md:px-8">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="text-navy" size={22} />
              <div>
                <b className="font-serif text-lg text-ink">
                  {isAdmin ? `${org.name} — Admin` : org.name}
                </b>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label="Workspace"
                className={sel}
                value={orgId}
                onChange={e => {
                  setOrgId(e.target.value);
                  go(isAdmin ? "overview" : "home");
                }}
              >
                {orgs.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>

              <select
                aria-label="Demo role"
                className={sel}
                value={role}
                onChange={e => pickRole(e.target.value as Role)}
              >
                {(Object.keys(ROLES) as Role[]).map(r => (
                  <option key={r} value={r}>
                    Demo: {ROLES[r]}
                  </option>
                ))}
              </select>

              {!isAdmin && (
                <button
                  aria-label="My settings"
                  onClick={() => go("settings")}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-page/70 text-ink md:hidden"
                >
                  <SetI size={18} />
                </button>
              )}

              {pin && (
                <button
                  onClick={() => setLocked(true)}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-line bg-page/70 px-3 text-sm font-medium text-ink transition hover:bg-white"
                >
                  <Lock size={15} />
                  Lock
                </button>
              )}

              <button
                onClick={reset}
                className="min-h-10 rounded-xl border border-line bg-page/70 px-3 text-sm font-medium text-ink md:hidden"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Subtle Prototype Notice */}
        <div className="border-b border-accent/30 bg-accent/15 px-4 py-1.5 text-center text-xs font-medium text-ink">
          Prototype mode: simulated actions only. Role and workspace switching are for demo preview.
        </div>

        {/* Live Alert Banner */}
        {isLive(alert) && (
          <button
            onClick={() => go(role === "responder" || isAdmin ? "responder" : "alertstatus")}
            className="flex min-h-11 w-full items-center justify-center gap-2 bg-threat px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-threat/95"
          >
            <Bell size={16} className="animate-bounce" />
            Demo alert active: <span className="underline">{alert!.status}</span> — Tap to open
          </button>
        )}

        {/* Animated Single-Page View Container */}
        <main className="mx-auto w-full max-w-4xl flex-1 p-4 pb-36 md:p-8 md:pb-16">
          <div key={`${orgId}-${role}-${screen}`} className="animate-tab">
            {body()}
          </div>
        </main>

        {/* Floating Code Red Action Button */}
        {!isAdmin && (
          <button
            onClick={() => setSheet(true)}
            className="fixed bottom-20 right-4 z-30 flex min-h-14 items-center gap-2 rounded-full bg-red px-6 font-bold text-white shadow-xl ring-4 ring-red/20 transition-all duration-150 hover:scale-105 active:scale-95 md:bottom-8 md:right-8"
          >
            <Siren size={20} />
            Code Red
          </button>
        )}

        {/* Mobile Bottom Navigation */}
        <nav
          aria-label="Main"
          className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-white/95 backdrop-blur-md md:hidden"
        >
          {nav.map(([id, l, I]) => {
            const active = screen === id;
            const count = badgeFor(id);
            return (
              <button
                key={id}
                onClick={() => go(id)}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-h-16 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] transition-colors ${
                  active ? "border-t-2 border-accent font-bold text-navy" : "text-muted"
                }`}
              >
                <I size={18} className={active ? "text-accent" : ""} />
                <span>{l}</span>
                {count > 0 && (
                  <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-accent" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Code Red Modal Sheet */}
      {sheet && (
        <CodeRedSheet
          people={people}
          levels={cfg.levels}
          defaults={
            (() => {
              const filtered = cfg.onCall.slice(0, 2).filter(n => people.includes(n));
              return filtered.length > 0 ? filtered : people.slice(0, 1);
            })()
          }
          onClose={() => setSheet(false)}
          onSend={a => {
            setAlert(a);
            setSheet(false);
            log(`${a.level} alert simulated. Level and time only`);
            go("alertstatus");
          }}
        />
      )}
    </div>
  );
}