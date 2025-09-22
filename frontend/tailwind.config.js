/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      colors: {
        bg: "var(--color-bg)",
        purple: "var(--color-purple)",
        green: "var(--color-green)",
        blue: "var(--color-blue)",
        yellow: "var(--color-yellow)",
        white: "var(--color-white)",
        black: "var(--color-black)",
        danger: "var(--color-danger)",
      }
    },
  },
  plugins: [],
}
