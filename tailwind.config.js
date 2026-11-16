/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        crema: "#F5EEDC",
        oro: { 50: "#FDF9EC", 100: "#FAF0CF", 200: "#F4E19C", 300: "#E9CC66", 400: "#D4AF37", 500: "#C9A227", 600: "#A8841C", 700: "#85670F", 800: "#6A520C", 900: "#4F3D09" },
      },
    },
  },
  plugins: [],
};
