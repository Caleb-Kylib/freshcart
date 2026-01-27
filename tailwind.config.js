/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2F855A", // Green-600-ish
        secondary: "#F0FFF4", // Green-50
        accent: "#38A169", // Green-500
        dark: "#2D3748",
        light: "#F7FAFC",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
