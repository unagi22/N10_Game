/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'bonus-pulse': {
          '0%, 100%': { transform: 'scale(1)', backgroundColor: 'rgb(254, 249, 195)' },
          '50%': { transform: 'scale(1.05)', backgroundColor: 'rgb(254, 240, 138)' }
        }
      },
      animation: {
        'bonus-pulse': 'bonus-pulse 0.5s ease-in-out'
      }
    },
  },
  plugins: [],
}
