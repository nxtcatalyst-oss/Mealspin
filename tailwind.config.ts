import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFFAF0',
          100: '#FEEFC3',
          200: '#FDD888',
          300: '#FCBF49',
          400: '#F7A028',
          500: '#F77F00',
          600: '#D66B00',
          700: '#A35200',
          800: '#7A3D00',
          900: '#4D2600',
        },
        surface: {
          DEFAULT: '#020205',
          1: '#0A0A0F',
          2: '#12121A',
          3: '#1A1A26',
        },
        accent: {
          DEFAULT: '#7209B7',
          light: '#9D4EDD',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s cubic-bezier(0.25, 0.1, 0.25, 1) infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'spin-fast': 'spin 0.3s cubic-bezier(0.1, 0.9, 0.2, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
