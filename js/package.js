/*jslint node */

var fs = require('fs');
var yazl = require('yazl');
var themes = fs.readdirSync('./themes/');

function packageThemes() {
    'use strict';

    // Loop through themes and zip contents
    var i, j, theme, filesToZip, fileToZip, zipFile, zipFilePath;
    for (i = 0; i < themes.length; i += 1) {

        // Get the relevant theme
        theme = themes[i];

        // Create a new instance of a yazl zipFile
        zipFile = new yazl.ZipFile();

        // Set the path of the output zip file
        zipFilePath = 'packaged/' + theme + '.zip';

        // List all the files we want to zip,
        // and where we want them in the output zip file.
        filesToZip = [
            {
                sourcePath: 'themes/' + theme + '/_selectors.scss',
                zipPath: 'themes/' + theme + '/_selectors.scss'
            },
            {
                sourcePath: 'themes/' + theme + '/_styles.scss',
                zipPath: 'themes/' + theme + '/_styles.scss'
            },
            {
                sourcePath: 'themes/' + theme + '/_variables.scss',
                zipPath: 'themes/' + theme + '/_variables.scss'
            },
            {
                sourcePath: 'themes/' + theme + '/main.scss',
                zipPath: 'themes/' + theme + '/main.scss'
            },
            {
                sourcePath: 'css/themes/' + theme + '/main.css',
                zipPath: 'css/themes/' + theme + '/main.css'
            },
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
        ];

        // Loop through the files in this theme,
        // and add them to the output zip file
        for (j = 0; j < filesToZip.length; j += 1) {

            // Define the file to zip so we can pass it to yazl's zipFile
            fileToZip = filesToZip[j];

            zipFile.addFile(fileToZip.sourcePath, fileToZip.zipPath);
            zipFile.outputStream.pipe(fs.createWriteStream(zipFilePath));
        }

        // End the yazl zipping process for this theme
        zipFile.end();

    }
}

packageThemes();
