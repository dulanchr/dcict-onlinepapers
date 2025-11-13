/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        cabinet: ['Inter', 'sans-serif'],
        rashmi: ['Rashmi', 'sans-serif'],
        malithi: ['Malithi', 'sans-serif'],
        ganganee: ['Ganganee', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
