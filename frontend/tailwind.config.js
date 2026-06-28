/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'saffron': '#E8650A',
        'gold': '#D4A017',
        'teal': '#0D8A7A',
        'cream': '#FBF7EE',
        'dark-brown': '#2D2010',
        'light-gray': '#F0F0F0',
        // Mapping tokens to functional names
        'primary': '#E8650A',
        'bg': '#FBF7EE',
        'ink': '#2D2010',
        'muted': '#8B7355',
        'border': '#E8DEC8',
        'card': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Helvetica', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'base': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
      },
      boxShadow: {
        'subtle': '0 2px 4px rgba(0,0,0,0.1)',
        'md': '0 4px 8px rgba(0,0,0,0.15)',
        'lg': '0 8px 16px rgba(0,0,0,0.2)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-out',
        'popup': 'popup 1.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popup: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-60px)' },
        },
      },
    },
  },
  plugins: [],
}
