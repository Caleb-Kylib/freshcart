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
          primary: "#2F855A",
          secondary: "#F0FFF4",
          teal: "#2F855A",
          bg: "#F8FAF8",
          dark: "#111827",
          muted: "#6B7280",
          border: "#E5E7EB",
          success: "#38A169",
          error: "#EF4444",
          // New vibrant colors
          vibrant: {
            orange: "#2F855A",
            yellow: "#38A169",
            lime: "#9AE6B4",
            green: "#276749",
            blue: "#38A169",
            teal: "#2F855A",
            coral: "#68D391",
            amber: "#C6F6D5"
          },
          // Category-specific colors
          fruits: "#2F855A",
          vegetables: "#38A169",
          herbs: "#276749",
          smoothies: "#48BB78",
          bundles: "#68D391",
          organic: "#10B981",      // Green
          fresh: "#C6F6D5"
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-vibrant': 'linear-gradient(135deg, #2F855A 0%, #38A169 25%, #48BB78 50%, #276749 75%, #68D391 100%)',
        'gradient-fresh': 'linear-gradient(135deg, #F0FFF4 0%, #38A169 50%, #276749 100%)',
        'gradient-warm': 'linear-gradient(135deg, #2F855A 0%, #38A169 50%, #68D391 100%)',
        'gradient-cool': 'linear-gradient(135deg, #276749 0%, #2F855A 50%, #9AE6B4 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
      },
    },
  },
  plugins: [],
}
