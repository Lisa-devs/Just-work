"use client";
import { useState, useEffect, ReactNode } from "react";
import {
  ShieldCheck,
  Lock,
  Siren,
  Users,
  KeyRound,
  Sparkles,
  CheckCircle2,
  Copy,
  Building2,
  UserCheck,
  ArrowLeft,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { Btn, Card, Field } from "@/components/ui";

// Shared wrapper for multi-step auth flows
const Wrap = ({ title, step, children }: { title: string; step?: string; children: ReactNode }) => (
  <div className="mx-auto max-w-md px-4 py-8">
    <div className="mb-6 flex items-center justify-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-accent shadow-md">
        <ShieldCheck size={22} />
      </div>
      <span className="font-serif text-2xl font-bold text-ink">Just Work</span>
    </div>
    <div className="rounded-3xl border border-line bg-white p-6 shadow-xl shadow-navy/5 sm:p-8">
      {step && (
        <span className="mb-2 inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">
          {step}
        </span>
      )}
      <h2 className="mb-4 text-2xl text-ink">{title}</h2>
      {children}
    </div>
  </div>
);

const Err = ({ m }: { m: string }) =>
  m ? (
    <p role="alert" className="mb-3 rounded-xl border border-red/20 bg-red/5 px-3 py-2 text-sm font-medium text-red">
      {m}
    </p>
  ) : null;

const Link = ({ onClick, children }: { onClick: () => void; children: ReactNode }) => (
  <button
    onClick={onClick}
    className="mt-2 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-navy underline-offset-4 hover:underline"
  >
    {children}
  </button>
);

// Slideshow items for the left brand panel
const SLIDES = [
  {
    tagline: "Built for Frontline & Justice Teams",
    title: "Coordinate daily work. Respond when safety is on the line.",
    desc: "A private, invite-only operations hub combining encrypted team coordination and strict access controls."
  },
  {
    tagline: "Code Red Emergency Protocol",
    title: "Instant distress response & automated on-call triage.",
    desc: "One-tap emergency alerts with verified legal aid directories and real-time responder escalation."
  },
  {
    tagline: "Enterprise Security Architecture",
    title: "Invite-only access with mandatory 2FA & PIN locking.",
    desc: "Secure device sessions, instant remote revocation, and tamper-evident audit logs."
  },
  {
    tagline: "Compartmentalized Collaboration",
    title: "Granular permissions and ephemeral team communications.",
    desc: "Protect sensitive case files and maintain 7-day secure chat retention policies effortlessly."
  }
];

export function SignIn({
  onDone,
  onDemo,
  onInvite,
  onRecover
}: {
  onDone: () => void;
  onDemo: (r: string) => void;
  onInvite: () => void;
  onRecover: () => void;
}) {
  const [err, setErr] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [s, setS] = useState({ email: "amina@savanna.org", pw: "demo-password", code: "" });
  const [activeSlide, setActiveSlide] = useState(0);

  // Automatic slideshow ticker every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleRoleSelect = (id: string) => {
    setSelectedRole(id);
    setErr("");
    // Pre-fill realistic emails based on persona
    if (id === "admin") setS(prev => ({ ...prev, email: "amina.admin@savanna.org" }));
    else if (id === "manager") setS(prev => ({ ...prev, email: "tunde.mgr@savanna.org" }));
    else if (id === "member") setS(prev => ({ ...prev, email: "amina@savanna.org" }));
    else if (id === "responder") setS(prev => ({ ...prev, email: "responder@savanna.org" }));
  };

  const go = () => {
    if (!/^\d{6}$/.test(s.code.replace(/\s/g, ""))) {
      return setErr("Enter any 6 digits for the authenticator code to sign in.");
    }
    if (selectedRole) {
      onDemo(selectedRole);
    } else {
      onDone();
    }
  };

  const personas = [
    {
      id: "admin",
      label: "Organization Admin",
      desc: "Full oversight, member approvals, audit logs & system config",
      icon: Building2,
      badge: "High Privilege"
    },
    {
      id: "manager",
      label: "Team Manager",
      desc: "Coordinate tasks, file permissions & team announcements",
      icon: Users,
      badge: "Operations"
    },
    {
      id: "member",
      label: "Regular Member",
      desc: "Daily tasks, secure team chat & Code Red distress trigger",
      icon: UserCheck,
      badge: "Standard"
    },
    {
      id: "responder",
      label: "On-Call Responder",
      desc: "Live emergency dispatch triage, alerts & safety directory",
      icon: Siren,
      badge: "Emergency"
    }
  ] as const;

  const currentSlide = SLIDES[activeSlide];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-16">
      <div className="grid overflow-hidden rounded-3xl border border-line bg-white shadow-2xl shadow-navy/10 lg:grid-cols-12">
        
        {/* Left Brand Panel with Slideshow */}
        <div className="relative flex flex-col justify-between overflow-hidden bg-navy p-8 text-white lg:col-span-5 lg:p-12">
          {/* Ambient radial glow */}
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="relative z-10">
            {/* Prominent "Just Work" Logo Lockup */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-navy shadow-lg shadow-accent/30 ring-4 ring-white/15">
                <ShieldCheck size={32} strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Just Work
                </span>
                <span className="block text-xs font-semibold uppercase tracking-widest text-accent">
                  Protected Workspace
                </span>
              </div>
            </div>

            {/* Slideshow Content Container */}
            <div className="mt-16 min-h-[220px]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-medium text-accent">
                <Sparkles size={13} /> {currentSlide.tagline}
              </span>
              <h2 className="mt-5 font-serif text-2xl leading-relaxed text-white/95 sm:text-3xl font-semibold">
                {currentSlide.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                {currentSlide.desc}
              </p>
            </div>
          </div>

          {/* Slideshow Indicators & Footer */}
          <div className="relative z-10 mt-12 flex items-center justify-between border-t border-white/15 pt-6">
            <div className="flex items-center gap-2">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeSlide === idx ? "w-8 bg-accent" : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-white/50 font-medium">v1.0 Pitch Edition</span>
          </div>
        </div>

        {/* Right Dynamic Content Panel (Step 1: Persona Picker -> Step 2: Credentials Form) */}
        <div className="flex flex-col justify-between p-8 sm:p-12 lg:col-span-7 bg-white">
          
          {!selectedRole ? (
            /* STEP 1: WELCOME BACK & PERSONA CARDS */
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-serif font-bold text-ink">Welcome back</h3>
                <p className="mt-1 text-sm text-muted">
                  Select your organizational persona to access your secure hub.
                </p>
              </div>

              <div className="space-y-3">
                {personas.map(({ id, label, desc, icon: Icon, badge }) => (
                  <button
                    key={id}
                    onClick={() => handleRoleSelect(id)}
                    className="group flex w-full items-center justify-between rounded-2xl border border-line bg-page/40 p-4 text-left transition-all duration-200 hover:border-navy hover:bg-white hover:shadow-md active:scale-[0.99]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-white p-3 text-navy shadow-sm ring-1 ring-line transition-colors group-hover:bg-navy group-hover:text-accent">
                        <Icon size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-sans text-base font-bold text-ink group-hover:text-navy">
                            {label}
                          </h4>
                          <span className="rounded-full bg-line/60 px-2 py-0.5 text-[10px] font-semibold text-muted">
                            {badge}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted">{desc}</p>
                      </div>
                    </div>
                    <div className="rounded-full bg-white p-2 text-muted shadow-sm transition-transform group-hover:translate-x-1 group-hover:text-navy">
                      <ChevronRight size={18} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* STEP 2: SIGN-IN CREDENTIALS FORM (AFTER PERSONA SELECTED) */
            <div className="animate-tab">
              <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">
                    Selected Persona: {personas.find(p => p.id === selectedRole)?.label}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-ink">Sign in to Workspace</h3>
                </div>
                <button
                  onClick={() => setSelectedRole(null)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-page px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-white"
                >
                  <ArrowLeft size={14} /> Change Persona
                </button>
              </div>

              <div className="space-y-4">
                <Field
                  label="Work Email"
                  value={s.email}
                  onChange={e => setS({ ...s, email: e.target.value })}
                />
                <Field
                  label="Password"
                  type="password"
                  value={s.pw}
                  onChange={e => setS({ ...s, pw: e.target.value })}
                />
                <Field
                  label="Six-digit Authenticator Code (2FA)"
                  inputMode="numeric"
                  placeholder="Enter any 6 digits (e.g. 123456)"
                  value={s.code}
                  onChange={e => setS({ ...s, code: e.target.value })}
                />

                <Err m={err} />

                <div className="flex items-center justify-between py-1 text-sm text-ink">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-line text-navy" />
                    This is a shared device
                  </label>
                  <span className="text-xs text-muted">Protected session</span>
                </div>

                <Btn kind="navy" className="mt-2" onClick={go}>
                  Sign in to Workspace
                </Btn>
              </div>
            </div>
          )}

          {/* Bottom Links */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4 text-sm">
            <Link onClick={onInvite}>
              <KeyRound size={15} /> I have an invite code
            </Link>
            <Link onClick={onRecover}>Lost access? Recover account</Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export function Invite({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const [c, setC] = useState("");
  const [err, setErr] = useState("");
  return (
    <Wrap title="Enter your invite code" step="Step 1 of 4">
      <p className="mb-4 text-sm text-muted">
        Just Work is invite-only. Enter the single-use code provided by your organization administrator.
      </p>
      <Field
        label="Invite code"
        value={c}
        onChange={e => setC(e.target.value)}
        placeholder="JUST-DEMO-2026"
      />
      <div className="mb-4 flex items-center justify-between rounded-xl bg-page px-3 py-2 text-xs text-muted">
        <span>
          Demo code: <b className="font-mono text-ink">JUST-DEMO-2026</b>
        </span>
        <button
          type="button"
          onClick={() => setC("JUST-DEMO-2026")}
          className="font-semibold text-navy underline"
        >
          Auto-fill
        </button>
      </div>
      <Err m={err} />
      <Btn
        kind="primary"
        onClick={() =>
          c.trim().toUpperCase() === "JUST-DEMO-2026"
            ? onDone()
            : setErr("That code isn't valid or has expired. Try JUST-DEMO-2026.")
        }
      >
        Continue
      </Btn>
      <div className="mt-3 text-center">
        <Link onClick={onBack}>Back to sign in</Link>
      </div>
    </Wrap>
  );
}

export function Register({ onDone }: { onDone: () => void }) {
  const [f, setF] = useState({ name: "", alias: "", useAlias: false, pw: "", pw2: "" });
  const [e, setE] = useState<Record<string, string>>({});
  const submit = () => {
    const x: Record<string, string> = {};
    if (f.name.trim().length < 2) x.name = "Enter your name.";
    if (f.useAlias && !f.alias.trim()) x.alias = "Enter the alias others will see.";
    if (f.pw.length < 12) x.pw = "Use at least 12 characters.";
    if (f.pw2 !== f.pw) x.pw2 = "Passwords do not match.";
    setE(x);
    if (!Object.keys(x).length) onDone();
  };
  return (
    <Wrap title="Create your account" step="Step 2 of 4 • Savanna Climate Network">
      <Field label="Your name" value={f.name} onChange={x => setF({ ...f, name: x.target.value })} />
      <Err m={e.name || ""} />
      <label className="mb-3 flex min-h-10 cursor-pointer items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={f.useAlias}
          onChange={x => setF({ ...f, useAlias: x.target.checked })}
        />
        Show an alias instead of my real name
      </label>
      {f.useAlias && (
        <>
          <Field
            label="Alias"
            value={f.alias}
            onChange={x => setF({ ...f, alias: x.target.value })}
          />
          <Err m={e.alias || ""} />
        </>
      )}
      <Field
        label="Password (12+ characters)"
        type="password"
        value={f.pw}
        onChange={x => setF({ ...f, pw: x.target.value })}
      />
      <Err m={e.pw || ""} />
      <Field
        label="Confirm password"
        type="password"
        value={f.pw2}
        onChange={x => setF({ ...f, pw2: x.target.value })}
      />
      <Err m={e.pw2 || ""} />
      <Btn kind="primary" onClick={submit}>
        Create account
      </Btn>
      <p className="mt-3 text-center text-xs text-muted">Demo only: nothing is saved or sent.</p>
    </Wrap>
  );
}

export function Setup({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState<"scan" | "codes">("scan");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState("");
  const [codes] = useState(() =>
    Array.from(
      { length: 10 },
      () => Math.random().toString(36).slice(2, 6) + "-" + Math.random().toString(36).slice(2, 6)
    )
  );
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(codes.join("\n"));
      setCopied("Copied. Paste them somewhere safe.");
    } catch {
      setCopied("Copy was blocked. Select the codes and copy them by hand.");
    }
  };

  if (stage === "scan")
    return (
      <Wrap title="Secure your account" step="Step 3 of 4">
        <p className="mb-4 text-sm text-muted">
          Scan this with your authenticator app, then enter the six-digit verification code.
        </p>
        <Card className="mb-4 grid h-44 place-items-center bg-page/50">
          <div className="grid h-32 w-32 place-items-center rounded-xl border-2 border-dashed border-muted/50 bg-white p-2 text-center text-xs text-muted">
            2FA QR Placeholder (Demo)
          </div>
        </Card>
        <Field
          label="Six-digit code"
          inputMode="numeric"
          placeholder="123456"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        <Err m={err} />
        <Btn
          kind="primary"
          onClick={() =>
            /^\d{6}$/.test(code.replace(/\s/g, ""))
              ? setStage("codes")
              : setErr("Enter the six digits from your app.")
          }
        >
          Verify
        </Btn>
      </Wrap>
    );

  return (
    <Wrap title="Save your recovery codes" step="Step 3 of 4">
      <p className="mb-3 text-sm text-muted">
        Single-use backup codes in case you lose your phone. (Demo codes only).
      </p>
      <Card className="mb-3 bg-page/60">
        <ul className="grid grid-cols-2 gap-1.5 font-mono text-sm">
          {codes.map(c => (
            <li key={c} className="rounded bg-white px-2 py-1 text-center border border-line/60">
              {c}
            </li>
          ))}
        </ul>
      </Card>
      <Btn onClick={copy} className="gap-2">
        <Copy size={16} /> Copy codes
      </Btn>
      {copied && (
        <p role="status" className="mt-2 text-xs font-semibold text-ok">
          {copied}
        </p>
      )}
      <label className="my-3 flex min-h-10 cursor-pointer items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={saved} onChange={e => setSaved(e.target.checked)} /> I have
        saved these recovery codes
      </label>
      <Btn kind="primary" disabled={!saved} onClick={onDone}>
        Continue
      </Btn>
    </Wrap>
  );
}

export function PinSetup({ onDone }: { onDone: (p: string) => void }) {
  const [p, setP] = useState("");
  const [p2, setP2] = useState("");
  const [err, setErr] = useState("");
  return (
    <Wrap title="Choose a quick-lock PIN" step="Step 4 of 4">
      <p className="mb-4 text-sm text-muted">
        Your PIN locks the workspace when idle or reopened.
      </p>
      <Field
        label="PIN (4 to 6 digits)"
        type="password"
        inputMode="numeric"
        value={p}
        onChange={e => setP(e.target.value)}
      />
      <Field
        label="Confirm PIN"
        type="password"
        inputMode="numeric"
        value={p2}
        onChange={e => setP2(e.target.value)}
      />
      <Err m={err} />
      <Btn
        kind="primary"
        onClick={() =>
          !/^\d{4,6}$/.test(p)
            ? setErr("Use 4 to 6 digits.")
            : p !== p2
            ? setErr("PINs do not match.")
            : onDone(p)
        }
      >
        Set PIN
      </Btn>
    </Wrap>
  );
}

export function Recover({ onBack }: { onBack: () => void }) {
  const [em, setEm] = useState("");
  const [c, setC] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  if (ok)
    return (
      <Wrap title="Recovery accepted (demo)">
        <p className="mb-4 text-sm text-muted">
          A production deployment signs you in once with that recovery code, marks it used, and prompts you to enroll a new authenticator.
        </p>
        <Btn kind="navy" onClick={onBack}>
          Back to sign in
        </Btn>
      </Wrap>
    );
  return (
    <Wrap title="Recover your account">
      <p className="mb-4 text-sm text-muted">
        Enter your email and one of your saved recovery codes.
      </p>
      <Field label="Email" value={em} onChange={e => setEm(e.target.value)} />
      <Field
        label="Recovery code"
        placeholder="abcd-1234"
        value={c}
        onChange={e => setC(e.target.value)}
      />
      <Err m={err} />
      <Btn
        kind="primary"
        onClick={() =>
          !/^\S+@\S+\.\S+$/.test(em)
            ? setErr("Enter a valid email.")
            : !/^[a-z0-9]{4}-[a-z0-9]{4}$/i.test(c.trim())
            ? setErr("Recovery codes look like abcd-1234.")
            : setOk(true)
        }
      >
        Recover Account
      </Btn>
      <div className="mt-3 text-center">
        <Link onClick={onBack}>Back to sign in</Link>
      </div>
    </Wrap>
  );
}

export function PinLock({
  pin,
  onUnlock,
  onOut
}: {
  pin: string;
  onUnlock: () => void;
  onOut: () => void;
}) {
  const [v, setV] = useState("");
  const [n, setN] = useState(0);
  const out = n >= 5;
  return (
    <main className="grid min-h-screen place-items-center bg-navy p-6">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-accent shadow-md">
          <Lock size={26} />
        </div>
        <h2 className="text-2xl text-ink">Workspace Locked</h2>
        <p className="my-2 text-sm text-muted">Enter your PIN to resume your session.</p>
        <input
          aria-label="PIN"
          type="password"
          inputMode="numeric"
          value={v}
          disabled={out}
          onChange={e => setV(e.target.value)}
          onKeyDown={e =>
            e.key === "Enter" && !out && (v === pin ? onUnlock() : (setN(n + 1), setV("")))
          }
          className="my-3 min-h-12 w-full rounded-xl border border-line px-3 text-center text-2xl tracking-widest"
        />
        {n > 0 && (
          <p role="alert" className="mb-3 text-sm font-medium text-red">
            {out
              ? "Too many attempts (simulated lockout). Sign out and sign in again."
              : `Incorrect PIN. ${5 - n} tries remaining.`}
          </p>
        )}
        <Btn
          kind="navy"
          disabled={out}
          onClick={() => (v === pin ? onUnlock() : (setN(n + 1), setV("")))}
        >
          Unlock Workspace
        </Btn>
        <Btn className="mt-2" onClick={onOut}>
          Sign out instead
        </Btn>
      </div>
    </main>
  );
}

export const Waiting = ({ onDone, onOut }: { onDone: () => void; onOut: () => void }) => (
  <Wrap title="Waiting for admin approval">
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-threat">
        <CheckCircle2 size={32} />
      </div>
      <p className="mb-6 text-sm text-muted">
        Your account request has been submitted. An organization admin must verify your identity before you can access the workspace.
      </p>
      <Btn kind="primary" onClick={onDone}>
        Demo: Simulate Admin Approval
      </Btn>
      <Btn className="mt-2" onClick={onOut}>
        Sign out
      </Btn>
    </div>
  </Wrap>
);


// "use client";
// import { useState, useEffect, ReactNode } from "react";
// import {
//   ShieldCheck,
//   Lock,
//   Siren,
//   Users,
//   KeyRound,
//   ArrowRight,
//   Sparkles,
//   CheckCircle2,
//   Copy,
//   Building2,
//   UserCheck
// } from "lucide-react";
// import { Btn, Card, Field } from "@/components/ui";

// // Shared wrapper for multi-step auth flows (Invite, Register, 2FA, Recover)
// const Wrap = ({ title, step, children }: { title: string; step?: string; children: ReactNode }) => (
//   <div className="mx-auto max-w-md px-4 py-8">
//     <div className="mb-6 flex items-center justify-center gap-2.5">
//       <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-accent shadow-md">
//         <ShieldCheck size={22} />
//       </div>
//       <span className="font-serif text-2xl font-bold text-ink">Just Work</span>
//     </div>
//     <div className="rounded-3xl border border-line bg-white p-6 shadow-xl shadow-navy/5 sm:p-8">
//       {step && (
//         <span className="mb-2 inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">
//           {step}
//         </span>
//       )}
//       <h2 className="mb-4 text-2xl text-ink">{title}</h2>
//       {children}
//     </div>
//   </div>
// );

// const Err = ({ m }: { m: string }) =>
//   m ? (
//     <p role="alert" className="mb-3 rounded-xl border border-red/20 bg-red/5 px-3 py-2 text-sm font-medium text-red">
//       {m}
//     </p>
//   ) : null;

// const Link = ({ onClick, children }: { onClick: () => void; children: ReactNode }) => (
//   <button
//     onClick={onClick}
//     className="mt-2 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-navy underline-offset-4 hover:underline"
//   >
//     {children}
//   </button>
// );

// // Slideshow items for the left brand panel
// const SLIDES = [
//   {
//     tagline: "Built for Frontline & Justice Teams",
//     title: "Coordinate daily work. Respond when safety is on the line.",
//     desc: "A private, invite-only operations hub combining encrypted team coordination and strict access controls."
//   },
//   {
//     tagline: "Code Red Emergency Protocol",
//     title: "Instant distress response & automated on-call triage.",
//     desc: "One-tap emergency alerts with verified legal aid directories and real-time responder escalation."
//   },
//   {
//     tagline: "Enterprise Security Architecture",
//     title: "Invite-only access with mandatory 2FA & PIN locking.",
//     desc: "Secure device sessions, instant remote revocation, and tamper-evident audit logs."
//   },
//   {
//     tagline: "Compartmentalized Collaboration",
//     title: "Granular permissions and ephemeral team communications.",
//     desc: "Protect sensitive case files and maintain 7-day secure chat retention policies effortlessly."
//   }
// ];

// export function SignIn({
//   onDone,
//   onDemo,
//   onInvite,
//   onRecover
// }: {
//   onDone: () => void;
//   onDemo: (r: string) => void;
//   onInvite: () => void;
//   onRecover: () => void;
// }) {
//   const [err, setErr] = useState("");
//   const [s, setS] = useState({ email: "amina@savanna.org", pw: "demo-password", code: "" });
//   const [activeSlide, setActiveSlide] = useState(0);

//   // Automatic slideshow ticker every 5 seconds
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setActiveSlide(prev => (prev + 1) % SLIDES.length);
//     }, 5000);
//     return () => clearInterval(timer);
//   }, []);

//   const go = () =>
//     /^\d{6}$/.test(s.code.replace(/\s/g, ""))
//       ? onDone()
//       : setErr("Enter any 6 digits for the authenticator code to sign in.");

//   const demoRoles = [
//     { id: "admin", label: "Admin", icon: Building2 },
//     { id: "manager", label: "Manager", icon: Users },
//     { id: "member", label: "Member", icon: UserCheck },
//     { id: "responder", label: "Responder", icon: Siren }
//   ] as const;

//   const currentSlide = SLIDES[activeSlide];

//   return (
//     <div className="mx-auto max-w-6xl px-4 py-6 md:py-12">
//       <div className="grid overflow-hidden rounded-3xl border border-line bg-white shadow-2xl shadow-navy/10 lg:grid-cols-12">
        
//         {/* Left Brand Panel with Slideshow */}
//         <div className="relative flex flex-col justify-between overflow-hidden bg-navy p-8 text-white lg:col-span-5 lg:p-12">
//           {/* Ambient radial glow */}
//           <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
//           <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />

//           <div className="relative z-10">
//             {/* Logo Lockup */}
//             <div className="flex items-center gap-3.5">
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-navy shadow-lg shadow-accent/25 ring-4 ring-white/10">
//                 <ShieldCheck size={26} strokeWidth={2.3} />
//               </div>
//               <div>
//                 <span className="font-serif text-2xl font-bold tracking-tight text-white">
//                   Just Work
//                 </span>
//                 <span className="block text-[11px] font-semibold uppercase tracking-widest text-accent">
//                   Protected Workspace
//                 </span>
//               </div>
//             </div>

//             {/* Slideshow Content Container with smooth keyframe transition */}
//             <div className="mt-16 min-h-[220px]">
//               <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-medium text-accent">
//                 <Sparkles size={13} /> {currentSlide.tagline}
//               </span>
//               <h1 className="mt-6 font-serif text-3xl leading-snug text-white sm:text-4xl">
//                 {currentSlide.title}
//               </h1>
//               <p className="mt-4 text-sm leading-relaxed text-white/75">
//                 {currentSlide.desc}
//               </p>
//             </div>
//           </div>

//           {/* Slideshow Indicators & Footer */}
//           <div className="relative z-10 mt-12 flex items-center justify-between border-t border-white/15 pt-6">
//             <div className="flex items-center gap-2">
//               {SLIDES.map((_, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setActiveSlide(idx)}
//                   aria-label={`Go to slide ${idx + 1}`}
//                   className={`h-2 rounded-full transition-all duration-300 ${
//                     activeSlide === idx ? "w-8 bg-accent" : "w-2 bg-white/30 hover:bg-white/50"
//                   }`}
//                 />
//               ))}
//             </div>
//             <span className="text-xs text-white/50 font-medium">v1.0 Pitch Edition</span>
//           </div>
//         </div>

//         {/* Right Sign-In & Compact Demo Role Panel */}
//         <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-7 bg-white">
//           <div>
//             {/* Header & Clean Demo Role Switcher */}
//             <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
//               <div>
//                 <h2 className="text-2xl font-serif font-bold text-ink">Welcome back</h2>
//                 <p className="text-sm text-muted">Sign in to access your secure organization hub.</p>
//               </div>
              
//               {/* Quick Role Pill Switcher */}
//               <div className="flex items-center gap-1 rounded-xl bg-page p-1 border border-line">
//                 {demoRoles.map(({ id, label, icon: Icon }) => (
//                   <button
//                     key={id}
//                     onClick={() => onDemo(id)}
//                     title={`Demo as ${label}`}
//                     className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink transition hover:bg-white hover:shadow-sm"
//                   >
//                     <Icon size={13} className="text-navy" />
//                     <span className="hidden sm:inline">{label}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Standard Sign-In Form */}
//             <div className="space-y-4">
//               <Field
//                 label="Work Email"
//                 value={s.email}
//                 onChange={e => setS({ ...s, email: e.target.value })}
//               />
//               <Field
//                 label="Password"
//                 type="password"
//                 value={s.pw}
//                 onChange={e => setS({ ...s, pw: e.target.value })}
//               />
//               <Field
//                 label="Six-digit Authenticator Code (2FA)"
//                 inputMode="numeric"
//                 placeholder="Enter any 6 digits (e.g. 123456)"
//                 value={s.code}
//                 onChange={e => setS({ ...s, code: e.target.value })}
//               />

//               <Err m={err} />

//               <div className="flex items-center justify-between py-1 text-sm text-ink">
//                 <label className="flex cursor-pointer items-center gap-2">
//                   <input type="checkbox" className="h-4 w-4 rounded border-line text-navy" />
//                   This is a shared device
//                 </label>
//                 <span className="text-xs text-muted">Protected session</span>
//               </div>

//               <Btn kind="navy" className="mt-2" onClick={go}>
//                 Sign in to Workspace
//               </Btn>
//             </div>
//           </div>

//           {/* Bottom Links */}
//           <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4 text-sm">
//             <Link onClick={onInvite}>
//               <KeyRound size={15} /> I have an invite code
//             </Link>
//             <Link onClick={onRecover}>Lost access? Recover account</Link>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// export function Invite({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
//   const [c, setC] = useState("");
//   const [err, setErr] = useState("");
//   return (
//     <Wrap title="Enter your invite code" step="Step 1 of 4">
//       <p className="mb-4 text-sm text-muted">
//         Just Work is invite-only. Enter the single-use code provided by your organization administrator.
//       </p>
//       <Field
//         label="Invite code"
//         value={c}
//         onChange={e => setC(e.target.value)}
//         placeholder="JUST-DEMO-2026"
//       />
//       <div className="mb-4 flex items-center justify-between rounded-xl bg-page px-3 py-2 text-xs text-muted">
//         <span>
//           Demo code: <b className="font-mono text-ink">JUST-DEMO-2026</b>
//         </span>
//         <button
//           type="button"
//           onClick={() => setC("JUST-DEMO-2026")}
//           className="font-semibold text-navy underline"
//         >
//           Auto-fill
//         </button>
//       </div>
//       <Err m={err} />
//       <Btn
//         kind="primary"
//         onClick={() =>
//           c.trim().toUpperCase() === "JUST-DEMO-2026"
//             ? onDone()
//             : setErr("That code isn't valid or has expired. Try JUST-DEMO-2026.")
//         }
//       >
//         Continue
//       </Btn>
//       <div className="mt-3 text-center">
//         <Link onClick={onBack}>Back to sign in</Link>
//       </div>
//     </Wrap>
//   );
// }

// export function Register({ onDone }: { onDone: () => void }) {
//   const [f, setF] = useState({ name: "", alias: "", useAlias: false, pw: "", pw2: "" });
//   const [e, setE] = useState<Record<string, string>>({});
//   const submit = () => {
//     const x: Record<string, string> = {};
//     if (f.name.trim().length < 2) x.name = "Enter your name.";
//     if (f.useAlias && !f.alias.trim()) x.alias = "Enter the alias others will see.";
//     if (f.pw.length < 12) x.pw = "Use at least 12 characters.";
//     if (f.pw2 !== f.pw) x.pw2 = "Passwords do not match.";
//     setE(x);
//     if (!Object.keys(x).length) onDone();
//   };
//   return (
//     <Wrap title="Create your account" step="Step 2 of 4 • Savanna Climate Network">
//       <Field label="Your name" value={f.name} onChange={x => setF({ ...f, name: x.target.value })} />
//       <Err m={e.name || ""} />
//       <label className="mb-3 flex min-h-10 cursor-pointer items-center gap-2 text-sm font-medium">
//         <input
//           type="checkbox"
//           checked={f.useAlias}
//           onChange={x => setF({ ...f, useAlias: x.target.checked })}
//         />
//         Show an alias instead of my real name
//       </label>
//       {f.useAlias && (
//         <>
//           <Field
//             label="Alias"
//             value={f.alias}
//             onChange={x => setF({ ...f, alias: x.target.value })}
//           />
//           <Err m={e.alias || ""} />
//         </>
//       )}
//       <Field
//         label="Password (12+ characters)"
//         type="password"
//         value={f.pw}
//         onChange={x => setF({ ...f, pw: x.target.value })}
//       />
//       <Err m={e.pw || ""} />
//       <Field
//         label="Confirm password"
//         type="password"
//         value={f.pw2}
//         onChange={x => setF({ ...f, pw2: x.target.value })}
//       />
//       <Err m={e.pw2 || ""} />
//       <Btn kind="primary" onClick={submit}>
//         Create account
//       </Btn>
//       <p className="mt-3 text-center text-xs text-muted">Demo only: nothing is saved or sent.</p>
//     </Wrap>
//   );
// }

// export function Setup({ onDone }: { onDone: () => void }) {
//   const [stage, setStage] = useState<"scan" | "codes">("scan");
//   const [code, setCode] = useState("");
//   const [err, setErr] = useState("");
//   const [saved, setSaved] = useState(false);
//   const [copied, setCopied] = useState("");
//   const [codes] = useState(() =>
//     Array.from(
//       { length: 10 },
//       () => Math.random().toString(36).slice(2, 6) + "-" + Math.random().toString(36).slice(2, 6)
//     )
//   );
//   const copy = async () => {
//     try {
//       await navigator.clipboard.writeText(codes.join("\n"));
//       setCopied("Copied. Paste them somewhere safe.");
//     } catch {
//       setCopied("Copy was blocked. Select the codes and copy them by hand.");
//     }
//   };

//   if (stage === "scan")
//     return (
//       <Wrap title="Secure your account" step="Step 3 of 4">
//         <p className="mb-4 text-sm text-muted">
//           Scan this with your authenticator app, then enter the six-digit verification code.
//         </p>
//         <Card className="mb-4 grid h-44 place-items-center bg-page/50">
//           <div className="grid h-32 w-32 place-items-center rounded-xl border-2 border-dashed border-muted/50 bg-white p-2 text-center text-xs text-muted">
//             2FA QR Placeholder (Demo)
//           </div>
//         </Card>
//         <Field
//           label="Six-digit code"
//           inputMode="numeric"
//           placeholder="123456"
//           value={code}
//           onChange={e => setCode(e.target.value)}
//         />
//         <Err m={err} />
//         <Btn
//           kind="primary"
//           onClick={() =>
//             /^\d{6}$/.test(code.replace(/\s/g, ""))
//               ? setStage("codes")
//               : setErr("Enter the six digits from your app.")
//           }
//         >
//           Verify
//         </Btn>
//       </Wrap>
//     );

//   return (
//     <Wrap title="Save your recovery codes" step="Step 3 of 4">
//       <p className="mb-3 text-sm text-muted">
//         Single-use backup codes in case you lose your phone. (Demo codes only).
//       </p>
//       <Card className="mb-3 bg-page/60">
//         <ul className="grid grid-cols-2 gap-1.5 font-mono text-sm">
//           {codes.map(c => (
//             <li key={c} className="rounded bg-white px-2 py-1 text-center border border-line/60">
//               {c}
//             </li>
//           ))}
//         </ul>
//       </Card>
//       <Btn onClick={copy} className="gap-2">
//         <Copy size={16} /> Copy codes
//       </Btn>
//       {copied && (
//         <p role="status" className="mt-2 text-xs font-semibold text-ok">
//           {copied}
//         </p>
//       )}
//       <label className="my-3 flex min-h-10 cursor-pointer items-center gap-2 text-sm font-medium">
//         <input type="checkbox" checked={saved} onChange={e => setSaved(e.target.checked)} /> I have
//         saved these recovery codes
//       </label>
//       <Btn kind="primary" disabled={!saved} onClick={onDone}>
//         Continue
//       </Btn>
//     </Wrap>
//   );
// }

// export function PinSetup({ onDone }: { onDone: (p: string) => void }) {
//   const [p, setP] = useState("");
//   const [p2, setP2] = useState("");
//   const [err, setErr] = useState("");
//   return (
//     <Wrap title="Choose a quick-lock PIN" step="Step 4 of 4">
//       <p className="mb-4 text-sm text-muted">
//         Your PIN locks the workspace when idle or reopened.
//       </p>
//       <Field
//         label="PIN (4 to 6 digits)"
//         type="password"
//         inputMode="numeric"
//         value={p}
//         onChange={e => setP(e.target.value)}
//       />
//       <Field
//         label="Confirm PIN"
//         type="password"
//         inputMode="numeric"
//         value={p2}
//         onChange={e => setP2(e.target.value)}
//       />
//       <Err m={err} />
//       <Btn
//         kind="primary"
//         onClick={() =>
//           !/^\d{4,6}$/.test(p)
//             ? setErr("Use 4 to 6 digits.")
//             : p !== p2
//             ? setErr("PINs do not match.")
//             : onDone(p)
//         }
//       >
//         Set PIN
//       </Btn>
//     </Wrap>
//   );
// }

// export function Recover({ onBack }: { onBack: () => void }) {
//   const [em, setEm] = useState("");
//   const [c, setC] = useState("");
//   const [err, setErr] = useState("");
//   const [ok, setOk] = useState(false);
//   if (ok)
//     return (
//       <Wrap title="Recovery accepted (demo)">
//         <p className="mb-4 text-sm text-muted">
//           A production deployment signs you in once with that recovery code, marks it used, and prompts you to enroll a new authenticator.
//         </p>
//         <Btn kind="navy" onClick={onBack}>
//           Back to sign in
//         </Btn>
//       </Wrap>
//     );
//   return (
//     <Wrap title="Recover your account">
//       <p className="mb-4 text-sm text-muted">
//         Enter your email and one of your saved recovery codes.
//       </p>
//       <Field label="Email" value={em} onChange={e => setEm(e.target.value)} />
//       <Field
//         label="Recovery code"
//         placeholder="abcd-1234"
//         value={c}
//         onChange={e => setC(e.target.value)}
//       />
//       <Err m={err} />
//       <Btn
//         kind="primary"
//         onClick={() =>
//           !/^\S+@\S+\.\S+$/.test(em)
//             ? setErr("Enter a valid email.")
//             : !/^[a-z0-9]{4}-[a-z0-9]{4}$/i.test(c.trim())
//             ? setErr("Recovery codes look like abcd-1234.")
//             : setOk(true)
//         }
//       >
//         Recover Account
//       </Btn>
//       <div className="mt-3 text-center">
//         <Link onClick={onBack}>Back to sign in</Link>
//       </div>
//     </Wrap>
//   );
// }

// export function PinLock({
//   pin,
//   onUnlock,
//   onOut
// }: {
//   pin: string;
//   onUnlock: () => void;
//   onOut: () => void;
// }) {
//   const [v, setV] = useState("");
//   const [n, setN] = useState(0);
//   const out = n >= 5;
//   return (
//     <main className="grid min-h-screen place-items-center bg-navy p-6">
//       <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
//         <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-accent shadow-md">
//           <Lock size={26} />
//         </div>
//         <h2 className="text-2xl text-ink">Workspace Locked</h2>
//         <p className="my-2 text-sm text-muted">Enter your PIN to resume your session.</p>
//         <input
//           aria-label="PIN"
//           type="password"
//           inputMode="numeric"
//           value={v}
//           disabled={out}
//           onChange={e => setV(e.target.value)}
//           onKeyDown={e =>
//             e.key === "Enter" && !out && (v === pin ? onUnlock() : (setN(n + 1), setV("")))
//           }
//           className="my-3 min-h-12 w-full rounded-xl border border-line px-3 text-center text-2xl tracking-widest"
//         />
//         {n > 0 && (
//           <p role="alert" className="mb-3 text-sm font-medium text-red">
//             {out
//               ? "Too many attempts (simulated lockout). Sign out and sign in again."
//               : `Incorrect PIN. ${5 - n} tries remaining.`}
//           </p>
//         )}
//         <Btn
//           kind="navy"
//           disabled={out}
//           onClick={() => (v === pin ? onUnlock() : (setN(n + 1), setV("")))}
//         >
//           Unlock Workspace
//         </Btn>
//         <Btn className="mt-2" onClick={onOut}>
//           Sign out instead
//         </Btn>
//       </div>
//     </main>
//   );
// }

// export const Waiting = ({ onDone, onOut }: { onDone: () => void; onOut: () => void }) => (
//   <Wrap title="Waiting for admin approval">
//     <div className="text-center">
//       <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-threat">
//         <CheckCircle2 size={32} />
//       </div>
//       <p className="mb-6 text-sm text-muted">
//         Your account request has been submitted. An organization admin must verify your identity before you can access the workspace.
//       </p>
//       <Btn kind="primary" onClick={onDone}>
//         Demo: Simulate Admin Approval
//       </Btn>
//       <Btn className="mt-2" onClick={onOut}>
//         Sign out
//       </Btn>
//     </div>
//   </Wrap>
// );
