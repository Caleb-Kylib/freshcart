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
          error: "#EF4444",
          // New vibrant colors
          vibrant: {
            orange: "#FF6B35",
            yellow: "#FFD166",
            pink: "#FF6B8B",
            purple: "#9D4EDD",
            blue: "#4A90E2",
            teal: "#2EC4B6",
            coral: "#FF6B6B",
            amber: "#FF9E00"
          },
          // Category-specific colors
          fruits: "#FF6B35",      // Orange
          vegetables: "#2EC4B6",   // Teal
          herbs: "#9D4EDD",        // Purple
          smoothies: "#4A90E2",    // Blue
          bundles: "#FF6B8B",      // Pink
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
        'gradient-vibrant': 'linear-gradient(135deg, #FF6B35 0%, #FFD166 25%, #2EC4B6 50%, #9D4EDD 75%, #4A90E2 100%)',
        'gradient-fresh': 'linear-gradient(135deg, #10B981 0%, #2EC4B6 50%, #4A90E2 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FF6B35 0%, #FFD166 50%, #FF9E00 100%)',
        'gradient-cool': 'linear-gradient(135deg, #4A90E2 0%, #9D4EDD 50%, #FF6B8B 100%)',
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
