import React, { useState } from "react"
import { colors, convertToMM, convertFloatFixed } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"
import { ref, get, query, orderByChild, equalTo, set, onValue } from "firebase/database"
import { spacing } from "../../styles/variables"
import { jsPDF } from 'jspdf'
import JSZip from "jszip"
import ceach from "concurrent-each"
import { saveAs } from 'file-saver'
import 'svg2pdf.js'

import { Section, SectionMain, SectionContent } from "../../components/layout/Section"
import { Container, Col, Row } from "react-grid-system"
import Button from "../ui/Button"
import Progress from "../ui/Progress"
import { Modal, ModalContent, ModalHeader, ModalFooter } from "../ui/Modal"
import Content from "../ui/Content"

const notebookSizes = [
  "A5",
]

const AdminDashboard = () => {
  const { firebaseDb } = useFirebaseContext()
  const [activeOrderType, setActiveOrderType] = useState("unprinted")
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [downloaded, setDownloaded] = useState(0)
  const [cancelDownload, setCancelDownload] = useState(false)
  const [toBeDownloaded, setToBeDownloaded] = useState(0)
  const [activeBookSize, setActiveBookSize] = useState("")
  const [downloadPct, setDownloadPct] = useState(0)
  const [showModal, setShowModal] = useState({
    show: false
  })

  const getOrders = (child, value, type) => {
    const ordersRef = ref(firebaseDb, "orders/")

    get(query(ordersRef, orderByChild(child), equalTo(value))).then(snapshot => {
      const ordersArray = []
      // push them into an array const
      snapshot.forEach(order => {
        ordersArray.push(order.val())
      })

      switch(type) {
        case "unprinted":
          break
      }
    })
  }

  const countTime = () => {
    // Increase the seconds count by 1
    setTimeElapsed(prevSeconds => prevSeconds + 1000);
  };

  const getBookPages = (bookId) => {
    const pages = get(ref(firebaseDb, `books/${bookId}/pages`)).then(snapshot => {
      if (snapshot.exists()) {
        console.log("WE GOT ALL PAGES")
        // an array of all pages {pageid: "", pagenum: ""} where pageId points to a unique page
        return snapshot.val()
      }
    })

    return pages
  }

  const downloadCustomBooks = async (pages, values, dimension, bookNum, booksZip, bookPdf) => {
    const { id, pid, numOfPages, width, height } = values
    const { bookWidth, bookHeight } = dimension
    const widthOffset = convertToMM(width)
    const iterationsPerChunk = numOfPages
    let queriedPages = {}

    for (let i = 0; i < numOfPages; i++) {
      if (i && i % iterationsPerChunk === 0) {
        console.log("await")
        await oneMoment();
      }

      const page = pages[i]
      const { pageId, pageNumber } = page
      let queriedPage = queriedPages[pageId]
      console.log(queriedPages)
      bookPdf.addPage([bookWidth, bookHeight], "portrait")
      bookPdf.setPage(page + 1)

      // if the page was already queried, use the svg from the queriedPages array
      if (queriedPage) {
        const pageNode = parseSvgNode(queriedPage.svg)
        const coords = {
          x: convertToMM(pageNode.getAttribute("x")),
          y: convertToMM(pageNode.getAttribute("y")),
        }
        const pagePct = convertFloatFixed((queriedPage.pageNumber / numOfPages) * 100)

        await bookPdf.svg(pageNode, {
          x: coords.x - widthOffset,
          y: coords.y,
          width: bookWidth,
          height: bookHeight,
        }).then(() => {
          setDownloadPct(pagePct)
          console.log("adding page ", pageNumber)
          if (pageNumber === numOfPages) {
            setDownloadPct(100)
            setDownloaded(bookNum + 1)
            console.log("zipping book")
            booksZip.file(`${pid}(${id}).pdf`, bookPdf.output('blob'))
            // await set(firebaseDb, `orderItems/${id}/printed`, true)
          }
        })
      }
      else {
        // query the db for the page's svg
        const svg = await get(ref(firebaseDb, `pages/${pageId}`)).then(snapshot => {
          if (snapshot.exists()) {
            const bookPage = snapshot.val()
            const { svg } = bookPage
            console.log("querying page")

            queriedPages[pageId] = {
              pageId: pageId,
              pageNumber: pageNumber,
              svg: svg,
            }

            return svg
          }
        })

        const pageNode = parseSvgNode(svg)
        const coords = {
          x: convertToMM(pageNode.getAttribute("x")),
          y: convertToMM(pageNode.getAttribute("y")),
        }
        console.log(coords)
        const pagePct = convertFloatFixed((pageNumber / numOfPages) * 100)

        await bookPdf.svg(pageNode, {
          x: coords.x,
          y: coords.y,
          width: bookWidth,
          height: bookHeight,
        }).then(() => {
          setDownloadPct(pagePct)
          if (pageNumber === numOfPages) {
            setDownloadPct(100)
            setDownloaded(bookNum)
            console.log("zipping book")
            booksZip.file(`${pid}(${id}).pdf`, bookPdf.output('blob'))
            // await set(firebaseDb, `orderItems/${id}/printed`, true)
          }
        })
      }
    }
  }

  const downloadStandardBooks = async (numOfPages, values, dimension, bookNum, booksZip, bookPdf) => {
    const { id, pid } = values
    const { bookWidth, bookHeight } = dimension
    const iterationsPerChunk = numOfPages

    const leftPage = values.leftPageData.svg
    const rightPage = values.rightPageData.svg
    // turn svg strings into DOM nodes
    const leftPageNode = parseSvgNode(leftPage)
    const rightPageNode = parseSvgNode(rightPage)
    const leftCoords = {
      x: convertToMM(leftPageNode.getAttribute("x")),
      y: convertToMM(leftPageNode.getAttribute("y")),
    }
    const rightCoords = {
      x: convertToMM(rightPageNode.getAttribute("x")),
      y: convertToMM(rightPageNode.getAttribute("y")),
    }

    // turn svg strings into DOM nodes
    for (let i = 0; i < numOfPages; i++) {
      if (i && i % iterationsPerChunk === 0) {
        console.log("await")
        await oneMoment();
      }

      const page = i
      bookPdf.addPage([bookWidth, bookHeight], "portrait")
      bookPdf.setPage(page + 1)
      const pagePct = convertFloatFixed((page / numOfPages) * 100)

      if (page % 2 === 0) {
        await bookPdf.svg(rightPageNode, {
          x: rightCoords.x,
          y: rightCoords.y,
          width: bookWidth,
          height: bookHeight,
        }).then(() => {
          setDownloadPct(pagePct)
        })
      }
      else {
        await bookPdf.svg(leftPageNode, {
          x: leftCoords.x,
          y: leftCoords.y,
          width: bookWidth,
          height: bookHeight,
        }).then(async () => {
          setDownloadPct(pagePct)
          if (page === numOfPages - 1) {
            try {
              setDownloadPct(100)
              setDownloaded(bookNum)
              booksZip.file(`${pid}(${id}).pdf`, bookPdf.output('blob'))
              await set(ref(firebaseDb, `orderItems/${id}/printed`), true)
            } catch (error) {
              console.log(error)
            }
          }
        })
      }
    }
  }

  const oneMoment = () => {
    return new Promise(resolve => setTimeout(resolve))
  }

  const downloadBooks = async (size) => {
    const booksZip = new JSZip()
    // const startTime = new Date().getTime()
    // Start the timer interval
    const timerInterval = setInterval(countTime, 1000);

    // query the db for all unprinted order items
    get(query(ref(firebaseDb, "orderItems/"), orderByChild("printed"), equalTo(false))).then(async snapshot => { 
      if (snapshot.exists()) {
        console.log("RETRIEVED ORDERS")
        const unprintedOrders = snapshot.val()
        // filter orders by activeBookSize
        const filteredOrders = Object.values(unprintedOrders).filter(order => order.size === size)
        const numOfOrders = filteredOrders.length
        setToBeDownloaded(numOfOrders)

        // loop through each order and create a pdf for each
        for (let i = 0; i < numOfOrders; i++) {
          const values = filteredOrders[i]
          const { numOfPages, pid, id, height, width } = values
          const bookWidth = convertFloatFixed(convertToMM(width) - 13.335, 2)
          const bookHeight = convertFloatFixed(convertToMM(height) - 6.35, 2)
          const dimension = {
            bookWidth: bookWidth,
            bookHeight: bookHeight,
          }
          const bookPdf = new jsPDF({
            compress: true,
          })
          bookPdf.deletePage(1)

          // if there is a bookId, there are custom pages we have to fetch
          if (values.bookId) {
            console.log("WE GOT A CUSTOM BOOK ID")
            const { bookId } = values                
            let queriedPages = {}
            // query the db for the book's page ids
            const pages = await getBookPages(bookId)
            await downloadCustomBooks(pages, values, dimension, i, booksZip, bookPdf)
          }
          else {
            await downloadStandardBooks(numOfPages, values, dimension, i, booksZip, bookPdf)
          }
        }

        booksZip.generateAsync({ type: 'blob' }).then(function (content) {
          console.log("downloading zip")
          clearInterval(timerInterval)
          saveAs(content, `${new Date().toISOString().slice(0, 10)}.zip`);
        })
      }
    }).catch(error => {
      console.log(error)
    })
  }

  // convert ms to hh:mm:ss, removing leading zeros and adding h m s
  const convertTime = (ms) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const time =
      (hours !== 0 ? `${hours}h ` : '') +
      (minutes !== 0 ? `${minutes % 60}m ` : '') +
      `${seconds % 60}s`

    return time
  }

  const parseSvgNode = (svg) => {
    const svgNode = new DOMParser().parseFromString(svg, 'text/html').body.firstElementChild
    return svgNode
  }

  const handleGetOrders = (child, value, type) => {
    setActiveOrderType(type)
    getOrders(child, value, type)
  }

  return (
    <SectionMain
      className="has-max-height"
    >
      <Section>
        <SectionContent
          padding={spacing.normal}
        >
          <Container>
            <Row>
              <Col>
                <Button
                  onClick={() => {
                    setShowModal({ show: true })
                    setDownloadPct(0)
                    setToBeDownloaded(0)
                    setTimeElapsed(0)
                    setCancelDownload(false)
                  }}
                  margin="0 16px 0 0"
                >
                  Download unprinted books
                </Button>
                <Button
                  onClick={async () => {
                    await get(query(ref(firebaseDb, `orderItems`), orderByChild("bookId"), equalTo("-NXGH-wCHBUVLT_03ImM"))).then(snapshot => {
                      console.log(snapshot.val())
                    })
                  }}
                  margin="0 16px 0 0"
                >
                  Shipping errors
                </Button>
                <Button
                  onClick={() => handleGetOrders("shipped", false, "unprinted")}
                  margin="0 16px 0 0"
                >
                  Shipped orders
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
              </Col>
            </Row>
          </Container>
          {showModal.show && (
            <Modal
              setShowModal={setShowModal}
            >
              <ModalHeader>
                Choose book size
              </ModalHeader>
              <ModalContent>
                {notebookSizes.map((size, index) => (
                  <Button
                    key={size}
                    onClick={() => setActiveBookSize(notebookSizes[index])}
                    margin="0 16px 0 0"
                    backgroundcolor={activeBookSize === notebookSizes[index] ? colors.gray.nineHundred : colors.gray.oneHundred}
                    color={activeBookSize === notebookSizes[index] ? colors.gray.oneHundred : colors.gray.nineHundred}
                  >
                    {size}
                  </Button>
                ))}
              </ModalContent>
              {toBeDownloaded > 0 && (
                <Content
                  margin="0 0 16px"
                >
                  <Progress
                    wrappercolor={colors.gray.twoHundred}
                    barcolor={colors.gray.nineHundred}
                    completion={downloadPct}
                  />
                  <p>
                    {downloadPct}% ({downloaded} of {toBeDownloaded}) {convertTime(timeElapsed)}
                  </p> 
                </Content>
              )}
              <ModalFooter
                justifycontent="flex-end"
              >
                <Button
                  onClick={() => {
                    setShowModal({ show: false })
                    setCancelDownload(true)
                  }}
                  margin="0 8px 0 0"
                  backgroundcolor={colors.gray.oneHundred}
                  color={colors.gray.nineHundred}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!activeBookSize}
                  onClick={() => downloadBooks(activeBookSize)}
                >
                  Download
                </Button>
              </ModalFooter>
            </Modal>
          )}
        </SectionContent>
      </Section>
    </SectionMain>
  )
}

export default AdminDashboard