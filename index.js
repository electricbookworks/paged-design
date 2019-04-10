/*jslint node*/

var sass = require('node-sass');
var fs = require('fs');
var chokidar = require('chokidar');

// Process a scss file
function writeCSS(scssFile, cssFile) {
    'use strict';
    console.log('Rebuilding CSS from ' + scssFile);
    sass.render({
        file: scssFile,
        outFile: cssFile
    }, function (error, result) {
        if (error) {
            console.log('Error with Sass rendering:' + error);
        } else {
            fs.writeFile(cssFile, result.css, function (error) {
                if (error) {
                    console.log('Error writing the file to disk: ' + error);
                }
            });
        }
    });
}

// Helper function for error logging
function logErrorWhenDebugging(error) {
    'use strict';
    var debug = false;
    if (debug) {
        console.log(error);
    }
}

// Function for creating folders
function createFolders(folders, parentFolder) {
    'use strict';

    // Create the folder, and don't worry if it exists
    fs.mkdir(parentFolder, logErrorWhenDebugging);

    // Create folders in parent folder
    var i;
    for (i = 0; i < folders.length; i += 1) {
        fs.mkdir(parentFolder + '/' + folders[i], logErrorWhenDebugging);
    }

}

// The main CSS-building function
function build() {
    'use strict';

    var themes = fs.readdirSync('./themes/');

    // Create output folders if they don't exist
    createFolders(themes, 'css/themes');

    // Build default styles
    writeCSS(
        'default/main.scss',
        'css/themes/default/main.css'
    );

    // Build themes
    var i;
    for (i = 0; i < themes.length; i += 1) {
        writeCSS(
            'themes/' + themes[i] + '/main.scss',
            'css/themes/' + themes[i] + '/main.css'
        );
    }
}

// Build once...
build();

// ...then watch for changes
var toWatch = ['default', 'themes'];
chokidar.watch(toWatch).on('all', function (event, path) {
    'use strict';
    console.log(event + ' at ' + path);
    build();
});
