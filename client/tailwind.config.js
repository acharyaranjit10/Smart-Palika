// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nepal-blue': '#003893',
        'nepal-red': '#DC143C',
      }
    },
  },
  plugins: [],
}