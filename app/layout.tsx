import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"]
});

export const metadata = { title: "Just Work — Secure Workspace" };

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}

/*import "./globals.css";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"]
});

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["600", "700"]
});

export const metadata = { title: "Just Work — Secure Workspace" };

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}*/
