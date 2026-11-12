/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        coral: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          500: '#F97316',
          600: '#EA580C',
        },
        tealAccent: {
          500: '#00B5B8',
          600: '#00979A',
        },
        surface: {
          card: '#FFFFFF',
          bg: '#F8F9FA',
          muted: '#F4F5F7',
          border: '#E2E8F0'
        }
      },
      boxShadow: {
        'soft-card': '0px 18px 40px rgba(112, 144, 176, 0.12)',
        'soft-glow': '0px 10px 25px -5px rgba(16, 185, 129, 0.25)',
        'orange-glow': '0px 10px 25px -5px rgba(249, 115, 22, 0.25)',
        'modal': '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
