import React, { useState, useRef } from "react"
import { colors, pageMargins } from "../../styles/variables"
import { convertToMM, convertToIn, convertFloatFixed } from "../../utils/helper-functions"
import { useFirebaseContext } from "../../utils/auth"
import { ref, get, query, orderByChild, equalTo, set, push } from "firebase/database"
import { spacing } from "../../styles/variables"
import { jsPDF } from 'jspdf'
import JSZip from "jszip"
import ceach from "concurrent-each"
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import 'svg2pdf.js'

import { Section, SectionMain, SectionContent } from "../../components/layout/Section"
import { Container, Col, Row } from "react-grid-system"
import Button from "../ui/Button"
import Progress from "../ui/Progress"
import { Modal, ModalContent, ModalHeader, ModalFooter } from "../ui/Modal"
import Content from "../ui/Content"
import Layout from "../layout/Layout"

const notebookSizes = [
  "A5",
]

const AdminDashboard = () => {
  const abortRef = useRef(false)
  const { firebaseDb } = useFirebaseContext()
  // const [activeOrderType, setActiveOrderType] = useState("unprinted")
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [zipped, setZipped] = useState(0)
  const [toBeZipped, setToBeZipped] = useState(0)
  const [activeBookSize, setActiveBookSize] = useState("")
  const [downloadPct, setDownloadPct] = useState(0)
  const [erroredFiles, setErroredFiles] = useState([])
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
        default:
          console.log("?")
      }
    })
  }

  const countTime = () => {
    // Increase the seconds count by 1
    setTimeElapsed(prevSeconds => prevSeconds + 1000);
  };

  // this function will run once per orderItem and will download all the pages for that orderItem
  const zipCustomBook = async (pages, pageData, dimension, bookPdf) => {
    console.log("Generating a custom book pdf...")
    const { numOfPages, width } = pageData
    const { bookWidth, bookHeight, svgWidth, svgHeight } = dimension
    const widthOffset = convertToMM(width)
    let queriedPages = {}
    let parsedPages = []

    console.log("Parsing custom book's pages...")
    for (let i = 0; i < numOfPages; i++) {
      const page = pages[i]
      const { pageId, pageNumber } = page

      // if we've already parsed this pageId, just add a duplicate to the array
      if (queriedPages[pageId]) {
        const queriedPage = queriedPages[pageId]
        const { svg, margin } = queriedPage

        parsedPages.push({
          pageId: pageId,
          pageNumber: pageNumber,
          svg: svg,
          margin: {...margin},
        })
      }
      // otherwise we need to query the db for the page's data
      else {
        await get(ref(firebaseDb, `pages/${pageId}`)).then(snapshot => {
          if (snapshot.exists()) {
            const bookPage = snapshot.val()
            const { svg, marginBottom, marginLeft, marginRight, marginTop } = bookPage

            queriedPages[pageId] = {
              pageId: pageId,
              pageNumber: pageNumber,
              margin: {
                bottom: marginBottom,
                left: marginLeft,
                right: marginRight,
                top: marginTop,
              },
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
        bookPdf.setPage(pageNumber + 2)

        const pageNode = parseSvgNode(svg)
        const templateSide = pageNode.getAttribute("id").split("-")[0]
        let coords = {
          x: convertToMM(pageNode.getAttribute("x")),
          y: convertToMM(pageNode.getAttribute("y")),
        }
        const { minimum, holes } = pageMargins
        const holesMargin = convertToMM(holes)
        const minimumMargin = convertToMM(minimum)

        // need to make adjustments to the x coordinates to account for left and right page differences
        // right-side template's x coordinates have holes offset AND left margin baked in
        // but they also have been offset by the width of the book
        if (templateSide === "right") {
          if (pageNumber % 2 === 0) {
            // need to offset the x coordinate by the width of the book/page
            // left pages should have the holes offset removed and the minimum margin added (holes contains min)
            coords.x = convertFloatFixed(coords.x - widthOffset - holesMargin + minimumMargin, 2)
          }
          else {
            // right pages just need to be offset by the width of the book/page
            coords.x = convertFloatFixed(coords.x - widthOffset, 2)
          }
        }
        // left-side template's x coordinates have user-inputted left margin and minimum left margin baked in
        // left pages do not need any adjustments
        else {
          // right pages need to swap minimum left margin with holes offset
          if (pageNumber % 2 !== 0) {
            coords.x = convertFloatFixed(coords.x - page.marginLeft + holesMargin - minimumMargin, 2)
          }
        }
        
        const pagePct = convertFloatFixed((pageNumber / numOfPages) * 100)

        await bookPdf.svg(pageNode, {
          x: convertToMM(pageNode.getAttribute("x")),
          y: convertToMM(pageNode.getAttribute("y")),
          width: svgWidth,
          height: svgHeight,
        }).then(async () => {
          setDownloadPct(pagePct)
          if (abortRef.current) {
            console.log("Aborting download...")
            ceach.loop.exit()
          }
        })
      }
    )
  }

  const zipStandardBook = async (numOfPages, pageData, dimension, bookPdf) => {
    const { bookWidth, bookHeight, svgWidth, svgHeight } = dimension

    const leftPage = pageData.leftPageData.svg
    const rightPage = pageData.rightPageData.svg
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
        bookPdf.setPage(page + 3)
        const pagePct = convertFloatFixed((page / numOfPages) * 100)

        if (page % 2 === 0) {
          await bookPdf.svg(rightPageNode, {
            x: leftCoords.x,
            y: leftCoords.y,
            width: svgWidth,
            height: svgHeight,
          }).then(() => {
            setDownloadPct(pagePct)
          })
        }
        else {
          await bookPdf.svg(leftPageNode, {
            x: rightCoords.x,
            y: rightCoords.y,
            width: svgWidth,
            height: svgHeight,
          }).then(() => {
            setDownloadPct(pagePct)
          })
        }
      }
    )
  }

  const zipBooks = async (size) => {
    const booksZip = new JSZip()
    // Start the timer interval
    const timerInterval = setInterval(countTime, 1000);

    // query the db for all unprinted order items
    console.log("Getting all unprinted order items...")

    get(query(ref(firebaseDb, "orderItems/"), orderByChild("printed"), equalTo(false))).then(async snapshot => { 
      if (snapshot.exists()) {
        const unprintedOrders = snapshot.val()
        console.log("🚀 ~ get ~ unprintedOrders:", unprintedOrders)
        // filter orders by activeBookSize (A5)
        const filteredOrders = Object.values(unprintedOrders).filter(order => order.size === size)
        // sort orders by date paid
        const sortedOrders = filteredOrders.sort((a, b) => a.datePaid - b.datePaid)
        // total number of orders that need to be zipped and printed
        const numOfOrders = sortedOrders.length
        setToBeZipped(numOfOrders)

        // loop through all orders and create a pdf for each
        for (let i = 0; i < numOfOrders; i++) {
          const pageData = sortedOrders[i]
          const { numOfPages, height, width, pages, orderId, quantity, id } = pageData
          const dimension = {
            svgWidth: convertFloatFixed(convertToMM(width) - 13.335, 2), // subtract margins
            svgHeight: convertFloatFixed(convertToMM(height) - 6.35, 2), // subtract margins
            bookWidth: convertToMM(width),
            bookHeight: convertToMM(height),
            bookWidthInch: convertToIn(width),
            bookHeightInch: convertToIn(height),
          }
          const bookPdf = new jsPDF()
          const slipPage = `<svg xmlns="http://www.w3.org/2000/svg" id="slip-page" width=${width} height=${height} viewBox="0 0 ${width} ${height}"><text x="12" y=${height - 18} font-size="12">${orderId}</text><rect x=${width - 12} y=${height - 12} width="12" height="12" fill="#000"></rect></svg>`
          const slipPageNode = parseSvgNode(slipPage)
          bookPdf.deletePage(1)
          // add a blank sheet in the beginning of the notebook
          bookPdf.addPage([dimension.bookWidth, dimension.bookHeight], "portrait")
          // need two pages to make one sheet!
          bookPdf.addPage([dimension.bookWidth, dimension.bookHeight], "portrait")
          bookPdf.setPage(1)

          // if there is a bookId, there are custom pages we have to fetch
          if (pageData.bookId) {
            // query the db for the book's page ids
            await zipCustomBook(pages, pageData, dimension, bookPdf)
          }
          else {
            await zipStandardBook(numOfPages, pageData, dimension, bookPdf)
          }


          // add the slip page to the end of the book
          bookPdf.addPage([dimension.bookWidth, dimension.bookHeight], "portrait")
          bookPdf.addPage([dimension.bookWidth, dimension.bookHeight], "portrait")
          bookPdf.setPage(numOfPages + 4) 

          await bookPdf.svg(slipPageNode, {
            x: 0,
            y: 0,
            width: dimension.bookWidth,
            height: dimension.bookHeight,
          }).then(async () => {
            setZipped(i)

            try {
              booksZip.file(`${id} - (${quantity}).pdf`, bookPdf.output('blob'))
              // await set(ref(firebaseDb, `orderItems/${id}/printed`), true)
            } catch(error) {
              console.log(`Could not add pdf to zip file: ${id}`)
              setErroredFiles(prev => [...prev, id])
            }
          })

        }

        await booksZip.generateAsync({ type: 'blob' }).then(function (content) {
          console.log("Downloading zip file...")
          clearInterval(timerInterval)
          setDownloadPct(0)
          setToBeZipped(0)
          setZipped(0)
          setTimeElapsed(0)
          abortRef.current = false
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

  // const handleGetOrders = (child, value, type) => {
  //   setActiveOrderType(type)
  //   getOrders(child, value, type)
  // }
  
  const addToEarlyAccess = () => {
    const email = prompt("Enter user's email")
    if (email) {
      const key = push(ref(firebaseDb, 'earlyAccess')).key
      const earlyAccessRef = ref(firebaseDb, `earlyAccess/${key}`)

      set(earlyAccessRef, {
        email: email,
        referrals: 3,
      }).then(() => {
        toast.success(`${email} added to early access list!`)
      })
    }
  }

  return (
    <Layout>
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
                    }}
                    margin="0 16px 0 0"
                  >
                    Download unprinted books
                  </Button>
                  <Button
                    onClick={() => addToEarlyAccess()}
                    margin="0 16px 0 0"
                  >
                    Add user to early access
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
                {toBeZipped > 0 && (
                  <Content
                    margin="0 0 16px"
                  >
                    <Progress
                      wrappercolor={colors.gray.twoHundred}
                      barcolor={colors.gray.nineHundred}
                      completion={downloadPct}
                    />
                    <p>
                      {downloadPct}% ({zipped} of {toBeZipped}) {convertTime(timeElapsed)}
                    </p>
                  </Content>
                )}
                <ModalFooter
                  justify="flex-end"
                >
                  <Button
                    onClick={() => {
                      setShowModal({ show: false })
                      abortRef.current = true
                    }}
                    margin="0 8px 0 0"
                    backgroundcolor={colors.gray.oneHundred}
                    color={colors.gray.nineHundred}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={!activeBookSize}
                    onClick={() => {
                      zipBooks(activeBookSize)
                      abortRef.current = false
                    }}
                  >
                    Download
                  </Button>
                </ModalFooter>
              </Modal>
            )}
          </SectionContent>
        </Section>
      </SectionMain>
    </Layout>
  )
}

export default AdminDashboard