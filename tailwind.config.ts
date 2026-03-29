import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "rgba(255,255,255,0.07)",
        input: "rgba(255,255,255,0.07)",
        ring: "#a400b6",
        background: "#0D0F14",
        foreground: "#E8EAF0",
        primary: {
          DEFAULT: "#a400b6",
          foreground: "#E8EAF0",
        },
        secondary: {
          DEFAULT: "rgba(232,234,240,0.55)",
          foreground: "#E8EAF0",
        },
        destructive: {
          DEFAULT: "#e20055",
          foreground: "#E8EAF0",
        },
        muted: {
          DEFAULT: "#141720",
          foreground: "rgba(232,234,240,0.55)",
        },
        accent: {
          DEFAULT: "rgba(164,0,182,0.15)",
          foreground: "#E8EAF0",
        },
        popover: {
          DEFAULT: "#141720",
          foreground: "#E8EAF0",
        },
        card: {
          DEFAULT: "#141720",
          foreground: "#E8EAF0",
        },
        positive: "#10B981",
        negative: "#e20055",
        warning: "#F59E0B",
      },
      fontFamily: {
        serif: ["DM Serif Display", "serif"],
        mono: ["IBM Plex Mono", "monospace"],
        sans: ["DM Sans", "sans-serif"],
      },
      borderRadius: {
        lg: "10px",
        md: "8px",
        sm: "4px",
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0,0,0,0.4)",
      },
      backgroundImage: {
        "identity-gradient": "linear-gradient(135deg, #e20055, #9e11cd)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;