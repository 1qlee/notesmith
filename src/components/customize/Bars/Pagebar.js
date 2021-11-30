import React, { useState, memo } from "react"
import memoize from "memoize-one"
import styled from "styled-components"
import { colors } from "../../../styles/variables"
import SVG from "react-inlinesvg"
import Loading from "../../../assets/loading.svg"
import { FixedSizeGrid as WindowGrid, areEqual } from "react-window"

import { Flexbox } from "../../layout/Flexbox"
import Icon from "../../Icon"

const StyledPage = styled.div`
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 0 0.75rem;
  p {
    color: ${colors.gray.sixHundred};
    font-family: "Inter", Helvetica, Tahoma, sans-serif;
    font-size: 0.675rem;
    margin: 0.75rem 0 0 0;
    transition: color 0.2s;
    user-select: none;
  }
  svg {
    box-shadow: 2px 2px 6px rgba(0,0,0,0.07);
    border: 1px solid ${colors.gray.threeHundred};
    border-radius: 0.25rem;
    height: 64px;
    pointer-events: none;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    width: 48px;
  }
  &.is-active {
    p {
      color: ${colors.primary.sixHundred};
      font-weight: 700;
    }
    svg {
      box-shadow: 0 0 0 ${colors.gray.oneHundred};
      border-color: ${colors.gray.nineHundred};
      transform: translate(1px, 1px);
    }
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      svg {
        box-shadow: 1px 1px 1px ${colors.gray.oneHundred};
        border-color: ${colors.gray.sixHundred};
      }
    }
  }
`

const Page = memo((props) => {
  const {
    data,
    columnIndex,
    rowIndex,
    style,
    isScrolling,
    index,
  } = props
  const {
    canvasPages,
    pageData,
    selectedPage,
    setSelectedPage,
    pageNumber,
  } = data
  console.log(index, rowIndex, columnIndex)
  // current page based on index of canvasPages
  const currentPage = canvasPages[rowIndex]
  // change the selected page number
  const handleSelectPage = value => {
    const pageNumber = parseInt(value)
    setSelectedPage(pageNumber)
  }

  return (
    <StyledPage
      onClick={e => handleSelectPage(currentPage.pageNumber)}
      className={selectedPage === currentPage.pageNumber ? "is-active" : null}
      style={style}
    >
      {isScrolling ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
            x="0"
            y="0"
          >
            <rect width={pageData.pageWidth} height={pageData.pageHeight} fill='#fff'></rect>
          </svg>
          <p>{currentPage.pageNumber}</p>
        </>
      ) : (
        <>
          <SVG
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
            src={currentPage.svg}
            x="0"
            y="0"
          />
          <p>{currentPage.pageNumber}</p>
        </>
      )}
    </StyledPage>
  )
}, areEqual)

function Pagebar({
  canvasPages,
  pageData,
  selectedPage,
  setPageData,
  setSelectedPage,
}) {
  const createItemData = memoize((canvasPages, pageData, selectedPage) => ({
    canvasPages,
    pageData,
    selectedPage,
    setSelectedPage,
  }))
  const itemData = createItemData(canvasPages, pageData, selectedPage, setSelectedPage)

  return (
    <WindowGrid
      useIsScrolling
      columnCount={4}
      columnWidth={64}
      height={496}
      rowCount={40}
      rowHeight={112}
      width={300}
      overscanColumnCount={0}
      overscanRowCount={0}
      style={{
        backgroundColor: 'white',
        borderRadius: "0.25rem",
        paddingTop: "1rem",
        boxShadow: colors.shadow.layered,
        border: `1px solid ${colors.primary.sixHundred}`,
        overflowX: "hidden",
      }}
      itemData={itemData}
    >
      {Page}
    </WindowGrid>
  )
}

export default Pagebar
