import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      // height
      height: {
        "h-112": "28rem",
        "h-120": "30rem",
        "h-128": "32rem",
        "h-136": "34rem",
        "h-144": "36rem",
        "h-152": "38rem",
        "h-160": "40rem",
        "h-168": "42rem",
        "h-176": "44rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
