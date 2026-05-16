/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#2b211b',
        clay: '#8b6b4a',
        sand: '#d8c3a5',
        cream: '#f7f1e8',
        linen: '#fbf8f2',
        ember: '#b9774d',
        cedar: '#5d4532',
        night: '#1f1713',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Manrope"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 50px -30px rgba(60, 40, 20, 0.45)',
        card: '0 18px 40px -30px rgba(60, 40, 20, 0.35)',
      },
      backgroundImage: {
        'paper-texture':
          'radial-gradient(circle at top, rgba(139, 107, 74, 0.08), transparent 55%), radial-gradient(circle at 20% 20%, rgba(216, 195, 165, 0.25), transparent 50%)',
        'hero-sun':
          'radial-gradient(circle at 15% 20%, rgba(185, 119, 77, 0.25), transparent 40%), radial-gradient(circle at 85% 15%, rgba(216, 195, 165, 0.35), transparent 45%)',
      },
    },
  },
  plugins: [],
}
