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
          '50%': { transform: 'scale(1.1)', 'opacity':1 },    // Scale up slightly at 50%
        },
        blink: {
          '0%': { "fill":'#28a745' },
          '50%': { "fill":'#1e7e34' },
          '100%': { "fill":'#28a745' },
        },
      },
      animation: {
        infiniteScale: 'scale 2s ease-in-out infinite', // Name, duration, and infinite repeat
        blink: 'blink 3s infinite', // Adjust timing for faster/slower blink
      },
    },
  },
  plugins: [],
}

