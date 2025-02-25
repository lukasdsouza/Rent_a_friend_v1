// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',     // Tom moderno de azul para destaques e botões
        secondary: '#10B981',   // Verde vibrante para ações positivas
        accent: '#F59E0B',      // Laranja marcante para detalhes e alertas
        background: '#F3F4F6'   // Cinza claro para fundos, garantindo um visual clean
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Fonte moderna e legível
      },
      borderRadius: {
        'xl': '1rem', // Bordas suavizadas para um toque sofisticado
      },
      spacing: {
        '128': '32rem', // Espaçamentos personalizados para layouts mais amplos
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),       // Estiliza formulários de forma elegante
    require('@tailwindcss/typography'),  // Melhora a tipografia para conteúdos ricos
  ],
}
