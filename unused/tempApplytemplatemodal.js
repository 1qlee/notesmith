switch(value) {
  case "apply-current":
    // change the corresponding page's svg in our cloned array
    canvasPagesClone[pageNumber].svg = newPageSvg
    // update the svg field for this entry in the firebase db
    updatePageSvg(canvasPagesClone[pageNumber].id, newPageSvg)
    break
  case "apply-range":
    // change the corresponding page's svg in our cloned array
    // simple loop from lower to upper page bound
    for (let i = lowerPageBound; i <= upperPageBound; i++) {
      // for if a frequency is checked
      switch(frequency) {
        case "even":
          if (i % 2 === 0) {
            // change the corresponding page's svg in our cloned array
            canvasPagesClone[i - 1].svg = newPageSvg
            // update the svg field for each appropriate page in the firebase db
            updatePageSvg(canvasPagesClone[i - 1].id, newPageSvg)
          }
          break
        case "odd":
          if (i % 2 !== 0) {
            // change the corresponding page's svg in our cloned array
            canvasPagesClone[i - 1].svg = newPageSvg
            // update the svg field for each appropriate page in the firebase db
            updatePageSvg(canvasPagesClone[i - 1].id, newPageSvg)
          }
          break
        case "other":
          if (i % frequencyNum === 0) {
            // change the corresponding page's svg in our cloned array
            canvasPagesClone[i - 1].svg = newPageSvg
            // update the svg field for each appropriate page in the firebase db
            updatePageSvg(canvasPagesClone[i - 1].id, newPageSvg)
          }
          break
        default:
          // change the corresponding page's svg in our cloned array
          canvasPagesClone[i - 1].svg = newPageSvg
          // update the svg field for each appropriate page in the firebase db
          updatePageSvg(canvasPagesClone[i - 1].id, newPageSvg)
      }
    }
    break
  case "apply-all":
    // change the corresponding page's svg in our cloned array
    // loop across all pages
    for (let i = 1; i <= totalPages; i++) {
      // for if a frequency is checked
      switch(frequency) {
        case "even":
          if (i % 2 === 0) {
            // change the corresponding page's svg in our cloned array
            canvasPagesClone[i - 1].svg = selectedPageSvg.outerHTML
            // update the svg field for each appropriate page in the firebase db
            updatePageSvg(canvasPagesClone[i - 1].id, newPageSvg)
          }
          break
        case "odd":
          if (i % 2 !== 0) {
            // change the corresponding page's svg in our cloned array
            canvasPagesClone[i - 1].svg = selectedPageSvg.outerHTML
            // update the svg field for each appropriate page in the firebase db
            updatePageSvg(canvasPagesClone[i - 1].id, newPageSvg)
          }
          break
        case "other":
          if (i % frequencyNum === 0) {
            // change the corresponding page's svg in our cloned array
            canvasPagesClone[i - 1].svg = selectedPageSvg.outerHTML
            // update the svg field for each appropriate page in the firebase db
            updatePageSvg(canvasPagesClone[i - 1].id, newPageSvg)
          }
          break
        default:
          // change the corresponding page's svg in our cloned array
          canvasPagesClone[i - 1].svg = selectedPageSvg.outerHTML
          // update the svg field for each appropriate page in the firebase db
          updatePageSvg(canvasPagesClone[i - 1].id, newPageSvg)
      }
    }
    break
  default:
    break
}
