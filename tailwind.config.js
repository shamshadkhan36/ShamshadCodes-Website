/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        coral: {
          DEFAULT: '#D1495B',
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          500: '#D1495B',
          600: '#C0394B',
          700: '#A82B3C',
          800: '#8E202F',
        },
      }
    },
  },
  plugins: [],
}
