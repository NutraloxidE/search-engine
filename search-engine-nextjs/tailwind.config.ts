import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "custom-gradient": "linear-gradient(to bottom right, rgba(var(--background-start-rgb), 1), rgba(var(--background-end-rgb), 1))",
      },
      colors: {
        'pastel-blue': '#b3e5fc',
        'pastel-blue-dark': '#81d4fa',
        'pastel-green': '#c8e6c9',
        'pastel-green-dark': '#a5d6a7',
      },
      boxShadow: {
        'neumorphism': '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255, 255, 255, 0.7)',
        'neumorphism-hover': '12px 12px 24px rgba(0,0,0,0.1), -12px -12px 24px rgba(255, 255, 255, 0.7)',
        'neumorphism-button': '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255, 255, 255, 0.7)',
      }
    },
  },
  plugins: [],
};
export default config;
