/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          50: '#f7f8fa',
          100: '#eceef2',
          200: '#d5dae2',
          300: '#b0b9c9',
          400: '#8593ab',
          500: '#667691',
          600: '#515e78',
          700: '#434d62',
          800: '#3a4253',
          900: '#343a47',
          950: '#23262f',
        },
      },
    },
  },
  plugins: [],
}
