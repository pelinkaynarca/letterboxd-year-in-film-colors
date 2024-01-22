/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    fontFamily: {
      'title-font': 'Tourney',
      'default-font': 'DM Mono'
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
        'LB-Orange-LB-Green-LB-Blue': ['var(--LBOrange) 10%', 'var(--LBGreen) 50%', 'var(--LBBlue) 90%']
      },
      extend: {
        colors: {
          'light-gray': 'var(--LightGray)',
          'LB-Gray': 'var(--LBGray)',
          'LB-Orange': 'var(--LBOrange)',
          'button-color': 'var(--buttonColor)',
          'LB-Blue': 'var(--LBBlue)',
          'header-BG': 'var(--headerBG)',
          'headerBgLight': 'var(--headerBgLight)'
          },
  },

  },
  plugins: [
    require('tailwindcss-gradients'),
  ],
}

