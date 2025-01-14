/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          500: '#00ff00',
          400: '#33ff33',
          300: '#66ff66',
          200: '#99ff99',
          100: '#ccffcc',
          600: '#00cc00',
          700: '#009900',
          800: '#006600',
          900: '#003300',
        },
      },
    },
  },
  plugins: [],
}

