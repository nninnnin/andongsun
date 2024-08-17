import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        white: "#FFFFFF",
        pastelOrange: "#F8F3EA",
        pastelYellow: "#FFFFF5",
        pastelGrey: "#FAFAFA",
        pastelBlue: "#F6F8FF",
      },
    },
  },
  plugins: [],
  safelist: [
    "bg-white",
    "bg-pastelOrange",
    "bg-pastelYellow",
    "bg-pastelGrey",
    "bg-pastelBlue",
  ],
};
export default config;
