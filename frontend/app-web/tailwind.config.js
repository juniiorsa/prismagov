// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Isso escaneia todos os arquivos JS, TS, JSX, TSX na pasta src
  ],
  theme: {
    extend: {
      // Aqui você pode adicionar suas cores customizadas, fontes, etc.
      colors: {
        'azul-eletrico': '#0074E4',
        'verde-menta': '#24C9A0',
        'roxo-prisma': '#7D3FD1',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}