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
            dark: '#B01A23',
            soft: '#2D1416',
            light: 'rgba(223, 41, 51, 0.15)',
          },
          black: {
            DEFAULT: '#0D0D0D',
            soft: '#161616',
            card: '#1C1C1C',
            elevate: '#242424',
            muted: '#2E2E2E',
            border: '#2E2E2E',
          },
          white: {
            DEFAULT: '#FFFFFF',
            soft: '#F0F0F0',
            muted: '#A3A3A3',
            dim: '#737373',
          },
          // Alias for seamless backward compatibility mapping to deep dark surfaces
          cream: {
            DEFAULT: '#0D0D0D',
            dark: '#262626',
            light: '#181818',
          },
        },
        utility: {
          success: '#22C55E',
          'success-soft': '#0F291E',
          warning: '#F59E0B',
          'warning-soft': '#2E2108',
          danger: '#EF4444',
          'danger-soft': '#321415',
          info: '#3B82F6',
          'info-soft': '#10223E',
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
