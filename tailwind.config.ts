import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050505",
        caution: "#ffe500",
        paper: "#f4f1e7",
        grit: "#161616",
      },
      boxShadow: {
        sticker: "7px 7px 0 #000",
        white: "0 0 0 3px #fff, 8px 8px 0 #000",
        glow: "0 0 24px rgba(255, 229, 0, 0.34)",
      },
      fontFamily: {
        display: ["Arial Black", "Impact", "system-ui", "sans-serif"],
        sans: ["Pretendard", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grit-noise":
          "radial-gradient(circle at 20% 10%, rgba(255,229,0,0.16) 0 1px, transparent 1px), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.10) 0 1px, transparent 1px), linear-gradient(135deg, rgba(255,229,0,0.12) 0%, transparent 24%, rgba(255,229,0,0.08) 72%, transparent 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
