import { Archivo, Inter } from "next/font/google";

// Display font per DESIGN.md Typography — bold grotesk for headlines.
export const archivo = Archivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

// Body font per DESIGN.md Typography — workhorse sans for copy and UI chrome.
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});
