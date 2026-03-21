import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lime: "#AAFF00",
        "card-bg": "#f0f0ea",
        "page-bg": "#c8c8c2",
        dark: "#0d0d0d",
      },
      fontFamily: {
        bebas: ["var(--font-bebas)", "sans-serif"],
        playfair: ["var(--font-playfair)", "serif"],
        barlow: ["var(--font-barlow)", "sans-serif"],
        dm: ["var(--font-dm)", "sans-serif"],
        instrument: ["var(--font-instrument)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
