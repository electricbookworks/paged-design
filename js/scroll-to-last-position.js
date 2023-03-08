/* globals localStorage */

// Adapted from:
// Reload-in-place v1.3 by Nicolas Taffin + Sameh Chafik - 2020
// MIT License https://opensource.org/licenses/MIT

// Set a "unique" filename based on title element,
// in case several books are open.
const fileTitle = document.getElementsByTagName('title')[0].text

// Get document height
function getDocHeight () {
  const D = document
  return Math.max(
    D.body.scrollHeight, D.documentElement.scrollHeight,
    D.body.offsetHeight, D.documentElement.offsetHeight,
    D.body.clientHeight, D.documentElement.clientHeight
  )
}

// Save the amount scrolled
function saveAmountScrolled () {
  const scrollArray = []
  const scrollTop = window.pageYOffset ||
    (document.documentElement ||
    document.body.parentNode ||
    document.body).scrollTop
  const scrollLeft = window.pageXOffset ||
    (document.documentElement ||
    document.body.parentNode ||
    document.body).scrollLeft
  scrollArray.push({ X: Math.round(scrollLeft), Y: Math.round(scrollTop) })
  // console.log("Saved ", scrollArray);
  localStorage[fileTitle] = JSON.stringify(scrollArray)
}

// on Load, blur or opacify the page, and try to join ASAP
// last saved position, or at least last compiled page

function scrollToLastPosition () {
  'use strict'

  const styleEl = document.createElement('style')
  document.head.appendChild(styleEl)
  const styleSheet = styleEl.sheet

  // uncomment one of the two options :
  // nice but high calculation usage : blur until scrolled
  // styleSheet.insertRule('.pagedjs_pages { filter: blur(4px); }', 0);
  // less power consumption: low opacity until scrolled
  styleSheet.insertRule('.pagedjs_pages { opacity: 0.3; }', 0)

  const savedData = localStorage.getItem(fileTitle)

  let scrollTop, scrollLeft
  if (savedData) {
    const scrollArray = JSON.parse(savedData)
    scrollTop = scrollArray[0].Y
    scrollLeft = scrollArray[0].X
  } else {
    scrollTop = 0
    scrollLeft = 0
  }
  const winheight = window.innerHeight ||
    (document.documentElement || document.body).clientHeight
  window.currentInterval = setInterval(function () {
    const docheight = getDocHeight()

    if (scrollTop > 0 && scrollTop > docheight - winheight) {
      window.scrollTo(scrollLeft, docheight)
    } else {
      window.scrollTo(scrollLeft, scrollTop)
      clearInterval(window.currentInterval)
      setTimeout(function () {
        window.scrollTo(scrollLeft, scrollTop)
        styleSheet.deleteRule(0)
      }, 100)
    }
  }, 50)
}

// Slow down how often we save position
const slowSave = debounce(function () {
  saveAmountScrolled()
}, 100)

function debounce (func, wait, immediate) {
  let timeout
  return function () {
    const context = this; const args = arguments
    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
};

// Scroll triggers save, but not immediately on load
setTimeout(function () {
  window.addEventListener('scroll', slowSave)
}, 1000)
