import type { Config } from "tailwindcss";

// Tokens per BRAND.md. Values are approximate - confirm against the real
// Copyt screenshots/site before treating these as final (see BRAND.md note).
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // #D71284, not BRAND.md's original #E5178C — darkened to clear WCAG
          // AA contrast (4.5:1) for white text on a solid fill; see DESIGN.md
          // Colors > Named Rules > The One Signal Rule.
          magenta: "#D71284",
          magentaLight: "#FF4FB8",
          magentaHover: "#B80E6F",
          dark: "#120212",
          black: "#0A0A0A",
          gray: "#6B7280",
          grayPill: "#F3F4F6",
        },
        status: {
          received: "#9CA3AF",
          authenticating: "#F59E0B",
          flagged: "#DC2626",
          photographed: "#3B82F6",
          listed: "#D71284",
          sold: "#10B981",
          paid: "#047857",
        },
      },
      borderRadius: {
        full: "9999px",
        card: "16px",
      },
      fontFamily: {
        display: ["var(--font-display)", "Archivo", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
      },
      boxShadow: {
        "card-float": "0 12px 32px rgba(18, 2, 18, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
