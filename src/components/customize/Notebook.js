import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { navigate, Link } from "gatsby"
import { ArrowRight, WarningCircle, CheckCircle, Circle } from "phosphor-react"
import { colors, convertToDecimal, spacing } from "../../styles/variables"
import { useFirebaseContext } from "../../utils/auth"

import { Container, LayoutContainer } from "../layout/Container"
import { Flexbox } from "../layout/Flexbox"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../ui/Modal"
import { SectionMain, Section, SectionContent } from "../layout/Section"
import { StyledFieldset, StyledLabel, StyledInput, RadioInput } from "../form/FormComponents"
import ApplyTemplateModal from "./Modals/ApplyTemplateModal"
import CheckLoginModal from "./Modals/CheckLoginModal"
import Button from "../Button"
import Content from "../Content"
import Icon from "../Icon"
import Layout from "../layout/Layout"
import Loader from "../Loader"
import Nav from "../layout/Nav"
import Canvas from "./Canvas"
import Controls from "./Controls"
import Functionsbar from "./Bars/Functionsbar"
import Notification from "../ui/Notification"
import Toolbar from "./Bars/Toolbar"
import SEO from "../layout/Seo"

const Notebook = ({ location, bookId }) => {
  const { user, firebaseDb, loading } = useFirebaseContext()
  const booksRef = firebaseDb.ref("books/")
  const [initializing, setInitializing] = useState(true)
  const [showModal, setShowModal] = useState({
    show: false,
    type: "notification"
  })
  const [selectedPage, setSelectedPage] = useState(1)
  const [totalPages, setTotalPages] = useState(48)
  const [book, setBook] = useState()
  const [canvasSize, setCanvasSize] = useState({
    width: 1082,
    height: 716
  })
  const [pageSize, setPageSize] = useState({
    width: 528,
    height: 816
  })
  const [pageData, setPageData] = useState({
    template: "",
    alignmentHorizontal: "center",
    alignmentVertical: "center",
    spacing: 5,
    opacity: 1,
    thickness: 1,
    rows: 43,
    columns: 27,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    width: 1,
    lineWidth: pageSize.width,
    pages: 48,
  })
  const [selectedPageSvg, setSelectedPageSvg] = useState()
  const [canvasPages, setCanvasPages] = useState()

  // creates blank svgs for when the user is not logged in
  function createBlankSvgs() {
    // blank array holds the svgs
    const svgArray = []

    // we are using strings so we can use the react-inlinesvg library to render them
    for (let i = 0; i < [pageData.pages]; i++) {
      // blank white rectangle inside the svg is set to pageSizes' width and height
      svgArray.push(`<svg id="page-${i}" xmlns="http://www.w3.org/2000/svg"><rect width="${pageSize.width}" height="${pageSize.height}" fill="#fff"></rect></svg>`)
    }

    // set canvasPages in state
    setCanvasPages(svgArray)
  }

  function getBook() {
    // ref for the book using bookId in the URL
    firebaseDb.ref(`books/${bookId}`).on("value", snapshot => {
      // if the book exists in the database
      if (snapshot.exists()) {
        // set book in state
        setBook(snapshot.val())
        // set pages in state
        awaitPagesQuery()
      }
      // if the book doesn't exist
      else {
        return navigate(`/customize/notebooks`, { replace: true })
      }
    })
  }

  // query the db for pages using bookId
  async function getPages() {
    firebaseDb.ref(`pages/`).orderByChild('bookId').equalTo(bookId).once("value").then(snapshot => {
      // this array will hold the pages
      const pagesArray = []

      // push each page into pagesArray
      snapshot.forEach(child => {
        pagesArray.push(child.val())
      })

      return pagesArray
    })
  }

  // async function to save getPages result to state
  async function awaitPagesQuery() {
    // await return value from getPages
    const result = await getPages()
    // set state
    setCanvasPages(result)
    // set the first page of the book as the current page
    setSelectedPage(result[0])
    setInitializing(false)
  }

  useEffect(() => {
    setShowModal({
      show: user ? false : true,
      type: "notification",
    })

    // if there is a notebook ID in the URL we know the user is trying to access a specific book in the database
    if (bookId) {
      console.log(bookId)
      // validate the bookId
      getBook()
      // make sure the bookId matches the user

    }
    // if there is no notebook ID, we can assume the user is not logged in and show them the generic layout page
    else {
      console.log("no notebook ID found")
      createBlankSvgs()
      setInitializing(false)
    }
  }, [user, bookId])

  return (
    <>
      {initializing || loading ? (
        <Loader />
      ) : (
        <Layout className="is-full-height">
          <SEO title="Truly Custom Notebooks For All People" />
          <Nav chapterNumber="93" title="Create your own layout" />
          <SectionMain>
            <Container>
              <LayoutContainer>
                <Flexbox
                  flex="flex"
                  height="100%"
                  flexdirection="column"
                  justifycontent="space-between"
                  padding="0"
                >
                  <Functionsbar
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
                    totalPages={totalPages}
                  />
                  <Flexbox
                    flex="flex"
                    height="100%"
                  >
                    <Toolbar />
                    <Canvas
                      canvasPages={canvasPages}
                      canvasSize={canvasSize}
                      pageData={pageData}
                      pageSize={pageSize}
                      selectedPage={selectedPage}
                      setSelectedPageSvg={setSelectedPageSvg}
                      setPageData={setPageData}
                      setPageSize={setPageSize}
                    />
                    <Controls
                      canvasPages={canvasPages}
                      pageData={pageData}
                      pageSize={pageSize}
                      quantity={location.state ? location.state.quantity : 1}
                      selectedPage={selectedPage}
                      setPageData={setPageData}
                      setPageSize={setPageSize}
                      setSelectedPage={setSelectedPage}
                      setShowModal={setShowModal}
                      setInitializing={setInitializing}
                      initializing={initializing}
                    />
                  </Flexbox>
                </Flexbox>
              </LayoutContainer>
            </Container>
          </SectionMain>
          {showModal.show && (
            <>
              {showModal.type === "notification" && (
                <CheckLoginModal setShowModal={setShowModal} />
              )}
              {showModal.type === "template" && (
                <ApplyTemplateModal
                  setCanvasPages={setCanvasPages}
                  canvasPages={canvasPages}
                  setShowModal={setShowModal}
                  selectedPage={selectedPage}
                  selectedPageSvg={selectedPageSvg}
                />
              )}
            </>
          )}
        </Layout>
      )}
    </>
  )
}

export default Notebook
