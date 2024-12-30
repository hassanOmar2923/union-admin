/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#294898',
        secondary: 'white',
        headerColor:"#16195E" 
      },
    },
  },
  plugins: [
  ],
}

