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
        brand: {
          primary: "#10B981",
          secondary: "#22C55E",
          bg: "#F8FAF8",
          dark: "#111827",
          muted: "#6B7280",
          border: "#E5E7EB",
          success: "#16A34A",
          error: "#EF4444"
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
