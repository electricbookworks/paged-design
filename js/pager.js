/* global window, MathJax */

// Theme switcher

// Available themes, listed as
// foldername: 'Theme name'
const themes = {
  template: 'Template',
  density: 'Density',
  beatrix: 'Beatrix',
  plastered: 'Plastered'
}

// Check for mathjax
function pagerMathjax () {
  'use strict'
  const mathjax = document.querySelector('script[type="math/tex"], #MathJax_Config')
  if (mathjax) {
    console.log('MathJax detected on page.')
    return true
  } else {
    console.log('No MathJax detected on page.')
    return false
  }
}

// Check that a theme exists
function pagerCheckThemeExists (theme) {
  'use strict'
  if (Object.keys(themes).indexOf(theme) > -1) {
    return true
  } else {
    return false
  }
}

// Get current theme
function pagerCurrentTheme () {
  'use strict'
  const matchParam = window.location.href.match(/theme=([^&#]*)/)
  let theme
  if (matchParam && pagerCheckThemeExists(matchParam[1])) {
    theme = matchParam[1]
  } else {
    theme = 'template'
  }
  return theme
}

// Load default theme
function pagerAddTheme (theme) {
  'use strict'

  // Create a link element pointing to the new stylesheet
  const themeStylesheetLink = document.createElement('link')
  themeStylesheetLink.setAttribute('rel', 'stylesheet')
  themeStylesheetLink.setAttribute('href', '../../themes/' + theme + '/main.css')

  // If there is a stylesheet, remove it
  const stylesheet = document.querySelector('link[href^="../../themes/"]')
  if (stylesheet) {
    stylesheet.remove()
  }

  // Insert the new stylesheet
  document.head.insertAdjacentElement('beforeend', themeStylesheetLink)
}

// Load new theme
function pagerLoadTheme (theme) {
  'use strict'

  // Reload if the theme isn't already loaded
  if (theme !== pagerCurrentTheme()) {
    // Get the current URL
    const currentLocationWithParams = window.location.href

    // Remove any params
    const currentLocationWithoutParams = currentLocationWithParams.match(/[^?]+/)

    // Reload the page with new theme param
    window.location.href = currentLocationWithoutParams + '?theme=' + theme
  }
}

// Listen for switch
function pagerListenForSwitch (selectList) {
  'use strict'
  selectList.onchange = function (event) {
    pagerLoadTheme(event.target.value)
  }
}

// Create a link to the home page
function pagerHomePageLink () {
  'use strict'
  const link = document.createElement('div')
  link.id = 'pagerGoHome'
  link.innerHTML = '<a href="../../">Home</a>'
  return link
}

// Create a theme-switcher dropdown
function pagerShowThemeSelectionList (listObject) {
  'use strict'

  // Create a div for the list
  const controls = document.createElement('div')
  controls.id = 'pagerControls'

  // ... and style it
  let controlsCSS = 'position: absolute;'
  controlsCSS += 'top: 1em;'
  controlsCSS += 'left: 1em;'
  controlsCSS += 'text-align: right;'
  controlsCSS += 'z-index: 1;'
  controlsCSS += 'font-size: 1.1em;'
  controlsCSS += 'font-family: "Source Sans Pro", "Helvetica", sans-serif;'
  controls.style.cssText = controlsCSS

  let readyForControls = false
  function showControls () {
    if (readyForControls === true) {
      const pagedJsTemplate = document.querySelector('.pagedjs_pages')
      pagedJsTemplate.insertAdjacentElement('beforebegin', controls)
    } else {
      const check = setInterval(function () {
        console.log('Waiting for paged.js to lay out pages ...')
        if (document.querySelector('.pagedjs_pages')) {
          console.log('... paged.js layout in progress.')
          readyForControls = true
          showControls()
          clearInterval(check)
        }
      }, 1000)
    }
  }
  showControls()

  // Create the dropdown
  const selectList = document.createElement('select')
  selectList.id = 'pagerSelectList'

  // ... and style it
  let selectListCSS = 'font-family: inherit;'
  selectListCSS += 'padding: 0.3em;'
  selectListCSS += ''
  selectList.style.cssText = selectListCSS

  // Add the themes as options
  let selected = ''
  Object.entries(listObject).forEach(
    function ([key, value]) {
      selected = ''
      if (key === pagerCurrentTheme()) {
        selected = 'selected'
      }
      selectList.innerHTML += '<option value="' + key + '"' + selected + '>' + value + '</option>'
    }
  )

  // Insert and position the list
  controls.insertAdjacentElement('afterbegin', selectList)

  // Insert a home-page link
  controls.insertAdjacentElement('afterbegin', pagerHomePageLink())

  // Hide the select list in actual print output,
  // i.e. when hitting Ctrl/Cmd+P in Chrome
  const mediaQueryPrint = window.matchMedia('print')
  const mediaQueryScreen = window.matchMedia('screen')
  mediaQueryPrint.addListener(function (query) {
    if (query.matches) {
      console.log('Printing...')
      controls.style.display = 'none'
    }
  })
  // ... and put it back when done.
  mediaQueryScreen.addListener(function (query) {
    if (query.matches) {
      controls.style.display = 'block'
    }
  })

  // Listen for changes
  pagerListenForSwitch(selectList)
}

// Load paged.js
function pagerLoadPagedJS () {
  'use strict'

  const pagedJSConfig = document.createElement('script')
  pagedJSConfig.innerHTML = 'window.PagedConfig = {auto: false};'

  const pagedjs = document.createElement('script')
  pagedjs.src = 'https://unpkg.com/pagedjs/dist/paged.polyfill.js'
  pagedjs.async = false

  document.head.insertAdjacentElement('beforeend', pagedJSConfig)
  document.head.insertAdjacentElement('beforeend', pagedjs)

  // Run paged.js (wait for MathJax, if any)
  if (pagerMathjax() === true) {
    MathJax.Hub.Queue(function () {
      const check = setInterval(function () {
        console.log('Waiting for paged.js to load ...')
        if (window.PagedPolyfill.preview()) {
          console.log('... paged.js loaded.')
          pagerShowThemeSelectionList(themes)
          clearInterval(check)
        }
      }, 1000)
    })
  } else {
    const check = setInterval(function () {
      console.log('Waiting for paged.js to load ...')
      if (window.PagedPolyfill.preview()) {
        console.log('... paged.js loaded.')
        pagerShowThemeSelectionList(themes)
        clearInterval(check)
      }
    }, 1000)
  }
}

// Start
window.onload = function () {
  'use strict'
  pagerAddTheme(pagerCurrentTheme())
  pagerLoadPagedJS()
}
