import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { pageDataConfig } from "../../styles/variables"
import { navigate } from "gatsby"
import { pageMargins } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"
import { ref, query, orderByChild, equalTo, get, onValue } from "firebase/database"
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import { isBrowser, convertToMM } from "../../utils/helper-functions"
import { EditorProvider } from "./context/editorContext"

import { Controls } from "./Controls"
import { Flexbox } from "../layout/Flexbox"
import ApplyTemplateModal from "./modals/ApplyTemplateModal"
import Canvas from "./Canvas"
import Functionsbar from "./bars/Functionsbar"
import Toolbar from "./bars/Toolbar"
import Loader from "../misc/Loader"
import Pagebar from "./bars/Pagebar"
import Book404 from "./Book404"
import Seo from "../layout/Seo"

const StyledEditor = styled.div`
  display: flex;
  height: calc(100% - 49px);
  justify-content: space-between;
  width: 100%;
  overflow-y: hidden;
  position: relative;
`

const Editor = ({ 
  bookId, 
  productData, 
  productImages,
}) => {
  const minimumMargin = convertToMM(pageMargins.minimum)
  const { loading, user, firebaseDb } = useFirebaseContext()
  const [showModal, setShowModal] = useState({
    show: false,
    type: "",
  })
  const [bookData, setBookData] = useState({
    coverColor: "",
    title: "",
  })
  // this is basically templateData - when user selects a template, this is the data that is used to create the page
  const [pageData, setPageData] = useState({
    maxContentHeight: productData.heightPixel - pageMargins.vertical,
    maxContentWidth: productData.widthPixel - pageMargins.horizontal,
    ...pageDataConfig
  })
  const [leftPageData, setLeftPageData] = useState({
    dimensions: {
      height: productData.heightPixel - pageMargins.vertical,
      width: productData.widthPixel - pageMargins.horizontal,
      y: minimumMargin,
      x: minimumMargin,
    },
    side: "left",
  })
  const [rightPageData, setRightPageData] = useState({
    dimensions: {
      height: productData.heightPixel - pageMargins.vertical,
      width: productData.widthPixel - pageMargins.horizontal,
      y: minimumMargin,
      x: minimumMargin,
    },
    side: "right",
  })
  const [selectedPage, setSelectedPage] = useState(1)
  const [selectedPageSvg, setSelectedPageSvg] = useState("")
  const [canvasPages, setCanvasPages] = useState([])
  const [canvasPageTemplates, setCanvasPageTemplates] = useState({})
  const [noExistingBook, setNoExistingBook] = useState(null)
  const [initializing, setInitializing] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [max, setMax] = useState({
    rows: 200,
    columns: 200,
  })
  const activePageData = selectedPage % 2 === 0 ? leftPageData : rightPageData
  const setActivePageData = selectedPage % 2 === 0 ? setLeftPageData : setRightPageData

  useEffect(() => {
    // queries db for the book by bookId
    async function getBook() {
      // ref for the book using bookId in the URL
      onValue(ref(firebaseDb, `books/${bookId}`), snapshot => {
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
            setInitializing(false)
            isBrowser() && navigate(`/customize/${productData.slug}`)
          }
        }
        // if the book doesn't exist
        else {
          setNoExistingBook(true)
          setInitializing(false)
        }
      }, { onlyOnce: true })
    }

    // query the db for pages using bookId
    async function getPages(bookPages) {
      const allTemplates = {} // dummy object to hold pages
      const allPages = [] // dummy array to hold all book pages

      // first, query db for all pages that have the same bookId
      await get(query(ref(firebaseDb, `pages/`), orderByChild("bookId"), equalTo(bookId))).then((snapshot) => {
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
            svgHeight: pageValue.svgHeight,
            svgWidth: pageValue.svgWidth,
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

  // creates blank svgs
  const createBlankSvgs = () => {
    // create a unique id for a blank page
    const blankPageId = uuidv4()
    // create a page object id:svg(string) pair
    const demoPagesObject = {
      [blankPageId]: `<svg xmlns='http://www.w3.org/2000/svg'><rect width='${pageData.pageWidth}' height='${pageData.pageHeight}' fill='#fff'></rect></svg>`,
    }
    setCanvasPageTemplates(demoPagesObject)
    // blank array holds the svgs
    const pagesArray = []

    for (let i = 0; i < productData.numOfPages; i++) {
      pagesArray.push({
        pageId: blankPageId,
        pageNumber: i + 1,
      })
    }

    // set canvasPages in state
    setCanvasPages(pagesArray)
    setInitializing(false)
  }

  if (loading || initializing) {
    return <Loader />
  }
  else if (!user) {
    navigate("/signin")
  }
  else return (
    <EditorProvider
      bookDimensions={{
        width: productData.widthPixel,
        height: productData.heightPixel,
      }}
      setSelectedPageSvg={setSelectedPageSvg}
    >
      <Seo
        details={{
          title: `${bookData.title}`,
        }}
      />
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
            toast={toast}
          />
          <StyledEditor>
            <Flexbox>
              <Pagebar
                activeTab={activeTab}
                canvasPageTemplates={canvasPageTemplates}
                canvasPages={canvasPages}
                pageData={pageData}
                productData={productData}
                selectedPage={selectedPage}
                setActiveTab={setActiveTab}
                setPageData={setPageData}
                setSelectedPage={setSelectedPage}
              />
              <Toolbar />
            </Flexbox>
            <Canvas
              canvasPageTemplates={canvasPageTemplates}
              canvasPages={canvasPages}
              leftPageData={leftPageData}
              rightPageData={rightPageData}
              setLeftPageData={setLeftPageData}
              setRightPageData={setRightPageData}
              pageData={pageData}
              productData={productData}
              selectedPage={selectedPage}
              selectedPageSvg={selectedPageSvg}
              setMax={setMax}
              setPageData={setPageData}
              setSelectedPageSvg={setSelectedPageSvg}
            />
            <Controls
              activePageData={activePageData}
              activeTab={activeTab}
              bookData={bookData}
              canvasPages={canvasPages}
              max={max}
              pageData={pageData}
              productData={productData}
              productImages={productImages}
              selectedPageSvg={selectedPageSvg}
              setActivePageData={setActivePageData}
              setActiveTab={setActiveTab}
              setBookData={setBookData}
              setPageData={setPageData}
              setShowModal={setShowModal}
              toast={toast}
              user={user}
            />
          </StyledEditor>
        </>
      )}
      <>
        {(showModal.show && showModal.type === "template") && (
          <ApplyTemplateModal
            bookId={bookId}
            canvasPages={canvasPages}
            canvasPageTemplates={canvasPageTemplates}
            pageData={pageData}
            productData={productData}
            selectedPage={selectedPage}
            selectedPageSvg={selectedPageSvg}
            setCanvasPages={setCanvasPages}
            setCanvasPageTemplates={setCanvasPageTemplates}
            setPageData={setPageData}
            setShowModal={setShowModal}
            toast={toast}
            user={user}
          />
        )}
      </>
    </EditorProvider>
  )
}

export default Editor
