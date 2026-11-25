/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] },
      colors: {
        'caa-red': {
          DEFAULT: '#cc0000',
          dark: '#a30000',
          darker: '#7a0000',
        },
        'neutral-dark': '#1a1a1a',
        base: {
          900: "#0b1020",
          800: "#0f1830",
          700: "#132042",
        },
        accent: {
          400: "#22d3ee",
          500: "#14b8a6",
          600: "#0ea5a3",
        },
      },
      boxShadow: {
        soft: "0 8px 30px rgba(20, 184, 166, 0.2)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
