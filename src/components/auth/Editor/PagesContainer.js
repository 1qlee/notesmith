import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { colors } from "../../../styles/variables"

const StyledPagesContainer = styled.div`
  background-color: ${colors.gray.eightHundredFifty};
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 1rem;
  width: 110px;
  overflow-y: scroll;
  height: calc(100% - 35px);
  scrollbar-width: thin;
  scrollbar-color: ${colors.gray.sixHundred};
  user-select: none;
  h4 {
    color: ${colors.white};
    text-transform: uppercase;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.gray.sixHundred};
    border-radius: 0.5rem;
  }
  &::-webkit-scrollbar {
    width: 0.25rem;
  }
`

const StyledPage = styled.div`
  text-align: center;
  margin: 0.25rem;
  svg {
    border: 2px solid transparent;
    border-radius: 0.25rem;
    transition: border-color 0.2s;
  }
  &.is-selected {
    svg {
      border-color: ${colors.blue.sixHundred};
    }
  }
  p {
    color: ${colors.white};
    pointer-events: none;
    user-select: none;
  }
`

function Page({ id, className, page, handlePageSelect }) {
  // ref to the page's svg
  const svgRef = useRef()

  useEffect(() => {
    svgRef.current.innerHTML = page.svg
    const svgNode = svgRef.current.childNodes[0]

    svgNode.setAttribute('height', '40')
    svgNode.setAttribute('width', '28')
  })

  return (
    <StyledPage
      id={id}
      className={className}
      onClick={e => handlePageSelect(e, page)}
    >
      <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 40" width="28" height="40"></svg>
      <p>{page.pageNumber}</p>
    </StyledPage>
  )
}

function PagesContainer({ pages, setCurrentPage }) {
  const [selectedPageNumber, setSelectedPageNumber] = useState()
  const [selectedPages, setSelectedPages] = useState([])
  const [selectedPagesDOM, setSelectedPagesDOM] = useState([])

  function handlePageSelect(e, page) {
    const shiftKeyHeld = e.shiftKey
    const ctrlKeyHeld = e.ctrlKey
    // the page that was clicked
    const pageElement = e.currentTarget

    // logic for shift key multi-select
    if (shiftKeyHeld) {
      console.log(`Selecting from page: ${selectedPageNumber} to page: ${page.pageNumber}`)
      // remove styling from any previously selected pages
      selectedPagesDOM.map(selectedPageDOM => {
        selectedPageDOM.classList.remove("is-selected")
      })
      // empty arrays from selected pages state variables
      setSelectedPagesDOM([])
      setSelectedPages([])

      // logic for determining which pages are being selected
      const range1 = Math.min(selectedPageNumber, page.pageNumber) - 1
      const range2 = Math.max(selectedPageNumber, page.pageNumber)
      // the pages that were selected
      const selectedPagesArray = pages.slice(range1, range2)

      // iterate through selected pages, applying styles and saving them to state
      selectedPagesArray.map(page => {
        const { pageNumber } = page
        const pageDOM = document.getElementById(`page-${pageNumber}`)

        pageDOM.classList.add("is-selected")
        setSelectedPagesDOM(array => [...array, pageDOM])
        setSelectedPages(array => [...array, pages[pageNumber - 1]])
      })
    }
    else {
      console.log("Selecting page:", page.pageNumber)
      // remove selected state from any page that might have been previously selected
      if (selectedPageNumber) {
        document.getElementById(`page-${selectedPageNumber}`).classList.remove("is-selected")
      }
      // set new selected page number
      setSelectedPageNumber(parseInt(page.pageNumber))
      selectedPagesDOM.map(selectedPageDOM => {
        selectedPageDOM.classList.remove("is-selected")
      })
      setSelectedPages([])
      // change page svg
      setCurrentPage(page)
      pageElement.classList.add("is-selected")
    }
  }

  return pages ?
    (
      <StyledPagesContainer>
        <h4>Pages</h4>
        <div><p style={{color: 'cyan'}}>{selectedPageNumber}</p></div>
        <div>{selectedPages.map(page => (
          <p style={{color: 'white'}} key={page.id}>{page.pageNumber}</p>
        ))}</div>
        {pages.map(page => (
          <Page
            key={page.pageNumber}
            id={`page-${page.pageNumber}`}
            page={page}
            handlePageSelect={handlePageSelect}
            className={selectedPageNumber === `page-${page.pageNumber}` && 'is-selected'}
          />
        ))}
      </StyledPagesContainer>
    ) : null
}

export default PagesContainer
