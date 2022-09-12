/** @type {import('tailwindcss').Config} */
const withAnimations = require('animated-tailwindcss');

module.exports = withAnimations({
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      backgroundSize: {
        'size-200': '200% 200%',
        'size-300': '300% 300%',
      },
      backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-15': '15% 15%',
        'pos-25': '25% 25%',
        'pos-50': '50% 50%',
        'pos-100': '100% 100%',
      }
    },
  },
  plugins: [],
})