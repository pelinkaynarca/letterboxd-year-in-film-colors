/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    fontFamily: {
      'title-font': 'Tourney',
      'default-font': 'DM Mono'
    },
    linearGradientDirections: { // defaults to these values
      't': 'to top',
      'tr': 'to top right',
      'r': 'to right',
      'br': 'to bottom right',
      'b': 'to bottom',
      'bl': 'to bottom left',
      'l': 'to left',
      'tl': 'to top left',
    },
    linearGradientColors: { // defaults to {}
      'lb-bg': ['var(--LBOrangeLight) 10%', 'var(--LBGreenLight) 50%', 'var(--LBBlueLight) 90%'],
    },
      radialGradientShapes: { // defaults to this value
        'default': 'ellipse',
      },
      radialGradientSizes: { // defaults to this value
        'default': 'closest-side',
      },
      radialGradientPositions: { // defaults to these values
        'default': 'center',
        't': 'top',
        'tr': 'top right',
        'r': 'right',
        'br': 'bottom right',
        'b': 'bottom',
        'bl': 'bottom left',
        'l': 'left',
        'tl': 'top left',
      },
      radialGradientColors: {
        'LB-Orange-LB-Green-LB-Blue': ['var(--LBOrange) 10%', 'var(--LBGreen) 50%', 'var(--LBBlue) 90%'],
        'orange-circle-bg': ['var(--LBOrange) 5%', 'var(--LBOrangeTransparent) 95%'],
        'green-circle-bg': ['var(--LBGreen) 5%', 'var(--LBGreenTransparent) 95%'],
        'blue-circle-bg': ['var(--LBBlue) 5%', 'var(--LBBlueTransparent) 95%']
      },
      keyframes: {
        fadeInAnimation: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1'},
        }
      },
      animation: {
        'fadeInAnimation': 'fadeInAnimation ease 2s'
      },
      extend: {
        colors: {
          'LB-Light': 'var(--LBLight)',
          'LB-Gray': 'var(--LBGray)',
          'LB-Dark': 'var(--LBDark)',
          'LB-Orange': 'var(--LBOrange)',
          'LB-Orange-Transparent': 'var(--LBOrangeTransparent)',
          'LB-Green': 'var(--LBGreen)',
          'button-color': 'var(--buttonColor)',
          'LB-Blue': 'var(--LBBlue)',
          'input-bg': 'var(--inputBG)',
          'headerBgLight': 'var(--headerBgLight)'
          },
  },

  },
  plugins: [
    require('tailwindcss-gradients'),
    require('tailwind-scrollbar')
  ],
}

