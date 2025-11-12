export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'plusjakarta': ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        mitraPurple: '#7c3aed',  // used for MITra highlight
      }
    }
  },
  plugins: [],
}
