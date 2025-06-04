/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        'xl': '0.75rem',
      },
      animation: {
        'float': 'float 3s infinite',
        'pulse': 'pulse 2s infinite',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0' },
          '50%': { transform: 'translateY(-20px) scale(1.2)', opacity: '0.6' },
          '100%': { transform: 'translateY(-40px) scale(1)', opacity: '0' },
        },
        pulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 