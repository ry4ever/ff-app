/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#008BCE',
          cyan: '#69E0FA',
          silver: '#A3ACAC',
          black: '#000000',
          dark: '#080B10',
          card: '#101722',
          cardHover: '#162030',
          border: '#1B273A',
          borderActive: '#008BCE'
        }
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
