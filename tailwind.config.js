/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#f9f9fb',
        ink: {
          DEFAULT: '#09090b',
          muted: '#71717a',
          soft: '#52525b',
        },
        surface: {
          DEFAULT: '#fefefe',
          muted: '#f4f4f6',
        },
        edge: {
          DEFAULT: '#e4e4e7',
          subtle: '#ebebef',
        },
        primary: {
          DEFAULT: '#0057ff',
          foreground: '#ffffff',
          hover: '#0047d6',
        },
        secondary: {
          DEFAULT: '#f4f4f6',
          foreground: '#09090b',
        },
        muted: {
          DEFAULT: '#f4f4f6',
          foreground: '#71717a',
        },
        accent: {
          DEFAULT: '#10b981',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        border: 'var(--border)',
        ring: 'var(--ring)',
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
