import React, { useState, useEffect, memo, useRef } from "react"
import { colors } from "../../../styles/variables"
import { FixedSizeGrid as WindowGrid, areEqual } from "react-window"
import Loading from "../../../assets/loading.svg"
import memoizeOne from "memoize-one"
import styled from "styled-components"
import { useFirebaseContext } from "../../../utils/auth"

import { Flexbox } from "../../layout/Flexbox"
import PageBox from "../barComponents/PageBox"
import Icon from "../../Icon"

const PagebarWrapper = styled.div`
  background-color: ${colors.white};
  border-right: 1px solid ${colors.gray.threeHundred};
  height: 100%;
  width: 164px;
  z-index: 8;
`

const StyledPage = styled.div`
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
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
    border: 1px solid ${colors.gray.threeHundred};
    border-radius: 0.25rem;
    height: 64px;
    pointer-events: none;
    transition: transform 0.2s, border-color 0.2s;
    width: 48px;
  }
  &.is-active {
    p {
      color: ${colors.primary.sixHundred};
      font-weight: 700;
    }
    svg {
      border-color: ${colors.gray.nineHundred};
      transform: translate(1px, 1px);
    }
  }
  &:hover {
    cursor: pointer;
    &:not(.is-active) {
      svg {
        border-color: ${colors.gray.sixHundred};
      }
    }
  }
`

const Page = memo(props => {
  const {
    data,
    columnIndex,
    rowIndex,
    style,
    index,
  } = props
  const {
    canvasPages,
    pageData,
    selectedPage,
    setSelectedPage,
    setPageData,
  } = data
  const columnCount = 2
  // current page based on index of canvasPages
  const currentPage = canvasPages[parseInt(rowIndex * columnCount + columnIndex)]
  const { firebaseDb } = useFirebaseContext()
  const [svgArray, setSvgArray] = useState([])

  // gets the first few elements from the array of svgs
  async function generateSvgPreview(currentPage) {
    const dummyArray = []
    const { pageId, pageNumber } = currentPage

    // db call to get the page with pageId
    await firebaseDb.ref(`pages/${pageId}/svg`).limitToFirst(3).once("value").then(snapshot => {
      // loop through each svg element (up to 10)
      snapshot.forEach(svgElem => {
        const elem = svgElem.val()
        // push svg object into our makeshift array incl. pageNumber prop
        dummyArray.push(elem)
      })
    }).catch(err => {
      console.log(err)
    })

    setSvgArray(dummyArray)
  }

  // change the selected page number
  function handleSelectPage(value) {
    const pageNumber = parseInt(value)
    setPageData({
      ...pageData,
      template: "",
    })
    setSelectedPage(pageNumber)
  }

  useEffect(() => {
    generateSvgPreview(currentPage)
  }, [canvasPages])

  return (
    <StyledPage
      onClick={e => handleSelectPage(currentPage.pageNumber)}
      className={selectedPage === currentPage.pageNumber ? "is-active" : null}
      style={style}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 48 64`}
        x="0"
        y="0"
      >
        {svgArray.map((elem, index) => (
          <React.Fragment key={`${elem.name}-${index}`}>
            {elem.name === "circle" && (
              <circle
                cx={elem.cx}
                cy={elem.cy}
                opacity={elem.opacity}
                fill={elem.fill}
                r={elem.r}
              >
              </circle>
            )}
            {elem.name === "rect" && (
              <rect
                fill={elem.fill}
                width={elem.width}
                height={elem.height}
              >
              </rect>
            )}
            {elem.name === "line" && (
              <line
                fill={elem.fill}
                stroke={elem.stroke}
                strokeWidth={elem.strokeWidth}
                opacity={elem.opacity}
                x1={elem.x1}
                x2={elem.x2}
                y1={elem.y1}
                y2={elem.y2}
              >
              </line>
            )}
          </React.Fragment>
        ))}
      </svg>
      <p>{currentPage.pageNumber}</p>
    </StyledPage>
  )
}, areEqual)

const createItemData = memoizeOne((canvasPages, pageData, selectedPage, setSelectedPage, setPageData) => ({
  canvasPages,
  pageData,
  selectedPage,
  setSelectedPage,
  setPageData,
}))

function Pagebar({
  canvasPages,
  bookData,
  pageData,
  selectedPage,
  setPageData,
  setSelectedPage,
}) {
  const windowRef = useRef(null)
  const itemData = createItemData(canvasPages, pageData, selectedPage, setSelectedPage, setPageData)

  return (
    <PagebarWrapper>
      <PageBox
        bookData={bookData}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
        windowRef={windowRef}
      />
      <WindowGrid
        className="window-grid"
        ref={windowRef}
        useIsScrolling
        columnCount={2}
        columnWidth={64}
        height={871}
        rowCount={70}
        rowHeight={112}
        width={163}
        overscanColumnCount={0}
        overscanRowCount={0}
        style={{
          backgroundColor: 'white',
          borderRadius: "0 0 0.25rem 0.25rem",
          top: "0",
          overflowX: "hidden",
        }}
        itemData={itemData}
      >
        {Page}
      </WindowGrid>
    </PagebarWrapper>
  )
}

export default Pagebar
