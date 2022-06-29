module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        // 'color1-nav':'#2CDCB2',
        // 'color2-backg':'#bcffef',
        // // 'color3-publicacion':'#CBF9EE',
        // 'color3-publicacion':'#7ffadd',
        // 'color4-comentarios':'#54ffd7',
        
        'color1-nav':'#02253d',
        'color2-backg':'#021d34',
          
        'color3-publicacion':'#02253d',
        'color4-comentarios':'#012e46',
        'color5-recuatros':'#557996',
        'color6-lineas':'#365b77',
        'color7-boton':'#7498b6',
        'color8-inputs':'#153f59'
        
        
        
      }
    },
    screens:{
      // '2xl':{'min':'1536px'},
      // 'xl':{'min':'1280px'},
      // 'lg':{'min':'1024px'},
      // 'md':{'min':'760px'},
      // 'md2':{'max':'760px'},
      // 'sm2':{'min':'640px'},
      // 'sm':{'max':'640px'},
      // 'phone': {'max':'360px'}
      '3xl':{'max':'1936px'},
      '2xl':{'max':'1536px'},
      'xl':{'max':'1280px'},
      'lg':{'max':'1024px'},
      'md':{'max':'760px'},
      
      'sm':{'max':'640px'},
      
      
    }
  },
  plugins: [
    require('tailwindcss-textshadow'),
    require('tailwind-scrollbar'),
  ],
  
}