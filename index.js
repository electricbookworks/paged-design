const sass = require('node-sass')
const fs = require('fs')
const chokidar = require('chokidar')

// Process a scss file
function writeCSS (scssFile, cssFile) {
  'use strict'
  console.log('Rebuilding CSS from ' + scssFile)
  sass.render({
    file: scssFile,
    outFile: cssFile
  }, function (error, result) {
    if (error) {
      console.log('Error with Sass rendering:' + error)
    } else {
      fs.writeFile(cssFile, result.css, function (error) {
        if (error) {
          console.log('Error writing the file to disk: ' + error)
        }
      })
    }
  })
}

// The main CSS-building function
function build () {
  'use strict'

  const themes = fs.readdirSync('./themes/')

  // Build themes
  let i
  for (i = 0; i < themes.length; i += 1) {
    writeCSS(
      'themes/' + themes[i] + '/main.scss',
      'themes/' + themes[i] + '/main.css'
    )
  }
}

// Build once...
build()

// ...then watch for changes
const toWatch = ['default', 'themes']
chokidar.watch(toWatch, { ignored: /main\.css/ }).on('all', function (event, path) {
  'use strict'
  console.log(event + ' at ' + path)
  build()
})
