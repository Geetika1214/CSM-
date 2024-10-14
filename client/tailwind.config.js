/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        'custom-radius': '26px', // Replace '15px' with your desired radius
      },
      colors :{
        slate:{
          700:"#3E6680",
        },
        blue:{
          200: "#AABD8Cbu",
          900: "#1B3BBC",
        },
        gray:{
         200:"#F5F5F5"
        },
      }
    }, 
  },
  plugins: [],
}