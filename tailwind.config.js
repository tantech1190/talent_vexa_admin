/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', '"Plus Jakarta Sans"', 'serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#0E2A47',
          50:  '#F4F7FA', 100: '#E6EEF5', 200: '#C7D6E5', 300: '#94AEC8',
          400: '#5A7EA3', 500: '#2C5378', 600: '#19395A', 700: '#102742',
          800: '#0E2A47', 900: '#091D32',
        },
        cobalt: {
          DEFAULT: '#2C7DA0',
          50:  '#E8F2F7', 100: '#C9E0EB', 200: '#9BC9DC', 300: '#6BB0CB',
          400: '#3F95B7', 500: '#2C7DA0', 600: '#226A8B', 700: '#19566A',
        },
        coral: '#E8A33D',
        gold:  '#E8A33D',
        cream: '#FAF7F2',
        cloud: '#F4F8FC',
        sky:   '#E7F1F8',
        brand: {
          50:  '#E8F2F7', 100: '#C9E0EB', 500: '#2C7DA0',
          600: '#226A8B', 700: '#19566A', 800: '#102742',
        },
      },
      borderRadius: { '4xl': '2rem' },
      boxShadow: {
        soft: '0 4px 14px -4px rgba(14,42,71,0.08)',
        pop:  '0 18px 40px -16px rgba(14,42,71,0.22)',
        glow: '0 8px 20px -8px rgba(44,125,160,0.55)',
      },
    },
  },
  plugins: [],
};
