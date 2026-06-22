/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FEFEFE',
          100: '#FAFAF7',
          200: '#F5F0E8',
          300: '#EDE5D8',
          400: '#E2D8C8',
        },
        beige: {
          100: '#F0E9DF',
          200: '#E8DDD0',
          300: '#DCCFBC',
          400: '#CFC0A8',
          500: '#C0AD93',
        },
        nude: {
          100: '#DDD0BE',
          200: '#C9B59A',
          300: '#B5987A',
          400: '#9E7E5E',
        },
        gold: {
          100: '#E8D9B8',
          200: '#D4BC88',
          300: '#B8945A',
          400: '#9E7A3C',
          500: '#7A5C28',
          600: '#5C4218',
        },
        stone: {
          100: '#EAE4DC',
          200: '#C8BEB4',
          300: '#A09690',
          400: '#7A7068',
          500: '#5A5248',
          600: '#3E3630',
          700: '#2C2420',
          800: '#1A1410',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      fontSize: {
        '7xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
        '9xl': ['8rem', { lineHeight: '0.95', letterSpacing: '-0.05em' }],
      },
      letterSpacing: {
        luxury: '0.2em',
        wide: '0.12em',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
};
