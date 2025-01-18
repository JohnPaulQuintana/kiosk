/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      wider: '1920px', // Add custom breakpoint for 24-inch monitor
    },
    extend: {
      keyframes: {
        scale: {
          '0%, 100%': { transform: 'scale(1)' }, // Start and end at scale 1
          '50%': { transform: 'scale(1.1)' },    // Scale up slightly at 50%
        },
      },
      animation: {
        infiniteScale: 'scale 2s ease-in-out infinite', // Name, duration, and infinite repeat
      },
    },
  },
  plugins: [],
}

