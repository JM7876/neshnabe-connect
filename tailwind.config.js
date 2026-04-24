/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#1A1614',
        card: '#2A2420',
        amber: '#D4A574',
        'amber-glow': 'rgba(212, 165, 116, 0.3)',
        glass: 'rgba(255, 255, 255, 0.08)',
        'glass-border': 'rgba(255, 255, 255, 0.15)',
        'glass-active': 'rgba(255, 255, 255, 0.12)',
        'text-primary': '#FFFFFF',
        'text-secondary': 'rgba(255, 255, 255, 0.6)',
        'text-muted': 'rgba(255, 255, 255, 0.4)',
        success: '#27AE60',
        warning: '#F39C12',
        error: '#E74C3C',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
}
