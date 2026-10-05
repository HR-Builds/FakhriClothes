import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        emerald: { DEFAULT: "#0B3D2E", light: "#14594A" },
        gold: { DEFAULT: "#C9A227", light: "#E3C565", dark: "#9A7A1A" },
        cream: "#FAF6EF",
        maroon: "#6B1F2A",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-jost)", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out both",
        shimmer: "shimmer 2.5s linear infinite",
        "marquee-slow": "marquee 30s linear infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseGold: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(201,162,39,0.5)" },
          "50%": { boxShadow: "0 0 0 12px rgba(201,162,39,0)" },
        },
      },
      boxShadow: {
        luxe: "0 20px 50px -12px rgba(11,61,46,0.25)",
        card: "0 8px 30px -8px rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [],
};
export default config;