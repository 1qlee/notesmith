import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import { convertToPx } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"

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
  const [noExistingBook, setNoExistingBook] = useState(null)
  const [initializing, setInitializing] = useState(true)

  // creates blank svgs for when the user is not logged in
  function createBlankSvgs() {
    // blank array holds the svgs
    const pagesArray = []

    // we are using strings so we can use the react-inlinesvg library to render them
    for (let i = 0; i < bookData.numOfPages; i++) {
      // blank white rectangle inside the svg is set to pageSizes' width and height
      pagesArray.push({
        svg: {
          name: "rect",
          height: pageData.pageHeight,
          width: pageData.pageWidth,
          fill: "#fff",
        },
        pageNumber: i + 1,
      })
    }

    // set canvasPages in state
    setCanvasPages(pagesArray)
    setInitializing(false)
  }

  useEffect(() => {
    console.log("editor rendered")
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
            getPages(bookVals.pages)
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
    async function getPages(bookPages) {
      // this array will hold the pages
      const pagesArray = []
      // keep track of index
      let pageIndex = 1

      // loop through each page in bookPages object using the pageId key
      for (const pageId in bookPages) {
        const pageObject = {
          pageId: pageId,
          pageNumber: pageIndex,
        }

        pagesArray.push(pageObject)
        pageIndex++
      }
      // set pages in state
      setCanvasPages(pagesArray)
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
              pageData={pageData}
              selectedPage={selectedPage}
              setPageData={setPageData}
              setSelectedPage={setSelectedPage}
            />
            <Canvas
              bookData={bookData}
              canvasPages={canvasPages}
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
              selectedPageSvg={selectedPageSvg}
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
              user={user}
            />
          )}
        </>
      )}
    </>
  )
}

export default Editor
