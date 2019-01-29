/*global window, MathJax*/

// Theme switcher

// Available themes, listed as
// foldername: 'Theme name'
var pagerThemes = {
    template: 'Template',
    density: 'Density',
    beatrix: 'Beatrix'
};

// Check for mathjax
function pagerMathjax() {
    'use strict';
    var mathjax = document.querySelector('script[type="math/tex"]');
    if (mathjax) {
        return true;
    } else {
        return false;
    }
}

// Check that a theme exists
function pagerCheckThemeExists(theme) {
    'use strict';
    if (Object.keys(pagerThemes).indexOf(theme) > -1) {
        return true;
    } else {
        return false;
    }
}

// Get current theme
function pagerCurrentTheme() {
    'use strict';
    var matchParam = window.location.href.match(/theme=([^&#]*)/);
    var theme;
    if (matchParam && pagerCheckThemeExists(matchParam[1])) {
        theme = matchParam[1];
    } else {
        theme = 'default';
    }
    return theme;
}

// Load default theme
function pagerAddTheme(theme) {
    'use strict';

    // Create a link element pointing to the new stylesheet
    var themeStylesheetLink = document.createElement('link');
    themeStylesheetLink.setAttribute('rel', 'stylesheet');
    themeStylesheetLink.setAttribute('href', '../../css/themes/' + theme + '/main.css');

    // If there is a stylesheet, remove it
    var stylesheet = document.querySelector('link[href^="../../css/themes/"]');
    if (stylesheet) {
        stylesheet.remove();
    }

    // Insert the new stylesheet
    document.head.insertAdjacentElement('beforeend', themeStylesheetLink);
}

// Load new theme
function pagerLoadTheme(theme) {
    'use strict';

    // Reload if the theme isn't already loaded
    if (theme !== pagerCurrentTheme()) {
        // Get the current URL
        var currentLocationWithParams = window.location.href;

        // Remove any params
        var currentLocationWithoutParams = currentLocationWithParams.match(/[^?]+/);

        // Reload the page with new theme param
        window.location.href = currentLocationWithoutParams + '?theme=' + theme;
    }
}

// Listen for switch
function pagerListenForSwitch(selectList) {
    'use strict';
    selectList.onchange = function (event) {
        pagerLoadTheme(event.target.value);
    };
}

// Create a link to the home page
function pagerHomePageLink() {
    'use strict';
    var link = document.createElement('div');
    link.id = 'pagerGoHome';
    link.innerHTML = '<a href="../../">Home</a>';
    return link;
}

// Create a theme-switcher dropdown
function pagerShowThemeSelectionList(listObject) {
    'use strict';

    // Create a div for the list
    var controls = document.createElement('div');
    controls.id = 'pagerControls';
    controls.style.position = 'fixed';
    controls.style.top = '1em';
    controls.style.right = '1em';
    controls.style.textAlign = 'right';
    document.body.insertAdjacentElement('afterbegin', controls);

    var selectList = document.createElement('select');
    selectList.id = 'pagerSelectList';
    selectList.style.fontFamily = 'inherit';

    // Add the themes as options
    var selected = "";
    Object.entries(listObject).forEach(
        function ([key, value]) {
            selected = "";
            if (key === pagerCurrentTheme()) {
                selected = 'selected';
            }
            selectList.innerHTML += '<option value="' + key + '"' + selected + '>' + value + '</option>';
        }
    );

    // Insert and position the list
    controls.insertAdjacentElement('afterbegin', selectList);

    // Insert a home-page link
    controls.insertAdjacentElement('afterbegin', pagerHomePageLink());

    // Hide the select list in actual print output,
    // i.e. when hitting Ctrl/Cmd+P in Chrome
    var mediaQueryPrint = window.matchMedia('print');
    var mediaQueryScreen = window.matchMedia('screen');
    mediaQueryPrint.addListener(function (query) {
        if (query.matches) {
            console.log('Printing...');
            controls.style.display = 'none';
        }
    });
    // ... and put it back when done.
    mediaQueryScreen.addListener(function (query) {
        if (query.matches) {
            controls.style.display = 'block';
        }
    });

    // Listen for changes
    pagerListenForSwitch(selectList);
}

// Load paged.js
function pagerLoadPagedJS() {
    'use strict';

    var pagedJSConfig = document.createElement('script');
    pagedJSConfig.innerHTML = 'window.PagedConfig = {auto: false};';

    var pagedjs = document.createElement('script');
    pagedjs.src = 'https://unpkg.com/pagedjs/dist/paged.polyfill.js';
    pagedjs.async = false;

    document.head.insertAdjacentElement('beforeend', pagedJSConfig);
    document.head.insertAdjacentElement('beforeend', pagedjs);

    // Run paged.js (wait for MathJax, if any)
    if (pagerMathjax === true) {
        MathJax.Hub.Queue(function () {
            window.PagedPolyfill.preview();
        });
    } else {
        var check;
        check = setInterval(function () {
            console.log('Waiting for paged.js to load ...');
            if (window.PagedPolyfill.preview()) {
                console.log('... paged.js loaded.');
                pagerShowThemeSelectionList(pagerThemes);
                clearInterval(check);
            }
        }, 1000);
    }
}

// Start
window.onload = function () {
    'use strict';
    pagerAddTheme(pagerCurrentTheme());
    pagerLoadPagedJS();
};
