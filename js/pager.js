/* global MathJax, MutationObserver */

// Options, e.g. for setting the source of the paged.js script.
const pagerOptions = {
  pagedjs: '../../js/vendor/paged.polyfill.js'
  // pagedjs: 'https://unpkg.com/pagedjs/dist/paged.polyfill.js'
}

// Variable for holding theme data
let themes

// Check that a theme exists
function checkThemeExists (theme) {
  'use strict'

  if (Object.keys(themes).indexOf(theme) > -1) {
    return true
  } else {
    return false
  }
}

// Detect current theme, fall back to 'template'
function detectThemeFromURL () {
  'use strict'

  const matchParam = window.location.href.match(/theme=([^&#]*)/)
  let theme
  if (matchParam && checkThemeExists(matchParam[1])) {
    theme = matchParam[1]
  } else {
    theme = 'template'
  }
  return theme
}

// Load any theme scripts
function loadThemeScripts (themeDirectory, themeData, preOrPostLayout) {
  'use strict'

  return new Promise((resolve) => {
    // Create a script element for each
    // script in the theme.
    themeData.scripts[preOrPostLayout].forEach(function (script) {
      const themeScriptElement = document.createElement('script')
      themeScriptElement.src = '../../themes/' +
        themeDirectory +
        '/js/' +
        script
      themeScriptElement.async = false
      document.head.insertAdjacentElement('beforeend', themeScriptElement)
      resolve()
    })
  })
}

// Load paged.js on the page
function loadPagedJS () {
  'use strict'

  const pagedjs = document.createElement('script')
  pagedjs.src = pagerOptions.pagedjs
  pagedjs.async = false
  document.body.insertAdjacentElement('beforeend', pagedjs)

  // With Paged loaded, we can add scripts
  // that must run after Paged has loaded.
  loadThemeScripts(detectThemeFromURL(), themes[detectThemeFromURL()], 'postlayout')
}

// Load theme CSS
async function loadThemeStylesheet (themeDirectory) {
  'use strict'

  // Create a link element pointing to the desired theme's stylesheet
  const themeStylesheetLink = document.createElement('link')
  themeStylesheetLink.setAttribute('rel', 'stylesheet')
  themeStylesheetLink.setAttribute('href', '../../themes/' + themeDirectory + '/main.css')

  // If there is an existing theme stylesheet, remove it
  const stylesheet = document.querySelector('link[href^="../../themes/"]')
  if (stylesheet) {
    stylesheet.remove()
  }

  // Insert the new stylesheet
  document.head.insertAdjacentElement('beforeend', themeStylesheetLink)

  // Load theme scripts
  const themeData = themes[themeDirectory]
  if (themeData.scripts) {
    await loadThemeScripts(themeDirectory, themeData, 'prelayout')
  }

  // Load Paged.js
  loadPagedJS()
}

// Set new theme in URL parameter
function updateThemeInURLParameter (themeDirectory) {
  'use strict'

  // Reload if the themeDirectory isn't already loaded
  if (themeDirectory !== detectThemeFromURL()) {
    // Get the current URL
    const currentLocationWithParams = window.location.href

    // Remove any params
    const currentLocationWithoutParams = currentLocationWithParams.match(/[^?]+/)

    // Reload the page with new themeDirectory param
    window.location.href = currentLocationWithoutParams + '?theme=' + themeDirectory
  }
}

// Listen for switch
function listenForThemeSwitch (selectList) {
  'use strict'

  selectList.onchange = function (event) {
    updateThemeInURLParameter(event.target.value)
  }
}

// Create a link to the home page
function insertLinkToHomePage () {
  'use strict'

  const link = document.createElement('div')
  link.id = 'pagerGoHome'
  link.innerHTML = '<a href="../../">Home</a>'
  return link
}

// Create a theme-switcher dropdown.
function showThemeSelectionList (themes) {
  'use strict'

  // Create a div for the list
  const controls = document.createElement('div')
  controls.id = 'pagerControls'

  // … and style it
  let controlsCSS = 'position: fixed;'
  controlsCSS += 'top: 1em;'
  controlsCSS += 'left: 1em;'
  controlsCSS += 'text-align: right;'
  controlsCSS += 'z-index: 1000;'
  controlsCSS += 'font-size: 1.1em;'
  controlsCSS += 'font-family: "Source Sans Pro", "Helvetica", sans-serif;'
  controls.style.cssText = controlsCSS

  // Create the dropdown
  const selectList = document.createElement('select')
  selectList.id = 'pagerSelectList'

  // … and style it
  let selectListCSS = 'font-family: inherit;'
  selectListCSS += 'padding: 0.3em;'
  selectListCSS += ''
  selectList.style.cssText = selectListCSS

  // Add the themes as options
  let selected = ''
  Object.entries(themes).forEach(
    function ([key, value]) {
      selected = ''
      if (key === detectThemeFromURL()) {
        selected = 'selected'
      }
      selectList.innerHTML += '<option value="' + key + '"' + selected + '>' + value.name + '</option>'
    }
  )

  // Insert and position the list
  controls.insertAdjacentElement('afterbegin', selectList)

  // Insert a home-page link
  controls.insertAdjacentElement('afterbegin', insertLinkToHomePage())

  // Hide the select list in actual print output,
  // i.e. when hitting Ctrl/Cmd+P in Chrome
  const mediaQueryPrint = window.matchMedia('print')
  const mediaQueryScreen = window.matchMedia('screen')
  mediaQueryPrint.addEventListener('change', function (query) {
    if (query.matches) {
      console.log('Printing …')
      controls.style.display = 'none'
    }
  })
  // … and put it back when done.
  mediaQueryScreen.addEventListener('change', function (query) {
    if (query.matches) {
      controls.style.display = 'block'
    }
  })

  // The controls div should be added to the page
  // only after paged.js has done its work on the DOM.
  let readyForControls = false
  function showControls () {
    if (readyForControls === true) {
      const pagedJsTemplate = document.querySelector('.pagedjs_pages')
      pagedJsTemplate.insertAdjacentElement('beforebegin', controls)
    } else {
      const check = setInterval(function () {
        console.log('Waiting for paged.js pagination before showing controls …')
        if (document.querySelector('.pagedjs_pages')) {
          console.log('… paged.js pagination done. Showing controls.')
          readyForControls = true
          showControls()
          clearInterval(check)
        }
      }, 500)
    }
  }
  showControls()

  // Listen for changes
  listenForThemeSwitch(selectList)
}

// Load themes.json
async function pagerLoadThemes () {
  'use strict'

  const themesjs = window.location.protocol +
    '//' +
    window.location.host +
    '/js/themes.json'

  await fetch(themesjs)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      // Populate the themes variable
      // with the data in the response.
      themes = data
    })

  loadThemeStylesheet(detectThemeFromURL())
  showThemeSelectionList(themes)
}

// Check for mathjax
function mathjaxOnPage () {
  'use strict'

  // If there are MathJax elements on the page,
  // or the MathJax variable is defined, return true.
  const mathjaxElementsOnPage = document.querySelector('script[src*="mathjax"], #MathJax-script')
  if (mathjaxElementsOnPage) {
    console.log('MathJax detected on page.')
    return true
  } else {
    console.log('No MathJax detected on page.')
    return false
  }
}

// Add an attribute when MathJax is done typesetting
function markWhenMathjaxComplete () {
  'use strict'

  // https://docs.mathjax.org/en/latest/web/configuration.html?highlight=queue#performing-actions-after-typesetting
  // If MathJax is already on the page, override only
  // its pageReady property. Otherwise, create window.MathJax
  // and define its startup property. Either way, we want MathJax
  // to mark the body element with a data- attribute when it's done.
  if (window.MathJax) {
    window.MathJax.startup.pageReady = new Promise(() => {
      return MathJax.startup.defaultPageReady().then(function () {
        document.body.setAttribute('data-mathjax-ready-for-pagedjs', true)
      })
    })
  } else {
    window.MathJax = {
      startup: {
        pageReady () {
          return MathJax.startup.defaultPageReady().then(function () {
            document.body.setAttribute('data-mathjax-ready-for-pagedjs', true)
          })
        }
      }
    }
  }
}

// Prepare and wait for page HTML
function pagePrep () {
  'use strict'

  if (mathjaxOnPage() === true) {
    markWhenMathjaxComplete()

    const pageObserver = new MutationObserver(function (mutations) {
      let readyForLayout = false
      mutations.forEach(function (mutation) {
        if (mutation.type === 'attributes' && readyForLayout === false) {
          if (document.body.getAttribute('data-mathjax-ready-for-pagedjs')) {
            readyForLayout = true
            pagerLoadThemes()
            pageObserver.disconnect()
          }
        }
      })
    })
    pageObserver.observe(document.body, {
      attributes: true // listen for attribute changes
    })
  } else {
    pagerLoadThemes()
  }
}

// Start
window.onload = function () {
  'use strict'
  pagePrep()
}
