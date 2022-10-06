import React, { useRef, useEffect } from "react"
import { colors } from "../../../styles/variables"

import Holes from "../pageComponents/Holes"
import Ruled from "../templates/Ruled"
import Dot from "../templates/Dot"
import Graph from "../templates/Graph"
import Blank from "../templates/Blank"
import Hexagon from "../templates/Hexagon"
import Isometric from "../templates/Isometric"
import Seyes from "../templates/Seyes"
import Music from "../templates/Music"
import Handwriting from "../templates/Handwriting"
import CrossGrid from "../templates/CrossGrid"
import Calligraphy from "../templates/Calligraphy"

function ProductTemplate({
  borderData,
  canvasPageSize,
  currentPageSide,
  dashedLineData,
  pageData,
  setPageData,
  setPageContentSize,
  setSelectedPageSvg,
  workingPageHeight,
  workingPageWidth,
}) {
  const leftPageRef = useRef()
  const rightPageRef = useRef()

  useEffect(() => {
    if (currentPageSide === "left") {
      const currentPage = leftPageRef.current
      const currentPageSize = currentPage.getBBox()

      setSelectedPageSvg(leftPageRef.current)
      setPageContentSize({
        height: currentPageSize.height,
        width: currentPageSize.width,
      })
    }
    else {
      new Promise((resolve, reject) => {
        resolve(rightPageRef.current)
      }).then(response => {
        const currentPageSize = response.getBBox()

        setSelectedPageSvg(response.current)
        setPageContentSize({
          height: currentPageSize.height,
          width: currentPageSize.width,
        })
      })
    }
  }, [currentPageSide, pageData, leftPageRef, rightPageRef])

  if (pageData.show) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={canvasPageSize.height}
        width={canvasPageSize.width}
        x="0"
        y="0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height={canvasPageSize.height}
          width={canvasPageSize.width}
          x="0"
          y="0"
        >
          <rect
            height={canvasPageSize.height}
            width={canvasPageSize.width}
            fill="#fff"
            stroke={colors.gray.threeHundred}
            strokeWidth="2px"
          >
          </rect>
          <Holes currentPageSide={currentPageSide} canvasPageSize={canvasPageSize} />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          ref={currentPageSide === "left" ? leftPageRef : rightPageRef}
          height={workingPageHeight}
          width={workingPageWidth}
          viewBox={`0 0 ${pageData.pageWidth} ${pageData.pageHeight}`}
          x={currentPageSide === "left" ? 12 : 38.4}
          y="12"
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
              borderData={borderData}
              currentPageSide={currentPageSide}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "hexagon" && (
            <Hexagon
              pageData={pageData}
              setPageData={setPageData}
              currentPageSide={currentPageSide}
            />
          )}
          {pageData.template === "isometric" && (
            <Isometric
              borderData={borderData}
              currentPageSide={currentPageSide}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "seyes" && (
            <Seyes
              currentPageSide={currentPageSide}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "music" && (
            <Music
              currentPageSide={currentPageSide}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "handwriting" && (
            <Handwriting
              dashedLineData={dashedLineData}
              currentPageSide={currentPageSide}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "cross" && (
            <CrossGrid
              dashedLineData={dashedLineData}
              currentPageSide={currentPageSide}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
          {pageData.template === "calligraphy" && (
            <Calligraphy
              dashedLineData={dashedLineData}
              currentPageSide={currentPageSide}
              pageData={pageData}
              setPageData={setPageData}
            />
          )}
        </svg>
      </svg>
    )
  }
}

export default ProductTemplate