/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        pending: '#facc15',
        in_progress: '#3b82f6',
        resolved: '#22c55e',
        rejected: '#ef4444',
      },
    },
  },
  plugins: [],
};