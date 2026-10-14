import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A1628',
          50: '#E8EBF0',
          100: '#C5CDD8',
          200: '#8A9BB5',
          300: '#4F6892',
          400: '#1E3A6E',
          500: '#0A1628',
          600: '#081220',
          700: '#060D18',
          800: '#040910',
          900: '#020408',
        },
        gold: {
          DEFAULT: '#C9A84C',
          50: '#FBF5E6',
          100: '#F5E8BE',
          200: '#EDD38E',
          300: '#E5BE5E',
          400: '#DDA92E',
          500: '#C9A84C',
          600: '#A8863A',
          700: '#876528',
          800: '#664416',
          900: '#452304',
          light: '#E8C97A',
        },
        charcoal: {
          DEFAULT: '#2D2D2D',
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#ABABAB',
          400: '#858585',
          500: '#5F5F5F',
          600: '#3A3A3A',
          700: '#2D2D2D',
          800: '#1A1A1A',
          900: '#0D0D0D',
        },
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.12)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.20)',
        gold: '0 4px 20px rgba(201,168,76,0.30)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
