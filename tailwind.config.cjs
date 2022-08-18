/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        yellowML: "rgb(255, 241, 89)",
        grayProducts: "rgb(237, 237, 237)",
        bgBuyProduct: "rgb(52, 131, 250)",
        hoverBgBuyProduct: "rgb(41, 104, 200)",
        bgAddToCart: "rgb(227, 237, 251)",
        hoverBgAddToCart: "rgb(217, 231, 250)",
      },
    },
  },
  plugins: [],
};
