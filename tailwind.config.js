/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: { 900: '#0A0F1E', 800: '#0F1629', 700: '#151E3A', 600: '#1E2D52' },
        primary: { DEFAULT: '#3B82F6', light: '#60A5FA', dark: '#1D4ED8' },
        violet: { DEFAULT: '#7C3AED', light: '#A78BFA', dark: '#5B21B6' },
        surface: 'rgba(255,255,255,0.05)',
      },
      fontFamily: { sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'] },
      backdropBlur: { glass: '20px' },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        float: { '0%,100%': {transform:'translateY(0px)'}, '50%': {transform:'translateY(-12px)'} },
        glow: { from:{boxShadow:'0 0 20px #3B82F6'}, to:{boxShadow:'0 0 40px #7C3AED, 0 0 60px #3B82F6'} },
        slideUp: { from:{opacity:0,transform:'translateY(20px)'}, to:{opacity:1,transform:'translateY(0)'} },
        fadeIn: { from:{opacity:0}, to:{opacity:1} },
      },
    },
  },
  plugins: [],
}
