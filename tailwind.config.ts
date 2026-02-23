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
        nature: {
          50: "#f6f5f0",
          100: "#e8e6db",
          200: "#d4cfbc",
          300: "#bdb496",
          400: "#a89d7a",
          500: "#9a8d6a",
          600: "#8a7a5c",
          700: "#72634d",
          800: "#5f5342",
          900: "#4f4538",
          950: "#2b251e",
        },
        forest: {
          50: "#f3f6f3",
          100: "#e3ebe2",
          200: "#c8d7c6",
          300: "#a1ba9e",
          400: "#769873",
          500: "#557b52",
          600: "#42623f",
          700: "#364e34",
          800: "#2d3f2c",
          900: "#263526",
          950: "#121c12",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
