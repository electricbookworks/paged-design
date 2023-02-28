// Standard JS

function addHeaderClasses () {
  'use strict'

  const headers = document.querySelectorAll('header')
  headers.forEach(function (header) {
    const headingElement = header.querySelector('h1, h2, h3, h4, h5, h6')
    if (headingElement) {
      header.classList.add(headingElement.tagName.toLowerCase())
    }
  })
}

// Go
addHeaderClasses()
