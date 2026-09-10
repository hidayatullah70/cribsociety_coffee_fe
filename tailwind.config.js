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
          red: {
            DEFAULT: '#DF2933',
            dark: '#A61B13',
            soft: '#FDE8E6',
          },
          black: {
            DEFAULT: '#111111',
            soft: '#1C1C1C',
            muted: '#2A2A2A',
          },
          white: '#FFFFFF',
          cream: {
            DEFAULT: '#F6F0E6',
            dark: '#E8DDCC',
            light: '#FAF6F0',
          },
        },
        utility: {
          success: '#2F7D4A',
          'success-soft': '#EAF5EE',
          warning: '#B7791F',
          'warning-soft': '#FEF7E8',
          danger: '#B42318',
          'danger-soft': '#FEECEB',
          info: '#2F6FED',
          'info-soft': '#EBF2FE',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
      },
    },
  },
  plugins: [],
}
