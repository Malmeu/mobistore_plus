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
          50: '#fef3e7',
          100: '#fde7cf',
          200: '#fbcf9f',
          300: '#f9b76f',
          400: '#f79f3f',
          500: '#f5870f',
          600: '#c46c0c',
          700: '#935109',
          800: '#623606',
          900: '#311b03',
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
          orange: '#f5870f',
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
