import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import { convertToPx } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"

import { Flexbox } from "../layout/Flexbox"
import ApplyTemplateModal from "./Modals/ApplyTemplateModal"
import Canvas from "./Canvas"
import CheckLoginModal from "./Modals/CheckLoginModal"
import Controls from "./Controls"
import CreateBookModal from "./Modals/CreateBookModal"
import Functionsbar from "./Bars/Functionsbar"
import Loader from "../Loader"
import Pagebar from "./Bars/Pagebar"
import Seo from "../layout/Seo"
import Book404 from "./Book404"

const Editor = ({ bookId, productData, productImageData }) => {
  const { loading, user, firebaseDb } = useFirebaseContext()
  const [showModal, setShowModal] = useState({
    show: false,
    type: "",
  })
  const [selectedPage, setSelectedPage] = useState(1)
  const [bookData, setBookData] = useState({
    ...productData,
    coverColor: "",
    title: "",
  })
  const [canvasSize, setCanvasSize] = useState({
    width: 1456,
    height: 919,
  })
  const [pageData, setPageData] = useState({
    alignmentHorizontal: "center",
    alignmentVertical: "middle",
    columns: 27,
    lineWidth: bookData.widthPixel - convertToPx(12.7),
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    opacity: 0.5,
    pageHeight: bookData.heightPixel - convertToPx(6.35),
    pageWidth: bookData.widthPixel - convertToPx(12.7),
    rows: 43,
    spacing: 5,
    template: "",
    templateSize: {},
    thickness: 0.175,
    width: 1,
  })
  const [selectedPageSvg, setSelectedPageSvg] = useState("")
  const [canvasPages, setCanvasPages] = useState([])
  const [noExistingBook, setNoExistingBook] = useState(null)
  const [initializing, setInitializing] = useState(true)

  // creates blank svgs for when the user is not logged in
  function createBlankSvgs() {
    // blank array holds the svgs
    const svgArray = []

    // we are using strings so we can use the react-inlinesvg library to render them
    for (let i = 0; i < bookData.numOfPages; i++) {
      // blank white rectangle inside the svg is set to pageSizes' width and height
      svgArray.push({
        svg: `<svg id='page-${i}' xmlns='http://www.w3.org/2000/svg'><rect width='${pageData.pageWidth}' height='${pageData.pageHeight}' fill='#fff'></rect></svg>`,
        id: i,
        pageNumber: i + 1, // index starts at 0
        bookId: "invalid",
      })
    }

    // set canvasPages in state
    setCanvasPages(svgArray)
    setInitializing(false)
  }

  useEffect(() => {
    function getBook() {
      // ref for the book using bookId in the URL
      firebaseDb.ref(`books/${bookId}`).on("value", snapshot => {
        // if the book exists in the database
        if (snapshot.exists()) {
          const bookVals = snapshot.val()

          // validate that this book belongs to the current user
          if (user.uid === snapshot.val().uid) {
            // if the user uid and book uid match
            // set book in state
            setBookData(bookVals)
            // set pages in state
            getPages(bookVals.id)
          }
          else {
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
    function getPages(id) {
      firebaseDb.ref(`pages/`).orderByChild('bookId').equalTo(id).once("value").then(snapshot => {
        // this array will hold the pages
        const pagesArray = []

        // push each page into pagesArray
        snapshot.forEach(child => {
          const page = child.val()

          pagesArray.push({
            svg: page.svg,
            id: page.id,
            pageNumber: page.pageNumber,
            bookId: page.bookId,
          })
        })

        setCanvasPages(pagesArray)
      }).then(() => {
        setInitializing(false)
      }).catch(error => {
        console.log(error)
        setInitializing(false)
      })
    }

    // first check if there is a user logged in because
    // users that are not logged in should not be able to access bookId's
    if (user && !loading) {
      // if there is a notebook ID in the URL we know the user is trying to access a specific book in the database
      // wait for all loading states to clear before calling getBook
      if (bookId && !loading) {
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
      createBlankSvgs()
      // show modal based on sign-in status
      setShowModal({
        show: user ? false : true,
        type: "notSignedIn",
      })
    }

  }, [loading, user, initializing, bookId, selectedPageSvg, pageData])

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
            height="calc(100% - 56px)"
            justifycontent="space-between"
          >
            <Pagebar
              canvasPages={canvasPages}
              pageData={pageData}
              bookData={bookData}
              selectedPage={selectedPage}
              setPageData={setPageData}
              setSelectedPage={setSelectedPage}
            />
            <Canvas
              canvasPages={canvasPages}
              canvasSize={canvasSize}
              bookData={bookData}
              pageData={pageData}
              selectedPage={selectedPage}
              setSelectedPageSvg={setSelectedPageSvg}
              setPageData={setPageData}
            />
            <Controls
              bookData={bookData}
              canvasPages={canvasPages}
              pageData={pageData}
              productData={productData}
              productImageData={productImageData}
              selectedPage={selectedPage}
              selectedPageSvg={selectedPageSvg}
              setBookData={setBookData}
              setPageData={setPageData}
              setSelectedPage={setSelectedPage}
              setShowModal={setShowModal}
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
              setShowModal={setShowModal}
              bookData={bookData}
              pageData={pageData}
              setBookData={setBookData}
              productData={productData}
            />
          )}
          {showModal.type === "template" && (
            <ApplyTemplateModal
              bookId={bookId}
              bookData={bookData}
              pageData={pageData}
              setCanvasPages={setCanvasPages}
              canvasPages={canvasPages}
              setShowModal={setShowModal}
              selectedPage={selectedPage}
              selectedPageSvg={selectedPageSvg}
            />
          )}
        </>
      )}
    </>
  )
}

export default Editor
