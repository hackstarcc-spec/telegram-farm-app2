import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        barn: {
          soil: "#2a1c12",
          hay: "#e8b84a",
          leaf: "#3d7a4a",
          dusk: "#1a120c",
          cream: "#f3e6c8",
        },
      },
      fontFamily: {
        display: ["\"Fraunces\"", "Georgia", "serif"],
        body: ["\"Manrope\"", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
