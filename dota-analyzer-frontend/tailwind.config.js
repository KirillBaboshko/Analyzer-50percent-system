/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dota-dark': '#060d15',      // Очень темный фон страницы
        'dota-card': '#0f1923',      // Темный фон карточек
        'dota-border': '#1e3248',    // Границы
        'dota-text': '#c9d4e0',      // Основной текст
        'dota-muted': '#5a7a99',     // Приглушенный текст
        'dota-radiant': '#3ddc84',   // Radiant зеленый
        'dota-dire': '#4a9eda',      // Dire синий
      },
    },
  },
  plugins: [],
}
