import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.tsx", "./components/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        navy: "#0B192C",
        ink: "#0F172A",
        accent: "#F59E0B",
        page: "#F8FAFC",
        muted: "#64748B",
        line: "#E2E8F0",
        threat: "#EA580C",
        red: "#DC2626",
        ok: "#16A34A"
      },
      fontFamily: {
        // Enforce Poppins (sans) everywhere, fallback to system-ui
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-sans)", "system-ui", "sans-serif"] 
      }
    }
  }
} satisfies Config;