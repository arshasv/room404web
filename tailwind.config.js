/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blood: {
          DEFAULT: '#8B0000',
          50: '#FFF0F0',
          100: '#FFD0D0',
          200: '#FF9090',
          300: '#FF5050',
          400: '#FF1010',
          500: '#8B0000',
          600: '#6B0000',
          700: '#4B0000',
          800: '#2B0000',
          900: '#1A0000',
        },
        horror: {
          black: '#0A0A0A',
          dark: '#121212',
          charcoal: '#1A1A1A',
          gray: '#2A2A2A',
          bone: '#C4B8A8',
          offwhite: '#E8DED0',
        },
      },
      fontFamily: {
        horror: ['Creepster', 'cursive'],
        title: ['Special Elite', 'cursive'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        flicker: 'flicker 0.15s infinite',
        flickerSlow: 'flicker 2s infinite',
        glitch: 'glitch 0.3s infinite',
        glitchText: 'glitchText 4s infinite',
        float: 'float 6s ease-in-out infinite',
        pulseSlow: 'pulseSlow 4s ease-in-out infinite',
        smoke: 'smoke 8s ease-in-out infinite',
        bloodDrip: 'bloodDrip 3s ease-in-out infinite',
        vignette: 'vignette 4s ease-in-out infinite',
        shimmer: 'shimmer 3s ease-in-out infinite',
        fadeIn: 'fadeIn 1s ease-out forwards',
        slideUp: 'slideUp 0.8s ease-out forwards',
        reveal: 'reveal 0.6s ease-out forwards',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
          '25%': { opacity: '0.9' },
          '75%': { opacity: '0.85' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -1px)' },
          '60%': { transform: 'translate(-1px, -2px)' },
          '80%': { transform: 'translate(1px, 1px)' },
          '100%': { transform: 'translate(0)' },
        },
        glitchText: {
          '0%, 90%, 100%': { transform: 'translate(0)', opacity: '1' },
          '92%': { transform: 'translate(-3px, 1px)', opacity: '0.8' },
          '94%': { transform: 'translate(3px, -1px)', opacity: '0.9' },
          '96%': { transform: 'translate(-2px, 2px)', opacity: '0.7' },
          '98%': { transform: 'translate(2px, -2px)', opacity: '0.85' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        smoke: {
          '0%': { transform: 'translateX(-10%) translateY(0)', opacity: '0' },
          '20%': { opacity: '0.15' },
          '80%': { opacity: '0.1' },
          '100%': { transform: 'translateX(10%) translateY(-20%)', opacity: '0' },
        },
        bloodDrip: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '30%': { opacity: '0.8' },
          '60%': { opacity: '0.6' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        vignette: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(60px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        reveal: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
