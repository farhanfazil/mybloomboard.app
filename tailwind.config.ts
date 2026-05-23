import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-dark": "#000000",
        "bg-navy": "#152331",
        "accent-blue": "#4d9fff",
        "accent-green": "#39FF14",
        "accent-orange": "#ff9f0a",
        "accent-red": "#ff453a",
        "accent-purple": "#a78bfa",
        "text-primary": "#eeeeee",
        "text-muted": "#607080",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "page-gradient": "linear-gradient(to bottom, #000000, #152331)",
        "blue-glow":
          "radial-gradient(ellipse at center, rgba(77,159,255,0.25) 0%, transparent 70%)",
        "green-glow":
          "radial-gradient(ellipse at center, rgba(57,255,20,0.18) 0%, transparent 70%)",
      },
      backdropBlur: {
        glass: "16px",
      },
      boxShadow: {
        glass:
          "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        "glow-blue": "0 0 40px rgba(77,159,255,0.35)",
        "glow-green": "0 0 40px rgba(57,255,20,0.30)",
        "glow-orange": "0 0 30px rgba(255,159,10,0.40)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        ticker: "ticker 30s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        shine: "shine var(--duration) infinite linear",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(77,159,255,0.3)" },
          "50%": { boxShadow: "0 0 60px rgba(77,159,255,0.7)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        shine: {
          "0%":  { backgroundPosition: "0% 0%" },
          "50%": { backgroundPosition: "100% 100%" },
          to:    { backgroundPosition: "0% 0%" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
