/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette (mapped from violet/indigo to warm sepia/terracotta/parchment)
        violet: { DEFAULT: '#854E17', 50: '#FDFBF7', 100: '#F2E7CD', 200: '#EADBB8', 300: '#DCB680', 400: '#C89350', 500: '#A26A27', 600: '#854E17', 700: '#663B10', 800: '#4D2C0C', 900: '#331D08' },
        indigo: { DEFAULT: '#A46029', 50: '#FCF5ED', 100: '#F4E2D0', 200: '#E7C6A6', 300: '#D6A579', 400: '#C5854C', 500: '#A46029', 600: '#8A4E20', 700: '#703E19', 800: '#552E12', 900: '#3B200C' },

        // App semantic colors
        saffron: '#D9531E',
        gold: '#D97706',
        teal: '#06B6D4',
        navy: '#231608',
        bg: '#F9F6ED',
        card: '#FFFDFB',
        ink: '#36200D',
        sub: '#7C624D',

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
