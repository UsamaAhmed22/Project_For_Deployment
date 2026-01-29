/** @type {import('tailwindcss').Config} */
export default {
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        primary: "#283618",
        secondary: {
          DEFAULT: "#fefae0",
          100: "#E2E2D5",
        },
        accent: "#e63946",
        success: "#70e000",
      }
    },
  },
  plugins: [],
}

