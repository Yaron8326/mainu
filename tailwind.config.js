/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Heebo', 'system-ui', 'sans-serif'],
        display: ['"Bebas Neue"', 'Heebo', 'sans-serif'],
      },
      colors: {
        // Deep dark base - inspired by vinyl record + Spotify
        ink: {
          900: '#0a0a0a',  // body bg
          800: '#141414',  // raised surface
          700: '#1c1c1c',  // card
          600: '#2a2a2a',  // hover / border
          500: '#3a3a3a',  // divider
          400: '#6b6b6b',  // muted text
          300: '#9e9e9e',  // secondary text
          200: '#d4d4d4',
          100: '#f5f5f5',
        },
        // Electric lime - the brand accent
        lime: {
          DEFAULT: '#d4ff00',
          400: '#e4ff4d',
          500: '#d4ff00',
          600: '#b8e000',
          700: '#9bba00',
        },
        // Spicy red for "hot" / trending
        chili: {
          DEFAULT: '#ff3b30',
          500: '#ff3b30',
          600: '#e02519',
        },
      },
      boxShadow: {
        'glow-lime': '0 0 24px rgba(212, 255, 0, 0.35)',
      },
    },
  },
  plugins: [],
}
