/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize:{
        mdx:"15px",
        xls:"22px"
      },
      borderRadius:{
        mdx:"4px"
      },
    },
  },
  plugins: [],
}