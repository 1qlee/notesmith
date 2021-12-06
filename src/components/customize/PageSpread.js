import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { colors } from "../../styles/variables"
import SVG from "react-inlinesvg"

import Ruled from "./Templates/Ruled"
import Dot from "./Templates/Dot"
import Graph from "./Templates/Graph"

function CoverPage({ pageData }) {
  return (
    <>
      <rect
        width={pageData.pageWidth}
        height={pageData.pageHeight}
        fill={colors.white}>
      </rect>
      <text
        x={(pageData.pageWidth / 2) - 80}
        y={pageData.pageHeight / 2}
        width={pageData.pageWidth}
        fill={colors.gray.nineHundred}
      >
        THIS IS THE COVER PAGE
      </text>
    </>
  )
}

function WireHoles(numOfHoles) {
  return (
    <>
      <rect
        width="15"
        height="15"
        fill={colors.gray.threeHundred}
        stroke-width="1"
        stroke={colors.gray.sixHundred}
        x="9.45"
        y="13.23"
      >
      </rect>
    </>
  )
}

function Template({
  convertedPageWidth,
  currentPageSide,
  pageData,
  setEvenPageSvg,
  setOddPageSvg,
  setPageData,
  setSelectedPageSvg,
  trimmedPageHeight,
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
  const [holes, setHoles] = useState([])
  const pageLeftRef = useRef()
  const pageRightRef = useRef()
  const trimmedPageHeight = canvasSize.height - 2 // reduced to allow outline to show
  const conversionRatio = trimmedPageHeight / pageData.pageHeight // width conversion ratio
  const convertedPageWidth = pageData.pageWidth * conversionRatio // converted page width
  const pageSpreadWidth = convertedPageWidth * 2 // converted page spread width

  useEffect(() => {
    // if the selected page is even, then it must be the left page
    if (selectedPage % 2 === 0) {
      setCurrentPageSide("left")
    }
    else {
      setCurrentPageSide("right")
    }

    generateHoles()
  }, [selectedPage, pageData, currentPageSide])

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
        x: currentPageSide === "right" ? 9.45 : 492 * conversionRatio,
        y: 28.23 * i + 13.23
      }

      holesArray.push(hole)
    }

    setHoles(holesArray)
  }

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
          {currentPageSide === "left"? (
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
              </svg>
              {pageData.template ? (
                <Template
                  convertedPageWidth={convertedPageWidth}
                  currentPageSide={currentPageSide}
                  pageData={pageData}
                  setEvenPageSvg={setEvenPageSvg}
                  setOddPageSvg={setOddPageSvg}
                  setPageData={setPageData}
                  setSelectedPageSvg={setSelectedPageSvg}
                  trimmedPageHeight={trimmedPageHeight}
                />
              ) : (
                <SVG
                  ref={pageLeftRef}
                  height={trimmedPageHeight}
                  width={convertedPageWidth}
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
          <CoverPage pageData={pageData} />
        </svg>
      ) : (
        <>
          {currentPageSide === "right" ? (
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
              </svg>
              {pageData.template ? (
                <Template
                  convertedPageWidth={convertedPageWidth}
                  currentPageSide={currentPageSide}
                  pageData={pageData}
                  setEvenPageSvg={setEvenPageSvg}
                  setOddPageSvg={setOddPageSvg}
                  setPageData={setPageData}
                  setSelectedPageSvg={setSelectedPageSvg}
                  trimmedPageHeight={trimmedPageHeight}
                />
              ) : (
                <SVG
                  ref={pageRightRef}
                  height={trimmedPageHeight}
                  width={convertedPageWidth}
                  viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
                  src={canvasPages[selectedPage - 1].svg}
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
                src={canvasPages[selectedPage].svg}
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
