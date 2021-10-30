import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import SVG from "react-inlinesvg"

import Ruled from "./Templates/Ruled"
import Dot from "./Templates/Dot"

function CoverPage({ pageData }) {
  return (
    <>
      <rect
        width={pageData.pageWidth}
        height={pageData.pageHeight}
        fill={colors.primary.sixHundred}>
      </rect>
      <text
        x={(pageData.pageWidth / 2) - 21}
        y={pageData.pageHeight / 2}
        width={pageData.pageWidth}
        fill={colors.primary.white}
      >
        COVER
      </text>
    </>
  )
}

function Template({
  currentPageSide,
  setSelectedPageSvg,
  trimmedPageHeight,
  convertedPageWidth,
  pageData,
}) {
  const pageLeftRef = useRef()
  const pageRightRef = useRef()

  useEffect(() => {
    if (currentPageSide === "left") {
      setSelectedPageSvg(pageLeftRef.current)
    }
    else {
      setSelectedPageSvg(pageRightRef.current)
    }
  })

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      ref={currentPageSide === "left" ? pageLeftRef : pageRightRef}
      height={trimmedPageHeight}
      width={convertedPageWidth}
      viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
      x={currentPageSide === "left" ? 1 : convertedPageWidth + 2}
      y="1"
    >
      {pageData.template === "blank" && (
        <g>
          <rect width={pageData.pageWidth} height={pageData.pageHeight} fill={colors.white}></rect>
        </g>
      )}
      {pageData.template === "ruled" && (
        <Ruled pageData={pageData} />
      )}
      {pageData.template === "dot" && (
        <Dot pageData={pageData} />
      )}
    </svg>
  )
}

function PageSpread({
  canvasPages,
  canvasSize,
  pageData,
  bookData,
  selectedPage,
  setPageData,
  setSelectedPageSvg,
}) {
  const [activePage, setActivePage] = useState()
  const [showCover, setShowCover] = useState({
    side: "left",
    show: true
  })
  const [pageSvg, setPageSvg] = useState()
  const [currentPageSide, setCurrentPageSide] = useState()
  const pageLeftRef = useRef()
  const pageRightRef = useRef()
  const trimmedPageHeight = canvasSize.height - 2 // reduced to allow outline to show
  const conversionRatio = trimmedPageHeight / pageData.pageHeight // width conversion ratio
  const convertedPageWidth = pageData.pageWidth * conversionRatio // converted page width
  const pageSpreadWidth = convertedPageWidth * 2 // converted page spread width

  useEffect(() => {
    // show proper cover if necessary
    function showCover() {
      if (selectedPage == 1) {
        setShowCover({
          side: "left",
          show: true
        })
      }
      else if (selectedPage === bookData.numOfPages) {
        setShowCover({
          side: "right",
          show: true
        })
      }
      else {
        setShowCover({
          side: "left",
          show: false
        })
      }
    }

    // if the selected page is even, then it must be the left page
    if (selectedPage % 2 === 0) {
      setCurrentPageSide("left")
    }
    else {
      setCurrentPageSide("right")
    }

    showCover()
  }, [selectedPage, pageData])

  return (
    <svg
      id="page-spread"
      xmlns="http://www.w3.org/2000/svg"
      style={{pointerEvents: "none"}}
      width="100%"
      height={canvasSize.height}
      x={(canvasSize.width - pageSpreadWidth) / 2}
      y="0"
    >
      {showCover.side === "left" && showCover.show ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          ref={pageLeftRef}
          height={canvasSize.height}
          width={convertedPageWidth}
          viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
          x="0"
          y="0"
        >
          <CoverPage pageData={pageData} />
        </svg>
      ) : (
        <>
          {selectedPage % 2 === 0 ? (
            <>
              <svg
                id="page-background-left"
                width={convertedPageWidth}
                height={trimmedPageHeight}
                x="1"
                y="1"
                style={{outline: `1px solid ${colors.primary.sixHundred}`}}
              >
                <rect width={convertedPageWidth} height={trimmedPageHeight} fill={colors.white}></rect>
              </svg>
              {pageData.template ? (
                <Template
                  currentPageSide={currentPageSide}
                  setSelectedPageSvg={setSelectedPageSvg}
                  trimmedPageHeight={trimmedPageHeight}
                  convertedPageWidth={convertedPageWidth}
                  pageData={pageData}
                  pageData={pageData}
                />
              ) : (
                <SVG
                  ref={pageLeftRef}
                  height={trimmedPageHeight}
                  width={convertedPageWidth}
                  viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
                  src={canvasPages[selectedPage - 1]}
                  x="1"
                  y="1"
                />
              )}
            </>
          ) : (
            <>
              <svg
                id="page-background-left"
                width={convertedPageWidth}
                height={trimmedPageHeight}
                x="1"
                y="1"
              >
                <rect width={convertedPageWidth} height={trimmedPageHeight} fill={colors.white}></rect>
              </svg>
              <SVG
                ref={pageLeftRef}
                height={trimmedPageHeight}
                width={convertedPageWidth}
                viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
                src={canvasPages[selectedPage - 2]}
                x="1"
                y="1"
              />
            </>
          )}
        </>
      )}
      {showCover.side === "right" && showCover.show ? (
        <svg
          ref={pageRightRef}
          height={canvasSize.height}
          width={convertedPageWidth + 2}
          viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
          x={convertedPageWidth + 2}
          y="0"
        >
          <CoverPage pageData={pageData} />
        </svg>
      ) : (
        <>
          {selectedPage % 2 !== 0 ? (
            <>
              <svg
                id="page-background-right"
                width={convertedPageWidth}
                height={trimmedPageHeight}
                x={convertedPageWidth + 2}
                y="1"
                style={{outline: `1px solid ${colors.primary.sixHundred}`}}
              >
                <rect width={convertedPageWidth} height={trimmedPageHeight} fill={colors.white}></rect>
              </svg>
              {pageData.template ? (
                <Template
                  currentPageSide={currentPageSide}
                  setSelectedPageSvg={setSelectedPageSvg}
                  trimmedPageHeight={trimmedPageHeight}
                  convertedPageWidth={convertedPageWidth}
                  pageData={pageData}
                  pageData={pageData}
                />
              ) : (
                <SVG
                  ref={pageRightRef}
                  height={trimmedPageHeight}
                  width={convertedPageWidth}
                  viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
                  src={canvasPages[selectedPage - 1]}
                  x={convertedPageWidth + 2}
                  y="1"
                />
              )}
            </>
          ) : (
            <>
              <svg
                id="page-background-right"
                width={convertedPageWidth}
                height={trimmedPageHeight}
                x={convertedPageWidth + 2}
                y="1"
              >
                <rect width={convertedPageWidth} height={trimmedPageHeight} fill={colors.white}></rect>
              </svg>
              <SVG
                ref={pageRightRef}
                height={trimmedPageHeight}
                width={convertedPageWidth}
                viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
                src={canvasPages[selectedPage]}
                x={convertedPageWidth + 2}
                y="1"
              />
            </>
          )}
        </>
      )}
    </svg>
  )
}

export default PageSpread
