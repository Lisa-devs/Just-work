import { ReactNode, ButtonHTMLAttributes } from "react";

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <section
    className={`rounded-2xl border border-line/80 bg-white p-5 shadow-sm transition-all duration-200 hover:border-line hover:shadow-md ${className}`}
  >
    {children}
  </section>
);

const v = {
  primary: "bg-accent text-black hover:bg-accent/90 shadow-sm hover:shadow",
  navy: "bg-navy text-white hover:bg-ink shadow-sm hover:shadow",
  ghost: "bg-white text-ink border border-line hover:bg-page/80 hover:border-muted/40",
  danger: "bg-white text-red border-2 border-red hover:bg-red/5"
};

export function Btn({
  kind = "ghost",
  className = "",
  ...p
}: { kind?: keyof typeof v } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      className={`inline-flex min-h-11 w-full items-center justify-center rounded-xl px-4 font-semibold transition-all duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 ${v[kind]} ${className}`}
    />
  );
}

export const Pill = ({ children, tone = "" }: { children: ReactNode; tone?: string }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${
      tone || "border-line bg-page/60 text-ink"
    }`}
  >
    {children}
  </span>
);

export const Field = ({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="mb-3.5 block">
    <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
    <input
      {...p}
      className="min-h-11 w-full rounded-xl border border-line bg-white px-3.5 text-ink placeholder:text-muted/60 shadow-sm"
    />
  </label>
);