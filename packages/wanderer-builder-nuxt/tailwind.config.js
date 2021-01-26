
module.exports = {
  purge: {
    // The default tailwind-nuxt purge seems to strip out all the tailwind CSS from the project on generate
    // Hope this bug will be fixed in future
    // Until then I will use the generated Files for purging
    enabled: process.env.NODE_ENV === 'production',
    content: ['./dist/*.html', './dist/_nuxt/*.js'],
  },
  theme: {
    container: {
      center: true
    },
    extend: {
      colors: {
        black: '#000',
        white: '#fff',
        // "gray-light": '#f8f9fa',
        "gray": "#f8f9fa",
        "gray-dark": '#6c757d',
        blue: '#007AFF',
        green: '#27A844',
        yellow: '#FEC106',
        red: '#E03347'
      }
    }

  }
}
