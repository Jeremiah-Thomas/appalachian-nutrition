import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "media",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        appalachian: {
          pink: "#ec4899",
          lime: "#84cc16",
          purple: "#3b0764",
          dark: "#130722",
        },
      },
    },
  },
  plugins: [],
};
export default config;
