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
        console.log("Querying for book's pages...")
        // an array of all pages {pageid: "", pagenum: ""} where pageId points to a unique page
        return snapshot.val()
      }
    })

    return pages
  }

  // this function will run once per orderItem and will download all the pages for that orderItem
  const zipCustomBook = async (pages, values, dimension, bookNum, booksZip, bookPdf) => {
    console.log("Generating a custom book pdf...")
    const { id, pid, numOfPages, width } = values
    console.log(id, pid)
    const { bookWidth, bookHeight, svgWidth, svgHeight } = dimension
    const widthOffset = convertToMM(width)
    let queriedPages = {}
    let parsedPages = []

    console.log("Parsing custom book's pages...")
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]
      const { pageId, pageNumber } = page

      if (queriedPages[pageId]) {
        parsedPages.push({
          pageId: pageId,
          pageNumber: pageNumber,
          svg: queriedPages[pageId].svg,
        })
      }
      else {
        await get(ref(firebaseDb, `pages/${pageId}`)).then(snapshot => {
          if (snapshot.exists()) {
            const bookPage = snapshot.val()
            const { svg } = bookPage

            queriedPages[pageId] = {
              pageId: pageId,
              pageNumber: pageNumber,
              svg: svg,
            }

            parsedPages.push({
              pageId: pageId,
              pageNumber: pageNumber,
              svg: svg,
            })
          }
        })
      }
    }

    console.log("Adding pages to pdf...")
    await ceach.loop(
      parsedPages,
      async (page) => {
        const { pageNumber, svg } = page
        bookPdf.addPage([bookWidth, bookHeight], "portrait")
        bookPdf.setPage(pageNumber)

        const pageNode = parseSvgNode(svg)
        const coords = {
          x: convertToMM(pageNode.getAttribute("x")),
          y: convertToMM(pageNode.getAttribute("y")),
        }
        const pagePct = convertFloatFixed((pageNumber / numOfPages) * 100)

        await bookPdf.svg(pageNode, {
          x: coords.x - widthOffset,
          y: coords.y,
          width: svgWidth,
          height: svgHeight,
        }).then(async () => {
          setDownloadPct(pagePct)

          if (pageNumber === numOfPages) {
            setDownloadPct(100)
            setDownloaded(bookNum + 1)
            console.log("Adding book pdf to zip file...")
            await booksZip.file(`${pid}(${id}).pdf`, bookPdf.output('blob'))
            // await set(firebaseDb, `orderItems/${id}/printed`, true)
          }
        })
      }
    )
  }

  const zipStandardBook = async (numOfPages, values, dimension, bookNum, booksZip, bookPdf) => {
    const { id, pid } = values
    const { bookWidth, bookHeight, svgWidth, svgHeight } = dimension

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
    const pages = Array.from(Array(numOfPages).keys())

    await ceach.forEach(
      pages,
      async (page) => {
        console.log(page)
        bookPdf.addPage([bookWidth, bookHeight], "portrait")
        bookPdf.setPage(page + 1)
        const pagePct = convertFloatFixed((page / numOfPages) * 100)

        if (page % 2 === 0) {
          await bookPdf.svg(rightPageNode, {
            x: rightCoords.x,
            y: rightCoords.y,
            width: svgWidth,
            height: svgHeight,
          }).then(() => {
            setDownloadPct(pagePct)
          })
        }
        else {
          await bookPdf.svg(leftPageNode, {
            x: leftCoords.x,
            y: leftCoords.y,
            width: svgWidth,
            height: svgHeight,
          }).then(async () => {
            setDownloadPct(pagePct)
            if (page === numOfPages - 1) {
              try {
                setDownloadPct(100)
                setDownloaded(bookNum)
                await booksZip.file(`${pid}(${id}).pdf`, bookPdf.output('blob'))
                // await set(ref(firebaseDb, `orderItems/${id}/printed`), true)
              } catch (error) {
                console.log(error)
              }
            }
          })
        }
      }
    )
  }

  const downloadBooks = async (size) => {
    const booksZip = new JSZip()
    // const startTime = new Date().getTime()
    // Start the timer interval
    const timerInterval = setInterval(countTime, 1000);

    // query the db for all unprinted order items
    get(query(ref(firebaseDb, "orderItems/"), orderByChild("printed"), equalTo(false))).then(async snapshot => { 
      if (snapshot.exists()) {
        const unprintedOrders = snapshot.val()
        // filter orders by activeBookSize
        const filteredOrders = Object.values(unprintedOrders).filter(order => order.size === size)
        const numOfOrders = filteredOrders.length
        setToBeDownloaded(numOfOrders)

        // loop through each order and create a pdf for each
        for (let i = 0; i < numOfOrders; i++) {
          const values = filteredOrders[i]
          const { numOfPages, height, width } = values
          const dimension = {
            svgWidth: convertFloatFixed(convertToMM(width) - 13.335, 2),
            svgHeight: convertFloatFixed(convertToMM(height) - 6.35, 2),
            bookWidth: convertToMM(width),
            bookHeight: convertToMM(height),
          }
          const bookPdf = new jsPDF({
            compress: true,
          })
          bookPdf.deletePage(1)

          // if there is a bookId, there are custom pages we have to fetch
          if (values.bookId) {
            // query the db for the book's page ids
            const pages = await getBookPages(values.bookId)
            await zipCustomBook(pages, values, dimension, i, booksZip, bookPdf)
          }
          else {
            // await zipStandardBook(numOfPages, values, dimension, i, booksZip, bookPdf)
          }
        }

        await booksZip.generateAsync({ type: 'blob' }).then(function (content) {
          console.log("Downloading zip file...")
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