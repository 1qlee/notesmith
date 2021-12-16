import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { colors, convertToPx } from "../../styles/variables"
import SVG from "react-inlinesvg"

import Ruled from "./Templates/Ruled"
import Dot from "./Templates/Dot"
import Graph from "./Templates/Graph"
import Blank from "./Templates/Blank"

function CoverPage({ bookData, convertedPageWidth, convertedPageHeight }) {
  return (
    <>
      <rect
        width={convertedPageWidth}
        height={convertedPageHeight}
        fill={colors.white}>
      </rect>
      <text
        x={(bookData.width / 2) - 80}
        y={bookData.height / 2}
        width={bookData.width}
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
  setEvenPageSvg,
  setOddPageSvg,
  setPageData,
  setSelectedPageSvg,
  trimmedPageHeight,
  trimmedPageWidth,
  rightPageXPosition,
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
      width={trimmedPageWidth}
      viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
      x={currentPageSide === "left" ? 1 : rightPageXPosition}
      y="1"
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
  setEvenPageSvg,
  setOddPageSvg,
}) {
  const [pageSvg, setPageSvg] = useState()
  const [currentPageSide, setCurrentPageSide] = useState("right")
  const pageLeftRef = useRef()
  const pageRightRef = useRef()
  const trimmedPageHeight = canvasSize.height - convertToPx(6.35) // minus top and bottom margins
  const conversionRatio = trimmedPageHeight / bookData.height // width conversion ratio
  const convertedPageWidth = bookData.width * conversionRatio // converted page width
  const convertedPageHeight = canvasSize.height - 2 // 2 for outline
  const rightPageXPosition = convertedPageWidth + convertToPx(9.525)
  const trimmedPageWidth = convertedPageWidth - convertToPx(12.7) // minus left and right margins
  const pageSpreadWidth = convertedPageWidth * 2 // converted page spread width

  function Holes({ pageSide }) {
    const [holes, setHoles] = useState([])

    function generateHoles() {
      const numOfHoles = pageData.pageHeight / 34.845 + 1
      const holesArray = []
      // for loop to generate appropriate number of holes for the page height
      for (let i = 0; i < numOfHoles; i++) {
        // hole property object
        const hole = {
          width: 15,
          height: 15,
          fill: colors.gray.oneHundred,
          strokeWidth: 1,
          stroke: colors.gray.threeHundred,
          x: pageSide === "right" ? 9.45 : 492 * conversionRatio,
          y: 28.23 * i + 13.23
        }

        holesArray.push(hole)
      }

      setHoles(holesArray)
    }

    useEffect(() => {
      generateHoles()
    }, [pageData])

    return (
      <>
        {holes.map(hole => (
          <rect
            width={hole.width}
            height={hole.height}
            fill={hole.fill}
            stroke-width={hole.strokeWidth}
            stroke={hole.stroke}
            x={hole.x}
            y={hole.y}
          >
          </rect>
        ))}
      </>
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
      style={{pointerEvents: "none"}}
      width="100%"
      height={canvasSize.height}
      x={(canvasSize.width - pageSpreadWidth) / 2}
      y="0"
    >
      {selectedPage === 1 ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          ref={pageLeftRef}
          height={convertedPageHeight}
          width={convertedPageWidth}
          viewBox={`0 0 ${convertedPageWidth} ${convertedPageHeight}`}
          x="0"
          y="0"
        >
          <CoverPage
            bookData={bookData}
            convertedPageWidth={convertedPageWidth}
            convertedPageHeight={convertedPageHeight}
          />
        </svg>
      ) : (
        <>
          {currentPageSide === "left" ? (
            <>
              <svg
                id="page-background-left"
                width={convertedPageWidth}
                height={convertedPageHeight}
                x="1"
                y="1"
                style={{outline: `1px solid ${colors.primary.sixHundred}`}}
              >
                <rect width={convertedPageWidth} height={convertedPageHeight} fill={colors.white}></rect>
                <Holes pageSide="left" />
              </svg>
              {pageData.template ? (
                <Template
                  bookData={bookData}
                  currentPageSide={currentPageSide}
                  pageData={pageData}
                  rightPageXPosition={rightPageXPosition}
                  setEvenPageSvg={setEvenPageSvg}
                  setOddPageSvg={setOddPageSvg}
                  setPageData={setPageData}
                  setSelectedPageSvg={setSelectedPageSvg}
                  trimmedPageHeight={trimmedPageHeight}
                  trimmedPageWidth={trimmedPageWidth}
                />
              ) : (
                <SVG
                  ref={pageLeftRef}
                  height={trimmedPageHeight}
                  width={trimmedPageWidth}
                  viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
                  src={canvasPages[selectedPage - 1].svg}
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
                height={convertedPageHeight}
                x="1"
                y="1"
              >
                <rect width={convertedPageWidth} height={convertedPageHeight} fill={colors.white}></rect>
                <Holes pageSide="left" />
              </svg>
              <SVG
                ref={pageLeftRef}
                height={trimmedPageHeight}
                width={trimmedPageWidth}
                viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
                src={canvasPages[selectedPage - 2].svg}
                x="1"
                y="1"
              />
            </>
          )}
        </>
      )}
      {selectedPage === bookData.numOfPages ? (
        <svg
          ref={pageRightRef}
          height={canvasSize.height}
          width={convertedPageWidth + 2}
          viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
          x={convertedPageWidth + 2}
          y="0"
        >
          <CoverPage bookData={bookData} />
        </svg>
      ) : (
        <>
          {currentPageSide === "right" ? (
            <>
              <svg
                id="page-background-right"
                width={convertedPageWidth}
                height={convertedPageHeight}
                x={convertedPageWidth + 2}
                y="1"
                style={{outline: `1px solid ${colors.primary.sixHundred}`}}
              >
                <rect width={convertedPageWidth} height={convertedPageHeight} fill={colors.white}></rect>
                <Holes pageSide="right" />
              </svg>
              {pageData.template ? (
                <Template
                  bookData={bookData}
                  currentPageSide={currentPageSide}
                  pageData={pageData}
                  rightPageXPosition={rightPageXPosition}
                  setEvenPageSvg={setEvenPageSvg}
                  setOddPageSvg={setOddPageSvg}
                  setPageData={setPageData}
                  setSelectedPageSvg={setSelectedPageSvg}
                  trimmedPageHeight={trimmedPageHeight}
                  trimmedPageWidth={trimmedPageWidth}
                />
              ) : (
                <SVG
                  ref={pageRightRef}
                  height={trimmedPageHeight}
                  width={trimmedPageWidth}
                  viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
                  src={canvasPages[selectedPage - 1].svg}
                  x={rightPageXPosition}
                  y="1"
                />
              )}
            </>
          ) : (
            <>
              <svg
                id="page-background-right"
                width={convertedPageWidth}
                height={convertedPageHeight}
                x={convertedPageWidth + 2}
                y="1"
              >
                <rect width={convertedPageWidth} height={convertedPageHeight} fill={colors.white}></rect>
                <Holes pageSide="right" />
              </svg>
              <SVG
                ref={pageRightRef}
                height={trimmedPageHeight}
                width={trimmedPageWidth}
                viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
                src={canvasPages[selectedPage].svg}
                x={rightPageXPosition}
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
