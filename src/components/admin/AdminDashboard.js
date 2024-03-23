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
const { minimum, holes } = pageMargins
const holesMargin = convertToMM(holes)
const minimumMargin = convertToMM(minimum)
const rightPageMargin = convertFloatFixed(holesMargin, 2)

const AdminDashboard = () => {
  const abortRef = useRef(false)
  const { firebaseDb } = useFirebaseContext()
  // const [activeOrderType, setActiveOrderType] = useState("unprinted")
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [zipped, setZipped] = useState(0)
  const [toBeZipped, setToBeZipped] = useState(0)
  const [activeBookSize, setActiveBookSize] = useState("")
  const [downloadPct, setDownloadPct] = useState(0)
  const [ordersToShip, setOrdersToShip] = useState([])
  const [erroredFiles, setErroredFiles] = useState([])
  const [itemsToPrint, setItemsToPrint] = useState([])
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

  const generateSlipText = (data) => {
    const { coverColor, quantity } = data
    const abbrv = coverColor.charAt(0).toUpperCase()

    return `-${abbrv}-${quantity}`
  }


  const zipBooks = async (size) => {
    const booksZip = new JSZip()
    // Start the timer interval
    const timerInterval = setInterval(countTime, 1000)

    console.log("Getting all unprinted order items...")
    
    // query the db for all unprinted order items
    get(query(ref(firebaseDb, "orderItems/"), orderByChild("printed"), equalTo(false))).then(async snapshot => {
      if (snapshot.exists()) {
        const unprintedOrders = snapshot.val()
        // filter orders by activeBookSize
        const filteredOrders = Object.values(unprintedOrders).filter(order => order.size === size)
        // sort orders by date paid
        const sortedOrders = filteredOrders.sort((a, b) => a.orderId - b.orderId)
        console.log("🚀 ~ get ~ sortedOrders:", sortedOrders)
        // total number of orders that need to be zipped and printed
        const numOfOrders = sortedOrders.length
        let prevOrderItem = {
          id: "",
          number: 1,
        }
        let newItemsToPrint = []
        let newOrdersToShip = []

        setToBeZipped(numOfOrders)

        // loop through all orders and create a pdf for each
        for (let i = 0; i < numOfOrders; i++) {
          const pageData = sortedOrders[i]
          const { numOfPages, height, width, pages, orderId, orderIdDb, rateId, shipmentId, quantity, id } = pageData
          const dimension = {
            svgWidth: convertFloatFixed(convertToMM(width) - 13.335, 2), // subtract margins
            svgHeight: convertFloatFixed(convertToMM(height) - 6.35, 2), // subtract margins
            bookWidth: convertToMM(width),
            bookHeight: convertToMM(height),
            bookWidthInch: convertToIn(width),
            bookHeightInch: convertToIn(height),
          }
          const pageDimensions = [dimension.bookWidth, dimension.bookHeight]
          const bookPdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
          })
          // delete the page that was added by default
          bookPdf.deletePage(1)
          // add a blank sheet in the beginning of the notebook
          bookPdf.addPage(pageDimensions, "portrait")
          bookPdf.addPage(pageDimensions, "portrait")

          // if there is a bookId, there are custom pages we have to fetch
          if (pageData.bookId) {
            // query the db for the book's page ids
            await zipCustomBook(pages, pageData, dimension, bookPdf)
            bookPdf.addPage(pageDimensions, "portrait")
          }
          else {
            await zipStandardBook(numOfPages, pageData, dimension, bookPdf)
          }

          const slipPage = bookPdf.addPage(pageDimensions, "portrait").setFontSize(8)
          slipPage.setFillColor(0,0,0).rect(dimension.bookWidth - 3.175, dimension.bookHeight - 3.175, 3.175, 3.175, "F")
          slipPage.setTextColor(158, 158, 158).text(`${orderId}${generateSlipText(pageData)}`, 3.175, dimension.bookHeight - 3.175)

          // increment zipped number
          setZipped(i + 1)

          try {
            let fileName = `${orderId} - (${quantity})`
            let fileNameString = `-${dimension.bookWidthInch}x${dimension.bookHeightInch}-(${quantity})`

            if (prevOrderItem.id === orderId) {
              prevOrderItem.number++
              fileName = `${orderId}[${prevOrderItem.number}]${fileNameString})`
            }
            else {
              fileName = `${orderId}[1]${fileNameString})`
              prevOrderItem.id = orderId
              prevOrderItem.number = 1
            }

            // add the pdf to the zip file
            booksZip.file(`${fileName}.pdf`, bookPdf.output('blob')) 

            // find if an object with {rateId: rateId} equal to rateId exists in newOrdersToShip
            const orderExists = newOrdersToShip.some(order => order.rateId === rateId)

            // if it doesn't exist, add it to the array
            if (!orderExists) {
              newOrdersToShip.push({ rateId: rateId, orderId: orderIdDb, shipmentId: shipmentId})
            }

            // add the order item to state so we can update the db later
            newItemsToPrint.push(id)
          } catch (error) {
            console.log(`Could not add pdf to zip file: ${orderId}`)
            setErroredFiles(prev => [...prev, id])
          }
        }

        setItemsToPrint(newItemsToPrint)
        setOrdersToShip(newOrdersToShip)

        // if we've zipped all the orders, download the zip file
        await booksZip.generateAsync({ type: 'blob' }).then(function (content) {
          console.log("Downloading zip file...")
          clearInterval(timerInterval)
          setDownloadPct(0)
          setToBeZipped(0)
          setZipped(0)
          setTimeElapsed(0)
          abortRef.current = false
          saveAs(content, `${new Date().toISOString().slice(0, 10)}.zip`);
        }).then(() => {
          newItemsToPrint.forEach(item => {
            set(ref(firebaseDb, `orderItems/${item}/printed`), "printing")
          })
        })
      }
      else {
        console.log("No unprinted orders found")

        toast.error("No unprinted orders found")
      }
    }).catch(error => {
      console.log(error)
      toast.error(error)
    })
  }

  // this function will run once per orderItem and will download all the pages for that orderItem
  const zipCustomBook = async (pages, pageData, dimension, bookPdf) => {
    console.log("Generating a custom book pdf...")
    const { numOfPages } = pageData
    const { bookWidth, bookHeight } = dimension
    let queriedPages = {}
    let parsedPages = []

    console.log("Parsing custom book's pages...")
    for (let i = 0; i < numOfPages; i++) {
      const page = pages[i]
      const { pageId, pageNumber } = page

      // if we've already parsed this pageId, just add a duplicate to the array
      if (queriedPages[pageId]) {
        const queriedPage = queriedPages[pageId]
        const { svg, margins } = queriedPage

        parsedPages.push({
          pageId: pageId,
          pageNumber: pageNumber,
          svg: svg,
          margins: {...margins},
        })
      }
      // otherwise we need to query the db for the page's data
      else {
        await get(ref(firebaseDb, `pages/${pageId}`)).then(snapshot => {
          if (snapshot.exists()) {
            const bookPage = snapshot.val()
            const { svg, marginBottom, marginLeft, marginRight, marginTop } = bookPage
            const margins = {
              bottom: marginBottom,
              left: marginLeft,
              right: marginRight,
              top: marginTop,
            }

            queriedPages[pageId] = {
              pageId: pageId,
              pageNumber: pageNumber,
              margins: margins,
              svg: svg,
            }

            parsedPages.push({
              pageId: pageId,
              pageNumber: pageNumber,
              svg: svg,
              margins: margins,
            })
          }
        })
      }
    }

    await ceach.loop(
      parsedPages,
      async (page) => {
        const { pageNumber, svg, margins } = page
        const pagePct = convertFloatFixed((pageNumber / numOfPages) * 100)

        bookPdf.setPage(pageNumber + 2)
        const currentPdfPage = bookPdf.addPage([bookWidth, bookHeight], "portrait")

        const pageNode = parseSvgNode(svg)
        const isLeftPage = pageNumber % 2 === 0
        let pageDimensions = {
          x: margins.left + (isLeftPage ? minimumMargin : holesMargin),
          y: margins.top + minimumMargin,
          width: convertToMM(pageNode.getAttribute("width")),
          height: convertToMM(pageNode.getAttribute("height")),
        }
        
        await bookPdf.svg(pageNode, {
          x: pageDimensions.x,
          y: pageDimensions.y,
          width: pageDimensions.width,
          height: pageDimensions.height,
        }).then(() => {
          // add page numbers
          const pageText = String(pageNumber)
          const textWidth = bookPdf.getTextWidth(pageText)

          currentPdfPage
            .setFontSize(6)
            .setFillColor(255,255,255)
            .rect(isLeftPage ? 3.175 : bookWidth - 3.175 - textWidth, dimension.bookHeight - 4.763, textWidth, 1.588, "F")
            .setTextColor(158,158,158)
            .text(String(pageNumber), isLeftPage ? 3.175 : bookWidth - 3.175, bookHeight - 3.969, {
              align: isLeftPage ? "left" : "right",
              baseline: "middle",
            })

          setDownloadPct(pagePct)
        
          if (abortRef.current) {
            console.log("Aborting download...")
            ceach.loop.exit()
          }
        })
      }
    )

    console.log("Done creating custom book PDF")
  }

  const zipStandardBook = async (numOfPages, pageData, dimension, bookPdf) => {
    const { bookWidth, bookHeight } = dimension
    const { leftPageData, rightPageData } = pageData
    const leftPage = pageData.leftPageData.svg
    const rightPage = pageData.rightPageData.svg
    // turn svg strings into DOM nodes
    const leftPageNode = parseSvgNode(leftPage)
    const rightPageNode = parseSvgNode(rightPage)
    const leftDimension = {
      x: leftPageData.pageData.marginLeft + minimumMargin,
      y: leftPageData.pageData.marginTop + minimumMargin,
      width: convertToMM(leftPageNode.getAttribute("width")),
      height: convertToMM(leftPageNode.getAttribute("height")),
    }
    const rightDimension = {
      x: rightPageData.pageData.marginLeft + rightPageMargin,
      y: rightPageData.pageData.marginTop + minimumMargin,
      width: convertToMM(rightPageNode.getAttribute("width")),
      height: convertToMM(rightPageNode.getAttribute("height")),
    }
    const pages = Array.from(Array(numOfPages).keys())
    // add an additional page because I can't figure out why there's always a blank page at the end
    const addtlPage = numOfPages + 1
    pages.push({ addtlPage: addtlPage })

    await ceach.forEach(
      pages,
      async (page) => {
        const realPageNumber = page + 3
        bookPdf.setPage(page + 2)
        bookPdf.addPage([bookWidth, bookHeight], "portrait")
        let pagePct = convertFloatFixed(((page + 1) / numOfPages) * 100)
        if (isNaN(pagePct)) {
          pagePct = 100
        }

        if (realPageNumber % 2 === 0) {
          await bookPdf.svg(leftPageNode, {
            x: leftDimension.x,
            y: leftDimension.y,
            width: leftDimension.width,
            height: leftDimension.height,
          }).then(() => {
            setDownloadPct(pagePct)
          })
        }
        else {
          await bookPdf.svg(rightPageNode, {
            x: rightDimension.x,
            y: rightDimension.y,
            width: rightDimension.width,
            height: rightDimension.height,
          }).then(() => {
            setDownloadPct(pagePct)
          })
        }
      }
    )

    console.log("Done creating book PDF")
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

  // run this function only when printing books have been printed
  const printBooks = () => {
    console.log("Setting unprinted books to printed...")

    // query db for all printing order items
    get(query(ref(firebaseDb, "orderItems/"), orderByChild("printed"), equalTo("printing"))).then(snapshot => {
      if (snapshot.exists()) {
        const itemsToPrint = snapshot.val()
        const orderItems = Object.keys(itemsToPrint)

        orderItems.forEach(item => {
          set(ref(firebaseDb, `orderItems/${item}/printed`), true)
        })

        toast.success("Books have been set to printed!")
      }
      else {
        throw "No printing books found."
      }
    }).catch(error => {
      console.log(error)
      toast.error(error)
    })
  }

  const purchaseLabels = async () => {
    console.log("Purchasing and creating shipping labels...")
    console.log(ordersToShip)

    await fetch("/.netlify/functions/create-shipping-batch", {
      method: "POST",
      body: JSON.stringify({
        orders: ordersToShip,
      }),
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
    })
    .catch(error => {
      console.error("Error:", error)
    })
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
                    onClick={() => printBooks()}
                    margin="0 16px 0 0"
                  >
                    Set printing books to printed
                  </Button>
                  <Button
                    onClick={() => purchaseLabels()}
                    margin="0 16px 0 0"
                  >
                    Purchase and create shipping labels
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Content>
                    {itemsToPrint.length > 0 && (
                      <>
                        {itemsToPrint.map(item => (
                          <p>
                            {item}
                          </p>
                        ))}
                      </>
                    )}
                  </Content>
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
                      {downloadPct}% ({zipped} / {toBeZipped}) {convertTime(timeElapsed)}
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