const read = require("fs-readdir-recursive");
const cleanPath = (path) => {
  return path.slice(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
}

module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'app.js': /app\/.+\.module/,
        'test.js': /app\/.+\.test/,
        'libraries.js': /^(?!app\/)/
      }
    },
    stylesheets: {
      joinTo: {
        'app.css': /app\/.+\.scss/
      }
    },
    templates: { 
      joinTo: {
        'app.js': /app\/.+\.hbs/
      }
    }
  },
  npm: {
    globals: {
      $: 'jquery'
    }
  },
  modules: {
    nameCleaner: cleanPath,
    autoRequire: {
      "test.js": read("app").filter(item => item.indexOf("test") > -1).map(cleanPath)
    }
  },
  plugins: {
    babel: {
      ignore: [/node_modules/]
    },
    postcss: {
      processors: [
        require('autoprefixer')(['last 8 versions']),
      ]
    },
    karma: {
      frameworks: [
          'jasmine'
      ],
      files: [
          "public/libraries.js",
          "public/app.js",
          "public/test.js"
      ],
      plugins: [
          'karma-jasmine',
          'karma-phantomjs-launcher'
      ],
      browsers: [
        'PhantomJS'
      ]
    }
  }
}