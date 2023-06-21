import { convertToMM } from '../../styles/variables'
import { jsPDF } from 'jspdf'
import JSZip from "jszip"
import { saveAs } from 'file-saver'
import 'svg2pdf.js'

// put this in your component
// const worker = new Worker(new URL('./Admin.worker.js', import.meta.url));

// worker.postMessage({
//   values: values
// })
// worker.onmessage = (e) => {
//   console.log(e.data)
// }

onmessage = async (e) => {
  console.log(e.data)
  const zip = new JSZip()
  const { values } = e.data
  const startTime = new Date().getTime();
  const { printed, numOfPages, pid, id, height, width } = values
  
  if (!printed) {
    const bookWidth = convertToMM(width)
    const bookHeight = convertToMM(height)
    const newBook = new jsPDF({
      compress: true,
    })
    newBook.deletePage(1)

    if (values.bookId) {
      const { bookId } = values
      // get(ref(`books/${bookId}/pages`)).then(snapshot => {

      // })
    }
    else {
      const leftPage = values.leftPageData.svg
      const rightPage = values.rightPageData.svg
      // turn svg strings into DOM nodes
      const leftPageNode = new DOMParser().parseFromString(leftPage, 'text/html').body.firstElementChild
      const rightPageNode = new DOMParser().parseFromString(rightPage, 'text/html').body.firstElementChild
      // extract x and y coordinates from DOM nodes
      const leftCoords = {
        x: convertToMM(leftPageNode.getAttribute("x")),
        y: convertToMM(leftPageNode.getAttribute("y")),
      }
      const rightCoords = {
        x: convertToMM(rightPageNode.getAttribute("x")),
        y: convertToMM(rightPageNode.getAttribute("y")),
      }

      for (let i = 0; i < numOfPages; i++) {
        newBook.addPage([bookWidth, bookHeight], "portrait")
        newBook.setPage(i + 1)

        if (i % 2 === 0) {
          await newBook.svg(rightPageNode, {
            x: rightCoords.x,
            y: rightCoords.y,
            width: bookWidth - 13.335,
            height: bookHeight - 6.35,
          })
        }
        else {
          await newBook.svg(leftPageNode, {
            x: leftCoords.x,
            y: leftCoords.y,
            width: bookWidth - 13.335,
            height: bookHeight - 6.35,
          }).then(() => {
            if (i === numOfPages - 1) {
              try {
                zip.file(`${pid}(${id}).pdf`, newBook.output('blob'))
              } catch (error) {
                console.log(error)
              }
            }
          })
        }
      }
    }
  }
  

  zip.generateAsync({ type: 'blob' }).then(function (content) {
    console.log("zippin: ", content)
    saveAs(content, 'reports.zip');
  })

  postMessage({
    time: new Date().getTime() - startTime,
  })
}