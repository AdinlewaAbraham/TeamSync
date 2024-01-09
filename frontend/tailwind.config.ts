import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  variants: {
    extend: {
      inset: ["last"],
    },
  },
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      idle: { min: "800px", max: "1023px" },
    },
    extend: {
      colors: {
        bg: {
          primary: "#161719",
          secondary: "#202125",
        },
        menuItem: {
          hover: "#242627",
          active: "#323436",
        },
        muted: {
          dark: "#a2a0a2",
          light: "#d5d4d3",
          border: "#a2a0a2",
        },
        accent: {
          primary: "#F9F9F9",
          blue: "#4573D2",
          green: "#5da283",
        },
        border: {
          default: "#424244",
          verymuted: "",
        },
        icon: {
          default: "#a2a0a2",
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
export default config;
