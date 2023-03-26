/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Bona Nova', ...defaultTheme.fontFamily.serif],
        'sans': ['Poppins', ...defaultTheme.fontFamily.sans],
  },},
  },
  plugins: [
    require('flowbite/plugin'),
    require('@tailwindcss/line-clamp'),
]
}
