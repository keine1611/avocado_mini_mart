/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        loginBg: "url('/src/assets/images/login_bg.png')",
      },
    },
  },
  plugins: [daisyui],

  daisyui: {
    themes: [
      {
        light: {
          extends: {
            theme: 'light',
          },
          primary: '#3BA66B',
          secondary: '#FFB416',
          accent: '#eb3e32',
          neutral: '#F5EEE1',
          'base-100': '#FFFFFF',
          'base-200': '#F2F2F2',
          'base-300': '#E5E5E5',
        },
        dark: {
          extends: {
            theme: 'dark',
          },
          primary: '#1FAB89',
          secondary: '#62D2A2',
          accent: '#9DF3C4',
          neutral: '#1A1A1A',
          'base-100': '#2A2A2A',
          'base-200': '#3A3A3A',
          'base-300': '#4A4A4A',
        },
      },
    ],
  },
} satisfies Config
