const chokidar = require('chokidar')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const sass = require('node-sass')

// Get all theme information
async function writeThemeData () {
  const themesDirectory = './themes'
  const themesData = {}
  const themeDirectoryContents = await fsPromises.readdir(path.resolve(themesDirectory), {
    withFileTypes: true
  })

  // Get only directories in the themesDirectory
  const themeDirectories = themeDirectoryContents.filter(function (entry) {
    return entry.isDirectory()
  })

  // Get each theme's information
  let directoryCounter = 0
  themeDirectories.forEach(async function (directory) {
    // Get the path to the theme's JSON file
    const pathToThemeJS = path.normalize(path.join(themesDirectory, directory.name, 'theme.json'))

    // If it has one, write its theme data to themesData
    if (fs.existsSync(pathToThemeJS)) {
      const themeDataFile = await fsPromises.readFile(pathToThemeJS, { encoding: 'utf-8' })
      themesData[directory.name] = JSON.parse(themeDataFile).name
    }

    // Count each directory we look inside
    directoryCounter += 1

    if (directoryCounter === themeDirectories.length) {
      const pathToThemesJS = path.normalize('js/themes.js')
      const themesJS = '// This file is autogenerated in the build process.\n' +
        'const themes = ' +
        JSON.stringify(themesData)
      fsPromises.writeFile(pathToThemesJS, themesJS, { encoding: 'utf-8' })
    }
  })
}

// Process a scss file
function writeCSS (scssFile, cssFile) {
  'use strict'
  // console.log('\nRebuilding CSS from ' + scssFile + '\n')
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
  // console.log(event + ' at ' + path)
  writeCSS('css/main.scss', 'css/main.css')
  writeThemeData()
})
