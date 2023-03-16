/* globals Paged */

// Lint with JS Standard

// Paged.js scripts that run after layout must
// be registered with Paged.registerHandlers().

function alignToGrid (querySelectorString) {
  return new Promise((resolve) => {
    // Get all elements we want aligned with baseline grid.
    // Note that unlike InDesign we do not force elements
    // to the next baseline unit. Rather, we add margin-bottom
    // so that they end aligned. Then any following elements
    // will also be aligned with the baseline grid.
    let elementsToAlign = document.querySelectorAll('.align-to-baseline')

    if (querySelectorString) {
      elementsToAlign = document.querySelectorAll(querySelectorString)
    }

    // Get the baseline grid. We assume it is
    // the line-height applied to the body element.
    // Note: we need to convert CSS strings to numbers.
    const gridValuePx = window.getComputedStyle(document.body).lineHeight
    const gridValue = Number(gridValuePx.replace('px', ''))

    // For each element:
    // 1. measure its height
    // 2. get the difference to the next baseline grid multiple
    // 3. add that difference to its margin-bottom

    elementsToAlign.forEach(function (element) {
      const height = element.offsetHeight
      const difference = height % gridValue

      // Get the element's margin-bottom
      const elementMarginBottomPx = window.getComputedStyle(element).marginBottom
      const elementMarginBottom = Number(elementMarginBottomPx.replace('px', ''))
      const newMarginBottom = elementMarginBottom + difference

      // Give the element that margin-bottom
      element.style.marginBottom = newMarginBottom + 'px'
    })
    resolve()
  })
}

// TODO THis is not currently working. See
// https://pagedjs.org/documentation/10-handlers-hooks-and-custom-javascript/
class alignToBaselineGrid extends Paged.Handler {
  constructor (chunker, polisher, caller) {
    super(chunker, polisher, caller)
  }

  afterPageLayout () {
    alignToGrid('h1, h2, h3, h4, h5, h6, p, ul, ol')
  }
}

// Register the handler
Paged.registerHandlers(alignToBaselineGrid)
