import React, { useRef, useEffect } from "react"

import Holes from "../pageComponents/Holes"
import Ruled from "../templates/Ruled"
import Dot from "../templates/Dot"
import Graph from "../templates/Graph"
import Blank from "../templates/Blank"

function Template({
  bookData,
  canvasPageSize,
  currentPageSide,
  minimumMargin,
  pageData,
  productPageTemplate,
  rightPageXPosition,
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
      setSelectedPageSvg(leftPageRef.current)
      console.log(leftPageRef.current.getBoundingClientRect().height)
      setPageContentSize({
        height: leftPageRef.current.getBoundingClientRect().height,
        width: leftPageRef.current.getBoundingClientRect().width,
      })
    }
    else {
      setSelectedPageSvg(rightPageRef.current)
      console.log(rightPageRef.current.getBoundingClientRect().height)
      setPageContentSize({
        height: rightPageRef.current.getBoundingClientRect().height,
        width: rightPageRef.current.getBoundingClientRect().width,
      })
    }
  }, [currentPageSide, pageData])

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
          >
          </rect>
          <Holes currentPageSide={currentPageSide} canvasPageSize={canvasPageSize} />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          ref={currentPageSide === "left" ? leftPageRef : rightPageRef}
          id={currentPageSide === "left" ? "left-side-page" : "right-side-page"}
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
        </svg>
      </svg>
    )
  }
  else {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        ref={currentPageSide === "left" ? leftPageRef : rightPageRef}
        id={currentPageSide === "left" ? "left-side-page" : "right-side-page"}
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
      </svg>
    )
  }
}

export default Template
