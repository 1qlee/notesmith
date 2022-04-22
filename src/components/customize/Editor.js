import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import { convertToPx, fonts } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"
import { v4 as uuidv4 } from 'uuid'
import { ToastContainer, toast } from 'react-toastify'
import "../../styles/toastify.css"

import { Flexbox } from "../layout/Flexbox"
import ApplyTemplateModal from "./modals/ApplyTemplateModal"
import Canvas from "./Canvas"
import CheckLoginModal from "./modals/CheckLoginModal"
import Controls from "./Controls"
import CreateBookModal from "./modals/CreateBookModal"
import Functionsbar from "./bars/Functionsbar"
import Loader from "../Loader"
import Pagebar from "./bars/Pagebar"
import Seo from "../layout/Seo"
import Book404 from "./Book404"

const Editor = ({ bookId, productData, productImageData }) => {
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
  const [canvasSize, setCanvasSize] = useState({
    width: 1456,
    height: 919,
  })
  const canvasPageSize = {
    height: 816,
    width: 528,
  }
  const [pageData, setPageData] = useState({
    alignmentHorizontal: "center",
    alignmentVertical: "middle",
    columns: 27,
    lineWidth: bookData.widthPixel - convertToPx(13.335),
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    opacity: 0.5,
    pageHeight: bookData.heightPixel - convertToPx(6.35),
    pageWidth: bookData.widthPixel - convertToPx(13.335),
    rows: 43,
    spacing: 5,
    show: false,
    template: "",
    templateSize: {},
    thickness: 0.175,
    width: 1,
  })
  const [pageContentSize, setPageContentSize] = useState({})
  const [selectedPage, setSelectedPage] = useState(1)
  const [selectedPageSvg, setSelectedPageSvg] = useState("")
  const [canvasPages, setCanvasPages] = useState([])
  const [canvasPageTemplates, setCanvasPageTemplates] = useState({})
  const [noExistingBook, setNoExistingBook] = useState(null)
  const [initializing, setInitializing] = useState(true)

  // creates blank svgs for when the user is not logged in
  function createBlankSvgs() {
    // create a unique id for a blank page
    const blankPageId = uuidv4()
    // create a page object that will be referenced by every page in the demo
    const demoPagesObject = {
      [blankPageId]: `<svg xmlns='http://www.w3.org/2000/svg'><rect width='${pageData.pageWidth}' height='${pageData.pageHeight}' fill='#fff'></rect></svg>`,
    }
    setCanvasPageTemplates(demoPagesObject)
    // blank array holds the svgs
    const pagesArray = []

    // we are using strings so we can use the react-inlinesvg library to render them
    for (let i = 0; i < bookData.numOfPages; i++) {
      // blank white rectangle inside the svg is set to pageSizes' width and height
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
    console.log("editor rendered")
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
      const pagesObject = {} // dummy object to hold pages
      const pagesArray = [] // dummy array to hold all book pages

      // first, query db for all pages that have the same bookId
      await firebaseDb.ref(`pages/`).orderByChild("bookId").equalTo(bookId).once("value").then(snapshot => {
        // loop through each page
        snapshot.forEach(page => {
          const pageValue = page.val()

          // insert into pagesObject with id:svg pair
          pagesObject[pageValue.id] = pageValue.svg
        })
      })

      // loop through bookPages argument which is an object of all pages
      for (const page in bookPages) {
        pagesArray.push(bookPages[page])
      }

      setCanvasPageTemplates(pagesObject) // canvasPageTemplates holds all page svg "templates"
      setCanvasPages(pagesArray) // all canvasPages have a reference to a template
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
    // else we can create blank svgs for users that are not logged in
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

  if (loading) {
    return <Loader />
  }
  if (initializing) {
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
            height="calc(100% - 56px)"
            justifycontent="space-between"
          >
            <Pagebar
              bookData={bookData}
              canvasPages={canvasPages}
              canvasPageTemplates={canvasPageTemplates}
              pageData={pageData}
              selectedPage={selectedPage}
              setPageData={setPageData}
              setSelectedPage={setSelectedPage}
            />
            <Canvas
              bookData={bookData}
              canvasPages={canvasPages}
              canvasPageTemplates={canvasPageTemplates}
              canvasPageSize={canvasPageSize}
              canvasSize={canvasSize}
              pageData={pageData}
              setPageContentSize={setPageContentSize}
              selectedPage={selectedPage}
              setPageData={setPageData}
              setSelectedPageSvg={setSelectedPageSvg}
            />
            <Controls
              bookData={bookData}
              canvasPages={canvasPages}
              canvasPageSize={canvasPageSize}
              pageData={pageData}
              productData={productData}
              productImageData={productImageData}
              pageContentSize={pageContentSize}
              selectedPage={selectedPage}
              setBookData={setBookData}
              setPageData={setPageData}
              setShowModal={setShowModal}
              user={user}
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
        limit={3}
        newestOnTop={false}
        pauseOnFocusLoss
        pauseOnHover
        position="bottom-center"
        rtl={false}
        theme="colored"
        style={{
          fontFamily: fonts.secondary,
          fontSize: "0.75rem",
        }}
      />
    </>
  )
}

export default Editor
