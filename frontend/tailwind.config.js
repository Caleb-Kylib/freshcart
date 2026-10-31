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
          primary: "#15803D",
          secondary: "#22C55E",
          teal: "#0F766E",
          bg: "#F8FAF8",
          dark: "#111827",
          muted: "#6B7280",
          border: "#E5E7EB",
          success: "#16A34A",
          error: "#EF4444",
          // New vibrant colors
          vibrant: {
            orange: "#FF6B35",
            yellow: "#FFD166",
            lime: "#84CC16",
            green: "#166534",
            blue: "#047857",
            teal: "#0F766E",
            coral: "#FF6B6B",
            amber: "#FF9E00"
          },
          // Category-specific colors
          fruits: "#FF6B35",      // Orange
          vegetables: "#2EC4B6",   // Teal
          herbs: "#15803D",
          smoothies: "#047857",
          bundles: "#65A30D",
          organic: "#10B981",      // Green
          fresh: "#FFD166"         // Yellow
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-vibrant': 'linear-gradient(135deg, #FF6B35 0%, #A3E635 20%, #22C55E 45%, #15803D 70%, #0F766E 100%)',
        'gradient-fresh': 'linear-gradient(135deg, #86EFAC 0%, #22C55E 50%, #047857 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FF6B35 0%, #FFD166 50%, #FF9E00 100%)',
        'gradient-cool': 'linear-gradient(135deg, #0F766E 0%, #166534 50%, #84CC16 100%)',
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
