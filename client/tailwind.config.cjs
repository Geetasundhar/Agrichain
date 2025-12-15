/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        evergreen: {
          500: "#132a13",
        },
        fern: {
          600: "#71a940",
          700: "#94c668",
        },
        "lime-cream": {
          500: "#ecf39e",
        },
      },
    },
  },
  plugins: [],
};
