/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#01696f',
        muted: '#7a7974',
      },
      spacing: {
        '107.5': '430px',
      },
      borderRadius: {
        '16': '16px',
      },
    },
  },
  plugins: [],
}
