/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: '#FF6B35',
        gold: '#FFD700',
        violet: '#7C3AED',
        teal: '#06B6D4',
        green: '#10B981',
        pink: '#EC4899',
        navy: '#0F172A',
        bg: '#F8F4FF',
        card: '#FFFFFF',
        ink: '#1E1B4B',
        sub: '#6B7280',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        serif: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
