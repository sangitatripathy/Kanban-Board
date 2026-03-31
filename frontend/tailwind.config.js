// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "selector", // or 'class' if you are using Tailwind v3.4 or older
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
