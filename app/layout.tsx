import "./globals.css";
import type { Metadata } from "next";
import { archivo, inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Copyt Concierge",
  description: "Ship it. We sell it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <body className="bg-white text-brand-black font-body">{children}</body>
    </html>
  );
}
