import React, { useRef, useEffect } from "react"
import { colors } from "../../../styles/variables"

import Holes from "../pageComponents/Holes"
import Ruled from "../templates/Ruled"
import Dot from "../templates/Dot"
import Graph from "../templates/Graph"
import Blank from "../templates/Blank"
import Hexagon from "../templates/Hexagon"
import Isometric from "../templates/Isometric"

function Template({
  bookData,
  canvasPageSize,
  currentPageSide,
  minimumMargin,
  pageData,
  productPageTemplate,
  rightPageXPosition,
  selectedTemplate,
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
      console.log(currentPage)
      const currentPageSize = currentPage.getBBox()

      setSelectedPageSvg(leftPageRef.current)
      setPageContentSize({
        height: currentPageSize.height,
        width: currentPageSize.width,
      })
    }
    else {
      const currentPage = new Promise((resolve,reject) => {
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
  }, [currentPageSide, pageData, selectedTemplate, leftPageRef, rightPageRef])

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
              pageData={pageData}
              setPageData={setPageData}
              currentPageSide={currentPageSide}
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
              pageData={pageData}
              setPageData={setPageData}
              currentPageSide={currentPageSide}
            />
          )}
        </svg>
      </svg>
    )
  }
  else {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        ref={currentPageSide === "left" ? leftPageRef : rightPageRef}
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
            currentPageSide={currentPageSide}
            pageData={pageData}
            setPageData={setPageData}
          />
        )}
        {pageData.template === "dot" && (
          <Dot
            currentPageSide={currentPageSide}
            pageData={pageData}
            setPageData={setPageData}
          />
        )}
        {pageData.template === "graph" && (
          <Graph
            currentPageSide={currentPageSide}
            pageData={pageData}
            setPageData={setPageData}
          />
        )}
        {pageData.template === "hexagon" && (
          <Hexagon
            currentPageSide={currentPageSide}
            pageData={pageData}
            setPageData={setPageData}
          />
        )}
        {pageData.template === "isometric" && (
          <Isometric
            currentPageSide={currentPageSide}
            pageData={pageData}
            setPageData={setPageData}
          />
        )}
      </svg>
    )
  }
}

export default Template
