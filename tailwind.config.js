/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fcabl-navy': '#1e3a8a',
        'fcabl-blue': '#1e40af',
        'fcabl-dark': '#0f172a',
        'fcabl-dark-light': '#1e293b',
        'fcabl-gray': '#64748b',
        'fcabl-accent': '#f59e0b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        fcabl: {
          primary: '#1e40af',
          secondary: '#64748b',
          accent: '#f59e0b',
          neutral: '#1e293b',
          'base-100': '#0f172a',
          'base-200': '#1e293b',
          'base-300': '#334155',
          info: '#06b6d4',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        },
      },
    ],
    darkTheme: 'fcabl',
  },
}
