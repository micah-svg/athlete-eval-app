/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7B2CBF', // rich purple
        secondary: '#FF6B6B', // coral red
        accent: '#4ADEDE', // teal accent
        dark: '#1B1B2F',
        light: '#F4F4F9',
        success: '#3EB489',
        muted: '#888888',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        lg: '1rem',
        xl: '1.5rem',
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
};
