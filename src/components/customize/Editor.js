import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import { fonts, pageMargins } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"
import { v4 as uuidv4 } from 'uuid'
import { ToastContainer, toast } from 'react-toastify'

import { Flexbox } from "../layout/Flexbox"
import { Controls } from "./Controls"
import ApplyTemplateModal from "./modals/ApplyTemplateModal"
import Canvas from "./Canvas"
import CheckLoginModal from "./modals/CheckLoginModal"
import CreateBookModal from "./modals/CreateBookModal"
import Functionsbar from "./bars/Functionsbar"
import Loader from "../misc/Loader"
import Pagebar from "./bars/Pagebar"
import Seo from "../layout/Seo"
import Book404 from "./Book404"

const Editor = ({ 
  bookId, 
  productData, 
  productImageData,
}) => {
  const { loading, user, firebaseDb } = useFirebaseContext()
  const [showModal, setShowModal] = useState({
    show: false,
    type: "",
  })
  const [bookData, setBookData] = useState({
    ...productData,
    coverColor: "",
    title: "",
  })
  const [pageData, setPageData] = useState({
    alignmentHorizontal: "center",
    alignmentVertical: "top",
    angle: 30,
    ascSpacing: 5,
    borderData: {
      sync: true,
      toggle: true,
      thickness: 0.088,
      opacity: 1,
    },
    columns: 27,
    columnSpacing: 5,
    dashedLineData: {
      sync: true,
      thickness: 0.088,
      opacity: 1,
      dashArray: "2 4 4 2",
      dashOffset: 0,
    },
    dscSpacing: 5,
    hexagonRadius: 1,
    lineWidth: 100,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    maxContentHeight: bookData.heightPixel - pageMargins.vertical,
    maxContentWidth: bookData.widthPixel - pageMargins.horizontal,
    opacity: 1,
    radius: 0.1,
    rows: 42,
    rowSpacing: 5,
    show: false,
    crossSize: 1,
    slantAngle: 55,
    slants: 20,
    slantSpacing: 5,
    spacing: 5,
    staffSpacing: 5,
    staves: 9,
    svgHeight: bookData.heightPixel,
    svgWidth: bookData.widthPixel,
    template: "",
    thickness: 0.088,
    xHeight: 5,
  })
  const [svgSize, setSvgSize] = useState({
    height: bookData.heightPixel - pageMargins.vertical,
    width: bookData.widthPixel - pageMargins.horizontal,
  })
  const [selectedPage, setSelectedPage] = useState(1)
  const [selectedPageSvg, setSelectedPageSvg] = useState("")
  const [canvasPages, setCanvasPages] = useState([])
  const [canvasPageTemplates, setCanvasPageTemplates] = useState({})
  const [noExistingBook, setNoExistingBook] = useState(null)
  const [initializing, setInitializing] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  // creates blank svgs
  function createBlankSvgs() {
    // create a unique id for a blank page
    const blankPageId = uuidv4()
    // create a page object id:svg(string) pair
    const demoPagesObject = {
      [blankPageId]: `<svg xmlns='http://www.w3.org/2000/svg'><rect width='${pageData.pageWidth}' height='${pageData.pageHeight}' fill='#fff'></rect></svg>`,
    }
    setCanvasPageTemplates(demoPagesObject)
    // blank array holds the svgs
    const pagesArray = []

    for (let i = 0; i < bookData.numOfPages; i++) {
      pagesArray.push({
        pageId: blankPageId,
        pageNumber: i + 1,
      })
    }

    // set canvasPages in state
    setCanvasPages(pagesArray)
    setInitializing(false)
  }

  useEffect(() => {
    // queries db for the book by bookId
    async function getBook() {
      // ref for the book using bookId in the URL
      await firebaseDb.ref(`books/${bookId}`).once("value").then(snapshot => {
        // if the book exists in the database
        if (snapshot.exists()) {
          const bookValues = snapshot.val()

          // validate that this book belongs to the current user
          if (user.uid === bookValues.uid) {
            // if the user uid and book uid match
            // set book in state
            setBookData(bookValues)
            // call getPages and send it the book's pages object
            getPages(bookValues.pages)
          }
          else {
            // else redirect the user to the generic editor page (based on the product they had selected)
            navigate(`/customize/${productData.slug}`)
          }
        }
        // if the book doesn't exist
        else {
          setNoExistingBook(true)
          setInitializing(false)
        }
      })
    }

    // query the db for pages using bookId
    async function getPages(bookPages) {
      const allTemplates = {} // dummy object to hold pages
      const allPages = [] // dummy array to hold all book pages

      // first, query db for all pages that have the same bookId
      await firebaseDb.ref(`pages/`).orderByChild("bookId").equalTo(bookId).once("value").then(snapshot => {
        // loop through each page
        snapshot.forEach(page => {
          const pageValue = page.val()
          const pageObject = {
            id: pageValue.id,
            svg: pageValue.svg,
            marginTop: pageValue.marginTop,
            marginRight: pageValue.marginRight,
            marginBottom: pageValue.marginBottom,
            marginLeft: pageValue.marginLeft,
          }

          // insert into pageTemplates with id:svg pair
          allTemplates[pageValue.id] = pageObject
        })
      })

      // loop through bookPages argument which is an object of all pages
      for (const page in bookPages) {
        allPages.push(bookPages[page])
      }

      setCanvasPageTemplates(allTemplates) // canvasPageTemplates holds all page templates
      setCanvasPages(allPages) // all canvasPages have a reference to a template page id
      setInitializing(false)
    }

    // first check if there is a user logged in because
    // users that are not logged in should not be able to access bookId's
    if (user) {
      // if there is a notebook ID in the URL we know the user is trying to access a specific book in the database
      // wait for all loading states to clear before calling getBook
      if (bookId) {
        setShowModal({
          show: false,
          type: "",
        })

        // fetch book based on bookId in URL
        getBook()
      }
      // if there is no bookId, prompt the user to create a new book in the db
      else {
        // show modal based on sign-in status
        setShowModal({
          show: true,
          type: "signedIn",
        })
        createBlankSvgs()
      }
    }
    // else we can create blank svgs
    else {
      if (!loading || !initializing) {
        createBlankSvgs()
        // show modal based on sign-in status
        setShowModal({
          show: user ? false : true,
          type: "notSignedIn",
        })
      }
    }

  }, [bookId, loading])

  if (loading || initializing) {
    return <Loader />
  }

  return (
    <>
      <Seo title={`${bookData.title}`} />
      {noExistingBook ? (
        <Book404 />
      ) : (
        <>
          <Functionsbar
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
            bookData={bookData}
            setBookData={setBookData}
            bookId={bookId}
          />
          <Flexbox
            flex="flex"
            height="calc(100vh - 56px)"
            justifycontent="space-between"
          >
            <Pagebar
              activeTab={activeTab}
              bookData={bookData}
              canvasPages={canvasPages}
              canvasPageTemplates={canvasPageTemplates}
              pageData={pageData}
              selectedPage={selectedPage}
              setActiveTab={setActiveTab}
              setPageData={setPageData}
              setSelectedPage={setSelectedPage}
            />
            <Canvas
              bookData={bookData}
              canvasPages={canvasPages}
              canvasPageTemplates={canvasPageTemplates}
              pageData={pageData}
              setSvgSize={setSvgSize}
              selectedPage={selectedPage}
              setPageData={setPageData}
              setSelectedPageSvg={setSelectedPageSvg}
            />
            <Controls
              activeTab={activeTab}
              bookData={bookData}
              canvasPages={canvasPages}
              pageData={pageData}
              productData={productData}
              productImageData={productImageData}
              setActiveTab={setActiveTab}
              setBookData={setBookData}
              setPageData={setPageData}
              setShowModal={setShowModal}
              svgSize={svgSize}
              user={user}
              toast={toast}
            />
          </Flexbox>
        </>
      )}
      {showModal.show && (
        <>
          {showModal.type === "notSignedIn" && (
            <CheckLoginModal setShowModal={setShowModal} />
          )}
          {showModal.type === "signedIn" && (
            <CreateBookModal
              bookData={bookData}
              pageData={pageData}
              productData={productData}
              setBookData={setBookData}
              setShowModal={setShowModal}
              toast={toast}
            />
          )}
          {showModal.type === "template" && (
            <ApplyTemplateModal
              bookData={bookData}
              bookId={bookId}
              canvasPages={canvasPages}
              canvasPageTemplates={canvasPageTemplates}
              pageData={pageData}
              selectedPage={selectedPage}
              selectedPageSvg={selectedPageSvg}
              setCanvasPages={setCanvasPages}
              setCanvasPageTemplates={setCanvasPageTemplates}
              setShowModal={setShowModal}
              toast={toast}
              user={user}
            />
          )}
        </>
      )}
      <ToastContainer
        autoClose={3000}
        closeOnClick
        draggable
        draggablePercent={50}
        hideProgressBar={false}
        icon={false}
        limit={3}
        newestOnTop={false}
        pauseOnFocusLoss
        pauseOnHover
        position="bottom-center"
        rtl={false}
        style={{
          fontFamily: fonts.secondary,
          fontSize: "0.75rem",
        }}
      />
    </>
  )
}

export default Editor
