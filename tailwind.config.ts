import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "delay-[100]",
    "delay-[200]",
    "delay-[300]",
    "delay-[400]",
    "delay-[500]",
    "delay-[600]",
    "delay-[700]",
    "bg-white",
    "bg-pastelOrange",
    "bg-pastelYellow",
    "bg-pastelGrey",
    "bg-pastelBlue1",
    "bg-pastelBlue2",
    "bg-pastelBlue3",
    "bg-pastelBlue4",
  ],
  theme: {
    extend: {
      backgroundColor: {
        white: "#FFFFFF",
        pastelOrange: "#F8F3EA",
        pastelYellow: "#FFFFF5",
        pastelGrey: "#FAFAFA",
        pastelBlue: "#F6F8FF",
        themeBlue: "#0067FF",
        pastelBlue1: "#F6F8FB",
        pastelBlue2: "#EDF2F6",
        pastelBlue3: "#E6EDF3",
        pastelBlue4: "#DEE9EF",
      },
      color: {
        themeBlue: "#0067FF",
      },
      borderColor: {
        themeBlue: "#0067FF",
      },
      textColor: {
        themeBlue: "#0067FF",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".selector": {
          padding: "10px 13.25px",
          border: "1px solid #0067FF",
          height: "44px",
          overflow: "hidden",
          relative: "true",
          zIndex: "999",
          marginRight: "-1px",
        },
        ".input": {
          padding: "12px 15px",
          border: "1px solid #0067FF",
          marginBottom: "1px",
          marginTop: "-1px",
        },
        ".btn": {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "white",
          outline: "none",
          whiteSpace: "nowrap",
          width: "100px",
          minWidth: "100px",
        },
      };

      addUtilities(newUtilities);
    }),
  ],
};
export default config;
