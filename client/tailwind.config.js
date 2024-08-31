/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        loginBg: "url('/src/assets/images/login_bg.png')",
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#1FAB89',
          secondary: '#62D2A2',
          accent: '#9DF3C4',
          neutral: '#D7FBE8',
          'base-100': '#FFFFFF',
          'base-200': '#F2F2F2',
          'base-300': '#E5E5E5',
        },
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
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
}
