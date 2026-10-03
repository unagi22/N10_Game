/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: { 950: '#0b0f1e', 900: '#111733', 800: '#1a2147', 700: '#262f5e' },
      },
      keyframes: {
        pop: { '0%': { transform: 'scale(0.6)', opacity: '0' }, '70%': { transform: 'scale(1.08)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        shake: { '0%,100%': { transform: 'translateX(0)' }, '20%,60%': { transform: 'translateX(-8px)' }, '40%,80%': { transform: 'translateX(8px)' } },
        rise: { '0%': { transform: 'translateY(12px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
      animation: {
        pop: 'pop 320ms cubic-bezier(.2,.9,.3,1.2)',
        shake: 'shake 400ms ease-in-out',
        rise: 'rise 260ms ease-out',
      },
    },
  },
  plugins: [],
};
