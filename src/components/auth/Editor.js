import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { navigate } from "gatsby"
import { useFirebaseContext } from "../../utils/auth"
import { colors } from "../../styles/variables"

import "../layout/master.css"
import { Canvas } from "./Editor/Canvas"
import Button from "../Button"
import Loader from "../Loader"
import Menubar from "./Editor/Menubar"
import PagesContainer from "./Editor/PagesContainer"
import SEO from "../layout/Seo"
import Templates from "./Editor/Windows/Templates"
import Toolbar from "./Editor/Toolbar"
import Workspace from "./Editor/Workspace"

const StyledEditor = styled.div`
  background-color: ${colors.gray.eightHundredFifty};
  width: 100%;
  height: 100vh;
  overflow: hidden;
`

const Editor = ({ bookId }) => {
  const isBrowser = typeof window !== "undefined"
  const { firebaseDb } = useFirebaseContext()
  const [book, setBook] = useState()
  const [pages, setPages] = useState()
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState()
  const [showTemplates, setShowTemplates] = useState(false)
  const [svgDOMRef, setSvgDOMRef] = useState()

  useEffect(() => {
    function getBook() {
      // ref for the book using current bookId
      firebaseDb.ref(`books/${bookId}`).on("value", snapshot => {
        if (snapshot.exists()) {
          // set book in state
          setBook(snapshot.val())
          // set pages in state
          awaitPagesQuery()
        }
        else {
          return navigate(`/app/books`, { replace: true })
        }
      })
    }

    // query the db for pages using current bookId
    function getPages() {
      return firebaseDb.ref(`pages/`).orderByChild('bookId').equalTo(bookId).once("value").then(snapshot => {
        const pagesArray = []

        snapshot.forEach(child => {
          pagesArray.push(child.val())
        })

        return pagesArray
      })
    }

    // async function to save getPages result to state
    const awaitPagesQuery = async () => {
      // await return value from getPages
      const result = await getPages()
      // set state
      setPages(result)
      // set the first page of the book as the current page
      setCurrentPage(result[0])
      setLoading(false)
    }

    getBook()
  }, [bookId])

  if (loading) {
    return <Loader />
  }
  else {
    return (
      <StyledEditor>
        <SEO title={book.title} />
        <Menubar />
        <Workspace>
          <Toolbar
            page={currentPage}
            setCurrentPage={setCurrentPage}
            setShowTemplates={setShowTemplates}
          >
            {showTemplates && (
              <Templates
                page={currentPage}
                svgDOMRef={svgDOMRef}
              />
            )}
          </Toolbar>
          <Canvas
            page={currentPage}
            setSvgDOMRef={setSvgDOMRef}
          />
          <PagesContainer
            pages={pages}
            setCurrentPage={setCurrentPage}
          />
        </Workspace>
      </StyledEditor>
    )
  }
}

export default Editor
