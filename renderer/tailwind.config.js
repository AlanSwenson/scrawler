module.exports = {
  content: [
    './renderer/pages/**/*.{js,ts,jsx,tsx}',
    './renderer/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        championship: ['var(--font-championship)'],
      },
      colors: {
        'dark-100': '#1c1429',
        'dark-200': '#31293d',
        'mixed-100': '#321f2b',
        'mixed-200': '#46343f',
        'mixed-300': '#5b4a54',
        'mixed-400': '#71626b',
        'mixed-500': '#877a82',
        'mixed-600': '#9e9399',
        'primary-100': '#ff9800',
        'primary-200': '#ffa333',
        'primary-300': '#ffaf50',
        'primary-400': '#ffba6a',
        'primary-500': '#ffc683',
        'primary-600': '#ffd19b',
      },
    },
  },
  plugins: [],
};

