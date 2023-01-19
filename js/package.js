const fs = require('fs')
const path = require('path')
const yazl = require('yazl')
const themes = fs.readdirSync('./themes/')

// Function to add a directory with yazl, thanks to
// https://github.com/thejoshwolfe/yazl/issues/39
const noop = Function.prototype
function addDirectory (zip, realPath, metadataPath, cb) {
  'use strict'
  fs.readdir(realPath, function (error, files) {
    if (error === null) {
      let i = files.length
      let resolve = function (error) {
        if (error !== null) {
          resolve = noop
          cb(error)
        } else if (--i === 0) {
          resolve = noop
          cb()
        }
      }
      files.forEach(function (file) {
        addDirectory(
          zip,
          path.join(realPath, file),
          metadataPath + '/' + file,
          resolve
        )
      })
    } else if (error.code === 'ENOTDIR') {
      zip.addFile(realPath, metadataPath)
      cb()
    } else {
      cb(error)
    }
  })
}

// Package the themes
function packageThemes () {
  'use strict'

  // Loop through themes and zip contents
  let i, j, theme, filesToZip, fileToZip, zipFile, zipFilePath
  // var i, theme, zipFile, zipFilePath;
  for (i = 0; i < themes.length; i += 1) {
    // Get the relevant theme
    theme = themes[i]

    // Don't create a zip of the _defaults directory
    if (theme === '_defaults') {
      return
    }

    // Create a new instance of a yazl zipFile
    zipFile = new yazl.ZipFile()

    // Set the path of the output zip file
    zipFilePath = 'packaged/' + theme + '.zip'

    // List the root-directory files we want to zip,
    // and where we want them in the output zip file.
    filesToZip = [
      {
        sourcePath: 'index.js',
        zipPath: 'index.js'
      },
      {
        sourcePath: 'package.json',
        zipPath: 'package.json'
      },
      {
        sourcePath: '.gitignore',
        zipPath: '.gitignore'
      }
    ]

    // Loop through those root-directory files,
    // and add them to the output zip file
    for (j = 0; j < filesToZip.length; j += 1) {
      // Define the file to zip so we can pass it to yazl's zipFile
      fileToZip = filesToZip[j]

      zipFile.addFile(fileToZip.sourcePath, fileToZip.zipPath)
    }

    // Add the theme directory
    addDirectory(zipFile, './themes/' + theme, 'themes/' + theme, function (error) {
      if (error) {
        return console.error(error)
      }
    })

    // Add the _defaults directory
    addDirectory(zipFile, './themes/_defaults', 'themes/_defaults', function (error) {
      if (error) {
        return console.error(error)
      }
    })

    // End the yazl zipping process for this theme
    zipFile.end()

    // Write the zip file
    zipFile.outputStream.pipe(fs.createWriteStream(zipFilePath))
  }
}

packageThemes()
