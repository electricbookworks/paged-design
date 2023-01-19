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

// Build once...
writeCSS('css/main.scss', 'css/main.css')

// ...then watch for changes
const toWatch = ['css']
chokidar.watch(toWatch, { ignored: /main\.css/ }).on('all', function (event, path) {
  'use strict'
  console.log(event + ' at ' + path)
  writeCSS('css/main.scss', 'css/main.css')
})
