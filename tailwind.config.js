/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sky: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#C0DFFF',
          300: '#90C3FF',
          400: '#5BA8FF',
          500: '#1E90FF',
          600: '#0F73F7',
          700: '#0A5CD4',
        },
        brand: {
          DEFAULT: '#0F73F7',
          light: '#5BA8FF',
          soft: '#E8F1FF',
          dark: '#0A5CD4',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          soft: '#F7FAFF',
          muted: '#EEF3FB',
          border: '#E2EAF4',
        },
        ink: {
          DEFAULT: '#1A1F36',
          secondary: '#4A5578',
          muted: '#8A97B8',
          faint: '#C8D2E8',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: { sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'] },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 2px 16px rgba(15,115,247,0.08)',
        'card-hover': '0 8px 32px rgba(15,115,247,0.16)',
        float: '0 4px 24px rgba(15,115,247,0.12)',
        btn: '0 4px 14px rgba(15,115,247,0.35)',
      },
      animation: {
        'slide-up': 'slideUp 0.4s cubic-bezier(.16,1,.3,1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s cubic-bezier(.16,1,.3,1)',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        slideUp: { from:{opacity:0,transform:'translateY(16px)'}, to:{opacity:1,transform:'translateY(0)'} },
        fadeIn: { from:{opacity:0}, to:{opacity:1} },
        scaleIn: { from:{opacity:0,transform:'scale(0.95)'}, to:{opacity:1,transform:'scale(1)'} },
        shimmer: { from:{backgroundPosition:'-400px 0'}, to:{backgroundPosition:'400px 0'} },
      },
    },
  },
  plugins: [],
}
