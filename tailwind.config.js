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
    screens:{
      '2xl':{'min':'1536px'},
      'xl':{'min':'1280px'},
      'lg':{'min':'1024px'},
      'md':{'min':'760px'},
      'md2':{'max':'760px'},
      'sm2':{'min':'640px'},
      'sm':{'max':'640px'},
      'phone': {'max':'360px'}
    }
  },
  plugins: [
    require('tailwindcss-textshadow')
  ],
  
}