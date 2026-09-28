import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        richZinc: "#18181B",
        pristineWhite: "#F9FAFB",
        violet: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7C3AED", // Vibrant Violet primary highlight
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scanline": "scanline 8s linear infinite",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        }
      }
    },
  },
  plugins: [],
};

export default config;
