/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        pastel: {
          blue: '#a8d8ea',
          pink: '#ffcad4',
          purple: '#d4a5d4',
          green: '#b8e6d5',
          yellow: '#fff4a3',
          peach: '#ffd4a3',
        },
        neon: {
          blue: '#00d4ff',
          purple: '#b537f2',
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'neon': '0 0 20px rgba(0, 212, 255, 0.5)',
      }
    },
  },
  plugins: [],
}
