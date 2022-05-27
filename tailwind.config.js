module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'color1-nav':'#2CDCB2',
        'color2-backg':'#E1FEF7',
        'color3-publicacion':'#CBF9EE',
        'color4-comentarios':'#7AF6D9',

      }
    },
  },
  plugins: [
    require('tailwindcss-textshadow')
  ],
  
}