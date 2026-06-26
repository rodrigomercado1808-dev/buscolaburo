export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#f8fafc',
        line: 'rgba(255,255,255,0.13)',
        brand: '#e50914',
        accent: '#1877f2',
        surface: '#0b0f19',
        social: '#141a2a',
        insta: '#d62976',
        gold: '#f6c343'
      },
      boxShadow: {
        soft: '0 18px 50px rgba(0, 0, 0, 0.38)',
        glow: '0 0 32px rgba(229, 9, 20, 0.24)'
      }
    }
  },
  plugins: []
};
