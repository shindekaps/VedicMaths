/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette
        violet: { DEFAULT: '#7C3AED', 50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6', 600: '#7C3AED', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95' },
        indigo: { DEFAULT: '#6366f1', 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81' },

        // App semantic colors
        saffron: '#FF6B35',
        gold: '#FFD700',
        teal: '#06B6D4',
        navy: '#0F172A',
        bg: '#f9fafb',
        card: '#FFFFFF',
        ink: '#1E1B4B',
        sub: '#6B7280',

        // Semantic
        success: '#10b981',
        error: '#dc2626',
        warning: '#f59e0b',
        info: '#0ea5e9',

        // Sutra colors
        sutra: {
          1: '#6366f1',
          2: '#ec4899',
          3: '#f59e0b',
          4: '#10b981',
          5: '#06b6d4',
          6: '#8b5cf6',
          7: '#f97316',
          8: '#dc2626',
          9: '#059669',
          10: '#7c3aed',
          11: '#0891b2',
          12: '#475569',
          13: '#9333ea',
          14: '#ea580c',
          15: '#db2777',
          16: '#2563eb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Nunito', 'sans-serif'],
        serif: ['Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-lg': '0 0 40px rgba(124, 58, 237, 0.4)',
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-out',
        'slideUp': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slideRight': 'slideRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
