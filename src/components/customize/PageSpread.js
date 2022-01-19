import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { colors, convertToPx } from "../../styles/variables"
import SVG from "react-inlinesvg"

import Ruled from "./Templates/Ruled"
import Dot from "./Templates/Dot"
import Graph from "./Templates/Graph"
import Blank from "./Templates/Blank"

function CoverPage({ bookData, canvasPageWidth, canvasPageHeight }) {
  return (
    <>
      <rect
        width={canvasPageWidth}
        height={canvasPageHeight}
        fill={colors.white}>
      </rect>
      <text
        x={(bookData.widthPixel / 2) - 80}
        y={bookData.heightPixel / 2}
        width={bookData.widthPixel}
        fill={colors.gray.nineHundred}
      >
        THIS IS THE COVER PAGE
      </text>
    </>
  )
}

function Template({
  bookData,
  currentPageSide,
  pageData,
  setPageData,
  setSelectedPageSvg,
  workingPageHeight,
  workingPageWidth,
  rightPageXPosition,
  minimumMargin,
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
      height={workingPageHeight}
      width={workingPageWidth}
      viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
      x={currentPageSide === "left" ? minimumMargin : rightPageXPosition}
      y={minimumMargin}
    >
      {pageData.template === "blank" && (
        <Blank
          pageData={pageData}
          currentPageSide={currentPageSide}
        />
      )}
      {pageData.template === "ruled" && (
        <Ruled
          pageData={pageData}
          setPageData={setPageData}
          currentPageSide={currentPageSide}
        />
      )}
      {pageData.template === "dot" && (
        <Dot
          pageData={pageData}
          setPageData={setPageData}
          currentPageSide={currentPageSide}
        />
      )}
      {pageData.template === "graph" && (
        <Graph
          pageData={pageData}
          setPageData={setPageData}
          currentPageSide={currentPageSide}
        />
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
  const [pageSvg, setPageSvg] = useState()
  const [currentPageSide, setCurrentPageSide] = useState("right")
  const pageLeftRef = useRef()
  const pageRightRef = useRef()
  const canvasPageWidth = bookData.widthPixel
  const canvasPageHeight = bookData.heightPixel
  const minimumMargin = convertToPx(3.175)
  const leftPageXPosition = minimumMargin
  const rightPageXPosition = canvasPageWidth + convertToPx(9.525)
  const pageSpreadWidth = canvasPageWidth * 2 // converted page spread width
  // the parts of the page that can be manipulated
  const workingPageHeight = canvasPageHeight - convertToPx(6.35) // minus top and bottom margins
  const workingPageWidth = canvasPageWidth - convertToPx(12.7) // minus left and right margins

  function Holes({ pageSide }) {
    const [holes, setHoles] = useState([])

    function generateHoles() {
      const holesArray = []
      const numOfHoles = (canvasPageHeight - 26) / 26 // page height minus the size of one hole incl margin divided by that same value
      const leftHolesXPosition = canvasPageWidth - 26
      const rightHolesXPosition = 10
      // for loop to generate appropriate number of holes for the page height
      for (let i = 0; i < numOfHoles; i++) {
        // hole property object
        const hole = {
          width: 16,
          height: 16,
          fill: colors.gray.oneHundred,
          strokeWidth: 1,
          stroke: colors.gray.threeHundred,
          x: pageSide === "left" ? leftHolesXPosition : rightHolesXPosition,
          y: 26 * i + 10
        }

        holesArray.push(hole)
      }

      setHoles(holesArray)
    }

    useEffect(() => {
      generateHoles()
    }, [pageData])

    return (
      <g>
        {holes.map((hole, index) => (
          <rect
            key={`hole-${index}`}
            width={hole.width}
            height={hole.height}
            fill={hole.fill}
            x={hole.x}
            y={hole.y}
          >
          </rect>
        ))}
      </g>
    )
  }

  useEffect(() => {
    // if the selected page is even, then it must be the left page
    if (selectedPage % 2 === 0) {
      setCurrentPageSide("left")
    }
    else {
      setCurrentPageSide("right")
    }
  }, [selectedPage, pageData, currentPageSide])

  return (
    <svg
      id="page-spread"
      xmlns="http://www.w3.org/2000/svg"
      width={canvasSize.width}
      height={canvasSize.height}
      x={(canvasSize.width - pageSpreadWidth) / 2}
      y={(canvasSize.height - canvasPageHeight) / 2}
    >
      {selectedPage === 1 ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          ref={pageLeftRef}
          height={canvasPageHeight}
          width={canvasPageWidth}
          viewBox={`0 0 ${canvasPageWidth} ${canvasPageHeight}`}
          x="0"
          y="0"
        >
          <CoverPage
            bookData={bookData}
            canvasPageWidth={canvasPageWidth}
            canvasPageHeight={canvasPageHeight}
          />
        </svg>
      ) : (
        <>
          {currentPageSide === "left" ? (
            <>
              <svg
                id="page-background-left"
                width={canvasPageWidth}
                height={canvasPageHeight}
                x="1"
                y="1"
                style={{outline: `1px solid ${colors.primary.sixHundred}`}}
              >
                <rect width={canvasPageWidth} height={canvasPageHeight - 2} fill={colors.white}></rect>
                <Holes pageSide="left" />
              </svg>
              {pageData.template ? (
                <Template
                  bookData={bookData}
                  currentPageSide={currentPageSide}
                  pageData={pageData}
                  rightPageXPosition={rightPageXPosition}
                  setPageData={setPageData}
                  setSelectedPageSvg={setSelectedPageSvg}
                  workingPageHeight={workingPageHeight}
                  workingPageWidth={workingPageWidth}
                  minimumMargin={minimumMargin}
                />
              ) : (
                <SVG
                  ref={pageLeftRef}
                  height={workingPageHeight}
                  width={workingPageWidth}
                  viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
                  src={canvasPages[selectedPage - 1].svg}
                  x={minimumMargin}
                  y={minimumMargin}
                />
              )}
            </>
          ) : (
            <>
              <svg
                id="page-background-left"
                width={canvasPageWidth}
                height={canvasPageHeight}
                x="1"
                y="1"
              >
                <rect width={canvasPageWidth} height={canvasPageHeight} fill={colors.white}></rect>
                <Holes pageSide="left" />
              </svg>
              <SVG
                ref={pageLeftRef}
                height={workingPageHeight}
                width={workingPageWidth}
                viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
                src={canvasPages[selectedPage - 2].svg}
                x={minimumMargin}
                y={minimumMargin}
              />
            </>
          )}
        </>
      )}
      {selectedPage === bookData.numOfPages ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          ref={pageLeftRef}
          height={canvasPageHeight}
          width={canvasPageWidth}
          viewBox={`0 0 ${canvasPageWidth} ${canvasPageHeight}`}
          x={canvasPageWidth + 2}
          y="0"
        >
          <CoverPage
            bookData={bookData}
            canvasPageWidth={canvasPageWidth}
            canvasPageHeight={canvasPageHeight}
          />
        </svg>
      ) : (
        <>
          {currentPageSide === "right" ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="page-background-right"
                width={canvasPageWidth}
                height={canvasPageHeight}
                x={canvasPageWidth + 2}
                y="1"
                style={{outline: `1px solid ${colors.primary.sixHundred}`}}
              >
                <rect width={canvasPageWidth - 3} height={canvasPageHeight - 2} fill={colors.white}></rect>
                <Holes pageSide="right" />
              </svg>
              {pageData.template ? (
                <Template
                  bookData={bookData}
                  currentPageSide={currentPageSide}
                  pageData={pageData}
                  rightPageXPosition={rightPageXPosition}
                  setPageData={setPageData}
                  setSelectedPageSvg={setSelectedPageSvg}
                  workingPageHeight={workingPageHeight}
                  workingPageWidth={workingPageWidth}
                  minimumMargin={minimumMargin}
                />
              ) : (
                <SVG
                  ref={pageRightRef}
                  height={workingPageHeight}
                  width={workingPageWidth}
                  viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
                  src={canvasPages[selectedPage - 1].svg}
                  x={rightPageXPosition}
                  y={minimumMargin}
                />
              )}
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="page-background-right"
                width={canvasPageWidth}
                height={canvasPageHeight}
                x={canvasPageWidth + 2}
                y="1"
              >
                <rect width={canvasPageWidth - 3} height={canvasPageHeight - 2} fill={colors.white}></rect>
                <Holes pageSide="right" />
              </svg>
              <SVG
                ref={pageRightRef}
                height={workingPageHeight}
                width={workingPageWidth}
                viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
                src={canvasPages[selectedPage].svg}
                x={rightPageXPosition}
                y={minimumMargin}
              />
            </>
          )}
        </>
      )}
    </svg>
  )
}

export default PageSpread
