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
      themesData[directory.name] = JSON.parse(themeDataFile)
    }

    // Count each directory we look inside
    directoryCounter += 1

    if (directoryCounter === themeDirectories.length) {
      const pathToThemesJSON = path.normalize('js/themes.json')
      const themesJSON = JSON.stringify(themesData)
      fsPromises.writeFile(pathToThemesJSON, themesJSON, { encoding: 'utf-8' })
    }
  })
}

// Process a scss file
function compileCSS (scssFile, cssFile) {
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
        } else {
          console.log('\nRebuilt CSS from ' + scssFile + '\n')
        }
      })
    }
  })
}

// The main CSS-building function
function compileAllCSS () {
  'use strict'

  const themes = fs.readdirSync('./themes/')

  // Build themes
  let i
  for (i = 0; i < themes.length; i += 1) {
    compileCSS(
      'themes/' + themes[i] + '/main.scss',
      'themes/' + themes[i] + '/main.css'
    )
  }
}

// Build CSS for all themes
compileAllCSS()

// Write the CSS for the preview site
compileCSS('css/main.scss', 'css/main.css')

// Create a JSON file containing data
// about each theme in the project
writeThemeData()
